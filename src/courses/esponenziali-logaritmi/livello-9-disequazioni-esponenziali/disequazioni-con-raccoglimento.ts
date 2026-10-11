import type { Lesson } from "../../../types/course";

export const disequazioniConRaccoglimento: Lesson = {
  id: "disequazioni-con-raccoglimento",
  title: "Disequazioni con Raccoglimento",
  status: "playable",
  xpReward: 105,
  exercises: [
    {
      type: "text-concept",
      id: "dcr-concetto-1",
      lines: [
        "Come nelle equazioni, quando la stessa potenza compare più volte puoi raccoglierla. Il risultato è una disequazione elementare, che sai già risolvere.",
      ],
    },
    {
      type: "growth-compare-typed",
      id: "dcr-1",
      prompt: "Risolvi: $2^x + 2^{x+1} > 24$.",
      steps: [
        "$$\\begin{aligned} 2^x + 2^{x+1} &> 24 \\\\ 2^x(1 + 2) &> 24 \\\\ 2^x &> 8 \\end{aligned}$$",
      ],
      maxDay: 5,
      maxValue: 40,
      yStep: 8,
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
        kind: "linear",
        intercept: 8,
        slope: 0,
        color: "var(--color-success-500)",
        label: "y = 8",
      },
      requiresOperator: true,
      tileValues: [1, 2, 3, 4],
      correctOperator: ">",
      correctValue: 3,
      explanation:
        "Dopo il raccoglimento ottieni $2^x > 8 = 2^3$. La base $2$ è maggiore di $1$ (crescente): il verso resta invariato, $x > 3$.",
    },
    {
      type: "text-concept",
      id: "dcr-concetto-2",
      lines: [
        "Il raccoglimento funziona anche con una sottrazione: $3^{x+1} - 3^x = 3^x(3 - 1) = 2 \\cdot 3^x$.",
      ],
    },
    {
      type: "growth-compare-typed",
      id: "dcr-2",
      prompt: "Risolvi: $3^{x+1} - 3^x > 18$.",
      steps: [
        "$$\\begin{aligned} 3^{x+1} - 3^x &> 18 \\\\ 3^x(3 - 1) &> 18 \\\\ 3^x &> 9 \\end{aligned}$$",
      ],
      maxDay: 3,
      maxValue: 30,
      yStep: 5,
      axisLabel: "x",
      quantityLabel: "y",
      seriesA: {
        kind: "exponential",
        coeff: 1,
        base: 3,
        color: "var(--color-brand-500)",
        label: "y = 3^x",
      },
      seriesB: {
        kind: "linear",
        intercept: 9,
        slope: 0,
        color: "var(--color-success-500)",
        label: "y = 9",
      },
      requiresOperator: true,
      tileValues: [1, 2, 3, 4],
      correctOperator: ">",
      correctValue: 2,
      explanation:
        "Dopo il raccoglimento ottieni $3^x > 9 = 3^2$. La base $3$ è maggiore di $1$: il verso resta invariato, $x > 2$.",
    },
    {
      type: "text-concept",
      id: "dcr-concetto-3",
      lines: [
        "Attenzione quando la base, dopo il raccoglimento, è minore di 1: la funzione è decrescente, quindi il verso finale si inverte.",
      ],
    },
    {
      type: "growth-compare-typed",
      id: "dcr-3",
      prompt: "Risolvi: $\\left(\\dfrac{1}{2}\\right)^x + \\left(\\dfrac{1}{2}\\right)^{x+1} < \\dfrac{3}{4}$.",
      steps: [
        "$$\\begin{aligned} \\left(\\tfrac{1}{2}\\right)^x + \\left(\\tfrac{1}{2}\\right)^{x+1} &< \\tfrac{3}{4} \\\\ \\left(\\tfrac{1}{2}\\right)^x\\left(1 + \\tfrac{1}{2}\\right) &< \\tfrac{3}{4} \\\\ \\left(\\tfrac{1}{2}\\right)^x &< \\tfrac{1}{2} \\end{aligned}$$",
      ],
      maxDay: 4,
      maxValue: 1,
      yStep: 0.25,
      axisLabel: "x",
      quantityLabel: "y",
      seriesA: {
        kind: "exponential",
        coeff: 1,
        base: 0.5,
        color: "var(--color-brand-500)",
        label: "y = (1/2)^x",
      },
      seriesB: {
        kind: "linear",
        intercept: 0.5,
        slope: 0,
        color: "var(--color-success-500)",
        label: "y = 1/2",
      },
      requiresOperator: true,
      tileValues: [0, 1, 2, 3],
      correctOperator: ">",
      correctValue: 1,
      explanation:
        "Dopo il raccoglimento ottieni $\\left(\\dfrac{1}{2}\\right)^x < \\dfrac{1}{2}$. La base è tra $0$ e $1$ (decrescente): il verso si inverte, $x > 1$.",
    },
    {
      type: "text-concept",
      id: "dcr-concetto-4",
      lines: [
        "In sintesi: raccogli la potenza comune, riduci alla disequazione elementare $\\text{base}^x \\lessgtr \\text{numero}$, poi applica la regola di crescente/decrescente per il verso finale.",
      ],
    },
  ],
};
