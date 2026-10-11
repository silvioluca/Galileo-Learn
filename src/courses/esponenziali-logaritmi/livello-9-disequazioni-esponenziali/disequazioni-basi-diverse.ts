import type { Lesson } from "../../../types/course";

export const disequazioniBasiDiverse: Lesson = {
  id: "disequazioni-basi-diverse",
  title: "Basi Diverse a Confronto",
  status: "playable",
  xpReward: 95,
  exercises: [
    {
      type: "text-concept",
      id: "dbd-concetto-1",
      lines: [
        "Come per le equazioni, anche nelle disequazioni con basi diverse il trucco è riscrivere entrambi i lati come potenze di una base comune.",
        "Poi confronti gli esponenti come nella lezione precedente, ricordando la regola su crescente/decrescente.",
      ],
    },
    {
      type: "percent-growth",
      id: "dbd-1",
      prompt: "Ricordi questa equazione? Trova il valore di confine: $2^x = 4^{x-1}$.",
      steps: [
        "$$\\begin{aligned} 2^x &= 4^{x-1} \\\\ 2^x &= (2^2)^{x-1} \\\\ 2^x &= 2^{2x-2} \\end{aligned}$$",
      ],
      prefixText: "x =",
      tileValues: [1, 2, 3, 4],
      correctValue: 2,
      explanation: "$4^{x-1} = 2^{2x-2}$. Uguagliando gli esponenti: $x = 2x - 2$, quindi $x = 2$.",
    },
    {
      type: "growth-compare-typed",
      id: "dbd-2",
      prompt: "Ora la disequazione: per quali valori di $x$ è $2^x > 4^{x-1}$?",
      steps: [
        "$$\\begin{aligned} 2^x &> 4^{x-1} \\\\ 2^x &> 2^{2x-2} \\end{aligned}$$",
      ],
      maxDay: 4,
      maxValue: 70,
      yStep: 10,
      axisLabel: "x",
      quantityLabel: "y",
      seriesA: {
        kind: "exponential",
        coeff: 1,
        base: 2,
        color: "var(--color-brand-500)",
        label: "y = 2^x",
      },
      seriesB: {
        kind: "exponential",
        coeff: 0.25,
        base: 4,
        color: "var(--color-success-500)",
        label: "y = 4^{x-1}",
      },
      requiresOperator: true,
      tileValues: [1, 2, 3, 4],
      correctOperator: "<",
      correctValue: 2,
      explanation:
        "Le due curve si incontrano in $x = 2$ (dove $x = 2x-2$). Entrambe le basi, $2$ e $4$, sono maggiori di 1: $2^x$ è più grande PRIMA dell'incontro, quindi $x < 2$.",
    },
    {
      type: "text-concept",
      id: "dbd-concetto-2",
      lines: [
        "Una volta riportate le basi allo stesso numero, applichi la stessa regola delle disequazioni elementari: qui entrambe le basi sono maggiori di 1, quindi il verso resta quello letto sul grafico.",
      ],
    },
    {
      type: "percent-growth",
      id: "dbd-3",
      prompt: "Trova il valore di confine: $\\left(\\dfrac{1}{4}\\right)^x = \\left(\\dfrac{1}{2}\\right)^{x+1}$.",
      steps: [
        "$$\\begin{aligned} \\left(\\tfrac{1}{4}\\right)^x &= \\left(\\tfrac{1}{2}\\right)^{x+1} \\\\ \\left(\\tfrac{1}{2}\\right)^{2x} &= \\left(\\tfrac{1}{2}\\right)^{x+1} \\end{aligned}$$",
      ],
      prefixText: "x =",
      tileValues: [0, 1, 2, 3],
      correctValue: 1,
      explanation: "$\\left(\\dfrac{1}{4}\\right)^x = \\left(\\dfrac{1}{2}\\right)^{2x}$. Uguagliando: $2x = x + 1$, quindi $x = 1$.",
    },
    {
      type: "growth-compare-typed",
      id: "dbd-4",
      prompt: "Per quali valori di $x$ è $\\left(\\dfrac{1}{4}\\right)^x > \\left(\\dfrac{1}{2}\\right)^{x+1}$?",
      maxDay: 4,
      maxValue: 1,
      yStep: 0.25,
      axisLabel: "x",
      quantityLabel: "y",
      seriesA: {
        kind: "exponential",
        coeff: 1,
        base: 0.25,
        color: "var(--color-brand-500)",
        label: "y = (1/4)^x",
      },
      seriesB: {
        kind: "exponential",
        coeff: 0.5,
        base: 0.5,
        color: "var(--color-success-500)",
        label: "y = (1/2)^{x+1}",
      },
      requiresOperator: true,
      tileValues: [0, 1, 2, 3],
      correctOperator: "<",
      correctValue: 1,
      explanation:
        "Le curve si incontrano in $x = 1$. Entrambe le basi sono tra $0$ e $1$ (decrescenti): il verso si INVERTE rispetto a quello che vedi sul grafico prima dell'incontro, quindi $x < 1$.",
    },
    {
      type: "text-concept",
      id: "dbd-concetto-3",
      lines: [
        "Quando, dopo la riscrittura, entrambe le basi sono minori di 1, ricordati che le funzioni sono decrescenti: il verso della disequazione si inverte rispetto al confronto \"ingenuo\" tra gli esponenti.",
      ],
    },
  ],
};
