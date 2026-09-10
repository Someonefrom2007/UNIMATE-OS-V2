import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  CheckSquare,
  Award,
  TrendingUp,
  FileEdit,
  FolderOpen,
  Timer,
  Target,
  Flame,
  Activity,
  Zap,
  Bot,
  User,
  Settings,
  Layers,
  ChevronRight,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppView } from '../../types';
import { Logo } from '../common/Logo';

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    profile,
    tasks,
    assessments,
    setIsStudyModeActive,
  } = useApp();

  const urgentTasksCount = tasks.filter(t => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high')).length;
  const upcomingExamsCount = assessments.filter(a => a.status === 'upcoming').length;

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'ACADEMICS',
      items: [
        { id: 'courses', label: 'Courses', icon: BookOpen },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        {
          id: 'tasks',
          label: 'Tasks',
          icon: CheckSquare,
          badge: urgentTasksCount > 0 ? urgentTasksCount : undefined,
          badgeColor: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
        },
        {
          id: 'exams',
          label: 'Exams & Grades',
          icon: Award,
          badge: upcomingExamsCount > 0 ? upcomingExamsCount : undefined,
          badgeColor: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
        },
        { id: 'grades', label: 'Grade Simulator', icon: TrendingUp },
      ],
    },
    {
      title: 'PRODUCTIVITY',
      items: [
        { id: 'focus', label: 'Focus & Study', icon: Timer },
        { id: 'notes', label: 'Notes', icon: FileEdit },
        { id: 'resources', label: 'Resources', icon: FolderOpen },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'habits', label: 'Habits', icon: Flame },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'workload', label: 'Workload', icon: Activity },
        { id: 'insights', label: 'Insights', icon: Zap },
        { id: 'ai', label: 'Academic Copilot', icon: Bot },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'plans', label: 'Plans', icon: Layers },
      ],
    },
  ];

  return (
    <aside
      id="sidebar-navigation"
      className="hidden md:flex flex-col w-68 glass-surface border-r border-white/10 h-screen sticky top-0 z-30 select-none"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Logo size="md" showTagline={false} />
        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">
          v2.0
        </span>
      </div>

      {/* Quick Study Mode Button */}
      <div className="px-4 pt-2">
        <button
          id="sidebar-start-study-mode-button"
          onClick={() => setIsStudyModeActive(true)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl glass-card-hover group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-purple-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-4.5 h-4.5 text-violet-300 ml-1" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Enter Study Mode</div>
              <div className="text-[11px] text-slate-400">Distraction-free deep work</div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {sections.map(section => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-500 uppercase">
              {section.title}
            </div>
            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => setCurrentView(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'nav-active-glow glass-card text-white shadow-lg shadow-violet-500/10'
                        : 'text-slate-400 hover:text-slate-100 glass-card-hover'
                    }`}
                    style={{ 
                      transform: isActive ? 'translateX(2px)' : undefined,
                      boxShadow: isActive 
                        ? '0 4px 20px rgba(139, 92, 246, 0.2), inset 3px 0 0 rgba(139, 92, 246, 0.8)' 
                        : undefined
                    }}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                        isActive 
                          ? 'bg-gradient-to-br from-violet-500/30 to-purple-600/30 text-violet-300' 
                          : 'hover:bg-white/5 text-slate-400'
                      }`}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          item.badgeColor || 'bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <div className={`w-2 h-2 rounded-full transition-all ${
                      isActive ? 'bg-violet-400 scale-100' : 'bg-transparent scale-0'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Student Profile Widget Footer */}
      <div
        id="sidebar-footer"
        className="p-3 border-t border-white/10"
      >
        <button
          onClick={() => setCurrentView('profile')}
          className="w-full flex items-center justify-between p-3 rounded-xl glass-card-hover group cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-white/10 flex-shrink-0 group-hover:border-violet-400/50 transition-colors"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0f172a]" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-slate-100 truncate group-hover:text-violet-300 transition-colors">
                {profile.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {profile.degree.split(' ')[0]} • {profile.year}
              </div>
            </div>
          </div>
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </button>
      </div>
    </aside>
  );
};