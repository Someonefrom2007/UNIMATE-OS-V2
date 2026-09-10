import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Coffee,
  Zap,
  Radio,
  Timer,
  Volume2,
  VolumeX,
  Headphones,
  Sliders,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FuturisticTelemetryHud: React.FC = () => {
  const {
    isChaosMode,
    toggleChaosMode,
    caffeineCups,
    addCaffeineCup,
    isAudioMuted,
    toggleAudioMute,
    isAmbientDroneActive,
    toggleAmbientDroneSound,
    workload,
    semesterHealth,
    assessments,
    todayDateStr,
    gpa,
  } = useApp();

  // Find next upcoming major exam for live ticking countdown
  const nextExam = assessments.find(a => a.status === 'upcoming') || assessments[0];

  // Calculate live countdown to exam date
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 6,
    hours: 22,
    minutes: 41,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fluctuating cognitive frequency simulation for that cyber wow factor
  const [synapseFreq, setSynapseFreq] = useState('14.2');
  useEffect(() => {
    const interval = setInterval(() => {
      const base = isChaosMode ? 16.4 : 12.8;
      const variation = (Math.random() * 1.6 - 0.8).toFixed(1);
      setSynapseFreq((base + parseFloat(variation)).toFixed(1));
    }, 2000);
    return () => clearInterval(interval);
  }, [isChaosMode]);

  // Caffeine saturation percent (clamped 0 to 100)
  const caffeinePercent = Math.min(100, Math.max(20, caffeineCups * 22));

  // Cognitive strain level from workload engine
  const cognitiveStrain =
    workload.predictiveWarning?.level === 'critical'
      ? 94
      : workload.predictiveWarning?.level === 'heavy'
      ? 78
      : workload.thisWeek?.strainLevel === 'heavy'
      ? 72
      : 54;

  return (
    <div
      id="futuristic-telemetry-hud"
      className={`relative rounded-2xl p-5 md:p-6 transition-all duration-500 backdrop-blur-xl border ${
        isChaosMode
          ? 'bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-purple-950/40 border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)]'
          : 'bg-slate-900/80 border-slate-800 shadow-lg'
      }`}
    >
      {/* Top Cyber Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span
              className={`flex h-3 w-3 rounded-full ${
                isChaosMode ? 'bg-cyan-400 animate-ping opacity-75' : 'bg-emerald-400'
              }`}
            />
            <span
              className={`absolute top-0 left-0 h-3 w-3 rounded-full ${
                isChaosMode ? 'bg-cyan-400' : 'bg-emerald-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-cyber tracking-wider text-slate-100 uppercase">
                NEURAL COCKPIT & STUDENT TELEMETRY
              </h2>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                  isChaosMode
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isChaosMode ? '⚡ OVERCLOCK: STUDENT MIND' : '✦ ZEN DISCIPLINE'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              SYNAPSE CLOCK: {synapseFreq} GHz • SEMESTER EFFICIENCY: {semesterHealth.overall}%
            </p>
          </div>
        </div>

        {/* Action Controls: Overclock Switch, Audio FX & Binaural Drone */}
        <div className="flex items-center gap-2">
          {/* Audio Mute/Unmute */}
          <button
            onClick={toggleAudioMute}
            title={isAudioMuted ? 'Unmute Futuristic UI Sounds' : 'Mute Futuristic UI Sounds'}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isAudioMuted
                ? 'bg-slate-800/60 border-slate-700 text-slate-500'
                : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 shadow-sm shadow-cyan-500/10'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* Binaural Drone for Deep Study */}
          <button
            onClick={toggleAmbientDroneSound}
            title={
              isAmbientDroneActive
                ? 'Stop 432Hz Alpha Wave Drone'
                : 'Play 432Hz Alpha Wave Study Drone (Web Audio)'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              isAmbientDroneActive
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse'
                : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alpha Drone</span>
            {isAmbientDroneActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
          </button>

          {/* Overclock / Chaos Mode Toggle */}
          <button
            id="hud-overclock-toggle"
            onClick={toggleChaosMode}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-cyber font-bold tracking-wider transition-all cursor-pointer ${
              isChaosMode
                ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-slate-950 shadow-md shadow-cyan-500/30 hover:brightness-110'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${isChaosMode ? 'fill-current animate-bounce' : ''}`} />
            <span>{isChaosMode ? 'OVERCLOCKED' : 'ENGAGE OVERCLOCK'}</span>
          </button>
        </div>
      </div>

      {/* Futuristic Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cognitive Load & Synaptic Stress */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-cyan-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              Cognitive Strain
            </span>
            <span className="text-xs font-mono font-bold text-cyan-300">{cognitiveStrain}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-pink-500 h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
              style={{ width: `${cognitiveStrain}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Buffer: {100 - cognitiveStrain}%</span>
            <span className={cognitiveStrain > 75 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
              {cognitiveStrain > 75 ? '⚡ HIGH LOAD' : 'BALANCED'}
            </span>
          </div>
        </div>

        {/* Metric 2: Caffeine Saturation & Bio-Stamina */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Coffee className="w-3.5 h-3.5" />
              Caffeine Saturation
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">{caffeinePercent}%</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-2 rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(245,158,11,0.6)]"
              style={{ width: `${caffeinePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>{caffeineCups} Cups Logged</span>
            <button
              onClick={addCaffeineCup}
              className="text-amber-300 hover:text-amber-200 font-bold cursor-pointer hover:underline"
            >
              + Sip (+120mg)
            </button>
          </div>
        </div>

        {/* Metric 3: Critical Exam Horizon Countdown */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-purple-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              Exam Horizon
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
              {nextExam ? nextExam.name.split(' ')[0] : 'Midterm'}
            </span>
          </div>

          <div className="font-cyber font-bold text-base text-slate-100 tracking-wider flex items-center gap-1">
            <span className="text-purple-300">{timeLeft.days}d</span>
            <span className="text-slate-500">:</span>
            <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
            <span className="text-slate-500">:</span>
            <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
            <span className="text-slate-500">:</span>
            <span className="text-pink-400 text-xs">{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono truncate mt-1">
            {nextExam?.name || 'Algorithms & Data Structures'}
          </div>
        </div>

        {/* Metric 4: Academic Trajectory & GPA */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 relative overflow-hidden group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              GPA & Academic Health
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300">{gpa} / 10.0</span>
          </div>

          <div className="flex items-baseline gap-2">
            <div className="text-lg font-cyber font-bold text-emerald-400">{semesterHealth.academicStanding}</div>
            <div className="text-[10px] font-mono text-slate-400">Score: {semesterHealth.overall}/100</div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>ECTS: 142/180</span>
            <span className="text-emerald-400 font-bold">ON TARGET</span>
          </div>
        </div>
      </div>
    </div>
  );
};
