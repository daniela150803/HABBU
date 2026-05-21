import { motion } from "motion/react";
import { Heart, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import habbuRegImg from "../../imports/5.png";
import habbuIconImg from "../../imports/3.png";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { saveUserPreferences } from "./habitsData";

interface RegistrationProps {
  onComplete: (userData: { name: string; email: string; interests?: string[] }) => void;
  onBack?: () => void;
  onGoToLogin?: () => void;
}

export function Registration({ onComplete, onBack, onGoToLogin }: RegistrationProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    goals: [] as string[],
    timeCommitment: "",
    interests: [] as string[],
    dailyChallenge: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const goals = [
    { id: "eat-better", label: "Comer mejor" },
    { id: "exercise", label: "Hacer más ejercicio" },
    { id: "energy", label: "Tener más energía" },
    { id: "routine", label: "Crear una rutina" },
  ];

  const timeOptions = ["5 minutos", "10 minutos", "20 minutos", "30+ minutos"];

  const toggleGoal = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter((g) => g !== goalId)
        : [...prev.goals, goalId],
    }));
  };

  const toggleInterest = (interestId: string) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interestId);
      const updated = exists
        ? prev.interests.filter((i) => i !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests: updated };
    });
    setErrors((prev) => ({ ...prev, interests: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Por favor ingresa tu nombre";
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(formData.email.trim())) {
      newErrors.email = "Ingresa un correo válido";
    }
    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    if (!formData.age) {
      newErrors.age = "Por favor selecciona tu edad";
    }
    if (formData.goals.length === 0) {
      newErrors.goals = "Selecciona al menos un objetivo";
    }
    if (!formData.timeCommitment) {
      newErrors.timeCommitment = "Selecciona cuánto tiempo puedes dedicar";
    }
    if (formData.interests.length === 0) {
      newErrors.interests = "Selecciona al menos un interés";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email.trim(),
          formData.password
        );
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: formData.name.trim()
          });
        }
        await saveUserPreferences(formData.email.trim(), {
          interests: formData.interests,
          goals: formData.goals,
          age: formData.age,
          gender: formData.gender,
          timeCommitment: formData.timeCommitment,
        });
        console.log("Registration data:", formData);
        onComplete({
          name: formData.name.trim(),
          email: formData.email.trim(),
          interests: formData.interests,
        });
      } catch (error: any) {
        console.error("Firebase registration error:", error);
        let errorMsg = "Ocurrió un error al registrar el usuario";
        if (error.code === "auth/email-already-in-use") {
          errorMsg = "Este correo ya está registrado";
        } else if (error.code === "auth/invalid-email") {
          errorMsg = "El correo no es válido";
        } else if (error.code === "auth/weak-password") {
          errorMsg = "La contraseña es muy débil";
        }
        setErrors({ ...newErrors, firebase: errorMsg });
      }
    }
  };

  const completionProgress = [
    formData.name.trim() !== "",
    formData.age !== "",
    formData.goals.length > 0,
    formData.timeCommitment !== "",
    formData.interests.length > 0,
  ].filter(Boolean).length;

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
            <img src={habbuIconImg} alt="Habbu" className="h-12 w-12 object-contain" />
          </div>
          <span className="text-foreground">Crea tu perfil</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,2fr]">
            {/* Habbu Illustration */}
            <div
              className="flex flex-col items-center justify-start"
            >
              <div
                className="relative mb-4"
              >
                <img
                  src={habbuRegImg}
                  alt="Habbu"
                  className="h-50 w-50 rounded-3xl object-cover"
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                {completionProgress === 0 && "¡Hola! Vamos a conocerte mejor 😊"}
                {completionProgress === 1 && "¡Muy bien! Sigamos adelante"}
                {completionProgress === 2 && "Excelente progreso 🌟"}
                {completionProgress === 3 && "¡Ya casi terminamos!"}
                {completionProgress === 4 && "¡Solo un paso más!"}
                {completionProgress === 5 && "¡Perfecto! Estamos listos 🎉"}
              </p>
            </div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl bg-card p-8 shadow-lg">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="mb-2 block text-foreground">
                    ¿Cómo te llamas?
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full rounded-xl border-2 bg-input-background px-4 py-3 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.name ? "border-destructive" : "border-border focus:border-primary"
                    }`}
                    placeholder="Tu nombre"
                  />
                  {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-2 block text-foreground">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
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
                  {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="mb-2 block text-foreground">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setErrors({ ...errors, password: "" });
                    }}
                    className={`w-full rounded-xl border-2 bg-input-background px-4 py-3 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.password ? "border-destructive" : "border-border focus:border-primary"
                    }`}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="mb-2 block text-foreground">
                    ¿Cuál es tu edad?
                  </label>
                  <select
                    id="age"
                    value={formData.age}
                    onChange={(e) => {
                      setFormData({ ...formData, age: e.target.value });
                      setErrors({ ...errors, age: "" });
                    }}
                    className={`w-full rounded-xl border-2 bg-input-background px-4 py-3 text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.age ? "border-destructive" : "border-border focus:border-primary"
                    }`}
                  >
                    <option value="">Selecciona tu edad</option>
                    <option value="13-17">13-17 años</option>
                    <option value="18-24">18-24 años</option>
                    <option value="25-34">25-34 años</option>
                    <option value="35-44">35-44 años</option>
                    <option value="45-54">45-54 años</option>
                    <option value="55+">55+ años</option>
                  </select>
                  {errors.age && <p className="mt-1 text-sm text-destructive">{errors.age}</p>}
                </div>

                {/* Gender (Optional) */}
                <div>
                  <label htmlFor="gender" className="mb-2 block text-foreground">
                    Género <span className="text-sm text-muted-foreground">(opcional)</span>
                  </label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full rounded-xl border-2 border-border bg-input-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Prefiero no decir</option>
                    <option value="female">Femenino</option>
                    <option value="male">Masculino</option>
                    <option value="non-binary">No binario</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                {/* Goals */}
                <div>
                  <label className="mb-3 block text-foreground">¿Qué quieres mejorar?</label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {goals.map((goal) => (
                      <motion.button
                        key={goal.id}
                        type="button"
                        onClick={() => toggleGoal(goal.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all ${
                          formData.goals.includes(goal.id)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-input-background text-foreground hover:border-primary/50"
                        }`}
                      >
                        <span>{goal.label}</span>
                        {formData.goals.includes(goal.id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex h-5 w-5 items-center justify-center rounded-full bg-primary"
                          >
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  {errors.goals && <p className="mt-1 text-sm text-destructive">{errors.goals}</p>}
                </div>

                {/* Time Commitment */}
                <div>
                  <label className="mb-3 block text-foreground">
                    ¿Cuánto tiempo puedes dedicar al día?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {timeOptions.map((time) => (
                      <motion.button
                        key={time}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, timeCommitment: time });
                          setErrors({ ...errors, timeCommitment: "" });
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`rounded-full border-2 px-5 py-2 transition-all ${
                          formData.timeCommitment === time
                            ? "border-secondary bg-secondary text-secondary-foreground"
                            : "border-border bg-input-background text-foreground hover:border-secondary/50"
                        }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                  {errors.timeCommitment && (
                    <p className="mt-1 text-sm text-destructive">{errors.timeCommitment}</p>
                  )}
                </div>

                {/* Interest */}
                <div>
                  <label className="mb-3 block text-foreground">¿Qué te interesa? (Puedes elegir ambos)</label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <motion.button
                      type="button"
                      onClick={() => toggleInterest("nutrition")}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative rounded-2xl border-2 p-6 text-left transition-all ${
                        formData.interests.includes("nutrition")
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border bg-input-background hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      {formData.interests.includes("nutrition") && (
                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <div className="mb-3 text-2xl">🥗</div>
                      <h3
                        className={`mb-2 ${formData.interests.includes("nutrition") ? "text-primary" : "text-foreground"}`}
                      >
                        Alimentación saludable
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Aprende a comer mejor y disfrutar la comida nutritiva
                      </p>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => toggleInterest("fitness")}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative rounded-2xl border-2 p-6 text-left transition-all ${
                        formData.interests.includes("fitness")
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border bg-input-background hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      {formData.interests.includes("fitness") && (
                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                      <div className="mb-3 text-2xl">💪</div>
                      <h3
                        className={`mb-2 ${formData.interests.includes("fitness") ? "text-primary" : "text-foreground"}`}
                      >
                        Acondicionamiento físico
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mantente activo con rutinas adaptadas a ti
                      </p>
                    </motion.button>
                  </div>
                  {errors.interests && <p className="mt-1 text-sm text-destructive">{errors.interests}</p>}
                </div>

                {/* Daily Challenge Checkbox */}
                <div className="rounded-xl bg-muted/30 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.dailyChallenge}
                      onChange={(e) => setFormData({ ...formData, dailyChallenge: e.target.checked })}
                      className="mt-1 h-5 w-5 cursor-pointer rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary"
                    />
                    <div>
                      <span className="text-foreground">Quiero recibir un reto diario</span>
                      <p className="text-sm text-muted-foreground">
                        Te enviaremos una pequeña tarea cada día para mantener tu progreso
                      </p>
                    </div>
                  </label>
                </div>

                {errors.firebase && (
                  <p className="text-center text-sm text-destructive">{errors.firebase}</p>
                )}

                {/* Submit Button */}
                <div className="space-y-3">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-full bg-primary px-8 py-4 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
                  >
                    Empezar con Habbu
                  </motion.button>
                  <p className="text-center text-sm text-muted-foreground">
                    Podrás cambiar esta información más adelante
                  </p>
                  {onGoToLogin && (
                    <p className="text-center text-sm text-muted-foreground">
                      ¿Ya tienes cuenta?{" "}
                      <button
                        type="button"
                        onClick={onGoToLogin}
                        className="text-primary hover:underline"
                      >
                        Iniciar sesión
                      </button>
                    </p>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}