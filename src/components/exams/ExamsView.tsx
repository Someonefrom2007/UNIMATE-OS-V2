import React, { useState } from 'react';
import {
  Award,
  Plus,
  Clock,
  Calendar,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Assessment } from '../../types';
import { getGradeClassification } from '../../engines/gradeEngine';

export const ExamsView: React.FC = () => {
  const {
    assessments,
    courses,
    todayDateStr,
    setIsQuickAddOpen,
    setCurrentView,
    setSelectedCourseId,
    updateAssessment,
  } = useApp();

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(
    assessments[0]?.id || null
  );

  const selectedAssessment = assessments.find(a => a.id === selectedAssessmentId) || assessments[0];
  const course = selectedAssessment ? courses.find(c => c.id === selectedAssessment.courseId) : null;

  // Calculate countdown in days
  const getCountdownDays = (dateStr: string) => {
    const today = new Date(todayDateStr);
    const target = new Date(dateStr);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Readiness calculation from topics
  const overallReadiness = selectedAssessment && selectedAssessment.topics.length > 0
    ? Math.round(
        selectedAssessment.topics.reduce((sum, t) => sum + t.readiness, 0) /
          selectedAssessment.topics.length
      )
    : 75;

  return (
    <div id="exams-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Exams & Assessments
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Midterms, finals, practical defenses, and evidence-based readiness analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('grades')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Open Grade Simulator</span>
          </button>
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Assessment</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left List, Right Deep Readiness Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: All Assessments List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            All Evaluations ({assessments.length})
          </h2>

          <div className="space-y-2.5">
            {assessments.map(exam => {
              const c = courses.find(course => course.id === exam.courseId);
              const isSelected = selectedAssessment?.id === exam.id;
              const daysLeft = getCountdownDays(exam.date);
              const isUpcoming = exam.status === 'upcoming';

              return (
                <div
                  key={exam.id}
                  onClick={() => setSelectedAssessmentId(exam.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-purple-950/20 border-purple-500/40 shadow-lg shadow-purple-500/10'
                      : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] uppercase font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      {exam.type} • {exam.weight}%
                    </span>

                    {isUpcoming ? (
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Due today'}
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        Graded: {exam.grade?.toFixed(1)} / 10
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 mt-2">{exam.name}</h3>
                  <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                    <span>{c?.name}</span>
                    <span className="font-mono">{exam.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Readiness Inspector (7 cols) */}
        {selectedAssessment && (
          <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {course?.code}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedAssessment.weight}% Final Course Weight
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 mt-1">
                  {selectedAssessment.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scheduled for {selectedAssessment.date} {selectedAssessment.time ? `at ${selectedAssessment.time}` : ''}
                </p>
              </div>

              {selectedAssessment.status === 'upcoming' && (
                <div className="text-right font-mono bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
                  <div className="text-xl font-black text-amber-400">
                    {getCountdownDays(selectedAssessment.date)}d
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase">Countdown</div>
                </div>
              )}
            </div>

            {/* Exam Readiness Indicator */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Exam Preparation Readiness
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Synthesized from reviewed notes, lab tests, and practice problem completion.
                  </p>
                </div>
                <div className="text-2xl font-black font-mono text-amber-400">
                  {overallReadiness}%
                </div>
              </div>

              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400 h-full rounded-full transition-all"
                  style={{ width: `${overallReadiness}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                {overallReadiness >= 80
                  ? "Strong preparation detected across core curriculum. Solid mastery of foundational theorems."
                  : "Targeted revision recommended. While high-level concepts are clear, complex dynamic subproblems require additional timed practice."}
              </p>
            </div>

            {/* Topic Readiness Breakdown */}
            {(selectedAssessment.topics || []).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Curriculum Topic Mastery
                </h3>

                <div className="space-y-2">
                  {(selectedAssessment.topics || []).map(topic => (
                    <div
                      key={topic.name}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-200">{topic.name}</span>
                        <div className="w-36 bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              topic.readiness >= 80
                                ? 'bg-emerald-400'
                                : topic.readiness >= 65
                                ? 'bg-cyan-400'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${topic.readiness}%` }}
                          />
                        </div>
                      </div>

                      <span className="font-mono font-bold text-slate-200 text-xs">
                        {topic.readiness}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes & Constraints */}
            {selectedAssessment.notes && (
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                  Examination Logistics & Instructions
                </span>
                <p>{selectedAssessment.notes}</p>
              </div>
            )}

            {/* Enter/Update Grade if graded */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Status: <strong className="text-slate-200 uppercase">{selectedAssessment.status}</strong></span>
              {selectedAssessment.grade !== undefined && (
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  Official Grade: {selectedAssessment.grade} / 10.0
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
