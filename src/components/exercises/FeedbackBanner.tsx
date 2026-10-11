import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { MathText } from "../math/MathText";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

export type CheckStatus = "unanswered" | "correct" | "incorrect";

interface FeedbackBannerProps {
  status: CheckStatus;
  canCheck: boolean;
  explanation?: string;
  onCheck: () => void;
  onRetry: () => void;
  onSeeAnswer: () => void;
  onContinue: () => void;
  /** se vero, salta il pulsante "Verifica" e mostra subito "Continua": usato
   * per le schermate di sola teoria/concetto, dove non c'è nulla da verificare. */
  skipCheck?: boolean;
}

export function FeedbackBanner({
  status,
  canCheck,
  explanation,
  onCheck,
  onRetry,
  onSeeAnswer,
  onContinue,
  skipCheck = false,
}: FeedbackBannerProps) {
  const [showWhy, setShowWhy] = useState(false);

  if (skipCheck) {
    return (
      <div className="mt-auto rounded-b-[1.25rem] border-t border-ink-300/25 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl justify-center px-4 pt-4 pb-6">
          <Button variant="success" size="lg" onClick={onContinue}>
            Continua
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-auto rounded-b-[1.25rem] border-t border-ink-300/25 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 pt-4 pb-6">
          <AnimatePresence>
            {status !== "unanswered" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={
                  status === "correct"
                    ? "flex items-center gap-2 rounded-xl bg-success-50 px-4 py-3 font-display font-bold text-success-700"
                    : "flex items-center gap-2 rounded-xl bg-danger-50 px-4 py-3 font-display font-bold text-danger-600"
                }
              >
                {status === "correct" ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <XCircle size={20} />
                )}
                <span>
                  {status === "correct"
                    ? "Esatto!"
                    : "Quella risposta non è corretta."}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.18 }}
              className="flex justify-center gap-3"
            >
              {status === "unanswered" && (
                <Button
                  variant="success"
                  size="lg"
                  disabled={!canCheck}
                  onClick={onCheck}
                >
                  Verifica
                </Button>
              )}
              {status === "incorrect" && (
                <>
                  <Button variant="outline" size="lg" onClick={onSeeAnswer}>
                    Vedi soluzione
                  </Button>
                  <Button variant="primary" size="lg" onClick={onRetry}>
                    Riprova
                  </Button>
                </>
              )}
              {status === "correct" && (
                <>
                  {explanation && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowWhy(true)}
                    >
                      <HelpCircle size={18} />
                      Perché?
                    </Button>
                  )}
                  <Button variant="success" size="lg" onClick={onContinue}>
                    Continua
                  </Button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Renderizzata fuori dal pannello con backdrop-blur: backdrop-filter crea un
          nuovo containing block per gli elementi "fixed", che spezzerebbe la
          centratura della modale rispetto al viewport. */}
      <Modal open={showWhy} onClose={() => setShowWhy(false)}>
        <h2 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-ink-950">
          <HelpCircle size={20} className="text-brand-500" />
          Perché?
        </h2>
        <p className="text-sm text-ink-700">
          <MathText>{explanation ?? ""}</MathText>
        </p>
        <div className="mt-5 flex justify-end">
          <Button variant="primary" onClick={() => setShowWhy(false)}>
            Ho capito
          </Button>
        </div>
      </Modal>
    </>
  );
}
