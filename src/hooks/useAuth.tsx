import {
  createUserWithEmailAndPassword,
  type User as FirebaseUser,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import type { UserProfile } from "../types/user";

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  authAvailable: boolean;
  loginEmail: (email: string, password: string) => Promise<void>;
  signupEmail: (email: string, password: string) => Promise<void>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function toProfile(user: FirebaseUser): UserProfile {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    isGuest: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser ? toProfile(firebaseUser) : null);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function runAuthAction(action: () => Promise<unknown>) {
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Si è verificato un errore. Riprova.",
      );
      throw err;
    }
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      authAvailable: isFirebaseConfigured,
      loginEmail: (email, password) =>
        runAuthAction(async () => {
          if (!auth) throw new Error("Firebase non configurato.");
          await signInWithEmailAndPassword(auth, email, password);
        }),
      signupEmail: (email, password) =>
        runAuthAction(async () => {
          if (!auth) throw new Error("Firebase non configurato.");
          await createUserWithEmailAndPassword(auth, email, password);
        }),
      loginGoogle: () =>
        runAuthAction(async () => {
          if (!auth) throw new Error("Firebase non configurato.");
          await signInWithPopup(auth, new GoogleAuthProvider());
        }),
      logout: () =>
        runAuthAction(async () => {
          if (!auth) return;
          await signOut(auth);
        }),
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro <AuthProvider>");
  return ctx;
}
