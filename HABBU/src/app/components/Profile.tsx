import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { HabbuWelcomeModal } from "./HabbuWelcomeModal";
import {
  Heart,
  ArrowLeft,
  Sparkles,
  Apple,
  Activity,
  Sun,
  Settings,
  Bell,
  Hand,
  Repeat,
  PartyPopper,
  Smile,
  HeartPulse,
  LogOut,
} from "lucide-react";
import emDrinkWater from "../../imports/Emotions/Drink water.png";
import emEatingSalad from "../../imports/Emotions/Eating salad.png";
import emGreet from "../../imports/Emotions/Greet.png";
import emHappy from "../../imports/Emotions/Happy.png";
import emLiftingWeights from "../../imports/Emotions/Lifting Weights.png";
import emMotivated from "../../imports/Emotions/Motivated.png";
import emRelaxed from "../../imports/Emotions/Relaxed.png";
import emRunning from "../../imports/Emotions/Running.png";
import emSad from "../../imports/Emotions/Sad.png";
import emYoga from "../../imports/Emotions/Yoga.png";

import emocionesData from "../data/emociones_habbu.json";
import { getDailyHabits } from "./habitsData";

interface ProfileProps {
  userName: string;
  onBack: () => void;
  onSignOut?: () => void;
  habitCompletion?: Record<string, boolean>;
  dailyChallengeCompleted?: boolean;
  dayStr?: string;
  userInterests?: string[];
}

const MOOD_IMAGES: Record<string, string[]> = {
  desmotivado: [emSad],
  triste: [emRelaxed, emSad],
  tranquilo: [emYoga, emRelaxed],
  motivado: [emMotivated, emYoga],
  animado: [emRunning, emLiftingWeights, emDrinkWater],
  emocionado: [emHappy, emGreet, emEatingSalad],
};

export function Profile({
  userName,
  onBack,
  onSignOut,
  habitCompletion,
  dailyChallengeCompleted,
  dayStr,
}: ProfileProps) {
  const comp = habitCompletion || {};
  const challengeDone = !!dailyChallengeCompleted;
  const currentDayStr = dayStr || new Date().toISOString().split("T")[0];

  const dailyHabits = getDailyHabits(currentDayStr);
  const dailyHabitIds = [
    ...dailyHabits.nutrition.map((h) => h.id),
    ...dailyHabits.fitness.map((h) => h.id),
  ];
  const completedHabitsCount = dailyHabitIds.filter((id) => comp[id]).length;
  const totalCompleted = completedHabitsCount + (challengeDone ? 1 : 0);
  const overallProgress = totalCompleted / 5; // value between 0 and 1

  const moodKey = (() => {
    if (totalCompleted >= 5) return "emocionado";
    if (totalCompleted === 4) return "animado";
    if (totalCompleted === 3) return "motivado";
    if (totalCompleted === 2) return "tranquilo";
    if (totalCompleted === 1) return "triste";
    return "desmotivado";
  })();

  const moodInfo = (() => {
    const config = {
      desmotivado: {
        label: "Desmotivado",
        tone: "text-red-500",
        bg: "bg-red-500/10",
      },
      triste: {
        label: "Triste",
        tone: "text-orange-500",
        bg: "bg-orange-500/10",
      },
      tranquilo: {
        label: "Tranquilo",
        tone: "text-yellow-500",
        bg: "bg-yellow-500/10",
      },
      motivado: {
        label: "Motivado",
        tone: "text-green-500",
        bg: "bg-green-500/10",
      },
      animado: {
        label: "Animado",
        tone: "text-teal-500",
        bg: "bg-teal-500/10",
      },
      emocionado: {
        label: "Emocionado",
        tone: "text-purple-500",
        bg: "bg-purple-500/10",
      },
    };
    return config[moodKey] || config.desmotivado;
  })();

  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState("");
  const [activeImage, setActiveImage] = useState(emSad);
  const [bubble, setBubble] = useState("");
  const [isInteracting, setIsInteracting] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Show welcome popup once per browser session
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("habbu-profile-welcome-seen");
      if (!seen) {
        const t = setTimeout(() => setWelcomeOpen(true), 350);
        sessionStorage.setItem("habbu-profile-welcome-seen", "1");
        return () => clearTimeout(t);
      }
    } catch {
      setWelcomeOpen(true);
    }
  }, []);

  // Sync state with mood changes deterministically
  useEffect(() => {
    const defaultImg = MOOD_IMAGES[moodKey][0];
    setActiveImage(defaultImg);
    setImageIndex(0);

    const data = (emocionesData.emociones as Record<string, { nombre: string; frases: string[] }>)[moodKey];
    const frases = data?.frases || ["¡Sigue adelante!"];
    let seed = 0;
    const keyString = `${userName}-${currentDayStr}-${moodKey}`;
    for (let i = 0; i < keyString.length; i++) {
      seed += keyString.charCodeAt(i);
    }
    const idx = seed % frases.length;
    const phrase = frases[idx];
    setSelectedPhrase(phrase);
    setBubble(phrase);
  }, [moodKey, userName, currentDayStr]);

  const sayHi = () => {
    setIsInteracting(true);
    setActiveImage(emGreet);
    setBubble(`¡Hola, ${userName}! Me alegra saludarte hoy. 👋`);
    setTimeout(() => setIsInteracting(false), 1200);
  };

  const patPanda = () => {
    setIsInteracting(true);
    const petImg = MOOD_IMAGES[moodKey].includes(emHappy) ? emHappy : emRelaxed;
    setActiveImage(petImg);
    setBubble("¡Qué lindo gesto! Me encantan las caricias. 🐼❤️");
    setTimeout(() => setIsInteracting(false), 1200);
  };

  const celebrate = () => {
    setIsInteracting(true);
    setIsCelebrating(true);
    setActiveImage(emHappy);
    setBubble("¡Eso es! ¡Vamos juntos por más bienestar! 🎉");
    setTimeout(() => {
      setIsInteracting(false);
      setIsCelebrating(false);
    }, 1500);
  };

  const cyclePose = () => {
    const images = MOOD_IMAGES[moodKey];
    const nextIdx = (imageIndex + 1) % images.length;
    setImageIndex(nextIdx);
    setActiveImage(images[nextIdx]);

    const poseMessages: Record<string, string> = {
      [emRunning]: "¡Estoy listo para correr! 🏃",
      [emLiftingWeights]: "¡Un poco de fuerza! 💪",
      [emDrinkWater]: "¡Salud por la hidratación! 💧",
      [emEatingSalad]: "¡Hora de comer saludable! 🥗",
      [emYoga]: "Buscando mi centro... 🧘",
      [emRelaxed]: "Un momento de paz. 🌸",
      [emSad]: "Un día a la vez... 🍂",
      [emHappy]: "¡Me siento súper bien! 😄",
      [emGreet]: "¡Hola de nuevo! 👋",
      [emMotivated]: "¡Vamos con toda la actitud! ✨"
    };
    const key = images[nextIdx];
    if (poseMessages[key]) {
      setBubble(poseMessages[key]);
    }
  };

  const checkMood = () => {
    setActiveImage(MOOD_IMAGES[moodKey][0]);
    setImageIndex(0);
    setBubble(selectedPhrase);
  };

  const greetingByTime = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
  })();

  const recognitions = [
    {
      icon: <Apple className="h-5 w-5 text-primary" />,
      label: "Has cuidado tu alimentación",
      description: "Pequeños gestos que te hacen bien.",
    },
    {
      icon: <Activity className="h-5 w-5 text-secondary" />,
      label: "Te has movido más",
      description: "Tu cuerpo lo agradece.",
    },
    {
      icon: <Sun className="h-5 w-5 text-accent-foreground" />,
      label: "Te diste tiempo",
      description: "Cuidarte también es descansar.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HabbuWelcomeModal
        open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        userName={userName}
        onAcceptChallenge={() => {
          setActiveImage(emMotivated);
          setBubble("¡Vamos por el reto de hoy! 🚀");
        }}
      />

      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden text-foreground sm:block">Habbu</span>
            </div>
          </div>

          <h2 className="text-lg text-foreground">Mi perfil</h2>

          <div className="flex items-center gap-2">
            {onSignOut && (
              <button
                onClick={onSignOut}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
            <button
              aria-label="Notificaciones"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
            >
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button
              aria-label="Ajustes"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-muted/80"
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* Habbu y tu progreso — dedicated section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          aria-labelledby="habbu-progress-title"
        >
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 id="habbu-progress-title" className="text-foreground">
                Habbu y tu progreso
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Tu panda refleja cómo te estás cuidando. Interactúa con él
                cuando quieras.
              </p>
            </div>
            <div
              className={`hidden items-center gap-2 rounded-full px-3 py-1 text-xs sm:inline-flex ${moodInfo.bg} ${moodInfo.tone}`}
            >
              <HeartPulse className="h-3.5 w-3.5" />
              Habbu hoy: {moodInfo.label.toLowerCase()}
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 p-8 shadow-md">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[auto,1fr]">
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex flex-col items-center" style={{ minHeight: 280 }}>
                  {/* Glowing background */}
                  <motion.div
                    aria-hidden
                    className="absolute top-[80px] -z-10 rounded-full blur-2xl opacity-40 bg-gradient-to-tr from-primary to-secondary"
                    style={{
                      width: 180,
                      height: 180,
                    }}
                    animate={
                      isInteracting
                        ? { scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }
                        : { scale: [1, 1.05, 1], opacity: [0.35, 0.45, 0.35] }
                    }
                    transition={{
                      duration: isInteracting ? 0.6 : 3,
                      repeat: isInteracting ? 0 : Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  {/* Speech Bubble */}
                  <div className="h-16 flex items-end justify-center mb-2">
                    {bubble && (
                      <motion.div
                        key={bubble}
                        initial={{ opacity: 0, y: 6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.95 }}
                        transition={{ duration: 0.28 }}
                        className="relative max-w-[260px] rounded-2xl bg-card border border-border px-4 py-1.5 text-center text-xs text-foreground shadow-sm"
                      >
                        <span
                          aria-hidden
                          className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-r border-b border-border bg-card"
                        />
                        {bubble}
                      </motion.div>
                    )}
                  </div>

                  {/* Panda Mascot Image */}
                  <motion.button
                    type="button"
                    onClick={patPanda}
                    aria-label="Saludar a Habbu"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    animate={
                      isCelebrating
                        ? { scale: [1, 1.1, 1], rotate: [0, -6, 6, -4, 0], y: [0, -12, 0] }
                        : isInteracting
                          ? { rotate: [0, -3, 3, -2, 0], scale: [1, 1.03, 1] }
                          : { y: [0, -6, 0], scale: [1, 1.015, 1] }
                    }
                    transition={
                      isCelebrating
                        ? { duration: 0.8 }
                        : isInteracting
                          ? { duration: 0.6 }
                          : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                    }
                    className="relative cursor-pointer select-none rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    style={{ width: 180, height: 180 }}
                  >
                    <img
                      src={activeImage}
                      alt="Habbu"
                      draggable={false}
                      className="h-full w-full object-contain"
                    />

                    {/* Celebration / Petting particle burst */}
                    {isCelebrating && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => {
                          const angle = (i / 8) * Math.PI * 2;
                          const dx = Math.cos(angle) * 90;
                          const dy = Math.sin(angle) * 90;
                          return (
                            <motion.div
                              key={i}
                              initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                              animate={{ x: dx, y: dy, opacity: [0, 1, 0], scale: [0.4, 1.1, 0.7] }}
                              transition={{ duration: 0.9, ease: "easeOut" }}
                              className="absolute left-1/2 top-1/2 text-primary"
                            >
                              {i % 2 === 0 ? "✨" : "❤️"}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.button>
                </div>

                {/* Interaction chips */}
                <div className="flex flex-wrap justify-center gap-2">
                  <ProfileChip
                    icon={<Hand className="h-3.5 w-3.5" />}
                    label="Saludar"
                    onClick={sayHi}
                  />
                  <ProfileChip
                    icon={<Smile className="h-3.5 w-3.5" />}
                    label="Acariciar"
                    onClick={patPanda}
                  />
                  <ProfileChip
                    icon={<PartyPopper className="h-3.5 w-3.5" />}
                    label="Celebrar"
                    onClick={celebrate}
                  />
                  <ProfileChip
                    icon={<Repeat className="h-3.5 w-3.5" />}
                    label="Otra pose"
                    onClick={cyclePose}
                  />
                  <ProfileChip
                    icon={<HeartPulse className="h-3.5 w-3.5" />}
                    label="Ver ánimo"
                    onClick={checkMood}
                  />
                </div>
              </div>

              <div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-2 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 text-xs text-primary shadow-sm"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Tu panda acompañante
                </motion.div>
                <h1 className="mb-3 text-foreground">
                  {greetingByTime}, {userName}
                </h1>
                <p className="mb-5 text-lg text-muted-foreground">
                  {selectedPhrase}
                </p>

                {/* Mini progress reflection inside the card */}
                <div className="mb-4 rounded-2xl bg-card/70 p-4 backdrop-blur">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Cómo Habbu siente tu avance
                    </span>
                    <span className={`font-semibold ${moodInfo.tone}`}>{moodInfo.label}</span>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>

                  {/* Milestones labels */}
                  <div className="mt-2 flex justify-between text-[10px] text-muted-foreground px-1">
                    <span className={totalCompleted === 0 ? "text-primary font-medium" : ""}>Desmotivado</span>
                    <span className={totalCompleted === 1 ? "text-primary font-medium" : ""}>Triste</span>
                    <span className={totalCompleted === 2 ? "text-primary font-medium" : ""}>Tranquilo</span>
                    <span className={totalCompleted === 3 ? "text-primary font-medium" : ""}>Motivado</span>
                    <span className={totalCompleted === 4 ? "text-primary font-medium" : ""}>Animado</span>
                    <span className={totalCompleted === 5 ? "text-primary font-medium" : ""}>Emocionado</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-card/80 p-4 backdrop-blur">
                  <p className="text-sm text-foreground">
                    “No se trata de hacerlo perfecto, sino de seguir contigo.”
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    — Habbu · estado: {moodInfo.label.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Soft progress summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-3xl bg-card p-6 shadow-md"
        >
          <h3 className="mb-2 text-foreground">Tu avance reciente</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            Una mirada general, sin presiones ni cuentas atrás.
          </p>

          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cómo te has cuidado</span>
            <span className="text-foreground">Vas bien</span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </motion.section>

        {/* Positive recognitions — non-competitive */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="mb-4 text-foreground">Reconocimientos de Habbu</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recognitions.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="rounded-3xl bg-card p-5 shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-muted">
                  {r.icon}
                </div>
                <p className="mb-1 text-foreground">{r.label}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Account info */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-3xl bg-card p-6 shadow-md"
        >
          <h3 className="mb-4 text-foreground">Tu cuenta</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
              <span className="text-sm text-muted-foreground">Nombre</span>
              <span className="text-foreground">{userName}</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
              <span className="text-sm text-muted-foreground">Tu acompañante</span>
              <span className="text-foreground">Habbu 🐼</span>
            </div>
          </div>

          {onSignOut && (
            <motion.button
              onClick={onSignOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border-2 border-destructive/30 bg-destructive/10 px-6 py-3.5 text-destructive transition-all hover:bg-destructive/20"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </motion.button>
          )}
        </motion.section>
      </main>
    </div>
  );
}

function ProfileChip({
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
