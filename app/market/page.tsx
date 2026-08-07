"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Search, TrendingUp, TrendingDown, Minus, MapPin, Calendar, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { getLiveMandiPrices, MandiPriceItem } from "@/actions/mandi";

/**
 * OPTIMIZED MEMOIZED SVG LINE CHART WITH ZERO TOOLTIP FLICKER
 */
const MandiPriceLineChart = React.memo(function MandiPriceLineChart({ item }: { item: MandiPriceItem }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const prices = useMemo(() => item.last7Days.map((d) => d.price), [item]);
  const minPrice = useMemo(() => Math.min(...prices) * 0.95, [prices]);
  const maxPrice = useMemo(() => Math.max(...prices) * 1.05, [prices]);

  const width = 800;
  const height = 260;
  const paddingX = 60;
  const paddingY = 40;
  const chartWidth = width - paddingX * 2;
  const chartHeight = height - paddingY * 2;

  // Memoize SVG Points Calculation
  const points = useMemo(() => {
    return item.last7Days.map((d, i) => {
      const x = paddingX + (i / (item.last7Days.length - 1)) * chartWidth;
      const y = height - paddingY - ((d.price - minPrice) / (maxPrice - minPrice)) * chartHeight;
      return { x, y, day: d.day, price: d.price };
    });
  }, [item, minPrice, maxPrice, chartWidth, chartHeight]);

  // Memoize SVG Bezier Smooth Curve Path
  const { pathD, areaD } = useMemo(() => {
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      d += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    const area = `${d} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
    return { pathD: d, areaD: area };
  }, [points]);

  const isPositiveTrend = item.trend !== "down";
  const strokeColor = isPositiveTrend ? "#16A34A" : "#DC2626";
  const fillColor = isPositiveTrend ? "url(#green-gradient)" : "url(#red-gradient)";

  const hoveredPoint = hoveredIdx !== null ? points[hoveredIdx] : null;

  return (
    <div className="w-full space-y-4">
      
      {/* Legend & Chart Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${isPositiveTrend ? "bg-emerald-500" : "bg-rose-500"}`}></span>
            <span className="text-gray-700">Daily Rate (₹ / Quintal)</span>
          </div>
          <span className="text-gray-400">|</span>
          <span className="text-gray-500">Weekly High: ₹{item.weeklyHigh.toLocaleString()}</span>
          <span className="text-gray-500">Weekly Low: ₹{item.weeklyLow.toLocaleString()}</span>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          Source: Official Agmarknet Mandi Stream
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative w-full overflow-hidden bg-gray-50/70 rounded-2xl p-4 border border-gray-200/80">
        
        {/* Stable Tooltip Overlay */}
        {hoveredPoint && (
          <div
            style={{
              left: `${(hoveredIdx! / (points.length - 1)) * 80 + 10}%`,
            }}
            className="absolute top-3 -translate-x-1/2 z-30 bg-gray-900 text-white text-xs px-3.5 py-2 rounded-xl shadow-2xl pointer-events-none transition-all duration-150 ease-out space-y-0.5"
          >
            <div className="font-extrabold text-emerald-400">{hoveredPoint.day}</div>
            <div className="text-[11px] text-gray-300">{item.mandiName}, {item.state}</div>
            <div className="text-sm font-black text-white">₹{hoveredPoint.price.toLocaleString()} / Quintal</div>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px] overflow-visible">
          <defs>
            <linearGradient id="green-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="red-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = paddingY + ratio * chartHeight;
            const priceVal = Math.round(maxPrice - ratio * (maxPrice - minPrice));
            return (
              <g key={idx}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#E5E7EB" strokeDasharray="4 4" />
                <text x={paddingX - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-mono">
                  ₹{priceVal}
                </text>
              </g>
            );
          })}

          {/* Gradient Area Fill */}
          <path d={areaD} fill={fillColor} />

          {/* Curved Line */}
          <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />

          {/* Invisible Wider Hover Areas */}
          {points.map((pt, i) => (
            <rect
              key={`hover-area-${i}`}
              x={pt.x - 30}
              y={0}
              width={60}
              height={height}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx((prev) => (prev === i ? null : prev))}
            />
          ))}

          {/* Data Points */}
          {points.map((pt, i) => {
            const isHovered = hoveredIdx === i;
            return (
              <g key={`pt-${i}`} className="pointer-events-none">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "7" : "5"}
                  fill={strokeColor}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  className="transition-all duration-150 ease-out"
                />

                {/* X-Axis Labels */}
                <text x={pt.x} y={height - 12} textAnchor="middle" className="text-[11px] fill-gray-500 font-semibold">
                  {pt.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

    </div>
  );
});

export default function MarketPricesPage() {
  const profile = useStore((state) => state.profile);
  const [searchTerm, setSearchTerm] = useState("");
  const [mandiItems, setMandiItems] = useState<MandiPriceItem[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<MandiPriceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [sourceUsed, setSourceUsed] = useState<string>("data.gov.in Agmarknet API");

  const loadLiveMandiData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const stateParam = encodeURIComponent(profile.state || "Punjab");
      const distParam = encodeURIComponent(profile.district || "Ludhiana");
      const apiUrl = `/api/mandi?state=${stateParam}&district=${distParam}`;

      console.log("🌾 [CLIENT FETCHING LIVE MANDI]:", apiUrl);
      const res = await fetch(apiUrl);
      const data = await res.json();

      console.log("🌾 [CLIENT RECEIVED MANDI RESPONSE]:", data);
      setDebugInfo(data.debug || { status: res.status, url: apiUrl });
      if (data.sourceUsed) {
        setSourceUsed(data.sourceUsed);
      }
      setLoading(false);

      if (data.success && data.data && data.data.length > 0) {
        setMandiItems(data.data);
        setSelectedCrop(data.data[0]);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } else {
        const errDetail = data.error || `HTTP ${res.status}: ${res.statusText}`;
        setErrorMsg(`Live Mandi Diagnostic Notice: ${errDetail}`);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(`Network Exception: ${err.message || "Unable to reach backend API"}`);
    }
  }, [profile.state, profile.district]);

  useEffect(() => {
    loadLiveMandiData();

    // Auto-refresh every 30 minutes (1800000 ms)
    const interval = setInterval(() => {
      loadLiveMandiData();
    }, 1800000);

    return () => clearInterval(interval);
  }, [loadLiveMandiData]);

  const filteredCrops = useMemo(() => {
    return mandiItems.filter(
      (item) =>
        item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.hindiName.includes(searchTerm) ||
        item.mandiName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [mandiItems, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#111827] pb-24 font-sans">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition border border-gray-200/80 bg-white"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Real-Time Mandi Market Prices
            </h1>
            <p className="text-[11px] text-gray-500 font-medium">
              Location-aware Agmarknet mandi rates • Sorted for {profile.district || "Ludhiana"}, {profile.state || "Punjab"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDebugPanel(!showDebugPanel)}
            className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-mono border border-gray-300 flex items-center gap-1.5"
            title="Toggle Developer API Debug Panel"
          >
            🐛 Debug Panel
          </button>

          <button
            onClick={loadLiveMandiData}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-semibold border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${loading ? "animate-spin" : ""}`} />
            <span>Refreshed: {lastUpdated || "Live"}</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-8 pt-6 space-y-6">
        
        {/* DEVELOPER API DEBUG PANEL */}
        {showDebugPanel && (
          <div className="bg-gray-900 text-gray-200 rounded-2xl p-4 font-mono text-xs border border-gray-800 shadow-xl space-y-2 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2 text-emerald-400 font-bold">
              <span>🌾 Agmarknet API Developer Diagnostic Console</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                HTTP {debugInfo?.status || 200}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-gray-400">Target Endpoint:</span>
                <div className="text-sky-300 truncate bg-gray-950 p-1.5 rounded mt-0.5 border border-gray-800">
                  {debugInfo?.url || "/api/mandi"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-gray-400">Response Time:</span>
                  <div className="font-bold text-amber-300 mt-0.5">{debugInfo?.responseTime ?? 0} ms</div>
                </div>

                <div>
                  <span className="text-gray-400">Total Records:</span>
                  <div className="font-bold text-emerald-300 mt-0.5">{debugInfo?.recordsCount ?? 0} items</div>
                </div>

                <div>
                  <span className="text-gray-400">Filtered:</span>
                  <div className="font-bold text-purple-300 mt-0.5">{debugInfo?.filteredCount ?? 0} items</div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-2 p-2 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-bold">
                ❌ Diagnostic Log: {errorMsg}
              </div>
            )}
          </div>
        )}
        
        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search crop or mandi name (e.g. Tomato, Wheat, Onion)..."
            className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-gray-200 shadow-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs text-gray-800"
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-[24px] p-12 text-center border border-gray-200/80 shadow-xs">
            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-gray-700">Connecting to Live Agmarknet Mandi Stream...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-amber-50 rounded-[24px] p-8 border border-amber-200 text-center space-y-2">
            <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
            <h3 className="text-sm font-bold text-amber-900">{errorMsg}</h3>
            <button
              onClick={loadLiveMandiData}
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-xs hover:bg-amber-700 transition"
            >
              Retry Live Stream
            </button>
          </div>
        ) : (
          <>
            {/* Selected Crop Detail Chart */}
            {selectedCrop && (
              <div className="bg-white rounded-[20px] p-6 border border-gray-200/80 shadow-xs space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200/60">
                      {selectedCrop.mandiName}, {selectedCrop.state}
                    </span>
                    <h2 className="text-2xl font-extrabold text-gray-900 mt-2 flex items-center gap-3">
                      {selectedCrop.crop} ({selectedCrop.hindiName})
                    </h2>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-900">
                      ₹{selectedCrop.todayPrice.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ Quintal</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end text-xs font-semibold mt-1">
                      {selectedCrop.trend === "up" ? (
                        <span className="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          <TrendingUp className="w-3.5 h-3.5" /> +{selectedCrop.changePercent}% vs yesterday
                        </span>
                      ) : selectedCrop.trend === "down" ? (
                        <span className="text-rose-600 flex items-center gap-1 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                          <TrendingDown className="w-3.5 h-3.5" /> {selectedCrop.changePercent}% vs yesterday
                        </span>
                      ) : (
                        <span className="text-gray-600 flex items-center gap-1 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                          <Minus className="w-3.5 h-3.5" /> Stable
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* SVG LINE CHART */}
                <div className="pt-6 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" /> 7-Day Live Price Trend Chart
                  </h3>
                  <MandiPriceLineChart item={selectedCrop} />
                </div>
              </div>
            )}

            {/* Mandi Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCrops.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCrop(item)}
                  className={`cursor-pointer bg-white rounded-[20px] p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
                    selectedCrop?.id === item.id
                      ? "ring-2 ring-emerald-500 border-emerald-300"
                      : "border-gray-200/80 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {item.crop} <span className="text-xs font-semibold text-emerald-700">({item.hindiName})</span>
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        {item.mandiName}, {item.state}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.trend === "up"
                          ? "bg-emerald-50 text-emerald-700"
                          : item.trend === "down"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}
                    </span>
                  </div>

                  <div className="flex justify-between items-end pt-3 border-t border-gray-100">
                    <div>
                      <div className="text-[10px] text-gray-400">Yesterday</div>
                      <div className="text-xs font-semibold text-gray-600">₹{item.yesterdayPrice.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-emerald-700 font-bold">Today's Rate</div>
                      <div className="text-xl font-black text-gray-900">₹{item.todayPrice.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
