import clsx from "clsx";
import { motion } from "framer-motion";
import { Check, Lock, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

export type LevelNodeStatus = "completed" | "active" | "locked";

interface LevelNodeProps {
  title: string;
  icon: LucideIcon;
  status: LevelNodeStatus;
  to: string;
}

export function LevelNode({ title, icon: Icon, status, to }: LevelNodeProps) {
  const isLocked = status === "locked";

  const circle = (
    <div className="relative">
      {status === "active" && (
        <>
          <motion.div
            aria-hidden
            className="absolute -inset-2 rounded-full border-2 border-brand-500"
            animate={{ scale: [1, 1.28], opacity: [0.55, 0] }}
            transition={{
              duration: 1.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeOut",
            }}
          />
          <motion.div
            aria-hidden
            className="absolute -inset-2 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0%, var(--color-brand-300) 10%, var(--color-brand-500) 18%, var(--color-brand-300) 26%, transparent 40%)",
              filter: "drop-shadow(0 0 4px var(--color-brand-400))",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 2.4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </>
      )}
      <motion.div
        whileHover={isLocked ? undefined : { scale: 1.06 }}
        whileTap={isLocked ? undefined : { scale: 0.96 }}
        className={clsx(
          "relative flex h-24 w-24 items-center justify-center rounded-full shadow-soft transition-colors",
          status === "completed" && "bg-success-500 text-white",
          status === "active" && "bg-brand-500 text-white",
          isLocked && "bg-ink-200 text-ink-500",
        )}
      >
        {isLocked ? <Lock size={30} /> : <Icon size={34} />}
        {status === "completed" && (
          <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-xp-500 text-white shadow-soft">
            <Check size={16} strokeWidth={3} />
          </span>
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2">
      {isLocked ? circle : <Link to={to}>{circle}</Link>}
      <span
        className={clsx(
          "font-display text-sm font-bold whitespace-nowrap",
          isLocked ? "text-ink-300" : "text-ink-700",
        )}
      >
        {title}
      </span>
    </div>
  );
}
