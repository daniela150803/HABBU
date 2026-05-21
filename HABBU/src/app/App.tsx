import { useState, useEffect } from "react";
import { LandingPage } from "./components/LandingPage";
import { Registration } from "./components/Registration";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { DailyChallenge } from "./components/DailyChallenge";
import { NutritionHabits } from "./components/NutritionHabits";
import { FitnessHabits } from "./components/FitnessHabits";
import { Profile } from "./components/Profile";
import { PrivacyConsentModal } from "./components/PrivacyConsentModal";
import {
  getLocalDateString,
  getDailyHabits,
  getWeekDateStrings,
  loadHabitCompletionState,
  saveHabitCompletionState,
  loadDailyChallengeCompleted,
  saveDailyChallengeCompleted,
  saveProgressToFirebase,
  loadProgressFromFirebase,
  loadUserPreferences,
  loadWeeklyProgressFromFirebase,
  loadDetailedWeeklyProgressFromFirebase
} from "./components/habitsData";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

type Screen =
  | "landing"
  | "registration"
  | "login"
  | "dashboard"
  | "daily-challenge"
  | "nutrition-habits"
  | "fitness-habits"
  | "profile";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("landing");
  const [userName, setUserName] = useState("Usuario");
  const [userEmail, setUserEmail] = useState("");
  const [needsPrivacyConsent, setNeedsPrivacyConsent] = useState(false);
  const [dayStr, setDayStr] = useState(() => getLocalDateString());
  const [habitCompletion, setHabitCompletion] = useState<Record<string, boolean>>({});
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false);
  const [userInterests, setUserInterests] = useState<string[]>([]);
  const [weeklyCompletion, setWeeklyCompletion] = useState<Record<string, boolean>>({});
  const [nutritionWeeklyCompletion, setNutritionWeeklyCompletion] = useState<Record<string, boolean>>({});
  const [fitnessWeeklyCompletion, setFitnessWeeklyCompletion] = useState<Record<string, boolean>>({});

  // Monitor Firebase Auth session state automatically (e.g. reload or state change)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName = user.displayName || (() => {
          const inferred = user.email?.split("@")[0] || "Usuario";
          return inferred.charAt(0).toUpperCase() + inferred.slice(1);
        })();
        setUserName(displayName);
        setUserEmail(user.email || "");
        if (user.email) {
          loadUserPreferences(user.email).then((prefs) => {
            if (prefs) {
              setUserInterests(prefs.interests);
            }
          });
        }
        setCurrentScreen("dashboard");
      } else {
        if (currentScreen !== "registration" && currentScreen !== "login") {
          setCurrentScreen("landing");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Sync completion states whenever user/email/screen changes
  useEffect(() => {
    const today = getLocalDateString();
    setDayStr(today);
    
    // Load local storage first as local fast cache
    const localHabits = loadHabitCompletionState(userName, today);
    const localChallenge = loadDailyChallengeCompleted(userName, today);
    setHabitCompletion(localHabits);
    setDailyChallengeCompleted(localChallenge);

    // If there is an active user email, pull progress from Firestore database
    if (userEmail) {
      loadUserPreferences(userEmail).then((prefs) => {
        if (prefs) {
          setUserInterests(prefs.interests);
        }
      });
      loadProgressFromFirebase(userEmail, today).then((firebaseProgress) => {
        if (firebaseProgress) {
          setHabitCompletion(firebaseProgress.habitCompletion);
          setDailyChallengeCompleted(firebaseProgress.dailyChallengeCompleted);
          // Keep local storage in sync as local cache
          saveHabitCompletionState(userName, today, firebaseProgress.habitCompletion);
          saveDailyChallengeCompleted(userName, today, firebaseProgress.dailyChallengeCompleted);
        } else {
          // If no progress in Firestore yet, write the local progress to the cloud
          saveProgressToFirebase(userEmail, today, userName, localHabits, localChallenge);
        }
      });

      // Load weekly completion data from Firebase
      const weekDays = getWeekDateStrings(today);
      loadDetailedWeeklyProgressFromFirebase(userEmail, weekDays).then((weeklyData) => {
        setWeeklyCompletion(weeklyData.global);
        setNutritionWeeklyCompletion(weeklyData.nutrition);
        setFitnessWeeklyCompletion(weeklyData.fitness);
      });
    }
  }, [userName, userEmail, currentScreen]);

  // Update today's weekly completion status reactively when habits change
  useEffect(() => {
    const dailyHabits = getDailyHabits(dayStr);
    
    const nutIds = dailyHabits.nutrition.map((h) => h.id);
    const fitIds = dailyHabits.fitness.map((h) => h.id);
    
    const isNutDone = nutIds.length > 0 && nutIds.every((id) => habitCompletion[id] === true);
    const isFitDone = fitIds.length > 0 && fitIds.every((id) => habitCompletion[id] === true);
    
    setNutritionWeeklyCompletion((prev) => ({ ...prev, [dayStr]: isNutDone }));
    setFitnessWeeklyCompletion((prev) => ({ ...prev, [dayStr]: isFitDone }));
    setWeeklyCompletion((prev) => ({ ...prev, [dayStr]: isNutDone && isFitDone }));
  }, [habitCompletion, dayStr]);

  const toggleHabit = (habitId: string) => {
    setHabitCompletion((prev) => {
      const next = { ...prev, [habitId]: !prev[habitId] };
      saveHabitCompletionState(userName, dayStr, next);
      if (userEmail) {
        saveProgressToFirebase(userEmail, dayStr, userName, next, dailyChallengeCompleted);
      }
      return next;
    });
  };

  const toggleDailyChallenge = () => {
    setDailyChallengeCompleted((prev) => {
      const next = !prev;
      saveDailyChallengeCompleted(userName, dayStr, next);
      if (userEmail) {
        saveProgressToFirebase(userEmail, dayStr, userName, habitCompletion, next);
      }
      return next;
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserName("Usuario");
      setUserEmail("");
      setHabitCompletion({});
      setDailyChallengeCompleted(false);
      setWeeklyCompletion({});
      setNutritionWeeklyCompletion({});
      setFitnessWeeklyCompletion({});
      setCurrentScreen("landing");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleGetStarted = () => {
    setCurrentScreen("registration");
  };

  const handleGoToLogin = () => {
    setCurrentScreen("login");
  };

  const handleAuthComplete = (userData: { name: string; email: string; interests?: string[] }) => {
    setUserName(userData.name);
    setUserEmail(userData.email);
    if (userData.interests) {
      setUserInterests(userData.interests);
    } else if (userData.email) {
      loadUserPreferences(userData.email).then((prefs) => {
        if (prefs) {
          setUserInterests(prefs.interests);
        }
      });
    }
    setCurrentScreen("dashboard");
    console.log("Auth completed for", userData.email);
  };

  const handleRegistrationComplete = (userData: { name: string; email: string; interests?: string[] }) => {
    handleAuthComplete(userData);
    setNeedsPrivacyConsent(true);
  };

  const handleViewDailyChallenge = () => {
    setCurrentScreen("daily-challenge");
  };

  const handleViewNutritionHabits = () => {
    setCurrentScreen("nutrition-habits");
  };

  const handleViewFitnessHabits = () => {
    setCurrentScreen("fitness-habits");
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
  };

  return (
    <>
      {currentScreen === "landing" && (
        <LandingPage
          onGetStarted={handleGetStarted}
          onGoToLogin={handleGoToLogin}
        />
      )}
      {currentScreen === "registration" && (
        <Registration
          onComplete={handleRegistrationComplete}
          onBack={() => setCurrentScreen("landing")}
          onGoToLogin={handleGoToLogin}
        />
      )}
      {currentScreen === "login" && (
        <Login
          onComplete={handleAuthComplete}
          onBack={() => setCurrentScreen("landing")}
          onGoToRegister={handleGetStarted}
        />
      )}
      {currentScreen === "dashboard" && (
        <Dashboard
          userName={userName}
          dayStr={dayStr}
          habitCompletion={habitCompletion}
          onToggleHabit={toggleHabit}
          dailyChallengeCompleted={dailyChallengeCompleted}
          onToggleDailyChallenge={toggleDailyChallenge}
          onViewChallenge={handleViewDailyChallenge}
          onViewNutritionHabits={handleViewNutritionHabits}
          onViewFitnessHabits={handleViewFitnessHabits}
          onViewProfile={() => setCurrentScreen("profile")}
          userInterests={userInterests}
          weeklyCompletion={weeklyCompletion}
        />
      )}
      {currentScreen === "daily-challenge" && (
        <DailyChallenge
          onBack={handleBackToDashboard}
          userName={userName}
          dayStr={dayStr}
          isCompleted={dailyChallengeCompleted}
          onToggleComplete={toggleDailyChallenge}
          userInterests={userInterests}
        />
      )}
      {currentScreen === "nutrition-habits" && (
        <NutritionHabits
          onBack={handleBackToDashboard}
          userName={userName}
          dayStr={dayStr}
          habitCompletion={habitCompletion}
          onToggleHabit={toggleHabit}
          weeklyCompletion={nutritionWeeklyCompletion}
        />
      )}
      {currentScreen === "fitness-habits" && (
        <FitnessHabits
          onBack={handleBackToDashboard}
          userName={userName}
          dayStr={dayStr}
          habitCompletion={habitCompletion}
          onToggleHabit={toggleHabit}
          weeklyCompletion={fitnessWeeklyCompletion}
        />
      )}
      {currentScreen === "profile" && (
        <Profile userName={userName} onBack={handleBackToDashboard} onSignOut={handleSignOut} />
      )}
      <PrivacyConsentModal
        open={needsPrivacyConsent}
        onAccept={(consent) => {
          console.log("Privacy consent:", consent);
          setNeedsPrivacyConsent(false);
        }}
      />
    </>
  );
}
