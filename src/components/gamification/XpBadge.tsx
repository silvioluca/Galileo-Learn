import { motion } from "framer-motion";
import { Gem } from "lucide-react";

export function XpBadge({ xp }: { xp: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-xp-500/10 px-3 py-1.5 font-display font-bold text-xp-600">
      <Gem size={18} className="fill-xp-400 text-xp-500" />
      <motion.span
        key={xp}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 12 }}
      >
        {xp}
      </motion.span>
    </div>
  );
}
