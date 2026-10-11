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
import type { TwoPointsFormulaExercise as TwoPointsFormulaExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import type { CheckStatus } from "./FeedbackBanner";
import { NumberChip, NumberTile, Slot } from "./NumberTiles";

interface Props {
  exercise: TwoPointsFormulaExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

/** Come FormulaBuildExercise, ma senza grafico: i due punti noti ($f(0)$ e
 * $f(1)$) sono dati come testo. Lo studente trascina (o clicca, in ordine)
 * il coefficiente e la base per completare $f(x) = a \cdot b^x$. */
export function TwoPointsFormulaExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const [coeff, setCoeff] = useState<number | null>(null);
  const [base, setBase] = useState<number | null>(null);
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const justDroppedRef = useRef(false);
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    onReadyToCheck(
      coeff !== null && base !== null
        ? () => coeff === exercise.correctCoeff && base === exercise.correctBase
        : null,
    );
  }, [coeff, base, exercise.correctCoeff, exercise.correctBase, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) {
      setCoeff(exercise.correctCoeff);
      setBase(exercise.correctBase);
    }
  }, [revealAnswer, exercise.correctCoeff, exercise.correctBase]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    if (locked) return;
    const slotId = event.over?.id as string | undefined;
    const tileValue = event.active.data.current?.value as number | undefined;
    if (tileValue === undefined) return;
    if (slotId === "slot-coeff") setCoeff(tileValue);
    else if (slotId === "slot-base") setBase(tileValue);
    else return;
    justDroppedRef.current = true;
    playClackSound();
  }

  /** Un semplice click (senza trascinamento) riempie la prossima casella
   * vuota in ordine: prima il coefficiente, poi la base. */
  function handleTileSelect(value: number) {
    if (locked) return;
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      return;
    }
    if (coeff === null) {
      setCoeff(value);
      playClackSound();
    } else if (base === null) {
      setBase(value);
      playClackSound();
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <div className="flex flex-col items-center gap-2 rounded-2xl border border-ink-300/30 bg-white px-8 py-6 shadow-soft">
        <p className="font-display text-lg font-bold text-ink-900">
          <MathText>{`$f(0) = ${exercise.valueAtZero}$`}</MathText>
        </p>
        <p className="font-display text-lg font-bold text-ink-900">
          <MathText>{`$f(1) = ${exercise.valueAtOne}$`}</MathText>
        </p>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveDrag(e.active.data.current?.value as number)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-ink-900">f(x) =</span>
            <Slot
              id="slot-coeff"
              value={coeff}
              locked={locked}
              correct={locked && coeff === exercise.correctCoeff}
              showDot={false}
              onClear={() => setCoeff(null)}
            />
            <span className="font-display text-xl font-bold text-ink-300">·</span>
            <div className="relative">
              <Slot
                id="slot-base"
                value={base}
                locked={locked}
                correct={locked && base === exercise.correctBase}
                showDot={false}
                onClear={() => setBase(null)}
              />
              <span className="absolute -top-1.5 -right-3 font-display text-sm font-bold text-ink-500">
                x
              </span>
            </div>
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
        <p className="text-center font-display text-sm font-bold text-success-700">
          Formula corretta: f(x) = {exercise.correctCoeff} · {exercise.correctBase}
          <sup>x</sup>
        </p>
      )}
    </div>
  );
}
