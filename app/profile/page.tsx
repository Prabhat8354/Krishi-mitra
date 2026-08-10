"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  MapPin, 
  Sprout, 
  Droplets, 
  Layers, 
  Save, 
  CheckCircle2, 
  ArrowLeft, 
  ShieldCheck,
  Bell,
  Globe,
  LogOut,
  Trash2,
  RotateCcw,
  Edit2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MitraMascot from "@/components/MitraMascot";

export default function ProfilePage() {
  const { profile, setProfile, setHasCompletedOnboarding, setLanguage } = useStore();
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || profile.name,
        email: user.email || profile.email,
        phone: user.phone || profile.phone,
        state: user.state || profile.state,
        district: user.district || profile.district,
        village: user.village || profile.village,
        farmSize: String(user.farmSize || profile.farmSize),
        landUnit: user.farmSizeUnit || profile.landUnit || "Acres",
        mainCrops: user.primaryCrop || profile.mainCrops,
        preferredLanguage: user.preferredLanguage || profile.preferredLanguage,
        soilType: profile.soilType || "Loamy Soil",
        irrigationType: profile.irrigationType || "Drip / Tube-well",
      });
    }
  }, [user, profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email.trim())) {
      alert("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.trim())) {
      alert("Please enter a valid 10-digit Indian phone number.");
      return;
    }

    setProfile(formData);

    await updateProfile({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      state: formData.state,
      district: formData.district,
      village: formData.village,
      farmSize: Number(formData.farmSize),
      farmSizeUnit: formData.landUnit,
      primaryCrop: formData.mainCrops,
      preferredLanguage: formData.preferredLanguage,
    });

    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReRunOnboarding = () => {
    if (confirm("Would you like to re-run the Krishi Mitra onboarding setup?")) {
      setHasCompletedOnboarding(false);
      setLanguage("");
      router.push("/");
    }
  };

  const handleLogout = () => {
    if (confirm("Log out of Krishi Mitra session?")) {
      setHasCompletedOnboarding(false);
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              Farmer Profile & Farm Memory Settings
            </h1>
            <p className="text-[11px] text-gray-500 font-medium">Synchronized into Mitra AI conversation memory</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {saved && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-in shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">Profile updated! Mitra AI will now tailor recommendations for {formData.mainCrops} in {formData.district}, {formData.state}.</span>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "F"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-gray-900">{formData.name || "Farmer Profile"}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Farmer
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Location: {formData.village || "Samrala"}, {formData.district || "Ludhiana"}, {formData.state || "Punjab"}
              </p>
              <div className="text-[11px] text-emerald-700 font-bold mt-1">
                Land: {formData.farmSize || "5"} {formData.landUnit || "Acres"} • Soil: {formData.soilType || "Loamy"}
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <MitraMascot mode="inline" />
          </div>
        </div>

        {/* Profile Form / View */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* SECTION 1: PERSONAL DETAILS */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b pb-3 border-gray-100">
              <User className="w-4 h-4 text-emerald-600" /> Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-500 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                ) : (
                  <div className="font-bold text-gray-900 bg-gray-50 p-2.5 rounded-xl border border-gray-100">{formData.name}</div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-500 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone || "9876543210"}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                ) : (
                  <div className="font-bold text-gray-900 bg-gray-50 p-2.5 rounded-xl border border-gray-100">{formData.phone || "9876543210"}</div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-500 mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200"
                  />
                ) : (
                  <div className="font-bold text-gray-900 bg-gray-50 p-2.5 rounded-xl border border-gray-100">{formData.email || "rajesh.farmer@gmail.com"}</div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: FARM & LAND DETAILS */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b pb-3 border-gray-100">
              <Sprout className="w-4 h-4 text-emerald-600" /> Farm & Crop Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-500 mb-1">Total Land Size</label>
                <div className="font-bold text-gray-900 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {formData.farmSize} {formData.landUnit || "Acres"}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-500 mb-1">Main Crops</label>
                <div className="font-bold text-gray-900 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {formData.mainCrops}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-500 mb-1">Soil Type</label>
                <div className="font-bold text-gray-900 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {formData.soilType}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-500 mb-1">Irrigation System</label>
                <div className="font-bold text-gray-900 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {formData.irrigationType}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-500 mb-1">Organic Farming</label>
                <div className="font-bold text-gray-900 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  {formData.isOrganic ? "Yes (Bio-pesticides)" : "Conventional"}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PREFERENCES & NOTIFICATION SETTINGS */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b pb-3 border-gray-100">
              <Bell className="w-4 h-4 text-emerald-600" /> Preferences & Alerts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/60 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Weather & Monsoon Alerts</span>
                <span className="text-xs font-bold text-emerald-600">Active</span>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/60 flex justify-between items-center">
                <span className="font-semibold text-gray-800">Mandi Price Spike Alerts</span>
                <span className="text-xs font-bold text-emerald-600">Active</span>
              </div>
            </div>
          </div>

          {/* SAVE BUTTON IF EDITING */}
          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Profile & AI Memory
              </button>
            </div>
          )}

        </form>

        {/* ACCOUNT ACTION BUTTONS */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Actions</h3>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleReRunOnboarding}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-emerald-600" /> Re-run Onboarding Setup
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4 text-amber-600" /> Sign Out Session
            </button>

            <button
              onClick={() => alert("Account data cleared.")}
              className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition flex items-center gap-2 ml-auto"
            >
              <Trash2 className="w-4 h-4 text-rose-600" /> Delete Farm Profile
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
