import React from 'react';
import { X, AlertTriangle, Calendar, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { Task, Assessment, Course } from '../../types';
import { useApp } from '../../context/AppContext';

interface NotificationsDrawerProps {
  onClose?: () => void;
  urgentTasks?: Task[];
  upcomingExams?: Assessment[];
  attendanceAlerts?: Course[];
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  onClose = () => {},
  urgentTasks: propUrgentTasks,
  upcomingExams: propUpcomingExams,
  attendanceAlerts: propAttendanceAlerts,
}) => {
  const { setCurrentView, setSelectedCourseId, toggleTaskCompleted, tasks, assessments, courses } = useApp();

  const safeTasks = tasks || [];
  const safeAssessments = assessments || [];
  const safeCourses = courses || [];

  const urgentTasks =
    propUrgentTasks ??
    safeTasks.filter(t => t.status !== 'completed' && (t.priority === 'urgent' || t.priority === 'high'));
  const upcomingExams = propUpcomingExams ?? safeAssessments.filter(a => a.status === 'upcoming');
  const attendanceAlerts =
    propAttendanceAlerts ??
    safeCourses.filter(
      c =>
        c.attendance &&
        (c.attendance.attended / c.attendance.total) * 100 <= (c.attendance.minRequiredPercent || 80) + 5
    );

  return (
    <div
      id="notifications-drawer"
      className="absolute right-0 top-12 w-80 sm:w-96 bg-[#0f172a] border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
            Academic Notifications
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-2">
        {/* Attendance Warnings */}
        {attendanceAlerts.map(c => (
          <div
            key={`notif-att-${c.id}`}
            className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between text-red-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Attendance Threshold Alert
              </span>
              <span className="font-mono text-[10px] bg-red-500/20 px-1.5 py-0.5 rounded">
                {Math.round((c.attendance.attended / c.attendance.total) * 100)}%
              </span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {c.name} requires {c.attendance.minRequiredPercent}% attendance. You have missed {c.attendance.total - c.attendance.attended} sessions.
            </p>
            <button
              onClick={() => {
                setSelectedCourseId(c.id);
                setCurrentView('courses');
                onClose();
              }}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-medium pt-0.5"
            >
              Open Course Workspace <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Urgent Deadlines */}
        {urgentTasks.map(t => (
          <div
            key={`notif-task-${t.id}`}
            className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between text-amber-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Urgent Submission
              </span>
              <span className="font-mono text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded">
                Due {t.dueDate}
              </span>
            </div>
            <p className="text-slate-200 font-medium text-[11px]">{t.title}</p>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => {
                  toggleTaskCompleted(t.id);
                  onClose();
                }}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30"
              >
                <CheckCircle className="w-3 h-3" /> Mark Completed
              </button>
              <button
                onClick={() => {
                  setCurrentView('tasks');
                  onClose();
                }}
                className="text-[10px] text-slate-400 hover:text-slate-200"
              >
                View in Tasks →
              </button>
            </div>
          </div>
        ))}

        {/* Upcoming Exams */}
        {upcomingExams.map(a => (
          <div
            key={`notif-exam-${a.id}`}
            className="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between text-purple-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Upcoming {a.type.toUpperCase()}
              </span>
              <span className="font-mono text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded">
                {a.weight}% Weight
              </span>
            </div>
            <p className="text-slate-200 font-medium text-[11px]">{a.name}</p>
            <p className="text-slate-400 text-[10px]">Date: {a.date} {a.time ? `at ${a.time}` : ''}</p>
            <button
              onClick={() => {
                setCurrentView('exams');
                onClose();
              }}
              className="text-[11px] text-purple-300 hover:underline flex items-center gap-1 font-medium pt-0.5"
            >
              Check Exam Readiness & Topics <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        ))}

        {urgentTasks.length === 0 && upcomingExams.length === 0 && attendanceAlerts.length === 0 && (
          <div className="p-4 text-center text-slate-400 text-xs space-y-1">
            <p className="font-semibold text-slate-300">All caught up!</p>
            <p className="text-[11px]">No urgent academic bottlenecks detected.</p>
          </div>
        )}
      </div>
    </div>
  );
};
