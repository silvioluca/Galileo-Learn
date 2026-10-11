import { useMemo } from "react";

interface DotPos {
  x: number;
  y: number;
  dist: number;
}

const CIRCLE_RADIUS = 74;
/** Dimensione "naturale" della griglia di pallini: il viewBox resta sempre
 * questo, così un `size` più piccolo scala l'intero disegno (SVG) invece di
 * ritagliare i pallini più esterni. */
const NATURAL_SIZE = 176;

interface DensityTier {
  dotRadius: number;
  spacingX: number;
  spacingY: number;
}

/** Più il valore massimo del gruppo è grande, più i pallini devono essere
 * piccoli e fitti: altrimenti un cerchio da 2000 e uno da 1000 finirebbero
 * per sembrare identici (entrambi "pieni", oltre la capacità della griglia). */
const DENSITY_TIERS: DensityTier[] = [
  { dotRadius: 4, spacingX: 16, spacingY: 14 },
  { dotRadius: 2.2, spacingX: 8.5, spacingY: 7.5 },
  { dotRadius: 1.4, spacingX: 5.5, spacingY: 5 },
];

/** Griglia di pallini impacchettata in un cerchio, ordinata dal centro verso
 * il bordo così i primi elementi evidenziati formano sempre lo stesso "blob"
 * centrale. Calcolata una sola volta per ciascuna densità e messa in cache. */
function buildDotGrid({ dotRadius, spacingX, spacingY }: DensityTier): DotPos[] {
  const points: DotPos[] = [];
  const rows = Math.ceil(CIRCLE_RADIUS / spacingY) + 1;
  const cols = Math.ceil(CIRCLE_RADIUS / spacingX) + 1;
  for (let row = -rows; row <= rows; row++) {
    const y = row * spacingY;
    const xOffset = row % 2 === 0 ? 0 : spacingX / 2;
    for (let col = -cols; col <= cols; col++) {
      const x = col * spacingX + xOffset;
      const dist = Math.sqrt(x * x + y * y);
      if (dist <= CIRCLE_RADIUS - dotRadius) points.push({ x, y, dist });
    }
  }
  return points.sort((a, b) => a.dist - b.dist);
}

const GRID_CACHE = DENSITY_TIERS.map((tier) => ({
  tier,
  grid: buildDotGrid(tier),
}));

function pickGrid(maxValue: number) {
  if (maxValue > 1000) return GRID_CACHE[2];
  if (maxValue > 150) return GRID_CACHE[1];
  return GRID_CACHE[0];
}

interface DayCircleProps {
  label: string;
  value: number | null;
  hidden?: boolean;
  size?: number;
  /** valore massimo tra tutti i cerchi mostrati insieme (es. nella stessa
   * riga giorno/anno): determina la densità dei pallini e la proporzione
   * (quanti pallini si accendono) in modo coerente tra i vari cerchi.
   * Se assente, si usa `value` stesso (cerchio isolato). */
  maxValue?: number;
  /** colore dei pallini evidenziati (default blu brand): usato per distinguere
   * più cerchi mostrati insieme, es. negli esercizi di confronto tra serie. */
  color?: string;
}

/** Il cerchio puntinato "Day N" con un blob di pallini (proporzionale a
 * `value` rispetto a `maxValue`) al centro tra i pallini grigi, e una
 * targhetta nera con il valore (o "?"). */
export function DayCircle({
  label,
  value,
  hidden,
  size = 176,
  maxValue,
  color = "var(--color-brand-500)",
}: DayCircleProps) {
  const effectiveMax = maxValue ?? value ?? 0;
  const { tier, grid } = pickGrid(effectiveMax);
  const unitsPerDot = effectiveMax > 0 ? effectiveMax / grid.length : 1;

  const highlighted = useMemo(() => {
    const count =
      hidden || value === null
        ? 0
        : Math.min(Math.round(value / unitsPerDot), grid.length);
    return new Set(grid.slice(0, count));
  }, [value, hidden, grid, unitsPerDot]);

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-display text-sm font-bold text-ink-900">{label}</span>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`${-NATURAL_SIZE / 2} ${-NATURAL_SIZE / 2} ${NATURAL_SIZE} ${NATURAL_SIZE}`}
          className="rounded-full border-2 border-ink-900 bg-white"
        >
          {grid.map((dot) => (
            <circle
              key={`${dot.x}-${dot.y}`}
              cx={dot.x}
              cy={dot.y}
              r={tier.dotRadius}
              fill={highlighted.has(dot) ? color : "var(--color-ink-300)"}
              opacity={highlighted.has(dot) ? 1 : 0.45}
            />
          ))}
        </svg>
        <span className="absolute -bottom-3 left-1/2 flex h-7 min-w-9 -translate-x-1/2 items-center justify-center rounded-lg bg-ink-950 px-2 font-display font-bold text-white">
          {hidden ? "?" : value}
        </span>
      </div>
    </div>
  );
}
