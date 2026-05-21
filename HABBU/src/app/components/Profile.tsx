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
import {
  HabbuMascot,
  HabbuPose,
  POSE_LIBRARY,
  POSE_ORDER,
} from "./HabbuMascot";

interface ProfileProps {
  userName: string;
  onBack: () => void;
  onSignOut?: () => void;
}

export function Profile({ userName, onBack, onSignOut }: ProfileProps) {
  // Soft, non-competitive progress signal (0-1) — used only to choose the
  // panda's expression and tone of message, NOT to count days or streaks.
  const overallProgress = 0.6;

  // Panda mood derived softly from progress (no streaks, no day counts).
  const moodInfo = (() => {
    if (overallProgress >= 0.75)
      return {
        label: "Orgulloso",
        defaultPose: "proud" as HabbuPose,
        message: "Estoy orgulloso de cómo te estás cuidando.",
        tone: "text-secondary",
        bg: "bg-secondary/10",
      };
    if (overallProgress >= 0.4)
      return {
        label: "Animado",
        defaultPose: "cheer" as HabbuPose,
        message: "Vas muy bien, sigamos a tu ritmo.",
        tone: "text-primary",
        bg: "bg-primary/10",
      };
    return {
      label: "Tranquilo",
      defaultPose: "calm" as HabbuPose,
      message: "Aquí estoy, sin prisa. Damos un paso cuando quieras.",
      tone: "text-foreground",
      bg: "bg-muted",
    };
  })();

  const [pose, setPose] = useState<HabbuPose>(moodInfo.defaultPose);
  const [bubble, setBubble] = useState<string | undefined>(moodInfo.message);
  const [celebratePulse, setCelebratePulse] = useState(0);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

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

  const setPoseWithBubble = (next: HabbuPose, customBubble?: string) => {
    setPose(next);
    setBubble(customBubble ?? POSE_LIBRARY[next].bubble);
  };

  const cyclePose = () => {
    const idx = POSE_ORDER.indexOf(pose);
    const next = POSE_ORDER[(idx + 1) % POSE_ORDER.length];
    setPoseWithBubble(next);
  };

  const sayHi = () => setPoseWithBubble("wave", "¡Hola, " + userName + "!");
  const patPanda = () => setPoseWithBubble("happy", "¡Qué lindo gesto!");
  const celebrate = () => {
    setPoseWithBubble("celebrate", "¡Vamos juntos por más!");
    setCelebratePulse((p) => p + 1);
  };
  const checkMood = () =>
    setPoseWithBubble(moodInfo.defaultPose, moodInfo.message);

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
          setPose("cheer");
          setBubble("¡Vamos por el reto de hoy!");
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
                <HabbuMascot
                  key={celebratePulse}
                  variant="friendly"
                  pose={pose}
                  bubbleMessage={bubble}
                  completed={Math.round(overallProgress * 10)}
                  total={10}
                  celebrate={celebratePulse > 0 && pose === "celebrate"}
                  size={220}
                  showBubble
                  showBadge={false}
                  onPandaClick={cyclePose}
                />

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
                  {moodInfo.message}
                </p>

                {/* Mini progress reflection inside the card */}
                <div className="mb-4 rounded-2xl bg-card/70 p-4 backdrop-blur">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Cómo Habbu siente tu avance
                    </span>
                    <span className={moodInfo.tone}>{moodInfo.label}</span>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${overallProgress * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-card/80 p-4 backdrop-blur">
                  <p className="text-sm text-foreground">
                    “No se trata de hacerlo perfecto, sino de seguir contigo.”
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    — Habbu · pose actual: {POSE_LIBRARY[pose].label.toLowerCase()}
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
