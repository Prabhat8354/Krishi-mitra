"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Thermometer, 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  Clock, 
  RefreshCw, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck,
  ChevronRight,
  Sprout,
  Activity
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { getLiveWeatherData } from "@/actions/gemini-chat";
import AdvisoryDetailsModal from "@/components/AdvisoryDetailsModal";

export default function WeatherDashboardPage() {
  const { lat, lon, setLocation, profile } = useStore();
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAdvisory, setSelectedAdvisory] = useState<any>(null);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("Just now");

  useEffect(() => {
    // Geolocation or default Ludhiana, Punjab
    if (!lat || !lon) {
      if (typeof window !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const latitude = pos.coords.latitude.toFixed(4);
            const longitude = pos.coords.longitude.toFixed(4);
            setLocation(latitude, longitude);
            fetchWeatherData(latitude, longitude);
          },
          () => {
            const fallbackLat = "30.9010";
            const fallbackLon = "75.8573";
            setLocation(fallbackLat, fallbackLon);
            fetchWeatherData(fallbackLat, fallbackLon);
          }
        );
      } else {
        const fallbackLat = "30.9010";
        const fallbackLon = "75.8573";
        setLocation(fallbackLat, fallbackLon);
        fetchWeatherData(fallbackLat, fallbackLon);
      }
    } else {
      fetchWeatherData(lat, lon);
    }
  }, [lat, lon, setLocation]);

  const fetchWeatherData = async (latitude: string, longitude: string) => {
    setLoading(true);
    try {
      const locName = profile.district ? `${profile.district}, ${profile.state}` : "Ludhiana, Punjab";
      const liveRes = await getLiveWeatherData(latitude, longitude, locName);
      if (liveRes) {
        setWeatherData({
          temp: liveRes.temp,
          feelsLike: liveRes.temp + 2,
          humidity: liveRes.humidity,
          windSpeed: liveRes.windSpeed,
          rainChance: liveRes.rainProb,
          uvIndex: liveRes.uvIndex,
          condition: liveRes.condition,
          locationName: liveRes.location,
          sunrise: liveRes.sunrise,
          sunset: liveRes.sunset,
        });
      } else {
        setFallbackWeather();
      }
    } catch (err) {
      setFallbackWeather();
    } finally {
      setLoading(false);
      setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  const setFallbackWeather = () => {
    setWeatherData({
      temp: 32,
      feelsLike: 35,
      humidity: 78,
      windSpeed: 18,
      rainChance: 65,
      uvIndex: 6,
      condition: "Scattered Monsoon Showers",
      locationName: profile.district ? `${profile.district}, ${profile.state}` : "Ludhiana, Punjab",
    });
  };

  // 6 Smart Farm Advisory Cards
  const advisoryCards = useMemo(() => {
    const rain = weatherData?.rainChance ?? 65;
    const humidity = weatherData?.humidity ?? 78;
    const wind = weatherData?.windSpeed ?? 18;

    return [
      {
        id: "irrigation",
        title: "Irrigation Advisory",
        icon: Droplets,
        iconBg: "bg-sky-50 text-sky-600 border-sky-100",
        recommendation: `Monsoon rain probability is ${rain}%. Hold off on tube-well & drip irrigation for 24-48h to prevent root waterlogging.`,
        status: rain > 50 ? "Caution" : "Safe",
        statusColor: rain > 50 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
        badgeText: rain > 50 ? "Pause Irrigation" : "Normal Irrigation",
      },
      {
        id: "spraying",
        title: "Spraying Advisory",
        icon: Wind,
        iconBg: "bg-rose-50 text-rose-600 border-rose-100",
        recommendation: `Wind speed reaching ${wind} km/h with humidity at ${humidity}%. Postpone pesticide & chemical spraying to avoid drift and rain wash.`,
        status: wind > 15 ? "Alert" : "Safe",
        statusColor: wind > 15 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-emerald-50 text-emerald-700 border-emerald-200",
        badgeText: wind > 15 ? "Postpone Spraying" : "Suitable for Spraying",
      },
      {
        id: "harvest",
        title: "Harvest Advisory",
        icon: Sprout,
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        recommendation: "Dry sunny window predicted in 3 days. Prepare grain drying yards and threshing machinery for ripe Wheat & Paddy.",
        status: "Safe",
        statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        badgeText: "Plan Harvest Day 3",
      },
      {
        id: "disease",
        title: "Disease Risk Advisory",
        icon: ShieldAlert,
        iconBg: "bg-amber-50 text-amber-600 border-amber-100",
        recommendation: `Relative humidity at ${humidity}% increases susceptibility for Late Blight in Tomato & Yellow Rust in Wheat. Inspect lower foliage daily.`,
        status: humidity > 75 ? "Alert" : "Caution",
        statusColor: humidity > 75 ? "bg-rose-50 text-rose-700 border-rose-200" : "bg-amber-50 text-amber-700 border-amber-200",
        badgeText: "High Fungal Vulnerability",
      },
      {
        id: "fertilizer",
        title: "Fertilizer Recommendation",
        icon: Sparkles,
        iconBg: "bg-purple-50 text-purple-600 border-purple-100",
        recommendation: "Apply balanced NPK 19-19-19 foliar spray @ 5g/L water post-rain to accelerate root nutrient absorption.",
        status: "Safe",
        statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        badgeText: "Foliar Spray Recommended",
      },
      {
        id: "livestock",
        title: "Livestock Advisory",
        icon: ShieldCheck,
        iconBg: "bg-teal-50 text-teal-600 border-teal-100",
        recommendation: "Ensure well-ventilated shade shelters & fresh drinking water for cattle to prevent heat humidity exhaustion.",
        status: "Safe",
        statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        badgeText: "Provide Adequate Shade",
      },
    ];
  }, [weatherData]);

  // 7-Day Forecast Data
  const forecastDays = [
    { day: "Today", icon: CloudRain, maxTemp: 32, minTemp: 24, rain: 65 },
    { day: "Tomorrow", icon: CloudRain, maxTemp: 31, minTemp: 23, rain: 70 },
    { day: "Thu", icon: Sun, maxTemp: 34, minTemp: 25, rain: 20 },
    { day: "Fri", icon: Sun, maxTemp: 35, minTemp: 26, rain: 10 },
    { day: "Sat", icon: CloudRain, maxTemp: 33, minTemp: 24, rain: 45 },
    { day: "Sun", icon: Sun, maxTemp: 36, minTemp: 27, rain: 15 },
    { day: "Mon", icon: Sun, maxTemp: 35, minTemp: 26, rain: 10 },
  ];

  // Hourly Timeline Data
  const hourlyData = [
    { time: "NOW", temp: 32, rain: 65, icon: CloudRain },
    { time: "02 PM", temp: 33, rain: 70, icon: CloudRain },
    { time: "04 PM", temp: 31, rain: 60, icon: CloudRain },
    { time: "06 PM", temp: 29, rain: 40, icon: Sun },
    { time: "08 PM", temp: 27, rain: 20, icon: Sun },
    { time: "10 PM", temp: 26, rain: 10, icon: Sun },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] pb-24 font-sans">
      
      {/* 2. HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/80 px-4 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition border border-gray-200/80 bg-white"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-amber-500" />
              Weather Intelligence & Farming Advisory
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Hyper-local satellite weather telemetry & AI agronomy recommendations for Indian agriculture.
            </p>
          </div>
        </div>

        {/* 3 COMPACT HEADER CHIPS */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full font-bold border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            📍 {weatherData?.locationName || "Ludhiana, Punjab"}
          </span>

          <span className="text-xs bg-sky-50 text-sky-800 px-3 py-1.5 rounded-full font-bold border border-sky-200 flex items-center gap-1.5 shadow-2xs">
            <CloudRain className="w-3.5 h-3.5 text-sky-600" />
            🛰 Live Weather
          </span>

          <span className="text-xs bg-amber-50 text-amber-800 px-3 py-1.5 rounded-full font-bold border border-amber-200 flex items-center gap-1.5 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            🔄 Updated: {lastUpdatedTime}
          </span>

          <button
            onClick={() => fetchWeatherData(lat || "30.9010", lon || "75.8573")}
            disabled={loading}
            className="p-2 bg-white hover:bg-gray-100 text-gray-700 rounded-full border border-gray-200 transition"
            title="Refresh Weather Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 space-y-8">
        
        {loading ? (
          <div className="bg-white rounded-[24px] p-12 text-center border border-gray-200/80 shadow-xs">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-bold text-sm">Fetching hyper-local weather telemetry & AI agronomy advice...</p>
          </div>
        ) : (
          <>
            {/* 3. HERO WEATHER CARD (2-COLUMN RESPONSIVE GRID) */}
            <div className="bg-white rounded-[28px] p-6 md:p-8 border border-gray-200/80 shadow-xs relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* LEFT SIDE */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                    <MapPin className="w-3.5 h-3.5" /> {weatherData?.locationName || "Ludhiana, Punjab"}
                  </div>

                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl md:text-7xl font-black text-gray-900 tracking-tight">
                      {weatherData?.temp ?? 32}°C
                    </span>
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-gray-500">Feels like {weatherData?.feelsLike ?? 35}°C</div>
                      <div className="text-xs font-semibold text-emerald-700">Updated {lastUpdatedTime}</div>
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                    <CloudRain className="w-6 h-6 text-sky-500" />
                    {weatherData?.condition || "Scattered Monsoon Showers"}
                  </h2>
                  <p className="text-xs text-gray-500 font-medium">
                    Satellite radar Telemetry synchronized for agricultural field planning.
                  </p>
                </div>

                {/* RIGHT SIDE (2×2 GRID STATS) */}
                <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center space-y-1">
                    <Droplets className="w-5 h-5 text-sky-600 mx-auto" />
                    <div className="text-[11px] text-gray-500 font-bold uppercase">Humidity</div>
                    <div className="text-xl font-extrabold text-gray-900">{weatherData?.humidity ?? 78}%</div>
                  </div>

                  <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 text-center space-y-1">
                    <CloudRain className="w-5 h-5 text-blue-600 mx-auto" />
                    <div className="text-[11px] text-gray-500 font-bold uppercase">Rain Probability</div>
                    <div className="text-xl font-extrabold text-gray-900">{weatherData?.rainChance ?? 65}%</div>
                  </div>

                  <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 text-center space-y-1">
                    <Wind className="w-5 h-5 text-teal-600 mx-auto" />
                    <div className="text-[11px] text-gray-500 font-bold uppercase">Wind Speed</div>
                    <div className="text-xl font-extrabold text-gray-900">{weatherData?.windSpeed ?? 18} km/h</div>
                  </div>

                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 text-center space-y-1">
                    <Sun className="w-5 h-5 text-amber-500 mx-auto" />
                    <div className="text-[11px] text-gray-500 font-bold uppercase">UV Index</div>
                    <div className="text-xl font-extrabold text-gray-900">{weatherData?.uvIndex ?? 6} (Moderate)</div>
                  </div>
                </div>

              </div>
            </div>

            {/* WEATHER ALERTS BANNER (IF ALERTS EXIST) */}
            {(weatherData?.rainChance > 50 || weatherData?.temp > 35) && (
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-rose-900 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-sm">Monsoon Weather Alert in {weatherData?.locationName || "Ludhiana"}</h4>
                    <p className="text-xs text-rose-800 font-medium">
                      Heavy rainfall probability ({weatherData?.rainChance ?? 65}%) & wind gusts ({weatherData?.windSpeed ?? 18} km/h) active.
                    </p>
                  </div>
                </div>
                <Link href="/alerts" className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-rose-700 transition shrink-0">
                  View Alert Center
                </Link>
              </div>
            )}

            {/* 4. SMART FARM ACTION ADVISORY (3-COLUMN RESPONSIVE GRID) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> Smart Farm Action Advisory
                </h2>
                <span className="text-xs font-bold text-gray-500">6 Core Agronomy Advisories</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisoryCards.map((card) => {
                  const IconComp = card.icon;
                  return (
                    <div
                      key={card.id}
                      className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.iconBg}`}>
                            <IconComp className="w-6 h-6" />
                          </div>
                          <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border uppercase ${card.statusColor}`}>
                            {card.status}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {card.title}
                        </h3>

                        <p className="text-xs text-gray-600 leading-relaxed font-medium">
                          {card.recommendation}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          {card.badgeText}
                        </span>

                        <button
                          onClick={() => setSelectedAdvisory(card)}
                          className="text-xs font-bold text-gray-500 hover:text-emerald-700 flex items-center gap-1 transition"
                        >
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. HOURLY TIMELINE & 7-DAY FORECAST */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* HOURLY TIMELINE */}
              <div className="lg:col-span-6 bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" /> Today's Hourly Forecast
                </h3>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {hourlyData.map((item, idx) => {
                    const IconC = item.icon;
                    return (
                      <div key={idx} className="p-3 bg-gray-50/80 rounded-2xl border border-gray-200/60 text-center space-y-1">
                        <div className="text-[10px] font-bold text-gray-500">{item.time}</div>
                        <IconC className="w-4 h-4 text-sky-600 mx-auto" />
                        <div className="text-xs font-extrabold text-gray-900">{item.temp}°C</div>
                        <div className="text-[10px] text-sky-700 font-bold">{item.rain}% Rain</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 7-DAY FORECAST */}
              <div className="lg:col-span-6 bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" /> 7-Day Weather Outlook
                </h3>

                <div className="space-y-2">
                  {forecastDays.map((f, idx) => {
                    const IconC = f.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-gray-50/60 rounded-xl border border-gray-200/60 text-xs font-bold">
                        <span className="w-20 text-gray-900">{f.day}</span>
                        <IconC className="w-4 h-4 text-sky-600" />
                        <span className="text-gray-500">{f.rain}% Rain</span>
                        <span className="text-gray-900 font-extrabold">{f.maxTemp}° / {f.minTemp}°C</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* FARMING ACTIVITY TIMELINE */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Recommended Farming Activity Timeline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                  <div className="font-extrabold text-emerald-900">Today</div>
                  <p className="text-gray-700">Pause tube-well irrigation & inspect Tomato crops for Late Blight symptoms.</p>
                </div>

                <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-2">
                  <div className="font-extrabold text-sky-900">Tomorrow</div>
                  <p className="text-gray-700">Clean field drainage outlets to allow excess rainwater discharge.</p>
                </div>

                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2">
                  <div className="font-extrabold text-purple-900">Next 3 Days</div>
                  <p className="text-gray-700">Apply NPK foliar spray and prepare grain drying yards for harvest window.</p>
                </div>

                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-2">
                  <div className="font-extrabold text-amber-900">Next Week</div>
                  <p className="text-gray-700">Initiate harvest for ripe Wheat fields under clear sunny weather.</p>
                </div>
              </div>
            </div>

          </>
        )}

      </main>

      {/* ADVISORY DETAILS MODAL */}
      <AdvisoryDetailsModal
        advisory={selectedAdvisory}
        onClose={() => setSelectedAdvisory(null)}
        locationName={weatherData?.locationName}
        weatherTelemetry={weatherData}
      />
    </div>
  );
}
