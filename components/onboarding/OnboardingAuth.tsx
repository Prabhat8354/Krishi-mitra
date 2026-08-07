"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { ArrowRight, Phone, Lock, User, ShieldCheck } from "lucide-react";
import KrishiMitraLogo from "../KrishiMitraLogo";

interface Props {
  onNext: (isNewUser: boolean) => void;
}

export default function OnboardingAuth({ onNext }: Props) {
  const { setProfile, profile, login } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);

  // Form fields
  const [name, setName] = useState(profile.name || "Rajesh Kumar");
  const [identifier, setIdentifier] = useState("9876543210");
  const [password, setPassword] = useState("••••••••");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      // Create Account MUST complete farmer profile setup before reaching Dashboard
      login("km-signup-token-" + Date.now(), false);
      if (name) setProfile({ name, phone: identifier });
      onNext(true);
    } else {
      // Sign In checks if profile is complete
      login("km-signin-token-" + Date.now(), true);
      setProfile({ name: name || "Rajesh Kumar" });
      onNext(false);
    }
  };

  const handleGuestLogin = () => {
    login("km-guest-token-" + Date.now(), false);
    setProfile({ name: "Rajesh Kumar" });
    onNext(true);
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAF7] text-[#111827] flex overflow-hidden font-sans">
      
      {/* -------------------------------------------------------
          LEFT SIDE (60% Desktop / 55% Tablet / Hidden on Mobile)
          Reserved for future custom animated AI character
         ------------------------------------------------------- */}
      <div className="hidden lg:flex w-[60%] xl:w-[60%] lg:w-[55%] min-h-screen bg-gradient-to-br from-[#F8FAF7] via-[#F3F7F2] to-[#EBF3EA] relative items-center justify-center p-8 animate-in fade-in duration-600">
        
        {/* Subtle Watermark Agriculture Motifs (3-5% Opacity) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Empty Centered Canvas for AI Mascot Character */}
        <div className="relative z-10 w-full max-w-lg h-[500px] flex items-center justify-center pointer-events-none">
          {/* Reserved for future custom animated AI character */}
        </div>
      </div>

      {/* -------------------------------------------------------
          RIGHT SIDE (40% Desktop / 45% Tablet / 100% Mobile)
          Login Form Panel (Vertically & Horizontally Centered)
         ------------------------------------------------------- */}
      <div className="w-full lg:w-[40%] xl:w-[40%] lg:w-[45%] min-h-screen bg-white flex flex-col justify-center items-center p-6 md:p-12 border-l border-gray-200/60 shadow-2xl animate-in slide-in-from-right duration-600">
        
        {/* Login Card Container (Max Width 420px, Padding 48px) */}
        <div className="w-full max-w-[420px] p-8 md:p-12 space-y-6">
          
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <KrishiMitraLogo size={34} showText={false} />
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                Krishi Mitra Portal
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-xs text-gray-500 font-medium">
              {isSignUp ? "Sign up to personalize your farm advisory" : "Please enter your credentials to log in"}
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                !isSignUp ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                isSignUp ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Login / Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" /> Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Singh"
                  required
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-xs text-gray-900 bg-gray-50/50"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-600" /> Username / Phone
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter phone or username"
                required
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-xs text-gray-900 bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 text-xs text-gray-900 bg-gray-50/50"
              />
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Remember me
                </label>
                <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700">
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSignUp ? "Create Account" : "Sign In"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="shrink mx-4 text-[10px] font-bold text-gray-400 uppercase">Or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Social / Guest Logins */}
          <div className="space-y-2">
            <button
              onClick={handleGuestLogin}
              className="w-full py-3 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google Sign In
            </button>

            <button
              onClick={handleGuestLogin}
              className="w-full py-3 px-3 rounded-xl bg-emerald-50 border border-emerald-200/80 hover:bg-emerald-100 text-xs font-bold text-emerald-800 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Continue as Guest
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
