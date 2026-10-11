import clsx from "clsx";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { playTickSound } from "../../lib/sound";
import type { CompareGrowthExercise as CompareGrowthExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import { DayCircle } from "./DayCircle";
import type { CheckStatus } from "./FeedbackBanner";
import {
  GraphAxes,
  growthSeriesCurveD as seriesCurveD,
  growthSeriesValue as seriesValue,
  makeScales,
  PAD_LEFT,
  PAD_TOP,
  PLOT_HEIGHT,
  PLOT_WIDTH,
  SVG_HEIGHT,
  SVG_WIDTH,
} from "./graphGeometry";

interface Props {
  exercise: CompareGrowthExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

export function CompareGrowthExercise({ exercise, status, revealAnswer, onReadyToCheck }: Props) {
  if (exercise.mode === "concept") {
    return <ConceptCompare exercise={exercise} onReadyToCheck={onReadyToCheck} />;
  }
  return (
    <DragCompare
      exercise={exercise}
      status={status}
      revealAnswer={revealAnswer}
      onReadyToCheck={onReadyToCheck}
    />
  );
}

function DragCompare({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props & { exercise: Extract<CompareGrowthExerciseT, { mode: "drag" }> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [day, setDay] = useState(0);
  const dayRef = useRef(0);
  const [touched, setTouched] = useState(false);
  const [dragging, setDragging] = useState(false);
  const locked = status !== "unanswered";
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue);

  useEffect(() => {
    onReadyToCheck(touched ? () => day === exercise.correctDay : null);
  }, [touched, day, exercise.correctDay, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) {
      setDay(exercise.correctDay);
      dayRef.current = exercise.correctDay;
      setTouched(true);
    }
  }, [revealAnswer, exercise.correctDay]);

  const dayFromClientX = useCallback(
    (clientX: number): number => {
      const rect = svgRef.current!.getBoundingClientRect();
      const scale = rect.width / SVG_WIDTH;
      const localX = (clientX - rect.left) / scale;
      const raw = ((localX - PAD_LEFT) / PLOT_WIDTH) * exercise.maxDay;
      const clamped = Math.max(0, Math.min(exercise.maxDay, raw));
      return Math.round(clamped);
    },
    [exercise.maxDay],
  );

  const updateDay = useCallback((newDay: number) => {
    if (newDay !== dayRef.current) playTickSound();
    dayRef.current = newDay;
    setDay(newDay);
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    if (locked) return;
    setDragging(true);
    setTouched(true);
    updateDay(dayFromClientX(e.clientX));
  }

  useEffect(() => {
    if (!dragging) return;
    function onMove(e: PointerEvent) {
      updateDay(dayFromClientX(e.clientX));
    }
    function onUp() {
      setDragging(false);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging, dayFromClientX, updateDay]);

  function handleStartOver() {
    if (locked || !touched) return;
    updateDay(0);
    setTouched(false);
  }

  const valueA = seriesValue(exercise.seriesA, day);
  const valueB = seriesValue(exercise.seriesB, day);
  const topValue = Math.min(Math.max(valueA, valueB), exercise.maxValue);
  const axisY = PAD_TOP + PLOT_HEIGHT;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <svg
          ref={svgRef}
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        >
          <GraphAxes
            maxDay={exercise.maxDay}
            maxValue={exercise.maxValue}
            yStep={exercise.yStep}
            xStep={exercise.xStep}
            axisLabel={exercise.axisLabel}
            quantityLabel={exercise.quantityLabel}
          />
          <path
            d={seriesCurveD(exercise.seriesA, exercise.maxDay, exercise.maxValue)}
            fill="none"
            stroke={exercise.seriesA.color}
            strokeWidth={2}
          />
          <path
            d={seriesCurveD(exercise.seriesB, exercise.maxDay, exercise.maxValue)}
            fill="none"
            stroke={exercise.seriesB.color}
            strokeWidth={2}
          />

          {touched && (
            <>
              <line
                x1={xScale(day)}
                y1={axisY}
                x2={xScale(day)}
                y2={yScale(topValue)}
                stroke="var(--color-ink-500)"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
              <circle
                cx={xScale(day)}
                cy={yScale(Math.min(valueA, exercise.maxValue))}
                r={4.5}
                fill={exercise.seriesA.color}
              />
              <circle
                cx={xScale(day)}
                cy={yScale(Math.min(valueB, exercise.maxValue))}
                r={4.5}
                fill={exercise.seriesB.color}
              />
            </>
          )}

          {/* alone bianco con anello colorato: area di presa più grande per il mouse/dito */}
          {!locked && (
            <circle
              cx={xScale(day)}
              cy={axisY}
              r={20}
              fill="white"
              stroke="var(--color-brand-300)"
              strokeWidth={2}
              onPointerDown={handlePointerDown}
              style={{ cursor: "grab", touchAction: "none" }}
            />
          )}
          <circle
            id="draggable-day"
            cx={xScale(day)}
            cy={axisY}
            r={7}
            fill={touched ? "var(--color-brand-500)" : "var(--color-ink-300)"}
            stroke="white"
            strokeWidth={2}
            onPointerDown={handlePointerDown}
            style={{
              cursor: locked ? "default" : "grab",
              touchAction: "none",
            }}
          />
        </svg>

        <div className="flex flex-col gap-4">
          <DayCircle
            label=""
            value={touched ? Math.round(valueA) : null}
            hidden={!touched}
            size={100}
            maxValue={exercise.maxValue}
            color={exercise.seriesA.color}
          />
          <DayCircle
            label=""
            value={touched ? Math.round(valueB) : null}
            hidden={!touched}
            size={100}
            maxValue={exercise.maxValue}
            color={exercise.seriesB.color}
          />
        </div>
      </div>

      {!locked && (
        <button
          type="button"
          onClick={handleStartOver}
          disabled={!touched}
          className={clsx(
            "flex items-center gap-1.5 font-display text-sm font-bold",
            touched ? "text-ink-500 hover:text-ink-700" : "cursor-not-allowed text-ink-300",
          )}
        >
          <RotateCcw size={14} />
          Ricomincia
        </button>
      )}
    </div>
  );
}

function ConceptCompare({
  exercise,
  onReadyToCheck,
}: {
  exercise: Extract<CompareGrowthExerciseT, { mode: "concept" }>;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}) {
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue);

  useEffect(() => {
    onReadyToCheck(() => true);
  }, [onReadyToCheck]);

  const valueA = seriesValue(exercise.seriesA, exercise.circleDay);
  const valueB = seriesValue(exercise.seriesB, exercise.circleDay);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="max-w-lg text-center font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-8">
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
            d={seriesCurveD(exercise.seriesA, exercise.maxDay, exercise.maxValue)}
            fill="none"
            stroke={exercise.seriesA.color}
            strokeWidth={2}
          />
          <path
            d={seriesCurveD(exercise.seriesB, exercise.maxDay, exercise.maxValue)}
            fill="none"
            stroke={exercise.seriesB.color}
            strokeWidth={2}
          />
          <circle
            cx={xScale(exercise.circleDay)}
            cy={yScale(Math.min(valueA, exercise.maxValue))}
            r={5}
            fill={exercise.seriesA.color}
          />
          <circle
            cx={xScale(exercise.circleDay)}
            cy={yScale(Math.min(valueB, exercise.maxValue))}
            r={5}
            fill={exercise.seriesB.color}
          />
        </svg>

        <div className="flex flex-col gap-4">
          <DayCircle
            label=""
            value={Math.round(valueA)}
            size={100}
            maxValue={exercise.maxValue}
            color={exercise.seriesA.color}
          />
          <DayCircle
            label=""
            value={Math.round(valueB)}
            size={100}
            maxValue={exercise.maxValue}
            color={exercise.seriesB.color}
          />
        </div>
      </div>
    </div>
  );
}
