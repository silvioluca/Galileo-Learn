import { Telescope } from "lucide-react";
import { type FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../hooks/useAuth";

export function AuthPage() {
  const { user, authAvailable, error, loginEmail, signupEmail, loginGoogle } =
    useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/tu" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (mode === "login") {
        await loginEmail(email, password);
      } else {
        await signupEmail(email, password);
      }
    } catch {
      // l'errore è già esposto tramite useAuth().error
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream-50 px-4 py-10">
      <Link to="/" className="flex items-center gap-2">
        <Telescope className="text-brand-500" size={28} strokeWidth={2.4} />
        <span className="font-display text-xl font-extrabold text-ink-950">
          Galileo Learn
        </span>
      </Link>

      <Card className="w-full max-w-sm p-6">
        <h1 className="mb-1 font-display text-xl font-bold text-ink-950">
          {mode === "login" ? "Bentornato" : "Crea il tuo account"}
        </h1>
        <p className="mb-5 text-sm text-ink-500">
          {mode === "login"
            ? "Accedi per salvare i tuoi progressi."
            : "Registrati per non perdere mai il tuo streak."}
        </p>

        {!authAvailable && (
          <p className="mb-4 rounded-xl bg-brand-50 px-3 py-2 text-sm text-brand-700">
            L'accesso con account non è ancora configurato su questo sito.
            Puoi comunque giocare come ospite: i progressi restano salvati su
            questo dispositivo.
          </p>
        )}

        {authAvailable && (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-ink-300/40 px-4 py-2.5 outline-none focus:border-brand-500"
              />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-ink-300/40 px-4 py-2.5 outline-none focus:border-brand-500"
              />
              {error && <p className="text-sm text-danger-500">{error}</p>}
              <Button type="submit" variant="primary" disabled={submitting}>
                {mode === "login" ? "Accedi" : "Registrati"}
              </Button>
            </form>

            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={() => loginGoogle()}
            >
              Continua con Google
            </Button>

            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="mt-4 w-full text-center text-sm font-semibold text-brand-600"
            >
              {mode === "login"
                ? "Non hai un account? Registrati"
                : "Hai già un account? Accedi"}
            </button>
          </>
        )}

        <Link to="/corsi" className="mt-4 block text-center">
          <Button variant="ghost" className="w-full">
            Continua come ospite
          </Button>
        </Link>
      </Card>
    </div>
  );
}
