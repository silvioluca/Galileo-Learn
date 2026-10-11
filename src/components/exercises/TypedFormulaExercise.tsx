import clsx from "clsx";
import { useEffect, useState } from "react";
import { playClackSound } from "../../lib/sound";
import type { TypedFormulaExercise as TypedFormulaExerciseT } from "../../types/course";
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
import { NumericKeypad, TypedNumberSlot } from "./NumericKeypad";

interface Props {
  exercise: TypedFormulaExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

type SlotId = "coeff" | "base" | "baseNum" | "baseDen";

/** Come FormulaBuildExercise ma con tastierino numerico invece che tessere da
 * trascinare. Il coefficiente può essere: da scrivere, già fisso, o assente
 * (formula ridotta a $y = \text{base}^n$). Se `fractionalBase` è vero, la
 * base si scrive come frazione (numeratore/denominatore digitati separatamente). */
export function TypedFormulaExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const hasCoeffSlot = exercise.correctCoeff !== undefined;
  const hasFixedCoeff = exercise.fixedCoeff !== undefined;
  const hasBaseSlot = exercise.fixedBase === undefined;
  const isFractionalBase = exercise.fractionalBase ?? false;
  const [coeffDigits, setCoeffDigits] = useState("");
  const [baseDigits, setBaseDigits] = useState("");
  const [baseNumDigits, setBaseNumDigits] = useState("");
  const [baseDenDigits, setBaseDenDigits] = useState("");
  const [activeSlot, setActiveSlot] = useState<SlotId>(
    hasCoeffSlot ? "coeff" : isFractionalBase ? "baseNum" : "base",
  );
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;
  const exponentVar = exercise.notation === "f(x)" ? "x" : "n";
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue);
  const liveBase = !hasBaseSlot
    ? (exercise.fixedBase ?? null)
    : isFractionalBase
      ? baseNumDigits.length > 0 && baseDenDigits.length > 0
        ? Number(baseNumDigits) / Number(baseDenDigits)
        : null
      : baseDigits.length > 0
        ? Number(baseDigits)
        : null;
  const liveCoeff =
    exercise.fixedCoeff ?? (coeffDigits.length > 0 ? Number(coeffDigits) : 1);
  const curveColor = locked
    ? solved
      ? "var(--color-success-500)"
      : "var(--color-danger-500)"
    : "var(--color-brand-400)";

  useEffect(() => {
    const coeffReady = hasCoeffSlot ? coeffDigits.length > 0 : true;
    const baseReady = !hasBaseSlot
      ? true
      : isFractionalBase
        ? baseNumDigits.length > 0 && baseDenDigits.length > 0
        : baseDigits.length > 0;
    onReadyToCheck(
      coeffReady && baseReady
        ? () =>
            (!hasCoeffSlot || Number(coeffDigits) === exercise.correctCoeff) &&
            (!hasBaseSlot ||
              (isFractionalBase
                ? Number(baseNumDigits) === exercise.correctBaseNumerator &&
                  Number(baseDenDigits) === exercise.correctBaseDenominator
                : Number(baseDigits) === exercise.correctBase))
        : null,
    );
  }, [
    hasCoeffSlot,
    hasBaseSlot,
    isFractionalBase,
    coeffDigits,
    baseDigits,
    baseNumDigits,
    baseDenDigits,
    exercise.correctCoeff,
    exercise.correctBase,
    exercise.correctBaseNumerator,
    exercise.correctBaseDenominator,
    onReadyToCheck,
  ]);

  useEffect(() => {
    if (revealAnswer) {
      if (hasCoeffSlot) setCoeffDigits(String(exercise.correctCoeff));
      if (hasBaseSlot) {
        if (isFractionalBase) {
          setBaseNumDigits(String(exercise.correctBaseNumerator));
          setBaseDenDigits(String(exercise.correctBaseDenominator));
        } else {
          setBaseDigits(String(exercise.correctBase));
        }
      }
    }
  }, [
    revealAnswer,
    hasCoeffSlot,
    hasBaseSlot,
    isFractionalBase,
    exercise.correctCoeff,
    exercise.correctBase,
    exercise.correctBaseNumerator,
    exercise.correctBaseDenominator,
  ]);

  function handleDigit(d: string) {
    if (locked) return;
    if (activeSlot === "coeff" && hasCoeffSlot) {
      setCoeffDigits((prev) => (prev + d).slice(0, 6));
    } else if (activeSlot === "baseNum" && hasBaseSlot && isFractionalBase) {
      setBaseNumDigits((prev) => (prev + d).slice(0, 4));
    } else if (activeSlot === "baseDen" && hasBaseSlot && isFractionalBase) {
      setBaseDenDigits((prev) => (prev + d).slice(0, 4));
    } else if (activeSlot === "base" && hasBaseSlot && !isFractionalBase) {
      if (d === "." && baseDigits.includes(".")) return;
      setBaseDigits((prev) => (prev + d).slice(0, 6));
    }
    playClackSound();
  }

  function handleBackspace() {
    if (locked) return;
    if (activeSlot === "coeff" && hasCoeffSlot) {
      setCoeffDigits((prev) => prev.slice(0, -1));
    } else if (activeSlot === "baseNum" && hasBaseSlot && isFractionalBase) {
      setBaseNumDigits((prev) => prev.slice(0, -1));
    } else if (activeSlot === "baseDen" && hasBaseSlot && isFractionalBase) {
      setBaseDenDigits((prev) => prev.slice(0, -1));
    } else if (activeSlot === "base" && hasBaseSlot && !isFractionalBase) {
      setBaseDigits((prev) => prev.slice(0, -1));
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="self-start font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      {!exercise.hideGraph && (
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
          <GraphAxes
            maxDay={exercise.maxDay}
            maxValue={exercise.maxValue}
            yStep={exercise.yStep}
            xStep={exercise.xStep}
            axisLabel={exercise.axisLabel}
            quantityLabel={exercise.quantityLabel}
          />
          {liveBase !== null && (
            <path
              d={exponentialCurveD(liveCoeff, liveBase, exercise.maxDay, exercise.maxValue)}
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
      )}

      <div className="flex w-full flex-col items-center gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
        <div className="flex items-center gap-2">
          {!exercise.hidePrefix && (
            <span className="font-display text-xl font-bold text-ink-900">
              {exercise.notation === "f(x)" ? "f(x) =" : "y ="}
            </span>
          )}
          {hasFixedCoeff && (
            <span className="font-display text-xl font-bold text-ink-900">
              {exercise.fixedCoeff} ·
            </span>
          )}
          {hasCoeffSlot && (
            <>
              <TypedNumberSlot
                id="typed-coeff"
                value={coeffDigits}
                active={activeSlot === "coeff"}
                locked={locked}
                correct={locked && Number(coeffDigits) === exercise.correctCoeff}
                onSelect={() => setActiveSlot("coeff")}
              />
              <span className="font-display text-xl font-bold text-ink-300">·</span>
            </>
          )}
          <div className="relative flex items-center">
            {isFractionalBase && hasBaseSlot && (
              <span
                className="font-display inline-block font-light text-ink-900"
                style={{ fontSize: "1.4rem", transform: "scaleY(2.2)" }}
              >
                (
              </span>
            )}
            {isFractionalBase && hasBaseSlot ? (
              <div className="flex flex-col items-center gap-0.5">
                <TypedNumberSlot
                  id="typed-base-num"
                  value={baseNumDigits}
                  active={activeSlot === "baseNum"}
                  locked={locked}
                  correct={locked && Number(baseNumDigits) === exercise.correctBaseNumerator}
                  onSelect={() => setActiveSlot("baseNum")}
                  dashed
                />
                <span className="h-[2px] w-8 bg-ink-900" />
                <TypedNumberSlot
                  id="typed-base-den"
                  value={baseDenDigits}
                  active={activeSlot === "baseDen"}
                  locked={locked}
                  correct={locked && Number(baseDenDigits) === exercise.correctBaseDenominator}
                  onSelect={() => setActiveSlot("baseDen")}
                  dashed
                />
              </div>
            ) : hasBaseSlot ? (
              <TypedNumberSlot
                id="typed-base"
                value={baseDigits}
                active={activeSlot === "base"}
                locked={locked}
                correct={locked && Number(baseDigits) === exercise.correctBase}
                onSelect={() => setActiveSlot("base")}
              />
            ) : (
              <span className="flex h-14 min-w-14 items-center justify-center px-2 font-display text-lg font-bold text-ink-900">
                {exercise.fixedBaseLabel ?? exercise.fixedBase}
              </span>
            )}
            {isFractionalBase && hasBaseSlot && (
              <span
                className="font-display inline-block font-light text-ink-900"
                style={{ fontSize: "1.4rem", transform: "scaleY(2.2)" }}
              >
                )
              </span>
            )}
            {!exercise.hideExponent && (
              <span
                className={clsx(
                  "absolute font-display text-sm font-bold text-ink-500",
                  isFractionalBase && hasBaseSlot ? "-top-1.5 -right-4" : "-top-1.5 -right-3",
                )}
              >
                {exponentVar}
              </span>
            )}
          </div>
        </div>

        <NumericKeypad
          onDigit={handleDigit}
          onBackspace={handleBackspace}
          disabled={locked}
          allowDecimalPoint={exercise.allowDecimalBase}
        />
      </div>

      {solved && (
        <p className="text-center font-display text-sm font-bold text-success-700">
          <MathText>
            {`Formula corretta: $${exercise.hidePrefix ? "" : `${exercise.notation === "f(x)" ? "f(x)" : "y"} = `}${
              hasFixedCoeff
                ? `${exercise.fixedCoeff} \\cdot `
                : hasCoeffSlot
                  ? `${exercise.correctCoeff} \\cdot `
                  : ""
            }${
              isFractionalBase
                ? `\\left(\\dfrac{${exercise.correctBaseNumerator}}{${exercise.correctBaseDenominator}}\\right)${exercise.hideExponent ? "" : `^{${exponentVar}}`}`
                : exercise.fixedBaseLatex
                  ? `\\left(${exercise.fixedBaseLatex}\\right)${exercise.hideExponent ? "" : `^{${exponentVar}}`}`
                  : `${exercise.correctBase}${exercise.hideExponent ? "" : `^{${exponentVar}}`}`
            }$`}
          </MathText>
        </p>
      )}
    </div>
  );
}
