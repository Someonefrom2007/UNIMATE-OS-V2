import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  Calculator,
  HelpCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  getGradeClassification,
  simulateRequiredGrade,
  calculateCourseGrade,
} from '../../engines/gradeEngine';

export const GradesView: React.FC = () => {
  const { courses, assessments, gpa, totalEcts, profile } = useApp();

  // Grade Simulator state
  const [simulatorCourseId, setSimulatorCourseId] = useState<string>(courses[0]?.id || '');
  const [targetGrade, setTargetGrade] = useState<number>(8.0);
  const [whatIfScore, setWhatIfScore] = useState<number>(8.5);

  const selectedCourse = courses.find(c => c.id === simulatorCourseId) || courses[0];
  const courseAssessments = assessments.filter(a => a.courseId === selectedCourse?.id);
  const { currentGrade, completedWeight, remainingWeight } = calculateCourseGrade(courseAssessments);

  // Accrued weighted points locked in so far: sum of (grade * weight / 100)
  const lockedInPoints = courseAssessments
    .filter(a => a.status === 'graded' && typeof a.grade === 'number')
    .reduce((sum, a) => sum + (a.grade! * a.weight) / 100, 0);

  // Simulation 1: What grade do I need for Target Grade?
  const simulationResult = simulateRequiredGrade(lockedInPoints, remainingWeight, targetGrade);

  // Simulation 2: What if I get whatIfScore on the remaining weight?
  const projectedFinalGrade = Number(
    (lockedInPoints + (whatIfScore * remainingWeight) / 100).toFixed(2)
  );
  const projectedGradeClassification = getGradeClassification(projectedFinalGrade);

  return (
    <div id="grades-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Academic Grades & ECTS Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            0.00–10.00 European scale, ECTS credit-weighted averages, and real-time simulator.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono font-bold text-amber-400">
            Official ECTS Weighted GPA: {gpa.toFixed(2)} / 10.0
          </div>
        </div>
      </div>

      {/* Global Academic Performance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weighted GPA Card */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            ECTS-Weighted Overall GPA
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-slate-100">{gpa.toFixed(2)}</span>
            <span className="text-xs font-mono text-slate-500">/ 10.00</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className={`text-xs font-mono px-2 py-0.5 rounded font-bold ${getGradeClassification(gpa).badgeClass}`}>
              {getGradeClassification(gpa).spanishLabel} ({getGradeClassification(gpa).label})
            </span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            Formula: ∑(Grade × ECTS) / ∑ECTS across all accredited courses.
          </p>
        </div>

        {/* ECTS Credits Earned */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Degree ECTS Progress
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono text-slate-100">{profile.earnedCredits}</span>
            <span className="text-xs font-mono text-slate-500">/ {profile.totalCreditsRequired} Credits</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800 mt-2">
            <div
              className="bg-gradient-to-r from-cyan-400 to-cyan-500 h-full rounded-full"
              style={{ width: `${Math.round((profile.earnedCredits / profile.totalCreditsRequired) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {profile.totalCreditsRequired - profile.earnedCredits} ECTS remaining to fulfill Bachelor degree graduation requirements.
          </p>
        </div>

        {/* Spanish Classification Legend */}
        <div className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
            Grade Scale Classification
          </span>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex justify-between text-amber-400">
              <span>10.00</span>
              <span>Matrícula de Honor (Honors)</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>9.00 – 9.99</span>
              <span>Sobresaliente (Outstanding)</span>
            </div>
            <div className="flex justify-between text-cyan-400">
              <span>7.00 – 8.99</span>
              <span>Notable (Very Good)</span>
            </div>
            <div className="flex justify-between text-blue-400">
              <span>5.00 – 6.99</span>
              <span>Aprobado (Pass)</span>
            </div>
            <div className="flex justify-between text-red-400">
              <span>&lt; 5.00</span>
              <span>Suspenso (Fail)</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRADE SIMULATOR: What Grade Do I Need? */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#121927] to-[#0d131f] border border-amber-500/30 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">Grade Simulator: "What grade do I need?"</h2>
              <p className="text-xs text-slate-400">
                Transparent mathematical projection based on remaining assessment weight.
              </p>
            </div>
          </div>

          <select
            value={simulatorCourseId}
            onChange={e => setSimulatorCourseId(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Course State Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] uppercase">Locked-in Points</span>
            <div className="text-slate-100 font-bold text-sm mt-0.5">{lockedInPoints.toFixed(2)} pts</div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase">Evaluated Weight</span>
            <div className="text-slate-100 font-bold text-sm mt-0.5">{completedWeight}%</div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase">Remaining Weight</span>
            <div className="text-amber-400 font-bold text-sm mt-0.5">{remainingWeight}%</div>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase">Accrued Grade</span>
            <div className="text-slate-100 font-bold text-sm mt-0.5">{currentGrade.toFixed(2)} / 10</div>
          </div>
        </div>

        {/* Scenario 1: Target Grade Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              Select Desired Final Course Grade Target:
            </span>
            <span className="text-base font-black font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {targetGrade.toFixed(1)} / 10.0
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[5.0, 7.0, 8.0, 8.5, 9.0, 10.0].map(val => (
              <button
                key={val}
                onClick={() => setTargetGrade(val)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  targetGrade === val
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {val.toFixed(1)}
              </button>
            ))}
          </div>

          {/* Simulation Result Message */}
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed ${
              simulationResult.achievable
                ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                : 'bg-red-950/20 border-red-500/30 text-red-300'
            }`}
          >
            <div className="font-bold flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Simulation Result</span>
            </div>
            <p>{simulationResult.explanation}</p>
          </div>
        </div>

        {/* Scenario 2: "What if I get X?" */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">
              "What if I get {whatIfScore.toFixed(1)} on the remaining assessments?"
            </span>
            <span className="text-xs font-mono text-slate-400">
              Projected Final: <strong className="text-slate-100">{projectedFinalGrade.toFixed(2)}</strong> ({projectedGradeClassification.label})
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={whatIfScore}
            onChange={e => setWhatIfScore(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>

      {/* Courses Grade Transcript Table */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Semester Academic Transcript
        </h2>

        <div className="bg-[#0f172a] rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 font-mono text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3.5">Course</th>
                  <th className="p-3.5">Code</th>
                  <th className="p-3.5">ECTS</th>
                  <th className="p-3.5">Target</th>
                  <th className="p-3.5">Current Grade</th>
                  <th className="p-3.5">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {courses.map(c => {
                  const info = getGradeClassification(c.currentGrade);
                  return (
                    <tr key={c.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">{c.code}</td>
                      <td className="p-3.5 font-mono text-slate-300">{c.ects}</td>
                      <td className="p-3.5 font-mono text-amber-400 font-semibold">{c.targetGrade.toFixed(1)}</td>
                      <td className="p-3.5 font-mono text-slate-100 font-bold text-sm">
                        {c.currentGrade.toFixed(2)}
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${info.badgeClass}`}>
                          {info.spanishLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
