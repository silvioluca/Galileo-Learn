import type { Lesson } from "../../../types/course";

export const funzioniDelTempo: Lesson = {
  id: "funzioni-del-tempo",
  title: "Funzioni del Tempo",
  status: "playable",
  xpReward: 20,
  exercises: [
    {
      type: "rule-matching",
      id: "tempo-treno",
      prompt:
        "Un treno viaggia a velocità costante. Ecco alcune coppie tempo (ore) → distanza percorsa (km). Quale regola le descrive?",
      inputs: [1, 2, 3, 4],
      correctId: "times-80",
      explanation:
        "La distanza cresce sempre di $80$ km per ogni ora: la funzione è $d(t) = 80t$, cioè il treno viaggia a $80$ km/h.",
      options: [
        { id: "times-80", label: "moltiplica per 80", fn: (x) => 80 * x },
        { id: "times-40", label: "moltiplica per 40", fn: (x) => 40 * x },
        { id: "plus-80", label: "aggiungi 80", fn: (x) => 80 + x },
        { id: "times-8", label: "moltiplica per 8", fn: (x) => 8 * x },
      ],
    },
    {
      type: "multiple-choice",
      id: "tempo-vasca",
      prompt:
        "Un rubinetto riempie una vasca vuota a $12$ litri al minuto. Quale funzione $f(t)$ dà i litri nella vasca dopo $t$ minuti?",
      correctId: "12t",
      explanation:
        "Ogni minuto si aggiungono $12$ litri, quindi dopo $t$ minuti la vasca contiene $12$ litri per ogni minuto trascorso: $f(t) = 12t$.",
      choices: [
        { id: "12t", label: "$f(t) = 12t$" },
        { id: "12-plus-t", label: "$f(t) = 12 + t$" },
        { id: "t-over-12", label: "$f(t) = \\dfrac{t}{12}$" },
        { id: "12-minus-t", label: "$f(t) = 12 - t$" },
      ],
    },
    {
      type: "rule-matching",
      id: "tempo-orologio",
      prompt:
        "Un orologio digitale mostra i minuti trascorsi dall'ultima ora piena. Ecco input (minuti trascorsi) → output (minuti alla prossima ora). Quale regola li collega?",
      inputs: [10, 25, 40, 55],
      correctId: "sixty-minus",
      explanation:
        "In un'ora ci sono $60$ minuti: se ne sono passati $x$, ne restano $60 - x$. Con $x=10$: $60-10=50$; con $x=55$: $60-55=5$.",
      options: [
        { id: "sixty-minus", label: "sottrai da 60", fn: (x) => 60 - x },
        { id: "minus-sixty", label: "sottrai 60", fn: (x) => x - 60 },
        { id: "sixty-plus", label: "aggiungi a 60", fn: (x) => 60 + x },
        { id: "half-of-sixty", label: "dividi 60 per il numero", fn: (x) => 60 / x },
      ],
    },
    {
      type: "multiple-choice",
      id: "tempo-pianta",
      prompt:
        "L'altezza di una pianta, in cm, $t$ settimane dopo essere stata misurata è $f(t) = 5t + 2$. Quanto sarà alta dopo $4$ settimane?",
      correctId: "22cm",
      explanation:
        "$f(4) = 5 \\times 4 + 2 = 20 + 2 = 22$ cm. Il $2$ è l'altezza di partenza, il $5t$ è la crescita settimanale.",
      choices: [
        { id: "22cm", label: "$22$ cm" },
        { id: "20cm", label: "$20$ cm" },
        { id: "10cm", label: "$10$ cm" },
        { id: "26cm", label: "$26$ cm" },
      ],
    },
  ],
};
