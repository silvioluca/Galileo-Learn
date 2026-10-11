export interface UserProgress {
  xp: number;
  streak: number;
  /** data ISO (YYYY-MM-DD) dell'ultimo giorno in cui l'utente ha completato un'attività */
  lastActiveDate: string | null;
  /** per corso: elenco id delle lezioni completate */
  completedLessons: Record<string, string[]>;
}

export const EMPTY_PROGRESS: UserProgress = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  completedLessons: {},
};

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  isGuest: boolean;
}
