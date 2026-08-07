"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function KrishiMitraLogo({ className = "", size = 36, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* SVG Logo: Leaf + Letter K + AI Circuitry + Chat Bubble */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-250 hover:scale-105"
      >
        <defs>
          <linearGradient id="km-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
          <filter id="km-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#16A34A" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Chat Bubble Background Container */}
        <rect
          x="3"
          y="3"
          width="42"
          height="36"
          rx="14"
          fill="url(#km-grad)"
          filter="url(#km-glow)"
        />
        {/* Chat Bubble Tail */}
        <path
          d="M14 39L8 44V37.5L14 39Z"
          fill="#16A34A"
        />

        {/* Stylized Leaf forming the letter "K" inside */}
        {/* Vertical stem of 'K' */}
        <path
          d="M16 13V33"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Top diagonal branch forming Leaf & K top arm */}
        <path
          d="M17.5 22C21 18 25.5 13 32 13C32 19 28 23 23 23H17.5Z"
          fill="white"
          fillOpacity="0.95"
        />

        {/* Bottom diagonal arm of 'K' */}
        <path
          d="M18 22L30 33"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* AI Circuit Dots & Connections */}
        <circle cx="32" cy="13" r="2" fill="#84CC16" />
        <circle cx="30" cy="33" r="2" fill="#84CC16" />
        <circle cx="16" cy="13" r="1.8" fill="white" />
        <circle cx="16" cy="33" r="1.8" fill="white" />
        
        {/* Subtle Leaf Vein Line */}
        <path
          d="M19 21.5C23 19 27 16 30 15"
          stroke="#16A34A"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-black tracking-tight text-[#111827]">
            Krishi <span className="text-emerald-600">Mitra</span>
          </span>
          <span className="text-[10px] font-semibold text-gray-500 tracking-wide mt-0.5">
            Your Intelligent Farming Companion
          </span>
        </div>
      )}
    </div>
  );
}
