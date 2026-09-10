import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  CheckSquare,
  Award,
  FileEdit,
  Timer,
  Bot,
  Calendar,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    courses,
    tasks,
    assessments,
    notes,
    setCurrentView,
    setSelectedCourseId,
    setIsStudyModeActive,
    setIsQuickAddOpen,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  // Global search items
  interface SearchResult {
    id: string;
    type: 'course' | 'task' | 'exam' | 'note' | 'action';
    title: string;
    subtitle: string;
    icon: React.ElementType;
    badge?: string;
    action: () => void;
  }

  const allItems: SearchResult[] = [
    // Standard quick actions
    {
      id: 'act-focus',
      type: 'action',
      title: 'Start Focus Study Session',
      subtitle: 'Launch Pomodoro / Deep Work timer',
      icon: Timer,
      badge: 'Action',
      action: () => {
        setIsStudyModeActive(true);
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'act-add-task',
      type: 'action',
      title: 'Quick Add Task or Exam',
      subtitle: 'Create academic task, assessment or note',
      icon: Zap,
      badge: 'Create',
      action: () => {
        setIsQuickAddOpen(true);
        setIsCommandPaletteOpen(false);
      },
    },
    {
      id: 'act-copilot',
      type: 'action',
      title: 'Ask Academic Copilot',
      subtitle: 'Ask AI questions about courses, schedule or grades',
      icon: Bot,
      badge: 'AI',
      action: () => {
        setCurrentView('ai');
        setIsCommandPaletteOpen(false);
      },
    },
    // Courses
    ...(courses || []).map(c => ({
      id: `c-${c.id}`,
      type: 'course' as const,
      title: `${c.name} (${c.code})`,
      subtitle: `Grade: ${c.currentGrade} / 10 • ${c.ects} ECTS • ${c.room}`,
      icon: BookOpen,
      badge: 'Course',
      action: () => {
        setSelectedCourseId(c.id);
        setCurrentView('courses');
        setIsCommandPaletteOpen(false);
      },
    })),
    // Tasks
    ...(tasks || []).map(t => ({
      id: `t-${t.id}`,
      type: 'task' as const,
      title: t.title,
      subtitle: `Due ${t.dueDate} • Priority: ${t.priority} • ${t.estimatedMinutes} mins`,
      icon: CheckSquare,
      badge: 'Task',
      action: () => {
        setCurrentView('tasks');
        setIsCommandPaletteOpen(false);
      },
    })),
    // Exams
    ...(assessments || []).map(a => ({
      id: `a-${a.id}`,
      type: 'exam' as const,
      title: a.name,
      subtitle: `${a.type.toUpperCase()} • Date: ${a.date} • Weight: ${a.weight}%`,
      icon: Award,
      badge: 'Exam',
      action: () => {
        setCurrentView('exams');
        setIsCommandPaletteOpen(false);
      },
    })),
    // Notes
    ...(notes || []).map(n => ({
      id: `n-${n.id}`,
      type: 'note' as const,
      title: n.title,
      subtitle: `${n.folder || 'Notes'} • Updated: ${n.updatedAt}`,
      icon: FileEdit,
      badge: 'Note',
      action: () => {
        setCurrentView('notes');
        setIsCommandPaletteOpen(false);
      },
    })),
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.badge?.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <div
      id="command-palette-backdrop"
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        id="command-palette-modal"
        className="w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#0d131f]">
          <Search className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, tasks, exams, notes or type an action..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 ml-2">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching courses, tasks, exams, or notes found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/30 text-slate-100'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 ${
                        isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate flex items-center gap-2">
                        {item.title}
                        {item.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 flex-shrink-0 transition-transform ${
                      isSelected ? 'text-amber-400 translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>UNI·MATE Global Index</span>
        </div>
      </div>
    </div>
  );
};
