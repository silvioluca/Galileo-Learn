import type { Lesson } from "../../../types/course";

export const crescitaDeiBatteri: Lesson = {
  id: "crescita-dei-batteri",
  title: "Crescita dei Batteri",
  status: "playable",
  xpReward: 30,
  exercises: [
    {
      type: "exponential-days",
      mode: "choose",
      id: "batteri-giorno-1",
      prompt:
        "Un batterio si divide e raddoppia ogni giorno. Al giorno 0 c'è 1 batterio. Quanti ce ne saranno al giorno 1?",
      days: [
        { day: 0, value: 1 },
        { day: 1, value: 2 },
      ],
      targetDay: 1,
      revealValue: 2,
      choices: [
        { id: "c1", label: "1" },
        { id: "c2", label: "2" },
        { id: "c3", label: "3" },
        { id: "c4", label: "4" },
      ],
      correctId: "c2",
      explanation: "Un batterio raddoppia ogni giorno: da $1$ a $1 \\times 2 = 2$.",
    },
    {
      type: "exponential-days",
      mode: "choose",
      id: "batteri-giorno-2",
      prompt:
        "Il numero di batteri continua a raddoppiare ogni giorno. Quanti ce ne saranno al giorno 2?",
      days: [
        { day: 0, value: 1 },
        { day: 1, value: 2 },
        { day: 2, value: 4 },
      ],
      targetDay: 2,
      revealValue: 4,
      choices: [
        { id: "c3", label: "3" },
        { id: "c4", label: "4" },
        { id: "c5", label: "5" },
        { id: "c6", label: "6" },
      ],
      correctId: "c4",
      explanation:
        "Anche da giorno 1 a giorno 2 il numero raddoppia: $2 \\times 2 = 4$. Il pattern è coerente ogni giorno.",
    },
    {
      type: "exponential-days",
      mode: "build",
      id: "batteri-espressione-4",
      prompt:
        "Il giorno 2 ci sono 4 batteri: quanti raddoppi a partire da 1 iniziale? Costruisci il prodotto.",
      days: [
        { day: 0, value: 1 },
        { day: 1, value: 2 },
        { day: 2, value: 4 },
      ],
      correctFactors: [2, 2],
      tileValues: [2, 3, 5],
      explanation: "Si parte da $1$ e si raddoppia due volte: $2 \\cdot 2 = 4$.",
    },
    {
      type: "exponential-days",
      mode: "build",
      id: "batteri-espressione-16",
      prompt:
        "Il giorno 4 ci sono 16 batteri. Continuando dal giorno 0 (1 batterio), costruisci il prodotto completo.",
      days: [
        { day: 2, value: 4 },
        { day: 3, value: 8 },
        { day: 4, value: 16 },
      ],
      correctFactors: [2, 2, 2, 2],
      tileValues: [2, 3, 5],
      explanation:
        "Dal giorno 0 al giorno 4 sono passati 4 raddoppi: $2 \\cdot 2 \\cdot 2 \\cdot 2 = 16$.",
    },
    {
      type: "exponential-days",
      mode: "choose",
      id: "batteri-notazione-esponente",
      prompt:
        "Scrivere \"2\" dieci volte di fila è scomodo. Quale espressione rappresenta correttamente il numero di batteri al giorno 10?",
      days: [
        { day: 0, value: 1 },
        { day: 1, value: 2 },
        { day: 2, value: 4 },
        { day: 10, value: 1024 },
      ],
      targetDay: 10,
      revealValue: 1024,
      choices: [
        { id: "e1", label: "$2^{10}$" },
        { id: "e2", label: "$10^2$" },
        { id: "e3", label: "$2 \\times 10$" },
        { id: "e4", label: "$2 + 10$" },
      ],
      correctId: "e1",
      explanation:
        "Il fattore $2$ si ripete dieci volte: $2^{10} = 1024$. L'esponente conta quante volte moltiplichi, non un'addizione o un altro numero.",
    },
    {
      type: "exponential-days",
      mode: "concept",
      id: "crescita-esponenziale-concetto",
      prompt: "",
      days: [
        { day: 0, value: 1 },
        { day: 1, value: 2 },
        { day: 2, value: 4 },
        { day: 3, value: 8 },
      ],
      formula: "$2^n$",
      conceptText:
        "Questo tipo di raddoppio è un esempio di crescita esponenziale: ogni giorno il valore precedente viene moltiplicato per lo stesso numero (qui $2$), invece di crescere sempre della stessa quantità come nelle funzioni lineari.",
    },
  ],
};
