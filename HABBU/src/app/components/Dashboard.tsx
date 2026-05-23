import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  User,
  Apple,
  Activity,
  CheckCircle2,
  Circle,
  ChevronRight,
  Lightbulb,
  Hand,
  Smile,
  PartyPopper,
  Repeat,
  HeartPulse,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import habbuIconImg from "../../imports/3-2.png";
import { HabbuCelebrationModal } from "./HabbuCelebrationModal";
import { HabbuWelcomeModal } from "./HabbuWelcomeModal";
import { getDailyHabits, getDailyChallengeForDay, getWeekDateStrings } from "./habitsData";

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
import consejosData from "../data/consejos_habbu.json";

const MOOD_IMAGES: Record<string, string[]> = {
  desmotivado: [emSad],
  triste: [emRelaxed, emSad],
  tranquilo: [emYoga, emRelaxed],
  motivado: [emMotivated, emYoga],
  animado: [emRunning, emLiftingWeights, emDrinkWater],
  emocionado: [emHappy, emGreet, emEatingSalad],
};

interface DashboardProps {
  userName: string;
  dayStr: string;
  habitCompletion: Record<string, boolean>;
  onToggleHabit: (habitId: string) => void;
  dailyChallengeCompleted: boolean;
  onToggleDailyChallenge: () => void;
  onViewChallenge?: () => void;
  onViewNutritionHabits?: () => void;
  onViewFitnessHabits?: () => void;
  onViewProfile?: () => void;
  userInterests?: string[];
  weeklyCompletion?: Record<string, boolean>;
}

interface DailyHabit {
  id: string;
  title: string;
  completed: boolean;
  category: "nutrition" | "fitness";
}

export function Dashboard({
  userName = "Usuario",
  dayStr,
  habitCompletion,
  onToggleHabit,
  dailyChallengeCompleted,
  onToggleDailyChallenge,
  onViewChallenge,
  onViewNutritionHabits,
  onViewFitnessHabits,
  onViewProfile,
  userInterests,
  weeklyCompletion = {},
}: DashboardProps) {
  // Derive dynamic daily habits based on the date seed
  const { nutrition, fitness } = getDailyHabits(dayStr);
  const dailyChallenge = getDailyChallengeForDay(dayStr, userInterests);
  const habits: DailyHabit[] = [
    ...nutrition.map((h) => ({
      id: h.id,
      title: h.title,
      completed: !!habitCompletion[h.id],
      category: h.category as "nutrition" | "fitness",
    })),
    ...fitness.map((h) => ({
      id: h.id,
      title: h.title,
      completed: !!habitCompletion[h.id],
      category: h.category as "nutrition" | "fitness",
    })),
  ];

  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebratedTitle, setCelebratedTitle] = useState<string | undefined>();
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  // ── Daily tip (seeded by calendar date so it changes each day but is stable within a session) ──
  const dailyTip = useMemo(() => {
    const allTips = [...consejosData.alimentacion, ...consejosData.acondicionamiento];
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return allTips[seed % allTips.length];
  }, []);

  // Show Habbu's welcome popup right after login/registration, once per session.
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("habbu-dashboard-welcome-seen");
      if (!seen) {
        const t = setTimeout(() => setWelcomeOpen(true), 450);
        sessionStorage.setItem("habbu-dashboard-welcome-seen", "1");
        return () => clearTimeout(t);
      }
    } catch {
      setWelcomeOpen(true);
    }
  }, []);

  const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];
  const weekDays = getWeekDateStrings(dayStr);
  const weekData = weekDays.map((dateStr, i) => ({
    day: DAY_LABELS[i],
    completed: !!weeklyCompletion[dateStr],
    isToday: dateStr === dayStr,
  }));

  const completedCount = habits.filter((h) => h.completed).length;
  const challengeDone = !!dailyChallengeCompleted;
  const totalCompleted = completedCount + (challengeDone ? 1 : 0);
  const overallProgress = totalCompleted / 5; // value between 0 and 1
  const progressPercentage = overallProgress * 100;
  const totalCount = 5; // 4 habits + 1 daily challenge

  const nutritionPending = habits.filter((h) => h.category === "nutrition" && !h.completed).length;
  const fitnessPending = habits.filter((h) => h.category === "fitness" && !h.completed).length;

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

  const [selectedPhrase, setSelectedPhrase] = useState("");
  const [activeImage, setActiveImage] = useState(emSad);
  const [bubble, setBubble] = useState("");
  const [isInteracting, setIsInteracting] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Sync state with mood changes
  useEffect(() => {
    const defaultImg = MOOD_IMAGES[moodKey][0];
    setActiveImage(defaultImg);
    setImageIndex(0);

    const data = (emocionesData.emociones as Record<string, { nombre: string; frases: string[] }>)[moodKey];
    const frases = data?.frases || ["¡Sigue adelante!"];
    let seed = 0;
    const keyString = `${userName}-${dayStr}-${moodKey}`;
    for (let i = 0; i < keyString.length; i++) {
      seed += keyString.charCodeAt(i);
    }
    const idx = seed % frases.length;
    const phrase = frases[idx];
    setSelectedPhrase(phrase);
    setBubble(phrase);
  }, [moodKey, userName, dayStr]);

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

  const celebrateAction = () => {
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

  const handleDailyChallengeToggle = () => {
    if (!dailyChallengeCompleted) {
      setShowCompletionMessage(true);
      setTimeout(() => setShowCompletionMessage(false), 3000);
      setCelebratedTitle(dailyChallenge.titulo);
      setCelebrationOpen(true);
      celebrateAction();
    }
    onToggleDailyChallenge();
  };

  const toggleHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit && !habit.completed) {
      setCelebratedTitle(habit.title);
      setCelebrationOpen(true);
      celebrateAction();
    }
    onToggleHabit(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <HabbuCelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        variant="challenge"
        habitTitle={celebratedTitle}
      />

      <HabbuWelcomeModal
        open={welcomeOpen}
        onClose={() => setWelcomeOpen(false)}
        userName={userName}
        onAcceptChallenge={onViewChallenge}
      />
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-foreground">Habbu</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-2 text-sm sm:flex">
              <span className="text-muted-foreground">Hola,</span>
              <span className="text-foreground">{userName}</span>
            </div>

            <button
              onClick={onViewProfile}
              aria-label="Ir a mi perfil"
              className="flex items-center gap-2 rounded-full bg-muted px-3 py-2 hover:bg-muted/80"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
                <User className="h-4 w-4 text-primary" />
              </span>
              <span className="hidden text-sm text-foreground sm:block">Mi perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero Section with Habbu */}
        <section className="mb-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h1 className="text-foreground">Hola, {userName} 👋</h1>
                <div className="rounded-3xl bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-20 w-20 overflow-hidden rounded-full bg-primary/10">
                        <img
                          src={habbuIconImg}
                          alt="Habbu"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="mb-4 text-lg text-muted-foreground italic">
                        “{selectedPhrase}”
                      </p>
                      <motion.button
                        onClick={onViewChallenge}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
                      >
                        Ver reto de hoy
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Habbu Mascot Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center bg-card/30 border border-border/50 p-6 rounded-3xl backdrop-blur-sm shadow-sm"
            >
              <div className="relative flex flex-col items-center" style={{ minHeight: 360 }}>
                {/* Glowing background */}
                <motion.div
                  aria-hidden
                  className="absolute top-[100px] -z-10 rounded-full blur-2xl opacity-40 bg-gradient-to-tr from-primary to-secondary"
                  style={{
                    width: 250,
                    height: 210,
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
                <div className="h-20 flex items-end justify-center mb-3">
                  {bubble && (
                    <motion.div
                      key={bubble}
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      transition={{ duration: 0.28 }}
                      className="relative max-w-[290px] rounded-2xl bg-card border border-border px-4 py-2 text-center text-xs text-foreground shadow-sm"
                    >
                      <span
                        aria-hidden
                        className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-border bg-card"
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
                  style={{ width: 210, height: 210 }}
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
                      {[...Array(6)].map((_, i) => {
                        const angle = (i / 6) * Math.PI * 2;
                        const dx = Math.cos(angle) * 90;
                        const dy = Math.sin(angle) * 90;
                        return (
                          <motion.div
                            key={i}
                            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                            animate={{ x: dx, y: dy, opacity: [0, 1, 0], scale: [0.4, 1.1, 0.7] }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                            className="absolute left-1/2 top-1/2 text-primary text-xs"
                          >
                            {i % 2 === 0 ? "✨" : "❤️"}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.button>
              </div>

              {/* Mascot Interaction Chips */}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <DashboardChip
                  icon={<Hand className="h-3.5 w-3.5" />}
                  label="Saludar"
                  onClick={sayHi}
                />
                <DashboardChip
                  icon={<Smile className="h-3.5 w-3.5" />}
                  label="Acariciar"
                  onClick={patPanda}
                />
                <DashboardChip
                  icon={<PartyPopper className="h-3.5 w-3.5" />}
                  label="Celebrar"
                  onClick={celebrateAction}
                />
                <DashboardChip
                  icon={<Repeat className="h-3.5 w-3.5" />}
                  label="Otra pose"
                  onClick={cyclePose}
                />
                <DashboardChip
                  icon={<HeartPulse className="h-3.5 w-3.5" />}
                  label="Ánimo"
                  onClick={checkMood}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Progress Card */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl bg-card p-6 shadow-md"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-foreground">Tu progreso de hoy</h2>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${moodInfo.bg} ${moodInfo.tone}`}>
                    Habbu está: {moodInfo.label}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {totalCompleted} de {totalCount} actividades completadas (4 hábitos + 1 reto diario)
                    </span>
                    <span className="text-foreground font-medium">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>

                  {/* Milestones labels */}
                  <div className="mt-2 flex justify-between text-[9px] sm:text-[10px] text-muted-foreground px-1">
                    <span className={totalCompleted === 0 ? "text-primary font-medium" : ""}>Desmotivado</span>
                    <span className={totalCompleted === 1 ? "text-primary font-medium" : ""}>Triste</span>
                    <span className={totalCompleted === 2 ? "text-primary font-medium" : ""}>Tranquilo</span>
                    <span className={totalCompleted === 3 ? "text-primary font-medium" : ""}>Motivado</span>
                    <span className={totalCompleted === 4 ? "text-primary font-medium" : ""}>Animado</span>
                    <span className={totalCompleted === 5 ? "text-primary font-medium" : ""}>Emocionado</span>
                  </div>
                </div>
              </div>
              <motion.button
                onClick={onViewChallenge}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full border-2 border-primary px-6 py-3 text-primary hover:bg-primary/5"
              >
                Ver Retos
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Category Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nutrition Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="rounded-3xl bg-card p-6 shadow-md transition-shadow"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Apple className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-2 text-foreground">Alimentación saludable</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {nutritionPending === 0
                  ? "¡Todo completo por hoy!"
                  : `${nutritionPending} ${nutritionPending === 1 ? "tarea pendiente" : "tareas pendientes"}`}
              </p>
              <motion.button
                onClick={onViewNutritionHabits}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 text-primary hover:gap-3 transition-all"
              >
                Ver hábitos
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </motion.div>

            {/* Fitness Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="rounded-3xl bg-card p-6 shadow-md transition-shadow"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
                <Activity className="h-7 w-7 text-secondary" />
              </div>
              <h3 className="mb-2 text-foreground">Acondicionamiento físico</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {fitnessPending === 0
                  ? "¡Todo completo por hoy!"
                  : `${fitnessPending} ${fitnessPending === 1 ? "tarea pendiente" : "tareas pendientes"}`}
              </p>
              <motion.button
                onClick={onViewFitnessHabits}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 text-secondary hover:gap-3 transition-all"
              >
                Ver hábitos
                <ChevronRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Daily Challenge */}
        <section className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-6 shadow-lg"
          >
            <div className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-2 text-sm text-primary">
              Reto del día
            </div>
            <h2 className="mb-4 text-foreground">{dailyChallenge.titulo}</h2>
            <p className="mb-6 text-muted-foreground">
              {dailyChallenge.descripcion}
            </p>

            <motion.button
              onClick={handleDailyChallengeToggle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 rounded-full px-6 py-3 transition-all ${
                dailyChallengeCompleted
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-primary text-primary hover:bg-primary/5"
              }`}
            >
              {dailyChallengeCompleted ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
              {dailyChallengeCompleted ? "¡Completado!" : "Marcar como completado"}
            </motion.button>

            <AnimatePresence>
              {showCompletionMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 rounded-xl bg-primary/20 p-4"
                >
                  <p className="text-primary">🎉 ¡Excelente trabajo! Sigue así.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Week Overview & Quick Tips */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Week Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-3xl bg-card p-6 shadow-md"
          >
            <h3 className="mb-4 text-foreground">Tu semana</h3>
            <div className="flex justify-between gap-2">
              {weekData.map((day, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-sm text-muted-foreground">{day.day}</span>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                      day.completed
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : day.isToday
                          ? "border-2 border-primary bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : day.isToday ? (
                      <Circle className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5 opacity-25" />
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-3xl bg-accent/20 p-6 shadow-md flex flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent-foreground" />
              <h3 className="text-foreground">Consejo de Habbu</h3>
            </div>

            {dailyTip && (
              <>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-0.5 text-[11px] font-semibold text-primary">
                  {dailyTip.emoji} {dailyTip.categoria}
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {dailyTip.consejo}
                </p>
              </>
            )}
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function DashboardChip({
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
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:bg-muted/60"
    >
      <span className="text-primary">{icon}</span>
      {label}
    </motion.button>
  );
}