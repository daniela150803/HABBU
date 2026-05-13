import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  ArrowLeft,
  Droplet,
  Apple,
  CupSoda,
  CheckCircle2,
  Circle,
  Clock,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { HabbuMascot } from "./HabbuMascot";
import { HabbuCelebrationModal } from "./HabbuCelebrationModal";

interface NutritionHabitsProps {
  onBack: () => void;
}

interface Habit {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  completed: boolean;
  icon: React.ReactNode;
}

export function NutritionHabits({ onBack }: NutritionHabitsProps) {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: "1",
      title: "Tomar más agua",
      description: "Bebe 2 vasos extra de agua durante el día",
      estimatedTime: "5 minutos",
      completed: true,
      icon: <Droplet className="h-6 w-6" />,
    },
    {
      id: "2",
      title: "Agregar una fruta o verdura",
      description: "Incluye al menos una porción en tu comida principal",
      estimatedTime: "10 minutos",
      completed: false,
      icon: <Apple className="h-6 w-6" />,
    },
    {
      id: "3",
      title: "Reducir una bebida azucarada",
      description: "Reemplaza una bebida con azúcar por agua o té sin azúcar",
      estimatedTime: "5 minutos",
      completed: false,
      icon: <CupSoda className="h-6 w-6" />,
    },
  ]);

  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationOpen, setCelebrationOpen] = useState(false);
  const [celebratedHabitTitle, setCelebratedHabitTitle] = useState<string | undefined>();

  const weekProgress = [
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

  const toggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          if (!h.completed) {
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 1500);
            setCelebratedHabitTitle(h.title);
            setCelebrationOpen(true);
          }
          return { ...h, completed: !h.completed };
        }
        return h;
      })
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <HabbuCelebrationModal
        open={celebrationOpen}
        onClose={() => setCelebrationOpen(false)}
        variant="nutrition"
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
            <h2 className="text-lg text-foreground">Alimentación saludable</h2>
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
                variant="nutrition"
                completed={completedCount}
                total={totalCount}
                celebrate={showCelebration}
                size={240}
              />
            </div>

            <div className="rounded-2xl bg-primary/5 p-6">
              <p className="text-lg text-foreground">
                Pequeños cambios en lo que comes pueden hacer una gran diferencia.
              </p>
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
                        habit.completed ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
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

                      {/* Time */}
                      <div className="mt-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{habit.estimatedTime}</span>
                      </div>

                      {/* Completion Message */}
                      <AnimatePresence>
                        {habit.completed && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            className="overflow-hidden rounded-xl bg-primary/10 px-4 py-3"
                          >
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              <p className="text-sm text-primary">¡Excelente! Sigue así.</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* View More Habits Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 w-full rounded-full border-2 border-primary px-6 py-3 text-primary hover:bg-primary/5"
            >
              Ver más hábitos
            </motion.button>
          </section>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Habbu's Recommendation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-3xl bg-gradient-to-br from-secondary/10 to-primary/10 p-6 shadow-md"
            >
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-secondary" />
                <h3 className="text-foreground">Recomendación de Habbu</h3>
              </div>
              <p className="text-muted-foreground">
                Si no te gusta tomar agua sola, prueba agregar una rodaja de limón o naranja. Le dará sabor
                sin azúcar añadida.
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

            {/* Continue Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-full bg-primary px-6 py-4 text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              Continuar
            </motion.button>
          </aside>
        </div>
      </main>
    </div>
  );
}