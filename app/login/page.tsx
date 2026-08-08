"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  Phone, 
  User, 
  MapPin, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CloudRain, 
  TrendingUp, 
  Mic, 
  Sprout, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Globe,
  Sun,
  Moon,
  Calendar,
  Compass,
  Layers,
  Droplets,
  Award
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStore } from "@/store/useStore";
import { useTranslation } from "react-i18next";
import { getLanguageByCode } from "@/lib/languages";
import KrishiMitraLogo from "@/components/KrishiMitraLogo";
import InteractiveMascot from "@/components/InteractiveMascot";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, loading: authLoading } = useAuth();
  const { currentLanguage, setLanguage } = useStore();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  useEffect(() => {
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    if (!isDemoMode && !authLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [registerStep, setRegisterStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Login Form State (EMPTY INITIAL VALUES - NO PRE-FILLED DUMMY DATA)
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Complete Registration Form State (EMPTY INITIAL VALUES - NO HARDCODED DUMMY DATA)
  const [regForm, setRegForm] = useState({
    // Step 1: Personal & Credentials
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "Male",
    dob: "",

    // Step 2: Location & GPS
    state: "",
    district: "",
    village: "",
    address: "",
    pincode: "",
    gpsLocation: { lat: 30.9010, lon: 75.8573 },

    // Step 3: Farming Profile & Telemetry
    farmSize: "",
    farmSizeUnit: "Acres",
    primaryCrop: "",
    soilType: "Loamy Soil",
    irrigationSource: "Borewell / Tube-well",
    experience: "5-10 Years",

    // Step 4: Preferences & Avatar
    preferredLanguage: currentLanguage || "hi-IN",
    voiceLanguage: currentLanguage || "hi-IN",
    profilePhoto: "",
    acceptTerms: false,
  });

  // Time-based welcome greeting
  const greetingData = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { key: "goodMorning", sub: "Ready for today's farming insights?", icon: "☀️" };
    } else if (hour >= 12 && hour < 17) {
      return { key: "goodAfternoon", sub: "Let's check your crop telemetry!", icon: "🌤️" };
    } else {
      return { key: "goodEvening", sub: "Happy Farming & Welcome Back!", icon: "🌙" };
    }
  }, []);

  // GPS Reverse Geocoding Handler
  const handleFetchGPS = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      return;
    }

    setGpsLoading(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        setRegForm((prev) => ({
          ...prev,
          gpsLocation: { lat, lon },
        }));

        try {
          // Reverse geocode via OpenStreetMap Nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();

          if (data && data.address) {
            const state = data.address.state || data.address.region || "Punjab";
            const district = data.address.state_district || data.address.county || data.address.city || "Ludhiana";
            const village = data.address.village || data.address.town || data.address.suburb || "Samrala";

            setRegForm((prev) => ({
              ...prev,
              state,
              district,
              village,
              address: data.display_name || "",
              pincode: data.address.postcode || "",
            }));
          }
        } catch (e) {
          console.warn("Reverse geocoding warning:", e);
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        setErrorMsg("Unable to fetch GPS position. Please enter location manually.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmailOrPhone.trim() || !loginPassword) {
      setErrorMsg("Please enter your Email/Phone and Password.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await login(loginEmailOrPhone, loginPassword);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setErrorMsg(res.error || "Authentication failed. Please check credentials.");
    }
  };

  const handleNextStep = () => {
    setErrorMsg(null);

    // Validation for Step 1
    if (registerStep === 1) {
      if (!regForm.name.trim() || !regForm.email.trim() || !regForm.phone.trim() || !regForm.password) {
        setErrorMsg("Please fill in all required fields (Name, Email, Phone, Password).");
        return;
      }
      if (regForm.password.length < 6) {
        setErrorMsg("Password must be at least 6 characters long.");
        return;
      }
      if (regForm.password !== regForm.confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    }

    // Validation for Step 2
    if (registerStep === 2) {
      if (!regForm.state.trim() || !regForm.district.trim() || !regForm.village.trim()) {
        setErrorMsg("Please provide your State, District, and Village.");
        return;
      }
    }

    // Validation for Step 3
    if (registerStep === 3) {
      if (!regForm.farmSize.trim() || !regForm.primaryCrop.trim()) {
        setErrorMsg("Please provide your farm size and primary crops.");
        return;
      }
    }

    setRegisterStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setErrorMsg(null);
    setRegisterStep((prev) => Math.max(prev - 1, 1));
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.acceptTerms) {
      setErrorMsg("Please accept the Terms & Conditions to complete registration.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await register(regForm);
    setLoading(false);

    if (res.success) {
      router.push("/dashboard");
    } else {
      setErrorMsg(res.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FCF8] text-[#111827] flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500/20">
      
      {/* 1. BACKGROUND FARMING LIGHT WAVES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
      </div>

      {/* 2. TOP LANGUAGE SELECTOR BAR */}
      <div className="relative z-20 max-w-[1400px] w-full mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <KrishiMitraLogo size={42} showText={true} />
        </Link>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={currentLanguage || "hi-IN"}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-emerald-900 text-xs font-extrabold border border-emerald-200 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="en-IN">🇬🇧 English</option>
              <option value="hi-IN">🇮🇳 हिन्दी (Hindi)</option>
              <option value="pa-IN">🇮🇳 ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="mr-IN">🇮🇳 मराठी (Marathi)</option>
              <option value="gu-IN">🇮🇳 ગુજરાતી (Gujarati)</option>
              <option value="bn-IN">🇮🇳 বাংলা (Bengali)</option>
              <option value="ta-IN">🇮🇳 தமிழ் (Tamil)</option>
              <option value="te-IN">🇮🇳 తెలుగు (Telugu)</option>
              <option value="kn-IN">🇮🇳 ಕನ್ನಡ (Kannada)</option>
              <option value="ml-IN">🇮🇳 മലയാളം (Malayalam)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. MAIN 2-COLUMN RESPONSIVE LAYOUT */}
      <main className="relative z-10 max-w-[1400px] w-full mx-auto px-4 md:px-8 py-4 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 w-full items-center">
          
          {/* LEFT COLUMN (55% ON DESKTOP) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* TIME GREETING BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold shadow-2xs">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>{t(greetingData.key)} {greetingData.icon} — {greetingData.sub}</span>
            </div>

            {/* HERO HEADING & SUBTITLE */}
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                {currentLanguage && currentLanguage !== 'en-IN' ? (
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">{t('welcomeTo')}</span>
                ) : (
                  <>
                    {t('welcomeTo')} <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent">KrishiMitra</span>
                  </>
                )}
              </h1>
              <p className="text-base md:text-lg text-gray-600 font-medium max-w-xl mx-auto lg:mx-0">
                {t('farmingCompanionSubtitle')}
              </p>
            </div>

            {/* 4 FLOATING FEATURE BADGES */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2">
              <div className="px-3.5 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-emerald-100 shadow-2xs text-xs font-bold text-gray-800 flex items-center gap-2 hover:scale-105 transition-transform">
                <Sprout className="w-4 h-4 text-emerald-600" /> {t('cropDoctor')}
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-sky-100 shadow-2xs text-xs font-bold text-gray-800 flex items-center gap-2 hover:scale-105 transition-transform">
                <CloudRain className="w-4 h-4 text-sky-600" /> {t('weatherDashboard')}
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-amber-100 shadow-2xs text-xs font-bold text-gray-800 flex items-center gap-2 hover:scale-105 transition-transform">
                <TrendingUp className="w-4 h-4 text-amber-600" /> {t('mandiMarketRates')}
              </div>
              <div className="px-3.5 py-2 rounded-2xl bg-white/80 backdrop-blur-md border border-purple-100 shadow-2xs text-xs font-bold text-gray-800 flex items-center gap-2 hover:scale-105 transition-transform">
                <Mic className="w-4 h-4 text-purple-600" /> {t('voiceAssistant')}
              </div>
            </div>

            {/* 300px INTERACTIVE AI MASCOT WITH EYE TRACKING */}
            <div className="pt-4 flex justify-center lg:justify-start">
              <InteractiveMascot size={300} />
            </div>

          </div>

          {/* RIGHT COLUMN (45% ON DESKTOP) - GLASSMORPHISM AUTH CARD */}
          <div className="lg:col-span-5">
            <div className="bg-white/90 backdrop-blur-2xl rounded-[28px] border border-white/80 shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
              
              {/* TAB SELECTOR */}
              <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => { setActiveTab("login"); setErrorMsg(null); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === "login"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <LogIn className="w-4 h-4" /> {t('login')}
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("register"); setErrorMsg(null); }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === "register"
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <UserPlus className="w-4 h-4" /> {t('createAccount')}
                </button>
              </div>

              {/* ERROR ALERT BANNER */}
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold animate-in fade-in">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* LOGIN TAB CONTENT */}
              {activeTab === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">{t('emailOrPhone')}</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={loginEmailOrPhone}
                        onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                        placeholder={t('enterEmailOrPhone')}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">{t('password')}</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-600 font-semibold">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      {t('rememberMe')}
                    </label>
                    <a href="#" className="font-bold text-emerald-700 hover:underline">{t('forgotPassword')}</a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                    {t('loginToDashboard')}
                  </button>

                  <div className="relative py-2 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <span className="relative bg-white px-3 text-[11px] font-bold text-gray-400 uppercase">OR</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-2xl border border-gray-200 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {t('continueAsGuest')}
                  </button>
                </form>
              ) : (
                /* RESTORED PROFESSIONAL 4-STEP CREATE ACCOUNT FORM */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  {/* STEP WIZARD PROGRESS BAR */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-emerald-800">
                      <span>
                        {registerStep === 1 && "Step 1 of 4: Account Credentials"}
                        {registerStep === 2 && "Step 2 of 4: Location & GPS"}
                        {registerStep === 3 && "Step 3 of 4: Farm & Crop Telemetry"}
                        {registerStep === 4 && "Step 4 of 4: Review & Finalize"}
                      </span>
                      <span>{registerStep * 25}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div
                        style={{ width: `${registerStep * 25}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-300"
                      ></div>
                    </div>
                  </div>

                  {/* STEP 1: PERSONAL & CREDENTIALS */}
                  {registerStep === 1 && (
                    <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={regForm.name}
                          onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                          placeholder="e.g. Rajesh Kumar"
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Email Address *</label>
                          <input
                            type="email"
                            value={regForm.email}
                            onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                            placeholder="rajesh@example.com"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            value={regForm.phone}
                            onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                            placeholder="9876543210"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Password *</label>
                          <input
                            type="password"
                            value={regForm.password}
                            onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Confirm Password *</label>
                          <input
                            type="password"
                            value={regForm.confirmPassword}
                            onChange={(e) => setRegForm({ ...regForm, confirmPassword: e.target.value })}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Gender</label>
                          <select
                            value={regForm.gender}
                            onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Date of Birth</label>
                          <input
                            type="date"
                            value={regForm.dob}
                            onChange={(e) => setRegForm({ ...regForm, dob: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: LOCATION & LIVE GPS */}
                  {registerStep === 2 && (
                    <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
                      
                      {/* LIVE GPS BUTTON */}
                      <button
                        type="button"
                        onClick={handleFetchGPS}
                        disabled={gpsLoading}
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4 text-emerald-600" />}
                        {gpsLoading ? "Detecting Live GPS Position..." : "📍 Use Current Location (Auto-Detect GPS)"}
                      </button>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">State *</label>
                          <input
                            type="text"
                            value={regForm.state}
                            onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                            placeholder="Punjab"
                            className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">District *</label>
                          <input
                            type="text"
                            value={regForm.district}
                            onChange={(e) => setRegForm({ ...regForm, district: e.target.value })}
                            placeholder="Ludhiana"
                            className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Village *</label>
                          <input
                            type="text"
                            value={regForm.village}
                            onChange={(e) => setRegForm({ ...regForm, village: e.target.value })}
                            placeholder="Samrala"
                            className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Complete Address</label>
                        <input
                          type="text"
                          value={regForm.address}
                          onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                          placeholder="House No., Street, Landmark"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">PIN Code</label>
                        <input
                          type="text"
                          value={regForm.pincode}
                          onChange={(e) => setRegForm({ ...regForm, pincode: e.target.value })}
                          placeholder="141114"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 3: FARMING PROFILE & TELEMETRY */}
                  {registerStep === 3 && (
                    <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="text-xs font-bold text-gray-700 block mb-1">Farm Area *</label>
                          <input
                            type="number"
                            value={regForm.farmSize}
                            onChange={(e) => setRegForm({ ...regForm, farmSize: e.target.value })}
                            placeholder="e.g. 5"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Unit</label>
                          <select
                            value={regForm.farmSizeUnit}
                            onChange={(e) => setRegForm({ ...regForm, farmSizeUnit: e.target.value })}
                            className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          >
                            <option value="Acres">Acres</option>
                            <option value="Hectares">Hectares</option>
                            <option value="Bigha">Bigha</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Primary Crops *</label>
                        <input
                          type="text"
                          value={regForm.primaryCrop}
                          onChange={(e) => setRegForm({ ...regForm, primaryCrop: e.target.value })}
                          placeholder="Wheat, Rice, Cotton, Tomato"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Soil Type</label>
                          <select
                            value={regForm.soilType}
                            onChange={(e) => setRegForm({ ...regForm, soilType: e.target.value })}
                            className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          >
                            <option value="Alluvial / Loamy">Alluvial / Loamy</option>
                            <option value="Clay Soil">Clay Soil</option>
                            <option value="Sandy Soil">Sandy Soil</option>
                            <option value="Black Cotton Soil">Black Cotton Soil</option>
                            <option value="Red Soil">Red Soil</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-gray-700 block mb-1">Irrigation Source</label>
                          <select
                            value={regForm.irrigationSource}
                            onChange={(e) => setRegForm({ ...regForm, irrigationSource: e.target.value })}
                            className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                          >
                            <option value="Canal / River">Canal / River</option>
                            <option value="Borewell / Tube-well">Borewell / Tube-well</option>
                            <option value="Rainfed">Rainfed</option>
                            <option value="Drip / Sprinkler">Drip / Sprinkler</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Farming Experience</label>
                        <select
                          value={regForm.experience}
                          onChange={(e) => setRegForm({ ...regForm, experience: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                        >
                          <option value="1-3 Years">1-3 Years</option>
                          <option value="3-5 Years">3-5 Years</option>
                          <option value="5-10 Years">5-10 Years</option>
                          <option value="10+ Years">10+ Years</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: PREFERENCES & FINAL REVIEW */}
                  {registerStep === 4 && (
                    <div className="space-y-3.5 max-h-[55vh] overflow-y-auto pr-1">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Preferred AI Language</label>
                        <select
                          value={regForm.preferredLanguage}
                          onChange={(e) => setRegForm({ ...regForm, preferredLanguage: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                        >
                          <option value="en-IN">🇬🇧 English</option>
                          <option value="hi-IN">🇮🇳 हिन्दी (Hindi)</option>
                          <option value="pa-IN">🇮🇳 ਪੰਜਾਬੀ (Punjabi)</option>
                          <option value="mr-IN">🇮🇳 मराठी (Marathi)</option>
                          <option value="gu-IN">🇮🇳 ગુજરાતી (Gujarati)</option>
                          <option value="bn-IN">🇮🇳 বাংলা (Bengali)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Profile Photo URL (Optional)</label>
                        <input
                          type="text"
                          value={regForm.profilePhoto}
                          onChange={(e) => setRegForm({ ...regForm, profilePhoto: e.target.value })}
                          placeholder="https://example.com/avatar.jpg"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      {/* SUMMARY PREVIEW */}
                      <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                        <div className="font-extrabold text-emerald-900">📋 Registration Summary:</div>
                        <div className="text-gray-700"><strong>Name:</strong> {regForm.name || "N/A"}</div>
                        <div className="text-gray-700"><strong>Location:</strong> {regForm.village}, {regForm.district}, {regForm.state}</div>
                        <div className="text-gray-700"><strong>Land & Crops:</strong> {regForm.farmSize} {regForm.farmSizeUnit} ({regForm.primaryCrop})</div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 pt-1">
                        <input
                          type="checkbox"
                          checked={regForm.acceptTerms}
                          onChange={(e) => setRegForm({ ...regForm, acceptTerms: e.target.checked })}
                          className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        I agree to KrishiMitra Terms of Service & Privacy Policy.
                      </label>
                    </div>
                  )}

                  {/* STEP NAVIGATION BUTTONS */}
                  <div className="flex items-center justify-between gap-3 pt-2">
                    {registerStep > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>
                    )}

                    {registerStep < 4 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        Next Step <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        Save to MongoDB & Launch Dashboard
                      </button>
                    )}
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* 4. MINIMAL FOOTER */}
      <footer className="relative z-10 py-4 text-center text-xs font-semibold text-gray-500 border-t border-gray-200/60 bg-white/60 backdrop-blur-md">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="#" className="hover:text-emerald-700 transition">Privacy Policy</a>
          <span>•</span>
          <a href="#" className="hover:text-emerald-700 transition">Terms & Conditions</a>
          <span>•</span>
          <a href="#" className="hover:text-emerald-700 transition">Help Center</a>
          <span>•</span>
          <a href="#" className="hover:text-emerald-700 transition">Contact Us</a>
          <span>•</span>
          <span>Version 1.0</span>
        </div>
      </footer>

    </div>
  );
}
