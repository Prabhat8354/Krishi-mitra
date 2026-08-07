"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Send, ArrowLeft, Volume2, VolumeX, Loader2, MessageSquare, Plus, Mic, Image as ImageIcon, Sparkles, Copy, Check, Sprout } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useChat } from "@/hooks/useChat";
import MessageBubble from "@/components/Chat/MessageBubble";
import Link from "next/link";

export default function ChatPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const currentLanguage = useStore((state) => state.currentLanguage);
  const profile = useStore((state) => state.profile);
  const clearMessages = useStore((state) => state.clearMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const processedQueryRef = useRef<boolean>(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const { messages, isLoading, sendMessage } = useChat(isTTSEnabled);

  useEffect(() => {
    if (currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  // Transfer & automatically submit prompt from Dashboard Ask Mitra ONCE
  useEffect(() => {
    if (processedQueryRef.current || typeof window === "undefined") return;

    const urlParams = new URLSearchParams(window.location.search);
    let pendingQuery = urlParams.get("q") || sessionStorage.getItem("pending_dashboard_query");

    if (pendingQuery && pendingQuery.trim()) {
      processedQueryRef.current = true;
      const cleanQuery = pendingQuery.trim();

      console.log("Received initial message:", cleanQuery);
      console.log("Calling sendMessage()");

      // Clear storage & URL state immediately to prevent duplicate sends on refresh
      sessionStorage.removeItem("pending_dashboard_query");
      window.history.replaceState(null, "", "/chat");

      // Automatically send to AI via the exact same sendMessage function as manual submission
      sendMessage(cleanQuery);
    }
  }, [sendMessage]);

  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isAtBottom);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const quickPrompts = [
    "What fertilizer schedule is best for my Wheat crop?",
    "My Tomato leaves have brown spots. How do I treat it?",
    "How do I apply for PM Kisan 17th installment?",
    "Today's Mandi rate forecast for Onion and Potato",
  ];

  return (
    <div className="flex h-screen bg-[#F8FAF7] text-[#111827] overflow-hidden">
      
      {/* Left Sidebar (ChatGPT style) */}
      <aside className="w-72 bg-white border-r border-gray-200/80 hidden md:flex flex-col justify-between p-4 shrink-0">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Mitra AI Chat Assistant</span>
          </Link>

          <button
            onClick={() => clearMessages()}
            className="w-full py-2.5 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-2 transition mb-6 shadow-xs"
          >
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>New Chat Session</span>
          </button>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2">Conversations</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200/60">
              <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">Current Advisory Session</span>
            </div>
          </div>
        </div>

        {/* Farmer Profile Footer in Sidebar */}
        <div className="pt-4 border-t border-gray-100 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold">
            {profile.name ? profile.name.charAt(0) : "F"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gray-900 truncate">{profile.name || "Farmer"}</div>
            <div className="text-[10px] text-gray-500 truncate">{profile.district}, {profile.state}</div>
          </div>
        </div>
      </aside>

      {/* Main Chat Feed */}
      <main className="flex-1 flex flex-col h-full bg-[#F8FAF7] relative min-w-0">
        
        {/* Top Header */}
        <header className="h-14 border-b border-gray-200/80 bg-white/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="text-sm font-bold text-gray-900">AI Agricultural Advisor</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
              Sarvam AI Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTTSEnabled(!isTTSEnabled)}
              className={`p-2 rounded-xl text-xs font-medium transition border ${
                isTTSEnabled ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-400 border-gray-200"
              }`}
              title={isTTSEnabled ? "Voice Readout Enabled" : "Voice Readout Disabled"}
            >
              {isTTSEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Conversation Stream */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-3xl mx-auto w-full"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">How can Mitra help today?</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Ask in Hindi, English, Tamil, Telugu, Kannada, Marathi or 6 other Indian languages.
                </p>
              </div>

              {/* Quick Prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl pt-4">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sendMessage(prompt);
                    }}
                    className="p-3 text-left bg-white hover:bg-emerald-50/50 rounded-xl border border-gray-200/80 hover:border-emerald-300 text-xs text-gray-700 font-medium transition shadow-xs"
                  >
                    💡 {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 p-3 rounded-2xl border border-emerald-200/60 max-w-md">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Analyzing query with Sarvam AI reasoning model...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sticky Prompt Bar */}
        <div className="p-4 bg-white border-t border-gray-200/80 shrink-0">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about crops, pests, market prices, or government schemes..."
              disabled={isLoading}
              className="w-full py-3.5 pl-4 pr-24 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-900 placeholder:text-gray-400"
            />
            
            <div className="absolute right-2.5 flex items-center gap-1.5">
              <Link
                href="/crop-doctor"
                className="p-2 rounded-xl text-gray-400 hover:text-emerald-600 transition"
                title="Upload Crop Image"
              >
                <ImageIcon className="w-4 h-4" />
              </Link>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
