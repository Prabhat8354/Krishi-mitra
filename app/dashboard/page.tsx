"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import OnboardingFlowManager from "@/components/onboarding/OnboardingFlowManager";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If DEMO_MODE is true or user is not authenticated after loading completes
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    if (mounted && !loading && !isAuthenticated && !isDemoMode) {
      router.push("/login");
    }
  }, [mounted, loading, isAuthenticated, router]);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 border-4 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-500">Loading Protected Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingFlowManager>
      <Dashboard />
    </OnboardingFlowManager>
  );
}
