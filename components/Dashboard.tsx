"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import { 
  CloudRain, 
  TrendingUp, 
  AlertTriangle, 
  Send, 
  Sparkles, 
  Stethoscope, 
  Mic, 
  MessageCircle,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import ProfileHeader from "./ProfileHeader";
import MitraMascot from "./MitraMascot";

const GREETINGS_MAP: Record<string, string> = {
  "hi-IN": "नमस्ते",
  "pa-IN": "ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ",
  "en-IN": "Hello",
  "mr-IN": "नमस्कार",
  "bn-IN": "নমস্কার",
  "ta-IN": "வணக்கம்",
  "te-IN": "నమస్కారం",
  "gu-IN": "નમસ્તે",
  "kn-IN": "ನಮಸ್ಕಾರ",
  "ml-IN": "നമസ്കാരം",
  "or-IN": "ନମସ୍କାର",
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const currentLanguage = useStore((state) => state.currentLanguage);
  const profile = useStore((state) => state.profile);
  const router = useRouter();

  const [promptInput, setPromptInput] = useState("");

  useEffect(() => {
    if (currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    const query = promptInput.trim();
    if (!query) return;

    console.log("Dashboard message:", query);
    console.log("Navigating to Chat...");

    if (typeof window !== "undefined") {
      sessionStorage.setItem("pending_dashboard_query", query);
    }
    router.push(`/chat?q=${encodeURIComponent(query)}`);
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const primaryCards = [
    {
      id: "market",
      title: t('mandiMarketRates'),
      desc: t('mandiMarketRatesDesc'),
      icon: TrendingUp,
      iconBg: "bg-emerald-50 text-emerald-600",
      path: "/market",
      badge: "Live Ticker",
    },
    {
      id: "alerts",
      title: t('smartFarmAlerts'),
      desc: t('smartFarmAlertsDesc'),
      icon: AlertTriangle,
      iconBg: "bg-amber-50 text-amber-600",
      path: "/alerts",
      badge: "Threat Radar",
    },
    {
      id: "weather",
      title: t('weatherDashboard'),
      desc: t('weatherDashboardDesc'),
      icon: CloudRain,
      iconBg: "bg-sky-50 text-sky-600",
      path: "/weather",
      badge: "GPS Forecast",
    },
    {
      id: "chat",
      title: t('aiChatAssistant'),
      desc: t('aiChatAssistantDesc'),
      icon: MessageCircle,
      iconBg: "bg-emerald-50 text-emerald-600",
      path: "/chat",
      badge: "Context Memory",
    },
    {
      id: "crop-doctor",
      title: t('cropDoctor'),
      desc: t('cropDoctorDesc'),
      icon: Stethoscope,
      iconBg: "bg-teal-50 text-teal-600",
      path: "/crop-doctor",
      badge: "CV Vision",
    },
    {
      id: "voice",
      title: t('voiceAssistant'),
      desc: t('voiceAssistantDesc'),
      icon: Mic,
      iconBg: "bg-purple-50 text-purple-600",
      path: "/voice",
      badge: "Sarvam Audio",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] pb-24 font-sans">
      <ProfileHeader />

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 space-y-8">
        
        {/* HERO SECTION GREETING WITH MITRA MASCOT */}
        <section className="bg-white rounded-[20px] p-6 md:p-8 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            {/* Left Content with Mitra Mascot */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <MitraMascot mode="inline" />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t('krishiMitraActive')} • <strong className="text-emerald-800">{t('farmHealth')}: 96 / 100</strong>
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                  👋 {GREETINGS_MAP[currentLanguage] || "Namaste"}, {profile.name ? profile.name.split(" ")[0] : "Farmer"}!
                </h1>

                <p className="text-xs text-gray-700 leading-relaxed font-medium max-w-xl">
                  {t('websiteInfo')}
                </p>

                {/* Farmer Profile Stats Pill Row */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                    🌾 Crops: <span className="font-extrabold">{profile.mainCrops || "Wheat, Rice"}</span>
                  </span>

                  <span className="text-[11px] font-bold bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg border border-sky-200">
                    📍 Location: <span className="font-extrabold">{profile.village || "Samrala"}, {profile.district || "Ludhiana"}, {profile.state || "Punjab"}</span>
                  </span>

                  <span className="text-[11px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                    📐 Farm Size: <span className="font-extrabold">{profile.farmSize || "5"} {profile.landUnit || "Acres"}</span>
                  </span>

                  <span className="text-[11px] font-bold bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-200">
                    🌱 Soil: <span className="font-extrabold">{profile.soilType || "Loamy"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Today's AI Advice Banner */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3 lg:max-w-xs shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-emerald-900 leading-relaxed">
                <strong>{t('todaysAiAdvice')}:</strong> {t('irrigationNotRecommended')}
              </div>
            </div>
          </div>
        </section>

        {/* AI CHAT INPUT BAR */}
        <section className="bg-white rounded-[20px] p-6 border border-gray-200/80 shadow-xs space-y-3">
          <form onSubmit={handleAskAI} className="relative">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={t('askAnythingPlaceholder')}
              className="w-full py-4 pl-5 pr-28 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm text-gray-900 placeholder:text-gray-400 shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5"
            >
              <span>{t('askMitra')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

        {/* 6 PRIMARY FEATURE CARDS GRID (3 Columns × 2 Rows) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#111827] tracking-tight">
              {t('primaryAgriculturalSuite')}
            </h2>
            <span className="text-xs font-semibold text-[#6B7280]">{t('coreModules')}</span>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px] max-w-[1400px] mx-auto"
            style={{
              display: 'grid',
              gap: '28px',
            }}
          >
            {primaryCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={card.id}
                  onClick={() => navigateTo(card.path)}
                  className="group bg-white rounded-[20px] p-7 md:p-8 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-250 cursor-pointer flex flex-col justify-between h-[270px] relative overflow-hidden"
                >
                  <div>
                    {/* Large Icon Header & Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-14 h-14 rounded-2xl ${card.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform duration-250 shadow-xs`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200/60">
                        {card.badge}
                      </span>
                    </div>

                    {/* Feature Title */}
                    <h3 className="text-xl font-extrabold text-[#111827] group-hover:text-emerald-600 transition-colors duration-250">
                      {card.title}
                    </h3>

                    {/* One-line description */}
                    <p className="text-xs text-[#6B7280] leading-relaxed mt-2 line-clamp-2 font-medium">
                      {card.desc}
                    </p>
                  </div>

                  {/* → Open Feature */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#111827] group-hover:text-emerald-600 transition-colors duration-250">
                    <span className="flex items-center gap-1">{t('openFeature')}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform duration-250" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
