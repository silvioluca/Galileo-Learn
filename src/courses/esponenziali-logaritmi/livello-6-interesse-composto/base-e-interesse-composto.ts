import type { Lesson } from "../../../types/course";

export const baseEInteresseComposto: Lesson = {
  id: "base-e-interesse-composto",
  title: "La Base e nell'Interesse Composto",
  status: "playable",
  xpReward: 75,
  exercises: [
    {
      type: "text-concept",
      id: "be-concetto-1",
      lines: [
        "Hai visto investimenti crescere con fattori come $1{,}04$ o $1{,}25$. Un numero speciale, che compare continuamente in natura e in finanza, è $e \\approx 2{,}71828\\ldots$",
        "Proprio come per qualunque altra base, una funzione $f(n) = A \\cdot e^n$ cresce di un fattore $e$ a ogni passo: solo, quel fattore è irrazionale.",
      ],
    },
    {
      type: "typed-formula",
      id: "be-1",
      prompt:
        "Una coltura di batteri parte da 2 (in migliaia) e cresce con un fattore $e$ ogni ora. Guardando il grafico, scrivi il valore iniziale.",
      points: [
        { day: 0, value: 2 },
        { day: 1, value: 5.44 },
        { day: 2, value: 14.78 },
      ],
      maxDay: 2,
      maxValue: 16,
      yStep: 4,
      correctCoeff: 2,
      fixedBase: Math.E,
      fixedBaseLabel: "e",
      fixedBaseLatex: "e",
      correctBase: Math.E,
      axisLabel: "Ore",
      quantityLabel: "Batteri (migliaia)",
      explanation: "Al tempo $0$ la popolazione è $2$ (migliaia): il coefficiente è $2$.",
    },
    {
      type: "typed-formula",
      id: "be-2",
      prompt:
        "Un virus isolato parte da 1 (in migliaia di casi) e si moltiplica per $e^2$ ogni settimana: una diffusione molto più rapida. Guardando il grafico, scrivi il valore iniziale.",
      points: [
        { day: 0, value: 1 },
        { day: 1, value: 7.39 },
      ],
      maxDay: 2,
      maxValue: 60,
      yStep: 10,
      correctCoeff: 1,
      fixedBase: Math.E ** 2,
      fixedBaseLabel: "e²",
      fixedBaseLatex: "e^2",
      correctBase: Math.E ** 2,
      axisLabel: "Settimane",
      quantityLabel: "Casi (migliaia)",
      explanation:
        "Al tempo $0$ ci sono $1000$ casi: il coefficiente è $1$. Nota quanto $e^2 \\approx 7{,}39$ cresca più in fretta di $e$.",
    },
    {
      type: "text-concept",
      id: "be-concetto-2",
      lines: [
        "Il numero $e$ compare anche elevato a potenze diverse: $e^2 \\approx 7{,}39$ cresce più in fretta di $e$, mentre $e^{-1} = \\dfrac{1}{e} \\approx 0{,}368$ descrive un decadimento rapido.",
        "In tutti i casi resta la stessa idea: il coefficiente è il valore iniziale, la base ti dice di quale fattore si moltiplica a ogni passo.",
      ],
    },
    {
      type: "compare-growth",
      mode: "drag",
      id: "be-3",
      prompt:
        "Un batterio isolato (1, in migliaia) cresce con fattore $e$ ogni ora; una colonia già numerosa (20, in migliaia) cresce piano, con fattore $1{,}2$ ogni ora. Seleziona la prima ora in cui il batterio isolato supera la colonia.",
      maxDay: 4,
      maxValue: 60,
      yStep: 10,
      axisLabel: "Ore",
      quantityLabel: "Batteri (migliaia)",
      seriesA: {
        kind: "exponential",
        coeff: 1,
        base: Math.E,
        color: "var(--color-brand-500)",
        label: "Coltura isolata (base e)",
      },
      seriesB: {
        kind: "exponential",
        coeff: 20,
        base: 1.2,
        color: "var(--color-success-500)",
        label: "Colonia numerosa (base 1,2)",
      },
      correctDay: 4,
      explanation:
        "All'ora 3 la coltura isolata vale ancora meno (circa 20 contro 34,6 migliaia); all'ora 4 la supera: circa 54,6 contro 41,5 migliaia. La base $e$, anche se parte svantaggiata, cresce troppo in fretta per restare indietro a lungo.",
    },
    {
      type: "typed-formula",
      id: "be-4",
      prompt:
        "Una dose di farmaco nel sangue parte da 40 mg e si riduce con un fattore $\\dfrac{1}{e}$ ogni ora: un'eliminazione molto rapida. Guardando il grafico, scrivi il valore iniziale.",
      points: [
        { day: 0, value: 40 },
        { day: 1, value: 14.72 },
      ],
      maxDay: 4,
      maxValue: 40,
      yStep: 8,
      correctCoeff: 40,
      fixedBase: 1 / Math.E,
      fixedBaseLabel: "1/e",
      fixedBaseLatex: "\\dfrac{1}{e}",
      correctBase: 1 / Math.E,
      axisLabel: "Ore",
      quantityLabel: "Farmaco (mg)",
      explanation:
        "Al tempo $0$ ci sono $40$ mg: il coefficiente è $40$. Ogni ora il valore si moltiplica per $\\dfrac{1}{e} \\approx 0{,}368$.",
    },
    {
      type: "compare-growth",
      mode: "drag",
      id: "be-5",
      prompt:
        "Una sostanza molto instabile (200 Bq) decade con fattore $\\dfrac{1}{e}$ ogni giorno; un'altra sostanza (10 Bq) decade lentamente, con fattore $0{,}95$ ogni giorno. Seleziona il primo giorno in cui la prima sostanza diventa minore o uguale alla seconda.",
      maxDay: 4,
      maxValue: 200,
      yStep: 50,
      axisLabel: "Giorni",
      quantityLabel: "Radioattività (Bq)",
      seriesA: {
        kind: "exponential",
        coeff: 200,
        base: 1 / Math.E,
        color: "var(--color-brand-500)",
        label: "Sostanza instabile (base 1/e)",
      },
      seriesB: {
        kind: "exponential",
        coeff: 10,
        base: 0.95,
        color: "var(--color-success-500)",
        label: "Sostanza stabile (base 0,95)",
      },
      correctDay: 4,
      explanation:
        "Al giorno 3 la prima sostanza vale ancora di più (circa 10 contro 8,6 Bq); al giorno 4 diventa minore o uguale: circa 3,7 contro 8,1 Bq. Un decadimento con base $\\dfrac{1}{e}$ è così rapido da azzerarsi quasi subito.",
    },
    {
      type: "text-concept",
      id: "be-concetto-3",
      lines: [
        "Anche se $e$ non è un numero «rotondo» come $2$ o $10$, è la base più naturale per descrivere crescita e decadimento continui.",
        "Per questo compare ovunque: in statistica, in biologia, in fisica e, come hai visto, nell'interesse composto.",
      ],
    },
    {
      type: "multiple-choice",
      id: "be-6",
      prompt: "Quale valore è più vicino al numero $e$?",
      choices: [
        { id: "a", label: "$2{,}5$" },
        { id: "b", label: "$2{,}72$" },
        { id: "c", label: "$3$" },
        { id: "d", label: "$3{,}5$" },
      ],
      correctId: "b",
      explanation: "$e \\approx 2{,}71828\\ldots$, quindi $2{,}72$ è l'approssimazione più vicina.",
    },
  ],
};
