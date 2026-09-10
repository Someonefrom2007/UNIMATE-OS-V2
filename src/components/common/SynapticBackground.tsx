import React from 'react';

export const SynapticBackground: React.FC = () => {
  return (
    <div
      id="studio-ambient-backdrop"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden ambient-mesh"
    >
      {/* Floating gradient orbs - animated depth layers */}
      <div className="absolute -top-80 -right-80 w-[320px] h-[320px] bg-gradient-to-br from-violet-500/20 via-purple-600/10 to-transparent rounded-full blur-[160px] orb-float-1" />
      <div className="absolute -bottom-80 -left-80 w-[280px] h-[280px] bg-gradient-to-tr from-blue-500/15 via-indigo-600/10 to-transparent rounded-full blur-[140px] orb-float-2" />
      <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-gradient-to-br from-pink-500/10 via-rose-500/5 to-transparent rounded-full blur-[120px] orb-float-3" />
      
      {/* Subtle center glow for depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-violet-500/3 via-transparent to-blue-500/3 rounded-full blur-[200px] opacity-40" />
      
      {/* Noise texture for organic feel */}
      <div className="noise-overlay" />
    </div>
  );
};
