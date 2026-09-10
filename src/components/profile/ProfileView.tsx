import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  Save,
  CheckCircle2,
  Calendar,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentProfile } from '../../types';

export const ProfileView: React.FC = () => {
  const { profile, setProfile, overallGpa, courses, tasks } = useApp();

  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field: keyof StudentProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const ectsPercent = Math.round(
    (formData.earnedCredits / formData.totalCreditsRequired) * 100
  );

  return (
    <div id="profile-view" className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5" />
            <span>Account • Academic Identity</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
            Student Academic Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your personal degree records, GPA goals, ECTS progress, and personalized study preferences.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile Updated</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Student Overview Card */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400/40 shadow-xl shadow-amber-500/10"
            />
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-slate-950 text-amber-400 border border-amber-400/30 font-mono text-[10px] font-bold">
              YR {formData.year}
            </span>
          </div>

          <div className="flex-1 space-y-2 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-baseline gap-2">
              <h2 className="text-xl font-bold text-slate-100">{formData.name}</h2>
              <span className="text-xs text-slate-400 font-mono">
                {formData.degree} • {formData.university}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                {formData.semester}
              </span>

              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-cyan-400" />
                Target GPA: {formData.targetGpa.toFixed(1)} / 10.0
              </span>

              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-mono border border-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Study Block: {formData.typicalFocusDuration} mins
              </span>
            </div>
          </div>
        </div>

        {/* Academic Targets & ECTS */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4" />
            Degree Standing & Credit Calculations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono mb-1">Current Cumulative GPA</div>
              <div className="text-2xl font-bold font-mono text-amber-400">
                {overallGpa.toFixed(2)}{' '}
                <span className="text-xs text-slate-500 font-normal">/ 10.0</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Deterministic ECTS-weighted sum from {courses.length} active courses
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono mb-1">Target Degree GPA</div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  step="0.1"
                  min="5.0"
                  max="10.0"
                  value={formData.targetGpa}
                  onChange={e => handleChange('targetGpa', parseFloat(e.target.value) || 8.0)}
                  className="w-24 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-100 font-mono text-lg font-bold focus:outline-none focus:border-amber-400"
                />
                <span className="text-xs text-slate-500 font-mono">/ 10.0</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 font-mono mb-1">ECTS Credits Earned</div>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  value={formData.earnedCredits}
                  onChange={e => handleChange('earnedCredits', parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-100 font-mono text-lg font-bold focus:outline-none focus:border-amber-400"
                />
                <span className="text-xs text-slate-500 font-mono">
                  / {formData.totalCreditsRequired} ({ectsPercent}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Identity & Degree Form Fields */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            University & Enrollment Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                University / Institution
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={e => handleChange('university', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Degree / Major
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={e => handleChange('degree', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={e => handleChange('year', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Current Term
                </label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={e => handleChange('semester', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Study & Focus Preferences */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Study Cadence & Copilot Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Peak Cognitive Study Hours
              </label>
              <input
                type="text"
                placeholder="e.g. 14:00 - 19:00"
                value={formData.preferredStudyTime}
                onChange={e => handleChange('preferredStudyTime', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Used by the schedule and AI recommendation engines to suggest deep focus sessions.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Default Focus Block (Minutes)
              </label>
              <select
                value={formData.typicalFocusDuration}
                onChange={e => handleChange('typicalFocusDuration', parseInt(e.target.value) || 50)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer font-mono"
              >
                <option value={25}>25 Minutes (Classic Pomodoro)</option>
                <option value={50}>50 Minutes (University Double Block)</option>
                <option value={75}>75 Minutes (Extended Deep Work)</option>
                <option value={90}>90 Minutes (Ultradian Cycle)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
