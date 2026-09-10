import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  Check,
  ChevronDown,
  ChevronRight,
  FolderGit2,
  Trash2,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Task, Project } from '../../types';

type TaskFilter = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed' | 'projects';

export const TasksView: React.FC = () => {
  const {
    tasks,
    projects,
    courses,
    todayDateStr,
    toggleTaskCompleted,
    deleteTask,
    toggleProjectMilestone,
    setIsQuickAddOpen,
  } = useApp();

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter(t => {
    if (selectedCourseFilter !== 'all' && t.courseId !== selectedCourseFilter) return false;

    if (filter === 'today') return t.dueDate === todayDateStr && t.status !== 'completed';
    if (filter === 'upcoming') return t.dueDate > todayDateStr && t.status !== 'completed';
    if (filter === 'overdue') return t.dueDate < todayDateStr && t.status !== 'completed';
    if (filter === 'completed') return t.status === 'completed';
    if (filter === 'projects') return false; // Handled separately
    return true;
  });

  const priorityColors = {
    urgent: 'text-red-400 bg-red-500/10 border-red-500/20',
    high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    medium: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    low: 'text-slate-400 bg-slate-800 border-slate-700',
  };

  return (
    <div id="tasks-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Academic Tasks & Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track coursework, laboratory implementations, thesis milestones, and project deliverables.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all' as TaskFilter, label: 'All Tasks' },
            { id: 'today' as TaskFilter, label: 'Due Today' },
            { id: 'upcoming' as TaskFilter, label: 'Upcoming' },
            { id: 'overdue' as TaskFilter, label: 'Overdue' },
            { id: 'completed' as TaskFilter, label: 'Completed' },
            { id: 'projects' as TaskFilter, label: 'Projects' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Course Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Course:</span>
          <select
            value={selectedCourseFilter}
            onChange={e => setSelectedCourseFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 1. PROJECTS VIEW (when Projects tab selected) */}
      {filter === 'projects' ? (
        <div className="space-y-4">
          {projects.map(project => {
            const course = courses.find(c => c.id === project.courseId);
            return (
              <div
                key={project.id}
                className="p-5 rounded-2xl bg-[#0f172a] border border-slate-800 space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Academic Project
                      </span>
                      {course && (
                        <span className="text-xs font-semibold text-amber-400">
                          {course.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{project.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{project.description}</p>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-slate-100">{project.progress}% Complete</div>
                    <div className="text-xs text-slate-400">Deadline: {project.deadline}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                {/* Milestones checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Project Milestones
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(project.milestones || []).map(m => (
                      <button
                        key={m.id}
                        onClick={() => toggleProjectMilestone(project.id, m.id)}
                        className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all cursor-pointer ${
                          m.completed
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                              m.completed
                                ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                                : 'border-slate-600 bg-slate-950'
                            }`}
                          >
                            {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className={`text-xs truncate ${m.completed ? 'line-through text-slate-500' : ''}`}>
                            {m.title}
                          </span>
                        </div>
                        {m.dueDate && (
                          <span className="text-[10px] font-mono text-slate-500 ml-2 flex-shrink-0">
                            {m.dueDate}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. STANDARD TASKS LIST */
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-[#0f172a] rounded-2xl border border-slate-800 space-y-2">
              <CheckSquare className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-300">No tasks in this view.</p>
              <p className="text-xs text-slate-500">All planned academic tasks are up to date.</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const course = courses.find(c => c.id === task.courseId);
              const isDone = task.status === 'completed';
              const isExpanded = expandedTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`rounded-xl border transition-all ${
                    isDone
                      ? 'bg-slate-900/40 border-slate-800 opacity-60'
                      : 'bg-[#0f172a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => toggleTaskCompleted(task.id)}
                        className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center transition-colors cursor-pointer flex-shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-600 bg-slate-950 hover:border-amber-400'
                        }`}
                      >
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded border ${
                              priorityColors[task.priority]
                            }`}
                          >
                            {task.priority}
                          </span>
                          {course && (
                            <span className="text-xs font-semibold text-amber-400">
                              {course.code}
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-slate-400">
                            Due {task.dueDate}
                          </span>
                        </div>

                        <h3
                          className={`text-sm font-bold mt-1 text-slate-100 ${
                            isDone ? 'line-through text-slate-500' : ''
                          }`}
                        >
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Tags and Duration */}
                        <div className="flex items-center gap-3 mt-2 text-[11px] font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {task.estimatedMinutes} mins est.
                          </span>
                          {(task.tags || []).map(tag => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {(task.subtasks || []).length > 0 && (
                        <button
                          onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded bg-slate-800"
                        >
                          <span>{(task.subtasks || []).filter(s => s.completed).length}/{(task.subtasks || []).length}</span>
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtasks dropdown */}
                  {isExpanded && (task.subtasks || []).length > 0 && (
                    <div className="px-5 pb-4 pt-1 border-t border-slate-800/80 space-y-1.5 bg-slate-950/40">
                      <div className="text-[10px] font-mono text-slate-500 uppercase">Subtasks</div>
                      {(task.subtasks || []).map(sub => (
                        <div key={sub.id} className="flex items-center gap-2 text-xs text-slate-300">
                          <Check className={`w-3.5 h-3.5 ${sub.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                          <span className={sub.completed ? 'line-through text-slate-500' : ''}>
                            {sub.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
