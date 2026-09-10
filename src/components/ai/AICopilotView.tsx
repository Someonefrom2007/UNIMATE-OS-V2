import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  Calendar,
  Award,
  CheckSquare,
  Clock,
  ArrowRight,
  BookOpen,
  User,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AICopilotView: React.FC = () => {
  const {
    aiMessages,
    sendAIMessage,
    clearAIChat,
    isAILoading,
    courses,
    tasks,
    gpa,
    nextAction,
    profile,
    setCurrentView,
    setIsStudyModeActive,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAILoading]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isAILoading) return;
    const query = inputQuery.trim();
    setInputQuery('');
    sendAIMessage(query);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (isAILoading) return;
    sendAIMessage(prompt);
  };

  return (
    <div id="ai-copilot-view" className="space-y-4 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col pb-4">
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Academic Copilot
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Context Active: {profile.program}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Informed by your actual curriculum, {courses.length} courses, {tasks.length} tasks, and {gpa.toFixed(2)} GPA.
            </p>
          </div>
        </div>

        <button
          onClick={clearAIChat}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs flex items-center gap-1 cursor-pointer"
          title="Reset conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 flex-shrink-0 no-scrollbar">
        {[
          "What should I work on right now?",
          "What grade do I need in Machine Learning to secure an 8.0?",
          "Summarize my workload strain for this week",
          "Break down my Research Methods paper into 4 milestones",
          "How can I improve my 7.82 GPA before finals?",
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(prompt)}
            disabled={isAILoading}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-amber-400 transition-colors whitespace-nowrap cursor-pointer flex-shrink-0 disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-inner">
        {aiMessages.map(msg => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl p-4 rounded-2xl ${
                  isUser
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-sm shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-md'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>
                <div
                  className={`text-[9px] font-mono mt-2 ${
                    isUser ? 'text-amber-900' : 'text-slate-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isAILoading && (
          <div className="flex items-center gap-3 text-xs text-slate-400 animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl">
              Analyzing academic schedule, grade parameters, and workload...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
          placeholder="Ask Copilot anything about your courses, grades, exams, or next free study window..."
          disabled={isAILoading}
          className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={isAILoading || !inputQuery.trim()}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </form>
    </div>
  );
};
