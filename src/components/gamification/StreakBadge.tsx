import { Zap } from "lucide-react";

export function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-streak-500/10 px-3 py-1.5 font-display font-bold text-streak-500">
      <Zap size={18} className="fill-streak-400 text-streak-500" />
      <span>{streak}</span>
    </div>
  );
}
