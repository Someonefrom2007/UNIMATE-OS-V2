import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  AlertTriangle,
  MapPin,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ScheduleEvent } from '../../types';

export const ScheduleView: React.FC = () => {
  const {
    scheduleEvents,
    courses,
    todayDateStr,
    currentTimeStr,
    addScheduleEvent,
    deleteScheduleEvent,
    setIsStudyModeActive,
    setActiveFocusContext,
    setIsQuickAddOpen,
  } = useApp();

  const [selectedDate, setSelectedDate] = useState(todayDateStr);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

  // Filter events for selected day
  const dayEvents = scheduleEvents
    .filter(e => e.date === selectedDate)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Conflict Detection: check if any events on selected date overlap
  const conflictPairs: [string, string][] = [];
  for (let i = 0; i < dayEvents.length; i++) {
    for (let j = i + 1; j < dayEvents.length; j++) {
      const e1 = dayEvents[i];
      const e2 = dayEvents[j];
      if (e1.startTime < e2.endTime && e2.startTime < e1.endTime) {
        conflictPairs.push([e1.title, e2.title]);
      }
    }
  }

  // Detect Free time slots between events
  const freeSlots: { start: string; end: string; durationMins: number }[] = [];
  if (dayEvents.length > 0) {
    for (let i = 0; i < dayEvents.length - 1; i++) {
      const currentEnd = dayEvents[i].endTime;
      const nextStart = dayEvents[i + 1].startTime;
      if (currentEnd < nextStart) {
        const [h1, m1] = currentEnd.split(':').map(Number);
        const [h2, m2] = nextStart.split(':').map(Number);
        const duration = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (duration >= 30) {
          freeSlots.push({ start: currentEnd, end: nextStart, durationMins: duration });
        }
      }
    }
  }

  return (
    <div id="schedule-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Schedule Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            Schedule & Smart Timetable
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Intelligent calendar detecting free study windows and lecture conflicts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSelectedDate(todayDateStr)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Today
          </button>

          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium text-slate-400">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'day' ? 'bg-slate-800 text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'week' ? 'bg-slate-800 text-slate-100 font-semibold' : 'hover:text-slate-200'
              }`}
            >
              Week
            </button>
          </div>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Date Selector Row */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-slate-100">
            {selectedDate === todayDateStr ? 'Today • ' : ''}
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-700 px-2 py-1 rounded text-slate-200 font-mono focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Conflict Alert (if any detected) */}
      {conflictPairs.length > 0 && (
        <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center gap-3 text-xs text-red-300">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <div>
            <span className="font-bold">Schedule Conflict Detected: </span>
            {conflictPairs.map(([e1, e2], idx) => (
              <span key={idx}>"{e1}" overlaps with "{e2}".</span>
            ))}
          </div>
        </div>
      )}

      {/* Day View Timeline */}
      <div className="space-y-4">
        {dayEvents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-[#0f172a] rounded-2xl border border-slate-800 space-y-3">
            <CalendarIcon className="w-8 h-8 text-slate-600 mx-auto" />
            <div>
              <p className="text-sm font-semibold text-slate-300">No events on this day.</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Enjoy your free study time or plan a revision session.
              </p>
            </div>
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
            >
              Add Schedule Event
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayEvents.map(evt => {
              const course = courses.find(c => c.id === evt.courseId);
              const isClass = evt.type === 'class';
              const isExam = evt.type === 'exam';

              return (
                <div
                  key={evt.id}
                  className="p-4 rounded-xl bg-[#0f172a] border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-2.5 h-10 rounded-full flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: course?.color || '#64748b' }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {evt.type}
                        </span>
                        {course && (
                          <span className="text-xs font-semibold text-amber-400">
                            {course.code}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 mt-1">{evt.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        {evt.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {evt.location}
                          </span>
                        )}
                        {evt.notes && <span className="text-slate-400 truncate max-w-xs">{evt.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-slate-200">
                        {evt.startTime} – {evt.endTime}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {selectedDate === todayDateStr && evt.startTime <= currentTimeStr && evt.endTime >= currentTimeStr
                          ? 'In progress'
                          : 'Scheduled'}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteScheduleEvent(evt.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Free Time Slot Suggestions */}
        {freeSlots.length > 0 && (
          <div className="pt-4 space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Smart Free-Time Recommendations
            </h3>

            {freeSlots.map((slot, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-cyan-300 flex items-center gap-2">
                    <span>{slot.start} – {slot.end}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                      {slot.durationMins} minutes free
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Ideal window for a deep-focus session on upcoming Algorithms or Machine Learning topics.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveFocusContext(null, null);
                    setIsStudyModeActive(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm w-fit"
                >
                  <Play className="w-3 h-3 fill-slate-950" />
                  Plan Study Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
