import type { Course } from "../types/course";
import { esponenzialiLogaritmi } from "./esponenziali-logaritmi/course";
import { introduzioneAlleFunzioni } from "./introduzione-alle-funzioni/course";

/** Corsi "in arrivo": card visibili nel catalogo ma senza lezioni giocabili,
 * per dare l'idea di un catalogo completo senza inventare contenuti fasulli. */
const comingSoonCourses: Course[] = [
  {
    id: "sistemi-lineari",
    title: "Sistemi Lineari",
    description: "Risolvi sistemi di equazioni con metodi grafici e algebrici.",
    icon: "GitBranch",
    gradeLabel: "Livello 8-9",
    status: "coming-soon",
    levels: [],
  },
  {
    id: "quadratiche",
    title: "Quadratiche",
    description: "Esplora parabole, radici e il loro significato geometrico.",
    icon: "SquareStack",
    gradeLabel: "Livello 9",
    status: "coming-soon",
    levels: [],
  },
  {
    id: "trasformazioni-coordinate",
    title: "Trasformazioni di Coordinate",
    description: "Trasla, ruota e rifletti figure nel piano cartesiano.",
    icon: "Move3d",
    gradeLabel: "Livello 8-9",
    status: "coming-soon",
    levels: [],
  },
];

export const courses: Course[] = [
  introduzioneAlleFunzioni,
  esponenzialiLogaritmi,
  ...comingSoonCourses,
];

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getLesson(
  courseId: string,
  lessonId: string,
): { course: Course; lesson: Course["levels"][number]["lessons"][number] } | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  for (const level of course.levels) {
    const lesson = level.lessons.find((l) => l.id === lessonId);
    if (lesson) return { course, lesson };
  }
  return undefined;
}
