import type { Exercise } from "../../types/course";
import { AlgebraTilesExercise } from "./AlgebraTilesExercise";
import { CompareGrowthExercise } from "./CompareGrowthExercise";
import { ExponentEquationExercise } from "./ExponentEquationExercise";
import { ExponentialDaysExercise } from "./ExponentialDaysExercise";
import type { CheckStatus } from "./FeedbackBanner";
import { FormulaBuildExercise } from "./FormulaBuildExercise";
import { GraphBaseChoiceExercise } from "./GraphBaseChoiceExercise";
import { GraphPointExercise } from "./GraphPointExercise";
import { GrowthCompareTypedExercise } from "./GrowthCompareTypedExercise";
import { LinearBuildExercise } from "./LinearBuildExercise";
import { MultipleChoiceExercise } from "./MultipleChoiceExercise";
import { PercentGrowthExercise } from "./PercentGrowthExercise";
import { QuadraticBuildExercise } from "./QuadraticBuildExercise";
import { RuleMatchingExercise } from "./RuleMatchingExercise";
import { TextConceptExercise } from "./TextConceptExercise";
import { TypedEvaluateExercise } from "./TypedEvaluateExercise";
import { TypedFormulaExercise } from "./TypedFormulaExercise";
import { TwoPointsFormulaExercise } from "./TwoPointsFormulaExercise";

interface Props {
  exercise: Exercise;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

export function ExerciseRenderer({ exercise, ...rest }: Props) {
  switch (exercise.type) {
    case "rule-matching":
      return <RuleMatchingExercise exercise={exercise} {...rest} />;
    case "algebra-tiles":
      return <AlgebraTilesExercise exercise={exercise} {...rest} />;
    case "multiple-choice":
      return <MultipleChoiceExercise exercise={exercise} {...rest} />;
    case "exponential-days":
      return <ExponentialDaysExercise exercise={exercise} {...rest} />;
    case "graph-point":
      return <GraphPointExercise exercise={exercise} {...rest} />;
    case "formula-build":
      return <FormulaBuildExercise exercise={exercise} {...rest} />;
    case "exponent-equation":
      return <ExponentEquationExercise exercise={exercise} {...rest} />;
    case "evaluate-expression":
      return <TypedEvaluateExercise exercise={exercise} {...rest} />;
    case "typed-formula":
      return <TypedFormulaExercise exercise={exercise} {...rest} />;
    case "graph-base-choice":
      return <GraphBaseChoiceExercise exercise={exercise} {...rest} />;
    case "two-points-formula":
      return <TwoPointsFormulaExercise exercise={exercise} {...rest} />;
    case "linear-build":
      return <LinearBuildExercise exercise={exercise} {...rest} />;
    case "quadratic-build":
      return <QuadraticBuildExercise exercise={exercise} {...rest} />;
    case "compare-growth":
      return <CompareGrowthExercise exercise={exercise} {...rest} />;
    case "growth-compare-typed":
      return <GrowthCompareTypedExercise exercise={exercise} {...rest} />;
    case "text-concept":
      return <TextConceptExercise exercise={exercise} onReadyToCheck={rest.onReadyToCheck} />;
    case "percent-growth":
      return <PercentGrowthExercise exercise={exercise} {...rest} />;
  }
}
