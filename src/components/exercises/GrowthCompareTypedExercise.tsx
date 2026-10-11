import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { playClackSound } from "../../lib/sound";
import type { GrowthCompareTypedExercise as GrowthCompareTypedExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import type { CheckStatus } from "./FeedbackBanner";
import { GraphAxes, growthSeriesCurveD, SVG_HEIGHT, SVG_WIDTH } from "./graphGeometry";
import { NumberChip, NumberTile, Slot } from "./NumberTiles";
import { NumericKeypad, TypedNumberSlot } from "./NumericKeypad";

interface Props {
  exercise: GrowthCompareTypedExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

/** Grafico e intestazione condivisi da entrambe le modalità (tastierino e
 * trascinamento): due curve a confronto, con legenda colorata. */
function CompareGraph({ exercise }: { exercise: GrowthCompareTypedExerciseT }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-4">
        {[exercise.seriesA, exercise.seriesB].map((series, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="inline-block h-0.5 w-4 -rotate-[20deg]"
              style={{ backgroundColor: series.color }}
            />
            <MathText>{`$${series.label}$`}</MathText>
          </div>
        ))}
      </div>
      <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
        <GraphAxes
          maxDay={exercise.maxDay}
          maxValue={exercise.maxValue}
          yStep={exercise.yStep}
          xStep={exercise.xStep}
          axisLabel={exercise.axisLabel}
          quantityLabel={exercise.quantityLabel}
        />
        <path
          d={growthSeriesCurveD(exercise.seriesA, exercise.maxDay, exercise.maxValue)}
          fill="none"
          stroke={exercise.seriesA.color}
          strokeWidth={2}
        />
        <path
          d={growthSeriesCurveD(exercise.seriesB, exercise.maxDay, exercise.maxValue)}
          fill="none"
          stroke={exercise.seriesB.color}
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}

/** Righe (LaTeX) mostrate sopra la selezione della risposta: passaggi
 * intermedi condivisi da entrambe le modalità (tastierino e trascinamento). */
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

/** Casella che mostra solo l'operatore scelto (o vuota): resta accanto alla
 * "x", mentre i pulsanti per sceglierlo si trovano più in basso, tra le
 * altre opzioni. */
function OperatorDisplay({
  operator,
  locked,
  correct,
}: {
  operator: "<" | ">" | "=" | null;
  locked: boolean;
  correct: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex h-12 w-12 items-center justify-center rounded-lg border-2 border-dashed font-display text-lg font-bold",
        !locked && "border-ink-300 bg-cream-100/50 text-brand-700",
        locked && correct && "border-success-500 bg-success-50/60 text-success-700",
        locked && !correct && operator !== null && "border-danger-500 bg-danger-50/60 text-danger-600",
      )}
    >
      {operator ?? <span className="text-xs text-ink-300">·</span>}
    </div>
  );
}

/** Pulsanti per scegliere l'operatore, mostrati in basso insieme alle altre
 * opzioni (tessere numeriche o tastierino). */
function OperatorButtons({
  locked,
  onSelect,
}: {
  locked: boolean;
  onSelect: (op: "<" | ">" | "=") => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {(["<", ">", "="] as const).map((op) => (
        <button
          key={op}
          type="button"
          disabled={locked}
          onClick={() => onSelect(op)}
          className="pressable flex h-12 w-12 items-center justify-center rounded-lg border-2 border-brand-600 bg-brand-100 font-display text-lg font-bold text-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {op}
        </button>
      ))}
    </div>
  );
}

export function GrowthCompareTypedExercise(props: Props) {
  if (props.exercise.tileValues) {
    return <DragAnswer {...props} />;
  }
  return <TypedAnswer {...props} />;
}

function TypedAnswer({ exercise, status, revealAnswer, onReadyToCheck }: Props) {
  const [digits, setDigits] = useState("");
  const [operator, setOperator] = useState<"<" | ">" | "=" | null>(null);
  const locked = status !== "unanswered";
  const needsOperator = exercise.requiresOperator ?? false;

  useEffect(() => {
    const ready = digits.length > 0 && (!needsOperator || operator !== null);
    onReadyToCheck(
      ready
        ? () =>
            Number(digits) === exercise.correctValue &&
            (!needsOperator || operator === exercise.correctOperator)
        : null,
    );
  }, [digits, operator, needsOperator, exercise.correctValue, exercise.correctOperator, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) {
      setDigits(String(exercise.correctValue));
      if (needsOperator) setOperator(exercise.correctOperator ?? null);
    }
  }, [revealAnswer, exercise.correctValue, exercise.correctOperator, needsOperator]);

  function handleDigit(d: string) {
    if (locked) return;
    setDigits((prev) => (prev + d).slice(0, 4));
    playClackSound();
  }

  function handleBackspace() {
    if (locked) return;
    setDigits((prev) => prev.slice(0, -1));
  }

  function handleOperator(op: "<" | ">" | "=") {
    if (locked) return;
    setOperator(op);
    playClackSound();
  }

  const valueCorrect = locked && Number(digits) === exercise.correctValue;
  const operatorCorrect = locked && operator === exercise.correctOperator;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <CompareGraph exercise={exercise} />

      <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
        {exercise.steps && exercise.steps.length > 0 && <Steps steps={exercise.steps} />}
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-ink-900">
            x {needsOperator ? "" : "="}
          </span>
          {needsOperator && (
            <OperatorDisplay operator={operator} locked={locked} correct={operatorCorrect} />
          )}
          <TypedNumberSlot
            id="typed-value"
            value={digits}
            active={!locked}
            locked={locked}
            correct={valueCorrect}
            onSelect={() => {}}
            dashed
          />
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-dashed border-ink-300/40 pt-6">
          {needsOperator && <OperatorButtons locked={locked} onSelect={handleOperator} />}
          <NumericKeypad onDigit={handleDigit} onBackspace={handleBackspace} disabled={locked} square />
        </div>
      </div>
    </div>
  );
}

function DragAnswer({ exercise, status, revealAnswer, onReadyToCheck }: Props) {
  const [value, setValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<"<" | ">" | "=" | null>(null);
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const justDroppedRef = useRef(false);
  const locked = status !== "unanswered";
  const needsOperator = exercise.requiresOperator ?? false;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    const ready = value !== null && (!needsOperator || operator !== null);
    onReadyToCheck(
      ready
        ? () =>
            value === exercise.correctValue &&
            (!needsOperator || operator === exercise.correctOperator)
        : null,
    );
  }, [value, operator, needsOperator, exercise.correctValue, exercise.correctOperator, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) {
      setValue(exercise.correctValue);
      if (needsOperator) setOperator(exercise.correctOperator ?? null);
    }
  }, [revealAnswer, exercise.correctValue, exercise.correctOperator, needsOperator]);

  function handleOperator(op: "<" | ">" | "=") {
    if (locked) return;
    setOperator(op);
    playClackSound();
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    if (locked) return;
    if (event.over?.id !== "slot-growth-compare") return;
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

  const valueCorrect = locked && value === exercise.correctValue;
  const operatorCorrect = locked && operator === exercise.correctOperator;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <CompareGraph exercise={exercise} />

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveDrag(e.active.data.current?.value as number)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
          {exercise.steps && exercise.steps.length > 0 && <Steps steps={exercise.steps} />}
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-ink-900">
              x {needsOperator ? "" : "="}
            </span>
            {needsOperator && (
              <OperatorDisplay operator={operator} locked={locked} correct={operatorCorrect} />
            )}
            <Slot
              id="slot-growth-compare"
              value={value}
              locked={locked}
              correct={valueCorrect}
              showDot={false}
              onClear={() => setValue(null)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-dashed border-ink-300/40 pt-6">
            {needsOperator && <OperatorButtons locked={locked} onSelect={handleOperator} />}
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
    </div>
  );
}
