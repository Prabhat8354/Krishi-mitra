"use client";

import React, { useEffect } from "react";
import KrishiMitraLogo from "@/components/KrishiMitraLogo";
import { Loader2 } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-[#F8FAF7] flex flex-col justify-between items-center py-12 px-4 cursor-pointer select-none animate-in fade-in duration-300"
    >
      {/* Spacer */}
      <div />

      {/* Center Branding */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-sm">
        <KrishiMitraLogo size={72} showText={false} />
        <h1 className="text-3xl font-black text-[#111827] tracking-tight">
          Krishi <span className="text-emerald-600">Mitra</span>
        </h1>
        <p className="text-sm font-semibold text-gray-500">
          "Your Intelligent Farming Companion"
        </p>
      </div>

      {/* Bottom Footer */}
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
          <span>Powered by Mitra AI</span>
        </div>
        <span className="text-[10px] text-gray-300 font-medium">Tap anywhere to skip</span>
      </div>
    </div>
  );
}
