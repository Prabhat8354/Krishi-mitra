"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, TrendingUp, Activity, PieChart, Users, Sprout, Search } from "lucide-react";

export default function InsightsAnalyticsPage() {
  const topCrops = [
    { name: "Tomato (टमाटर)", searches: 1420, percent: 35, color: "bg-emerald-600" },
    { name: "Wheat (गेहूं)", searches: 1100, percent: 27, color: "bg-emerald-500" },
    { name: "Rice / Paddy (धान)", searches: 850, percent: 21, color: "bg-emerald-400" },
    { name: "Onion (प्याज)", searches: 420, percent: 10, color: "bg-emerald-300" },
    { name: "Potato (आलू)", searches: 280, percent: 7, color: "bg-gray-400" },
  ];

  const topDiseases = [
    { name: "Tomato Late Blight", cases: 412, severity: "High" },
    { name: "Powdery Mildew in Wheat", cases: 285, severity: "Moderate" },
    { name: "Chilli Leaf Curl Virus", cases: 198, severity: "High" },
    { name: "Paddy Stem Borer", cases: 145, severity: "Critical" },
  ];

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
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              Krishi Mitra Analytics & Crop Telemetry
            </h1>
            <p className="text-[11px] text-gray-500 font-medium">Aggregated query trends, crop disease telemetry & active farmer metrics</p>
          </div>
        </div>

        <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-semibold border border-emerald-200">
          Telemetry Active
        </span>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 space-y-6">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-[20px] p-5 border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <Users className="w-4 h-4 text-emerald-600" /> Active Farmers
            </div>
            <div className="text-2xl font-black text-gray-900">12,480+</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-1">↗ +18% this month</div>
          </div>

          <div className="bg-white rounded-[20px] p-5 border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <Search className="w-4 h-4 text-emerald-600" /> Total AI Queries
            </div>
            <div className="text-2xl font-black text-gray-900">48,920</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-1">↗ +24% voice interaction</div>
          </div>

          <div className="bg-white rounded-[20px] p-5 border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <Sprout className="w-4 h-4 text-emerald-600" /> Crops Scanned
            </div>
            <div className="text-2xl font-black text-gray-900">8,310</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-1">96.4% AI Accuracy</div>
          </div>

          <div className="bg-white rounded-[20px] p-5 border border-gray-200/80 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <Activity className="w-4 h-4 text-emerald-600" /> Mandi Trackers
            </div>
            <div className="text-2xl font-black text-gray-900">14 Mandis</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-1">Real-time pricing</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[20px] p-6 border border-gray-200/80 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Most Searched Crops
            </h2>
            <div className="space-y-4">
              {topCrops.map((crop, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-bold text-gray-800 mb-1">
                    <span>{crop.name}</span>
                    <span>{crop.searches} queries ({crop.percent}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      style={{ width: `${crop.percent}%` }}
                      className={`h-full rounded-full ${crop.color} transition-all duration-500`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[20px] p-6 border border-gray-200/80 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-600" /> Disease Outbreak Telemetry
            </h2>
            <div className="space-y-3">
              {topDiseases.map((dis, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/60 flex justify-between items-center">
                  <div>
                    <div className="text-xs font-bold text-gray-900">{dis.name}</div>
                    <div className="text-[10px] text-gray-500">{dis.cases} confirmed cases</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {dis.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
