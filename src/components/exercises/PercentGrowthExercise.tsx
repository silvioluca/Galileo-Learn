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
import type { PercentGrowthExercise as PercentGrowthExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import type { CheckStatus } from "./FeedbackBanner";
import { NumberChip, NumberTile, Slot } from "./NumberTiles";
import { NumericKeypad, TypedNumberSlot } from "./NumericKeypad";

interface Props {
  exercise: PercentGrowthExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

/** Righe (LaTeX) mostrate sopra la casella di risposta: passaggi intermedi
 * condivisi da entrambe le modalità (tastierino e trascinamento). */
function Steps({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-col items-center gap-2 border-b border-dashed border-ink-300/40 pb-5 text-ink-700">
      {steps.map((step, i) => (
        <div key={i} className="text-center text-base font-semibold">
          <MathText>{step}</MathText>
        </div>
      ))}
    </div>
  );
}

/** Lo studente digita un singolo numero (anche decimale) per completare un
 * calcolo, es. "1000 + [___]" oppure "x = [___]". */
export function PercentGrowthExercise(props: Props) {
  if (props.exercise.tileValues) {
    return <DragAnswer {...props} />;
  }
  return <TypedAnswer {...props} />;
}

function TypedAnswer({ exercise, status, revealAnswer, onReadyToCheck }: Props) {
  const [digits, setDigits] = useState("");
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;

  useEffect(() => {
    onReadyToCheck(
      digits.length > 0
        ? () => Math.abs(Number(digits) - exercise.correctValue) < 1e-6
        : null,
    );
  }, [digits, exercise.correctValue, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) setDigits(String(exercise.correctValue));
  }, [revealAnswer, exercise.correctValue]);

  function handleDigit(d: string) {
    if (locked) return;
    if (d === "." && digits.includes(".")) return;
    if (d === "-") {
      if (digits.length > 0) return;
      setDigits("-");
      playClackSound();
      return;
    }
    setDigits((prev) => (prev + d).slice(0, 8));
    playClackSound();
  }

  function handleBackspace() {
    if (locked) return;
    setDigits((prev) => prev.slice(0, -1));
  }

  const correct = locked && Math.abs(Number(digits) - exercise.correctValue) < 1e-6;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="max-w-lg text-center font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
        {exercise.steps && exercise.steps.length > 0 && <Steps steps={exercise.steps} />}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {exercise.prefixText && (
            <span className="font-display text-xl font-bold text-ink-900">
              {exercise.prefixText}
            </span>
          )}
          <TypedNumberSlot
            id="typed-percent"
            value={digits}
            active={!locked}
            locked={locked}
            correct={correct}
            onSelect={() => {}}
          />
          {exercise.suffixText && (
            <span className="font-display text-xl font-bold text-ink-900">
              {exercise.suffixText}
            </span>
          )}
        </div>

        <NumericKeypad
          onDigit={handleDigit}
          onBackspace={handleBackspace}
          disabled={locked}
          allowDecimalPoint={exercise.allowDecimal}
          allowNegative={exercise.allowNegative}
        />
      </div>

      {solved && (
        <p className="text-center font-display text-sm font-bold text-success-700">
          <MathText>{`Risposta corretta: $${exercise.correctValue}$`}</MathText>
        </p>
      )}
    </div>
  );
}

function DragAnswer({ exercise, status, revealAnswer, onReadyToCheck }: Props) {
  const [value, setValue] = useState<number | null>(null);
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const justDroppedRef = useRef(false);
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    onReadyToCheck(value !== null ? () => value === exercise.correctValue : null);
  }, [value, exercise.correctValue, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) setValue(exercise.correctValue);
  }, [revealAnswer, exercise.correctValue]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    if (locked) return;
    if (event.over?.id !== "slot-percent-growth") return;
    const tileValue = event.active.data.current?.value as number | undefined;
    if (tileValue === undefined) return;
    setValue(tileValue);
    justDroppedRef.current = true;
    playClackSound();
  }

  function handleTileSelect(tileValue: number) {
    if (locked) return;
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      return;
    }
    if (value === null) {
      setValue(tileValue);
      playClackSound();
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="max-w-lg text-center font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveDrag(e.active.data.current?.value as number)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
          {exercise.steps && exercise.steps.length > 0 && <Steps steps={exercise.steps} />}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {exercise.prefixText && (
              <span className="font-display text-xl font-bold text-ink-900">
                {exercise.prefixText}
              </span>
            )}
            <Slot
              id="slot-percent-growth"
              value={value}
              locked={locked}
              correct={locked && value === exercise.correctValue}
              showDot={false}
              onClear={() => setValue(null)}
            />
            {exercise.suffixText && (
              <span className="font-display text-xl font-bold text-ink-900">
                {exercise.suffixText}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-dashed border-ink-300/40 pt-6">
            {exercise.tileValues?.map((tileValue) => (
              <NumberTile
                key={tileValue}
                value={tileValue}
                disabled={locked}
                onSelect={handleTileSelect}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeDrag !== null && <NumberChip value={activeDrag} dragging />}
        </DragOverlay>
      </DndContext>

      {solved && (
        <p className="text-center font-display text-sm font-bold text-success-700">
          <MathText>{`Risposta corretta: $${exercise.correctValue}$`}</MathText>
        </p>
      )}
    </div>
  );
}
