import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { Sparkles, Heart, Apple, Dumbbell, Leaf } from "lucide-react";

import habbuNutrition from "../../imports/7.png";
import habbuFitness from "../../imports/6-1.png";
import habbuChallenge from "../../imports/9.png";
import habbuFriendly from "../../imports/10.png";
import habbuWave from "../../imports/3.png";
import habbuClap from "../../imports/3-1.png";
import habbuProud from "../../imports/3-2.png";
import habbuCalm from "../../imports/5.png";
import habbuPlayful from "../../imports/2-3.png";
import habbuCheer from "../../imports/2-4.png";
import habbuHappy from "../../imports/6.png";

export type HabbuVariant = "nutrition" | "fitness" | "challenge" | "friendly";

export type HabbuPose =
  | "wave"
  | "celebrate"
  | "clap"
  | "proud"
  | "calm"
  | "playful"
  | "cheer"
  | "happy";

export const POSE_LIBRARY: Record<
  HabbuPose,
  { img: string; label: string; bubble: string }
> = {
  wave: { img: habbuWave, label: "Saludo", bubble: "¡Hola! Me alegra verte." },
  celebrate: {
    img: habbuFriendly,
    label: "Celebra",
    bubble: "¡Estoy feliz por ti!",
  },
  clap: { img: habbuClap, label: "Aplaude", bubble: "Bien hecho, en serio." },
  proud: { img: habbuProud, label: "Orgulloso", bubble: "Tu panda está orgulloso." },
  calm: { img: habbuCalm, label: "Calma", bubble: "Vamos a tu ritmo." },
  playful: { img: habbuPlayful, label: "Juguetón", bubble: "¿Otra ronda?" },
  cheer: { img: habbuCheer, label: "Anima", bubble: "Tú puedes con esto." },
  happy: { img: habbuHappy, label: "Feliz", bubble: "Me hace bien acompañarte." },
};

export const POSE_ORDER: HabbuPose[] = [
  "wave",
  "happy",
  "clap",
  "proud",
  "celebrate",
  "playful",
  "cheer",
  "calm",
];

interface HabbuMascotProps {
  variant: HabbuVariant;
  /** Optional explicit pose. Overrides variant image. */
  pose?: HabbuPose;
  /** Optional explicit bubble message. Overrides mood-based message. */
  bubbleMessage?: string;
  /** completed habits */
  completed?: number;
  /** total habits */
  total?: number;
  /** flips to true briefly when user just completed something */
  celebrate?: boolean;
  size?: number;
  showBubble?: boolean;
  showBadge?: boolean;
  className?: string;
  /** Click handler — when provided, replaces the default tap-to-pet animation. */
  onPandaClick?: () => void;
}

const VARIANT_META: Record<
  HabbuVariant,
  {
    img: string;
    accent: string;
    accentBg: string;
    icon: React.ReactNode | null;
    idleMessages: string[];
    encourageMessages: string[];
    celebrateMessages: string[];
  }
> = {
  nutrition: {
    img: habbuNutrition,
    accent: "text-primary",
    accentBg: "bg-primary",
    icon: <Apple className="h-3.5 w-3.5" />,
    idleMessages: [
      "Hoy comer rico también es cuidarte.",
      "Una fruta más, un pasito más.",
    ],
    encourageMessages: [
      "Vas muy bien. Seguimos juntos.",
      "Tu cuerpo te lo agradece.",
    ],
    celebrateMessages: [
      "¡Delicioso avance!",
      "¡Genial! Eso suma mucho.",
    ],
  },
  fitness: {
    img: habbuFitness,
    accent: "text-secondary",
    accentBg: "bg-secondary",
    icon: <Dumbbell className="h-3.5 w-3.5" />,
    idleMessages: [
      "Moverte un poco hoy ya es ganar.",
      "Listo para estirarnos juntos.",
    ],
    encourageMessages: [
      "Sigue así, tu energía sube.",
      "Un paso más y lo logras.",
    ],
    celebrateMessages: [
      "¡Bien hecho! Cada movimiento cuenta.",
      "¡Eso es! Lo sentí en mis patitas.",
    ],
  },
  challenge: {
    img: habbuChallenge,
    accent: "text-primary",
    accentBg: "bg-primary",
    icon: <Leaf className="h-3.5 w-3.5" />,
    idleMessages: [
      "Hoy haremos algo pequeño y poderoso.",
      "Un reto, un avance. ¿Vamos?",
    ],
    encourageMessages: [
      "Estás muy cerca, tú puedes.",
      "Un empujoncito más conmigo.",
    ],
    celebrateMessages: [
      "¡Reto logrado!",
      "¡Increíble! Lo conseguiste.",
    ],
  },
  friendly: {
    img: habbuFriendly,
    accent: "text-primary",
    accentBg: "bg-primary",
    icon: null,
    idleMessages: [
      "Me alegra verte por aquí.",
      "Vamos a tu ritmo, sin prisa.",
    ],
    encourageMessages: [
      "Estoy contento con tu avance.",
      "Te acompaño en este proceso.",
    ],
    celebrateMessages: [
      "¡Qué bonito verte avanzar!",
      "Tu panda está feliz por ti.",
    ],
  },
};

function pick<T>(arr: T[], seed: number) {
  return arr[seed % arr.length];
}

export function HabbuMascot({
  variant,
  pose,
  bubbleMessage,
  completed = 0,
  total = 0,
  celebrate = false,
  size = 240,
  showBubble = true,
  showBadge = true,
  className = "",
  onPandaClick,
}: HabbuMascotProps) {
  const meta = VARIANT_META[variant];
  const poseImg = pose ? POSE_LIBRARY[pose].img : meta.img;

  const [petting, setPetting] = useState(false);
  const [blink, setBlink] = useState(false);
  const [burstId, setBurstId] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 4200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (celebrate || petting) setBurstId((b) => b + 1);
  }, [celebrate, petting]);

  const ratio = total > 0 ? completed / total : 0;
  const mood: "idle" | "encourage" | "celebrate" =
    celebrate || petting || ratio >= 1
      ? "celebrate"
      : ratio >= 0.5
        ? "encourage"
        : "idle";

  const message = useMemo(() => {
    if (bubbleMessage) return bubbleMessage;
    const seed = completed;
    if (mood === "celebrate") return pick(meta.celebrateMessages, seed);
    if (mood === "encourage") return pick(meta.encourageMessages, seed);
    return pick(meta.idleMessages, seed);
  }, [mood, completed, meta, bubbleMessage]);

  const handlePet = () => {
    setPetting(true);
    setTimeout(() => setPetting(false), 900);
    onPandaClick?.();
  };

  const animate =
    mood === "celebrate"
      ? { scale: [1, 1.1, 1], rotate: [0, -6, 6, -4, 0], y: [0, -14, 0] }
      : petting
        ? { rotate: [0, -3, 3, -2, 0], scale: [1, 1.03, 1] }
        : { y: [0, -8, 0], scale: [1, 1.015, 1] };

  const transition =
    mood === "celebrate"
      ? { duration: 0.8 }
      : petting
        ? { duration: 0.6 }
        : { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10 mx-auto rounded-full blur-2xl"
        style={{
          background:
            variant === "fitness"
              ? "radial-gradient(circle, rgba(245,158,66,0.22), transparent 60%)"
              : "radial-gradient(circle, rgba(74,160,90,0.22), transparent 60%)",
          width: size,
          height: size,
        }}
        animate={{ opacity: 0.5 + ratio * 0.4, scale: mood === "celebrate" ? 1.12 : 1 }}
        transition={{ duration: 0.6 }}
      />

      <motion.button
        type="button"
        onClick={handlePet}
        aria-label="Saludar a Habbu"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        animate={animate}
        transition={transition}
        className="relative cursor-pointer select-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        style={{ width: size, height: size }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={poseImg}
            src={poseImg}
            alt="Habbu"
            draggable={false}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.28 }}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </AnimatePresence>

        <AnimatePresence>
          {blink && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.18 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              aria-hidden
              className="pointer-events-none absolute left-1/4 right-1/4 top-[38%] h-[6%] rounded-full bg-foreground"
            />
          )}
        </AnimatePresence>

        {showBadge && meta.icon && (
          <div
            className={`absolute -right-1 top-2 flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md ${meta.accentBg}`}
          >
            {meta.icon}
          </div>
        )}
      </motion.button>

      <AnimatePresence>
        {(celebrate || petting) && (
          <motion.div
            key={burstId}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0"
            aria-hidden
          >
            {[...Array(8)].map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const dx = Math.cos(angle) * (size * 0.5);
              const dy = Math.sin(angle) * (size * 0.5);
              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                  animate={{ x: dx, y: dy, opacity: [0, 1, 0], scale: [0.4, 1, 0.6] }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="absolute left-1/2 top-1/2"
                >
                  {i % 2 === 0 ? (
                    <Sparkles className={`h-5 w-5 ${meta.accent}`} />
                  ) : (
                    <Heart className={`h-4 w-4 ${meta.accent}`} fill="currentColor" />
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {showBubble && (
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="relative mt-3 max-w-[260px] rounded-2xl bg-card px-4 py-2 text-center text-sm text-foreground shadow-md"
          >
            <span
              aria-hidden
              className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-card"
            />
            {message}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
