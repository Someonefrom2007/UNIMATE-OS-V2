import React from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkloadView: React.FC = () => {
  const { workload, courses, tasks, assessments, todayDateStr, setCurrentView } = useApp();

  const strainColors: Record<string, string> = {
    balanced: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    moderate: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    heavy: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const thisWeek = workload?.thisWeek || {
    totalHours: workload?.thisWeekHours || 28,
    strainLevel: 'moderate' as const,
    dailyHours: [],
  };

  const nextWeek = workload?.nextWeek || {
    totalHours: workload?.nextWeekHours || 35,
    strainLevel: 'heavy' as const,
    isSurge: true,
    recommendation: 'Next week has high exam preparation volume.',
  };

  const currentLevel = thisWeek.strainLevel || 'moderate';
  const dailyHours = thisWeek.dailyHours || [];
  const maxDayHours = Math.max(...(dailyHours.length > 0 ? dailyHours.map(d => d.hours) : [8]), 8);

  return (
    <div id="workload-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Predictive Workload & Academic Strain Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Predictive burn-out detection synthesizing lectures, task deadlines, and exam prep demand.
          </p>
        </div>

        <span
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase border ${
            strainColors[currentLevel] || strainColors.moderate
          }`}
        >
          This Week: {currentLevel} Strain ({thisWeek.totalHours}h load)
        </span>
      </div>

      {/* Surge & Predictive Recommendation Alert */}
      {nextWeek.isSurge && (
        <div className="p-5 rounded-2xl bg-amber-950/25 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-400">
                Surge Detected in Next Week ({nextWeek.totalHours} Estimated Academic Hours)
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
                {nextWeek.recommendation ||
                  'Next week has 3 deliverables and a major assessment. We strongly advise shifting 6 hours of research and problem-set preparation into your free windows this week.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('schedule')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer"
          >
            Rebalance Schedule →
          </button>
        </div>
      )}

      {/* 3 Horizon Comparisons (This Week vs Next Week vs Following) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* This Week */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Current Week</div>
          <div className="text-3xl font-black font-mono text-slate-100">
            {thisWeek.totalHours}h <span className="text-xs font-normal text-slate-500">load</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${strainColors[thisWeek.strainLevel] || strainColors.moderate}`}>
              {thisWeek.strainLevel}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Combines scheduled lecture attendance with assignment and project execution.
          </p>
        </div>

        {/* Next Week (Surge) */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Next Week (Projected)</div>
          <div className="text-3xl font-black font-mono text-amber-400">
            {nextWeek.totalHours}h <span className="text-xs font-normal text-slate-500">load</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${strainColors[nextWeek.strainLevel] || strainColors.heavy}`}>
              {nextWeek.strainLevel}
            </span>
            {nextWeek.isSurge && <span className="text-[10px] font-bold text-red-400">Critical Surge</span>}
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Major exam preparation + course project deliverable milestones due.
          </p>
        </div>

        {/* Following Week */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Following Week</div>
          <div className="text-3xl font-black font-mono text-slate-100">
            28.0h <span className="text-xs font-normal text-slate-500">load</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
              Balanced
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Post-exam recovery window. Academic routine returns to steady state.
          </p>
        </div>
      </div>

      {/* Daily Breakdown Histogram */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Weekly Academic Hours Distribution</h3>
            <p className="text-xs text-slate-400">
              Visualizes daily demands to identify peak stress days and resting capacity.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Recommended Daily Cap: 8.0h</span>
        </div>

        {/* Histogram Bars */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end min-h-[180px] pt-8 border-b border-slate-800 pb-2">
          {dailyHours.map(d => {
            const heightPct = Math.min(100, Math.round((d.hours / maxDayHours) * 100));
            const isHeavy = d.hours >= 7.5;
            const isToday = d.date === todayDateStr;

            return (
              <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-amber-400 transition-colors">
                  {d.hours}h
                </span>

                <div className="w-full bg-slate-900 rounded-t-lg h-36 flex items-end p-1 overflow-hidden">
                  <div
                    className={`w-full rounded-md transition-all ${
                      isHeavy
                        ? 'bg-gradient-to-t from-amber-500 to-red-400'
                        : 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                <div className="text-center">
                  <div className={`text-xs font-semibold ${isToday ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                    {d.day.slice(0, 3)}
                  </div>
                  <div className="text-[9px] font-mono text-slate-500">{d.date.slice(5)}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Workload Balancer Action Tools */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>
              <strong>Smart Recommendation:</strong> Move 3 hours of Algorithms research from Friday to Thursday evening to avoid bottlenecking.
            </span>
          </div>

          <button
            onClick={() => setCurrentView('schedule')}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer whitespace-nowrap"
          >
            Open Timetable <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
