import { useMemo } from "react";
import { isLessonCompleted } from "../lib/gamification";
import { useUserProgress } from "./useUserProgress";

export function useCourseProgress(courseId: string) {
  const { progress, loading } = useUserProgress();

  const completedLessonIds = useMemo(
    () => new Set(progress.completedLessons[courseId] ?? []),
    [progress.completedLessons, courseId],
  );

  return {
    loading,
    completedLessonIds,
    isLessonCompleted: (lessonId: string) =>
      isLessonCompleted(progress, courseId, lessonId),
  };
}
