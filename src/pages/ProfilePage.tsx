import { Gem, User, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { courses } from "../courses";
import { useAuth } from "../hooks/useAuth";
import { useUserProgress } from "../hooks/useUserProgress";

export function ProfilePage() {
  const { user } = useAuth();
  const { progress } = useUserProgress();

  const coursesInProgress = courses.filter(
    (course) => (progress.completedLessons[course.id]?.length ?? 0) > 0,
  );

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
            <User size={32} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-ink-950">
              {user?.displayName ?? user?.email ?? "Ospite"}
            </h1>
            {!user && (
              <p className="text-sm text-ink-500">
                Stai giocando in modalità ospite —{" "}
                <Link to="/accedi" className="font-bold text-brand-600 underline">
                  accedi
                </Link>{" "}
                per salvare i progressi tra dispositivi.
              </p>
            )}
          </div>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-xp-500/10 text-xp-600">
              <Gem size={24} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-ink-950">
                {progress.xp}
              </p>
              <p className="text-sm text-ink-500">XP totali</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-streak-500/10 text-streak-500">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-ink-950">
                {progress.streak}
              </p>
              <p className="text-sm text-ink-500">giorni di streak</p>
            </div>
          </Card>
        </div>

        <h2 className="mb-4 font-display text-lg font-bold text-ink-950">
          Corsi in corso
        </h2>
        {coursesInProgress.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 p-8 text-center">
            <p className="text-ink-500">Non hai ancora iniziato nessun corso.</p>
            <Link to="/corsi">
              <Button variant="primary">Esplora i corsi</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {coursesInProgress.map((course) => {
              const totalLessons = course.levels.reduce(
                (sum, level) => sum + level.lessons.length,
                0,
              );
              const completed =
                progress.completedLessons[course.id]?.length ?? 0;
              return (
                <Link key={course.id} to={`/corsi/${course.id}`}>
                  <Card className="pressable flex flex-col gap-2 p-5 hover:border-brand-300">
                    <h3 className="font-display font-bold text-ink-950">
                      {course.title}
                    </h3>
                    <p className="text-sm text-ink-500">
                      {completed} / {totalLessons} lezioni completate
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
