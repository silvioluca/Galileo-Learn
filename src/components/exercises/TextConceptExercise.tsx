import { useEffect } from "react";
import type { TextConceptExercise as TextConceptExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";

interface Props {
  exercise: TextConceptExerciseT;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

/** Schermata di riepilogo puramente testuale: nessun grafico, solo uno
 * svolgimento a righe (con formule in LaTeX) seguito da "Continua". */
export function TextConceptExercise({ exercise, onReadyToCheck }: Props) {
  useEffect(() => {
    onReadyToCheck(() => true);
  }, [onReadyToCheck]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 text-center">
      {exercise.lines.map((line, i) => (
        <p key={i} className="text-ink-800">
          <MathText>{line}</MathText>
        </p>
      ))}
    </div>
  );
}
