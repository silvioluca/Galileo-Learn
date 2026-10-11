import clsx from "clsx";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { Card } from "../components/ui/Card";
import { courses } from "../courses";
import { useUserProgress } from "../hooks/useUserProgress";
import { resolveCourseIcon } from "../lib/icons";
import type { Course } from "../types/course";

export function CoursesPage() {
  const { progress } = useUserProgress();

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="font-display text-3xl font-extrabold text-ink-950">
          Percorsi di apprendimento
        </h1>
        <p className="mt-1 text-ink-700">
          Passo dopo passo verso la padronanza, un esercizio alla volta.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => {
            const completedCount =
              progress.completedLessons[course.id]?.length ?? 0;
            const totalLessons = course.levels.reduce(
              (sum, level) => sum + level.lessons.length,
              0,
            );
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <CourseCard
                  course={course}
                  completedCount={completedCount}
                  totalLessons={totalLessons}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

function CourseCard({
  course,
  completedCount,
  totalLessons,
}: {
  course: Course;
  completedCount: number;
  totalLessons: number;
}) {
  const Icon = resolveCourseIcon(course.icon);
  const isAvailable = course.status === "available";

  const content = (
    <Card
      className={clsx(
        "pressable flex h-full flex-col gap-4 p-5",
        isAvailable && "hover:border-brand-300",
        !isAvailable && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
          <Icon size={26} />
        </div>
        {!isAvailable && (
          <span className="rounded-full bg-ink-300/20 px-2.5 py-1 text-xs font-bold text-ink-500">
            Prossimamente
          </span>
        )}
      </div>
      <div>
        <span className="text-xs font-bold tracking-wide text-ink-500 uppercase">
          {course.gradeLabel}
        </span>
        <h2 className="font-display text-lg font-bold text-ink-950">
          {course.title}
        </h2>
        <p className="mt-1 text-sm text-ink-700">{course.description}</p>
      </div>
      {isAvailable && totalLessons > 0 && (
        <div className="mt-auto text-xs font-semibold text-ink-500">
          {completedCount} / {totalLessons} lezioni completate
        </div>
      )}
    </Card>
  );

  if (!isAvailable) {
    return <div className="cursor-not-allowed">{content}</div>;
  }

  return <Link to={`/corsi/${course.id}`}>{content}</Link>;
}
