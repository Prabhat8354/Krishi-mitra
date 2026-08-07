"use client";

import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { checkAuth } = useAuth();

  const handleSplashComplete = async () => {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    // DEMO MODE BEHAVIOR:
    // If DEMO_MODE=true: ALWAYS route to /login after splash screen for presentation flow
    if (isDemoMode) {
      router.push("/login");
      return;
    }

    // PRODUCTION MODE BEHAVIOR:
    // If DEMO_MODE=false: Auto-redirect authenticated users directly to /dashboard
    const authenticated = await checkAuth();
    if (authenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return <SplashScreen onComplete={handleSplashComplete} durationMs={2800} />;
}
