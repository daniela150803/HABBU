import { motion } from "motion/react";
import { Heart, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import habbuRegImg from "../../imports/5.png";
import habbuIconImg from "../../imports/3.png";

interface RegistrationProps {
  onComplete: (userData: { name: string; email: string }) => void;
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
    interest: "",
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

  const handleSubmit = (e: React.FormEvent) => {
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
    if (!formData.interest) {
      newErrors.interest = "Selecciona tu interés principal";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Save data and proceed
      console.log("Registration data:", formData);
      onComplete({ name: formData.name, email: formData.email });
    }
  };

  const completionProgress = [
    formData.name.trim() !== "",
    formData.age !== "",
    formData.goals.length > 0,
    formData.timeCommitment !== "",
    formData.interest !== "",
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
                  <label className="mb-3 block text-foreground">¿Qué te interesa más?</label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, interest: "nutrition" });
                        setErrors({ ...errors, interest: "" });
                      }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-2xl border-2 p-6 text-left transition-all ${
                        formData.interest === "nutrition"
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border bg-input-background hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      <div className="mb-3 text-2xl">🥗</div>
                      <h3
                        className={`mb-2 ${formData.interest === "nutrition" ? "text-primary" : "text-foreground"}`}
                      >
                        Alimentación saludable
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Aprende a comer mejor y disfrutar la comida nutritiva
                      </p>
                    </motion.button>

                    <motion.button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, interest: "fitness" });
                        setErrors({ ...errors, interest: "" });
                      }}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`rounded-2xl border-2 p-6 text-left transition-all ${
                        formData.interest === "fitness"
                          ? "border-primary bg-primary/10 shadow-lg"
                          : "border-border bg-input-background hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      <div className="mb-3 text-2xl">💪</div>
                      <h3
                        className={`mb-2 ${formData.interest === "fitness" ? "text-primary" : "text-foreground"}`}
                      >
                        Acondicionamiento físico
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Mantente activo con rutinas adaptadas a ti
                      </p>
                    </motion.button>
                  </div>
                  {errors.interest && <p className="mt-1 text-sm text-destructive">{errors.interest}</p>}
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