import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Flag, PartyPopper, X, XCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ExerciseRenderer } from "../components/exercises/ExerciseRenderer";
import {
  type CheckStatus,
  FeedbackBanner,
} from "../components/exercises/FeedbackBanner";
import { MathText } from "../components/math/MathText";
import { LevelUpScreen } from "../components/gamification/LevelUpScreen";
import { StreakBadge } from "../components/gamification/StreakBadge";
import { XpBadge } from "../components/gamification/XpBadge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { ProgressBar } from "../components/ui/ProgressBar";
import { getLesson } from "../courses";
import { useUserProgress } from "../hooks/useUserProgress";
import { playCorrectSound, playIncorrectSound } from "../lib/sound";

/** Percentuale minima di risposte corrette per superare una verifica di
 * livello (la "sufficienza" scolastica: 6/10). */
const PASS_THRESHOLD = 0.6;

/** Vero per le schermate di sola teoria/riepilogo (nessuna risposta da dare):
 * per queste si salta il pulsante "Verifica" e si mostra subito "Continua". */
function isConceptExercise(exercise: { type: string; mode?: string }): boolean {
  if (exercise.type === "text-concept") return true;
  return exercise.mode === "concept";
}

export function LessonPage() {
  const { courseId, lessonId } = useParams<{
    courseId: string;
    lessonId: string;
  }>();
  const { progress, completeLesson } = useUserProgress();
  const navigate = useNavigate();

  const found =
    courseId && lessonId ? getLesson(courseId, lessonId) : undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [status, setStatus] = useState<CheckStatus>("unanswered");
  const [revealAnswer, setRevealAnswer] = useState(false);
  const [componentKey, setComponentKey] = useState(0);
  const [checkFn, setCheckFn] = useState<(() => boolean) | null>(null);
  const [finished, setFinished] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [quizResult, setQuizResult] = useState<"passed" | "failed" | null>(null);
  const [confirmingExit, setConfirmingExit] = useState(false);
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);

  const onReadyToCheck = useCallback(
    (fn: (() => boolean) | null) => {
      setCheckFn(() => fn ?? null);
    },
    [setCheckFn],
  );

  if (!found || found.lesson.status !== "playable" || found.lesson.exercises.length === 0) {
    return <Navigate to={courseId ? `/corsi/${courseId}` : "/corsi"} replace />;
  }

  const { course, lesson } = found;
  const exercise = lesson.exercises[currentIndex];
  const isLastExercise = currentIndex === lesson.exercises.length - 1;
  const conceptOnly = isConceptExercise(exercise);

  // Se questa lezione è l'ultima del suo livello (tipicamente la verifica di
  // livello) ed esiste un livello successivo, completarla fa salire di
  // livello: lo introduciamo con una schermata dedicata prima della mappa.
  const levelIndex = course.levels.findIndex((lvl) =>
    lvl.lessons.some((l) => l.id === lesson.id),
  );
  const isLastLessonOfLevel =
    levelIndex >= 0 &&
    course.levels[levelIndex].lessons[course.levels[levelIndex].lessons.length - 1].id ===
      lesson.id;
  const nextLevel = levelIndex >= 0 ? course.levels[levelIndex + 1] : undefined;
  const leveledUp = isLastLessonOfLevel && nextLevel !== undefined;

  async function handleCheck() {
    if (!checkFn) return;
    const isCorrect = checkFn();

    if (lesson.isLevelCheck) {
      // Verifica di livello: nessun feedback immediato, si passa subito alla
      // domanda successiva (o al risultato finale se era l'ultima).
      const updatedAnswers = [...quizAnswers, isCorrect];
      setQuizAnswers(updatedAnswers);
      if (isLastExercise) {
        const correctCount = updatedAnswers.filter(Boolean).length;
        const passed = correctCount / updatedAnswers.length >= PASS_THRESHOLD;
        if (passed) {
          await completeLesson(course.id, lesson.id, lesson.xpReward);
        }
        setQuizResult(passed ? "passed" : "failed");
        return;
      }
      setCurrentIndex((i) => i + 1);
      setCheckFn(null);
      setComponentKey((k) => k + 1);
      return;
    }

    setStatus(isCorrect ? "correct" : "incorrect");
    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }
  }

  function handleRetry() {
    setStatus("unanswered");
    setCheckFn(null);
    setComponentKey((k) => k + 1);
  }

  function handleRetryQuiz() {
    setCurrentIndex(0);
    setQuizAnswers([]);
    setQuizResult(null);
    setReviewIndex(null);
    setStatus("unanswered");
    setRevealAnswer(false);
    setCheckFn(null);
    setComponentKey((k) => k + 1);
  }

  function handleSeeAnswer() {
    setRevealAnswer(true);
    setStatus("correct");
  }

  async function handleContinue() {
    if (isLastExercise) {
      await completeLesson(course.id, lesson.id, lesson.xpReward);
      setFinished(true);
      return;
    }
    setCurrentIndex((i) => i + 1);
    setStatus("unanswered");
    setRevealAnswer(false);
    setCheckFn(null);
    setComponentKey((k) => k + 1);
  }

  if (showLevelUp && nextLevel) {
    return (
      <LevelUpScreen
        levelNumber={levelIndex + 2}
        levelTitle={nextLevel.title}
        onContinue={() => navigate(`/corsi/${course.id}`)}
      />
    );
  }

  if (quizResult && reviewIndex !== null) {
    const reviewExercise = lesson.exercises[reviewIndex];
    const reviewCorrect = quizAnswers[reviewIndex];
    return (
      <div className="flex h-dvh flex-col overflow-hidden bg-cream-50">
        <div className="mx-auto flex w-full max-w-3xl flex-shrink-0 items-center gap-3 px-4 py-4 sm:gap-4">
          <button
            type="button"
            onClick={() => setReviewIndex(null)}
            aria-label="Chiudi revisione"
            className="text-ink-400 hover:text-ink-700"
          >
            <X size={24} />
          </button>
          <span className="font-display text-sm font-bold text-ink-500">
            Domanda {reviewIndex + 1} di {lesson.exercises.length}
          </span>
          <span
            className={clsx(
              "ml-auto flex items-center gap-1 rounded-full px-3 py-1 font-display text-xs font-bold",
              reviewCorrect
                ? "bg-success-50 text-success-700"
                : "bg-danger-50 text-danger-600",
            )}
          >
            {reviewCorrect ? <Check size={14} /> : <XCircle size={14} />}
            {reviewCorrect ? "Corretta" : "Sbagliata"}
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-2 pb-2 sm:px-4 sm:pb-4">
          <div
            className={clsx(
              "mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-3xl border-2",
              reviewCorrect ? "border-success-400" : "border-danger-400",
            )}
          >
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 sm:px-8">
              <ExerciseRenderer
                exercise={reviewExercise}
                status="correct"
                revealAnswer
                onReadyToCheck={() => {}}
              />
              {reviewExercise.explanation && (
                <p className="mt-6 text-center text-sm text-ink-600">
                  <MathText>{reviewExercise.explanation}</MathText>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-ink-300/25 bg-white/95 px-4 py-4 backdrop-blur">
              <Button
                variant="ghost"
                onClick={() => setReviewIndex((i) => Math.max(0, (i ?? 0) - 1))}
                disabled={reviewIndex === 0}
              >
                <ChevronLeft size={18} />
                Precedente
              </Button>
              {reviewIndex < lesson.exercises.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={() => setReviewIndex((i) => Math.min(lesson.exercises.length - 1, (i ?? 0) + 1))}
                >
                  Successiva
                  <ChevronRight size={18} />
                </Button>
              ) : (
                <Button variant="success" onClick={() => setReviewIndex(null)}>
                  Fine revisione
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizResult) {
    const correctCount = quizAnswers.filter(Boolean).length;
    const total = quizAnswers.length;
    const passed = quizResult === "passed";
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream-50 px-4 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className={clsx(
            "flex h-24 w-24 items-center justify-center rounded-full text-white shadow-soft",
            passed ? "bg-success-500" : "bg-danger-500",
          )}
        >
          {passed ? <PartyPopper size={44} /> : <XCircle size={44} />}
        </motion.div>
        <h1 className="font-display text-2xl font-extrabold text-ink-950">
          {passed ? "Verifica superata!" : "Verifica non superata"}
        </h1>
        <p className="font-display text-lg font-bold text-ink-700">
          {correctCount} / {total} risposte corrette
        </p>
        <Button variant="ghost" onClick={() => setReviewIndex(0)}>
          Rivedi le risposte corrette
        </Button>
        {passed ? (
          <>
            <div className="flex items-center gap-2 font-display text-lg font-bold text-xp-600">
              +{lesson.xpReward} XP
            </div>
            {leveledUp ? (
              <Button variant="success" size="lg" onClick={() => setShowLevelUp(true)}>
                Continua
              </Button>
            ) : (
              <Link to={`/corsi/${course.id}`}>
                <Button variant="success" size="lg">
                  Torna alla mappa
                </Button>
              </Link>
            )}
          </>
        ) : (
          <>
            <p className="max-w-sm text-sm text-ink-500">
              Serve almeno il 60% di risposte corrette per superare la verifica.
            </p>
            <Button variant="primary" size="lg" onClick={handleRetryQuiz}>
              Riprova
            </Button>
          </>
        )}
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream-50 px-4 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-success-500 text-white shadow-soft"
        >
          <PartyPopper size={44} />
        </motion.div>
        <h1 className="font-display text-2xl font-extrabold text-ink-950">
          Lezione completata!
        </h1>
        <div className="flex items-center gap-2 font-display text-lg font-bold text-xp-600">
          +{lesson.xpReward} XP
        </div>
        {leveledUp ? (
          <Button variant="success" size="lg" onClick={() => setShowLevelUp(true)}>
            Continua
          </Button>
        ) : (
          <Link to={`/corsi/${course.id}`}>
            <Button variant="success" size="lg">
              Torna alla mappa
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-cream-50">
      <div className="mx-auto flex w-full max-w-3xl flex-shrink-0 items-center gap-3 px-4 py-4 sm:gap-4">
        <button
          type="button"
          onClick={() => setConfirmingExit(true)}
          aria-label="Chiudi lezione"
          className="text-ink-400 hover:text-ink-700"
        >
          <X size={24} />
        </button>
        <ProgressBar value={currentIndex} max={lesson.exercises.length} />
        <button
          type="button"
          aria-label="Segnala un problema"
          className="text-ink-300 hover:text-ink-500"
        >
          <Flag size={18} />
        </button>
        <XpBadge xp={progress.xp} />
        <StreakBadge streak={progress.streak} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-2 pb-2 sm:px-4 sm:pb-4">
        <div
          className={clsx(
            "mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-3xl border-2 transition-all duration-300",
            status === "correct" &&
              "border-success-400 shadow-[0_0_14px_1px_rgba(45,200,107,0.55),0_0_55px_16px_rgba(45,200,107,0.3)]",
            status === "incorrect" &&
              "border-danger-400 shadow-[0_0_14px_1px_rgba(242,75,63,0.55),0_0_55px_16px_rgba(242,75,63,0.3)]",
            status === "unanswered" && "border-transparent",
          )}
        >
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-8 sm:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${exercise.id}-${componentKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ExerciseRenderer
                  exercise={exercise}
                  status={status}
                  revealAnswer={revealAnswer}
                  onReadyToCheck={onReadyToCheck}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <FeedbackBanner
            status={status}
            canCheck={checkFn !== null}
            explanation={exercise.explanation}
            onCheck={handleCheck}
            onRetry={handleRetry}
            onSeeAnswer={handleSeeAnswer}
            onContinue={handleContinue}
            skipCheck={conceptOnly}
          />
        </div>
      </div>

      <Modal open={confirmingExit} onClose={() => setConfirmingExit(false)}>
        <h2 className="font-display text-lg font-bold text-ink-950">
          Vuoi uscire dalla lezione?
        </h2>
        <p className="mt-2 text-sm text-ink-700">
          I progressi di questo esercizio andranno persi.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmingExit(false)}>
            Continua
          </Button>
          <Button variant="danger" onClick={() => navigate(`/corsi/${course.id}`)}>
            Esci
          </Button>
        </div>
      </Modal>
    </div>
  );
}
