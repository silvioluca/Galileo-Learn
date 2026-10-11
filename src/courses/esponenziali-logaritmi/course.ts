import type { Course } from "../../types/course";
import { celluleCheTriplicano } from "./livello-1-crescita-esponenziale/cellule-che-triplicano";
import { crescitaDeiBatteri } from "./livello-1-crescita-esponenziale/crescita-dei-batteri";
import { ilGraficoDeiBatteri } from "./livello-1-crescita-esponenziale/il-grafico-dei-batteri";
import { nascitaDelleFarfalle } from "./livello-1-crescita-esponenziale/nascita-delle-farfalle";
import { verificaDiLivello } from "./livello-1-crescita-esponenziale/verifica-di-livello";
import { basi } from "./livello-2-funzioni-esponenziali/basi";
import { trovaBaseECoefficiente } from "./livello-2-funzioni-esponenziali/trova-base-e-coefficiente";
import { valoriIniziali } from "./livello-2-funzioni-esponenziali/valori-iniziali";
import { verificaDiLivello2 } from "./livello-2-funzioni-esponenziali/verifica-di-livello-2";
import { basiFrazionarie } from "./livello-3-decrescita-esponenziale/basi-frazionarie";
import { costruireFunzioniDiDecrescita } from "./livello-3-decrescita-esponenziale/costruire-funzioni-di-decrescita";
import { decrescita } from "./livello-3-decrescita-esponenziale/decrescita";
import { esponentiNegativi } from "./livello-3-decrescita-esponenziale/esponenti-negativi";
import { confrontareLaDecrescita } from "./livello-4-confronto/confrontare-la-decrescita";
import { esponenzialiAConfronto } from "./livello-4-confronto/esponenziali-a-confronto";
import { esponenzialiEQuadratiche } from "./livello-4-confronto/esponenziali-e-quadratiche";
import { esponenzialiERette } from "./livello-4-confronto/esponenziali-e-rette";
import { verificaDiLivello4 } from "./livello-4-confronto/verifica-di-livello-4";
import { basiUtili } from "./livello-5-basi-generali/basi-utili";
import { confrontareBasiDecimali } from "./livello-5-basi-generali/confrontare-basi-decimali";
import { costruireEsponenziali } from "./livello-5-basi-generali/costruire-esponenziali";
import { costruireFunzioniDiDecadimento } from "./livello-5-basi-generali/costruire-funzioni-di-decadimento";
import { trovareValoriIniziali } from "./livello-5-basi-generali/trovare-valori-iniziali";
import { verificaDiLivello5 } from "./livello-5-basi-generali/verifica-di-livello-5";
import { baseEInteresseComposto } from "./livello-6-interesse-composto/base-e-interesse-composto";
import { confrontiInteresseComposto } from "./livello-6-interesse-composto/confronti-interesse-composto";
import { graficiInteresseComposto } from "./livello-6-interesse-composto/grafici-interesse-composto";
import { incrementoPercentuale } from "./livello-6-interesse-composto/incremento-percentuale";
import { modellareInteresseComposto } from "./livello-6-interesse-composto/modellare-interesse-composto";
import { verificaDiLivello6 } from "./livello-6-interesse-composto/verifica-di-livello-6";
import { puntiSullaCurva } from "./livello-7-equazioni-esponenziali/punti-sulla-curva";
import { riflessioneAsseVerticale } from "./livello-7-equazioni-esponenziali/riflessione-asse-verticale";
import { equazioniAvanzate } from "./livello-7-equazioni-esponenziali/equazioni-avanzate";
import { risolvereEquazioniEsponenziali } from "./livello-7-equazioni-esponenziali/risolvere-equazioni-esponenziali";
import { verificaDiLivello7 } from "./livello-7-equazioni-esponenziali/verifica-di-livello-7";
import { baseEAConfronto } from "./livello-8-equazioni-non-elementari/base-e-a-confronto";
import { basiDiverseAConfronto } from "./livello-8-equazioni-non-elementari/basi-diverse-a-confronto";
import { equazioniConRaccoglimento } from "./livello-8-equazioni-non-elementari/equazioni-con-raccoglimento";
import { equazioniRiconducibili } from "./livello-8-equazioni-non-elementari/equazioni-riconducibili";
import { verificaDiLivello8 } from "./livello-8-equazioni-non-elementari/verifica-di-livello-8";
import { uguagliareGliEsponenti } from "./livello-8-equazioni-non-elementari/uguagliare-gli-esponenti";
import { disequazioniBaseE } from "./livello-9-disequazioni-esponenziali/disequazioni-base-e";
import { disequazioniBasiDiverse } from "./livello-9-disequazioni-esponenziali/disequazioni-basi-diverse";
import { disequazioniConRaccoglimento } from "./livello-9-disequazioni-esponenziali/disequazioni-con-raccoglimento";
import { disequazioniElementari } from "./livello-9-disequazioni-esponenziali/disequazioni-elementari";
import { disequazioniRiconducibili } from "./livello-9-disequazioni-esponenziali/disequazioni-riconducibili";
import { verificaDiLivello9 } from "./livello-9-disequazioni-esponenziali/verifica-di-livello-9";

export const esponenzialiLogaritmi: Course = {
  id: "esponenziali-logaritmi",
  title: "Esponenziali",
  description: "Crescita, raddoppi e le funzioni che li descrivono.",
  icon: "TrendingUp",
  gradeLabel: "Livello 9-10",
  status: "available",
  levels: [
    {
      id: "livello-1-crescita-esponenziale",
      title: "Crescita Esponenziale",
      description:
        "Osserva batteri, cellule e farfalle che raddoppiano o triplicano ogni giorno, e scopri cos'è la crescita esponenziale.",
      lessons: [
        crescitaDeiBatteri,
        ilGraficoDeiBatteri,
        celluleCheTriplicano,
        nascitaDelleFarfalle,
        verificaDiLivello,
      ],
    },
    {
      id: "livello-2-funzioni-esponenziali",
      title: "Funzioni Esponenziali",
      description: "Impara a leggere e costruire funzioni esponenziali complete.",
      lessons: [basi, valoriIniziali, trovaBaseECoefficiente, verificaDiLivello2],
    },
    {
      id: "livello-3-decrescita-esponenziale",
      title: "Decrescita Esponenziale",
      description: "Scopri come le quantità possono anche decrescere in modo esponenziale.",
      lessons: [decrescita, basiFrazionarie, costruireFunzioniDiDecrescita, esponentiNegativi],
    },
    {
      id: "livello-4-confronto",
      title: "Confronto",
      description:
        "Metti a confronto crescita lineare ed esponenziale, e scopri chi vince nel lungo periodo.",
      lessons: [
        esponenzialiERette,
        esponenzialiEQuadratiche,
        esponenzialiAConfronto,
        confrontareLaDecrescita,
        verificaDiLivello4,
      ],
    },
    {
      id: "livello-5-basi-generali",
      title: "Basi Generali",
      description:
        "Generalizza le funzioni esponenziali a basi frazionarie e decimali qualsiasi, con la notazione $f(x)$.",
      lessons: [
        costruireEsponenziali,
        trovareValoriIniziali,
        basiUtili,
        costruireFunzioniDiDecadimento,
        confrontareBasiDecimali,
        verificaDiLivello5,
      ],
    },
    {
      id: "livello-6-interesse-composto",
      title: "Interesse Composto",
      description:
        "Scopri come una crescita percentuale ripetuta, mese dopo mese, diventa una funzione esponenziale.",
      lessons: [
        incrementoPercentuale,
        modellareInteresseComposto,
        graficiInteresseComposto,
        confrontiInteresseComposto,
        baseEInteresseComposto,
        verificaDiLivello6,
      ],
    },
    {
      id: "livello-7-equazioni-esponenziali",
      title: "Equazioni Esponenziali",
      description:
        "Usa la base per muoverti lungo una funzione esponenziale, un passo alla volta, in entrambe le direzioni.",
      lessons: [
        puntiSullaCurva,
        riflessioneAsseVerticale,
        risolvereEquazioniEsponenziali,
        equazioniAvanzate,
        verificaDiLivello7,
      ],
    },
    {
      id: "livello-8-equazioni-non-elementari",
      title: "Equazioni non Elementari",
      description:
        "Alza il livello: risolvi equazioni esponenziali più complesse, scrivendo esplicitamente la x.",
      lessons: [
        uguagliareGliEsponenti,
        basiDiverseAConfronto,
        baseEAConfronto,
        equazioniConRaccoglimento,
        equazioniRiconducibili,
        verificaDiLivello8,
      ],
    },
    {
      id: "livello-9-disequazioni-esponenziali",
      title: "Disequazioni Esponenziali",
      description:
        "Ultimo livello: risolvi disequazioni esponenziali, scoprendo quando il verso si mantiene e quando si inverte.",
      lessons: [
        disequazioniElementari,
        disequazioniBasiDiverse,
        disequazioniBaseE,
        disequazioniConRaccoglimento,
        disequazioniRiconducibili,
        verificaDiLivello9,
      ],
    },
  ],
};
