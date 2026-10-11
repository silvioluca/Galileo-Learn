import { motion } from "framer-motion";
import { Check, Hexagon } from "lucide-react";
import { Button } from "../ui/Button";

interface LevelUpScreenProps {
  levelNumber: number;
  levelTitle: string;
  onContinue: () => void;
}

/** Schermata di transizione mostrata al completamento dell'ultima lezione di
 * un livello (la verifica di livello), quando esiste un livello successivo:
 * introduce il nuovo livello prima di tornare alla mappa del corso. */
export function LevelUpScreen({ levelNumber, levelTitle, onContinue }: LevelUpScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-brand-50 to-brand-100 px-4 text-center">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Hexagon size={112} className="text-brand-500" fill="currentColor" strokeWidth={0} />
        </motion.div>
        <span className="relative font-display text-4xl font-extrabold text-white">
          {levelNumber}
        </span>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 14 }}
          className="absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-xl bg-success-500 text-white shadow-soft"
        >
          <Check size={20} strokeWidth={3} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col gap-1"
      >
        <h1 className="font-display text-2xl font-extrabold text-ink-950">Sali di livello!</h1>
        <p className="font-display text-sm font-bold text-brand-700">{levelTitle}</p>
      </motion.div>

      <Button variant="primary" size="lg" onClick={onContinue}>
        Andiamo!
      </Button>
    </div>
  );
}
