import { motion } from "framer-motion";
import { Gamepad2, MousePointerClick, Sparkles, Target } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "../components/layout/PageShell";
import { MathText } from "../components/math/MathText";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { courses } from "../courses";
import { resolveCourseIcon } from "../lib/icons";

const features = [
  {
    icon: MousePointerClick,
    title: "Impara facendo",
    description:
      "Niente lezioni passive: trascina, costruisci, sperimenta. Capisci un concetto risolvendolo con le tue mani.",
  },
  {
    icon: Gamepad2,
    title: "Gamification vera",
    description:
      "XP, streak giornaliere e percorsi a livelli: ogni esercizio ti fa avanzare, come in un gioco fatto bene.",
  },
  {
    icon: Target,
    title: "Feedback immediato",
    description:
      "Sai subito se hai capito: ogni esercizio ti dice all'istante cosa hai azzeccato e cosa rivedere.",
  },
];

export function HomePage() {
  const demoCourse = courses[0];
  const DemoIcon = resolveCourseIcon(demoCourse.icon);

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <FloatingBadge className="top-16 left-[8%] hidden md:block" delay={0}>
          <MathText>{"$f(x) = 2x$"}</MathText>
        </FloatingBadge>
        <FloatingBadge className="top-40 right-[10%] hidden md:block" delay={0.4}>
          <MathText>{"$x^2 + 2x$"}</MathText>
        </FloatingBadge>
        <FloatingBadge className="bottom-10 left-[18%] hidden md:block" delay={0.8}>
          +25 XP
        </FloatingBadge>

        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 pt-20 pb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-600"
          >
            <Sparkles size={16} /> Learning-by-doing per la matematica
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-extrabold text-ink-950 sm:text-5xl"
          >
            Impara la matematica
            <br />
            <span className="text-brand-500">costruendola tu stesso</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl text-lg text-ink-700"
          >
            Galileo Learn trasforma ogni concetto in un esercizio interattivo: trascina, scegli, sperimenta — e guadagna XP a ogni passo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/corsi">
              <Button variant="primary" size="lg">
                Inizia gratis
              </Button>
            </Link>
            <Link to="/accedi">
              <Button variant="outline" size="lg">
                Ho già un account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="flex h-full flex-col gap-3 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                  <feature.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-ink-950">
                  {feature.title}
                </h3>
                <p className="text-sm text-ink-700">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <Card className="flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <DemoIcon size={32} />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-ink-950">
              Prova il corso: {demoCourse.title}
            </h2>
            <p className="mt-1 text-ink-700">{demoCourse.description}</p>
          </div>
          <Link to={`/corsi/${demoCourse.id}`}>
            <Button variant="success" size="lg">
              Prova ora
            </Button>
          </Link>
        </Card>
      </section>
    </PageShell>
  );
}

function FloatingBadge({
  children,
  className,
  delay,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-2xl border border-ink-300/30 bg-white px-4 py-2 font-display font-bold text-ink-900 shadow-soft ${className ?? ""}`}
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        y: { delay, duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
      }}
    >
      {children}
    </motion.div>
  );
}
