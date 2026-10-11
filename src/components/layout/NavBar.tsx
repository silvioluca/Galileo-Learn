import { Telescope } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../../hooks/useAuth";
import { useUserProgress } from "../../hooks/useUserProgress";
import { StreakBadge } from "../gamification/StreakBadge";
import { XpBadge } from "../gamification/XpBadge";
import { Button } from "../ui/Button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "font-display rounded-full px-3 py-2 text-sm font-bold transition-colors",
    isActive
      ? "bg-brand-50 text-brand-600"
      : "text-ink-700 hover:bg-cream-100",
  );

export function NavBar() {
  const { user, logout } = useAuth();
  const { progress } = useUserProgress();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-300/25 bg-white/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 md:grid-cols-3">
        <NavLink to="/" className="flex items-center gap-2 justify-self-start">
          <Telescope className="text-brand-500" size={26} strokeWidth={2.4} />
          <span className="font-display text-xl font-extrabold text-ink-950">
            Galileo Learn
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 justify-self-center md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/corsi" className={navLinkClass}>
            Corsi
          </NavLink>
          <NavLink to="/tu" className={navLinkClass}>
            Tu
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <XpBadge xp={progress.xp} />
          <StreakBadge streak={progress.streak} />
          {user ? (
            <Button variant="ghost" size="md" onClick={() => logout()}>
              Esci
            </Button>
          ) : (
            <NavLink to="/accedi">
              <Button variant="primary" size="md">
                Accedi
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
