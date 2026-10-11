import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getCourse } from "../courses";
import { applyLessonCompletion } from "../lib/gamification";
import { loadProgress, saveProgress } from "../lib/progressStore";
import { EMPTY_PROGRESS, type UserProgress } from "../types/user";
import { useAuth } from "./useAuth";

interface ProgressContextValue {
  progress: UserProgress;
  loading: boolean;
  completeLesson: (
    courseId: string,
    lessonId: string,
    xpReward: number,
  ) => Promise<UserProgress>;
  resetCourseProgress: (courseId: string) => Promise<UserProgress>;
  resetLessonsProgress: (
    courseId: string,
    lessonIds: string[],
  ) => Promise<UserProgress>;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

/**
 * Contesto condiviso (non un semplice hook locale) perché sia la NavBar
 * (badge XP/streak) sia il player della lezione devono leggere e aggiornare
 * lo stesso stato di progresso in tempo reale.
 */
export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<UserProgress>(EMPTY_PROGRESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setLoading(true);
    loadProgress(user?.uid ?? null).then((loaded) => {
      if (!cancelled) {
        setProgress(loaded);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user?.uid, authLoading]);

  const completeLesson = useCallback(
    async (courseId: string, lessonId: string, xpReward: number) => {
      const updated = applyLessonCompletion(
        progress,
        courseId,
        lessonId,
        xpReward,
      );
      setProgress(updated);
      await saveProgress(user?.uid ?? null, updated);
      return updated;
    },
    [progress, user?.uid],
  );

  const resetCourseProgress = useCallback(
    async (courseId: string) => {
      const completedIds = progress.completedLessons[courseId] ?? [];
      const course = getCourse(courseId);
      const xpToRemove = course
        ? course.levels
            .flatMap((level) => level.lessons)
            .filter((lesson) => completedIds.includes(lesson.id))
            .reduce((sum, lesson) => sum + lesson.xpReward, 0)
        : 0;

      const completedLessons = Object.fromEntries(
        Object.entries(progress.completedLessons).filter(
          ([id]) => id !== courseId,
        ),
      );

      const updated: UserProgress = {
        ...progress,
        xp: Math.max(0, progress.xp - xpToRemove),
        completedLessons,
      };
      setProgress(updated);
      await saveProgress(user?.uid ?? null, updated);
      return updated;
    },
    [progress, user?.uid],
  );

  const resetLessonsProgress = useCallback(
    async (courseId: string, lessonIds: string[]) => {
      const idsToRemove = new Set(lessonIds);
      const completedIds = progress.completedLessons[courseId] ?? [];
      const course = getCourse(courseId);
      const xpToRemove = course
        ? course.levels
            .flatMap((level) => level.lessons)
            .filter(
              (lesson) =>
                completedIds.includes(lesson.id) && idsToRemove.has(lesson.id),
            )
            .reduce((sum, lesson) => sum + lesson.xpReward, 0)
        : 0;

      const remainingIds = completedIds.filter((id) => !idsToRemove.has(id));
      const completedLessons = {
        ...progress.completedLessons,
        [courseId]: remainingIds,
      };

      const updated: UserProgress = {
        ...progress,
        xp: Math.max(0, progress.xp - xpToRemove),
        completedLessons,
      };
      setProgress(updated);
      await saveProgress(user?.uid ?? null, updated);
      return updated;
    },
    [progress, user?.uid],
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        loading,
        completeLesson,
        resetCourseProgress,
        resetLessonsProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useUserProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error(
      "useUserProgress deve essere usato dentro <ProgressProvider>",
    );
  }
  return ctx;
}
