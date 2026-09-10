import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Calendar,
  Award,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Clock,
  Play,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CourseDetailModal } from './CourseDetailModal';
import { getGradeClassification } from '../../engines/gradeEngine';

export const CoursesView: React.FC = () => {
  const {
    courses,
    scheduleEvents,
    assessments,
    selectedCourseId,
    setSelectedCourseId,
    setIsQuickAddOpen,
    setIsStudyModeActive,
    setActiveFocusContext,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('active');

  const filteredCourses = courses.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  return (
    <div id="courses-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Courses Workspace
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your academic curriculum, ECTS credits, lecture attendance, and connected workspaces.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium text-slate-400">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'active' ? 'bg-slate-800 text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-slate-800 text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              All
            </button>
          </div>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => {
          const gradeInfo = getGradeClassification(course.currentGrade);
          const nextAssessment = assessments.find(a => a.courseId === course.id && a.status === 'upcoming');
          const nextClass = scheduleEvents.find(e => e.courseId === course.id && e.type === 'class');

          const att = course.attendance || { attended: 0, total: 0, minRequiredPercent: 80 };
          const attPct = att.total > 0 ? Math.round((att.attended / att.total) * 100) : 100;
          const isAttWarning = attPct <= (att.minRequiredPercent || 80) + 5;

          return (
            <div
              key={course.id}
              className="rounded-2xl bg-[#0f172a] border border-slate-800/80 hover:border-slate-700 p-5 flex flex-col justify-between transition-all hover:shadow-xl group"
            >
              <div>
                {/* Course Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {course.code}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {course.ects} ECTS
                    </span>
                  </div>

                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${gradeInfo.badgeClass}`}>
                    {course.currentGrade.toFixed(1)} / 10
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-100 mt-2 line-clamp-1 group-hover:text-amber-400 transition-colors">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 truncate">
                  {course.professor} • {course.room}
                </p>

                {/* Progress / Key stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Target Grade</span>
                    <div className="font-mono font-semibold text-amber-400">
                      {course.targetGrade.toFixed(1)} / 10
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Attendance</span>
                    <div className="font-mono font-semibold text-slate-200 flex items-center gap-1">
                      <span>{attPct}%</span>
                      {isAttWarning && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                    </div>
                  </div>
                </div>

                {/* Next Assessment or Next Class */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  {nextAssessment ? (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-purple-400 font-medium truncate">
                        <Award className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{nextAssessment.name}</span>
                      </span>
                      <span className="font-mono text-slate-400 ml-2">{nextAssessment.date}</span>
                    </div>
                  ) : nextClass ? (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1.5 text-amber-400 font-medium truncate">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{nextClass.startTime} – {nextClass.endTime}</span>
                      </span>
                      <span className="font-mono text-slate-400 ml-2">{nextClass.location || course.room}</span>
                    </div>
                  ) : (
                    <div className="text-[11px] text-slate-500">Regular lectures scheduled</div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80">
                <button
                  onClick={() => setSelectedCourseId(course.id)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setActiveFocusContext(course.id, null);
                    setIsStudyModeActive(true);
                  }}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                  title="Start study focus for this course"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {selectedCourseId && (
        <CourseDetailModal
          courseId={selectedCourseId}
          onClose={() => setSelectedCourseId(null)}
        />
      )}
    </div>
  );
};
