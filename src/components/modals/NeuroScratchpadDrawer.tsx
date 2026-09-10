import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Sparkles,
  Coffee,
  Zap,
  Trash2,
  Pin,
  Flame,
  Brain,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrainDumpSticky } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const NeuroScratchpadDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    stickies,
    addSticky,
    deleteSticky,
    toggleStickyPin,
    caffeineCups,
    addCaffeineCup,
    isChaosMode,
    toggleChaosMode,
  } = useApp();

  const [text, setText] = useState('');
  const [color, setColor] = useState<BrainDumpSticky['color']>('yellow');
  const [tag, setTag] = useState('STUDIO NOTE');

  // Keyboard shortcut: Esc to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    addSticky(text.trim(), color, tag);
    setText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0c1018] border-l border-amber-500/25 h-full flex flex-col shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top warm accent line */}
        <div className="h-1 w-full bg-amber-500/60" />

        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-serif font-bold text-slate-100 flex items-center gap-2">
                STUDIO PINBOARD
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {stickies.length} Notes
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Quick marginalia, gear codes, quotes & editing reminders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Sticky Input */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-slate-800 bg-slate-900/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-amber-400 uppercase">
              ✍️ Quick Desk Note:
            </span>
            <div className="flex items-center gap-1.5">
              {(['yellow', 'pink', 'cyan', 'green', 'purple'] as const).map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    c === 'yellow'
                      ? 'bg-amber-300'
                      : c === 'pink'
                      ? 'bg-pink-300'
                      : c === 'cyan'
                      ? 'bg-cyan-300'
                      : c === 'green'
                      ? 'bg-emerald-300'
                      : 'bg-purple-300'
                  } ${color === c ? 'scale-125 ring-2 ring-amber-400' : 'opacity-60'}`}
                />
              ))}
            </div>
          </div>

          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type anything... Exam leak, caffeine scream, homework thought, formula..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 focus:border-cyan-400 text-slate-100 text-sm focus:outline-none font-sans placeholder:text-slate-600"
            autoFocus
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {['EXAM', 'IDEA', 'WTF', 'URGENT'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`text-[9px] font-mono px-2 py-0.5 rounded cursor-pointer ${
                    tag === t ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!text.trim()}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs hover:brightness-110 disabled:opacity-40 transition-all cursor-pointer shadow-md"
            >
              Pin to Mind 📌
            </button>
          </div>
        </form>

        {/* Stickies List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {stickies.map(sticky => {
            const bgClass =
              sticky.color === 'yellow'
                ? 'bg-[#fef08a] text-amber-950 border-amber-300'
                : sticky.color === 'pink'
                ? 'bg-[#fbcfe8] text-pink-950 border-pink-300'
                : sticky.color === 'cyan'
                ? 'bg-[#a5f3fc] text-cyan-950 border-cyan-300'
                : sticky.color === 'green'
                ? 'bg-[#bbf7d0] text-emerald-950 border-emerald-300'
                : 'bg-[#e9d5ff] text-purple-950 border-purple-300';

            return (
              <div
                key={sticky.id}
                className={`p-3.5 rounded-lg border shadow-md relative group transition-all hover:scale-[1.02] ${bgClass}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  {sticky.tag ? (
                    <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-black/10 border border-black/10">
                      {sticky.tag}
                    </span>
                  ) : (
                    <span />
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStickyPin(sticky.id)}
                      className="p-1 rounded hover:bg-black/10 transition-colors cursor-pointer"
                    >
                      <Pin
                        className={`w-3 h-3 ${sticky.isPinned ? 'fill-current opacity-90' : 'opacity-40'}`}
                      />
                    </button>
                    <button
                      onClick={() => deleteSticky(sticky.id)}
                      className="p-1 rounded hover:bg-red-500/20 text-red-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="font-handwriting text-lg leading-snug font-bold mb-2">
                  {sticky.text}
                </div>

                <div className="text-[9px] font-mono opacity-60 flex justify-between items-center border-t border-black/10 pt-1">
                  <span>{sticky.createdAt}</span>
                  <span>PINNED IN BRAIN</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Caffeine Booster */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-slate-300">
              Coffee Count: <strong className="text-amber-400">{caffeineCups}</strong>
            </span>
          </div>
          <button
            onClick={addCaffeineCup}
            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-semibold transition-all cursor-pointer"
          >
            +1 Cup (+120mg)
          </button>
        </div>
      </div>
    </div>
  );
};
