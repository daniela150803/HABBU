import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, X, Hand, Repeat, Leaf } from "lucide-react";
import {
  HabbuMascot,
  HabbuPose,
  POSE_LIBRARY,
} from "./HabbuMascot";

interface HabbuWelcomeModalProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  onAcceptChallenge?: () => void;
}

interface DailySuggestion {
  title: string;
  description: string;
}

const SUGGESTIONS: DailySuggestion[] = [
  {
    title: "Toma un vaso de agua extra",
    description: "Un gesto simple que te ayudará a sentirte con más energía.",
  },
  {
    title: "Camina 10 minutos al aire libre",
    description: "Sin prisa, solo para despejar la mente y mover el cuerpo.",
  },
  {
    title: "Suma una fruta a tu día",
    description: "Pequeño cambio, gran sensación de bienestar.",
  },
  {
    title: "Estírate un momento",
    description: "Cuello, brazos, espalda. Tu cuerpo lo agradecerá.",
  },
];

const GREETINGS = [
  "Qué bueno verte de nuevo",
  "Me alegra que vuelvas",
  "Hola otra vez",
];

const WELCOME_POSES: HabbuPose[] = ["wave", "happy", "cheer", "proud"];

export function HabbuWelcomeModal({
  open,
  onClose,
  userName,
  onAcceptChallenge,
}: HabbuWelcomeModalProps) {
  const [pose, setPose] = useState<HabbuPose>("wave");
  const [bubble, setBubble] = useState<string | undefined>(
    POSE_LIBRARY.wave.bubble
  );

  const greeting = useMemo(
    () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
    [open]
  );
  const suggestion = useMemo(
    () => SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)],
    [open]
  );

  useEffect(() => {
    if (open) {
      setPose("wave");
      setBubble(POSE_LIBRARY.wave.bubble);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const cyclePose = () => {
    const next =
      WELCOME_POSES[(WELCOME_POSES.indexOf(pose) + 1) % WELCOME_POSES.length];
    setPose(next);
    setBubble(POSE_LIBRARY[next].bubble);
  };

  const sayHi = () => {
    setPose("wave");
    setBubble(`¡Hola, ${userName}!`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="habbu-welcome-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Soft ambient gradient header */}
            <div className="bg-gradient-to-br from-primary/15 via-accent/15 to-secondary/15 px-8 pb-2 pt-8">
              <div className="flex flex-col items-center text-center">
                <HabbuMascot
                  variant="friendly"
                  pose={pose}
                  bubbleMessage={bubble}
                  size={170}
                  showBubble
                  showBadge={false}
                  onPandaClick={cyclePose}
                />
              </div>
            </div>

            <div className="px-8 pb-8 pt-4">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Bienvenido a tu perfil
                </motion.div>

                <motion.h2
                  id="habbu-welcome-title"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-3 text-foreground"
                >
                  {greeting}, {userName}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 text-muted-foreground"
                >
                  Estoy feliz de acompañarte hoy. Vamos a tu ritmo, sin prisa.
                </motion.p>
              </div>

              {/* Daily suggestion card */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-5 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Leaf className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 text-xs text-primary">
                      Sugerencia del día
                    </div>
                    <p className="text-foreground">{suggestion.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Interaction chips */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex flex-wrap justify-center gap-2"
              >
                <WelcomeChip
                  icon={<Hand className="h-3.5 w-3.5" />}
                  label="Saludar"
                  onClick={sayHi}
                />
                <WelcomeChip
                  icon={<Repeat className="h-3.5 w-3.5" />}
                  label="Otra pose"
                  onClick={cyclePose}
                />
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-6 flex flex-col gap-2 sm:flex-row"
              >
                <button
                  onClick={() => {
                    onAcceptChallenge?.();
                    onClose();
                  }}
                  className="flex-1 rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-md transition-transform hover:scale-[1.02] hover:bg-primary/90"
                >
                  Acepto el reto
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-full border-2 border-primary px-6 py-3 text-primary transition-colors hover:bg-primary/5"
                >
                  Más tarde
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WelcomeChip({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground shadow-sm hover:bg-muted/60"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </motion.button>
  );
}
