import React from 'react';
import {
  Layers,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  ShieldCheck,
  Cpu,
  Database,
  Users,
  ArrowRight,
} from 'lucide-react';
import { Logo } from '../common/Logo';

export const PlansView: React.FC = () => {
  return (
    <div id="plans-view" className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 font-mono text-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>Product Architecture & Roadmap</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100 font-sans">
          The Academic Operating System Roadmap
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          UNI·MATE is designed to organize, understand, and connect your entire university life. 
          The core academic operating system is completely free and uncompromised.
        </p>
      </div>

      {/* Tier Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE - ORGANIZE (Active) */}
        <div className="relative p-6 rounded-2xl bg-slate-900/90 border-2 border-amber-500/50 shadow-xl shadow-amber-500/10 flex flex-col justify-between">
          <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-black uppercase tracking-wider">
            Current Tier • Active
          </div>

          <div>
            <div className="flex items-center justify-between mt-2 mb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Level 1
                </span>
                <h3 className="text-2xl font-black text-slate-100 font-mono">FREE</h3>
                <span className="text-xs font-semibold text-slate-400">ORGANIZE</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              The foundational personal academic command center. Unlocked with full persistence, local-first storage, and complete academic tracking.
            </p>

            <div className="space-y-2.5 border-t border-slate-800 pt-4">
              {[
                'Full Academic Dashboard & Next Class radar',
                'Unlimited Courses, ECTS & Prof tracking',
                'Weighted Grade Engine & GPA simulator',
                'Interactive Schedule & Conflict detection',
                'Task Management with Subtasks & Deadlines',
                'Exam Horizon countdown & Preparation logs',
                'Notes & Knowledge Vault with Markdown',
                'Academic Resource Repository (PDF, Slides, Links)',
                'Focus Session Timer & History tracking',
                'Semester Goals & Habit Consistency Tracker',
                'Deterministic Workload & Stress Engine',
                'Academic Copilot & Next Action Recommendations',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800">
            <div className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono font-bold text-xs text-center">
              Active on this Device
            </div>
          </div>
        </div>

        {/* PRO - UNDERSTAND (Coming Soon) */}
        <div className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between opacity-90 hover:opacity-100 transition-opacity">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Level 2
                </span>
                <h3 className="text-2xl font-black text-slate-100 font-mono">PRO</h3>
                <span className="text-xs font-semibold text-slate-400">UNDERSTAND</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Cpu className="w-6 h-6" />
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Deep academic intelligence. Extracts syllabus schedules from PDFs, generates exam flashcards, and models predictive study plans.
            </p>

            <div className="space-y-2.5 border-t border-slate-800 pt-4">
              {[
                'Automated Syllabus & PDF Document Parsing (OCR)',
                'Predictive Workload Modeling & Burnout Radar',
                'AI Spaced-Repetition Flashcard Generation',
                'Topic Mastery Quizzing from Lecture Notes',
                'Dynamic Study Planner with Missed-Session Recovery',
                'Multi-Year Academic Transcript Simulations',
                'Granular Course Health Diagnostic Audits',
                'Cognitive Peak Study Optimization Engine',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800">
            <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 font-mono text-xs text-center font-medium">
              Coming in v2.2 • In Development
            </div>
          </div>
        </div>

        {/* ULTIMATE - CONNECT (Coming Soon) */}
        <div className="relative p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col justify-between opacity-90 hover:opacity-100 transition-opacity">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider">
                  Level 3
                </span>
                <h3 className="text-2xl font-black text-slate-100 font-mono">ULTIMATE</h3>
                <span className="text-xs font-semibold text-slate-400">CONNECT</span>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Globe className="w-6 h-6" />
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Connect to your university ecosystem. Real-time peer study groups, campus LMS auto-sync, and cross-device encrypted sync.
            </p>

            <div className="space-y-2.5 border-t border-slate-800 pt-4">
              {[
                'Seamless Google Calendar 2-Way Live Sync',
                'Google Drive Academic Vault Integration',
                'End-to-End Encrypted Multi-Device Cloud Sync',
                'Shared Study Groups & Collaborative Notes',
                'Campus LMS Integration (Canvas, Moodle, Blackboard)',
                'Group Project Task boards & File Hubs',
                'Campus Map, Buildings & Lecture Hall locator',
                'Peer Study Session Live Presence',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <Users className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800">
            <div className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 font-mono text-xs text-center font-medium">
              Coming in v2.5 • Planned Architecture
            </div>
          </div>
        </div>
      </div>

      {/* Core Philosophy Callout */}
      <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Logo size="md" />
          <div>
            <h4 className="text-sm font-bold text-slate-100">
              Honest University Software
            </h4>
            <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
              We never fabricate artificial feature paywalls, show misleading discounts, or lock away basic student productivity tools.
              UNI·MATE is designed to be your dependable academic companion through your entire degree.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
            FREE = ORGANIZE • PRO = UNDERSTAND • ULTIMATE = CONNECT
          </span>
        </div>
      </div>
    </div>
  );
};
