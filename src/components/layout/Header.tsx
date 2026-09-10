import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  CheckCircle2,
  Calendar as CalendarIcon,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
  Coffee,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationsDrawer } from '../modals/NotificationsDrawer';

export const Header: React.FC = () => {
  const {
    currentView,
    setIsCommandPaletteOpen,
    setIsQuickAddOpen,
    tasks,
    assessments,
    courses,
    syncStatus,
    isChaosMode,
    toggleChaosMode,
    isAudioMuted,
    toggleAudioMute,
    caffeineCups,
    addCaffeineCup,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Compute notification badges (urgent items)
  const urgentTasks = tasks.filter(t => t.status !== 'completed' && t.priority === 'urgent');
  const upcomingExams = assessments.filter(a => a.status === 'upcoming');
  const attendanceAlerts = courses.filter(
    c => c.attendance && (c.attendance.attended / c.attendance.total) * 100 <= (c.attendance.minRequiredPercent || 80) + 5
  );

  const totalNotifications = urgentTasks.length + upcomingExams.length + attendanceAlerts.length;

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Your academic command center' },
    courses: { title: 'Courses', subtitle: 'Subjects, ECTS & curriculums' },
    schedule: { title: 'Schedule', subtitle: 'Timetable, lectures & free time' },
    tasks: { title: 'Tasks', subtitle: 'Assignments & milestones' },
    exams: { title: 'Exams & Grades', subtitle: 'Midterms, finals & readiness' },
    grades: { title: 'Grade Simulator', subtitle: '0.00–10.00 European scale & ECTS' },
    notes: { title: 'Notes', subtitle: 'Knowledge base & formulas' },
    resources: { title: 'Resources', subtitle: 'Syllabi, slides & documentation' },
    focus: { title: 'Focus & Study', subtitle: 'Deep work & pomodoro engine' },
    goals: { title: 'Goals', subtitle: 'Academic targets & milestones' },
    habits: { title: 'Habits', subtitle: 'Daily routines & streaks' },
    workload: { title: 'Workload', subtitle: 'Semester load & distribution' },
    insights: { title: 'Insights', subtitle: 'Performance analytics & trends' },
    ai: { title: 'Academic Copilot', subtitle: 'AI-powered study assistant' },
    profile: { title: 'Profile', subtitle: 'Degree & university credentials' },
    settings: { title: 'Settings', subtitle: 'Preferences, data & backup' },
    plans: { title: 'Plans', subtitle: 'Free, Pro & Ultimate' },
  };

  const currentInfo = viewTitles[currentView] || { title: 'UNI·MATE', subtitle: 'University OS' };

  return (
    <header
      id="app-header"
      className="sticky top-0 z-20 h-16 glass-surface border-b border-white/10 px-4 md:px-8 flex items-center justify-between"
    >
      {/* View Title & Breadcrumb */}
      <div className="flex flex-col">
        <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
          {currentInfo.title}
          {currentView === 'ai' && (
            <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20 font-medium">
              <Sparkles className="w-2.5 h-2.5" />
              Live Context
            </span>
          )}
        </h1>
        <p className="text-[11px] text-slate-400 hidden sm:block">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-2.5">
        {/* Global Search Button (Cmd+K) */}
        <button
          id="header-global-search-trigger"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card-hover group cursor-pointer"
          title="Search or execute actions (⌘K)"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
          <span className="hidden md:inline text-sm text-slate-400 group-hover:text-slate-200 transition-colors">Search anything...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
            <span className="text-slate-300">⌘</span>
            <span>K</span>
          </kbd>
        </button>

        {/* Quick Add Button (+) */}
        <button
          id="header-quick-add-button"
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-btn-primary group cursor-pointer"
          title="Quick Add (Task, Exam, Note, etc.)"
        >
          <Plus className="w-4 h-4 stroke-[3] group-hover:rotate-90 transition-transform" />
          <span className="hidden sm:inline font-medium">Add</span>
        </button>

        {/* Sync Status Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-card">
          <div className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-400' : syncStatus === 'syncing' ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
          <span className="text-[11px] font-mono text-slate-400 capitalize hidden md:inline">{syncStatus}</span>
        </div>

        {/* Studio / Focus Mode Toggle */}
        <button
          onClick={toggleChaosMode}
          title={isChaosMode ? 'Switch to Minimal View' : 'Show Studio Desk Notes'}
          className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-xl glass-card-hover transition-all cursor-pointer ${
            isChaosMode
              ? 'bg-gradient-to-r from-violet-500/15 to-purple-600/15 border-violet-500/30 text-violet-300'
              : ''
          }`}
        >
          <Zap className={`w-4 h-4 ${isChaosMode ? 'text-violet-400 fill-violet-400' : 'text-slate-400'}`} />
          <span className="text-[11px] font-mono">{isChaosMode ? 'STUDIO ACTIVE' : 'MINIMAL VIEW'}</span>
        </button>

        {/* Quick Caffeine Counter */}
        <button
          onClick={addCaffeineCup}
          title={`Logged ${caffeineCups} espressos today. Click to add 1.`}
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl glass-card-hover cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <Coffee className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-sm font-mono text-slate-300">{caffeineCups}</span>
          <span className="text-[11px] text-slate-400">Espressos</span>
        </button>

        {/* Sound FX Toggle */}
        <button
          onClick={toggleAudioMute}
          title={isAudioMuted ? 'Unmute ambient sounds' : 'Mute ambient sounds'}
          className="p-2 rounded-xl glass-card-hover cursor-pointer"
        >
          {isAudioMuted ? (
            <VolumeX className="w-4.5 h-4.5 text-slate-400 hover:text-slate-200 transition-colors" />
          ) : (
            <Volume2 className="w-4.5 h-4.5 text-slate-400 hover:text-slate-200 transition-colors" />
          )}
        </button>

        {/* Date & Time pill */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl glass-card">
          <CalendarIcon className="w-4 h-4 text-slate-500" />
          <span className="text-[11px] font-mono text-slate-400">Thu, Sep 10 • 13:18</span>
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="header-notifications-button"
            onClick={() => setIsNotificationsOpen(prev => !prev)}
            className="p-2.5 rounded-xl glass-card-hover cursor-pointer relative"
            title="Notifications & Academic Alerts"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center">
              <Bell className="w-4.5 h-4.5 text-slate-400" />
            </div>
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-slate-950 font-mono font-bold text-[10px] flex items-center justify-center border-2 border-[#0f172a] shadow-lg shadow-violet-500/30">
                {totalNotifications > 9 ? '9+' : totalNotifications}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <NotificationsDrawer
              onClose={() => setIsNotificationsOpen(false)}
              urgentTasks={urgentTasks}
              upcomingExams={upcomingExams}
              attendanceAlerts={attendanceAlerts}
            />
          )}
        </div>
      </div>
    </header>
  );
};