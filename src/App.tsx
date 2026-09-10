import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/modals/CommandPalette';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { StudyTimerModal } from './components/focus/StudyTimerModal';
import { SynapticBackground } from './components/common/SynapticBackground';
import { NeuroScratchpadDrawer } from './components/modals/NeuroScratchpadDrawer';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { CoursesView } from './components/courses/CoursesView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { TasksView } from './components/tasks/TasksView';
import { ExamsView } from './components/exams/ExamsView';
import { GradesView } from './components/grades/GradesView';
import { FocusView } from './components/focus/FocusView';
import { NotesView } from './components/notes/NotesView';
import { ResourcesView } from './components/resources/ResourcesView';
import { GoalsView } from './components/goals/GoalsView';
import { HabitsView } from './components/habits/HabitsView';
import { WorkloadView } from './components/workload/WorkloadView';
import { InsightsView } from './components/insights/InsightsView';
import { AICopilotView } from './components/ai/AICopilotView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { PlansView } from './components/plans/PlansView';

const MainLayout: React.FC = () => {
  const { currentView, stickies } = useApp();
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  // Global hotkey: Cmd/Ctrl + B to toggle pinboard / brain dump
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsScratchpadOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'courses':
        return <CoursesView />;
      case 'schedule':
        return <ScheduleView />;
      case 'tasks':
        return <TasksView />;
      case 'exams':
        return <ExamsView />;
      case 'grades':
        return <GradesView />;
      case 'focus':
        return <FocusView />;
      case 'notes':
        return <NotesView />;
      case 'resources':
        return <ResourcesView />;
      case 'goals':
        return <GoalsView />;
      case 'habits':
        return <HabitsView />;
      case 'workload':
        return <WorkloadView />;
      case 'insights':
        return <InsightsView />;
      case 'ai':
        return <AICopilotView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'plans':
        return <PlansView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-violet-400 selection:text-slate-950 relative">
      {/* Living Ambient Backdrop */}
      <SynapticBackground />

      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Header />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-24 md:pb-8">
          {renderCurrentView()}
        </main>
      </div>

      {/* Floating Pinboard Trigger */}
      <div className="fixed bottom-6 right-6 z-30 hidden md:flex items-center gap-2">
        <button
          id="floating-brain-dump-trigger"
          onClick={() => setIsScratchpadOpen(prev => !prev)}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full glass-card-hover group cursor-pointer shadow-xl shadow-violet-500/10 border border-white/10"
          title="Toggle Pinboard (⌘B)"
        >
          <span className="text-sm">📌</span>
          <span className="font-mono tracking-tight text-slate-200 group-hover:text-violet-300 transition-colors">
            Pinboard
          </span>
          <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-[10px] font-mono border border-violet-500/20">
            {stickies ? stickies.length : 0}
          </span>
          <kbd className="text-[10px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
            ⌘B
          </kbd>
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Modals & Overlays fully wrapped inside Provider */}
      <CommandPalette />
      <QuickAddModal />
      <StudyTimerModal />
      <NeuroScratchpadDrawer
        isOpen={isScratchpadOpen}
        onClose={() => setIsScratchpadOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}