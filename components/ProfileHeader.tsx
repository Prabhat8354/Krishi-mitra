"use client";

import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Sun, Moon, Volume2, VolumeX, RefreshCw, LogOut, User, Edit, Bell, ChevronDown, LogIn, UserPlus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getLanguageByCode } from "@/lib/languages";
import { useAuth } from "@/context/AuthContext";
import AudioButton from "./ui/AudioButton";
import NotificationDrawer from "./NotificationDrawer";
import KrishiMitraLogo from "./KrishiMitraLogo";
import LoginModal from "./Auth/LoginModal";
import RegisterModal from "./Auth/RegisterModal";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ProfileHeader = React.memo(function ProfileHeader() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  
  const currentLanguage = useStore((state) => state.currentLanguage);
  const audioEnabled = useStore((state) => state.audioEnabled);
  const profile = useStore((state) => state.profile);
  const setSessionId = useStore((state) => state.setSessionId);
  const setLanguage = useStore((state) => state.setLanguage);
  const setAudioEnabled = useStore((state) => state.setAudioEnabled);

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  // Memoize localized greeting string dynamically based on target language
  const greeting = useMemo(() => {
    const langObj = getLanguageByCode(currentLanguage);
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return langObj.greetings.morning;
    if (hour >= 12 && hour < 17) return langObj.greetings.afternoon;
    return langObj.greetings.evening;
  }, [currentLanguage]);

  const isDaytime = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 18;
  }, []);

  const farmerFirstName = useMemo(() => {
    if (user?.name) return user.name.split(" ")[0];
    return profile.name ? profile.name.split(" ")[0] : "Farmer";
  }, [user, profile.name]);

  const generateNewUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const handleNewSession = () => {
    if (confirm(t("newSessionConfirm") || "Start new chat session?")) {
      const newId = generateNewUUID();
      setSessionId(newId);
      localStorage.removeItem("farmer-chat-messages");
      window.location.href = "/";
    }
  };

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    if (confirm("Are you sure you want to log out?")) {
      await authLogout();
      useStore.getState().logout();
      window.location.href = "/login";
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-emerald-900/5 bg-white/85 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          
          {/* Official Krishi Mitra Logo & Stable Greeting */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center group">
              <KrishiMitraLogo size={38} showText={true} />
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>

            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200/60">
              {isDaytime ? (
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
              )}
              <span>{greeting}, {farmerFirstName}</span>
              <AudioButton text={`${greeting}, ${farmerFirstName}`} className="ml-1 text-gray-400 hover:text-gray-700" />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Notification Drawer */}
            <NotificationDrawer />

            {/* Voice Audio Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                audioEnabled
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
              <span className="hidden md:inline">{audioEnabled ? t("audioOn") : t("audioOff")}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <select
                value={currentLanguage || "hi-IN"}
                onChange={(e) => {
                  const langCode = e.target.value;
                  setLanguage(langCode);
                  i18n.changeLanguage(langCode);
                }}
                className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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

            {/* AUTH BUTTONS OR PROFILE DROPDOWN */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-full border border-gray-200 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-600" /> Login
                </button>
                <button
                  onClick={() => setRegisterModalOpen(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Register
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1.5 pl-2.5 pr-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition text-xs font-bold cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "F"}
                  </div>
                  <span className="hidden md:inline">{farmerFirstName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-700" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-200/80 py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-bold text-xs text-gray-900">{user?.name || profile.name || "Farmer"}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{user?.district || profile.district || "Ludhiana"}, {user?.state || profile.state || "Punjab"}</div>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                    >
                      <User className="w-4 h-4 text-emerald-600" /> My Profile
                    </Link>

                    <Link
                      href="/alerts"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 transition"
                    >
                      <Bell className="w-4 h-4 text-amber-600" /> Notification Settings
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </header>

      {/* LOGIN & REGISTER MODALS */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
    </>
  );
});

export default ProfileHeader;
