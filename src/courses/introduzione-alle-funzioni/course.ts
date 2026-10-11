import type { Course } from "../../types/course";
import { funzioniDelTempo } from "./livello-1-introduzione-alle-funzioni/funzioni-del-tempo";
import { funzioniDiParole } from "./livello-1-introduzione-alle-funzioni/funzioni-di-parole";
import { trovareLaRegola } from "./livello-1-introduzione-alle-funzioni/trovare-la-regola";

export const introduzioneAlleFunzioni: Course = {
  id: "introduzione-alle-funzioni",
  title: "Introduzione alle Funzioni",
  description: "Collega input e output attraverso le funzioni.",
  icon: "Waypoints",
  gradeLabel: "Livello 8-9",
  status: "available",
  levels: [
    {
      id: "livello-1-introduzione-alle-funzioni",
      title: "Introduzione alle Funzioni",
      lessons: [trovareLaRegola, funzioniDiParole, funzioniDelTempo],
    },
  ],
};
