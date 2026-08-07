"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Newspaper, 
  Lightbulb, 
  Sparkles, 
  CheckCircle2, 
  Heart,
  ExternalLink,
  Building2,
  TrendingUp,
  Coins,
  Sprout,
  ShieldCheck,
  Sun,
  Microscope,
  PhoneCall
} from "lucide-react";
import KrishiMitraLogo from "./KrishiMitraLogo";

export default function FarmerInfoFooter() {
  const pathname = usePathname();
  const isDashboard = pathname === "/" || pathname === "/dashboard";
  const [tickerPaused, setTickerPaused] = useState(false);

  // Daily Rotating Krishi Agronomy Tip
  const krishiTips = [
    "Avoid overhead irrigation 24 hours before expected rainfall to prevent root rot and waterlogging.",
    "Spray fungicides during early morning or calm evening hours when wind speed is below 10 km/h.",
    "Maintain 45cm row spacing in Wheat & Paddy to ensure optimal air circulation and sunlight exposure.",
    "Incorporate bio-fertilizers like Azotobacter and Rhizobium to reduce chemical urea reliance by 25%.",
    "Use drip irrigation to conserve up to 40% water while delivering liquid nutrients directly to root zones.",
  ];

  const currentTip = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return krishiTips[dayOfYear % krishiTips.length];
  }, []);

  // 10 Official Government Farmer Resources
  const importantResources = [
    { name: "PM-KISAN", icon: Sprout, desc: "Direct Benefit Transfer Portal", url: "https://pmkisan.gov.in", color: "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100" },
    { name: "Ministry of Agriculture", icon: Building2, desc: "Central Agriculture Department", url: "https://agricoop.nic.in", color: "bg-green-50 text-green-800 border-green-200 hover:bg-green-100" },
    { name: "eNAM", icon: TrendingUp, desc: "National Agriculture Market", url: "https://www.enam.gov.in", color: "bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100" },
    { name: "Agmarknet", icon: Coins, desc: "Government Mandi Rates Stream", url: "https://agmarknet.gov.in", color: "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100" },
    { name: "Soil Health Card", icon: Sprout, desc: "Soil Quality Analysis Portal", url: "https://soilhealth.dac.gov.in", color: "bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100" },
    { name: "PM Fasal Bima", icon: ShieldCheck, desc: "Crop Insurance Scheme Portal", url: "https://pmfby.gov.in", color: "bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100" },
    { name: "IMD Weather", icon: Sun, desc: "National Weather Department", url: "https://mausam.imd.gov.in", color: "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100" },
    { name: "ICAR", icon: Microscope, desc: "Agricultural Research Council", url: "https://icar.org.in", color: "bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100" },
    { name: "Krishi Vigyan Kendra", icon: Building2, desc: "KVK District Advisory", url: "https://kvk.icar.gov.in", color: "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100" },
    { name: "mKisan", icon: PhoneCall, desc: "SMS Advisory Services", url: "https://mkisan.gov.in", color: "bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100" },
  ];

  // News Ticker Bulletins
  const tickerItems = [
    "🟢 PM-KISAN 17th Installment e-KYC deadline extended for registered farmers across all states.",
    "🟢 Tomato prices rise by 5% in Azadpur and Varanasi mandi markets today.",
    "🟢 New drip & solar pump irrigation subsidy launched under PM-KUSUM scheme.",
    "🟢 Heavy monsoon rainfall warning issued for Punjab, Haryana, and Western UP.",
    "🟢 Wheat MSP increased to ₹2,300 per quintal for the 2024-25 Rabi season.",
  ];

  // ----------------------------------------------------
  // MINIMAL FOOTER FOR NON-DASHBOARD FEATURE PAGES
  // ----------------------------------------------------
  if (!isDashboard) {
    return (
      <footer className="w-full bg-[#F3F7F2] text-[#111827] py-6 border-t border-emerald-900/10 font-sans mt-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div>
            © 2026 <strong>KrishiMitra</strong> | Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Indian Farmers
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/" className="hover:text-emerald-700 transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-emerald-700 transition">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/profile" className="hover:text-emerald-700 transition">Contact Us</Link>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Version 1.0</span>
          </div>
        </div>
      </footer>
    );
  }

  // ----------------------------------------------------
  // FULL FARMER INFORMATION HUB FOR DASHBOARD (HOME)
  // ----------------------------------------------------
  return (
    <footer className="w-full bg-[#F3F7F2] text-[#111827] pt-10 pb-4 border-t border-emerald-900/10 font-sans mt-12">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-10">
        
        {/* 1. THREE FOOTER CARDS IN A SINGLE RESPONSIVE ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* CARD 1: LATEST GOVERNMENT UPDATES */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-emerald-600" /> Latest Government Updates
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  NEW
                </span>
              </div>

              <div className="space-y-3 mt-4">
                <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase">PM-KISAN DBT</span>
                    <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">NEW</span>
                  </div>
                  <h4 className="text-xs font-extrabold text-gray-900">17th Installment e-KYC Verification Extended</h4>
                  <div className="text-[10px] text-gray-500 pt-0.5">Ministry of Agriculture • Today</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/60 space-y-1">
                  <div className="text-[10px] font-bold text-sky-800 uppercase">PMFBY Insurance</div>
                  <h4 className="text-xs font-extrabold text-gray-900">Kharif Crop Insurance Registration Open</h4>
                  <div className="text-[10px] text-gray-500 pt-0.5">PMFBY Portal • Yesterday</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/60 space-y-1">
                  <div className="text-[10px] font-bold text-amber-800 uppercase">Fertilizer Subsidy</div>
                  <h4 className="text-xs font-extrabold text-gray-900">Urea & DAP Subsidy Budget Approved</h4>
                  <div className="text-[10px] text-gray-500 pt-0.5">Agri Ministry • 2 days ago</div>
                </div>
              </div>
            </div>

            <a
              href="https://pmkisan.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-900 transition"
            >
              <span>Read More Updates</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* CARD 2: KRISHI TIP OF THE DAY */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" /> Krishi Tip of the Day
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Today's Recommendation
                </span>
              </div>

              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/80 mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-extrabold text-amber-900 uppercase">
                  💡 Actionable Agronomy Tip
                </div>
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  "{currentTip}"
                </p>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 font-semibold pt-3 border-t border-gray-100">
              Rotates Daily • AI Agronomy Advisor Engine
            </div>
          </div>

          {/* CARD 3: ABOUT KRISHIMITRA */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> About KrishiMitra
                </h3>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  AI Companion
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <KrishiMitraLogo size={34} showText={true} />
                </div>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  "Your AI Farming Companion" — India's intelligent agricultural operating system powered by Google Gemini AI.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-gray-700 pt-1">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> AI Crop Doctor</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> AI Chat Assistant</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Voice Assistant</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Live Weather</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Live Mandi Prices</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Govt Schemes</div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 font-semibold pt-3 border-t border-gray-100">
              Version 1.0 • Built for Indian Agriculture
            </div>
          </div>

        </div>

        {/* 2. IMPORTANT FARMER RESOURCES SECTION (10 OFFICIAL GOVT LINKS) */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              🔗 Important Farmer Resources
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              10 Verified Government Portals
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {importantResources.map((res, idx) => {
              const IconComp = res.icon;
              return (
                <a
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md flex items-center justify-between gap-2 group ${res.color}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <IconComp className="w-4 h-4 shrink-0 text-emerald-700" />
                    <span className="font-extrabold text-xs truncate">{res.name}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 shrink-0 transition" />
                </a>
              );
            })}
          </div>
        </div>

        {/* THIN HORIZONTAL SEPARATOR */}
        <div className="border-t border-gray-200/80 my-2"></div>

        {/* 3. CLEAN COPYRIGHT FOOTER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
          <div>
            © 2026 <strong>KrishiMitra</strong> | Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Indian Farmers
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/" className="hover:text-emerald-700 transition">Privacy Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-emerald-700 transition">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/profile" className="hover:text-emerald-700 transition">Contact Us</Link>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Version 1.0</span>
          </div>
        </div>

      </div>

      {/* 4. SLIM SCROLLING LIVE AGRICULTURE NEWS TICKER BAR */}
      <div className="w-full bg-gray-900 text-white mt-6 overflow-hidden border-t border-gray-800">
        <div
          className="py-2 px-4 flex items-center gap-4 cursor-pointer"
          onMouseEnter={() => setTickerPaused(true)}
          onMouseLeave={() => setTickerPaused(false)}
        >
          <div className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> LIVE TICKER
          </div>

          <div className="overflow-hidden whitespace-nowrap w-full">
            <div
              className={`inline-block whitespace-nowrap transition-all duration-300 ${
                tickerPaused ? "" : "animate-marquee"
              }`}
              style={{
                animationDuration: "35s",
                animationTimingFunction: "linear",
                animationIterationCount: "infinite",
              }}
            >
              {tickerItems.concat(tickerItems).map((text, idx) => (
                <span key={idx} className="inline-block text-xs font-semibold text-gray-200 mx-6 hover:text-emerald-400 transition">
                  {text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}
