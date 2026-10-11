import type { Lesson } from "../../../types/course";

export const decrescita: Lesson = {
  id: "decrescita",
  title: "Decrescita",
  status: "playable",
  xpReward: 45,
  exercises: [
    {
      type: "exponential-days",
      mode: "choose",
      id: "decrescita-foglie-1",
      prompt:
        "Un albero perde le foglie con l'arrivo dell'autunno. Inizia con 2000 foglie. Ogni giorno, il numero di foglie sull'albero si dimezza. Il giorno successivo, quante foglie ci sono sull'albero?",
      days: [
        { day: 0, value: 2000 },
        { day: 1, value: 1000 },
      ],
      targetDay: 1,
      choices: [
        { id: "c700", label: "700" },
        { id: "c800", label: "800" },
        { id: "c900", label: "900" },
        { id: "c1000", label: "1000" },
      ],
      correctId: "c1000",
      revealValue: 1000,
      explanation: "$2000 \\div 2 = 1000$: ogni giorno il numero di foglie viene dimezzato.",
    },
    {
      type: "exponential-days",
      mode: "choose",
      id: "decrescita-foglie-2",
      prompt:
        "Ogni giorno, il numero di foglie sull'albero si dimezza. Quante foglie ci sono sull'albero al Giorno 2?",
      days: [
        { day: 0, value: 2000 },
        { day: 1, value: 1000 },
      ],
      targetDay: 2,
      choices: [
        { id: "c500", label: "500" },
        { id: "c600", label: "600" },
        { id: "c700", label: "700" },
        { id: "c800", label: "800" },
      ],
      correctId: "c500",
      revealValue: 500,
      explanation: "$1000 \\div 2 = 500$.",
    },
    {
      type: "exponential-days",
      mode: "build",
      id: "decrescita-foglie-4",
      prompt:
        "Ogni giorno, il numero di foglie sull'albero si dimezza. Quante foglie ci sono sull'albero al Giorno 4? Costruisci il prodotto a partire dal Giorno 2.",
      days: [
        { day: 0, value: 2000 },
        { day: 1, value: 1000 },
        { day: 2, value: 500 },
      ],
      fixedPrefix: 500,
      correctFactors: [0.5, 0.5],
      tileValues: [0.1, 0.5, 2],
      explanation:
        "Dal Giorno 2 al Giorno 4 passano due dimezzamenti: $500 \\cdot 0.5 \\cdot 0.5 = 125$.",
    },
    {
      type: "exponent-equation",
      id: "decrescita-foglie-esponente-7",
      prompt: "Completa l'espressione per il numero di foglie sull'albero al Giorno 7.",
      fixedCoeff: 2000,
      base: 0.5,
      targetResult: 15.625,
      correctExponent: 7,
      hideResult: true,
      tileValues: [5, 6, 7, 8],
      explanation:
        "L'esponente corrisponde sempre al numero del giorno: al Giorno 7 l'esponente è $7$.",
    },
    {
      type: "exponential-days",
      mode: "concept",
      id: "decrescita-foglie-concetto",
      prompt: "",
      days: [
        { day: 0, value: 2000 },
        { day: 1, value: 1000 },
        { day: 2, value: 500 },
        { day: 3, value: 250 },
      ],
      formula: "$2000 \\cdot \\left(\\dfrac{1}{2}\\right)^n$",
      conceptText:
        "Ogni giorno puoi moltiplicare il numero di foglie per $\\dfrac{1}{2}$ per trovare il numero di foglie il giorno successivo. Diciamo che il numero di foglie sull'albero decresce esponenzialmente.",
    },
    {
      type: "exponential-days",
      mode: "choose",
      id: "decrescita-atomi-1",
      prompt:
        "Metà degli atomi in un campione radioattivo decade ogni anno. Partendo da 800 atomi, quanti te ne aspetti che rimangano dopo 1 anno?",
      days: [
        { day: 0, value: 800 },
        { day: 1, value: 400 },
      ],
      targetDay: 1,
      dayLabel: "Anno",
      choices: [
        { id: "c200", label: "200" },
        { id: "c300", label: "300" },
        { id: "c400", label: "400" },
        { id: "c500", label: "500" },
      ],
      correctId: "c400",
      revealValue: 400,
      explanation: "$800 \\div 2 = 400$.",
    },
    {
      type: "exponential-days",
      mode: "build",
      id: "decrescita-atomi-3",
      prompt:
        "Metà degli atomi in un campione radioattivo decade ogni anno. Partendo da 800 atomi, completa l'espressione per il numero di atomi che ti aspetti rimangano all'Anno 3.",
      days: [
        { day: 0, value: 800 },
        { day: 1, value: 400 },
      ],
      dayLabel: "Anno",
      fixedPrefix: 800,
      correctFactors: [0.5, 0.5, 0.5],
      tileValues: [0.1, 0.5, 2],
      explanation:
        "Dall'Anno 0 all'Anno 3 passano tre dimezzamenti: $800 \\cdot 0.5 \\cdot 0.5 \\cdot 0.5 = 100$.",
    },
    {
      type: "exponent-equation",
      id: "decrescita-atomi-esponente-5",
      prompt:
        "Metà degli atomi in un campione radioattivo decade ogni anno. Completa l'espressione per il numero di atomi radioattivi rimasti all'Anno 5.",
      fixedCoeff: 800,
      base: 0.5,
      targetResult: 25,
      correctExponent: 5,
      hideResult: true,
      tileValues: [1, 2, 3, 4, 5],
      explanation: "L'esponente corrisponde al numero di anni trascorsi: per l'Anno 5 l'esponente è $5$.",
    },
  ],
};
