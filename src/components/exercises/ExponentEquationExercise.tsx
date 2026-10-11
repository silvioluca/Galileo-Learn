import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { playClackSound } from "../../lib/sound";
import type {
  ExponentEquationExercise as ExponentEquationExerciseT,
  FractionValue,
} from "../../types/course";
import { MathText } from "../math/MathText";
import type { CheckStatus } from "./FeedbackBanner";
import { NumberChip, NumberTile, Slot } from "./NumberTiles";

/** Frazione impilata (numeratore/lineetta/denominatore) in puro testo, per
 * mostrare basi o risultati frazionari senza convertirli in decimali. */
function InlineFraction({ numerator, denominator }: FractionValue) {
  return (
    <span className="inline-flex flex-col items-center leading-none align-middle">
      <span>{numerator}</span>
      <span className="my-0.5 h-[2px] w-full bg-current" />
      <span>{denominator}</span>
    </span>
  );
}

interface Props {
  exercise: ExponentEquationExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

/** Equazione del tipo (coeff ·) base^[] = risultato: lo studente trascina il
 * numero giusto nella casella dell'esponente. */
export function ExponentEquationExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const [exponent, setExponent] = useState<number | null>(null);
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const justDroppedRef = useRef(false);
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;
  const hasFixedCoeff = exercise.fixedCoeff !== undefined;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    onReadyToCheck(
      exponent !== null ? () => exponent === exercise.correctExponent : null,
    );
  }, [exponent, exercise.correctExponent, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) setExponent(exercise.correctExponent);
  }, [revealAnswer, exercise.correctExponent]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    if (locked) return;
    if (event.over?.id !== "slot-exponent") return;
    const tileValue = event.active.data.current?.value as number | undefined;
    if (tileValue === undefined) return;
    setExponent(tileValue);
    justDroppedRef.current = true;
    playClackSound();
  }

  /** Un semplice click (senza trascinamento) sulla tessera riempie la
   * casella dell'esponente, se ancora vuota. */
  function handleTileSelect(value: number) {
    if (locked) return;
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      return;
    }
    if (exponent === null) {
      setExponent(value);
      playClackSound();
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveDrag(e.active.data.current?.value as number)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
          <div className="flex items-end gap-1">
            {hasFixedCoeff && (
              <span className="font-display text-2xl font-bold text-ink-900">
                {exercise.fixedCoeff} ·
              </span>
            )}
            <span className="font-display text-2xl font-bold text-ink-900">
              {exercise.baseFraction ? (
                <InlineFraction {...exercise.baseFraction} />
              ) : (
                (exercise.baseLabel ?? exercise.base)
              )}
            </span>
            <div className="relative -top-3">
              <Slot
                id="slot-exponent"
                value={exponent}
                locked={locked}
                correct={locked && exponent === exercise.correctExponent}
                showDot={false}
                onClear={() => setExponent(null)}
              />
            </div>
            <span className="ml-2 font-display text-2xl font-bold text-ink-300">
              =
            </span>
            <span className="font-display text-2xl font-bold text-ink-900">
              {exercise.hideResult ? (
                "?"
              ) : exercise.resultFraction ? (
                <InlineFraction {...exercise.resultFraction} />
              ) : (
                exercise.targetResult.toLocaleString("it-IT")
              )}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-dashed border-ink-300/40 pt-6">
            {exercise.tileValues.map((value) => (
              <NumberTile key={value} value={value} disabled={locked} onSelect={handleTileSelect} />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeDrag !== null && <NumberChip value={activeDrag} dragging />}
        </DragOverlay>
      </DndContext>

      {solved && (
        <p className="flex items-center justify-center gap-1 text-center font-display text-sm font-bold text-success-700">
          {hasFixedCoeff ? `${exercise.fixedCoeff} · ` : ""}
          {exercise.baseFraction ? (
            <InlineFraction {...exercise.baseFraction} />
          ) : (
            (exercise.baseLabel ?? exercise.base)
          )}
          <sup>{exercise.correctExponent}</sup> =
          {exercise.hideResult ? (
            "?"
          ) : exercise.resultFraction ? (
            <InlineFraction {...exercise.resultFraction} />
          ) : (
            exercise.targetResult.toLocaleString("it-IT")
          )}
        </p>
      )}
    </div>
  );
}
