"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Bell, 
  AlertTriangle, 
  CloudRain, 
  TrendingUp, 
  ShieldAlert, 
  Newspaper, 
  RefreshCw, 
  Clock, 
  MapPin, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { getLiveSmartAlerts, SmartAlert } from "@/actions/alerts";
import { getWeather } from "@/actions/weather";

export default function SmartAlertsPage() {
  const profile = useStore((state) => state.profile);
  const lat = useStore((state) => state.lat);
  const lon = useStore((state) => state.lon);
  const currentLanguage = useStore((state) => state.currentLanguage);

  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("Fetching...");

  const fetchLiveAlerts = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      let weatherParams: { temp: number; humidity: number; rainProb: number; windSpeed: number; condition?: string } | undefined = undefined;

      if (lat && lon) {
        const weatherRes = await getWeather(lat, lon, currentLanguage.split("-")[0]);
        if (weatherRes.success && weatherRes.data) {
          weatherParams = {
            temp: weatherRes.data.temperature || 32,
            humidity: weatherRes.data.humidity || 78,
            rainProb: 65,
            windSpeed: weatherRes.data.windSpeed || 18,
            condition: weatherRes.data.description || "Clear",
          };
        }
      }

      const res = await getLiveSmartAlerts(
        profile.state || "Punjab",
        profile.district || "Ludhiana",
        weatherParams
      );

      if (res.success && res.data) {
        setAlerts(res.data);
        setLastUpdated(res.fetchedAt || new Date().toLocaleTimeString());
      } else {
        throw new Error("Unable to fetch live alerts");
      }
    } catch (err: any) {
      console.error("❌ Smart Alerts Fetch Error:", err);
      setErrorMsg("Unable to fetch live alerts. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [profile.state, profile.district, lat, lon, currentLanguage]);

  useEffect(() => {
    fetchLiveAlerts();

    // Auto-refresh every 10 minutes (600,000 ms)
    const timer = setInterval(() => {
      fetchLiveAlerts();
    }, 600000);

    return () => clearInterval(timer);
  }, [fetchLiveAlerts]);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "HIGH":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "MEDIUM":
        return "bg-sky-50 text-sky-700 border-sky-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "weather":
        return CloudRain;
      case "price":
        return TrendingUp;
      case "disease":
        return ShieldAlert;
      default:
        return Newspaper;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] pb-24 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/80 px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-black text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Smart Farm Threat Radar & Real-Time Alerts
            </h1>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Live Telemetry for {profile.district || "Ludhiana"}, {profile.state || "Punjab"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-white text-gray-600 px-3 py-1 rounded-full font-semibold border border-gray-200 flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Updated: {lastUpdated}
          </span>
          <button
            onClick={fetchLiveAlerts}
            disabled={loading}
            className="p-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition border border-emerald-200 disabled:opacity-50"
            title="Refresh Live Alerts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8 pt-8 space-y-4">
        
        {/* SKELETON LOADER STATE */}
        {loading && alerts.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-gray-200 animate-pulse space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {errorMsg && (
          <div className="p-6 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm">Live Alerts Telemetry Notice</h4>
                <p className="text-xs text-rose-800 font-medium">{errorMsg}</p>
              </div>
            </div>
            <button
              onClick={fetchLiveAlerts}
              className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-rose-700 transition shrink-0"
            >
              Retry Sync
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !errorMsg && alerts.length === 0 && (
          <div className="p-12 bg-white rounded-3xl border border-gray-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">No active farm alerts for your location</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Current weather telemetry and Mandi rates are stable for {profile.district || "Ludhiana"}, {profile.state || "Punjab"}.
            </p>
          </div>
        )}

        {/* REAL-TIME ALERTS LIST */}
        {!loading && alerts.length > 0 && (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const IconComp = getCategoryIcon(alert.category);
              const badgeClass = getPriorityBadge(alert.priority);

              return (
                <div
                  key={alert.id}
                  className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {alert.source}
                      </span>
                    </div>

                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border uppercase ${badgeClass}`}>
                      {alert.priority}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-gray-900">{alert.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium mt-1">
                      {alert.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                    <span>Source: {alert.source}</span>
                    <span>{alert.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}
