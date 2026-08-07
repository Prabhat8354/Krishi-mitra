"use client";

export default function FarmingBackground() {
  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 select-none overflow-hidden">
        {/* Subtle, elegant watermark agricultural motifs at 3% opacity */}
        <div className="absolute top-[8%] left-[4%] text-[100px]" style={{ animation: 'float 8s ease-in-out infinite' }}>🌾</div>
        <div className="absolute top-[12%] right-[6%] text-[110px]" style={{ animation: 'float-slow 10s ease-in-out infinite' }}>🌱</div>
        <div className="absolute top-[45%] left-[8%] text-[90px]" style={{ animation: 'float-slow 9s ease-in-out infinite' }}>🍃</div>
        <div className="absolute top-[50%] right-[10%] text-[100px]" style={{ animation: 'float 7.5s ease-in-out infinite' }}>🌻</div>
        <div className="absolute bottom-[10%] left-[6%] text-[105px]" style={{ animation: 'float 9.5s ease-in-out infinite' }}>🌽</div>
        <div className="absolute bottom-[15%] right-[8%] text-[95px]" style={{ animation: 'float-slow 8.5s ease-in-out infinite' }}>🌿</div>
      </div>
    </>
  );
}
