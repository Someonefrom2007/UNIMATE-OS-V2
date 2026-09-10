import React, { useState } from 'react';
import {
  Timer,
  Play,
  Flame,
  CheckCircle2,
  BookOpen,
  Calendar,
  Check,
  Award,
  Plus,
  BarChart2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FocusView: React.FC = () => {
  const {
    focusSessions,
    habits,
    courses,
    tasks,
    todayDateStr,
    setIsStudyModeActive,
    setActiveFocusContext,
    toggleHabitToday,
    setIsQuickAddOpen,
  } = useApp();

  const [selectedCourseForSession, setSelectedCourseForSession] = useState<string>(
    courses[0]?.id || ''
  );

  // Compute stats
  const todayMins = focusSessions
    .filter(f => f.date === todayDateStr)
    .reduce((sum, f) => sum + f.durationMinutes, 0);

  const totalMins = focusSessions.reduce((sum, f) => sum + f.durationMinutes, 0);
  const totalHours = (totalMins / 60).toFixed(1);

  // Focus by course
  const courseFocusMap: Record<string, number> = {};
  focusSessions.forEach(f => {
    if (f.courseId) {
      courseFocusMap[f.courseId] = (courseFocusMap[f.courseId] || 0) + f.durationMinutes;
    }
  });

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  return (
    <div id="focus-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Focus & Academic Habits
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep work tracking, distraction-free study sessions, and daily academic consistency.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveFocusContext(selectedCourseForSession || null, null);
            setIsStudyModeActive(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 cursor-pointer w-fit"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>Launch Study Timer</span>
        </button>
      </div>

      {/* Focus Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Today's Focus</div>
          <div className="text-2xl font-black font-mono text-slate-100 mt-1">
            {Math.floor(todayMins / 60)}h {todayMins % 60}m
          </div>
          <div className="text-[10px] text-emerald-400 mt-0.5">Logged today</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Semester Focus</div>
          <div className="text-2xl font-black font-mono text-purple-400 mt-1">
            {totalHours}h
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total deep work</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Active Habit Streak</div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1 flex items-center gap-1">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>{bestStreak} days</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Consecutive consistency</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0f172a] border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Average Session</div>
          <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
            {focusSessions.length > 0 ? Math.round(totalMins / focusSessions.length) : 45}m
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">High quality depth</div>
        </div>
      </div>

      {/* Habits Tracker Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            Daily Academic Habits & Streaks
          </h2>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Habit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {habits.map(habit => {
            const isCompletedToday = habit.completedDates.includes(todayDateStr);
            return (
              <div
                key={habit.id}
                className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                  isCompletedToday
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                      isCompletedToday
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-600 bg-slate-950 hover:border-amber-400'
                    }`}
                  >
                    {isCompletedToday && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{habit.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="capitalize">{habit.category}</span>
                      <span>•</span>
                      <span>Target: {habit.targetDaysPerWeek} days/week</span>
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-base font-black text-amber-400 flex items-center justify-end gap-1">
                    <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                    <span>{habit.streak}d</span>
                  </div>
                  <div className="text-[10px] text-slate-500">Streak</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focus Distribution by Course */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          Focus Time Distribution By Course
        </h3>

        <div className="space-y-3">
          {courses.map(course => {
            const mins = courseFocusMap[course.id] || 0;
            const pct = totalMins > 0 ? Math.round((mins / totalMins) * 100) : 0;

            return (
              <div key={course.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: course.color }} />
                    {course.name} ({course.code})
                  </span>
                  <span className="font-mono text-slate-300">
                    {Math.floor(mins / 60)}h {mins % 60}m ({pct}%)
                  </span>
                </div>

                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: course.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
