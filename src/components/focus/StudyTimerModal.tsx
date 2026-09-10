import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Coffee,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudyTimerModal: React.FC = () => {
  const {
    isStudyModeActive,
    setIsStudyModeActive,
    activeFocusCourseId,
    activeFocusTaskId,
    courses,
    tasks,
    todayDateStr,
    addFocusSession,
  } = useApp();

  const [mode, setMode] = useState<'pomodoro' | 'stopwatch' | 'custom'>('pomodoro');
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [soundType, setSoundType] = useState<'rain' | 'library' | 'alpha'>('alpha');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reflection after session
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionNotes, setReflectionNotes] = useState('');
  const [reflectionRating, setReflectionRating] = useState<1 | 2 | 3 | 4 | 5>(5);

  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Target context
  const course = courses.find(c => c.id === activeFocusCourseId);
  const task = tasks.find(t => t.id === activeFocusTaskId);

  // Ambient sound generator via Web Audio API (white noise / filtered brown noise / gentle hum)
  useEffect(() => {
    if (isSoundOn) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = ctx;

        // Create brown/pink noise generator
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02; // Brown noise approximation
          lastOut = data[i];
          data[i] *= 0.15; // Soft volume
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = soundType === 'rain' ? 'lowpass' : 'bandpass';
        filter.frequency.value = soundType === 'rain' ? 600 : 250;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.3;

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
        noiseNodeRef.current = noise;
      } catch (err) {
        console.error('Web audio sound error:', err);
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [isSoundOn, soundType]);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsRemaining <= 0) {
      setIsActive(false);
      setIsSoundOn(false);
      setShowReflection(true);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  if (!isStudyModeActive) return null;

  const handleModeChange = (newMode: 'pomodoro' | 'stopwatch' | 'custom', mins: number) => {
    setMode(newMode);
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
    setIsActive(false);
    setIsBreak(false);
  };

  const handleFinishReflection = () => {
    const elapsedMinutes = durationMinutes - Math.floor(secondsRemaining / 60);
    const recordedMinutes = elapsedMinutes > 0 ? elapsedMinutes : durationMinutes;

    addFocusSession({
      courseId: course?.id || undefined,
      taskId: task?.id || undefined,
      durationMinutes: recordedMinutes,
      date: todayDateStr,
      notes: reflectionNotes || 'Productive deep work focus session.',
      qualityRating: reflectionRating,
    });

    setShowReflection(false);
    setIsStudyModeActive(false);
  };

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const progressPct = ((durationMinutes * 60 - secondsRemaining) / (durationMinutes * 60)) * 100;

  return (
    <div
      id="study-timer-overlay"
      className={`fixed inset-0 z-50 bg-[#070b13]/95 backdrop-blur-xl flex flex-col justify-between p-6 ${
        isFullscreen ? 'p-12' : ''
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
            {isBreak ? '☕ Break Window' : '🎯 Deep Study Focus'}
          </span>
          {course && (
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: course.color }} />
              {course.code} • {course.name}
            </span>
          )}
          {task && (
            <span className="text-xs text-slate-400 truncate max-w-xs">
              Task: {task.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Ambient Sound Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isSoundOn ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Toggle Ambient Focus Noise"
            >
              {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            {isSoundOn && (
              <select
                value={soundType}
                onChange={e => setSoundType(e.target.value as any)}
                className="bg-transparent text-[11px] text-slate-300 focus:outline-none pr-1"
              >
                <option value="alpha">Alpha Wave</option>
                <option value="rain">Soft Rain</option>
                <option value="library">Brown Noise</option>
              </select>
            )}
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setIsActive(false);
              setIsSoundOn(false);
              setIsStudyModeActive(false);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Focus Clock Body */}
      {!showReflection ? (
        <div className="flex flex-col items-center justify-center space-y-8 max-w-md mx-auto text-center">
          {/* Preset Buttons */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 text-xs font-semibold">
            <button
              onClick={() => handleModeChange('pomodoro', 25)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                durationMinutes === 25 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              25m Pomodoro
            </button>
            <button
              onClick={() => handleModeChange('pomodoro', 50)}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                durationMinutes === 50 ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              50m Deep Block
            </button>
            <button
              onClick={() => {
                setIsBreak(true);
                handleModeChange('pomodoro', 5);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                isBreak ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5m Break
            </button>
          </div>

          {/* Glowing Timer Ring */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-amber-400 fill-transparent transition-all duration-500"
                strokeWidth="6"
                strokeDasharray="1000"
                strokeDashoffset={1000 - (1000 * progressPct) / 100}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-6xl md:text-7xl font-black font-mono tracking-tighter text-slate-100">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </span>
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-2">
                {isActive ? 'Session Active' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setSecondsRemaining(durationMinutes * 60);
                setIsActive(false);
              }}
              className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsActive(!isActive)}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
            >
              {isActive ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950" />}
              <span>{isActive ? 'Pause Focus' : 'Start Session'}</span>
            </button>

            <button
              onClick={() => {
                setIsActive(false);
                setShowReflection(true);
              }}
              className="p-3 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Complete & Log Session"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* End-of-Session Reflection Card */
        <div className="max-w-md mx-auto bg-[#0f172a] border border-slate-800 p-6 rounded-2xl space-y-4 text-left shadow-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">Focus Reflection</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Great work! What specific problem, topic, or section did you complete during this window?
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Session Summary</label>
            <textarea
              rows={3}
              value={reflectionNotes}
              onChange={e => setReflectionNotes(e.target.value)}
              placeholder="e.g. Solved 3 Dynamic Programming problems and annotated Dijkstra proof..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Focus Quality (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setReflectionRating(rating as any)}
                  className={`flex-1 py-1.5 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                    reflectionRating === rating
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  {rating} ★
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              onClick={handleFinishReflection}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Record & Save Session
            </button>
          </div>
        </div>
      )}

      {/* Motivational Footer */}
      <div className="text-center text-xs text-slate-500 font-mono">
        "Concentrated attention is the master key to intellectual superiority." — Academic Focus
      </div>
    </div>
  );
};
