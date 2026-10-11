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
import type { ExponentialDaysExercise as ExponentialDaysExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import { DayCircle } from "./DayCircle";
import type { CheckStatus } from "./FeedbackBanner";
import { NumberChip, NumberTile, Slot } from "./NumberTiles";

interface Props {
  exercise: ExponentialDaysExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

export function ExponentialDaysExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  if (exercise.mode === "choose") {
    return (
      <ChooseVariant
        exercise={exercise}
        status={status}
        revealAnswer={revealAnswer}
        onReadyToCheck={onReadyToCheck}
      />
    );
  }
  if (exercise.mode === "build") {
    return (
      <BuildVariant
        exercise={exercise}
        status={status}
        revealAnswer={revealAnswer}
        onReadyToCheck={onReadyToCheck}
      />
    );
  }
  return <ConceptVariant exercise={exercise} onReadyToCheck={onReadyToCheck} />;
}

function DaysRow({
  days,
  targetDay,
  hideTarget,
  revealValue,
  dayLabel = "Giorno",
}: {
  days: { day: number; value: number }[];
  targetDay?: number;
  hideTarget?: boolean;
  revealValue?: number;
  dayLabel?: string;
}) {
  const size = days.length >= 4 ? 128 : 176;
  const maxValue = Math.max(...days.map((d) => d.value), revealValue ?? 0);
  return (
    <div
      className={clsx(
        "flex flex-nowrap items-start justify-center py-2",
        days.length >= 4 ? "gap-3" : "gap-8",
      )}
    >
      {days.map((d) => {
        const isTarget = d.day === targetDay;
        return (
          <DayCircle
            key={d.day}
            label={`${dayLabel} ${d.day}`}
            value={isTarget ? (revealValue ?? d.value) : d.value}
            hidden={isTarget && hideTarget}
            size={size}
            maxValue={maxValue}
          />
        );
      })}
    </div>
  );
}

function ChooseVariant({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props & { exercise: Extract<ExponentialDaysExerciseT, { mode: "choose" }> }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;

  useEffect(() => {
    onReadyToCheck(selectedId ? () => selectedId === exercise.correctId : null);
  }, [selectedId, exercise.correctId, onReadyToCheck]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <DaysRow
        days={exercise.days}
        targetDay={exercise.targetDay}
        hideTarget={!solved}
        revealValue={exercise.revealValue}
        dayLabel={exercise.dayLabel}
      />

      <div className="grid w-full gap-3 sm:grid-cols-2">
        {exercise.choices.map((choice) => {
          const isSelected = selectedId === choice.id;
          const isCorrectChoice = choice.id === exercise.correctId;
          const showCorrect = locked && isCorrectChoice;
          const showWrong = locked && isSelected && !isCorrectChoice;

          return (
            <button
              type="button"
              key={choice.id}
              disabled={locked}
              onClick={() => setSelectedId(choice.id)}
              className={clsx(
                "pressable rounded-2xl border-2 px-5 py-3 text-center font-display font-bold transition-colors",
                !locked && isSelected && "border-brand-500 bg-brand-50 text-brand-700",
                !locked && !isSelected && "border-ink-300/40 bg-white text-ink-900 hover:border-brand-300",
                showCorrect && "border-success-500 bg-success-50 text-success-700",
                showWrong && "border-danger-500 bg-danger-50 text-danger-600",
                locked && !isSelected && !showCorrect && "border-ink-300/30 bg-white text-ink-400",
              )}
            >
              <MathText>{choice.label}</MathText>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BuildVariant({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props & { exercise: Extract<ExponentialDaysExerciseT, { mode: "build" }> }) {
  const slotCount = exercise.correctFactors.length;
  const [slots, setSlots] = useState<(number | null)[]>(
    Array.from({ length: slotCount }, () => null),
  );
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const justDroppedRef = useRef(false);
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    const allFilled = slots.every((s) => s !== null);
    onReadyToCheck(
      allFilled
        ? () => slots.every((s, i) => s === exercise.correctFactors[i])
        : null,
    );
  }, [slots, exercise.correctFactors, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) setSlots([...exercise.correctFactors]);
  }, [revealAnswer, exercise.correctFactors]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    if (locked) return;
    const slotId = event.over?.id as string | undefined;
    const tileValue = event.active.data.current?.value as number | undefined;
    if (!slotId?.startsWith("slot-") || tileValue === undefined) return;
    const index = Number(slotId.slice("slot-".length));
    setSlots((prev) => prev.map((v, i) => (i === index ? tileValue : v)));
    justDroppedRef.current = true;
    playClackSound();
  }

  /** Un semplice click (senza trascinamento) riempie la prossima casella
   * vuota in ordine. */
  function handleTileSelect(value: number) {
    if (locked) return;
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      return;
    }
    const nextEmpty = slots.findIndex((s) => s === null);
    if (nextEmpty === -1) return;
    setSlots((prev) => prev.map((v, i) => (i === nextEmpty ? value : v)));
    playClackSound();
  }

  const allFilled = slots.every((s) => s !== null);
  const liveProduct = allFilled
    ? slots.reduce<number>((a, b) => a * (b as number), exercise.fixedPrefix ?? 1)
    : null;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <DaysRow days={exercise.days} dayLabel={exercise.dayLabel} />

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveDrag(e.active.data.current?.value as number)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
          <div className="flex items-center justify-center gap-2">
            {exercise.fixedPrefix !== undefined && (
              <span className="font-display text-xl font-bold text-ink-900">
                {exercise.fixedPrefix} ·
              </span>
            )}
            {slots.map((value, i) => (
              <Slot
                key={i}
                id={`slot-${i}`}
                value={value}
                locked={locked}
                correct={locked && value === exercise.correctFactors[i]}
                showDot={i > 0}
                onClear={() =>
                  setSlots((prev) => prev.map((v, idx) => (idx === i ? null : v)))
                }
              />
            ))}
            <span className="mx-2 font-display text-xl font-bold text-ink-300">
              =
            </span>
            <span
              className={clsx(
                "flex h-14 min-w-14 items-center justify-center rounded-xl border-2 px-2 font-display text-lg font-bold",
                locked && solved && "border-success-500 bg-success-50 text-success-700",
                locked && !solved && "border-danger-500 bg-danger-50 text-danger-600",
                !locked &&
                  allFilled &&
                  "border-brand-400 bg-brand-50 text-brand-700",
                !locked &&
                  !allFilled &&
                  "border-dashed border-ink-300 bg-cream-100 text-ink-300",
              )}
            >
              {liveProduct ?? "?"}
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
    </div>
  );
}

function ConceptVariant({
  exercise,
  onReadyToCheck,
}: {
  exercise: Extract<ExponentialDaysExerciseT, { mode: "concept" }>;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}) {
  useEffect(() => {
    onReadyToCheck(() => true);
  }, [onReadyToCheck]);

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center font-display text-2xl font-bold text-ink-950">
        <MathText>{exercise.formula}</MathText>
      </p>
      <DaysRow days={exercise.days} dayLabel={exercise.dayLabel} />
      <p className="max-w-lg text-center text-ink-700">
        <MathText>{exercise.conceptText}</MathText>
      </p>
    </div>
  );
}

