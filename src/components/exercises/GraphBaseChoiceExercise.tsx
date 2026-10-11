import clsx from "clsx";
import { useEffect, useState } from "react";
import type { GraphBaseChoiceExercise as GraphBaseChoiceExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import type { CheckStatus } from "./FeedbackBanner";
import {
  coordinateLabelProps,
  exponentialCurveD,
  GraphAxes,
  makeScales,
  SVG_HEIGHT,
  SVG_WIDTH,
} from "./graphGeometry";

interface Props {
  exercise: GraphBaseChoiceExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

/** Grafico con punti etichettati (coordinate visibili): lo studente legge la
 * base della funzione esponenziale e la sceglie tra alcune opzioni. */
export function GraphBaseChoiceExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const locked = status !== "unanswered";
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue);

  useEffect(() => {
    onReadyToCheck(selected !== null ? () => selected === exercise.base : null);
  }, [selected, exercise.base, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) setSelected(exercise.base);
  }, [revealAnswer, exercise.base]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
        <GraphAxes
          maxDay={exercise.maxDay}
          maxValue={exercise.maxValue}
          yStep={exercise.yStep}
          axisLabel={exercise.axisLabel ?? "x"}
          quantityLabel={exercise.quantityLabel ?? "y"}
        />
        <path
          d={exponentialCurveD(exercise.coeff, exercise.base, exercise.maxDay, exercise.maxValue)}
          fill="none"
          stroke="var(--color-brand-400)"
          strokeWidth={2}
        />
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

      <div className="grid w-full gap-3 sm:grid-cols-2">
        {exercise.choices.map((choice) => {
          const isSelected = selected === choice;
          const isCorrectChoice = choice === exercise.base;
          const showCorrect = locked && isCorrectChoice;
          const showWrong = locked && isSelected && !isCorrectChoice;

          return (
            <button
              type="button"
              key={choice}
              disabled={locked}
              onClick={() => setSelected(choice)}
              className={clsx(
                "pressable rounded-2xl border-2 px-5 py-3 text-center font-display font-bold transition-colors",
                !locked && isSelected && "border-brand-500 bg-brand-50 text-brand-700",
                !locked && !isSelected && "border-ink-300/40 bg-white text-ink-900 hover:border-brand-300",
                showCorrect && "border-success-500 bg-success-50 text-success-700",
                showWrong && "border-danger-500 bg-danger-50 text-danger-600",
                locked && !isSelected && !showCorrect && "border-ink-300/30 bg-white text-ink-400",
              )}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
