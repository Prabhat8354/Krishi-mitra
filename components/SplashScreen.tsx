"use client";

import React, { useEffect, useState } from "react";
import KrishiMitraLogo from "@/components/KrishiMitraLogo";
import InteractiveMascot from "@/components/InteractiveMascot";
import { Sparkles, Sprout } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
  durationMs?: number;
}

export default function SplashScreen({ onComplete, durationMs = 2800 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.round((elapsed / durationMs) * 100), 100);
      setProgress(currentProgress);

      if (elapsed >= durationMs) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 30);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FCF8] text-[#111827] flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans">
      
      {/* AMBIENT BACKGROUND GLOW WAVES */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-300/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-300/25 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center text-center space-y-6">
        
        {/* KRISHIMITRA LOGO */}
        <div className="animate-in fade-in zoom-in duration-700">
          <KrishiMitraLogo size={54} showText={true} />
        </div>

        {/* 300px MASCOT ANIMATION */}
        <div className="py-2">
          <InteractiveMascot size={240} />
        </div>

        {/* LOADING STATUS & BADGE */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            <span>AI Agricultural Intelligence Engine</span>
          </div>
          <p className="text-xs font-bold text-gray-500 tracking-wide">
            Initializing KrishiMitra Companion... {progress}%
          </p>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-64 h-2.5 bg-emerald-100 rounded-full overflow-hidden p-0.5 border border-emerald-200 shadow-inner">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 rounded-full transition-all duration-75 ease-out"
          ></div>
        </div>

        <p className="text-[11px] font-semibold text-gray-400 pt-4 flex items-center gap-1.5">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" /> Powered by Google Gemini AI
        </p>
      </div>

    </div>
  );
}
