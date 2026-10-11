import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { RuleMatchingExercise as RuleMatchingExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import type { CheckStatus } from "./FeedbackBanner";

interface Props {
  exercise: RuleMatchingExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

export function RuleMatchingExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const locked = status !== "unanswered";
  const showLines = locked && (status === "correct" || revealAnswer);

  const correctOption = useMemo(
    () => exercise.options.find((o) => o.id === exercise.correctId)!,
    [exercise],
  );
  const outputs = useMemo(
    () => exercise.inputs.map((x) => correctOption.fn(x)),
    [exercise.inputs, correctOption],
  );

  useEffect(() => {
    onReadyToCheck(
      selectedId ? () => selectedId === exercise.correctId : null,
    );
  }, [selectedId, exercise.correctId, onReadyToCheck]);

  const chosenLabel = exercise.options.find((o) => o.id === selectedId)?.label;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        {exercise.prompt}
      </h2>

      <AnimatePresence>
        {showLines && chosenLabel && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 rounded-full bg-success-50 px-4 py-2 font-display font-bold text-success-700"
          >
            {chosenLabel}
            <Check size={16} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex gap-10 overflow-hidden rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 w-40 -translate-x-1/2 blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(122,127,248,0.16), transparent 72%)",
          }}
        />
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold tracking-wide text-ink-500 uppercase">
            input
          </span>
          {exercise.inputs.map((value) => (
            <div
              key={value}
              className="flex h-11 w-16 items-center justify-center rounded-xl border border-ink-300/40 font-display font-bold text-ink-900"
            >
              {value}
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center gap-3">
          {exercise.inputs.map((_, i) => {
            const markerId = `arrow-${exercise.id}-${i}`;
            return (
              <div
                key={i}
                className={clsx(
                  "flex h-11 w-14 items-center transition-colors duration-300",
                  showLines ? "text-success-500" : "text-ink-300",
                )}
              >
                <motion.svg
                  width="56"
                  height="16"
                  viewBox="0 0 56 16"
                  className="overflow-visible"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: showLines ? i * 0.08 : 0, duration: 0.3 }}
                >
                  <defs>
                    <marker
                      id={markerId}
                      markerWidth="4.5"
                      markerHeight="4.5"
                      refX="3.4"
                      refY="2.25"
                      orient="auto"
                    >
                      <path d="M0,0 L4.5,2.25 L0,4.5 z" fill="currentColor" />
                    </marker>
                  </defs>
                  <circle cx="3" cy="8" r="1.8" fill="currentColor" />
                  <line
                    x1="7"
                    y1="8"
                    x2="44"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeDasharray="2.5 3"
                    markerEnd={`url(#${markerId})`}
                  />
                  <circle cx="53" cy="8" r="1.8" fill="currentColor" />
                </motion.svg>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold tracking-wide text-ink-500 uppercase">
            output
          </span>
          {outputs.map((value, i) => (
            <div
              key={exercise.inputs[i]}
              className="flex h-11 w-16 items-center justify-center rounded-xl border border-ink-300/40 font-display font-bold text-ink-900"
            >
              {value}
            </div>
          ))}
        </div>
      </div>

      <div className="grid w-full gap-3 sm:grid-cols-2">
        {exercise.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrectChoice = option.id === exercise.correctId;
          const showCorrect = locked && isCorrectChoice;
          const showWrong = locked && isSelected && !isCorrectChoice;

          return (
            <button
              type="button"
              key={option.id}
              disabled={locked}
              onClick={() => setSelectedId(option.id)}
              className={clsx(
                "pressable rounded-2xl border-2 px-5 py-3 text-center font-display font-bold transition-colors",
                !locked && isSelected && "border-brand-500 bg-brand-50 text-brand-700",
                !locked && !isSelected && "border-ink-300/40 bg-white text-ink-900 hover:border-brand-300",
                showCorrect && "border-success-500 bg-success-50 text-success-700",
                showWrong && "border-danger-500 bg-danger-50 text-danger-600",
                locked && !isSelected && !showCorrect && "border-ink-300/30 bg-white text-ink-400",
              )}
            >
              <MathText>{option.label}</MathText>
            </button>
          );
        })}
      </div>
    </div>
  );
}
