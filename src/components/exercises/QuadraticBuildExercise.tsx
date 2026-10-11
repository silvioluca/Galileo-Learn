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
import type { QuadraticBuildExercise as QuadraticBuildExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import { DayCircle } from "./DayCircle";
import type { CheckStatus } from "./FeedbackBanner";
import {
  coordinateLabelProps,
  GraphAxes,
  makeScales,
  quadraticCurveD,
  SVG_HEIGHT,
  SVG_WIDTH,
} from "./graphGeometry";
import { NumberChip, NumberTile, Slot } from "./NumberTiles";

interface Props {
  exercise: QuadraticBuildExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

export function QuadraticBuildExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const [coeff, setCoeff] = useState<number | null>(null);
  const [intercept, setIntercept] = useState<number | null>(null);
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const justDroppedRef = useRef(false);
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue);
  const hasCurve = coeff !== null && intercept !== null;
  const curveColor = locked
    ? solved
      ? "var(--color-success-500)"
      : "var(--color-danger-500)"
    : "var(--color-brand-400)";
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    const ready = coeff !== null && intercept !== null;
    onReadyToCheck(
      ready
        ? () => coeff === exercise.correctCoeff && intercept === exercise.correctIntercept
        : null,
    );
  }, [coeff, intercept, exercise.correctCoeff, exercise.correctIntercept, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) {
      setCoeff(exercise.correctCoeff);
      setIntercept(exercise.correctIntercept);
    }
  }, [revealAnswer, exercise.correctCoeff, exercise.correctIntercept]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    if (locked) return;
    const slotId = event.over?.id as string | undefined;
    const tileValue = event.active.data.current?.value as number | undefined;
    if (tileValue === undefined) return;
    if (slotId === "slot-coeff") setCoeff(tileValue);
    else if (slotId === "slot-intercept") setIntercept(tileValue);
    else return;
    justDroppedRef.current = true;
    playClackSound();
  }

  /** Un semplice click (senza trascinamento) sulla tessera riempie la
   * prossima casella vuota in ordine: prima il coefficiente, poi l'intercetta. */
  function handleTileSelect(value: number) {
    if (locked) return;
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      return;
    }
    if (coeff === null) {
      setCoeff(value);
      playClackSound();
    } else if (intercept === null) {
      setIntercept(value);
      playClackSound();
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <GraphAxes
            maxDay={exercise.maxDay}
            maxValue={exercise.maxValue}
            yStep={exercise.yStep}
            axisLabel={exercise.axisLabel}
            quantityLabel={exercise.quantityLabel}
          />
          {hasCurve && (
            <path
              d={quadraticCurveD(coeff, intercept, exercise.maxDay, exercise.maxValue)}
              fill="none"
              stroke={curveColor}
              strokeWidth={2}
            />
          )}
          {exercise.points.map((p) => {
            const px = xScale(p.day);
            const { dx, textAnchor } = coordinateLabelProps(px);
            return (
              <g key={p.day}>
                <circle cx={px} cy={yScale(p.value)} r={4.5} fill="var(--color-brand-500)" />
                <text
                  x={px + dx}
                  y={yScale(p.value)}
                  textAnchor={textAnchor}
                  dominantBaseline="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill="var(--color-ink-700)"
                >
                  ({p.day}, {p.value})
                </text>
              </g>
            );
          })}
        </svg>
        {exercise.showInitialValueCircle && (
          <DayCircle
            label={`${exercise.dayLabel ?? "Giorno"} 0`}
            value={exercise.points[0]?.value ?? null}
            size={120}
            maxValue={exercise.maxValue}
          />
        )}
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveDrag(e.active.data.current?.value as number)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold text-ink-900">y =</span>
            <Slot
              id="slot-coeff"
              value={coeff}
              locked={locked}
              correct={locked && coeff === exercise.correctCoeff}
              showDot={false}
              onClear={() => setCoeff(null)}
            />
            <span className="font-display text-xl font-bold text-ink-900">
              · n<sup className="text-sm">2</sup> +
            </span>
            <Slot
              id="slot-intercept"
              value={intercept}
              locked={locked}
              correct={locked && intercept === exercise.correctIntercept}
              showDot={false}
              onClear={() => setIntercept(null)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-dashed border-ink-300/40 pt-6">
            {exercise.tileValues.map((value) => (
              <NumberTile
                key={value}
                value={value}
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
          <MathText>
            {`Formula corretta: $y = ${exercise.correctCoeff} \\cdot n^2 + ${exercise.correctIntercept}$`}
          </MathText>
        </p>
      )}
    </div>
  );
}
