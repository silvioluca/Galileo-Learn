import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";

const SLOT_SIZE_CLASSES = {
  md: "h-12 w-12",
  sm: "h-10 w-10",
};

/** Casella in cui si rilascia una tessera numerica (usata per equazioni/formule
 * costruite trascinando). Condivisa da tutti gli esercizi con questo meccanismo. */
export function Slot({
  id,
  value,
  locked,
  correct,
  showDot,
  onClear,
  size = "md",
}: {
  id: string;
  value: number | null;
  locked: boolean;
  correct: boolean;
  showDot: boolean;
  onClear: () => void;
  size?: "md" | "sm";
}) {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });
  return (
    <div className="flex items-center gap-2">
      {showDot && (
        <span className="font-display text-xl font-bold text-ink-300">·</span>
      )}
      <div
        ref={setNodeRef}
        id={id}
        className={clsx(
          "flex items-center justify-center rounded-lg border-2 border-dashed",
          SLOT_SIZE_CLASSES[size],
          !locked && isOver && "border-brand-500 bg-brand-50/60",
          !locked && !isOver && "border-ink-300 bg-cream-100/50",
          locked && correct && "border-success-500 bg-success-50/60",
          locked && !correct && value !== null && "border-danger-500 bg-danger-50/60",
        )}
      >
        {value !== null ? (
          <button
            type="button"
            onClick={onClear}
            disabled={locked}
            className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-brand-700 disabled:cursor-default"
          >
            {value}
          </button>
        ) : (
          <span className="text-xs text-ink-300">·</span>
        )}
      </div>
    </div>
  );
}

/** Tessera numerica trascinabile dal "vassoio" (non viene consumata: resta
 * riusabile per riempire più caselle uguali). Un semplice click/tap (senza
 * trascinamento) inserisce il valore nella prossima casella vuota, in ordine. */
export function NumberTile({
  value,
  disabled,
  onSelect,
  size = "md",
}: {
  value: number;
  disabled: boolean;
  onSelect?: (value: number) => void;
  size?: "md" | "sm";
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: `tray-${value}`, data: { value }, disabled });

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      disabled={disabled}
      onClick={() => onSelect?.(value)}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={clsx(
        "touch-none",
        isDragging && "opacity-30",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <NumberChip value={value} size={size} />
    </button>
  );
}

export function NumberChip({
  value,
  dragging,
  size = "md",
}: {
  value: number;
  dragging?: boolean;
  size?: "md" | "sm";
}) {
  return (
    <div
      className={clsx(
        "pressable flex cursor-grab items-center justify-center rounded-lg border-2 border-brand-600 bg-brand-100 font-display text-lg font-bold text-brand-700 active:cursor-grabbing",
        SLOT_SIZE_CLASSES[size],
        dragging && "shadow-soft",
      )}
    >
      {value}
    </div>
  );
}

/** Tessera-frazione trascinabile (es. "2/3"): come NumberTile, ma il valore
 * numerico trasportato è numerator/denominator. Usata per le basi decimali
 * proprie qualsiasi (non solo reciproci 1/n), dove l'intera frazione è
 * un'unica scelta atomica invece di numeratore e denominatore separati. */
export function FractionTile({
  numerator,
  denominator,
  disabled,
  onSelect,
  size = "md",
}: {
  numerator: number;
  denominator: number;
  disabled: boolean;
  onSelect?: (value: number) => void;
  size?: "md" | "sm";
}) {
  const value = numerator / denominator;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `tray-frac-${numerator}-${denominator}`,
    data: { value },
    disabled,
  });

  return (
    <button
      type="button"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      disabled={disabled}
      onClick={() => onSelect?.(value)}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={clsx(
        "touch-none",
        isDragging && "opacity-30",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <FractionChip numerator={numerator} denominator={denominator} dragging={isDragging} size={size} />
    </button>
  );
}

export function FractionChip({
  numerator,
  denominator,
  dragging,
  size = "md",
}: {
  numerator: number;
  denominator: number;
  dragging?: boolean;
  size?: "md" | "sm";
}) {
  return (
    <div
      className={clsx(
        "pressable flex cursor-grab flex-col items-center justify-center gap-0.5 rounded-lg border-2 border-brand-600 bg-brand-100 px-2 py-1.5 font-display text-sm font-bold text-brand-700 active:cursor-grabbing",
        size === "sm" ? "min-w-10" : "min-w-12",
        dragging && "shadow-soft",
      )}
    >
      <span>{numerator}</span>
      <span className="h-[2px] w-4 bg-brand-700" />
      <span>{denominator}</span>
    </div>
  );
}
