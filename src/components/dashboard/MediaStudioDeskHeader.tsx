import React, { useState, useEffect } from 'react';
import {
  Film,
  Clock,
  Camera,
  Layers,
  Sparkles,
  Coffee,
  Headphones,
  Volume2,
  VolumeX,
  Calendar,
  Compass,
  FileText,
  Sliders,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MediaStudioDeskHeader: React.FC = () => {
  const {
    profile,
    assessments,
    caffeineCups,
    addCaffeineCup,
    isAudioMuted,
    toggleAudioMute,
    isAmbientDroneActive,
    toggleAmbientDroneSound,
    projects,
    setCurrentView,
    setSelectedCourseId,
  } = useApp();

  // Find next upcoming major screening or defense
  const nextExam = assessments.find(a => a.status === 'upcoming') || assessments[0];

  // Countdown to next milestone
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 6,
    hours: 20,
    minutes: 42,
    seconds: 14,
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

  const activeProject = projects[0];

  return (
    <div
      id="media-studio-desk-header"
      className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-[#121620] via-[#10131c] to-[#0d1017] border border-slate-800/90 shadow-2xl relative overflow-hidden"
    >
      {/* Subtle analog film roll watermark frame */}
      <div className="absolute top-3 right-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500/60 pointer-events-none select-none">
        <span>TC 01:14:22:08</span>
        <span>•</span>
        <span>24.00 FPS</span>
        <span>•</span>
        <span className="text-amber-500/80 font-bold">REC ●</span>
      </div>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: Studio & Production Identity */}
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-medium">
              <Film className="w-3 h-3 text-amber-400" />
              UPF Media Studio & Production Desk
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Semester 1 • Fall 2026
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-serif text-slate-100 font-medium tracking-tight">
            Director's Academic Log & Screen Horizon
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Tracking pre-production, rough cuts, and critical theory readings across Audiovisual Studies. All media assets linked to Department of Communication servers.
          </p>
        </div>

        {/* Right: Studio Quick Utilities */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
          {/* Caffeine / Espresso logger */}
          <button
            id="studio-espresso-counter"
            onClick={addCaffeineCup}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/30 text-amber-200 text-xs font-mono transition-all cursor-pointer shadow-sm group"
            title="Log espresso / coffee intake"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{caffeineCups} Espressos</span>
            <span className="text-[10px] text-amber-500/80 font-sans">+ Log</span>
          </button>

          {/* Sound / Edit Ambience Drone */}
          <button
            id="studio-ambience-drone-toggle"
            onClick={toggleAmbientDroneSound}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-sm ${
              isAmbientDroneActive
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-amber-500/10'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Toggle analog tape hiss / focus room tone for deep reading"
          >
            <Headphones className={`w-3.5 h-3.5 ${isAmbientDroneActive ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span>{isAmbientDroneActive ? 'Tape Ambience (ON)' : 'Tape Ambience'}</span>
          </button>

          {/* UI Mute */}
          <button
            onClick={toggleAudioMute}
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isAudioMuted ? 'Unmute feedback' : 'Mute feedback'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* 3 Studio Workstation Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5 pt-4 border-t border-slate-800/80">
        {/* Card 1: Active Production Project */}
        <div
          onClick={() => setCurrentView('tasks')}
          className="p-3.5 rounded-xl bg-[#0e121a]/80 border border-slate-800/80 hover:border-amber-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <Camera className="w-3 h-3" />
              Active Production
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {activeProject?.progress || 68}% Locked
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-1 font-serif">
            {activeProject?.title || 'Documentary Short: Echoes of Poblenou'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Fine cut assembly • Music score integration in progress
          </p>
          <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden mt-2.5">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${activeProject?.progress || 68}%` }}
            />
          </div>
        </div>

        {/* Card 2: Edit Suite & Equipment Status */}
        <div
          onClick={() => setCurrentView('schedule')}
          className="p-3.5 rounded-xl bg-[#0e121a]/80 border border-slate-800/80 hover:border-cyan-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              Facilities & Lab
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Booked 14:00
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors font-serif">
            Edit Bay 4B • DaVinci Studio 19
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">
            Sony FX3 + 35mm GM reserved for weekend harbor shoot
          </p>
          <div className="text-[10px] font-mono text-slate-500 mt-2 flex items-center gap-2">
            <span>Flanders Monitor Calibrated</span>
            <span>•</span>
            <span className="text-cyan-400/90">RAID 0 Ready</span>
          </div>
        </div>

        {/* Card 3: Screening & Defense Horizon */}
        <div
          onClick={() => setCurrentView('exams')}
          className="p-3.5 rounded-xl bg-[#0e121a]/80 border border-slate-800/80 hover:border-amber-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Next Oral Defense
            </span>
            <span className="text-[10px] font-mono text-amber-300 font-bold">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-1 font-serif">
            {nextExam?.name || 'Cinema Aesthetics Midterm Defense'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
            Screen 5-minute rough cut • Oral defense of montage theory
          </p>
          <div className="text-[10px] font-mono text-slate-500 mt-2 flex items-center gap-2">
            <span>Weight: 35%</span>
            <span>•</span>
            <span className="text-amber-400/90">Screening Hall A</span>
          </div>
        </div>
      </div>
    </div>
  );
};
