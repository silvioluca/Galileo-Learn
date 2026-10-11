import type { Lesson } from "../../../types/course";

export const trovareLaRegola: Lesson = {
  id: "trovare-la-regola",
  title: "Trovare la Regola",
  status: "playable",
  xpReward: 25,
  exercises: [
    {
      type: "rule-matching",
      id: "regola-raddoppia",
      prompt: "Quale regola potrebbe produrre questi output da questi input?",
      inputs: [2, 6, 11, 14],
      correctId: "double",
      explanation:
        "Ogni output è il doppio del suo input: $2 \\to 4$, $6 \\to 12$, $11 \\to 22$, $14 \\to 28$. La regola è quindi \"raddoppia\", cioè $f(x) = 2x$.",
      options: [
        { id: "add-two", label: "aggiungi due", fn: (x) => x + 2 },
        { id: "double", label: "raddoppia", fn: (x) => x * 2 },
        { id: "triple", label: "triplica", fn: (x) => x * 3 },
        { id: "halve", label: "dimezza", fn: (x) => x / 2 },
      ],
    },
    {
      type: "algebra-tiles",
      id: "tessere-2z",
      prompt: "Costruisci il modello ad area per moltiplicare $2z(z + 1)$.",
      variable: "z",
      coeffA: 2,
      constB: 1,
      resultLatex: "2z^2 + 2z",
      explanation:
        "Il rettangolo ha lati $2z$ e $(z+1)$: l'area si divide in $2z \\times z = 2z^2$ e $2z \\times 1 = 2z$. Sommando le due aree parziali si ottiene $2z^2 + 2z$.",
    },
    {
      type: "rule-matching",
      id: "regola-aggiungi-tre",
      prompt: "Quale regola potrebbe produrre questi output da questi input?",
      inputs: [1, 4, 9, 20],
      correctId: "add-three",
      explanation:
        "Ogni output supera il suo input di esattamente 3: $1 \\to 4$, $4 \\to 7$... la regola è \"aggiungi tre\", cioè $f(x) = x + 3$.",
      options: [
        { id: "add-three", label: "aggiungi tre", fn: (x) => x + 3 },
        { id: "double", label: "raddoppia", fn: (x) => x * 2 },
        { id: "triple", label: "triplica", fn: (x) => x * 3 },
        { id: "subtract-one", label: "sottrai uno", fn: (x) => x - 1 },
      ],
    },
    {
      type: "algebra-tiles",
      id: "tessere-x",
      prompt: "Costruisci il modello ad area per moltiplicare $x(x + 2)$.",
      variable: "x",
      coeffA: 1,
      constB: 2,
      resultLatex: "x^2 + 2x",
      explanation:
        "Il rettangolo ha lati $x$ e $(x+2)$: l'area si divide in $x \\times x = x^2$ e $x \\times 2 = 2x$. Sommando le due aree parziali si ottiene $x^2 + 2x$.",
    },
    {
      type: "multiple-choice",
      id: "notazione-funzione",
      prompt:
        "Se una funzione $f$ raddoppia il suo input, come si scrive in simboli che $f$ trasforma $3$ in $6$?",
      correctId: "f3-6",
      explanation: "La notazione $f(x)$ indica l'output della funzione $f$ quando l'input è $x$.",
      choices: [
        { id: "f3-6", label: "$f(3) = 6$" },
        { id: "f6-3", label: "$f(6) = 3$" },
        { id: "3f-6", label: "$3f = 6$" },
        { id: "f-36", label: "$f = 3 \\times 6$" },
      ],
    },
  ],
};
