import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AlgebraTilesExercise as AlgebraTilesExerciseT } from "../../types/course";
import { MathText } from "../math/MathText";
import type { CheckStatus } from "./FeedbackBanner";

type TileType = "square" | "linear" | "unit";
type ZoneId = "zoneA" | "zoneB";

function tileLabel(tileType: TileType, variable: string): string {
  if (tileType === "square") return `$${variable}^2$`;
  if (tileType === "linear") return `$${variable}$`;
  return "$1$";
}

/** "2z" ma "z" (non "1z") quando il coefficiente è 1, come si scrive in matematica. */
function factorExpression(coeffA: number, variable: string): string {
  return coeffA === 1 ? variable : `${coeffA}${variable}`;
}

const TRAY_TILES: TileType[] = ["square", "linear", "unit"];

interface Props {
  exercise: AlgebraTilesExerciseT;
  status: CheckStatus;
  revealAnswer: boolean;
  onReadyToCheck: (checkFn: (() => boolean) | null) => void;
}

export function AlgebraTilesExercise({
  exercise,
  status,
  revealAnswer,
  onReadyToCheck,
}: Props) {
  const [zones, setZones] = useState<Record<ZoneId, TileType | null>>({
    zoneA: null,
    zoneB: null,
  });
  const [activeDrag, setActiveDrag] = useState<TileType | null>(null);
  const locked = status !== "unanswered";

  useEffect(() => {
    const bothFilled = zones.zoneA !== null && zones.zoneB !== null;
    onReadyToCheck(
      bothFilled
        ? () => zones.zoneA === "square" && zones.zoneB === "linear"
        : null,
    );
  }, [zones, onReadyToCheck]);

  useEffect(() => {
    if (revealAnswer) {
      setZones({ zoneA: "square", zoneB: "linear" });
    }
  }, [revealAnswer]);

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    const zoneId = event.over?.id as ZoneId | undefined;
    const tileType = event.active.data.current?.tileType as
      | TileType
      | undefined;
    if (!zoneId || !tileType || locked) return;
    setZones((prev) => ({ ...prev, [zoneId]: tileType }));
  }

  function clearZone(zoneId: ZoneId) {
    if (locked) return;
    setZones((prev) => ({ ...prev, [zoneId]: null }));
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display text-xl font-bold text-ink-950">
        <MathText>{exercise.prompt}</MathText>
      </h2>

      <DndContext
        onDragStart={(e) =>
          setActiveDrag(e.active.data.current?.tileType as TileType)
        }
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-6 rounded-2xl border border-ink-300/30 bg-white p-6 shadow-soft">
          <p className="text-sm text-ink-500">
            Trascina le tessere per costruire il modello ad area di{" "}
            <MathText>{`$${factorExpression(exercise.coeffA, exercise.variable)}(${exercise.variable} + ${exercise.constB})$`}</MathText>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <DropZone
              id="zoneA"
              label={`${exercise.variable} × ${exercise.variable}  (×${exercise.coeffA})`}
              content={zones.zoneA}
              variable={exercise.variable}
              locked={locked}
              expected="square"
              onClear={() => clearZone("zoneA")}
            />
            <span className="font-display text-2xl font-bold text-ink-300">
              +
            </span>
            <DropZone
              id="zoneB"
              label={`${exercise.variable} × ${exercise.constB}  (×${exercise.coeffA})`}
              content={zones.zoneB}
              variable={exercise.variable}
              locked={locked}
              expected="linear"
              onClear={() => clearZone("zoneB")}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-dashed border-ink-300/40 pt-6">
            {TRAY_TILES.map((tileType) => (
              <TrayTile
                key={tileType}
                tileType={tileType}
                variable={exercise.variable}
                disabled={locked}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeDrag && (
            <TileChip
              tileType={activeDrag}
              variable={exercise.variable}
              dragging
            />
          )}
        </DragOverlay>
      </DndContext>

      {(status === "correct" || revealAnswer) && (
        <p className="text-center font-display text-lg font-bold text-success-700">
          <MathText>{`$${factorExpression(exercise.coeffA, exercise.variable)}(${exercise.variable} + ${exercise.constB}) = ${exercise.resultLatex}$`}</MathText>
        </p>
      )}
    </div>
  );
}

function TrayTile({
  tileType,
  variable,
  disabled,
}: {
  tileType: TileType;
  variable: string;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `tray-${tileType}`,
      data: { tileType },
      disabled,
    });

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      disabled={disabled}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={clsx(
        "touch-none",
        isDragging && "opacity-30",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <TileChip tileType={tileType} variable={variable} />
    </button>
  );
}

function TileChip({
  tileType,
  variable,
  dragging,
}: {
  tileType: TileType;
  variable: string;
  dragging?: boolean;
}) {
  return (
    <div
      className={clsx(
        "pressable flex h-16 w-16 cursor-grab items-center justify-center rounded-xl border-2 border-brand-600 bg-brand-100 font-display text-lg font-bold text-brand-700 active:cursor-grabbing",
        dragging && "shadow-soft",
      )}
    >
      <MathText>{tileLabel(tileType, variable)}</MathText>
    </div>
  );
}

function DropZone({
  id,
  label,
  content,
  variable,
  locked,
  expected,
  onClear,
}: {
  id: ZoneId;
  label: string;
  content: TileType | null;
  variable: string;
  locked: boolean;
  expected: TileType;
  onClear: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });
  const isCorrect = content === expected;

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={setNodeRef}
        className={clsx(
          "flex h-20 w-20 items-center justify-center rounded-xl border-2 border-dashed",
          !locked && isOver && "border-brand-500 bg-brand-50",
          !locked && !isOver && "border-ink-300 bg-cream-100",
          locked && isCorrect && "border-success-500 bg-success-50",
          locked && !isCorrect && content && "border-danger-500 bg-danger-50",
        )}
      >
        {content ? (
          <div className="relative">
            <TileChip tileType={content} variable={variable} />
            {!locked && (
              <button
                type="button"
                onClick={onClear}
                aria-label="Rimuovi tessera"
                className="absolute -top-2 -right-2 rounded-full bg-ink-950 p-0.5 text-white"
              >
                <X size={12} />
              </button>
            )}
            {locked && isCorrect && (
              <span className="absolute -top-2 -right-2 rounded-full bg-success-500 p-0.5 text-white">
                <Check size={12} />
              </span>
            )}
          </div>
        ) : (
          <span className="text-xs text-ink-300">vuoto</span>
        )}
      </div>
      <span className="text-center text-xs font-semibold text-ink-500">
        {label}
      </span>
    </div>
  );
}
