"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { Check, ArrowRight, Globe, Sparkles } from "lucide-react";
import KrishiMitraLogo from "../KrishiMitraLogo";

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en-IN", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml-IN", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa-IN", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur-IN", name: "Urdu", nativeName: "اردو", flag: "🇮🇳" },
];

interface Props {
  onNext: () => void;
}

export default function OnboardingLanguageSelector({ onNext }: Props) {
  const { currentLanguage, setLanguage } = useStore();
  const [selected, setSelected] = useState(currentLanguage || "hi-IN");

  const handleSelect = (code: string) => {
    setSelected(code);
  };

  const handleContinue = () => {
    setLanguage(selected);
    onNext();
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] flex flex-col justify-between p-4 md:p-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex justify-between items-center py-4">
        <KrishiMitraLogo size={36} showText={true} />
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Step 1 of 4
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto w-full my-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <Globe className="w-3.5 h-3.5" /> Multilingual Support
          </div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">
            Choose Your Preferred Language
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            You can change it anytime later in Settings.
          </p>
        </div>

        {/* Language Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {LANGUAGES.map((lang) => {
            const isSelected = selected === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-center justify-between shadow-xs ${
                  isSelected
                    ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-white border-gray-200/80 hover:border-emerald-300 hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="text-base font-black text-gray-900">{lang.nativeName}</div>
                  <div className="text-[11px] font-semibold text-gray-500 flex items-center gap-1 mt-0.5">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                    isSelected
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={handleContinue}
            className="w-full sm:w-80 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>Continue to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-gray-400 font-medium py-2">
        Powered by Sarvam AI Multilingual Language Models
      </div>
    </div>
  );
}
