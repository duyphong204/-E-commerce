import React from "react";

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export function Loading({
  fullScreen = true,
  message = "Đang tải dữ liệu...",
}: LoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center relative overflow-hidden transition-all ${
        fullScreen ? "min-h-[70vh] py-16" : "py-12"
      }`}
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-300/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

      {/* Glassmorphic Container Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-gray-100/80 shadow-xl shadow-gray-200/50 rounded-3xl p-8 sm:p-10 flex flex-col items-center max-w-xs sm:max-w-sm w-full mx-4">
        {/* Modern Spinner Rings */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mb-6">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-400 animate-spin" />
          
          {/* Inner Reverse Ring */}
          <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-emerald-600 border-l-teal-400 animate-spin [animation-duration:1.2s] [animation-direction:reverse]" />

          {/* Center Glowing Dot */}
          <div className="w-4 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
        </div>

        {/* Message */}
        {message && (
          <div className="flex items-center gap-1.5 text-center">
            <span className="text-sm sm:text-base font-bold text-gray-800 tracking-wide">
              {message}
            </span>
            <span className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0s]" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>
        )}

        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mt-3">
          Rabbit Store
        </p>
      </div>
    </div>
  );
}

export default Loading;
