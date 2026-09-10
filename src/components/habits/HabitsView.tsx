import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  RotateCcw,
  Check,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Habit } from '../../types';

export const HabitsView: React.FC = () => {
  const { habits, addHabit, toggleHabitToday, deleteHabit, todayDateStr } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Study');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly'>('daily');
  const [newTargetDays, setNewTargetDays] = useState(5);

  // Helper: compute past 7 days dates
  const weekDays = [
    { label: 'Thu', date: '2026-09-10', isToday: true },
    { label: 'Wed', date: '2026-09-09' },
    { label: 'Tue', date: '2026-09-08' },
    { label: 'Mon', date: '2026-09-07' },
    { label: 'Sun', date: '2026-09-06' },
    { label: 'Sat', date: '2026-09-05' },
    { label: 'Fri', date: '2026-09-04' },
  ].reverse();

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addHabit({
      title: newTitle.trim(),
      category: newCategory.trim() || 'Study',
      frequency: newFrequency,
      targetDaysPerWeek: Number(newTargetDays) || 5,
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  const totalActiveHabits = habits.length;
  const completedTodayCount = habits.filter(h =>
    h.completedDates.includes(todayDateStr)
  ).length;
  const maxStreak =
    habits.length > 0 ? Math.max(...habits.map(h => h.streak || 0)) : 0;

  return (
    <div id="habits-view" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <Flame className="w-3.5 h-3.5" />
            <span>Productivity • Academic Disciplines</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Daily Habits & Consistency
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {completedTodayCount}/{totalActiveHabits} Done Today
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build unshakeable academic momentum. Track daily study blocks, note reviews, and attendance streaks.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Today's Progress
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
            {completedTodayCount} / {totalActiveHabits}
            <span className="text-xs text-slate-400 font-sans font-normal">
              ({totalActiveHabits > 0 ? Math.round((completedTodayCount / totalActiveHabits) * 100) : 0}%)
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Longest Active Streak
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 flex items-center gap-1.5">
            <Flame className="w-5 h-5 fill-amber-400" />
            {maxStreak} days
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Weekly Discipline Target
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            85.4%
            <span className="text-xs text-slate-400 font-sans font-normal ml-2">
              Consistency Index
            </span>
          </div>
        </div>
      </div>

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800/80 space-y-3">
          <Flame className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No active habits</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Small recurring actions compound into academic excellence. Add your first daily habit.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 cursor-pointer transition-colors"
          >
            Create First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map(habit => {
            const isCompletedToday = habit.completedDates.includes(todayDateStr);

            return (
              <div
                key={habit.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompletedToday
                    ? 'bg-slate-900/80 border-slate-800'
                    : 'bg-slate-900/40 border-slate-800/80'
                }`}
              >
                {/* Left: Checkbox + Title */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                      isCompletedToday
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-sm shadow-amber-500/30'
                        : 'border-slate-700 bg-slate-950 text-transparent hover:border-slate-500'
                    }`}
                    title={isCompletedToday ? 'Mark incomplete' : 'Complete today'}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-sm font-semibold transition-colors ${
                          isCompletedToday ? 'text-slate-100' : 'text-slate-200'
                        }`}
                      >
                        {habit.title}
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {habit.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Target: {habit.targetDaysPerWeek} days/week • {habit.frequency}
                    </p>
                  </div>
                </div>

                {/* Right: 7-Day Consistency Grid & Streak */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                  {/* Past 7 days status */}
                  <div className="flex items-center gap-1.5">
                    {weekDays.map(day => {
                      const done = habit.completedDates.includes(day.date);
                      return (
                        <div key={day.date} className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-mono text-slate-500">
                            {day.label}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono transition-colors ${
                              done
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                                : 'bg-slate-950 text-slate-600 border border-slate-800'
                            }`}
                          >
                            {done ? '✓' : '·'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Streak Counter */}
                  <div className="flex items-center gap-2 min-w-[90px] justify-end">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                      <Flame className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{habit.streak}d</span>
                    </div>

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-2xl bg-[#0d131f] border border-slate-800 p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Flame className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-slate-100">Create New Academic Habit</h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Habit Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Study 1 hour without phone distraction"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Study, Attendance, Health"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Target Days / Week
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={7}
                    value={newTargetDays}
                    onChange={e => setNewTargetDays(parseInt(e.target.value) || 5)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
