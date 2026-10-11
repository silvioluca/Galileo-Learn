import {
  Atom,
  BookOpen,
  Calculator,
  ClipboardCheck,
  Clock,
  FunctionSquare,
  FlipHorizontal,
  Equal,
  Divide,
  Puzzle,
  Scale,
  Combine,
  Shuffle,
  Dna,
  Egg,
  ArrowLeftRight,
  GitCompareArrows,
  Hourglass,
  Infinity as InfinityIcon,
  Layers,
  Leaf,
  LineChart,
  MessageSquare,
  Microscope,
  Minus,
  PiggyBank,
  Pill,
  Rabbit,
  Sigma,
  Spline,
  Target,
  Trash2,
  TrendingDown,
  ArrowRightLeft,
  SplitSquareHorizontal,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { LevelNode, type LevelNodeStatus } from "../components/gamification/LevelNode";
import { PageShell } from "../components/layout/PageShell";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { getCourse } from "../courses";
import { useCourseProgress } from "../hooks/useCourseProgress";
import { useUserProgress } from "../hooks/useUserProgress";
import { resolveCourseIcon } from "../lib/icons";
import type { Lesson } from "../types/course";

const LESSON_ICONS: Record<string, typeof BookOpen> = {
  "trovare-la-regola": BookOpen,
  "funzioni-di-parole": MessageSquare,
  "funzioni-del-tempo": Clock,
  "crescita-dei-batteri": Microscope,
  "il-grafico-dei-batteri": LineChart,
  "cellule-che-triplicano": Dna,
  "nascita-delle-farfalle": Egg,
  "verifica-di-livello": ClipboardCheck,
  basi: Layers,
  "valori-iniziali": Target,
  "trova-base-e-coefficiente": Sigma,
  "verifica-di-livello-2": ClipboardCheck,
  decrescita: Leaf,
  "basi-frazionarie": Divide,
  "costruire-funzioni-di-decrescita": TrendingDown,
  "esponenti-negativi": Minus,
  "esponenziali-e-rette": GitCompareArrows,
  "esponenziali-e-quadratiche": Spline,
  "esponenziali-a-confronto": Rabbit,
  "confrontare-la-decrescita": Pill,
  "verifica-di-livello-4": ClipboardCheck,
  "costruire-esponenziali": FunctionSquare,
  "trovare-valori-iniziali-generali": Target,
  "basi-utili": InfinityIcon,
  "costruire-funzioni-di-decadimento": Hourglass,
  "confrontare-basi-decimali": ArrowLeftRight,
  "verifica-di-livello-5": ClipboardCheck,
  "incremento-percentuale": PiggyBank,
  "modellare-interesse-composto": Calculator,
  "grafici-interesse-composto": LineChart,
  "confronti-interesse-composto": GitCompareArrows,
  "base-e-interesse-composto": Atom,
  "verifica-di-livello-6": ClipboardCheck,
  "punti-sulla-curva": Spline,
  "riflessione-asse-verticale": FlipHorizontal,
  "risolvere-equazioni-esponenziali": Equal,
  "equazioni-avanzate": Puzzle,
  "verifica-di-livello-7": ClipboardCheck,
  "uguagliare-gli-esponenti": Scale,
  "basi-diverse-a-confronto": GitCompareArrows,
  "base-e-a-confronto": Atom,
  "equazioni-con-raccoglimento": Combine,
  "equazioni-riconducibili": Shuffle,
  "verifica-di-livello-8": ClipboardCheck,
  "disequazioni-elementari": ArrowRightLeft,
  "disequazioni-basi-diverse": SplitSquareHorizontal,
  "disequazioni-base-e": Atom,
  "disequazioni-con-raccoglimento": Combine,
  "disequazioni-riconducibili": Shuffle,
  "verifica-di-livello-9": ClipboardCheck,
};

// Geometria del percorso a nodi: righe di altezza fissa, offset orizzontale
// alternato a zig-zag.
const PATH_WIDTH = 300;
const ROW_HEIGHT = 190;
const OFFSET_X = 72;

function nodeCenterX(index: number): number {
  const cycle = index % 3;
  if (cycle === 1) return PATH_WIDTH / 2 + OFFSET_X;
  if (cycle === 2) return PATH_WIDTH / 2 - OFFSET_X;
  return PATH_WIDTH / 2;
}

export function CourseLevelMapPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseId ? getCourse(courseId) : undefined;
  const { isLessonCompleted, completedLessonIds } = useCourseProgress(
    courseId ?? "",
  );
  const { resetCourseProgress, resetLessonsProgress } = useUserProgress();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [openLevelIndex, setOpenLevelIndex] = useState<number | null>(null);

  if (!course) return <Navigate to="/corsi" replace />;

  const CourseIcon = resolveCourseIcon(course.icon);
  // Sblocco globale attraverso TUTTI i livelli del corso (non per singolo
  // livello): una lezione è "active" solo se è la prima non completata in
  // assoluto, così il livello successivo resta bloccato finché il precedente
  // non è terminato.
  const allLessons = course.levels.flatMap((level) => level.lessons);
  const globalFirstIncompleteIndex = allLessons.findIndex(
    (lesson) => lesson.status === "playable" && !isLessonCompleted(lesson.id),
  );
  const nextLesson =
    globalFirstIncompleteIndex >= 0 ? allLessons[globalFirstIncompleteIndex] : undefined;

  async function handleResetProgress() {
    await resetCourseProgress(course!.id);
    setConfirmingReset(false);
  }

  async function handleResetFromLevel(levelIdx: number) {
    const lessonIds = course!.levels
      .slice(levelIdx)
      .flatMap((lvl) => lvl.lessons)
      .map((lesson) => lesson.id);
    await resetLessonsProgress(course!.id, lessonIds);
    setOpenLevelIndex(null);
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-4 py-10 pb-32">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <CourseIcon size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink-950">
              {course.title}
            </h1>
            <p className="text-sm text-ink-500">{course.description}</p>
          </div>
        </div>

        {course.levels.map((level, levelIdx) => {
          return (
            <div key={level.id} className="mb-12">
              {level.title !== course.title && (
                <button
                  type="button"
                  onClick={() => setOpenLevelIndex(levelIdx)}
                  className="pressable mx-auto mb-8 flex w-full max-w-xs flex-col items-center gap-0.5 rounded-2xl border-2 border-brand-200 bg-white px-5 py-3 text-center transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <span className="font-display text-xs font-bold tracking-wide text-brand-600 uppercase">
                    Livello {levelIdx + 1}
                  </span>
                  <span className="font-display text-base font-extrabold text-ink-950">
                    {level.title}
                  </span>
                </button>
              )}

              <div
                className="relative mx-auto"
                style={{
                  width: PATH_WIDTH,
                  height: level.lessons.length * ROW_HEIGHT,
                }}
              >
                {level.lessons.map((lesson, i) => {
                  const globalIndex = allLessons.findIndex((l) => l.id === lesson.id);
                  const status = lessonStatus(
                    lesson,
                    globalIndex,
                    globalFirstIncompleteIndex,
                    isLessonCompleted(lesson.id),
                  );

                  return (
                    <div
                      key={lesson.id}
                      className="absolute z-10"
                      style={{
                        left: nodeCenterX(i),
                        top: i * ROW_HEIGHT,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <LevelNode
                        title={lesson.title}
                        icon={LESSON_ICONS[lesson.id] ?? BookOpen}
                        status={status}
                        to={`/corsi/${course.id}/${lesson.id}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {completedLessonIds.size > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-ink-400 hover:text-danger-500"
            >
              <Trash2 size={14} />
              Cancella i progressi di questo corso
            </button>
          </div>
        )}
      </div>

      {nextLesson && (
        <div className="fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-6">
          <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-ink-300/30 bg-white p-5 text-center shadow-soft">
            <span className="font-display text-lg font-bold text-ink-950">
              {nextLesson.title}
            </span>
            <Link
              to={`/corsi/${course.id}/${nextLesson.id}`}
              className="w-full"
            >
              <Button variant="primary" size="lg" className="w-full">
                Inizia
              </Button>
            </Link>
          </div>
        </div>
      )}

      <Modal open={confirmingReset} onClose={() => setConfirmingReset(false)}>
        <h2 className="font-display text-lg font-bold text-ink-950">
          Cancellare i progressi?
        </h2>
        <p className="mt-2 text-sm text-ink-700">
          Le lezioni completate in "{course.title}" torneranno bloccate e gli
          XP guadagnati in questo corso verranno rimossi. L'azione non è
          reversibile.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmingReset(false)}>
            Annulla
          </Button>
          <Button variant="danger" onClick={handleResetProgress}>
            Cancella
          </Button>
        </div>
      </Modal>

      <Modal open={openLevelIndex !== null} onClose={() => setOpenLevelIndex(null)}>
        {openLevelIndex !== null && (
          <>
            <div className="text-center">
              <span className="font-display text-xs font-bold tracking-wide text-brand-600 uppercase">
                Livello {openLevelIndex + 1}
              </span>
              <h2 className="font-display text-lg font-bold text-ink-950">
                {course.levels[openLevelIndex].title}
              </h2>
            </div>
            {course.levels[openLevelIndex].description && (
              <ul className="mt-4 list-disc pl-5 text-sm text-ink-700">
                <li>{course.levels[openLevelIndex].description}</li>
              </ul>
            )}
            <div className="mt-6">
              <Button
                variant="danger"
                className="w-full"
                onClick={() => handleResetFromLevel(openLevelIndex)}
              >
                Ripristina i progressi da qui
              </Button>
            </div>
          </>
        )}
      </Modal>
    </PageShell>
  );
}

function lessonStatus(
  lesson: Lesson,
  index: number,
  firstIncompleteIndex: number,
  completed: boolean,
): LevelNodeStatus {
  if (lesson.status === "coming-soon") return "locked";
  if (completed) return "completed";
  if (firstIncompleteIndex === index) return "active";
  return "locked";
}
