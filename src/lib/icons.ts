import {
  GitBranch,
  type LucideIcon,
  Move3d,
  SquareStack,
  TrendingUp,
  Waypoints,
} from "lucide-react";

/** Registro icone dei corsi: il nome è salvato come stringa nei dati del corso
 * (serializzabile), qui viene risolto al componente lucide-react reale. */
const ICONS: Record<string, LucideIcon> = {
  Waypoints,
  GitBranch,
  SquareStack,
  Move3d,
  TrendingUp,
};

export function resolveCourseIcon(name: string): LucideIcon {
  return ICONS[name] ?? Waypoints;
}
