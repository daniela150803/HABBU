import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ArrowLeft,
  Footprints,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  Zap,
  Battery,
  BatteryMedium,
  BatteryLow,
} from "lucide-react";
import { useState } from "react";
import { HabbuMascot } from "./HabbuMascot";
import { HabbuCelebrationModal } from "./HabbuCelebrationModal";
import { getDailyHabits, getWeekDateStrings } from "./habitsData";

interface FitnessHabitsProps {
  onBack: () => void;
  userName: string;
  dayStr: string;
  habitCompletion: Record<string, boolean>;
  onToggleHabit: (habitId: string) => void;
  weeklyCompletion?: Record<string, boolean>;
}

interface Habit {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: string;
  completed: boolean;
  icon: React.ReactNode;
}

type EnergyLevel = "low" | "normal" | "high" | null;

function getFitnessIcon(titulo: string) {
  const t = titulo.toLowerCase();
  if (t.includes("caminata") || t.includes("paseo") || t.includes("caminar")) {
    return <Footprints className="h-6 w-6" />;
  }
  if (t.includes("escalera")) {
    return <TrendingUp className="h-6 w-6" />;
  }
  if (t.includes("estiramiento") || t.includes("baila") || t.includes("articular") || t.includes("movilidad")) {
    return <Sparkles className="h-6 w-6" />;
  }
  if (t.includes("sentadilla") || t.includes("abdominal") || t.includes("fuerza")) {
    return <Zap className="h-6 w-6" />;
  }
  return <Footprints className="h-6 w-6" />;
}

export function FitnessHabits({
  onBack,
  userName,
  dayStr,
  habitCompletion,
  onToggleHabit,
  weeklyCompletion = {},
}: FitnessHabitsProps) {
  // Obtain dynamic fitness habits for the day
  const { fitness } = getDailyHabits(dayStr);
  const habits: Habit[] = fitness.map((h) => ({
    id: h.id,
    title: h.title,
    description: h.description,
    estimatedTime: h.estimatedTime,
    difficulty: h.difficulty || "Fácil",
    completed: !!habitCompletion[h.id],
    icon: getFitnessIcon(h.title),
  }));

  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebratedHabitTitle, setCelebratedHabitTitle] = useState<string | undefined>();

  const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];
  const weekDays = getWeekDateStrings(dayStr);
  const weekProgress = weekDays.map((dateStr, i) => ({
    day: DAY_LABELS[i],
    completed: !!weeklyCompletion[dateStr],
    isToday: dateStr === dayStr,
  }));

  const completedCount = habits.filter((h) => h.completed).length;
  const totalCount = habits.length;

  const toggleHabit = (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (habit && !habit.completed) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1500);
      setCelebratedHabitTitle(habit.title);
      setCelebrationOpen(true);
    }
    onToggleHabit(id);
  };

  const getEnergyMessage = () => {
    if (!energyLevel) {
      return "Moverte un poco cada día también es avanzar.";
    }

    switch (energyLevel) {
      case "low":
        return "Hoy vamos tranquilo. Incluso 5 minutos de movimiento suave cuenta.";
      case "normal":
        return "Perfecto día para mantener el ritmo. Pequeños pasos suman mucho.";
      case "high":
        return "¡Genial energía! Aprovecha para moverte un poco más si te apetece.";
      default:
        return "Moverte un poco cada día también es avanzar.";
    }
  };

  const getEnergyIcon = (level: EnergyLevel) => {
    switch (level) {
      case "low":
        return <BatteryLow className="h-5 w-5" />;
      case "normal":
        return <BatteryMedium className="h-5 w-5" />;
      case "high":
        return <Battery className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HabbuCelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        variant="fitness"
        habitTitle={celebratedHabitTitle}
      />
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
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

          <div>
            <h2 className="text-lg text-foreground">Acondicionamiento físico</h2>
          </div>

          <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2">
            <span className="text-sm text-foreground">
              {completedCount} de {totalCount} hábitos completados
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[auto,1fr]">
            <div className="flex justify-center">
              <HabbuMascot
                variant="fitness"
                completed={completedCount}
                total={totalCount}
                celebrate={showCelebration}
                size={240}
              />
            </div>

            <div className="rounded-2xl bg-secondary/5 p-6">
              <p className="text-lg text-foreground">{getEnergyMessage()}</p>
            </div>
          </div>
        </motion.section>

        {/* Main Grid: Habits + Sidebar */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Habits Section */}
          <section>
            <h2 className="mb-6 text-foreground">Tus hábitos de hoy</h2>

            <div className="space-y-4">
              {habits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-3xl bg-card p-6 shadow-md transition-all ${
                    habit.completed ? "border-2 border-primary" : "border-2 border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl transition-colors ${
                        habit.completed
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-secondary/10 text-secondary"
                      }`}
                    >
                      {habit.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="mb-1 text-foreground">{habit.title}</h3>
                          <p className="text-sm text-muted-foreground">{habit.description}</p>
                        </div>

                        {/* Checkbox Button */}
                        <motion.button
                          onClick={() => toggleHabit(habit.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-shrink-0"
                        >
                          {habit.completed ? (
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                          ) : (
                            <Circle className="h-8 w-8 text-muted-foreground hover:text-primary" />
                          )}
                        </motion.button>
                      </div>

                      {/* Meta Info */}
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{habit.estimatedTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{habit.difficulty}</span>
                        </div>
                      </div>

                      {/* Completion Message */}
                      <AnimatePresence>
                        {habit.completed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden rounded-xl bg-secondary/10 px-4 py-3"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-secondary" />
                              <p className="text-sm text-secondary">¡Bien hecho! Cada movimiento cuenta.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Energy Level Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl bg-card p-6 shadow-md"
            >
              <h3 className="mb-4 text-foreground">Tu energía hoy</h3>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setEnergyLevel("low")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl px-4 py-3 transition-all ${
                    energyLevel === "low"
                      ? "bg-muted-foreground/10 text-foreground ring-2 ring-muted-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <BatteryLow className="h-5 w-5" />
                  <span className="text-xs">Baja</span>
                </motion.button>

                <motion.button
                  onClick={() => setEnergyLevel("normal")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl px-4 py-3 transition-all ${
                    energyLevel === "normal"
                      ? "bg-primary/10 text-primary ring-2 ring-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <BatteryMedium className="h-5 w-5" />
                  <span className="text-xs">Normal</span>
                </motion.button>

                <motion.button
                  onClick={() => setEnergyLevel("high")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-1 flex-col items-center gap-2 rounded-xl px-4 py-3 transition-all ${
                    energyLevel === "high"
                      ? "bg-secondary/10 text-secondary ring-2 ring-secondary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Battery className="h-5 w-5" />
                  <span className="text-xs">Alta</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Habbu's Tip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-gradient-to-br from-accent/10 to-secondary/10 p-6 shadow-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent-foreground" />
                <h3 className="text-foreground">Consejo de Habbu</h3>
              </div>
              <p className="text-muted-foreground">
                No necesitas una rutina perfecta. Incluso caminar mientras escuchas música cuenta como
                movimiento.
              </p>
            </motion.div>

            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
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
                        day.completed
                          ? "bg-secondary text-secondary-foreground shadow-sm shadow-secondary/20"
                          : day.isToday
                            ? "border-2 border-secondary bg-secondary/10 text-secondary"
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

            {/* Back Button */}
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-full bg-secondary px-6 py-4 text-secondary-foreground shadow-lg hover:bg-secondary/90"
            >
              Regresar
            </motion.button>
          </aside>
        </div>
      </main>
    </div>
  );
}