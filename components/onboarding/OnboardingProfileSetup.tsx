"use client";

import React, { useState } from "react";
import { useStore } from "@/store/useStore";
import { 
  User, 
  MapPin, 
  Sprout, 
  Droplets, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Compass,
  Bell,
  Leaf,
  Loader2
} from "lucide-react";
import KrishiMitraLogo from "../KrishiMitraLogo";
import MitraMascot from "../MitraMascot";
import { reverseGeocodeLocation } from "@/actions/gemini-chat";

interface Props {
  onComplete: () => void;
}

export default function OnboardingProfileSetup({ onComplete }: Props) {
  const { profile, setProfile, setLocation, setHasCompletedOnboarding } = useStore();
  const [step, setStep] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: profile.name || "Rajesh Kumar",
    age: "38",
    gender: "Male",
    phone: "9876543210",
    email: "",
    state: profile.state || "Punjab",
    district: profile.district || "Ludhiana",
    village: profile.village || "Samrala",
    pinCode: "141114",
    farmSize: profile.farmSize || "5",
    landUnit: "Acres",
    soilType: profile.soilType || "Loamy",
    mainCrops: profile.mainCrops || "Wheat, Rice, Tomato",
    secondaryCrops: "Potato, Mustard",
    irrigationType: profile.irrigationType || "Drip Irrigation",
    preferredLanguage: profile.preferredLanguage || "hi-IN",
    isOrganic: true,
    weatherAlerts: true,
    priceAlerts: true,
    schemeAlerts: true,
  });

  const handleNextStep = () => {
    setValidationError(null);

    // Mandatory Field Validation Rules
    if (step === 1) {
      if (!formData.name.trim()) {
        setValidationError("⚠️ Full Name is required.");
        return;
      }
      if (!formData.phone.trim()) {
        setValidationError("⚠️ Mobile Number is required.");
        return;
      }
    }

    if (step === 2) {
      if (!formData.state.trim() || !formData.district.trim() || !formData.village.trim()) {
        setValidationError("⚠️ State, District, and Village are required location fields.");
        return;
      }
    }

    if (step === 3) {
      if (!formData.farmSize.trim()) {
        setValidationError("⚠️ Total Farm Size is required.");
        return;
      }
      if (!formData.mainCrops.trim()) {
        setValidationError("⚠️ Primary Crop is required.");
        return;
      }
    }

    if (step < 5) {
      setStep(step + 1);
    } else {
      setProfile(formData);
      setHasCompletedOnboarding(true);
      onComplete();
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    if (step > 1) setStep(step - 1);
  };

  // Browser Geolocation & Reverse Geocoding Implementation
  const handleGPSLocation = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationMessage("Browser geolocation is not supported on this device.");
      return;
    }

    setIsLocating(true);
    setLocationMessage("Detecting GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lon = pos.coords.longitude.toFixed(4);

        setLocation(lat, lon);

        // Reverse geocode via server action
        const geoRes = await reverseGeocodeLocation(lat, lon);
        setIsLocating(false);

        if (geoRes.success && geoRes.data) {
          const { village, district, state, pinCode } = geoRes.data;
          setFormData((prev) => ({
            ...prev,
            state: state || prev.state,
            district: district || prev.district,
            village: village || prev.village,
            pinCode: pinCode || prev.pinCode,
          }));
          setLocationMessage("Location updated successfully.");
        } else {
          setLocationMessage("Location detected! Please verify your district.");
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationMessage("Location permission was denied. Please enter it manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationMessage("Unable to detect your location. Please enter it manually.");
            break;
          case error.TIMEOUT:
            setLocationMessage("GPS location detection timed out. Please enter manually.");
            break;
          default:
            setLocationMessage("Unable to detect your location. Please enter it manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] flex flex-col justify-between p-4 md:p-8 animate-in fade-in duration-300">
      
      {/* Top Bar */}
      <div className="max-w-2xl mx-auto w-full flex justify-between items-center py-4">
        <KrishiMitraLogo size={36} showText={true} />
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Step {step} of 5
        </span>
      </div>

      {/* Main Form Container */}
      <div className="max-w-2xl mx-auto w-full my-auto space-y-6">
        
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Let's know your farm better 🌱
          </h1>
          <p className="text-xs text-gray-500 font-medium">
            This helps Mitra give personalized agricultural recommendations.
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s <= step ? "bg-emerald-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="bg-white rounded-[24px] p-6 md:p-8 border border-gray-200/80 shadow-lg space-y-6">
          
          {validationError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs flex items-center gap-2 animate-fade-in">
              <span>{validationError}</span>
            </div>
          )}
          
          {/* STEP 1: PERSONAL INFORMATION */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3 border-gray-100">
                <User className="w-4 h-4 text-emerald-600" /> Step 1: Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Age (optional)</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Gender (optional)</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex justify-between items-center border-b pb-3 border-gray-100">
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Step 2: Location Details
                </h2>
                <button
                  type="button"
                  onClick={handleGPSLocation}
                  disabled={isLocating}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" /> : <Compass className="w-3.5 h-3.5 text-emerald-600" />}
                  Allow Current Location
                </button>
              </div>

              {locationMessage && (
                <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  locationMessage.includes("successfully") 
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}>
                  {locationMessage.includes("successfully") ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <MapPin className="w-4 h-4 text-amber-600" />}
                  <span>{locationMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FARM DETAILS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3 border-gray-100">
                <Sprout className="w-4 h-4 text-emerald-600" /> Step 3: Farm & Crop Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Total Land Area</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.farmSize}
                      onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500"
                    />
                    <select
                      value={formData.landUnit}
                      onChange={(e) => setFormData({ ...formData, landUnit: e.target.value })}
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-gray-50 font-bold"
                    >
                      <option value="Acres">Acres</option>
                      <option value="Hectares">Hectares</option>
                      <option value="Bigha">Bigha</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Soil Type</label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Black Cotton Soil">Black</option>
                    <option value="Red & Yellow Soil">Red</option>
                    <option value="Loamy / Alluvial Soil">Loamy</option>
                    <option value="Clay Soil">Clay</option>
                    <option value="Sandy Soil">Sandy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Main Crop</label>
                  <input
                    type="text"
                    value={formData.mainCrops}
                    onChange={(e) => setFormData({ ...formData, mainCrops: e.target.value })}
                    placeholder="e.g. Wheat, Rice"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Water Source / Irrigation</label>
                  <select
                    value={formData.irrigationType}
                    onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Canal Irrigation">Canal</option>
                    <option value="Rainfed (Monsoon)">Rain</option>
                    <option value="Tube Well / Borewell">Borewell</option>
                    <option value="River Water">River</option>
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Sprinkler System">Sprinkler</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: PREFERENCES */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-3 border-gray-100">
                <Bell className="w-4 h-4 text-emerald-600" /> Step 4: Alert & Farming Preferences
              </h2>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    <Leaf className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-gray-900">Organic Farming Practice</div>
                      <div className="text-[10px] text-gray-500">Prioritize bio-fungicides and natural composts</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isOrganic}
                    onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-gray-900">Weather & Rain Alerts</div>
                    <div className="text-[10px] text-gray-500">Get monsoon warnings and humidity advisories</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.weatherAlerts}
                    onChange={(e) => setFormData({ ...formData, weatherAlerts: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 cursor-pointer">
                  <div>
                    <div className="text-xs font-bold text-gray-900">Mandi Price Spike Alerts</div>
                    <div className="text-[10px] text-gray-500">Notifications when local crop prices surge</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.priceAlerts}
                    onChange={(e) => setFormData({ ...formData, priceAlerts: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: FINISH SCREEN */}
          {step === 5 && (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <MitraMascot mode="inline" />
              <div>
                <h2 className="text-2xl font-black text-gray-900">Great! Your farm profile is ready 🌱</h2>
                <p className="text-xs text-gray-600 font-medium max-w-md mx-auto mt-1">
                  I'll now personalize all recommendations, disease treatments, and mandi alerts specifically for your farm in <strong>{formData.district}, {formData.state}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            {step > 1 && step < 5 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <span>{step === 5 ? "Go to Dashboard" : "Next Step"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      <div className="text-center text-[11px] text-gray-400 font-medium py-2">
        Krishi Mitra • Personalized Farm Intelligence
      </div>
    </div>
  );
}
