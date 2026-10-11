/** Geometria e assi condivisi dagli esercizi a grafico (punto trascinabile,
 * riepilogo con curva, formula), così tutti disegnano sulla stessa griglia. */

import type { GrowthSeries } from "../../types/course";

export const SVG_WIDTH = 320;
export const SVG_HEIGHT = 260;
export const PAD_LEFT = 40;
export const PAD_TOP = 16;
export const PAD_BOTTOM = 32;
export const PAD_RIGHT = 20;
export const PLOT_WIDTH = SVG_WIDTH - PAD_LEFT - PAD_RIGHT;
export const PLOT_HEIGHT = SVG_HEIGHT - PAD_TOP - PAD_BOTTOM;

export function makeScales(maxDay: number, maxValue: number, minDay = 0) {
  const xScale = (day: number) =>
    PAD_LEFT + ((day - minDay) / (maxDay - minDay)) * PLOT_WIDTH;
  const yScale = (value: number) =>
    PAD_TOP + PLOT_HEIGHT - (value / maxValue) * PLOT_HEIGHT;
  return { xScale, yScale };
}

/** Props per l'etichetta "(giorno, valore)" accanto a un punto: normalmente a
 * destra del pallino, ma si ribalta a sinistra quando il punto è troppo
 * vicino al bordo destro del grafico (altrimenti l'etichetta uscirebbe
 * dal viewBox, es. per il punto all'ultimo giorno mostrato). */
export function coordinateLabelProps(px: number): {
  dx: number;
  textAnchor: "start" | "end";
} {
  const flipLeft = px > SVG_WIDTH - 45;
  return flipLeft ? { dx: -8, textAnchor: "end" } : { dx: 8, textAnchor: "start" };
}

/** Traccia della vera funzione $y = \text{coeff} \cdot \text{base}^x$, campionata
 * densamente (non un'interpolazione tra pochi punti): la curva è matematicamente
 * esatta, non solo "esponenziale nell'aspetto". */
export function exponentialCurveD(
  coeff: number,
  base: number,
  maxDay: number,
  maxValue: number,
  samples = 80,
  minDay = 0,
): string {
  const { xScale, yScale } = makeScales(maxDay, maxValue, minDay);
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const x = minDay + (i / samples) * (maxDay - minDay);
    const y = coeff * base ** x;
    const px = xScale(x);
    const py = yScale(Math.min(y, maxValue * 1.4));
    d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
  }
  return d;
}

/** Traccia della retta $y = \text{intercept} + \text{slope} \cdot x$: bastano due
 * punti (è una retta), campionati con lo stesso schema di clamping usato per la
 * curva esponenziale così le due si comportano allo stesso modo vicino ai bordi. */
export function linearCurveD(
  intercept: number,
  slope: number,
  maxDay: number,
  maxValue: number,
): string {
  const { xScale, yScale } = makeScales(maxDay, maxValue);
  let d = "";
  for (let i = 0; i <= 1; i++) {
    const x = i * maxDay;
    const y = intercept + slope * x;
    const px = xScale(x);
    const py = yScale(Math.max(0, Math.min(y, maxValue * 1.4)));
    d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
  }
  return d;
}

/** Traccia della parabola $y = \text{coeff} \cdot x^2 + \text{linear} \cdot x + \text{intercept}$,
 * campionata densamente come la curva esponenziale (stesso schema di clamping vicino ai bordi). */
export function quadraticCurveD(
  coeff: number,
  intercept: number,
  maxDay: number,
  maxValue: number,
  samples = 80,
  linear = 0,
): string {
  const { xScale, yScale } = makeScales(maxDay, maxValue);
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const x = (i / samples) * maxDay;
    const y = coeff * x ** 2 + linear * x + intercept;
    const px = xScale(x);
    const py = yScale(Math.max(0, Math.min(y, maxValue * 1.4)));
    d += i === 0 ? `M ${px} ${py}` : ` L ${px} ${py}`;
  }
  return d;
}

/** Valore di una serie di crescita (lineare, esponenziale o quadratica) a un
 * dato giorno: unica fonte di verità condivisa da tutti gli esercizi di confronto. */
export function growthSeriesValue(series: GrowthSeries, day: number): number {
  switch (series.kind) {
    case "linear":
      return series.intercept + series.slope * day;
    case "exponential":
      return series.coeff * series.base ** day;
    case "quadratic":
      return series.coeff * day ** 2 + (series.linear ?? 0) * day + series.intercept;
  }
}

/** Traccia SVG di una serie di crescita, dispatchando al helper giusto in base a `kind`. */
export function growthSeriesCurveD(
  series: GrowthSeries,
  maxDay: number,
  maxValue: number,
): string {
  switch (series.kind) {
    case "linear":
      return linearCurveD(series.intercept, series.slope, maxDay, maxValue);
    case "exponential":
      return exponentialCurveD(series.coeff, series.base, maxDay, maxValue);
    case "quadratic":
      return quadraticCurveD(series.coeff, series.intercept, maxDay, maxValue, 80, series.linear ?? 0);
  }
}

export function GraphAxes({
  maxDay,
  maxValue,
  yStep,
  xStep = 1,
  minDay = 0,
  axisLabel = "Giorni",
  quantityLabel = "Batteri",
}: {
  maxDay: number;
  maxValue: number;
  yStep: number;
  /** passo delle etichette sull'asse orizzontale (default 1, un'etichetta per
   * ogni giorno): da aumentare quando `maxDay` è grande, per evitare che le
   * etichette si sovrappongano. */
  xStep?: number;
  /** valore minimo (eventualmente negativo) rappresentato sull'asse orizzontale
   * (default 0): l'asse verticale (x = 0) si sposta di conseguenza, non resta
   * più necessariamente sul bordo sinistro del grafico. */
  minDay?: number;
  axisLabel?: string;
  quantityLabel?: string;
}) {
  const { xScale, yScale } = makeScales(maxDay, maxValue, minDay);
  const yAxisX = xScale(0);
  const yTicks = [];
  for (let v = 0; v <= maxValue; v += yStep) yTicks.push(v);
  const xTicks = [];
  for (let d = minDay; d <= maxDay; d += xStep) xTicks.push(d);

  return (
    <>
      {yTicks.map((v) => (
        <g key={`y-${v}`}>
          <line
            x1={PAD_LEFT}
            y1={yScale(v)}
            x2={PAD_LEFT + PLOT_WIDTH}
            y2={yScale(v)}
            stroke="var(--color-ink-300)"
            strokeOpacity={0.3}
          />
          <text
            x={yAxisX - 8}
            y={yScale(v)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={11}
            fill="var(--color-ink-500)"
          >
            {v}
          </text>
        </g>
      ))}
      {xTicks.map((d) => (
        <text
          key={`x-${d}`}
          x={xScale(d)}
          y={PAD_TOP + PLOT_HEIGHT + 18}
          textAnchor="middle"
          fontSize={11}
          fill="var(--color-ink-500)"
        >
          {d}
        </text>
      ))}
      <line
        x1={yAxisX}
        y1={PAD_TOP}
        x2={yAxisX}
        y2={PAD_TOP + PLOT_HEIGHT}
        stroke="var(--color-ink-900)"
        strokeWidth={1.5}
      />
      <line
        x1={PAD_LEFT}
        y1={PAD_TOP + PLOT_HEIGHT}
        x2={PAD_LEFT + PLOT_WIDTH}
        y2={PAD_TOP + PLOT_HEIGHT}
        stroke="var(--color-ink-900)"
        strokeWidth={1.5}
      />
      <text
        x={yAxisX}
        y={PAD_TOP - 4}
        fontSize={11}
        fontWeight={700}
        fill="var(--color-ink-900)"
      >
        {quantityLabel}
      </text>
      <text
        x={PAD_LEFT + PLOT_WIDTH}
        y={SVG_HEIGHT - 4}
        textAnchor="end"
        fontSize={11}
        fontWeight={700}
        fill="var(--color-ink-900)"
      >
        {axisLabel}
      </text>
    </>
  );
}
