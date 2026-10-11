import clsx from "clsx";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { MultipleChoiceExercise as MultipleChoiceExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import type { CheckStatus } from "./FeedbackBanner";
import { GraphAxes, growthSeriesCurveD, SVG_HEIGHT, SVG_WIDTH } from "./graphGeometry";

interface Props {
  exercise: MultipleChoiceExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

export function MultipleChoiceExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const locked = status !== "unanswered";

  useEffect(() => {
    onReadyToCheck(
      selectedId ? () => selectedId === exercise.correctId : null,
    );
  }, [selectedId, exercise.correctId, onReadyToCheck]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>
      {exercise.compareGraph && (
        <div className="flex justify-center">
          <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
            <GraphAxes
              maxDay={exercise.compareGraph.maxDay}
              maxValue={exercise.compareGraph.maxValue}
              yStep={exercise.compareGraph.yStep}
              axisLabel={exercise.compareGraph.axisLabel}
              quantityLabel={exercise.compareGraph.quantityLabel}
            />
            <path
              d={growthSeriesCurveD(
                exercise.compareGraph.seriesA,
                exercise.compareGraph.maxDay,
                exercise.compareGraph.maxValue,
              )}
              fill="none"
              stroke={exercise.compareGraph.seriesA.color}
              strokeWidth={2}
            />
            <path
              d={growthSeriesCurveD(
                exercise.compareGraph.seriesB,
                exercise.compareGraph.maxDay,
                exercise.compareGraph.maxValue,
              )}
              fill="none"
              stroke={exercise.compareGraph.seriesB.color}
              strokeWidth={2}
            />
          </svg>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {exercise.choices.map((choice) => {
          const isSelected = selectedId === choice.id;
          const isCorrectChoice = choice.id === exercise.correctId;
          const showCorrect =
            (revealAnswer || locked) && isCorrectChoice && locked;
          const showWrong = locked && isSelected && !isCorrectChoice;

          return (
            <button
              type="button"
              key={choice.id}
              disabled={locked}
              onClick={() => setSelectedId(choice.id)}
              className={clsx(
                "pressable flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left font-display font-bold transition-colors",
                !locked && isSelected && "border-brand-500 bg-brand-50 text-brand-700",
                !locked && !isSelected && "border-ink-300/40 bg-white text-ink-900 hover:border-brand-300",
                showCorrect && "border-success-500 bg-success-50 text-success-700",
                showWrong && "border-danger-500 bg-danger-50 text-danger-600",
                locked && !isSelected && !showCorrect && "border-ink-300/30 bg-white text-ink-400",
              )}
            >
              <MathText>{choice.label}</MathText>
              {showCorrect && <Check size={20} />}
              {showWrong && <X size={20} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
