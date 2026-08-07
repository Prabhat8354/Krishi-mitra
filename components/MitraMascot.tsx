"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Sparkles, X, MessageSquare } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cleanTextForSpeech } from "@/lib/speech-preprocessor";

interface MascotProps {
  mode?: "floating" | "inline";
  onChatOpen?: () => void;
}

export default function MitraMascot({ mode = "floating", onChatOpen }: MascotProps) {
  const router = useRouter();
  const { audioEnabled, currentLanguage } = useStore();

  const [isListening, setIsListening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string | null>(null);

  const hoverPhrases = [
    "👋 Hi! Need farming advice?",
    "🌾 Ask me anything about your crops.",
    "Ready to help your farm today!",
    "Mitra AI Companion is online."
  ];

  // Natural Blinking Interval
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4500);

    return () => clearInterval(blinkInterval);
  }, []);

  // Random Idle Wave Animation every 20 seconds
  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2500);
    }, 20000);

    return () => clearInterval(waveInterval);
  }, []);

  // Speech Recognition setup for voice mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = currentLanguage || "en-IN";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      setSpeechBubbleText("Processing prompt...");
      speakPhrase("I have a recommendation for you.");
      setTimeout(() => {
        router.push(`/chat?q=${encodeURIComponent(transcript)}`);
      }, 1000);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    if (isListening) {
      try {
        recognition.start();
        setSpeechBubbleText("I'm listening...");
      } catch (e) {
        setIsListening(false);
      }
    }

    return () => {
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [isListening, currentLanguage, router]);

  const speakPhrase = (text: string) => {
    if (audioEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      synth.cancel(); // Stop any currently playing audio
      const spokenText = cleanTextForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(spokenText);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      synth.speak(utterance);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isListening && !isClicked) {
      const randomPhrase = hoverPhrases[Math.floor(Math.random() * hoverPhrases.length)];
      setSpeechBubbleText(randomPhrase);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isListening && !isClicked) {
      setSpeechBubbleText(null);
    }
  };

  const handleClick = () => {
    setIsClicked(true);
    setSpeechBubbleText("Let's grow your farm together!");
    speakPhrase("Let's solve this together.");

    setTimeout(() => {
      setIsClicked(false);
      if (onChatOpen) {
        onChatOpen();
      } else {
        router.push("/chat");
      }
    }, 1200);
  };

  const toggleVoice = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsListening(!isListening);
  };

  return (
    <div
      className={`${
        mode === "floating" ? "fixed bottom-6 right-6 z-50" : "relative"
      } flex flex-col items-end gap-2 group select-none`}
    >
      {/* Speech Bubble Tooltip */}
      {speechBubbleText && (
        <div className="bg-white/95 text-[#111827] text-xs font-bold px-3.5 py-2.5 rounded-2xl shadow-xl border border-emerald-500/30 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2 max-w-xs text-right">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{speechBubbleText}</span>
        </div>
      )}

      <div className="relative flex items-center gap-2">
        
        {/* Voice Trigger Pill Button */}
        {mode === "floating" && (
          <button
            onClick={toggleVoice}
            className={`p-3 rounded-2xl shadow-lg border transition-all duration-300 flex items-center gap-2 ${
              isListening
                ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                : "bg-white/90 hover:bg-emerald-600 text-gray-700 hover:text-white border-emerald-200 hover:border-emerald-500"
            }`}
            title="Voice Command with Mitra AI"
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 animate-bounce text-white" />
                <span className="text-xs font-bold text-white hidden sm:inline">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-emerald-600 group-hover:text-white" />
                <span className="text-xs font-bold hidden sm:inline">Voice Assistant</span>
              </>
            )}
          </button>
        )}

        {/* MITRA MASCOT VECTOR AVATAR */}
        <div
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`cursor-pointer transition-all duration-300 transform ${
            isClicked ? "scale-110 -translate-y-2" : isHovered ? "scale-105 -translate-y-1" : ""
          }`}
          title="Mitra — Your AI Farming Companion (Click to Chat)"
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            
            {/* Listening Glow Halo */}
            {isListening && (
              <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping pointer-events-none"></div>
            )}

            {/* MITRA SVG CHARACTER VECTOR */}
            <svg
              width="76"
              height="76"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-xl"
            >
              <defs>
                {/* Body Shadow */}
                <radialGradient id="mitra-body-grad" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="85%" stopColor="#F0FDF4" />
                  <stop offset="100%" stopColor="#DCFCE7" />
                </radialGradient>
                {/* Eye Glow */}
                <filter id="eye-glow">
                  <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#22C55E" floodOpacity="0.8" />
                </filter>
                {/* Halo Glow */}
                <filter id="halo-glow">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#84CC16" floodOpacity="0.9" />
                </filter>
              </defs>

              {/* Floating AI Halo Ring above head */}
              <ellipse
                cx="50"
                cy="14"
                rx="16"
                ry="4"
                stroke="#84CC16"
                strokeWidth="2.5"
                fill="none"
                filter="url(#halo-glow)"
                className="animate-pulse"
              />

              {/* Leaf Stem & Green Leaf on Head (Forms K shape) */}
              <path
                d="M50 22 C48 16 42 12 36 14 C34 18 38 24 46 22 Z"
                fill="#16A34A"
                className={`transition-transform duration-500 ${isWaving ? "rotate-12" : ""}`}
              />
              <path
                d="M50 22 C52 16 58 12 64 14 C66 18 62 24 54 22 Z"
                fill="#22C55E"
                className={`transition-transform duration-500 ${isWaving ? "-rotate-12" : ""}`}
              />
              <circle cx="50" cy="22" r="2" fill="#84CC16" />

              {/* Main Rounded White Body */}
              <rect
                x="18"
                y="22"
                width="64"
                height="64"
                rx="32"
                fill="url(#mitra-body-grad)"
                stroke="#22C55E"
                strokeWidth="2.5"
              />

              {/* Soft Glowing Green Eyes */}
              {isBlinking ? (
                // Closed eyes on blink
                <>
                  <path d="M35 48 Q40 52 45 48" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
                  <path d="M55 48 Q60 52 65 48" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
                </>
              ) : (
                // Open glowing eyes
                <>
                  <circle cx="40" cy="48" r="5" fill="#22C55E" filter="url(#eye-glow)" />
                  <circle cx="41.5" cy="46.5" r="1.8" fill="white" />
                  
                  <circle cx="60" cy="48" r="5" fill="#22C55E" filter="url(#eye-glow)" />
                  <circle cx="61.5" cy="46.5" r="1.8" fill="white" />
                </>
              )}

              {/* Friendly Subtle Smile */}
              <path
                d="M43 58 Q50 65 57 58"
                stroke="#16A34A"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />

              {/* Blush Pink Cheeks */}
              <ellipse cx="32" cy="54" rx="4" ry="2" fill="#F43F5E" fillOpacity="0.25" />
              <ellipse cx="68" cy="54" rx="4" ry="2" fill="#F43F5E" fillOpacity="0.25" />

              {/* Left & Right Cute Arm Wings */}
              {/* Left Arm */}
              <path
                d="M14 52 C10 50 8 60 16 60 Z"
                fill="#22C55E"
              />
              {/* Right Arm (Waves when isWaving or hovered) */}
              <path
                d={isWaving || isHovered ? "M86 42 C92 38 94 48 84 54 Z" : "M86 52 C90 50 92 60 84 60 Z"}
                fill="#22C55E"
                className="transition-all duration-300"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
