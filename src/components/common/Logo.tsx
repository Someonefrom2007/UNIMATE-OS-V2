import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-sm font-semibold tracking-wider',
    md: 'text-base font-bold tracking-wider',
    lg: 'text-xl font-extrabold tracking-wider',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Glassmorphism UNI·MATE Diamond Logo */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 via-purple-600/20 to-indigo-600/30 backdrop-blur-xl border border-white/10 shadow-xl shadow-violet-500/10`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5/6 h-5/6 text-white drop-shadow-lg"
        >
          {/* Geometric diamond with inner glow */}
          <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
          <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" fill="currentColor" stroke="none" opacity="0.8" />
          <path d="M12 22V14" strokeWidth="1.5" opacity="0.6" />
        </svg>
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
      </div>

      <div className="flex flex-col">
        <span className={`font-mono ${textSizes[size]} text-slate-100 flex items-center`}>
          UNI<span className="gradient-text font-black mx-0.5">·</span>MATE
        </span>
        {showTagline && (
          <span className="text-[10px] text-slate-400 font-medium tracking-tight">
            Your university, organized around you.
          </span>
        )}
      </div>
    </div>
  );
};
