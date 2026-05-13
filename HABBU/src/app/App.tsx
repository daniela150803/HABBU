import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { Registration } from "./components/Registration";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { DailyChallenge } from "./components/DailyChallenge";
import { NutritionHabits } from "./components/NutritionHabits";
import { FitnessHabits } from "./components/FitnessHabits";
import { Profile } from "./components/Profile";
import { PrivacyConsentModal } from "./components/PrivacyConsentModal";

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
  const [needsPrivacyConsent, setNeedsPrivacyConsent] = useState(false);

  const handleGetStarted = () => {
    setCurrentScreen("registration");
  };

  const handleGoToLogin = () => {
    setCurrentScreen("login");
  };

  const handleAuthComplete = (userData: { name: string; email: string }) => {
    setUserName(userData.name);
    setCurrentScreen("dashboard");
    console.log("Auth completed for", userData.email);
  };

  const handleRegistrationComplete = (userData: { name: string; email: string }) => {
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
          onViewChallenge={handleViewDailyChallenge}
          onViewNutritionHabits={handleViewNutritionHabits}
          onViewFitnessHabits={handleViewFitnessHabits}
          onViewProfile={() => setCurrentScreen("profile")}
        />
      )}
      {currentScreen === "daily-challenge" && <DailyChallenge onBack={handleBackToDashboard} />}
      {currentScreen === "nutrition-habits" && <NutritionHabits onBack={handleBackToDashboard} />}
      {currentScreen === "fitness-habits" && <FitnessHabits onBack={handleBackToDashboard} />}
      {currentScreen === "profile" && (
        <Profile userName={userName} onBack={handleBackToDashboard} />
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
