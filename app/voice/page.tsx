"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Send, ArrowLeft, Volume2, Copy, Check, ChevronDown, ChevronUp, Brain, Square, AlertCircle, Sparkles, RefreshCw, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "@/store/useStore";
import { getLanguageByCode } from "@/lib/languages";
import { useChat } from "@/hooks/useChat";
import { useStreamingTTS } from "@/hooks/useStreamingTTS";
import { speakNaturalVoice } from "@/lib/speech-preprocessor";

type VoiceState = "Ready" | "Listening" | "Processing" | "Speaking" | "Error";

export default function VoicePage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const currentLanguage = useStore((state) => state.currentLanguage);
  const langObj = getLanguageByCode(currentLanguage);

  const [voiceState, setVoiceState] = useState<VoiceState>("Ready");
  const [localText, setLocalText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [browserWarning, setBrowserWarning] = useState<string | null>(null);
  const [micPermissionStatus, setMicPermissionStatus] = useState<"granted" | "denied" | "prompt">("prompt");
  const [lastErrorCode, setLastErrorCode] = useState<string | null>(null);
  const [hasRetriedOnce, setHasRetriedOnce] = useState(false);
  const [expandedThinking, setExpandedThinking] = useState<Set<string>>(new Set());

  const { messages, isLoading, sendMessage } = useChat();
  const { stopStreaming } = useStreamingTTS();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Single-instance recognition refs
  const recognitionRef = useRef<any>(null);
  const isRecognitionRunningRef = useRef<boolean>(false);
  const isSupportedRef = useRef<boolean>(true);

  // Status message based on current language & state
  const statusMessage = useMemo(() => {
    const isEnglish = currentLanguage.startsWith("en");
    switch (voiceState) {
      case "Listening":
        return isEnglish ? "🎤 Listening to your voice..." : "🎤 आपकी आवाज़ सुन रहा हूँ...";
      case "Processing":
        return isEnglish ? "⚡ Processing with Agricultural AI..." : "⚡ कृषि एआई से जवाब तैयार किया जा रहा है...";
      case "Speaking":
        return isEnglish ? "🔊 Speaking AI recommendation..." : "🔊 सलाह बोलकर सुनाई जा रही है...";
      case "Error":
        return isEnglish ? "⚠️ Microphone / Voice Service Notice" : "⚠️ माइक अथवा वॉइस सेवा सूचना";
      default:
        return isEnglish ? "Tap microphone to speak in " + langObj.name : "बोलने के लिए माइक दबाएं (" + langObj.name + ")";
    }
  }, [voiceState, currentLanguage, langObj]);

  useEffect(() => {
    if (currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  // Initial Browser Support Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      isSupportedRef.current = !!SpeechRecognition;

      console.log("========================================");
      console.log("🎙️ [SPEECH RECOGNITION AUDIT DIAGNOSTICS]");
      console.log("🌐 User-Agent:", navigator.userAgent);
      console.log("⚡ SpeechRecognition API Supported:", isSupportedRef.current);
      console.log("🌐 Selected Language:", currentLanguage || "en-IN");
      console.log("========================================");

      if (!isSupportedRef.current) {
        setBrowserWarning("Voice recognition is not supported in this browser.");
      }
    }
  }, [currentLanguage]);

  // Stop STT & TTS cleanly on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
        isRecognitionRunningRef.current = false;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    console.log("🎙️ Recognition ended / stopping instance...");
    if (recognitionRef.current && isRecognitionRunningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        try {
          recognitionRef.current.abort();
        } catch (err) {}
      }
    }
    isRecognitionRunningRef.current = false;
    setVoiceState("Ready");
  }, []);

  const handleSend = useCallback(async (textToSend?: string) => {
    const query = textToSend || localText;
    if (!query.trim()) return;

    if (isRecognitionRunningRef.current) {
      stopListening();
    }

    setVoiceState("Processing");
    setLocalText("");
    setInterimText("");

    try {
      await sendMessage(query);
      setVoiceState("Speaking");
    } catch (e) {
      console.error("Error sending voice prompt:", e);
      setVoiceState("Error");
    } finally {
      setTimeout(() => setVoiceState("Ready"), 4000);
    }
  }, [localText, stopListening, sendMessage, currentLanguage]);

  const startListening = useCallback(async (isRetry = false) => {
    setBrowserWarning(null);

    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserWarning("Voice recognition is not supported in this browser.");
      setMicPermissionStatus("denied");
      return;
    }

    // Single Active Recognition Instance Guard: Stop any previous running instance
    if (isRecognitionRunningRef.current) {
      console.warn("⚠️ SpeechRecognition is already running. Stopping previous instance before starting new.");
      stopListening();
    }

    // Step 1: Request Microphone Permission via navigator.mediaDevices.getUserMedia
    try {
      console.log("🎙️ Requesting microphone access (navigator.mediaDevices.getUserMedia)...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("✅ Microphone permission granted.");
      setMicPermissionStatus("granted");
      stream.getTracks().forEach((track) => track.stop()); // Free hardware for SpeechRecognition
    } catch (err: any) {
      console.error("❌ Microphone permission denied or audio capture failed:", err);
      setMicPermissionStatus("denied");
      setVoiceState("Error");
      setBrowserWarning("Microphone permission denied. Please allow microphone access.");
      return;
    }

    // Step 2: Initialize SpeechRecognition Instance with Required Configuration
    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = currentLanguage || "en-IN"; // Synchronized with selected language

      // IMPLEMENT ALL REQUIRED RECOGNITION CALLBACKS WITH FULL DEBUG LOGGING
      recognition.onstart = () => {
        isRecognitionRunningRef.current = true;
        setLastErrorCode(null);
        setVoiceState("Listening");
        setLocalText("");
        setInterimText("");
        console.log("Speech started");
        console.log("Listening...");
        speakNaturalVoice(langObj.voiceCues.listening, currentLanguage);
      };

      recognition.onaudiostart = () => {
        console.log("🎙️ Callback: onaudiostart (Audio input started)");
      };

      recognition.onspeechstart = () => {
        console.log("🎙️ Callback: onspeechstart (User began speaking)");
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          console.log("Transcript:", interim);
          setInterimText(interim);
        }

        if (final) {
          console.log("Transcript:", final);
          setLocalText(final);
          setInterimText("");
          // Automatically send recognized speech to AI
          handleSend(final);
        }
      };

      recognition.onspeechend = () => {
        console.log("🎙️ Callback: onspeechend (User stopped speaking)");
      };

      recognition.onaudioend = () => {
        console.log("🎙️ Callback: onaudioend (Audio capture ended)");
      };

      recognition.onend = () => {
        isRecognitionRunningRef.current = false;
        console.log("Recognition ended");
        setInterimText("");
      };

      recognition.onnomatch = () => {
        console.log("🎙️ Callback: onnomatch (No speech matched)");
      };

      recognition.onerror = (event: any) => {
        isRecognitionRunningRef.current = false;
        const errCode = event.error || "unknown";
        setLastErrorCode(errCode);
        console.log("Error:", errCode);

        // Handle specific error codes
        switch (errCode) {
          case "not-allowed":
          case "service-not-allowed":
            setMicPermissionStatus("denied");
            setVoiceState("Error");
            setBrowserWarning("Microphone permission denied. Please allow microphone access.");
            break;
          case "network":
          case "no-speech":
            if (!isRetry && !hasRetriedOnce) {
              console.log("🔄 Retrying speech recognition once automatically...");
              setHasRetriedOnce(true);
              setTimeout(() => startListening(true), 600);
            } else {
              setVoiceState("Error");
              setBrowserWarning("Couldn't recognize your speech. Please try again.");
              setHasRetriedOnce(false);
            }
            break;
          case "audio-capture":
            setVoiceState("Error");
            setBrowserWarning("No microphone hardware detected. Please attach a microphone.");
            break;
          case "aborted":
            setVoiceState("Ready");
            break;
          default:
            setVoiceState("Error");
            setBrowserWarning("Couldn't recognize your speech. Please try again.");
            break;
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      isRecognitionRunningRef.current = false;
      console.error("❌ Failed to instantiate/start SpeechRecognition:", err);
      setVoiceState("Error");
      setBrowserWarning("Couldn't recognize your speech. Please try again.");
    }
  }, [currentLanguage, langObj, stopListening, handleSend, hasRetriedOnce]);

  const handleMicToggle = () => {
    if (voiceState === "Listening" || isRecognitionRunningRef.current) {
      stopListening();
    } else {
      setHasRetriedOnce(false);
      startListening();
    }
  };

  const toggleThinking = (id: string) => {
    setExpandedThinking((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] flex flex-col justify-between pb-24 font-sans selection:bg-emerald-500/20">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition border border-gray-200/80 bg-white"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-600 animate-pulse" />
              Multilingual Voice Assistant ({langObj.name})
            </h1>
            <p className="text-[11px] text-gray-500 font-semibold">
              Live Speech-to-Text & Gemini AI Audio Response ({currentLanguage})
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 w-full flex-1 flex flex-col gap-6">
        
        {/* WARNING / ERROR NOTIFICATION CARD */}
        {browserWarning && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{browserWarning}</span>
            </div>
            <button
              onClick={() => startListening()}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold transition shrink-0 ml-3"
            >
              Retry Mic
            </button>
          </div>
        )}

        {/* HERO VOICE RECORDING STAGE */}
        <div className="bg-white rounded-[28px] p-8 border border-gray-200/80 shadow-md flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
          
          {/* AMBIENT PULSE CIRCLES WHEN LISTENING */}
          {voiceState === "Listening" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-72 h-72 rounded-full bg-emerald-400/20 animate-ping"></div>
              <div className="w-56 h-56 rounded-full bg-emerald-500/30 animate-pulse"></div>
            </div>
          )}

          {/* MAIN BIG MICROPHONE BUTTON */}
          <button
            onClick={handleMicToggle}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 transform shadow-xl relative z-10 cursor-pointer ${
              voiceState === "Listening"
                ? "bg-rose-600 text-white scale-110 shadow-rose-300"
                : voiceState === "Processing"
                ? "bg-amber-500 text-white animate-bounce shadow-amber-200"
                : "bg-gradient-to-tr from-emerald-600 to-green-500 text-white hover:scale-105 shadow-emerald-200"
            }`}
            title="Click to speak"
          >
            {voiceState === "Listening" ? (
              <Square className="w-10 h-10 fill-current" />
            ) : voiceState === "Processing" ? (
              <RefreshCw className="w-10 h-10 animate-spin" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </button>

          {/* STATUS LABEL */}
          <div className="space-y-1">
            <h2 className="text-base font-black text-gray-900">{statusMessage}</h2>
            <p className="text-xs text-gray-500 font-medium">Selected Language: <span className="font-extrabold text-emerald-800">{langObj.name} ({langObj.code})</span></p>
          </div>

          {/* LIVE TRANSCRIPT DISPLAY */}
          {(localText || interimText) && (
            <div className="w-full max-w-xl p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-sm font-semibold text-center animate-in fade-in">
              <span>{localText}</span>
              <span className="text-emerald-600 italic ml-1">{interimText}</span>
            </div>
          )}

        </div>

        {/* VOICE CONVERSATION MESSAGES FEED */}
        <div className="space-y-4 flex-1">
          {messages.map((msg, i) => (
            <div
              key={msg.id || i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-[24px] p-5 shadow-xs space-y-2 ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white rounded-br-none"
                    : "bg-white text-gray-900 border border-gray-200/80 rounded-bl-none"
                }`}
              >
                {/* THINKING COLLAPSIBLE ACCORDION */}
                {msg.thinkingText && (
                  <div className="border-b border-gray-200/60 pb-2">
                    <button
                      onClick={() => toggleThinking(msg.id)}
                      className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 hover:underline"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      <span>Sarvam AI Reasoning Process</span>
                      {expandedThinking.has(msg.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    {expandedThinking.has(msg.id) && (
                      <p className="text-xs italic text-gray-500 mt-2 bg-gray-50 p-2.5 rounded-xl border border-gray-200/60">
                        {msg.thinkingText}
                      </p>
                    )}
                  </div>
                )}

                {/* MESSAGE MARKDOWN CONTENT */}
                <div className="text-xs md:text-sm leading-relaxed prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>

                {/* AUDIO AUDIO RE-PLAY BUTTON */}
                {msg.role === "assistant" && (
                  <div className="pt-1 flex items-center justify-end">
                    <button
                      onClick={() => speakNaturalVoice(msg.content, currentLanguage)}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Volume2 className="w-3 h-3" /> Listen Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

      </main>

      {/* FLOATING DEVELOPMENT-ONLY DEBUG PANEL */}
      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-md text-white p-3.5 rounded-2xl border border-gray-700 shadow-2xl text-[11px] font-mono z-50 max-w-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold border-b border-gray-700 pb-1">
            <Terminal className="w-3.5 h-3.5" /> Voice Debug Panel (Dev Only)
          </div>
          <div><span className="text-gray-400">Supported:</span> {isSupportedRef.current ? "YES ✅" : "NO ❌"}</div>
          <div><span className="text-gray-400">Mic Permission:</span> <span className={micPermissionStatus === "granted" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{micPermissionStatus}</span></div>
          <div><span className="text-gray-400">Recognition Lang:</span> {currentLanguage || "en-IN"}</div>
          <div><span className="text-gray-400">State:</span> {voiceState}</div>
          <div><span className="text-gray-400">Transcript:</span> {localText || interimText || "(none)"}</div>
          <div><span className="text-gray-400">Last Error:</span> {lastErrorCode || "None"}</div>
        </div>
      )}

    </div>
  );
}
