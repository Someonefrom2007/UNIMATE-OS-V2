import React from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Timer,
  Play,
  ArrowRight,
  Flame,
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getGradeClassification } from '../../engines/gradeEngine';

export const DashboardView: React.FC = () => {
  const {
    profile,
    courses,
    scheduleEvents,
    tasks,
    assessments,
    habits,
    focusSessions,
    workload,
    semesterHealth,
    insights,
    nextAction,
    gpa,
    totalEcts,
    todayDateStr,
    setCurrentView,
    setSelectedCourseId,
    setIsStudyModeActive,
    setActiveFocusContext,
    toggleHabitToday,
    toggleTaskCompleted,
  } = useApp();

  const safeScheduleEvents = scheduleEvents || [];
  const safeCourses = courses || [];
  const safeTasks = tasks || [];
  const safeAssessments = assessments || [];
  const safeHabits = habits || [];
  const safeFocusSessions = focusSessions || [];
  const safeInsights = insights || [];

  // Find next class today
  const todayClasses = safeScheduleEvents
    .filter(e => e.date === todayDateStr && e.type === 'class')
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Current time is simulated at 13:18
  const nextClass = todayClasses.find(c => c.startTime >= '13:00') || todayClasses[0];
  const nextClassCourse = nextClass ? safeCourses.find(c => c.id === nextClass.courseId) : null;

  // Urgent items
  const urgentTasks = safeTasks.filter(t => t.status !== 'completed' && (t.priority === 'urgent' || t.dueDate === todayDateStr));
  const upcomingExams = safeAssessments.filter(a => a.status === 'upcoming').slice(0, 2);

  // Focus metrics
  const todayFocusMins = safeFocusSessions
    .filter(f => f.date === todayDateStr)
    .reduce((sum, f) => sum + f.durationMinutes, 0) || 102; // 1h 42m

  const weeklyFocusHours = (
    safeFocusSessions.reduce((sum, f) => sum + f.durationMinutes, 0) / 60
  ).toFixed(1);

  const highestStreak = safeHabits.reduce((max, h) => Math.max(max, h.streak || 0), 0);

  const gradeInfo = getGradeClassification(gpa);

  return (
    <div id="dashboard-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            Good afternoon, {profile.name.split(' ')[0]}.
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 flex items-center gap-2">
            <span className="font-medium text-slate-300">Thursday, September 10, 2026</span>
            <span>•</span>
            <span>2 lectures scheduled, 1 high-priority deadline tomorrow.</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('ai')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500/20 to-purple-600/20 hover:from-violet-500/30 hover:to-purple-600/30 text-violet-300 border border-violet-500/30 text-xs font-medium transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Copilot</span>
          </button>
        </div>
      </div>

      {/* 2. TOP KPI GRID — 4 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Class / Focus Card */}
        <div className="glass-card glass-card-hover lg:col-span-2 p-5 relative overflow-hidden group">
          {/* Accent border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/30 via-transparent to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span>Next Focus</span>
                <Timer className="w-3.5 h-3.5 text-violet-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center">
                <Play className="w-5 h-5 text-violet-300 ml-1" />
              </div>
            </div>
            
            {nextClass ? (
              <>
                <div className="text-xl md:text-2xl font-black font-mono text-slate-100 mb-1">
                  {nextClass.title}
                </div>
                <div className="text-sm text-slate-300 mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>{nextClassCourse?.name || 'Course'}</span>
                  <span>•</span>
                  <span className="font-mono">{nextClass.startTime} – {nextClass.endTime}</span>
                </div>
                <button
                  onClick={() => { setActiveFocusContext('course', nextClass.courseId); setIsStudyModeActive(true); }}
                  className="flex items-center gap-2 text-sm font-medium text-violet-300 hover:text-violet-200 transition-colors"
                >
                  Start Study Session
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            ) : (
              <div className="text-slate-400 text-sm">
                No classes scheduled. Perfect time for deep work.
              </div>
            )}
          </div>
        </div>

        {/* Focus Today */}
        <div className="glass-card glass-card-hover p-5">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Focus Today</span>
            <Timer className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl md:text-3xl font-black font-mono text-slate-100">
              {Math.floor(todayFocusMins / 60)}h {todayFocusMins % 60}m
            </span>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-2">
            <Flame className="w-3 h-3 text-amber-400" />
            <span className="text-amber-400 font-semibold">{highestStreak} day streak</span>
            <span>• {weeklyFocusHours}h week</span>
          </div>
        </div>

        {/* Semester Health */}
        <div
          onClick={() => setCurrentView('insights')}
          className="glass-card glass-card-hover p-5 cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Semester Health</span>
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="text-2xl md:text-3xl font-black font-mono text-slate-100">
                {semesterHealth.overall.toFixed(1)}
              </span>
              <span className="text-xs font-mono text-slate-500">/ 10.0</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-400 truncate">
              {semesterHealth.overall >= 8.0 ? 'Strong trajectory' : 'Balanced load'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT GRID — 2/3 schedule, 1/3 side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: TODAY'S TIMELINE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-400" />
              Today's Schedule & Timeline
            </h2>
            <button
              onClick={() => setCurrentView('schedule')}
              className="text-xs text-slate-400 hover:text-violet-400 transition-colors flex items-center gap-1"
            >
              Full Calendar <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {todayClasses.map(evt => {
              const c = safeCourses.find(course => course.id === evt.courseId);
              const isPast = evt.endTime <= '12:00';
              const isCurrent = evt.startTime <= '14:00' && evt.endTime >= '13:00';
              return (
                <div
                  key={evt.id}
                  className={`p-4 rounded-xl border flex items-center justify-between transition-all glass-card-hover ${
                    isPast
                      ? 'bg-white/3 border-white/5 opacity-60'
                      : isCurrent
                        ? 'bg-violet-500/5 border-violet-500/20 ring-1 ring-violet-500/10'
                        : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-10 rounded-full"
                      style={{ backgroundColor: c?.color || '#8b5cf6' }}
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                        <span>{evt.title}</span>
                        {isPast && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
                            Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 animate-pulse">
                            Live
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{evt.location || 'Campus'}</span>
                        <span>•</span>
                        <span>{c?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-slate-200">
                      {evt.startTime} – {evt.endTime}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase">
                      {evt.type}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Free Gap Card */}
            <div className="p-4 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-500/5 flex items-center justify-between glass-card-hover">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <div>
                  <span className="text-xs font-semibold text-cyan-300">
                    11:30 – 14:00 Free Academic Window (150m)
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Recommended: Complete Research Methods literature review outline.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsStudyModeActive(true)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 transition-colors"
              >
                Plan Study
              </button>
            </div>
          </div>

          {/* TODAY'S HABITS WIDGET */}
          <div className="pt-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Daily Academic Habits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {safeHabits.slice(0, 4).map(habit => {
                const isCompleted = (habit.completedDates || []).includes(todayDateStr);
                return (
                  <button
                    key={habit.id}
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer glass-card-hover ${
                      isCompleted
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-emerald-500/20'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}>
                        {isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3] text-emerald-400" />
                        ) : (
                          <div className="w-4 h-4 rounded border-2 border-white/20" />
                        )}
                      </div>
                      <span className="text-xs truncate font-medium">{habit.title}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400 ml-2">
                      {habit.streak || 0}d
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: URGENT & INSIGHTS */}
        <div className="space-y-4">
          {/* URGENT BLOCK */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Urgent Attention
            </h2>

            <div className="space-y-2">
              {urgentTasks.map(task => {
                const c = safeCourses.find(course => course.id === task.courseId);
                return (
                  <div
                    key={task.id}
                    className="p-4 rounded-xl glass-card border border-amber-500/20 bg-amber-500/3 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                        Due {task.dueDate}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {task.estimatedMinutes}m est.
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100">{task.title}</h4>
                    <div className="flex items-center justify-between pt-1">
                      <span
                        onClick={() => { setCurrentView('courses'); setSelectedCourseId(task.courseId); }}
                        className="text-[10px] font-mono text-slate-400 hover:text-violet-400 cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded bg-white/5"
                      >
                        <BookOpen className="w-3 h-3" />
                        {c?.name}
                      </span>
                      <button
                        onClick={() => toggleTaskCompleted(task.id)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                      >
                        <CheckCircle2 className={`w-4 h-4 ${task.status === 'completed' ? 'text-emerald-400' : 'text-slate-400'}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {urgentTasks.length === 0 && (
                <div className="p-4 rounded-xl glass-card border border-white/5 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">All caught up! Nothing urgent.</p>
                </div>
              )}
            </div>
          </div>

          {/* UPCOMING EXAMS */}
          <div className="space-y-2 pt-2 border-t border-white/5">
            <h2 className="text-sm font-bold text-slate-200 uppercase font-mono tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-pink-400" />
              Upcoming Exams
            </h2>
            <div className="space-y-2">
              {upcomingExams.map(exam => {
                const c = safeCourses.find(course => course.id === exam.courseId);
                return (
                  <div
                    key={exam.id}
                    className="p-4 rounded-xl glass-card border border-pink-500/20 bg-pink-500/3 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-pink-400 font-semibold px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                        {exam.date}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        exam.status === 'upcoming' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {exam.type}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100">{exam.title}</h4>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {c?.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        exam.readiness >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                        exam.readiness >= 60 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {exam.readiness}% ready
                      </span>
                    </div>
                  </div>
                );
              })}
              {upcomingExams.length === 0 && (
                <div className="p-4 rounded-xl glass-card border border-white/5 text-center">
                  <Award className="w-10 h-10 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No upcoming exams scheduled.</p>
                </div>
              )}
            </div>
          </div>

          {/* GRADE SUMMARY */}
          <div className="pt-2 border-t border-white/5 glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Current GPA</div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl font-black font-mono gradient-text">{gpa.toFixed(2)}</span>
                  <span className="text-xs font-mono text-slate-500">/ 10.0</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {gradeInfo.label} • {totalEcts} ECTS completed
                </div>
              </div>
              <button
                onClick={() => setCurrentView('grades')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-xs font-medium"
              >
                Open Simulator
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};