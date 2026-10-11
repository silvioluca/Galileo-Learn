import type { Lesson } from "../../../types/course";

export const funzioniDiParole: Lesson = {
  id: "funzioni-di-parole",
  title: "Funzioni di Parole",
  status: "playable",
  xpReward: 20,
  exercises: [
    {
      type: "rule-matching",
      id: "parole-triplica-sottrai",
      prompt:
        "Una funzione trasforma ogni numero \"triplicandolo e poi sottraendo uno\". Quale regola descrive questi output?",
      inputs: [1, 2, 3, 5],
      correctId: "triple-minus-one",
      explanation:
        "\"Triplica e poi sottrai uno\" significa: prima $3x$, poi $-1$, cioè $f(x) = 3x - 1$. Con $x=1$: $3(1)-1=2$; con $x=2$: $3(2)-1=5$, e così via.",
      options: [
        { id: "triple-minus-one", label: "triplica e sottrai uno", fn: (x) => 3 * x - 1 },
        { id: "minus-one-triple", label: "sottrai uno e triplica", fn: (x) => 3 * (x - 1) },
        { id: "triple-plus-one", label: "triplica e aggiungi uno", fn: (x) => 3 * x + 1 },
        { id: "double-plus-one", label: "raddoppia e aggiungi uno", fn: (x) => 2 * x + 1 },
      ],
    },
    {
      type: "multiple-choice",
      id: "parole-espressione",
      prompt:
        "Quale espressione corrisponde alla regola \"raddoppia il numero, poi aggiungi cinque\"?",
      correctId: "2x-plus-5",
      explanation:
        "L'ordine delle parole conta: prima si raddoppia ($2x$), poi si aggiunge cinque ($+5$), quindi $2x + 5$. $2(x+5)$ significherebbe invece \"aggiungi cinque, poi raddoppia\".",
      choices: [
        { id: "2x-plus-5", label: "$2x + 5$" },
        { id: "2x5-plus", label: "$2(x + 5)$" },
        { id: "x-plus-10", label: "$x + 2 \\times 5$" },
        { id: "5x-plus-2", label: "$5x + 2$" },
      ],
    },
    {
      type: "rule-matching",
      id: "parole-dimezza-aggiungi",
      prompt:
        "Una funzione trasforma ogni numero \"dimezzandolo e poi aggiungendo uno\". Quale regola descrive questi output?",
      inputs: [4, 10, 20, 50],
      correctId: "halve-plus-one",
      explanation:
        "\"Dimezza e poi aggiungi uno\" significa $\\frac{x}{2} + 1$. Con $x=4$: $\\frac{4}{2}+1=3$; con $x=10$: $\\frac{10}{2}+1=6$.",
      options: [
        { id: "halve-plus-one", label: "dimezza e aggiungi uno", fn: (x) => x / 2 + 1 },
        { id: "plus-one-halve", label: "aggiungi uno e dimezza", fn: (x) => (x + 1) / 2 },
        { id: "halve-minus-one", label: "dimezza e sottrai uno", fn: (x) => x / 2 - 1 },
        { id: "plus-two-halve", label: "aggiungi due e dimezza", fn: (x) => (x + 2) / 2 },
      ],
    },
    {
      type: "multiple-choice",
      id: "parole-valuta",
      prompt:
        "Una funzione descritta come \"sottrai tre, poi moltiplica per due\" viene applicata a $x = 7$. Qual è il risultato?",
      correctId: "eight",
      explanation:
        "Prima $7 - 3 = 4$, poi $4 \\times 2 = 8$. Rispettare l'ordine delle operazioni descritte a parole è essenziale.",
      choices: [
        { id: "eight", label: "$8$" },
        { id: "eleven", label: "$11$" },
        { id: "fourteen", label: "$14$" },
        { id: "four", label: "$4$" },
      ],
    },
  ],
};
