import { doc, getDoc, setDoc } from "firebase/firestore";
import { EMPTY_PROGRESS, type UserProgress } from "../types/user";
import { db, isFirebaseConfigured } from "./firebase";

const GUEST_KEY = "galileo:guest-progress";

function readGuestProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return EMPTY_PROGRESS;
    return { ...EMPTY_PROGRESS, ...JSON.parse(raw) } as UserProgress;
  } catch {
    return EMPTY_PROGRESS;
  }
}

function writeGuestProgress(progress: UserProgress): void {
  localStorage.setItem(GUEST_KEY, JSON.stringify(progress));
}

/**
 * Store unico dei progressi utente: usa Firestore quando Firebase è configurato
 * e l'utente ha un account reale, altrimenti ricade su localStorage (modalità ospite).
 * Questo permette all'app di restare pienamente giocabile anche senza un progetto
 * Firebase configurato (vedi .env.example).
 */
export async function loadProgress(uid: string | null): Promise<UserProgress> {
  if (uid && isFirebaseConfigured && db) {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) {
      return { ...EMPTY_PROGRESS, ...(snap.data() as Partial<UserProgress>) };
    }
    return EMPTY_PROGRESS;
  }
  return readGuestProgress();
}

export async function saveProgress(
  uid: string | null,
  progress: UserProgress,
): Promise<void> {
  if (uid && isFirebaseConfigured && db) {
    await setDoc(doc(db, "users", uid), progress, { merge: true });
    return;
  }
  writeGuestProgress(progress);
}
