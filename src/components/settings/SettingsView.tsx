import React, { useState } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Download,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Award,
  Shield,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { profile, updateProfile, resetAllData } = useApp();

  const [name, setName] = useState(profile.name);
  const [university, setUniversity] = useState(profile.university);
  const [program, setProgram] = useState(profile.program);
  const [academicYear, setAcademicYear] = useState(profile.academicYear);
  const [currentSemester, setCurrentSemester] = useState(profile.currentSemester);
  const [totalCredits, setTotalCredits] = useState(profile.totalCreditsRequired);
  const [earnedCredits, setEarnedCredits] = useState(profile.earnedCredits);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      university,
      program,
      academicYear,
      currentSemester,
      totalCreditsRequired: Number(totalCredits),
      earnedCredits: Number(earnedCredits),
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleExportData = () => {
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('unimate_v2_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          data[key] = localStorage.getItem(key);
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unimate_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-5">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          Settings & University Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure degree parameters, ECTS credit requirements, and system preferences.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Profile and academic settings updated successfully.</span>
        </div>
      )}

      {/* Academic Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <User className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-slate-100">Student Identity & Degree Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">University / Faculty</label>
            <input
              type="text"
              value={university}
              onChange={e => setUniversity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Degree Program</label>
            <input
              type="text"
              value={program}
              onChange={e => setProgram(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Academic Year</label>
            <input
              type="text"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Current Semester</label>
            <input
              type="text"
              value={currentSemester}
              onChange={e => setCurrentSemester(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Grading System</label>
            <div className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono text-amber-400">
              0.00 – 10.00 (European ECTS Standard)
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Earned ECTS Credits</label>
            <input
              type="number"
              value={earnedCredits}
              onChange={e => setEarnedCredits(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Degree Total Required ECTS</label>
            <input
              type="number"
              value={totalCredits}
              onChange={e => setTotalCredits(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Save Profile Settings
          </button>
        </div>
      </form>

      {/* Data Backup & Reset */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-slate-100">Data Management & Persistence</h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          UNI·MATE operates with client-side zero-latency persistence. All courses, grades, tasks, notes, and study sessions are stored in your browser's persistent storage.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Academic Backup (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all academic data to factory demonstration seed data?')) {
                resetAllData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/20 hover:bg-red-900/30 border border-red-500/30 text-xs font-semibold text-red-400 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* About Architecture */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-300">
          <Info className="w-4 h-4 text-amber-400" />
          <span>About UNI·MATE</span>
        </div>
        <p>
          Version 2.4.0 — The University Operating System. Designed for university students requiring rigorous ECTS tracking, proactive workload strain detection, precision 0.00–10.00 grade simulation, and context-aware academic AI intelligence.
        </p>
      </div>
    </div>
  );
};
