import { useCallback, useEffect, useRef, useState } from "react";
import { playClackSound, playTickSound } from "../../lib/sound";
import type { GraphPointExercise as GraphPointExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import { DayCircle } from "./DayCircle";
import type { CheckStatus } from "./FeedbackBanner";
import {
  coordinateLabelProps,
  exponentialCurveD,
  GraphAxes,
  makeScales,
  PAD_LEFT,
  PAD_TOP,
  PLOT_HEIGHT,
  PLOT_WIDTH,
  SVG_HEIGHT,
  SVG_WIDTH,
} from "./graphGeometry";
import { NumericKeypad, TypedNumberSlot } from "./NumericKeypad";

interface Props {
  exercise: GraphPointExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

export function GraphPointExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  if (exercise.mode === "concept") {
    return <ConceptGraph exercise={exercise} onReadyToCheck={onReadyToCheck} />;
  }
  if (exercise.mode === "typed") {
    return (
      <TypedPointGraph
        exercise={exercise}
        status={status}
        revealAnswer={revealAnswer}
        onReadyToCheck={onReadyToCheck}
      />
    );
  }
  if (exercise.mode === "solve") {
    return (
      <SolvePointGraph
        exercise={exercise}
        status={status}
        revealAnswer={revealAnswer}
        onReadyToCheck={onReadyToCheck}
      />
    );
  }
  return (
    <DragGraph
      exercise={exercise}
      status={status}
      revealAnswer={revealAnswer}
      onReadyToCheck={onReadyToCheck}
    />
  );
}

/** Unità di arrotondamento "carina" (1, 2, 5, 10, 20, 50, ...) scelta in modo
 * da avere all'incirca 20 "tacche" magnetiche lungo l'intera scala. */
function niceSnapUnit(maxValue: number): number {
  const rough = maxValue / 20;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const residual = rough / magnitude;
  let niceResidual = 1;
  if (residual > 5) niceResidual = 10;
  else if (residual > 2) niceResidual = 5;
  else if (residual > 1) niceResidual = 2;
  return niceResidual * magnitude;
}

function DragGraph({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props & { exercise: Extract<GraphPointExerciseT, { mode: "drag" }> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [value, setValue] = useState(0);
  const valueRef = useRef(0);
  const [touched, setTouched] = useState(false);
  const [dragging, setDragging] = useState(false);
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue);

  useEffect(() => {
    onReadyToCheck(
      touched ? () => value === exercise.correctValue : null,
    );
  }, [touched, value, exercise.correctValue, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) {
      setValue(exercise.correctValue);
      setTouched(true);
    }
  }, [revealAnswer, exercise.correctValue]);

  const valueFromClientY = useCallback(
    (clientY: number): number => {
      const rect = svgRef.current!.getBoundingClientRect();
      const scale = rect.height / SVG_HEIGHT;
      const localY = (clientY - rect.top) / scale;
      const raw =
        exercise.maxValue * (1 - (localY - PAD_TOP) / PLOT_HEIGHT);
      const clamped = Math.max(0, Math.min(exercise.maxValue, raw));
      // "ancoramento magnetico": quando ci si avvicina a un numero tondo,
      // il punto vi scatta sopra, così è più facile centrarlo col mouse.
      const unit = niceSnapUnit(exercise.maxValue);
      const nearestSnap = Math.round(clamped / unit) * unit;
      const magneticThreshold = unit * 0.3;
      const snapped =
        Math.abs(clamped - nearestSnap) <= magneticThreshold ? nearestSnap : clamped;
      return Math.round(snapped);
    },
    [exercise.maxValue],
  );

  const updateValue = useCallback((newValue: number) => {
    if (newValue !== valueRef.current) playTickSound();
    valueRef.current = newValue;
    setValue(newValue);
  }, []);

  function handlePointerDown(e: React.PointerEvent) {
    if (locked) return;
    setDragging(true);
    setTouched(true);
    updateValue(valueFromClientY(e.clientY));
  }

  useEffect(() => {
    if (!dragging) return;
    function onMove(e: PointerEvent) {
      updateValue(valueFromClientY(e.clientY));
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
  }, [dragging, valueFromClientY, updateValue]);

  const pointColor = locked
    ? solved
      ? "var(--color-success-500)"
      : "var(--color-danger-500)"
    : "var(--color-brand-500)";

  const showCurve = exercise.showCurveOnSolve && solved;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-8 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
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

          {showCurve && (
            <path
              d={exponentialCurveD(
                exercise.coeff,
                exercise.base,
                exercise.maxDay,
                exercise.maxValue,
              )}
              fill="none"
              stroke="var(--color-brand-400)"
              strokeWidth={2}
            />
          )}

          {exercise.known.map((p) => {
            const px = xScale(p.day);
            const { dx, textAnchor } = coordinateLabelProps(px);
            return (
              <g key={p.day}>
                <circle cx={px} cy={yScale(p.value)} r={4.5} fill="var(--color-ink-300)" />
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

          {/* alone bianco con anello colorato: area di presa più grande per il mouse/dito */}
          {!locked && (
            <circle
              cx={xScale(exercise.targetDay)}
              cy={yScale(value)}
              r={22}
              fill="white"
              stroke="var(--color-brand-300)"
              strokeWidth={2}
              onPointerDown={handlePointerDown}
              style={{ cursor: "grab", touchAction: "none" }}
            />
          )}

          <circle
            id="draggable-point"
            cx={xScale(exercise.targetDay)}
            cy={yScale(value)}
            r={7}
            fill={touched ? pointColor : "var(--color-ink-300)"}
            stroke="white"
            strokeWidth={2}
            onPointerDown={handlePointerDown}
            style={{
              cursor: locked ? "default" : "grab",
              touchAction: "none",
            }}
          />
        </svg>

        <DayCircle
          label={`${exercise.dayLabel ?? "Giorno"} ${exercise.targetDay}`}
          value={touched ? value : null}
          hidden={!touched}
          size={120}
          maxValue={exercise.maxValue}
        />
      </div>
    </div>
  );
}

function TypedPointGraph({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props & { exercise: Extract<GraphPointExerciseT, { mode: "typed" }> }) {
  const [digits, setDigits] = useState("");
  const locked = status !== "unanswered";
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue, exercise.minDay);

  useEffect(() => {
    onReadyToCheck(
      digits.length > 0 ? () => Number(digits) === exercise.correctValue : null,
    );
  }, [digits, exercise.correctValue, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) setDigits(String(exercise.correctValue));
  }, [revealAnswer, exercise.correctValue]);

  function handleDigit(d: string) {
    if (locked) return;
    if (d === "." && digits.includes(".")) return;
    setDigits((prev) => (prev + d).slice(0, 8));
    playClackSound();
  }

  function handleBackspace() {
    if (locked) return;
    setDigits((prev) => prev.slice(0, -1));
  }

  const liveValue = digits.length > 0 ? Number(digits) : null;
  const correct = locked && liveValue === exercise.correctValue;
  const pointColor = locked
    ? correct
      ? "var(--color-success-500)"
      : "var(--color-danger-500)"
    : "var(--color-brand-500)";

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <GraphAxes
            maxDay={exercise.maxDay}
            maxValue={exercise.maxValue}
            yStep={exercise.yStep}
            xStep={exercise.xStep}
            minDay={exercise.minDay}
            axisLabel={exercise.axisLabel}
            quantityLabel={exercise.quantityLabel}
          />

          <path
            d={exponentialCurveD(
              exercise.coeff,
              exercise.base,
              exercise.maxDay,
              exercise.maxValue,
              80,
              exercise.minDay,
            )}
            fill="none"
            stroke="var(--color-brand-400)"
            strokeWidth={2}
          />

          {exercise.known.map((p) => {
            const px = xScale(p.day);
            const { dx, textAnchor } = coordinateLabelProps(px);
            return (
              <g key={p.day}>
                <circle cx={px} cy={yScale(p.value)} r={4.5} fill="var(--color-ink-300)" />
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

          {liveValue !== null && (
            <circle
              cx={xScale(exercise.targetDay)}
              cy={yScale(liveValue)}
              r={7}
              fill={pointColor}
              stroke="white"
              strokeWidth={2}
            />
          )}
        </svg>

        <div className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <span>({exercise.targetDay},</span>
          <TypedNumberSlot
            id="typed-point-value"
            value={digits}
            active={!locked}
            locked={locked}
            correct={correct}
            onSelect={() => {}}
          />
          <span>)</span>
        </div>

        <NumericKeypad onDigit={handleDigit} onBackspace={handleBackspace} disabled={locked} />
      </div>
    </div>
  );
}

function SolvePointGraph({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props & { exercise: Extract<GraphPointExerciseT, { mode: "solve" }> }) {
  const [digits, setDigits] = useState("");
  const locked = status !== "unanswered";
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue, exercise.minDay);

  useEffect(() => {
    onReadyToCheck(
      digits.length > 0 ? () => Number(digits) === exercise.correctX : null,
    );
  }, [digits, exercise.correctX, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) setDigits(String(exercise.correctX));
  }, [revealAnswer, exercise.correctX]);

  function handleDigit(d: string) {
    if (locked) return;
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

  const parsedX = digits.length > 0 ? Number(digits) : null;
  const liveX = parsedX !== null && Number.isFinite(parsedX) ? parsedX : null;
  const correct = locked && liveX === exercise.correctX;
  const pointColor = locked
    ? correct
      ? "var(--color-success-500)"
      : "var(--color-danger-500)"
    : "var(--color-brand-500)";
  const lineY = yScale(exercise.targetValue);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <GraphAxes
            maxDay={exercise.maxDay}
            maxValue={exercise.maxValue}
            yStep={exercise.yStep}
            xStep={exercise.xStep}
            minDay={exercise.minDay}
            axisLabel={exercise.axisLabel}
            quantityLabel={exercise.quantityLabel}
          />

          <path
            d={exponentialCurveD(
              exercise.coeff,
              exercise.base,
              exercise.maxDay,
              exercise.maxValue,
              80,
              exercise.minDay,
            )}
            fill="none"
            stroke="var(--color-brand-400)"
            strokeWidth={2}
          />

          <line
            x1={PAD_LEFT}
            y1={lineY}
            x2={PAD_LEFT + PLOT_WIDTH}
            y2={lineY}
            stroke="var(--color-xp-600)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
          />
          <text
            x={PAD_LEFT + 4}
            y={lineY - 6}
            fontSize={11}
            fontWeight={700}
            fill="var(--color-xp-600)"
          >
            y = {exercise.targetValueLabel ?? exercise.targetValue}
          </text>

          {liveX !== null && (
            <>
              <line
                x1={xScale(liveX)}
                y1={lineY}
                x2={xScale(liveX)}
                y2={PAD_TOP + PLOT_HEIGHT}
                stroke={pointColor}
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
              <circle
                cx={xScale(liveX)}
                cy={lineY}
                r={7}
                fill={pointColor}
                stroke="white"
                strokeWidth={2}
              />
            </>
          )}
        </svg>

        <div className="flex items-center gap-2 font-display text-xl font-bold text-ink-900">
          <span>(</span>
          <TypedNumberSlot
            id="typed-solve-x"
            value={digits}
            active={!locked}
            locked={locked}
            correct={correct}
            onSelect={() => {}}
          />
          <span>, {exercise.targetValueLabel ?? exercise.targetValue})</span>
        </div>

        <NumericKeypad
          onDigit={handleDigit}
          onBackspace={handleBackspace}
          disabled={locked}
          allowNegative
        />
      </div>
    </div>
  );
}

function ConceptGraph({
  exercise,
  onReadyToCheck,
}: {
  exercise: Extract<GraphPointExerciseT, { mode: "concept" }>;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}) {
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue, exercise.minDay);

  useEffect(() => {
    onReadyToCheck(() => true);
  }, [onReadyToCheck]);

  const circleMax = Math.max(
    exercise.circlePoint?.value ?? 0,
    exercise.compare?.circlePoint.value ?? 0,
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center font-display text-2xl font-bold text-ink-950">
        <MathText>{exercise.formula}</MathText>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-8">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <GraphAxes
            maxDay={exercise.maxDay}
            maxValue={exercise.maxValue}
            yStep={exercise.yStep}
            xStep={exercise.xStep}
            minDay={exercise.minDay}
            axisLabel={exercise.axisLabel}
            quantityLabel={exercise.quantityLabel}
          />
          <path
            d={exponentialCurveD(
              exercise.coeff,
              exercise.base,
              exercise.maxDay,
              exercise.maxValue,
              80,
              exercise.minDay,
            )}
            fill="none"
            stroke="var(--color-brand-400)"
            strokeWidth={2}
          />
          {exercise.compare && (
            <path
              d={exponentialCurveD(
                exercise.compare.coeff,
                exercise.compare.base,
                exercise.maxDay,
                exercise.maxValue,
                80,
                exercise.minDay,
              )}
              fill="none"
              stroke="var(--color-success-500)"
              strokeWidth={2}
            />
          )}
          {exercise.points.map((p) => {
            const px = xScale(p.day);
            const { dx, textAnchor } = coordinateLabelProps(px);
            return (
              <g key={p.day}>
                <circle cx={px} cy={yScale(p.value)} r={5} fill="var(--color-brand-500)" />
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
          {exercise.compare && (
            <circle
              cx={xScale(exercise.compare.circlePoint.day)}
              cy={yScale(exercise.compare.circlePoint.value)}
              r={5}
              fill="var(--color-success-500)"
            />
          )}
        </svg>

        {(exercise.circlePoint || exercise.compare) && (
          <div className="flex flex-col gap-4">
            {exercise.circlePoint && (
              <DayCircle
                label={`${exercise.dayLabel ?? "Giorno"} ${exercise.circlePoint.day}`}
                value={exercise.circlePoint.value}
                size={100}
                maxValue={circleMax}
              />
            )}
            {exercise.compare && (
              <DayCircle
                label={`${exercise.dayLabel ?? "Giorno"} ${exercise.compare.circlePoint.day}`}
                value={exercise.compare.circlePoint.value}
                size={100}
                maxValue={circleMax}
              />
            )}
          </div>
        )}
      </div>

      <p className="max-w-lg text-center text-ink-700">
        <MathText>{exercise.conceptText}</MathText>
      </p>
    </div>
  );
}
