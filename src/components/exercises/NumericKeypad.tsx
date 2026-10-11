import clsx from "clsx";
import { Delete } from "lucide-react";

/** Casella che mostra una cifra digitata (non trascinata): si seleziona con un
 * tap, poi si scrive usando il tastierino numerico sotto l'esercizio. */
export function TypedNumberSlot({
  id,
  value,
  active,
  locked,
  correct,
  onSelect,
  dashed = false,
}: {
  id?: string;
  value: string;
  active: boolean;
  locked: boolean;
  correct?: boolean;
  onSelect: () => void;
  /** se vero, usa lo stesso stile tratteggiato (e la stessa dimensione, h-12 w-12)
   * delle caselle drag-and-drop (Slot/NumberTile), per coerenza visiva con le
   * opzioni sottostanti quando queste condividono quella dimensione. */
  dashed?: boolean;
}) {
  return (
    <button
      type="button"
      id={id}
      onClick={onSelect}
      disabled={locked}
      className={clsx(
        "flex items-center justify-center rounded-lg border-2 font-display text-lg font-bold transition-colors disabled:cursor-default",
        dashed ? "h-12 w-12 border-dashed" : "h-14 min-w-14 px-2",
        !locked && active && (dashed ? "border-brand-500 bg-brand-50/60 text-brand-700" : "border-brand-500 bg-brand-50 text-brand-700"),
        !locked && !active && (dashed ? "border-ink-300 bg-cream-100/50 text-ink-900" : "border-ink-300 bg-white text-ink-900 hover:border-brand-300"),
        locked && correct && (dashed ? "border-success-500 bg-success-50/60 text-success-700" : "border-success-500 bg-success-50 text-success-700"),
        locked && !correct && (dashed ? "border-danger-500 bg-danger-50/60 text-danger-600" : "border-danger-500 bg-danger-50 text-danger-600"),
      )}
    >
      {value || <span className="text-ink-300">·</span>}
    </button>
  );
}

/** Tastierino numerico a schermo: le cifre digitate vanno nella casella
 * attualmente selezionata (vedi TypedNumberSlot). */
export function NumericKeypad({
  onDigit,
  onBackspace,
  disabled,
  square = false,
  allowDecimalPoint = false,
  allowNegative = false,
}: {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  disabled: boolean;
  /** se vero, le cifre diventano quadrati h-12 w-12 (stessa dimensione delle
   * caselle Slot/NumberTile), per coerenza con altre opzioni della stessa dimensione. */
  square?: boolean;
  /** se vero, aggiunge un tasto "." per digitare numeri decimali. */
  allowDecimalPoint?: boolean;
  /** se vero, aggiunge un tasto "−" per digitare numeri negativi (va premuto
   * come primo carattere). */
  allowNegative?: boolean;
}) {
  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <div className="grid grid-cols-5 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <KeypadButton key={d} onClick={() => onDigit(d)} disabled={disabled} square={square}>
            {d}
          </KeypadButton>
        ))}
        <KeypadButton onClick={() => onDigit("0")} disabled={disabled} square={square}>
          0
        </KeypadButton>
        {allowDecimalPoint && (
          <KeypadButton onClick={() => onDigit(".")} disabled={disabled} square={square}>
            .
          </KeypadButton>
        )}
        {allowNegative && (
          <KeypadButton onClick={() => onDigit("-")} disabled={disabled} square={square}>
            −
          </KeypadButton>
        )}
      </div>
      <button
        type="button"
        onClick={onBackspace}
        disabled={disabled}
        aria-label="Cancella l'ultima cifra"
        className="pressable flex items-center justify-center gap-1.5 rounded-xl border-2 border-ink-300/40 bg-white py-2 font-display text-sm font-bold text-ink-500 hover:border-danger-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Delete size={16} />
        Cancella
      </button>
    </div>
  );
}

function KeypadButton({
  children,
  onClick,
  disabled,
  square = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  square?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "pressable flex items-center justify-center rounded-lg border-2 border-brand-600 bg-brand-100 font-display text-lg font-bold text-brand-700 disabled:cursor-not-allowed disabled:opacity-50",
        square ? "h-12 w-12" : "h-11",
      )}
    >
      {children}
    </button>
  );
}
