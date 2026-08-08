"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface MascotProps {
  size?: number;
}

export default function InteractiveMascot({ size = 300 }: MascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  
  // Tracking mouse coordinates for smooth eye tracking & head rotation
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [headRotation, setHeadRotation] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isWaving, setIsWaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);

  const [dragLimits, setDragLimits] = useState({ left: 0, right: 0, top: 0, bottom: 0 });

  const speechMessages = [
    "Hello Farmer 👋",
    "Namaste 🌱",
    "Welcome Back!",
    "Ready to grow today?",
    "Let's improve your harvest!",
    "KrishiMitra AI is ready!"
  ];

  const updateRect = () => {
    if (containerRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect();
    }
  };

  const updateDragLimits = () => {
    if (typeof window === "undefined" || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDragLimits({
      left: -rect.left,
      right: window.innerWidth - rect.right,
      top: -rect.top,
      bottom: window.innerHeight - rect.bottom
    });
  };

  useEffect(() => {
    updateDragLimits();
    const timer = setTimeout(updateDragLimits, 500);

    window.addEventListener("resize", updateDragLimits);
    return () => {
      window.removeEventListener("resize", updateDragLimits);
      clearTimeout(timer);
    };
  }, [size]);

  // Eye Tracking & Head Rotation via Mouse Move
  useEffect(() => {
    let animFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = rectRef.current || containerRef.current.getBoundingClientRect();
      if (!rectRef.current) {
        rectRef.current = rect;
      }
      
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 500;

      // Calculate smooth pupil offset (max 7px in any direction)
      const maxEyeOffset = 7;
      const targetPupilX = Math.min(Math.max((deltaX / maxDistance) * maxEyeOffset, -maxEyeOffset), maxEyeOffset);
      const targetPupilY = Math.min(Math.max((deltaY / maxDistance) * maxEyeOffset, -maxEyeOffset), maxEyeOffset);

      // Calculate subtle head rotation (max +-8deg)
      const targetHeadRot = Math.min(Math.max((deltaX / maxDistance) * 8, -8), 8);

      // Smooth interpolation using requestAnimationFrame
      animFrameId = requestAnimationFrame(() => {
        setPupilOffset((prev) => ({
          x: prev.x + (targetPupilX - prev.x) * 0.15,
          y: prev.y + (targetPupilY - prev.y) * 0.15,
        }));
        setHeadRotation((prev) => prev + (targetHeadRot - prev) * 0.15);
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  // Idle Blinking Animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Click Interaction: Wave + Speech Bubble
  const handleClick = () => {
    setIsWaving(true);
    const randomMsg = speechMessages[Math.floor(Math.random() * speechMessages.length)];
    setSpeechBubble(randomMsg);

    setTimeout(() => setIsWaving(false), 2000);
    setTimeout(() => setSpeechBubble(null), 3500);
  };

  return (
    <motion.div
      ref={containerRef}
      drag
      dragConstraints={dragLimits}
      dragMomentum={false}
      onDragStart={updateRect}
      onDragEnd={() => {
        updateRect();
        updateDragLimits();
      }}
      onClick={handleClick}
      onMouseEnter={() => {
        setIsHovered(true);
        updateRect();
        updateDragLimits();
      }}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05 }}
      style={{ width: `${size}px`, height: `${size}px`, zIndex: 9999 }}
      className="relative flex items-center justify-center cursor-pointer select-none group"
      title="Click Mitra to say Hello! (Try dragging me!)"
    >
      {/* SPEECH BUBBLE */}
      {speechBubble && (
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white text-emerald-950 font-black text-xs px-4 py-2 rounded-2xl shadow-xl border-2 border-emerald-400 z-30 animate-bounce flex items-center gap-1.5 whitespace-nowrap">
          <span>{speechBubble}</span>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-8 border-t-white"></div>
        </div>
      )}

      {/* AMBIENT GLOW RING */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 blur-2xl ${
        isHovered ? "bg-emerald-400/40 scale-110" : "bg-emerald-500/20 scale-95 animate-pulse"
      }`}></div>

      {/* MASCOT SVG BODY WITH HEAD ROTATION */}
      <div
        style={{
          transform: `rotate(${headRotation}deg)`,
          transition: "transform 0.1s ease-out",
        }}
        className="w-full h-full relative flex items-center justify-center animate-bounce duration-[4000ms]"
      >
        <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-2xl overflow-visible">
          <defs>
            <linearGradient id="bodyGradientInteractive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
            <linearGradient id="leafGradientInteractive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="100%" stopColor="#22C55E" />
            </linearGradient>
            <linearGradient id="bellyGradientInteractive" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#DCFCE7" />
              <stop offset="100%" stopColor="#86EFAC" />
            </linearGradient>
            <filter id="glowInteractive" x1="-20%" y1="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* SPROUT ON HEAD */}
          <g className="animate-pulse">
            <path d="M 100 40 Q 85 20 70 28 Q 80 45 100 40 Z" fill="url(#leafGradientInteractive)" />
            <path d="M 100 40 Q 115 15 130 22 Q 120 42 100 40 Z" fill="url(#leafGradientInteractive)" />
            <circle cx="100" cy="39" r="2.5" fill="#FEF08A" />
          </g>

          {/* MAIN ROUNDED BODY */}
          <rect
            x="30"
            y="40"
            width="140"
            height="150"
            rx="70"
            ry="70"
            fill="url(#bodyGradientInteractive)"
            stroke="#166534"
            strokeWidth="3"
          />

          {/* BELLY PATCH */}
          <ellipse cx="100" cy="135" rx="48" ry="42" fill="url(#bellyGradientInteractive)" />

          {/* LEFT ARM (WAVING IF CLICKED) */}
          <g style={{
            transform: isWaving ? "rotate(-30deg)" : "rotate(0deg)",
            transformOrigin: "30px 110px",
            transition: "transform 0.3s ease-in-out",
          }}>
            <rect x="12" y="100" width="22" height="40" rx="11" fill="#16A34A" stroke="#166534" strokeWidth="2" />
          </g>

          {/* RIGHT ARM */}
          <g>
            <rect x="166" y="100" width="22" height="40" rx="11" fill="#16A34A" stroke="#166534" strokeWidth="2" />
          </g>

          {/* FEET */}
          <ellipse cx="70" cy="192" rx="18" ry="10" fill="#15803D" stroke="#166534" strokeWidth="2" />
          <ellipse cx="130" cy="192" rx="18" ry="10" fill="#15803D" stroke="#166534" strokeWidth="2" />

          {/* CHEEKS ROSY GLOW */}
          <ellipse cx="60" cy="106" rx="10" ry="6" fill="#F43F5E" opacity="0.35" />
          <ellipse cx="140" cy="106" rx="10" ry="6" fill="#F43F5E" opacity="0.35" />

          {/* EYES WITH DYNAMIC CURSOR EYE TRACKING & BLINKING */}
          {isBlinking ? (
            /* BLINKING STATE */
            <g stroke="#064E3B" strokeWidth="3.5" strokeLinecap="round">
              <path d="M 68 94 Q 78 100 88 94" fill="none" />
              <path d="M 112 94 Q 122 100 132 94" fill="none" />
            </g>
          ) : (
            /* OPEN EYES WITH MOUSE-TRACKING WHITE PUPILS */
            <g>
              {/* EYE SOCKETS */}
              <ellipse cx="78" cy="92" rx="15" ry="17" fill="#064E3B" />
              <ellipse cx="122" cy="92" rx="15" ry="17" fill="#064E3B" />

              {/* DYNAMIC TRACKING PUPILS */}
              <circle
                cx={78 + pupilOffset.x}
                cy={92 + pupilOffset.y}
                r="6"
                fill="#FFFFFF"
              />
              <circle
                cx={122 + pupilOffset.x}
                cy={92 + pupilOffset.y}
                r="6"
                fill="#FFFFFF"
              />

              {/* SHINE DOTS */}
              <circle cx={75 + pupilOffset.x} cy={89 + pupilOffset.y} r="2.5" fill="#FFFFFF" opacity="0.8" />
              <circle cx={119 + pupilOffset.x} cy={89 + pupilOffset.y} r="2.5" fill="#FFFFFF" opacity="0.8" />
            </g>
          )}

          {/* FRIENDLY SMILE (ENLARGES ON HOVER) */}
          <path
            d={isHovered ? "M 75 116 Q 100 142 125 116" : "M 78 118 Q 100 136 122 118"}
            fill="none"
            stroke="#064E3B"
            strokeWidth={isHovered ? "4" : "3.5"}
            strokeLinecap="round"
          />

          {/* CHEERFUL TONGUE WHEN HOVERED */}
          {isHovered && (
            <path d="M 92 128 Q 100 138 108 128 Z" fill="#FB7185" />
          )}

          {/* TECH LEAF BADGE ON CHEST */}
          <circle cx="100" cy="135" r="12" fill="#FFFFFF" stroke="#22C55E" strokeWidth="2" />
          <path d="M 97 140 Q 94 130 104 131 Q 101 138 97 140 Z" fill="#16A34A" />
        </svg>
      </div>
    </motion.div>
  );
}
