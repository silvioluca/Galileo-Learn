import type { Lesson } from "../../../types/course";

export const incrementoPercentuale: Lesson = {
  id: "incremento-percentuale",
  title: "Incremento Percentuale",
  status: "playable",
  xpReward: 55,
  exercises: [
    {
      type: "percent-growth",
      id: "ip-1",
      prompt:
        "Un investimento cresce del 5% al mese. Il suo valore attuale è di 1000 €. Qual è l'incremento dopo 1 mese?",
      prefixText: "1000 +",
      correctValue: 50,
      explanation: "Il 5% di 1000 € è $1000 \\cdot 0{,}05 = 50$.",
    },
    {
      type: "percent-growth",
      id: "ip-2",
      prompt:
        "Il valore dopo 1 mese è 1050 €. Quanto vale l'incremento al Mese 2 (cioè il 5% di 1050 €)?",
      prefixText: "1050 +",
      allowDecimal: true,
      correctValue: 52.5,
      explanation: "$1050 \\times 0{,}05 = 52{,}5$.",
    },
    {
      type: "text-concept",
      id: "ip-concetto-1",
      lines: [
        "Il valore $y$ dell'investimento al Mese 2 è $y = 1050 + 1050 \\cdot 0{,}05$ (in euro).",
        "Raccogliendo $1050$, troviamo $y = 1050(1 + 0{,}05) = 1102{,}50$ euro.",
        "Un investimento che cresce del 5% al mese si moltiplica, ogni mese, per un fattore $1{,}05$.",
      ],
    },
    {
      type: "percent-growth",
      id: "ip-3",
      prompt: "Il valore al Mese 2 è 1102,50 €. Qual è il fattore di crescita mensile?",
      prefixText: "1 +",
      allowDecimal: true,
      correctValue: 0.05,
      explanation:
        "Il fattore di crescita è $1$ (il valore di partenza) più il tasso di crescita $0{,}05$ (cioè il 5%): insieme danno $1{,}05$.",
    },
    {
      type: "percent-growth",
      id: "ip-4",
      prompt:
        "Il valore al Mese 2 è 1102,50 € e cresce con un fattore $1{,}05$ ogni mese. Quanti mesi devono passare, a partire dal Mese 2, per raggiungere circa 1215,51 €?",
      correctValue: 2,
      explanation: "$1102{,}50 \\cdot 1{,}05^2 \\approx 1215{,}51$: servono $2$ mesi.",
    },
    {
      type: "text-concept",
      id: "ip-concetto-2",
      lines: [
        "Il valore al Mese $x$ di un investimento di 1000 € che cresce del 5% al mese si descrive con una funzione esponenziale:",
        "$f(x) = 1000(1 + 0{,}05)^x$",
      ],
    },
    {
      type: "percent-growth",
      id: "ip-5",
      prompt:
        "Un investimento cresce del 2% al mese. Qual è l'incremento di un investimento di 2000 € dopo 1 mese?",
      prefixText: "2000 +",
      correctValue: 40,
      explanation: "Il 2% di 2000 € è $2000 \\cdot 0{,}02 = 40$.",
    },
    {
      type: "percent-growth",
      id: "ip-6",
      prompt: "Un investimento di 2000 € cresce del 2% al mese. Qual è il fattore di crescita mensile?",
      prefixText: "1 +",
      allowDecimal: true,
      correctValue: 0.02,
      explanation: "Il fattore è $1 + 0{,}02 = 1{,}02$.",
    },
    {
      type: "percent-growth",
      id: "ip-7",
      prompt:
        "Un investimento di 2000 € cresce con fattore $1{,}02$ ogni mese ($2000 \\cdot 1{,}02^n$). Quanti mesi (n) servono per raggiungere circa 2536,49 €?",
      correctValue: 12,
      explanation: "$2000 \\cdot 1{,}02^{12} \\approx 2536{,}49$.",
    },
    {
      type: "text-concept",
      id: "ip-concetto-3",
      lines: [
        "In generale, se un valore iniziale $V_0$ cresce del $r\\%$ ogni periodo, il suo valore dopo $x$ periodi è $f(x) = V_0(1 + r)^x$, dove $r$ è scritto come decimale (es. $5\\% = 0{,}05$).",
        "È la stessa idea che hai già usato con basi come $\\dfrac{1}{2}$, $10$ o $e$: qui il tasso percentuale ti dice direttamente quanto vale la base.",
      ],
    },
  ],
};
