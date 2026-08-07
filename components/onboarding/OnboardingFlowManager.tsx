"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import SplashScreen from "./SplashScreen";
import OnboardingLanguageSelector from "./OnboardingLanguageSelector";
import OnboardingAuth from "./OnboardingAuth";
import OnboardingProfileSetup from "./OnboardingProfileSetup";

interface Props {
  children: React.ReactNode;
}

export default function OnboardingFlowManager({ children }: Props) {
  const { hasCompletedOnboarding, setHasCompletedOnboarding, languageSelected, isAuthenticated } = useStore();

  const [step, setStep] = useState<"splash" | "language" | "auth" | "profile" | "dashboard">(
    isAuthenticated && hasCompletedOnboarding ? "dashboard" : "splash"
  );

  useEffect(() => {
    if (!isAuthenticated || !hasCompletedOnboarding) {
      if (step === "dashboard") {
        setStep("splash");
      }
    }
  }, [isAuthenticated, hasCompletedOnboarding, step]);

  const handleSplashComplete = () => {
    if (languageSelected) {
      setStep("auth");
    } else {
      setStep("language");
    }
  };

  const handleLanguageComplete = () => {
    setStep("auth");
  };

  const handleAuthComplete = (isNewUser: boolean) => {
    if (isNewUser) {
      setStep("profile");
    } else {
      setHasCompletedOnboarding(true);
      setStep("dashboard");
    }
  };

  const handleProfileComplete = () => {
    setHasCompletedOnboarding(true);
    setStep("dashboard");
  };

  if ((!isAuthenticated || !hasCompletedOnboarding) && step === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if ((!isAuthenticated || !hasCompletedOnboarding) && step === "language") {
    return <OnboardingLanguageSelector onNext={handleLanguageComplete} />;
  }

  if ((!isAuthenticated || !hasCompletedOnboarding) && step === "auth") {
    return <OnboardingAuth onNext={handleAuthComplete} />;
  }

  if ((!isAuthenticated || !hasCompletedOnboarding) && step === "profile") {
    return <OnboardingProfileSetup onComplete={handleProfileComplete} />;
  }

  return <>{children}</>;
}
