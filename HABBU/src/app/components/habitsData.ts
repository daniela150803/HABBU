// habitsData.ts
// Pools of activities and helper functions for date-based deterministic selection and persistence.
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import retosData from "../data/retos_diarios.json";


export interface HabitData {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  category: "nutrition" | "fitness";
  difficulty?: string;
  iconName: string;
}

export const NUTRITION_POOL: HabitData[] = [
  {
    id: "nut-1",
    title: "Toma 2 vasos extra de agua",
    description: "Bebe 2 vasos extra de agua durante el día para mantener tu cuerpo hidratado y con energía.",
    estimatedTime: "5 minutos",
    category: "nutrition",
    iconName: "Droplet",
  },
  {
    id: "nut-2",
    title: "Come una porción de verduras",
    description: "Incluye al menos una porción de verduras frescas o cocidas en tu almuerzo o cena.",
    estimatedTime: "10 minutos",
    category: "nutrition",
    iconName: "Apple",
  },
  {
    id: "nut-3",
    title: "Reduce una bebida azucarada",
    description: "Reemplaza una bebida gaseosa o jugo procesado por agua pura, infusión o té sin azúcar.",
    estimatedTime: "5 minutos",
    category: "nutrition",
    iconName: "CupSoda",
  },
  {
    id: "nut-4",
    title: "Elige fruta fresca como snack",
    description: "En lugar de patatas fritas o snacks industriales, come una manzana, plátano o mandarina.",
    estimatedTime: "5 minutos",
    category: "nutrition",
    iconName: "Apple",
  },
  {
    id: "nut-5",
    title: "Desayuno sin azúcares añadidos",
    description: "Prepara un desayuno saludable a base de avena, fruta entera y frutos secos.",
    estimatedTime: "15 minutos",
    category: "nutrition",
    iconName: "Apple",
  },
  {
    id: "nut-6",
    title: "Cena ligera antes de descansar",
    description: "Haz una cena suave y ligera al menos dos horas antes de acostarte para mejorar tu sueño.",
    estimatedTime: "10 minutos",
    category: "nutrition",
    iconName: "Apple",
  },
];

export const FITNESS_POOL: HabitData[] = [
  {
    id: "fit-1",
    title: "Camina 15 minutos",
    description: "Camina a tu propio ritmo por el vecindario o en una cinta para reactivar tu cuerpo.",
    estimatedTime: "15 minutos",
    difficulty: "Fácil",
    category: "fitness",
    iconName: "Footprints",
  },
  {
    id: "fit-2",
    title: "Haz 5 estiramientos suaves",
    description: "Estira tus brazos, espalda y cuello durante 5 minutos para liberar tensión muscular.",
    estimatedTime: "5 minutos",
    difficulty: "Fácil",
    category: "fitness",
    iconName: "Sparkles",
  },
  {
    id: "fit-3",
    title: "Usa las escaleras hoy",
    description: "Evita el ascensor en el trabajo o centro comercial y sube a pie para activar tus piernas.",
    estimatedTime: "10 minutos",
    difficulty: "Fácil",
    category: "fitness",
    iconName: "TrendingUp",
  },
  {
    id: "fit-4",
    title: "Realiza 10 sentadillas",
    description: "Realiza 10 sentadillas lentas cuidando la postura de tu espalda y rodillas.",
    estimatedTime: "5 minutos",
    difficulty: "Fácil",
    category: "fitness",
    iconName: "Sparkles",
  },
  {
    id: "fit-5",
    title: "Da un paseo post-almuerzo",
    description: "Camina durante 5 a 10 minutos inmediatamente después de almorzar para mejorar tu digestión.",
    estimatedTime: "10 minutos",
    difficulty: "Fácil",
    category: "fitness",
    iconName: "Footprints",
  },
  {
    id: "fit-6",
    title: "Ejercicios de respiración profunda",
    description: "Tómate 3 minutos para respirar profundamente, relajando los hombros en un espacio tranquilo.",
    estimatedTime: "3 minutos",
    difficulty: "Fácil",
    category: "fitness",
    iconName: "Sparkles",
  },
];

// Helper to get local date string YYYY-MM-DD
export function getLocalDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Deterministic selection of 2 nutrition and 2 fitness habits based on date string
export function getDailyHabits(dayStr: string): {
  nutrition: HabitData[];
  fitness: HabitData[];
} {
  let seed = 0;
  for (let i = 0; i < dayStr.length; i++) {
    seed += dayStr.charCodeAt(i);
  }

  // Nutrition index selection (guaranteed to be different since (seed+2)%6 != seed%6)
  const nutIndex1 = seed % NUTRITION_POOL.length;
  const nutIndex2 = (seed + 2) % NUTRITION_POOL.length;

  // Fitness index selection
  const fitIndex1 = (seed + 4) % FITNESS_POOL.length;
  const fitIndex2 = (seed + 6) % FITNESS_POOL.length;

  return {
    nutrition: [NUTRITION_POOL[nutIndex1], NUTRITION_POOL[nutIndex2]],
    fitness: [FITNESS_POOL[fitIndex1], FITNESS_POOL[fitIndex2]],
  };
}

// LocalStorage helpers
export function loadHabitCompletionState(
  userName: string,
  dayStr: string
): Record<string, boolean> {
  try {
    const key = `habbu_habits_${userName}_${dayStr}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error loading habit completion state:", error);
    return {};
  }
}

export function saveHabitCompletionState(
  userName: string,
  dayStr: string,
  state: Record<string, boolean>
): void {
  try {
    const key = `habbu_habits_${userName}_${dayStr}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving habit completion state:", error);
  }
}

// Daily challenge completion persistence helpers
export function loadDailyChallengeCompleted(userName: string, dayStr: string): boolean {
  try {
    const key = `habbu_challenge_${userName}_${dayStr}`;
    return localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

export function saveDailyChallengeCompleted(userName: string, dayStr: string, completed: boolean): void {
  try {
    const key = `habbu_challenge_${userName}_${dayStr}`;
    localStorage.setItem(key, completed ? "true" : "false");
  } catch {
    // ignore
  }
}

// Cloud persistence helpers for multi-device sync
export async function saveProgressToFirebase(
  userEmail: string,
  dayStr: string,
  userName: string,
  habitCompletion: Record<string, boolean>,
  dailyChallengeCompleted: boolean
): Promise<void> {
  if (!userEmail) return;
  try {
    const docRef = doc(db, "progress", `${userEmail}_${dayStr}`);
    await setDoc(docRef, {
      email: userEmail,
      userName,
      dayStr,
      habitCompletion,
      dailyChallengeCompleted,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error("Error saving progress to Firebase:", error);
  }
}

export async function loadProgressFromFirebase(
  userEmail: string,
  dayStr: string
): Promise<{ habitCompletion: Record<string, boolean>; dailyChallengeCompleted: boolean } | null> {
  if (!userEmail) return null;
  try {
    const docRef = doc(db, "progress", `${userEmail}_${dayStr}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        habitCompletion: data.habitCompletion || {},
        dailyChallengeCompleted: !!data.dailyChallengeCompleted,
      };
    }
  } catch (error) {
    console.error("Error loading progress from Firebase:", error);
  }
  return null;
}

export interface DailyChallengeData {
  id: number;
  categoria: string;
  titulo: string;
  descripcion: string;
  tiempo: string;
  dificultad: string;
  pasos: string[];
}

export function getDailyChallengeForDay(dayStr: string, interests?: string[]): DailyChallengeData {
  let seed = 0;
  for (let i = 0; i < dayStr.length; i++) {
    seed += dayStr.charCodeAt(i);
  }
  let list = retosData.retos;
  if (interests && interests.length > 0) {
    list = list.filter((r) => {
      const cat = r.categoria === "alimentacion saludable" ? "nutrition" : "fitness";
      return interests.includes(cat);
    });
  }
  if (list.length === 0) {
    list = retosData.retos;
  }
  const index = seed % list.length;
  return list[index];
}

export interface UserPreferences {
  interests: string[];
  goals: string[];
  age: string;
  gender: string;
  timeCommitment: string;
}

export async function saveUserPreferences(
  userEmail: string,
  preferences: UserPreferences
): Promise<void> {
  if (!userEmail) return;
  try {
    const docRef = doc(db, "users", userEmail);
    await setDoc(docRef, preferences, { merge: true });
  } catch (error) {
    console.error("Error saving user preferences to Firebase:", error);
  }
}

export async function loadUserPreferences(
  userEmail: string
): Promise<UserPreferences | null> {
  if (!userEmail) return null;
  try {
    const docRef = doc(db, "users", userEmail);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        interests: data.interests || [],
        goals: data.goals || [],
        age: data.age || "",
        gender: data.gender || "",
        timeCommitment: data.timeCommitment || "",
      };
    }
  } catch (error) {
    console.error("Error loading user preferences from Firebase:", error);
  }
  return null;
}


