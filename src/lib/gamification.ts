import type { UserProgress } from "../types/user";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(fromISO: string, toISO: string): number {
  const from = new Date(`${fromISO}T00:00:00`);
  const to = new Date(`${toISO}T00:00:00`);
  return Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Aggiorna lo streak in base alla data dell'ultima attività:
 * stesso giorno -> invariato, giorno successivo -> +1, altrimenti -> riparte da 1.
 */
export function nextStreak(progress: UserProgress): number {
  if (!progress.lastActiveDate) return 1;
  const gap = daysBetween(progress.lastActiveDate, todayISO());
  if (gap === 0) return progress.streak || 1;
  if (gap === 1) return (progress.streak || 0) + 1;
  return 1;
}

export function applyLessonCompletion(
  progress: UserProgress,
  courseId: string,
  lessonId: string,
  xpReward: number,
): UserProgress {
  const alreadyCompleted =
    progress.completedLessons[courseId]?.includes(lessonId) ?? false;

  const completedLessons = {
    ...progress.completedLessons,
    [courseId]: alreadyCompleted
      ? progress.completedLessons[courseId]
      : [...(progress.completedLessons[courseId] ?? []), lessonId],
  };

  return {
    xp: progress.xp + (alreadyCompleted ? 0 : xpReward),
    streak: nextStreak(progress),
    lastActiveDate: todayISO(),
    completedLessons,
  };
}

export function isLessonCompleted(
  progress: UserProgress,
  courseId: string,
  lessonId: string,
): boolean {
  return progress.completedLessons[courseId]?.includes(lessonId) ?? false;
}
