"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function VoiceNavigation() {
  const router = useRouter();
  const { audioEnabled } = useStore();
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      processCommand(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      try {
        recognition.start();
      } catch (err) {
        setIsListening(false);
      }
    } else {
      try {
        recognition.stop();
      } catch (err) {}
    }

    return () => {
      try {
        recognition.stop();
      } catch (err) {}
    };
  }, [isListening]);

  const processCommand = (cmd: string) => {
    let responseText = "";

    if (cmd.includes("chat") || cmd.includes("advisor") || cmd.includes("ask")) {
      responseText = "Opening AI Chat Advisor";
      router.push("/chat");
    } else if (cmd.includes("weather") || cmd.includes("rain") || cmd.includes("forecast")) {
      responseText = "Opening Weather Dashboard";
      router.push("/weather");
    } else if (cmd.includes("market") || cmd.includes("price") || cmd.includes("mandi") || cmd.includes("rate")) {
      responseText = "Opening Market Mandi Prices";
      router.push("/market");
    } else if (cmd.includes("scheme") || cmd.includes("yojana") || cmd.includes("government") || cmd.includes("loan") || cmd.includes("subsidy")) {
      responseText = "Opening Government Schemes";
      router.push("/schemes");
    } else if (cmd.includes("crop") || cmd.includes("disease") || cmd.includes("doctor") || cmd.includes("image") || cmd.includes("upload")) {
      responseText = "Opening Crop Doctor Disease Detection";
      router.push("/crop-doctor");
    } else if (cmd.includes("alert") || cmd.includes("warning") || cmd.includes("notice")) {
      responseText = "Opening Smart Farm Alerts";
      router.push("/alerts");
    } else if (cmd.includes("profile") || cmd.includes("farm") || cmd.includes("account")) {
      responseText = "Opening Farmer Profile";
      router.push("/profile");
    } else if (cmd.includes("insight") || cmd.includes("analytic") || cmd.includes("chart")) {
      responseText = "Opening Analytics & Insights";
      router.push("/insights");
    } else if (cmd.includes("home") || cmd.includes("dash")) {
      responseText = "Navigating to Home Dashboard";
      router.push("/");
    } else {
      responseText = `Command "${cmd}" not recognized. Try saying "Open Market Prices" or "Show Weather".`;
    }

    setFeedback(responseText);
    if (audioEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(responseText);
      utterance.rate = 1.0;
      synth.speak(utterance);
    }

    setTimeout(() => {
      setFeedback(null);
    }, 4000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {feedback && (
        <div className="bg-emerald-900/90 text-white text-xs px-3 py-2 rounded-xl backdrop-blur-md shadow-xl border border-emerald-500/30 animate-pulse flex items-center gap-2 max-w-xs">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <button
        onClick={() => setIsListening(!isListening)}
        className={`p-4 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300 flex items-center justify-center ${
          isListening
            ? "bg-rose-600 text-white border-rose-400 animate-ping"
            : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-400/50 hover:scale-105"
        }`}
        title="Voice Navigation (e.g. 'Open Weather', 'Market Prices', 'Crop Doctor')"
      >
        {isListening ? (
          <MicOff className="w-6 h-6 animate-bounce" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
