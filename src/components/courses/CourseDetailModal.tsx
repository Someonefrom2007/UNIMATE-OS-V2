import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  CheckSquare,
  Award,
  TrendingUp,
  FileEdit,
  FolderOpen,
  Timer,
  AlertTriangle,
  Plus,
  Play,
  Check,
  Trash2,
} from 'lucide-react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';
import { getGradeClassification } from '../../engines/gradeEngine';

interface CourseDetailModalProps {
  courseId: string;
  onClose: () => void;
}

type TabType = 'overview' | 'tasks' | 'exams' | 'notes' | 'resources' | 'attendance';

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ courseId, onClose }) => {
  const {
    courses,
    scheduleEvents,
    tasks,
    assessments,
    notes,
    resources,
    focusSessions,
    recordAttendance,
    deleteCourse,
    updateCourse,
    setIsStudyModeActive,
    setActiveFocusContext,
    toggleTaskCompleted,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const course = courses.find(c => c.id === courseId);
  if (!course) return null;

  const courseTasks = tasks.filter(t => t.courseId === course.id);
  const courseExams = assessments.filter(a => a.courseId === course.id);
  const courseNotes = notes.filter(n => n.courseId === course.id);
  const courseResources = resources.filter(r => r.courseId === course.id);
  const courseEvents = scheduleEvents.filter(e => e.courseId === course.id);
  const courseFocusSessions = focusSessions.filter(f => f.courseId === course.id);

  const totalFocusHours = (
    courseFocusSessions.reduce((sum, f) => sum + f.durationMinutes, 0) / 60
  ).toFixed(1);

  // Attendance metrics
  const attendance = course.attendance || { attended: 0, total: 0, minRequiredPercent: 80 };
  const attendancePct = attendance.total > 0 ? Math.round((attendance.attended / attendance.total) * 100) : 100;
  const absences = attendance.total - attendance.attended;
  const isNearLimit = attendancePct <= (attendance.minRequiredPercent || 80) + 6;

  const gradeInfo = getGradeClassification(course.currentGrade);

  return (
    <div
      id="course-workspace-modal-backdrop"
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6"
      onClick={onClose}
    >
      <div
        id="course-workspace-modal"
        className="w-full max-w-4xl max-h-[90vh] bg-[#0d131f] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Course Header Banner */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className="w-3.5 h-12 rounded-full flex-shrink-0 mt-1"
              style={{ backgroundColor: course.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {course.code}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {course.ects} ECTS • {course.semester}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 mt-1">{course.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Instructor: {course.professor} • Lecture Hall: {course.room}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveFocusContext(course.id, null);
                setIsStudyModeActive(true);
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              Focus Course
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 gap-2 overflow-x-auto">
          {[
            { id: 'overview' as TabType, label: 'Overview', icon: BookOpen },
            { id: 'tasks' as TabType, label: `Tasks (${courseTasks.length})`, icon: CheckSquare },
            { id: 'exams' as TabType, label: `Assessments (${courseExams.length})`, icon: Award },
            { id: 'notes' as TabType, label: `Notes (${courseNotes.length})`, icon: FileEdit },
            { id: 'resources' as TabType, label: `Resources (${courseResources.length})`, icon: FolderOpen },
            { id: 'attendance' as TabType, label: `Attendance (${attendancePct}%)`, icon: Calendar },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 py-3 px-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Current Grade</div>
                  <div className="text-xl font-black font-mono text-slate-100 mt-1">
                    {course.currentGrade.toFixed(1)} <span className="text-xs font-normal text-slate-500">/ 10</span>
                  </div>
                  <div className={`text-[9px] font-mono mt-1 px-1.5 py-0.2 rounded inline-block ${gradeInfo.badgeClass}`}>
                    {gradeInfo.label}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Target Grade</div>
                  <div className="text-xl font-black font-mono text-amber-400 mt-1">
                    {course.targetGrade.toFixed(1)} <span className="text-xs font-normal text-slate-500">/ 10</span>
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">Goal Set</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Attendance</div>
                  <div className="text-xl font-black font-mono text-slate-100 mt-1">
                    {attendancePct}%
                  </div>
                  <div className="text-[9px] text-slate-400 mt-1">
                    {attendance.attended} of {attendance.total} sessions
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Focused Time</div>
                  <div className="text-xl font-black font-mono text-slate-100 mt-1">
                    {totalFocusHours}h
                  </div>
                  <div className="text-[9px] text-purple-400 mt-1">Deep Work Logged</div>
                </div>
              </div>

              {/* Attendance Warning if close */}
              {isNearLimit && (
                <div className="p-3.5 rounded-xl bg-amber-950/25 border border-amber-500/30 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-400">Attendance Threshold Proximity</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      You are currently at {attendancePct}% attendance ({absences} absences recorded). 1-2 more absences may put you below the course's mandatory {attendance.minRequiredPercent}% requirement.
                    </p>
                  </div>
                </div>
              )}

              {/* Connected Schedule Events */}
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Regular Weekly Schedule
                </h3>
                <div className="space-y-2">
                  {courseEvents.length === 0 ? (
                    <p className="text-xs text-slate-500">No scheduled sessions recorded.</p>
                  ) : (
                    courseEvents.map(evt => (
                      <div
                        key={evt.id}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-semibold text-slate-200">{evt.title}</span>
                          <span className="text-slate-400">({evt.location || course.room})</span>
                        </div>
                        <div className="font-mono text-slate-300 font-semibold">
                          {evt.startTime} – {evt.endTime}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              {courseTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No active tasks for {course.name}.
                </div>
              ) : (
                courseTasks.map(task => {
                  const isDone = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isDone
                          ? 'bg-slate-900/40 border-slate-800 opacity-60'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTaskCompleted(task.id)}
                          className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'border-slate-600 bg-slate-950'
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <div>
                          <div className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>Due {task.dueDate}</span>
                            <span>•</span>
                            <span className="capitalize">{task.priority} Priority</span>
                            <span>•</span>
                            <span>{task.estimatedMinutes} mins</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* 3. ASSESSMENTS TAB */}
          {activeTab === 'exams' && (
            <div className="space-y-3">
              {courseExams.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No exams or assessments logged yet for {course.name}.
                </div>
              ) : (
                courseExams.map(exam => (
                  <div
                    key={exam.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
                          {exam.type.toUpperCase()} • {exam.weight}% WEIGHT
                        </span>
                        <h4 className="text-sm font-bold text-slate-100 mt-1">{exam.name}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-slate-200">{exam.date}</div>
                        <div className="text-[10px] text-slate-400">
                          {exam.grade !== undefined ? `Grade: ${exam.grade} / 10` : 'Upcoming'}
                        </div>
                      </div>
                    </div>

                    {/* Topics readiness */}
                    {(exam.topics || []).length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Preparation Topics</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(exam.topics || []).map(topic => (
                            <div
                              key={topic.name}
                              className="p-2 rounded bg-slate-950/60 border border-slate-800 text-xs flex items-center justify-between"
                            >
                              <span className="text-slate-300 text-[11px] truncate">{topic.name}</span>
                              <span className="font-mono text-[10px] font-bold text-amber-400 ml-2">
                                {topic.readiness}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              {courseNotes.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No notes recorded for this course.
                </div>
              ) : (
                courseNotes.map(note => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{note.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{note.updatedAt}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3 font-mono bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 5. RESOURCES TAB */}
          {activeTab === 'resources' && (
            <div className="space-y-2">
              {courseResources.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No resources or syllabi uploaded for this course.
                </div>
              ) : (
                courseResources.map(res => (
                  <div
                    key={res.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderOpen className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-semibold text-slate-200">{res.title}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">{res.type} {res.size ? `• ${res.size}` : ''}</div>
                      </div>
                    </div>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-amber-400 hover:underline font-medium"
                    >
                      Open Resource
                    </a>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 6. ATTENDANCE TAB */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Attendance Statistics</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Requirement: {attendance.minRequiredPercent}% attendance to qualify for final exam.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-slate-100">
                    {attendance.attended} / {attendance.total}
                  </div>
                  <div className="text-xs font-mono font-semibold text-amber-400">
                    {attendancePct}%
                  </div>
                </div>
              </div>

              {/* Log Attendance for Today's session */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
                  Log Attendance for Lecture Session
                </h4>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => recordAttendance(course.id, true)}
                    className="flex-1 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold cursor-pointer"
                  >
                    ✓ Attended Class (+1)
                  </button>
                  <button
                    onClick={() => recordAttendance(course.id, false)}
                    className="flex-1 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 text-xs font-semibold cursor-pointer"
                  >
                    ✗ Missed Class (+0)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#0d131f] flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete ${course.name}?`)) {
                deleteCourse(course.id);
                onClose();
              }
            }}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Course
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
          >
            Close Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
