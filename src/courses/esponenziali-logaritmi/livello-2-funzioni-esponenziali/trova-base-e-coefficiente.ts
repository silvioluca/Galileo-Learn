import type { Lesson } from "../../../types/course";

export const trovaBaseECoefficiente: Lesson = {
  id: "trova-base-e-coefficiente",
  title: "Trova Base e Coefficiente",
  status: "playable",
  xpReward: 45,
  exercises: [
    {
      type: "formula-build",
      id: "tbc-meme-1",
      prompt:
        "Un meme ha raggiunto 3 persone al Giorno 0 e 12 persone al Giorno 1. Trova la funzione esponenziale che passa per entrambi i punti.",
      points: [
        { day: 0, value: 3 },
        { day: 1, value: 12 },
      ],
      maxDay: 1,
      maxValue: 25,
      yStep: 5,
      tileValues: [2, 3, 4, 5, 6],
      correctCoeff: 3,
      correctBase: 4,
      quantityLabel: "Persone",
      showInitialValueCircle: true,
      explanation:
        "$a = f(0) = 3$. Per trovare $b$ confrontiamo $f(1)$ e $f(0)$: $12 \\div 3 = 4$. Quindi $y = 3 \\cdot 4^n$.",
    },
    {
      type: "graph-point",
      mode: "concept",
      id: "tbc-concetto",
      prompt: "",
      coeff: 2,
      base: 5,
      points: [
        { day: 0, value: 2 },
        { day: 1, value: 10 },
      ],
      maxDay: 1,
      maxValue: 25,
      yStep: 5,
      quantityLabel: "Persone",
      formula: "$f(x) = 2 \\cdot 5^n$",
      conceptText:
        "In una funzione esponenziale $f(x) = a \\cdot b^x$, il valore di $f(0)$ ci dà il coefficiente $a$. Possiamo poi confrontare i valori di $f(1)$ e $f(0)$ per trovare $b$: $b = f(1) \\div f(0)$.",
    },
    {
      type: "two-points-formula",
      id: "tbc-astratto-1",
      prompt:
        "Una funzione esponenziale della forma $f(x) = a \\cdot b^x$ ha due punti noti. Trova i valori di $a$ e $b$.",
      valueAtZero: 7,
      valueAtOne: 14,
      tileValues: [2, 5, 7, 9, 14],
      correctCoeff: 7,
      correctBase: 2,
      explanation: "$a = f(0) = 7$. $b = f(1) \\div f(0) = 14 \\div 7 = 2$.",
    },
    {
      type: "two-points-formula",
      id: "tbc-astratto-2",
      prompt:
        "Una funzione esponenziale della forma $f(x) = a \\cdot b^x$ ha due punti noti. Trova i valori di $a$ e $b$.",
      valueAtZero: 6,
      valueAtOne: 24,
      tileValues: [2, 4, 6, 8, 10],
      correctCoeff: 6,
      correctBase: 4,
      explanation: "$a = f(0) = 6$. $b = f(1) \\div f(0) = 24 \\div 6 = 4$.",
    },
    {
      type: "multiple-choice",
      id: "tbc-mc-formula-b",
      prompt:
        "Se $f(x) = a \\cdot b^x$, quanto vale $b$ in termini di $f(0)$ e $f(1)$?",
      choices: [
        { id: "c1", label: "$f(1) - f(0)$" },
        { id: "c2", label: "$f(0) \\cdot f(1)$" },
        { id: "c3", label: "$\\dfrac{f(1)}{f(0)}$" },
        { id: "c4", label: "$\\dfrac{f(0)}{f(1)}$" },
      ],
      correctId: "c3",
      explanation:
        "Ogni volta che $x$ aumenta di $1$, il valore viene moltiplicato per $b$: quindi $f(1) = f(0) \\cdot b$, cioè $b = \\dfrac{f(1)}{f(0)}$.",
    },
    {
      type: "graph-point",
      mode: "concept",
      id: "tbc-riepilogo",
      prompt: "",
      coeff: 4,
      base: 3,
      points: [
        { day: 0, value: 4 },
        { day: 1, value: 12 },
      ],
      maxDay: 1,
      maxValue: 30,
      yStep: 6,
      quantityLabel: "Persone",
      formula: "$f(x) = a \\cdot b^x$",
      conceptText:
        "Conoscendo $f(0)$ e $f(1)$ possiamo sempre trovare l'espressione completa: $a = f(0)$ e $b = \\dfrac{f(1)}{f(0)}$.",
    },
    {
      type: "formula-build",
      id: "tbc-pratica-finale",
      prompt: "Trova l'equazione della funzione esponenziale che passa per entrambi i punti.",
      points: [
        { day: 0, value: 2 },
        { day: 1, value: 8 },
      ],
      maxDay: 1,
      maxValue: 35,
      yStep: 5,
      tileValues: [2, 3, 4, 5, 6],
      correctCoeff: 2,
      correctBase: 4,
      quantityLabel: "Persone",
      showInitialValueCircle: true,
      explanation: "$a = f(0) = 2$. $b = f(1) \\div f(0) = 8 \\div 2 = 4$. Quindi $y = 2 \\cdot 4^n$.",
    },
  ],
};
