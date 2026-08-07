"use client";

import React, { useEffect } from "react";
import { X, CheckCircle2, AlertTriangle, Info, Clock, MapPin, Droplets, Wind, Sprout, ShieldAlert, Sparkles, ShieldCheck } from "lucide-react";

export interface AdvisoryItem {
  id: string;
  title: string;
  icon: any;
  iconBg: string;
  recommendation: string;
  status: string;
  statusColor: string;
  badgeText: string;
}

interface ModalProps {
  advisory: AdvisoryItem | null;
  onClose: () => void;
  locationName?: string;
  weatherTelemetry?: { temp: number; humidity: number; rainChance: number; windSpeed: number };
}

export default function AdvisoryDetailsModal({ advisory, onClose, locationName, weatherTelemetry }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!advisory) return null;

  const IconComp = advisory.icon;
  const temp = weatherTelemetry?.temp ?? 32;
  const humidity = weatherTelemetry?.humidity ?? 78;
  const rain = weatherTelemetry?.rainChance ?? 65;
  const wind = weatherTelemetry?.windSpeed ?? 18;

  // Render dynamic detailed agronomy content based on advisory.id
  const renderDetailsContent = () => {
    switch (advisory.id) {
      case "irrigation":
        return (
          <div className="space-y-4 text-xs font-medium">
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Current Recommendation & Rationale
              </h4>
              <p>
                Rain probability is {rain}% in {locationName || "your location"}. Hold off on drip or tube-well irrigation to avoid field waterlogging, root rotting, and nutrient leaching.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Rainfall Probability</div>
                <div className="text-sm font-extrabold text-gray-900">{rain}%</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Soil Moisture Status</div>
                <div className="text-sm font-extrabold text-gray-900">{humidity}% (High Moisture)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Best Irrigation Timing</div>
                <div className="text-sm font-extrabold text-emerald-700">Early Morning Post-Rain</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Next Update Schedule</div>
                <div className="text-sm font-extrabold text-gray-900">10:00 AM Tomorrow</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <h5 className="font-extrabold text-emerald-900">💡 Water-Saving & Conservation Tips</h5>
              <ul className="list-disc list-inside text-emerald-800 space-y-1">
                <li>Clear bunds and field drainage channels to direct excess rainwater to farm ponds.</li>
                <li>Utilize rainwater harvesting before scheduling artificial tube-well pumps.</li>
              </ul>
            </div>
          </div>
        );

      case "spraying":
        return (
          <div className="space-y-4 text-xs font-medium">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 space-y-1">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" /> Spraying Recommendation
              </h4>
              <p>
                Wind speed is {wind} km/h with humidity at {humidity}%. Chemical pesticide spraying is NOT recommended today as wind will cause spray drift and rain will wash away chemical active ingredients.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Wind Speed</div>
                <div className="text-sm font-extrabold text-gray-900">{wind} km/h</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Atmospheric Humidity</div>
                <div className="text-sm font-extrabold text-gray-900">{humidity}%</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Safe Spraying Window</div>
                <div className="text-sm font-extrabold text-emerald-700">Day 3 (6:00 AM - 8:30 AM)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Recommended Formulation</div>
                <div className="text-sm font-extrabold text-gray-900">Neem Oil (10,000 ppm) / Bio-Fungicide</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1 text-gray-800">
              <h5 className="font-extrabold">⚠️ Safety & Environmental Precautions</h5>
              <p>Always wear face masks, gloves, and protective gear when handling bio-pesticides. Spray downwind to avoid inhalation.</p>
            </div>
          </div>
        );

      case "harvest":
        return (
          <div className="space-y-4 text-xs font-medium">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Harvest Readiness & Planning
              </h4>
              <p>
                Dry sunny spell predicted in 3 days. Wheat & Paddy crops approaching 90% maturity are suitable for combined harvester harvesting.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Harvest Readiness</div>
                <div className="text-sm font-extrabold text-emerald-700">90% Mature (Optimal)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Best Harvesting Day</div>
                <div className="text-sm font-extrabold text-gray-900">Day 3 (Thursday)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Grain Drying Target</div>
                <div className="text-sm font-extrabold text-gray-900">&lt; 12% Moisture Content</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Weather Outlook</div>
                <div className="text-sm font-extrabold text-gray-900">Clear Dry Skies</div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1 text-amber-900">
              <h5 className="font-extrabold">📦 Post-Harvest Storage Precautions</h5>
              <p>Ensure harvested grain is sun-dried on clean tarpaulins before bagging in moisture-proof gunny bags to prevent mold storage decay.</p>
            </div>
          </div>
        );

      case "disease":
        return (
          <div className="space-y-4 text-xs font-medium">
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 space-y-1">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" /> Disease Threat Analysis
              </h4>
              <p>
                Atmospheric humidity at {humidity}% creates high risk for Late Blight in Tomato/Potato and Yellow Rust in Wheat.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Risk Level & Score</div>
                <div className="text-sm font-extrabold text-rose-600">High Risk (8.5 / 10)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Susceptible Crops</div>
                <div className="text-sm font-extrabold text-gray-900">Tomato, Potato, Wheat</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Early Symptoms</div>
                <div className="text-sm font-extrabold text-gray-900">Yellow foliage, necrotic dark spots</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Recommended Treatment</div>
                <div className="text-sm font-extrabold text-gray-900">Trichoderma viride @ 5g/L</div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-emerald-900">
              <h5 className="font-extrabold">🛡️ Bio-Control Prevention Steps</h5>
              <p>Inspect underside of lower crop leaves daily. Remove affected leaves immediately and destroy outside field boundaries.</p>
            </div>
          </div>
        );

      case "fertilizer":
        return (
          <div className="space-y-4 text-xs font-medium">
            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 space-y-1">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" /> Fertilizer Plan
              </h4>
              <p>
                Apply balanced NPK 19-19-19 foliar spray post-rain to accelerate root nutrient absorption during active vegetative growth.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Recommended Fertilizer</div>
                <div className="text-sm font-extrabold text-gray-900">Water Soluble NPK (19-19-19)</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Dosage</div>
                <div className="text-sm font-extrabold text-gray-900">5g per Litre of Water</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Application Method</div>
                <div className="text-sm font-extrabold text-emerald-700">Foliar Spray</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Best Timing</div>
                <div className="text-sm font-extrabold text-gray-900">6:00 AM - 8:00 AM</div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4 text-xs font-medium">
            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 text-teal-900 space-y-1">
              <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Livestock Health & Care
              </h4>
              <p>
                Ensure adequate shaded shelter and clean drinking water for cattle to prevent heat humidity stress.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Heat Stress Level</div>
                <div className="text-sm font-extrabold text-amber-600">Moderate Heat Stress</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Daily Water Intake</div>
                <div className="text-sm font-extrabold text-gray-900">80 - 100 Litres per animal</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Shelter Recommendation</div>
                <div className="text-sm font-extrabold text-gray-900">Shaded, well-ventilated shed</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-gray-500 font-bold">Disease Alert</div>
                <div className="text-sm font-extrabold text-emerald-700">FMD Vaccination Active</div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl border border-emerald-100 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${advisory.iconBg}`}>
              <IconComp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">{advisory.title}</h3>
              <p className="text-xs text-gray-500 font-medium">Hyper-local agricultural telemetry for {locationName || "Ludhiana"}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            title="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STATUS BADGE */}
        <div className="flex items-center justify-between">
          <span className={`text-xs font-extrabold px-3 py-1 rounded-full border uppercase ${advisory.statusColor}`}>
            Status: {advisory.status}
          </span>
          <span className="text-xs font-bold text-gray-500">Telemetry Verified</span>
        </div>

        {/* DETAILED CONTENT */}
        {renderDetailsContent()}

        {/* FOOTER CLOSE BUTTON */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-emerald-700 transition cursor-pointer"
          >
            Done & Close
          </button>
        </div>
      </div>
    </div>
  );
}
