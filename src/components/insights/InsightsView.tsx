import React from 'react';
import {
  Zap,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InsightsView: React.FC = () => {
  const {
    semesterHealth,
    insights,
    gpa,
    courses,
    tasks,
    todayDateStr,
    setCurrentView,
    setSelectedCourseId,
  } = useApp();

  const getHealthBadge = (score: number) => {
    if (score >= 8.5) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 7.0) return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    if (score >= 5.0) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div id="insights-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Academic Intelligence & Health Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data-driven performance diagnostics, semester health indices, and strategic guidance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-400">
            Overall Health Index: {semesterHealth.overall.toFixed(1)} / 10.0
          </span>
        </div>
      </div>

      {/* SEMESTER HEALTH SCORE CARD */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#121927] to-[#0d131f] border border-amber-500/30 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold">
              Composite Semester Diagnostic
            </span>
            <h2 className="text-2xl font-black text-slate-100 mt-1">
              Semester Health Score: {semesterHealth.overall.toFixed(1)} / 10.0
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Reflects high academic mastery and consistent submission punctuality. Workload peaks require active rebalancing.
            </p>
          </div>

          <div className="text-right font-mono bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800">
            <div className="text-3xl font-black text-amber-400">
              {semesterHealth.overall.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">
              Health Rating: Optimal
            </div>
          </div>
        </div>

        {/* 5 Component Sub-scores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Academic Mastery</div>
            <div className="text-xl font-black font-mono text-slate-100">
              {semesterHealth.academicPerformance.toFixed(1)}
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${semesterHealth.academicPerformance * 10}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-500">Based on GPA 7.82</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Workload Balance</div>
            <div className="text-xl font-black font-mono text-amber-400">
              {semesterHealth.workloadBalance.toFixed(1)}
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full"
                style={{ width: `${semesterHealth.workloadBalance * 10}%` }}
              />
            </div>
            <div className="text-[9px] text-amber-400">Upcoming surge warning</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Punctuality</div>
            <div className="text-xl font-black font-mono text-cyan-400">
              {semesterHealth.deadlinePunctuality.toFixed(1)}
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full rounded-full"
                style={{ width: `${semesterHealth.deadlinePunctuality * 10}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-500">92% on-time rate</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Attendance Rate</div>
            <div className="text-xl font-black font-mono text-slate-100">
              {semesterHealth.attendanceRate.toFixed(1)}
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${semesterHealth.attendanceRate * 10}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-500">88% overall attendance</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Focus Continuity</div>
            <div className="text-xl font-black font-mono text-purple-400">
              {semesterHealth.focusConsistency.toFixed(1)}
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-400 h-full rounded-full"
                style={{ width: `${semesterHealth.focusConsistency * 10}%` }}
              />
            </div>
            <div className="text-[9px] text-slate-500">12-day streak</div>
          </div>
        </div>
      </div>

      {/* MEANINGFUL DATA-DRIVEN INSIGHTS */}
      <div className="space-y-4">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Contextual Findings Derived From Real Activity
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map(insight => (
            <div
              key={insight.id}
              className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-3 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {insight.category.toUpperCase()}
                  </span>
                  {insight.metric && (
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {insight.metric}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-100 mt-2">{insight.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{insight.description}</p>
              </div>

              {insight.actionLabel && (
                <div className="pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => {
                      if (insight.courseId) setSelectedCourseId(insight.courseId);
                      if (insight.actionView) setCurrentView(insight.actionView);
                    }}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{insight.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Degree Trajectory & Graduation Forecast */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Graduation Trajectory & Academic Honors Probability
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">ECTS Credit Target:</span>
            <div className="text-lg font-bold font-mono text-slate-100">180 ECTS Required</div>
            <p className="text-slate-400 text-[11px]">
              Currently at 142 completed credits + 30 credits enrolled this academic term.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Honors Eligibility:</span>
            <div className="text-lg font-bold font-mono text-amber-400">Notable (Very Good)</div>
            <p className="text-slate-400 text-[11px]">
              Maintaining GPA &gt; 7.0 satisfies European graduate school qualification criteria.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400">Expected Graduation:</span>
            <div className="text-lg font-bold font-mono text-cyan-400">June 2027</div>
            <p className="text-slate-400 text-[11px]">
              On track for timely completion without semester extensions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
