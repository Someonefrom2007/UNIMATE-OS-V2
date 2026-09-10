import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Trash2,
  Edit2,
  Award,
  Sparkles,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Goal } from '../../types';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal, courses } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentProgress, setCurrentProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(10);
  const [unit, setUnit] = useState('Problems');
  const [category, setCategory] = useState<Goal['category']>('academic');
  const [deadline, setDeadline] = useState('2026-12-15');

  const filteredGoals = goals.filter(g => {
    if (categoryFilter === 'all') return true;
    return g.category === categoryFilter;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addGoal({
      title: title.trim(),
      description: description.trim(),
      currentProgress: Number(currentProgress),
      targetProgress: Number(targetProgress),
      unit: unit.trim() || 'Units',
      category,
      deadline,
      status: 'active',
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handleQuickIncrement = (goal: Goal, amount: number) => {
    const nextVal = Math.min(goal.targetProgress, Math.max(0, goal.currentProgress + amount));
    const isCompleted = nextVal >= goal.targetProgress;
    updateGoal(goal.id, {
      currentProgress: Number(nextVal.toFixed(1)),
      status: isCompleted ? 'completed' : 'active',
    });
  };

  // Metrics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const avgCompletion =
    totalGoals > 0
      ? Math.round(
          goals.reduce(
            (acc, g) => acc + Math.min(100, (g.currentProgress / g.targetProgress) * 100),
            0
          ) / totalGoals
        )
      : 0;

  return (
    <div id="goals-view" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <Target className="w-3.5 h-3.5" />
            <span>Productivity • Intentional Milestones</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Academic & Semester Goals
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {goals.length} Goals
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Define quantifiable target outcomes across your degree, semester GPA, exam mastery, and study consistency.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Active Targets
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {totalGoals - completedGoals}
            <span className="text-xs text-slate-500 font-sans ml-1.5 font-normal">
              of {totalGoals} total
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Milestones Reached
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 flex items-center gap-2">
            {completedGoals}
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Aggregate Momentum
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400">
            {avgCompletion}%
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Goals' },
          { id: 'academic', label: 'Academic & GPA' },
          { id: 'study', label: 'Study & Mastery' },
          { id: 'university', label: 'University & ECTS' },
          { id: 'personal', label: 'Personal & Career' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              categoryFilter === cat.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800/80 space-y-3">
          <Target className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">No goals found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Set ambitious semester targets to stay focused and measure your academic growth.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 cursor-pointer transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredGoals.map(goal => {
            const percent = Math.min(
              100,
              Math.round((goal.currentProgress / goal.targetProgress) * 100)
            );
            const isFinished = goal.status === 'completed' || percent >= 100;

            return (
              <div
                key={goal.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  isFinished
                    ? 'bg-emerald-950/15 border-emerald-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {goal.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {goal.deadline}
                      </span>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
                    {goal.title}
                    {isFinished && (
                      <span className="text-emerald-400 text-xs font-mono font-normal">
                        ✓ Achieved
                      </span>
                    )}
                  </h3>

                  {goal.description && (
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">
                      {goal.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-mono text-slate-400">
                      Progress: <strong className="text-slate-100 font-mono text-sm">{goal.currentProgress}</strong> / {goal.targetProgress} {goal.unit}
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {percent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isFinished
                          ? 'bg-emerald-400'
                          : 'bg-gradient-to-r from-amber-500 to-amber-300'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Quick Steppers */}
                  {!isFinished && (
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-[11px] text-slate-500 font-mono">Quick Update:</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleQuickIncrement(goal, 1)}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => handleQuickIncrement(goal, 5)}
                          className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs cursor-pointer"
                        >
                          +5
                        </button>
                        <button
                          onClick={() =>
                            updateGoal(goal.id, {
                              currentProgress: goal.targetProgress,
                              status: 'completed',
                            })
                          }
                          className="px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-mono text-xs border border-emerald-500/30 cursor-pointer"
                        >
                          Mark Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-2xl bg-[#0d131f] border border-slate-800 p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Target className="w-4 h-4" />
                </span>
                <h2 className="text-base font-bold text-slate-100">Set New Milestone Goal</h2>
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
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Score ≥ 8.5 in Algorithms Midterm"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Description / Strategy
                </label>
                <textarea
                  rows={2}
                  placeholder="What actionable steps will get you there?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Current
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={currentProgress}
                    onChange={e => setCurrentProgress(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Target *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={targetProgress}
                    onChange={e => setTargetProgress(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    placeholder="GPA, ECTS, Pbs"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as Goal['category'])}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="academic">Academic & GPA</option>
                    <option value="study">Study Mastery</option>
                    <option value="university">University ECTS</option>
                    <option value="personal">Personal / Career</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Target Deadline
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
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
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
