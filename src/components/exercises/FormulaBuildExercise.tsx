import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { playClackSound } from "../../lib/sound";
import type { FormulaBuildExercise as FormulaBuildExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import { DayCircle } from "./DayCircle";
import type { CheckStatus } from "./FeedbackBanner";
import {
  coordinateLabelProps,
  exponentialCurveD,
  GraphAxes,
  makeScales,
  SVG_HEIGHT,
  SVG_WIDTH,
} from "./graphGeometry";
import { FractionChip, FractionTile, NumberChip, NumberTile, Slot } from "./NumberTiles";

interface Props {
  exercise: FormulaBuildExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

/** Casella per una base scelta come tessera-frazione atomica (es. "2/3"):
 * numeratore e denominatore appaiono insieme, riempiti da un'unica tessera. */
function FractionBaseSlot({
  chosen,
  locked,
  correct,
  onClear,
}: {
  chosen: { numerator: number; denominator: number } | null;
  locked: boolean;
  correct: boolean;
  onClear: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: "slot-base", disabled: locked });
  return (
    <div
      ref={setNodeRef}
      className={clsx(
        "flex w-12 flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-dashed px-2 py-1.5",
        !locked && isOver && "border-brand-500 bg-brand-50/60",
        !locked && !isOver && "border-ink-300 bg-cream-100/50",
        locked && correct && "border-success-500 bg-success-50/60",
        locked && !correct && chosen !== null && "border-danger-500 bg-danger-50/60",
      )}
    >
      {chosen ? (
        <button
          type="button"
          onClick={onClear}
          disabled={locked}
          className="flex flex-col items-center font-display text-lg font-bold text-brand-700 disabled:cursor-default"
        >
          <span>{chosen.numerator}</span>
          <span className="my-0.5 h-[2px] w-5 bg-ink-900" />
          <span>{chosen.denominator}</span>
        </button>
      ) : (
        <span className="text-xs text-ink-300">·</span>
      )}
    </div>
  );
}

export function FormulaBuildExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const hasCoeffSlot = exercise.correctCoeff !== undefined;
  const hasFixedCoeff = exercise.fixedCoeff !== undefined;
  const hasBaseSlot = exercise.fixedBase === undefined;
  const [coeff, setCoeff] = useState<number | null>(null);
  const [base, setBase] = useState<number | null>(exercise.fixedBase ?? null);
  const [activeDrag, setActiveDrag] = useState<number | null>(null);
  const justDroppedRef = useRef(false);
  const locked = status !== "unanswered";
  const solved = status === "correct" || revealAnswer;
  const { xScale, yScale } = makeScales(exercise.maxDay, exercise.maxValue);
  const liveCoeff = exercise.fixedCoeff ?? coeff ?? 1;
  const usesReciprocal = exercise.fractionalBaseDenominator || exercise.negativeExponent;
  const liveBase = base !== null && usesReciprocal ? 1 / base : base;
  const curveColor = locked
    ? solved
      ? "var(--color-success-500)"
      : "var(--color-danger-500)"
    : "var(--color-brand-400)";
  const hasFractionTiles = exercise.fractionBaseTiles !== undefined;
  // Le caselle si rimpiccioliscono leggermente quando la base è una frazione,
  // così la frazione risulta più equilibrata (numeratore e denominatore della
  // stessa dimensione) senza occupare troppo spazio in orizzontale.
  const tileSize = exercise.fractionalBaseDenominator || hasFractionTiles ? "sm" : "md";
  const slotSizeClass = tileSize === "sm" ? "h-10 w-10" : "h-12 w-12";
  const exponentVar = exercise.notation === "f(x)" ? "x" : "n";
  const chosenFraction =
    hasFractionTiles && base !== null
      ? (exercise.fractionBaseTiles!.find((f) => Math.abs(f.numerator / f.denominator - base) < 1e-9) ?? null)
      : null;
  const activeFraction =
    hasFractionTiles && activeDrag !== null
      ? exercise.fractionBaseTiles!.find((f) => Math.abs(f.numerator / f.denominator - activeDrag) < 1e-9)
      : undefined;
  const correctFractionTile = hasFractionTiles
    ? exercise.fractionBaseTiles!.find((f) => Math.abs(f.numerator / f.denominator - exercise.correctBase) < 1e-9)
    : undefined;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  useEffect(() => {
    const ready = hasCoeffSlot ? coeff !== null && base !== null : base !== null;
    onReadyToCheck(
      ready
        ? () =>
            (!hasCoeffSlot || coeff === exercise.correctCoeff) &&
            (!hasBaseSlot || base === exercise.correctBase)
        : null,
    );
  }, [hasCoeffSlot, hasBaseSlot, coeff, base, exercise.correctCoeff, exercise.correctBase, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) {
      if (hasCoeffSlot) setCoeff(exercise.correctCoeff!);
      if (hasBaseSlot) setBase(exercise.correctBase);
    }
  }, [revealAnswer, hasCoeffSlot, hasBaseSlot, exercise.correctCoeff, exercise.correctBase]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    if (locked) return;
    const slotId = event.over?.id as string | undefined;
    const tileValue = event.active.data.current?.value as number | undefined;
    if (tileValue === undefined) return;
    if (slotId === "slot-coeff") setCoeff(tileValue);
    else if (slotId === "slot-base" && hasBaseSlot) setBase(tileValue);
    else return;
    justDroppedRef.current = true;
    playClackSound();
  }

  /** Un semplice click (senza trascinamento) sulla tessera riempie la
   * prossima casella vuota in ordine: prima il coefficiente, poi la base.
   * Quando la base si sceglie tra tessere-frazione (`fractionBaseTiles`), le
   * tessere numeriche riempiono solo il coefficiente: la base arriva
   * esclusivamente da `handleFractionSelect`. */
  function handleTileSelect(value: number) {
    if (locked) return;
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      return;
    }
    if (hasCoeffSlot && coeff === null) {
      setCoeff(value);
      playClackSound();
    } else if (hasBaseSlot && base === null && !hasFractionTiles) {
      setBase(value);
      playClackSound();
    }
  }

  function handleFractionSelect(value: number) {
    if (locked) return;
    if (justDroppedRef.current) {
      justDroppedRef.current = false;
      return;
    }
    setBase(value);
    playClackSound();
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
            <span className="font-display text-xl font-bold text-ink-900">
              {exercise.notation === "f(x)" ? "f(x) =" : "y ="}
            </span>
            {hasFixedCoeff && (
              <span className="font-display text-xl font-bold text-ink-900">
                {exercise.fixedCoeff} ·
              </span>
            )}
            {hasCoeffSlot && (
              <>
                <Slot
                  id="slot-coeff"
                  value={coeff}
                  locked={locked}
                  correct={locked && coeff === exercise.correctCoeff}
                  showDot={false}
                  onClear={() => setCoeff(null)}
                  size={tileSize}
                />
                <span className="font-display text-xl font-bold text-ink-300">·</span>
              </>
            )}
            <div className="relative flex items-center">
              {(exercise.fractionalBaseDenominator || hasFractionTiles) && (
                <span
                  className="font-display inline-block font-light text-ink-900"
                  style={{ fontSize: "1.4rem", transform: "scaleY(2.2)" }}
                >
                  (
                </span>
              )}
              {hasFractionTiles ? (
                <FractionBaseSlot
                  chosen={chosenFraction}
                  locked={locked}
                  correct={locked && base === exercise.correctBase}
                  onClear={() => setBase(null)}
                />
              ) : exercise.fractionalBaseDenominator ? (
                <div className="flex flex-col items-center px-1">
                  <div
                    className={clsx(
                      "flex items-center justify-center font-display text-lg font-bold text-ink-900",
                      slotSizeClass,
                    )}
                  >
                    1
                  </div>
                  <span className="-my-1 h-[2px] w-full bg-ink-900" />
                  {hasBaseSlot ? (
                    <Slot
                      id="slot-base"
                      value={base}
                      locked={locked}
                      correct={locked && base === exercise.correctBase}
                      showDot={false}
                      onClear={() => setBase(null)}
                      size={tileSize}
                    />
                  ) : (
                    <span
                      className={clsx(
                        "flex items-center justify-center font-display text-xl font-bold text-ink-900",
                        slotSizeClass,
                      )}
                    >
                      {exercise.fixedBase}
                    </span>
                  )}
                </div>
              ) : hasBaseSlot ? (
                <Slot
                  id="slot-base"
                  value={base}
                  locked={locked}
                  correct={locked && base === exercise.correctBase}
                  showDot={false}
                  onClear={() => setBase(null)}
                  size={tileSize}
                />
              ) : (
                <span
                  className={clsx(
                    "flex items-center justify-center font-display text-xl font-bold text-ink-900",
                    slotSizeClass,
                  )}
                >
                  {exercise.fixedBase}
                </span>
              )}
              {(exercise.fractionalBaseDenominator || hasFractionTiles) && (
                <span
                  className="font-display inline-block font-light text-ink-900"
                  style={{ fontSize: "1.4rem", transform: "scaleY(2.2)" }}
                >
                  )
                </span>
              )}
              <span className="absolute -top-1.5 -right-4 font-display text-sm font-bold text-ink-500">
                {exercise.negativeExponent ? `−${exponentVar}` : exponentVar}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-dashed border-ink-300/40 pt-6">
            {exercise.tileValues.map((value) => (
              <NumberTile
                key={value}
                value={value}
                disabled={locked}
                onSelect={handleTileSelect}
                size={tileSize}
              />
            ))}
            {exercise.fractionBaseTiles?.map((f) => (
              <FractionTile
                key={`${f.numerator}/${f.denominator}`}
                numerator={f.numerator}
                denominator={f.denominator}
                disabled={locked}
                onSelect={handleFractionSelect}
                size={tileSize}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeDrag !== null &&
            (activeFraction ? (
              <FractionChip numerator={activeFraction.numerator} denominator={activeFraction.denominator} dragging />
            ) : (
              <NumberChip value={activeDrag} dragging />
            ))}
        </DragOverlay>
      </DndContext>

      {solved && (
        <p className="text-center font-display text-sm font-bold text-success-700">
          <MathText>
            {`Formula corretta: $${exercise.notation === "f(x)" ? "f(x)" : "y"} = ${
              hasFixedCoeff
                ? `${exercise.fixedCoeff} \\cdot `
                : hasCoeffSlot
                  ? `${exercise.correctCoeff} \\cdot `
                  : ""
            }${
              hasFractionTiles
                ? `\\left(\\dfrac{${correctFractionTile?.numerator}}{${correctFractionTile?.denominator}}\\right)^{${exponentVar}}`
                : exercise.fractionalBaseDenominator
                  ? `\\left(\\dfrac{1}{${exercise.correctBase}}\\right)^{${exponentVar}}`
                  : exercise.negativeExponent
                    ? `${exercise.correctBase}^{-${exponentVar}}`
                    : `${exercise.correctBase}^{${exponentVar}}`
            }$`}
          </MathText>
        </p>
      )}
    </div>
  );
}
