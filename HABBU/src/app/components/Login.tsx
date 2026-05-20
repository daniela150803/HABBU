import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import habbuLoginImg from "../../imports/3.png";
import { HabbuMascot } from "./HabbuMascot";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

interface LoginProps {
  onComplete: (userData: { name: string; email: string }) => void;
  onBack?: () => void;
  onGoToRegister?: () => void;
}

export function Login({ onComplete, onBack, onGoToRegister }: LoginProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(formData.email.trim())) {
      newErrors.email = "Ingresa un correo válido";
    }
    if (!formData.password) {
      newErrors.password = "Ingresa tu contraseña";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );
        const user = userCredential.user;
        const displayName = user.displayName || (() => {
          const inferred = user.email?.split("@")[0] || "Usuario";
          return inferred.charAt(0).toUpperCase() + inferred.slice(1);
        })();
        onComplete({ name: displayName, email: user.email || formData.email.trim() });
      } catch (error: any) {
        console.error("Firebase login error:", error);
        let errorMsg = "Correo o contraseña incorrectos";
        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
          errorMsg = "Correo o contraseña incorrectos";
        } else if (error.code === "auth/too-many-requests") {
          errorMsg = "Demasiados intentos fallidos. Inténtalo más tarde.";
        }
        setErrors({ ...newErrors, firebase: errorMsg });
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
              aria-label="Volver al inicio"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary overflow-hidden">
            <img src={habbuLoginImg} alt="Habbu" className="h-12 w-12 object-contain" />
          </div>
          <span className="text-foreground">Inicia sesión</span>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 lg:grid-cols-[1fr,2fr]">
          {/* Habbu greeting */}
          <div className="flex flex-col items-center justify-start">
            <HabbuMascot
              variant="friendly"
              pose="wave"
              bubbleMessage="¡Qué bueno verte de nuevo!"
              size={180}
              showBadge={false}
            />
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-3xl bg-card p-8 shadow-lg"
            >
              <div>
                <h2 className="text-foreground">Bienvenido de vuelta</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ingresa con tu correo y contraseña.
                </p>
              </div>

              <div>
                <label htmlFor="login-email" className="mb-2 block text-foreground">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="login-email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full rounded-xl border-2 bg-input-background px-4 py-3 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? "border-destructive" : "border-border focus:border-primary"
                  }`}
                  placeholder="tucorreo@ejemplo.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block text-foreground">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="login-password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full rounded-xl border-2 bg-input-background px-4 py-3 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.password ? "border-destructive" : "border-border focus:border-primary"
                  }`}
                  placeholder="Tu contraseña"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="inline-flex items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  Recordarme
                </label>
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => {
                    /* placeholder for password recovery */
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {errors.firebase && (
                <p className="text-center text-sm text-destructive">{errors.firebase}</p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full rounded-full bg-primary px-8 py-4 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
              >
                Iniciar sesión
              </motion.button>

              {onGoToRegister && (
                <p className="text-center text-sm text-muted-foreground">
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={onGoToRegister}
                    className="text-primary hover:underline"
                  >
                    Regístrate
                  </button>
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
