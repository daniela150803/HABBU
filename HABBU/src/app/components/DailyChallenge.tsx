import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ArrowLeft,
  Droplet,
  Clock,
  Zap,
  CheckCircle2,
  Circle,
  Sparkles,
  Flame,
} from "lucide-react";
import { useState } from "react";
import { HabbuMascot } from "./HabbuMascot";
import { HabbuCelebrationModal } from "./HabbuCelebrationModal";
import { getDailyHabits, loadHabitCompletionState } from "./habitsData";

interface DailyChallengeProps {
  onBack: () => void;
  userName: string;
  dayStr: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

export function DailyChallenge({
  onBack,
  userName,
  dayStr,
  isCompleted,
  onToggleComplete,
}: DailyChallengeProps) {
  // Calculate completed habits count dynamically from localStorage completion state
  const { nutrition, fitness } = getDailyHabits(dayStr);
  const completionState = loadHabitCompletionState(userName, dayStr);
  const totalCount = 4;
  const completedCount = [
    ...nutrition.map((h) => h.id),
    ...fitness.map((h) => h.id),
  ].filter((id) => completionState[id]).length;

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);

  const weekProgress = [
    { day: "L", completed: true },
    { day: "M", completed: true },
    { day: "X", completed: false },
    { day: "J", completed: true },
    { day: "V", completed: false },
    { day: "S", completed: false },
    { day: "D", completed: false, isToday: true },
  ];

  const handleComplete = () => {
    if (!isCompleted) {
      setShowCelebration(true);
      setCelebrationOpen(true);
      setTimeout(() => setShowCelebration(false), 2000);
    }
    onToggleComplete();
  };

  const handleChangeChallenge = () => {
    // This would open a modal or navigate to challenge selection
    console.log("Change challenge clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      <HabbuCelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        variant="challenge"
        habitTitle="Toma 2 vasos extra de agua"
      />
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
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

          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <span className="text-sm text-foreground">
              {completedCount} de {totalCount} hábitos completados
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Hero Section with Habbu */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mx-auto mb-6 inline-flex justify-center">
            <HabbuMascot
              variant="challenge"
              completed={isCompleted ? 1 : 0}
              total={1}
              celebrate={showCelebration}
              size={280}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl"
          >
            <p className="text-lg text-foreground md:text-xl">
              {isCompleted
                ? "¡Muy bien! Los hábitos pequeños también cuentan."
                : "Hoy haremos algo pequeño que puede marcar la diferencia."}
            </p>
          </motion.div>
        </motion.section>

        {/* Challenge Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div
            className={`rounded-3xl bg-card p-8 shadow-lg transition-all ${
              isCompleted ? "border-2 border-primary" : ""
            }`}
          >
            {/* Category Badge */}
            <div className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
              Alimentación saludable
            </div>

            {/* Challenge Title */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="mb-3 text-foreground">Toma 2 vasos extra de agua</h1>
                <p className="text-muted-foreground">
                  Mantenerte hidratado mejora tu concentración, energía y ayuda a tu digestión. El agua
                  también puede reducir antojos de comida.
                </p>
              </div>
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <Droplet className="h-8 w-8 text-primary" />
              </div>
            </div>

            {/* Meta Information */}
            <div className="mb-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">5 minutos</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Fácil</span>
              </div>
            </div>

            {/* How to Do It */}
            <div className="mb-6 rounded-2xl bg-muted/50 p-6">
              <h3 className="mb-4 text-foreground">Cómo hacerlo</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    1
                  </div>
                  <p className="text-foreground">Lleva una botella o vaso contigo</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    2
                  </div>
                  <p className="text-foreground">Toma un vaso de agua antes del almuerzo</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    3
                  </div>
                  <p className="text-foreground">Toma otro antes de terminar el día</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                onClick={handleComplete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full px-8 py-4 shadow-lg transition-all ${
                  isCompleted
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    ¡Completado!
                  </>
                ) : (
                  <>
                    <Circle className="h-5 w-5" />
                    Marcar como completado
                  </>
                )}
              </motion.button>

              {!isCompleted && (
                <motion.button
                  onClick={handleChangeChallenge}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-full border-2 border-primary px-8 py-4 text-primary hover:bg-primary/5"
                >
                  Cambiar reto
                </motion.button>
              )}
            </div>
          </div>
        </motion.section>

        {/* Unlocked Recommendation (shown after completion) */}
        <AnimatePresence>
          {isCompleted && (
            <motion.section
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="rounded-3xl bg-gradient-to-br from-secondary/10 to-primary/10 p-6 shadow-md">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-secondary" />
                  <h3 className="text-foreground">Desbloqueado: Próximo paso</h3>
                </div>
                <p className="text-muted-foreground">
                  Mañana intenta reemplazar una bebida azucarada por agua. Cada pequeño cambio suma.
                </p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Week Progress */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-card p-6 shadow-md"
        >
          <h3 className="mb-4 text-foreground">Tu progreso esta semana</h3>
          <div className="flex justify-between gap-2">
            {weekProgress.map((day, index) => (
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
                  {day.isToday && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                      <Flame className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}