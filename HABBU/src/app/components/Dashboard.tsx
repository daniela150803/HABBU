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
} from "lucide-react";
import { useEffect, useState } from "react";
import habbuDashImg from "../../imports/10.png";
import habbuIconImg from "../../imports/3-2.png";
import { HabbuCelebrationModal } from "./HabbuCelebrationModal";
import { HabbuWelcomeModal } from "./HabbuWelcomeModal";
import { getDailyHabits, getDailyChallengeForDay } from "./habitsData";

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

  const weekData = [
    { day: "L", completed: true },
    { day: "M", completed: true },
    { day: "X", completed: false },
    { day: "J", completed: true },
    { day: "V", completed: false },
    { day: "S", completed: false },
    { day: "D", completed: false, isToday: true },
  ];

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const nutritionPending = habits.filter((h) => h.category === "nutrition" && !h.completed).length;
  const fitnessPending = habits.filter((h) => h.category === "fitness" && !h.completed).length;

  const handleDailyChallengeToggle = () => {
    if (!dailyChallengeCompleted) {
      setShowCompletionMessage(true);
      setTimeout(() => setShowCompletionMessage(false), 3000);
      setCelebratedTitle("Toma 2 vasos extra de agua y camina 15 minutos");
      setCelebrationOpen(true);
    }
    onToggleDailyChallenge();
  };

  const toggleHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit && !habit.completed) {
      setCelebratedTitle(habit.title);
      setCelebrationOpen(true);
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
                      <p className="mb-4 text-lg text-foreground">
                        Hoy vamos poco a poco. Ya diste el primer paso.
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

            {/* Habbu Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden lg:flex lg:justify-center"
            >
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={habbuDashImg}
                  alt="Habbu"
                  className="h-64 w-64 object-contain"
                />
              </motion.div>
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
                <h2 className="mb-3 text-foreground">Tu progreso de hoy</h2>
                <div className="mb-3">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {completedCount} de {totalCount} hábitos completados
                    </span>
                    <span className="text-foreground">{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full border-2 border-primary px-6 py-3 text-primary hover:bg-primary/5"
              >
                Continuar
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
                      day.isToday
                        ? "border-2 border-primary bg-primary/10"
                        : day.completed
                          ? "bg-primary"
                          : "bg-muted"
                    }`}
                  >
                    {day.completed && !day.isToday && (
                      <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                    )}
                    {day.isToday && <Circle className="h-5 w-5 text-primary" />}
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
            className="rounded-3xl bg-accent/20 p-6 shadow-md"
          >
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent-foreground" />
              <h3 className="text-foreground">Consejo de Habbu</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Cambiar una bebida azucarada por agua también cuenta. Los pequeños cambios se suman.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}