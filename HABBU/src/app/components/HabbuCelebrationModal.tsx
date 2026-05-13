import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, HandHeart, Repeat, PartyPopper } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  HabbuMascot,
  HabbuVariant,
  HabbuPose,
  POSE_LIBRARY,
  POSE_ORDER,
} from "./HabbuMascot";

interface HabbuCelebrationModalProps {
  open: boolean;
  onClose: () => void;
  variant?: HabbuVariant;
  habitTitle?: string;
}

const HEADLINES = [
  { title: "¡Muy bien hecho!", subtitle: "Un paso más en tu proceso." },
  { title: "Tu panda está orgulloso de ti", subtitle: "Cada gesto suma." },
  { title: "¡Lo lograste!", subtitle: "Pequeñas acciones, grandes cambios." },
  { title: "Avanzaste un poquito más", subtitle: "Y eso ya es mucho." },
];

const PAT_BUBBLES = [
  "¡Qué cariñoso!",
  "Eso me alegra el día.",
  "Mmm, qué rico.",
];

const CHEER_BUBBLES = [
  "¡Hurra! Vamos por más.",
  "Estoy feliz por tu avance.",
  "¡Eso! Sigue así.",
];

const CELEBRATION_POSES: HabbuPose[] = [
  "celebrate",
  "clap",
  "cheer",
  "happy",
  "proud",
];

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

export function HabbuCelebrationModal({
  open,
  onClose,
  variant = "friendly",
  habitTitle,
}: HabbuCelebrationModalProps) {
  const [pose, setPose] = useState<HabbuPose>("celebrate");
  const [bubble, setBubble] = useState<string | undefined>(undefined);
  const [pulse, setPulse] = useState(0);
  const [interactionTick, setInteractionTick] = useState(0);

  const headline = useMemo(
    () => HEADLINES[Math.floor(Math.random() * HEADLINES.length)],
    [open]
  );

  useEffect(() => {
    if (open) {
      setPose("celebrate");
      setBubble(undefined);
      setPulse((p) => p + 1);
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
      CELEBRATION_POSES[(CELEBRATION_POSES.indexOf(pose) + 1) % CELEBRATION_POSES.length];
    setPose(next);
    setBubble(POSE_LIBRARY[next].bubble);
    setInteractionTick((t) => t + 1);
  };

  const patPanda = () => {
    setPose("happy");
    setBubble(pick(PAT_BUBBLES, interactionTick));
    setPulse((p) => p + 1);
    setInteractionTick((t) => t + 1);
  };

  const cheerPanda = () => {
    setPose("cheer");
    setBubble(pick(CHEER_BUBBLES, interactionTick));
    setPulse((p) => p + 1);
    setInteractionTick((t) => t + 1);
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
          aria-labelledby="habbu-celebration-title"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-card p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <HabbuMascot
                key={pulse}
                variant={variant}
                pose={pose}
                celebrate
                completed={1}
                total={1}
                size={180}
                showBubble={!!bubble}
                bubbleMessage={bubble}
                showBadge={false}
                onPandaClick={cyclePose}
              />

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Hábito completado
              </motion.div>

              <motion.h2
                id="habbu-celebration-title"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-3 text-foreground"
              >
                {headline.title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-2 text-muted-foreground"
              >
                {headline.subtitle}
              </motion.p>

              {habitTitle && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 w-full rounded-2xl bg-muted/60 px-4 py-3 text-sm text-foreground"
                >
                  {habitTitle}
                </motion.div>
              )}

              {/* Interaction chips */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="mt-5 flex flex-wrap justify-center gap-2"
              >
                <InteractionChip
                  icon={<HandHeart className="h-3.5 w-3.5" />}
                  label="Acariciar"
                  onClick={patPanda}
                />
                <InteractionChip
                  icon={<Repeat className="h-3.5 w-3.5" />}
                  label="Otra pose"
                  onClick={cyclePose}
                />
                <InteractionChip
                  icon={<PartyPopper className="h-3.5 w-3.5" />}
                  label="Anímame"
                  onClick={cheerPanda}
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mt-6 w-full rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-md hover:bg-primary/90"
              >
                Continuar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InteractionChip({
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

// Re-export the order so consumers can import POSE_ORDER from this module too
export { POSE_ORDER };
