import React, { useState } from 'react';
import {
  Pin,
  Trash2,
  Plus,
  Sparkles,
  Coffee,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrainDumpSticky } from '../../types';

export const StudentChaosScratchpad: React.FC = () => {
  const {
    stickies,
    addSticky,
    deleteSticky,
    toggleStickyPin,
    caffeineCups,
    addCaffeineCup,
    isChaosMode,
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const [selectedColor, setSelectedColor] = useState<BrainDumpSticky['color']>('yellow');
  const [selectedTag, setSelectedTag] = useState('URGENT');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    addSticky(inputVal.trim(), selectedColor, selectedTag);
    setInputVal('');
    setShowAddForm(false);
  };

  const colorStyles: Record<
    BrainDumpSticky['color'],
    { bg: string; text: string; tape: string; tagBg: string }
  > = {
    yellow: {
      bg: 'bg-amber-100 dark:bg-[#fef08a] border-amber-300 shadow-amber-900/10',
      text: 'text-amber-950',
      tape: 'bg-amber-200/50 border-amber-300/60',
      tagBg: 'bg-amber-950/15 text-amber-900 border-amber-950/20',
    },
    pink: {
      bg: 'bg-pink-100 dark:bg-[#fbcfe8] border-pink-300 shadow-pink-900/10',
      text: 'text-pink-950',
      tape: 'bg-pink-200/50 border-pink-300/60',
      tagBg: 'bg-pink-950/15 text-pink-900 border-pink-950/20',
    },
    cyan: {
      bg: 'bg-cyan-100 dark:bg-[#a5f3fc] border-cyan-300 shadow-cyan-900/10',
      text: 'text-cyan-950',
      tape: 'bg-cyan-200/50 border-cyan-300/60',
      tagBg: 'bg-cyan-950/15 text-cyan-900 border-cyan-950/20',
    },
    green: {
      bg: 'bg-emerald-100 dark:bg-[#bbf7d0] border-emerald-300 shadow-emerald-900/10',
      text: 'text-emerald-950',
      tape: 'bg-emerald-200/50 border-emerald-300/60',
      tagBg: 'bg-emerald-950/15 text-emerald-900 border-emerald-950/20',
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-[#e9d5ff] border-purple-300 shadow-purple-900/10',
      text: 'text-purple-950',
      tape: 'bg-purple-200/50 border-purple-300/60',
      tagBg: 'bg-purple-950/15 text-purple-900 border-purple-950/20',
    },
  };

  const tagOptions = ['EDIT LAB', 'ESSAY QUOTE', 'GEAR', 'DAVINCI', 'SEMINAR', 'TODO', 'IDEA'];

  return (
    <div
      id="student-mind-scratchpad"
      className="relative rounded-2xl bg-gradient-to-b from-[#131722]/95 to-[#0e121b]/95 border border-amber-500/25 p-5 md:p-6 backdrop-blur-xl shadow-2xl overflow-hidden"
    >
      {/* Subtle Coffee Stain Ring Watermark on corner */}
      <div
        className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full pointer-events-none opacity-20 border-[8px] border-amber-800/80 shadow-[inset_0_0_20px_rgba(180,83,9,0.3)] rotate-12"
        aria-hidden="true"
      >
        <div className="absolute inset-2 rounded-full border-[3px] border-dashed border-amber-900/60" />
      </div>

      {/* Header section with Studio Title & Espresso counter */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2 font-serif">
              STUDIO PINBOARD & DESK SCRATCHPAD
              <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {stickies.length} Notes Pinned
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-sans">
              Handwritten sticky notes, gear reminders, essay quotes & editing shortcuts
            </p>
          </div>
        </div>

        {/* Quick Caffeine / Espresso counter */}
        <div className="flex items-center gap-2">
          <button
            onClick={addCaffeineCup}
            title="Log an espresso"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium transition-all hover:scale-102 active:scale-98 shadow-sm cursor-pointer group"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Espresso #{caffeineCups}</span>
          </button>

          <button
            onClick={() => setShowAddForm(prev => !prev)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Pin Sticky</span>
          </button>
        </div>
      </div>

      {/* Interactive Sticky Creation Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 p-4 rounded-xl bg-[#0b0e16] border border-amber-500/30 space-y-3 relative z-10 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              PIN A NEW STICKY NOTE TO DESK
            </span>
            <div className="flex items-center gap-1.5">
              {(['yellow', 'pink', 'cyan', 'green', 'purple'] as const).map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    color === 'yellow'
                      ? 'bg-amber-300 border-amber-400'
                      : color === 'pink'
                      ? 'bg-pink-300 border-pink-400'
                      : color === 'cyan'
                      ? 'bg-cyan-300 border-cyan-400'
                      : color === 'green'
                      ? 'bg-emerald-300 border-emerald-400'
                      : 'bg-purple-300 border-purple-400'
                  } ${selectedColor === color ? 'scale-125 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <textarea
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Type a studio note, gear reminder, essay quote, or grading shortcut..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 font-sans"
            autoFocus
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Tag:</span>
              {tagOptions.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    selectedTag === tag
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                Stick to Board 📌
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Chaotic Sticky Board Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 relative z-10">
        {stickies.map(sticky => {
          const style = colorStyles[sticky.color] || colorStyles.yellow;
          const rotationAngle = isChaosMode ? sticky.rotation || 0 : 0;

          return (
            <div
              key={sticky.id}
              style={{
                transform: `rotate(${rotationAngle}deg)`,
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              className={`group relative p-4 pt-5 rounded-lg border ${style.bg} ${style.text} shadow-lg hover:shadow-2xl hover:scale-[1.04] hover:z-20 transition-all flex flex-col justify-between min-h-[140px]`}
            >
              {/* Scotch Tape Strip at the Top */}
              <div
                className={`tape-strip ${style.tape}`}
                aria-hidden="true"
              />

              {/* Top Controls: Tag & Pin & Delete */}
              <div className="flex items-center justify-between mb-2">
                {sticky.tag ? (
                  <span
                    className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded border ${style.tagBg} tracking-wider`}
                  >
                    {sticky.tag}
                  </span>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toggleStickyPin(sticky.id)}
                    title={sticky.isPinned ? 'Unpin sticky' : 'Pin sticky'}
                    className="p-1 rounded hover:bg-black/10 transition-colors cursor-pointer"
                  >
                    <Pin
                      className={`w-3 h-3 ${sticky.isPinned ? 'fill-current opacity-90' : 'opacity-50'}`}
                    />
                  </button>
                  <button
                    onClick={() => deleteSticky(sticky.id)}
                    title="Crumple & Discard note"
                    className="p-1 rounded hover:bg-red-500/20 text-red-900 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Handwriting Content */}
              <div className="font-handwriting text-lg leading-snug my-auto select-text font-bold tracking-wide">
                {sticky.text}
              </div>

              {/* Footer Timestamp */}
              <div className="flex items-center justify-between pt-2 border-t border-black/10 text-[10px] font-mono opacity-70">
                <span>{sticky.createdAt}</span>
                <span className="text-[8px] uppercase tracking-widest font-sans font-bold">
                  STUDENT MIND
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {stickies.length === 0 && (
        <div className="text-center py-8 text-slate-500 space-y-2">
          <p className="text-sm font-mono">Your mental scratchpad is currently empty.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-xs text-cyan-400 hover:underline font-semibold"
          >
            + Scribble down your first chaotic sticky note
          </button>
        </div>
      )}
    </div>
  );
};
