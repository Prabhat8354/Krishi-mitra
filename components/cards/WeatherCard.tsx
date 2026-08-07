"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Cloud, Droplets, Wind, MapPin, Volume2, Loader2, RefreshCw, Sun, CloudRain, Sparkles } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getWeather } from "@/actions/weather";
import { speakNative } from "@/lib/audio";
import { getLanguageByCode } from "@/lib/languages";

export default function WeatherCard() {
  const { t, i18n } = useTranslation();
  const lat = useStore((state) => state.lat);
  const lon = useStore((state) => state.lon);
  const currentLanguage = useStore((state) => state.currentLanguage);
  const setLocation = useStore((state) => state.setLocation);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const language = getLanguageByCode(currentLanguage);

  useEffect(() => {
    if (currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  useEffect(() => {
    if (lat && lon) {
      fetchWeather();
    } else {
      requestLocation();
    }
  }, [lat, lon]);

  const requestLocation = () => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords.latitude.toString(), position.coords.longitude.toString());
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    if (!lat || !lon) return;
    setLoading(true);
    const result = await getWeather(lat, lon, currentLanguage.split("-")[0]);
    if (result.success && result.data) {
      setWeather(result.data);
    }
    setLoading(false);
  };

  const handleSpeak = () => {
    if (!weather) return;
    const text = `${t('weather')}: ${weather.description}, ${weather.temperature} degrees, humidity ${weather.humidity} percent`;
    speakNative(text, language?.browserCode || "en-IN");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-200/80 p-6 flex items-center justify-center min-h-[140px]">
        <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Syncing Google Weather & Satellite Telemetry...</span>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-200/80 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Enable GPS Weather Radar</h3>
            <p className="text-xs text-gray-500">Allow location permission for hyper-local rain and humidity forecasting.</p>
          </div>
        </div>
        <button
          onClick={requestLocation}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition"
        >
          Enable GPS Location
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-200/80 p-6 transition hover:shadow-md hover:border-gray-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Left: Weather details */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {weather.location} • Live Telemetry
          </div>

          <div className="flex items-baseline gap-4">
            <span className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
              {weather.temperature}°C
            </span>
            <span className="text-sm font-semibold text-emerald-700 capitalize bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
              {weather.description}
            </span>
          </div>

          {/* Today's Advice */}
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-700 font-medium">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
            <span><strong>Today's Advice:</strong> Moderate humidity ({weather.humidity}%). Ideal conditions for pesticide spraying & field harvest.</span>
          </div>
        </div>

        {/* Right: Metrics Grid */}
        <div className="flex items-center gap-4 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 justify-between md:justify-end">
          <div className="flex gap-4">
            <div className="text-center px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 min-w-[75px]">
              <Droplets className="w-4 h-4 text-sky-500 mx-auto mb-1" />
              <div className="text-[10px] text-gray-400 font-medium">Humidity</div>
              <div className="text-sm font-bold text-gray-900">{weather.humidity}%</div>
            </div>

            <div className="text-center px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 min-w-[75px]">
              <Wind className="w-4 h-4 text-teal-500 mx-auto mb-1" />
              <div className="text-[10px] text-gray-400 font-medium">Wind</div>
              <div className="text-sm font-bold text-gray-900">{weather.windSpeed} m/s</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSpeak}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition border border-gray-200/60"
              title={t('listen')}
            >
              <Volume2 className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={fetchWeather}
              className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 transition border border-gray-200/60"
              title={t('refresh')}
            >
              <RefreshCw className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
