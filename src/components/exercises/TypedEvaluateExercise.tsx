import { useEffect, useState } from "react";
import { playClackSound } from "../../lib/sound";
import type { TypedEvaluateExercise as TypedEvaluateExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import type { CheckStatus } from "./FeedbackBanner";
import { NumericKeypad, TypedNumberSlot } from "./NumericKeypad";

interface Props {
  exercise: TypedEvaluateExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

/** Equazione (coeff ·) base^esponente = risultato, con UNA delle due incognite
 * (risultato o esponente) da scrivere con il tastierino numerico. */
export function TypedEvaluateExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const [digits, setDigits] = useState("");
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;
  const correctValue =
    exercise.unknown === "result" ? exercise.result : exercise.exponent;

  useEffect(() => {
    onReadyToCheck(digits.length > 0 ? () => Number(digits) === correctValue : null);
  }, [digits, correctValue, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) setDigits(String(correctValue));
  }, [revealAnswer, correctValue]);

  function handleDigit(d: string) {
    if (locked) return;
    if (d === "." && digits.includes(".")) return;
    setDigits((prev) => (prev + d).slice(0, 9));
    playClackSound();
  }

  function handleBackspace() {
    if (locked) return;
    setDigits((prev) => prev.slice(0, -1));
  }

  const correct = locked && Number(digits) === correctValue;

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-display text-2xl font-bold text-ink-900">
            {exercise.coeff !== 1 && `${exercise.coeff} · `}
          </span>
          <span className="font-display text-2xl font-bold text-ink-900">
            {exercise.base}
          </span>
          <div className="relative -top-3">
            {exercise.unknown === "exponent" ? (
              <TypedNumberSlot
                id="typed-value"
                value={digits}
                active={!locked}
                locked={locked}
                correct={correct}
                onSelect={() => {}}
              />
            ) : (
              <span className="font-display text-sm font-bold text-ink-900">
                {exercise.exponent}
              </span>
            )}
          </div>
          <span className="ml-2 font-display text-2xl font-bold text-ink-300">=</span>
          {exercise.unknown === "result" ? (
            <TypedNumberSlot
              id="typed-value"
              value={digits}
              active={!locked}
              locked={locked}
              correct={correct}
              onSelect={() => {}}
            />
          ) : (
            <span className="font-display text-2xl font-bold text-ink-900">
              {exercise.result.toLocaleString("it-IT")}
            </span>
          )}
        </div>

        <NumericKeypad
          onDigit={handleDigit}
          onBackspace={handleBackspace}
          disabled={locked}
          allowDecimalPoint
        />
      </div>

      {solved && (
        <p className="text-center font-display text-sm font-bold text-success-700">
          {exercise.coeff !== 1 && `${exercise.coeff} · `}
          {exercise.base}
          <sup>{exercise.exponent}</sup> = {exercise.result.toLocaleString("it-IT")}
        </p>
      )}
    </div>
  );
}
