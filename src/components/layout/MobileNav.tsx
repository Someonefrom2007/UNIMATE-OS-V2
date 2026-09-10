import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  BookOpen,
  Bot,
  Menu,
  X,
  Timer,
  Award,
  TrendingUp,
  FileEdit,
  Activity,
  Target,
  Settings,
  FolderOpen,
  Flame,
  User,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard' as AppView, label: 'Today', icon: LayoutDashboard },
    { id: 'schedule' as AppView, label: 'Schedule', icon: Calendar },
    { id: 'tasks' as AppView, label: 'Tasks', icon: CheckSquare },
    { id: 'courses' as AppView, label: 'Courses', icon: BookOpen },
    { id: 'ai' as AppView, label: 'Copilot', icon: Bot },
  ];

  const moreItems: { id: AppView; label: string; icon: React.ElementType }[] = [
    { id: 'focus', label: 'Focus & Study', icon: Timer },
    { id: 'exams', label: 'Exams & Readiness', icon: Award },
    { id: 'grades', label: 'Grade Simulator', icon: TrendingUp },
    { id: 'notes', label: 'Notes & Knowledge', icon: FileEdit },
    { id: 'resources', label: 'Resources & Files', icon: FolderOpen },
    { id: 'workload', label: 'Workload Engine', icon: Activity },
    { id: 'goals', label: 'Academic Goals', icon: Target },
    { id: 'habits', label: 'Daily Habits', icon: Flame },
    { id: 'profile', label: 'Student Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'plans', label: 'Operating Plans', icon: Layers },
  ];

  return (
    <>
      {/* Drawer Overlay for More */}
      {isMenuOpen && (
        <div
          id="mobile-nav-backdrop"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            id="mobile-nav-drawer"
            className="absolute bottom-16 left-0 right-0 glass-surface border-t border-white/10 rounded-t-2xl p-4 shadow-2xl max-h-[70vh] overflow-y-auto space-y-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                All Systems
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-lg glass-card-hover text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-3 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-br from-violet-500/20 to-purple-600/20 text-violet-300 border border-violet-500/30'
                        : 'glass-card-hover text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Bar */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 glass-surface border-t border-white/10 px-2 py-2 flex items-center justify-around select-none"
      >
        {mainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => {
                setCurrentView(tab.id);
                setIsMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[56px] transition-all cursor-pointer ${
                isActive
                  ? 'text-violet-300 bg-violet-500/10'
                  : 'text-slate-400 glass-card-hover'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                isActive ? 'bg-gradient-to-br from-violet-500/30 to-purple-600/30' : 'hover:bg-white/10'
              }`}>
                <Icon className={`w-4.5 h-4.5 ${isActive ? '' : 'group-hover:text-white transition-colors'}`} />
              </div>
              <span className="text-[10px] font-medium leading-none mt-1">{tab.label}</span>
            </button>
          );
        })}

        <button
          id="mobile-nav-more-button"
          onClick={() => setIsMenuOpen(prev => !prev)}
          className={`flex flex-col items-center justify-center p-2 rounded-xl min-w-[56px] cursor-pointer transition-all ${
            isMenuOpen
              ? 'text-violet-300 bg-violet-500/10'
              : 'text-slate-400 glass-card-hover'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            isMenuOpen ? 'bg-gradient-to-br from-violet-500/30 to-purple-600/30' : 'hover:bg-white/10'
          }`}>
            <Menu className="w-4.5 h-4.5" />
          </div>
          <span className="text-[10px] font-medium leading-none mt-1">More</span>
        </button>
      </nav>
    </>
  );
};