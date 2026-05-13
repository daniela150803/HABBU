import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Apple, Activity, User, Calendar, TrendingUp, Home, Heart, Mail, X, Sparkles } from "lucide-react";
import habbuImg from "../../imports/2-4.png";
import habbuQuoteImg from "../../imports/3-1.png";

interface LandingPageProps {
  onGetStarted: () => void;
  onGoToLogin?: () => void;
}

export function LandingPage({ onGetStarted, onGoToLogin }: LandingPageProps) {
  const [previewModal, setPreviewModal] = useState<null | "complete" | "details">(null);

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-foreground">Habbu</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              onClick={onGoToLogin ?? onGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full px-4 py-2 text-sm text-foreground hover:bg-muted sm:px-5"
            >
              Iniciar sesión
            </motion.button>
            <motion.button
              onClick={onGetStarted}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm hover:bg-primary/90 sm:px-5"
            >
              Registrarse
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 text-center lg:text-left"
          >
            <h1 className="text-5xl tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Construye hábitos saludables con Habbu
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              Tu compañero digital que te acompaña cada día con retos personalizados, tareas cortas y
              recomendaciones sobre alimentación saludable y ejercicio.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-primary px-8 py-4 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
              >
                Comenzar
              </motion.button>
              <motion.button
                onClick={scrollToHowItWorks}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full border-2 border-primary px-8 py-4 text-primary transition-all hover:bg-primary/5"
              >
                Conoce más
              </motion.button>
            </div>
          </motion.div>

          {/* Right Content - Habbu Character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex justify-center"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <img
                src={habbuImg}
                alt="Habbu - Tu panda digital"
                className="h-auto w-full max-w-2xl rounded-3xl"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mx-auto mt-20 grid w-full max-w-5xl grid-cols-1 gap-6 px-6 md:grid-cols-2"
        >
          <motion.div
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-card p-8 shadow-md"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Apple className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mb-3 text-foreground">Alimentación saludable</h3>
            <p className="text-muted-foreground">
              Descubre recetas nutritivas, aprende sobre porciones balanceadas y desarrolla una relación
              positiva con la comida.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-card p-8 shadow-md"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10">
              <Activity className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="mb-3 text-foreground">Acondicionamiento físico</h3>
            <p className="text-muted-foreground">
              Rutinas adaptadas a tu nivel, ejercicios cortos pero efectivos y motivación constante para
              mantenerte activo.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-muted/30 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center text-foreground"
          >
            ¿Cómo funciona?
          </motion.h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-10 w-10" />
                </div>
              </div>
              <h3 className="mb-3 text-foreground">1. Crea tu perfil</h3>
              <p className="text-muted-foreground">
                Cuéntanos sobre tus objetivos, preferencias y estilo de vida para personalizar tu experiencia.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                  <Calendar className="h-10 w-10" />
                </div>
              </div>
              <h3 className="mb-3 text-foreground">2. Recibe retos diarios</h3>
              <p className="text-muted-foreground">
                Cada día, Habbu te propone pequeños desafíos alcanzables que se ajustan a tu ritmo.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <TrendingUp className="h-10 w-10" />
                </div>
              </div>
              <h3 className="mb-3 text-foreground">3. Marca tu progreso</h3>
              <p className="text-muted-foreground">
                Celebra cada logro, por pequeño que sea. La constancia es más importante que la perfección.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Daily Challenge Example */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-10 text-center"
          >
            <h2 className="mb-3 text-foreground">Así se ve un reto diario con Habbu</h2>
            <p className="text-lg text-muted-foreground">
              Cada día recibirás un reto corto y sencillo, diseñado para que avances sin presión.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 shadow-xl"
          >
            <div className="mb-4 inline-block rounded-full bg-primary/20 px-4 py-2 text-sm text-primary">
              Reto del día
            </div>
            <h2 className="mb-6 text-foreground">Hoy: toma 2 vasos extra de agua y camina 15 minutos</h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Pequeños pasos que hacen una gran diferencia. Hidratarte bien y moverte un poco más te ayudará a
              sentirte con más energía durante todo el día.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={() => setPreviewModal("complete")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-primary px-6 py-3 text-primary-foreground hover:bg-primary/90"
              >
                Marcar como completado
              </motion.button>
              <motion.button
                onClick={() => setPreviewModal("details")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full border-2 border-primary px-6 py-3 text-primary hover:bg-primary/5"
              >
                Ver más detalles
              </motion.button>
            </div>
          </motion.div>

          {/* Habbu Quote */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mt-12 flex items-start gap-4"
          >
            <div className="flex-shrink-0">
              <div className="h-50 w-50">
                <img
                  src={habbuQuoteImg}
                  alt="Habbu"
                  className="h-full w-full object-contain object-center"
                />
              </div>
            </div>
            <div className="relative rounded-3xl bg-card p-6 shadow-lg">
              <div className="absolute -left-2 top-6 h-0 w-0 border-b-[8px] border-r-[12px] border-t-[8px] border-b-transparent border-r-card border-t-transparent"></div>
              <p className="text-lg text-foreground">"No necesitas hacerlo perfecto. Solo empezar."</p>
              <p className="mt-2 text-sm text-muted-foreground">— Habbu</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-foreground">Habbu</span>
            </div>

            <nav className="flex flex-wrap justify-center gap-8">
              <a
                href="#"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Home className="h-4 w-4" />
                Inicio
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Activity className="h-4 w-4" />
                Hábitos
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
                Contacto
              </a>
            </nav>

            <p className="text-sm text-muted-foreground">© 2026 Habbu. Con Habbu a tu lado, vivir sano es asegurado.</p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {previewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl bg-card p-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>

              <h3 className="mb-3 text-foreground">
                {previewModal === "complete"
                  ? "¡Crea tu cuenta para registrar tu progreso!"
                  : "Descubre todos los detalles con Habbu"}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {previewModal === "complete"
                  ? "Este es solo un ejemplo del reto diario. Para marcar retos como completados, ganar constancia y recibir nuevos retos personalizados, necesitas crear tu perfil. ¡Es rápido y gratis!"
                  : "Habbu te explica cada reto paso a paso, con tips de hidratación, alimentación y ejercicio adaptados a ti. Crea tu perfil para acceder al detalle completo y a tu plan personalizado."}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setPreviewModal(null);
                    onGetStarted();
                  }}
                  className="flex-1 rounded-full bg-primary px-6 py-3 text-primary-foreground shadow-lg transition-all hover:bg-primary/90"
                >
                  Crear mi perfil
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPreviewModal(null)}
                  className="flex-1 rounded-full border-2 border-border px-6 py-3 text-foreground transition-colors hover:bg-muted"
                >
                  Ahora no
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}