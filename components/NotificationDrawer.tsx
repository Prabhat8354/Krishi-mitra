"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Bell, CloudRain, TrendingUp, ShieldAlert, Landmark, X, RefreshCw } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getLiveSmartAlerts, SmartAlert } from "@/actions/alerts";

export default function NotificationDrawer() {
  const profile = useStore((state) => state.profile);
  const [isOpen, setIsOpen] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState<SmartAlert[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLiveAlerts = useCallback(async () => {
    setLoading(true);
    const res = await getLiveSmartAlerts(profile.state || "Punjab", profile.district || "Ludhiana");
    setLoading(false);
    if (res.success && res.data) {
      setLiveAlerts(res.data);
    }
  }, [profile.state, profile.district]);

  useEffect(() => {
    fetchLiveAlerts();

    // Auto-refresh notifications every 15 minutes (900000 ms)
    const interval = setInterval(() => {
      fetchLiveAlerts();
    }, 900000);

    return () => clearInterval(interval);
  }, [fetchLiveAlerts]);

  const unreadCount = liveAlerts.filter((n) => !n.read).length;

  const getIcon = (category: string) => {
    switch (category) {
      case "weather":
        return <CloudRain className="w-4 h-4 text-sky-600" />;
      case "price":
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case "disease":
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      case "scheme":
        return <Landmark className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-teal-600" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white/80 hover:bg-white text-gray-700 transition shadow-xs border border-emerald-100/80 flex items-center justify-center cursor-pointer"
        title="Live Smart Alerts"
      >
        <Bell className="w-5 h-5 text-emerald-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-3xl shadow-2xl border border-emerald-100 p-4 z-50 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" /> Live Smart Alerts
              </h3>
              <button
                onClick={fetchLiveAlerts}
                disabled={loading}
                className="p-1 rounded-full text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                title="Refresh Alerts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              </button>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto my-2 space-y-1">
            {liveAlerts.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-500 font-medium">No live alerts active right now.</div>
            ) : (
              liveAlerts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setLiveAlerts((prev) =>
                      prev.map((a) => (a.id === item.id ? { ...a, read: true } : a))
                    );
                  }}
                  className={`py-3 px-2 rounded-2xl transition cursor-pointer flex items-start gap-3 ${
                    item.read ? "opacity-60 bg-transparent" : "bg-emerald-50/50 hover:bg-emerald-50"
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-emerald-100 shrink-0">
                    {getIcon(item.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold text-gray-900 leading-tight">{item.title}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0 uppercase">
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-snug mt-1">{item.description}</p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
                      <span>Source: {item.source}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
