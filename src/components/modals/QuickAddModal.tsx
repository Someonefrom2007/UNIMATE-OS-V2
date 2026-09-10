import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Award,
  BookOpen,
  FileEdit,
  Calendar,
  Flame,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

type QuickAddType = 'task' | 'exam' | 'course' | 'note' | 'event' | 'habit';

export const QuickAddModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    courses,
    addTask,
    addAssessment,
    addCourse,
    addNote,
    addScheduleEvent,
    addHabit,
    todayDateStr,
  } = useApp();

  const [activeTab, setActiveTab] = useState<QuickAddType>('task');

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCourseId, setTaskCourseId] = useState(courses[0]?.id || '');
  const [taskDueDate, setTaskDueDate] = useState(todayDateStr);
  const [taskPriority, setTaskPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('medium');
  const [taskMinutes, setTaskMinutes] = useState(45);

  // Exam Form State
  const [examName, setExamName] = useState('');
  const [examCourseId, setExamCourseId] = useState(courses[0]?.id || '');
  const [examType, setExamType] = useState<'midterm' | 'final' | 'quiz' | 'assignment'>('midterm');
  const [examDate, setExamDate] = useState(todayDateStr);
  const [examWeight, setExamWeight] = useState(30);

  // Note Form State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteCourseId, setNoteCourseId] = useState(courses[0]?.id || '');
  const [noteContent, setNoteContent] = useState('');

  // Course Form State
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseProfessor, setCourseProfessor] = useState('');
  const [courseEcts, setCourseEcts] = useState(6);
  const [courseTargetGrade, setCourseTargetGrade] = useState(8.5);

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(todayDateStr);
  const [eventStart, setEventStart] = useState('10:00');
  const [eventEnd, setEventEnd] = useState('11:30');
  const [eventLocation, setEventLocation] = useState('Room B204');

  // Habit Form State
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState('Study');

  if (!isQuickAddOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'task') {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle.trim(),
        courseId: taskCourseId || undefined,
        dueDate: taskDueDate,
        priority: taskPriority,
        status: 'todo',
        estimatedMinutes: Number(taskMinutes),
        actualMinutes: 0,
        tags: ['academic'],
        subtasks: [],
      });
      setTaskTitle('');
    } else if (activeTab === 'exam') {
      if (!examName.trim()) return;
      addAssessment({
        name: examName.trim(),
        courseId: examCourseId,
        type: examType,
        date: examDate,
        weight: Number(examWeight),
        status: 'upcoming',
        topics: [
          { name: 'Core Foundations', readiness: 60 },
          { name: 'Advanced Topics', readiness: 40 },
        ],
      });
      setExamName('');
    } else if (activeTab === 'note') {
      if (!noteTitle.trim()) return;
      addNote({
        title: noteTitle.trim(),
        content: noteContent.trim() || `# ${noteTitle}\n\nKey concepts and takeaways.`,
        courseId: noteCourseId || undefined,
        tags: ['notes'],
        isPinned: false,
        isFavorite: false,
      });
      setNoteTitle('');
      setNoteContent('');
    } else if (activeTab === 'course') {
      if (!courseName.trim()) return;
      addCourse({
        name: courseName.trim(),
        code: courseCode.trim() || 'CS' + Math.floor(Math.random() * 800 + 100),
        professor: courseProfessor.trim() || 'Academic Faculty',
        room: 'Lecture Hall',
        ects: Number(courseEcts),
        semester: 'Semester 1',
        academicYear: '2026/2027',
        targetGrade: Number(courseTargetGrade),
        currentGrade: 0,
        color: '#f59e0b',
        status: 'active',
        attendance: { attended: 0, total: 0, minRequiredPercent: 80 },
      });
      setCourseName('');
    } else if (activeTab === 'event') {
      if (!eventTitle.trim()) return;
      addScheduleEvent({
        title: eventTitle.trim(),
        courseId: taskCourseId || undefined,
        date: eventDate,
        startTime: eventStart,
        endTime: eventEnd,
        type: 'class',
        location: eventLocation,
      });
      setEventTitle('');
    } else if (activeTab === 'habit') {
      if (!habitTitle.trim()) return;
      addHabit({
        title: habitTitle.trim(),
        category: habitCategory,
        targetDaysPerWeek: 5,
        frequency: 'daily',
      });
      setHabitTitle('');
    }

    setIsQuickAddOpen(false);
  };

  return (
    <div
      id="quick-add-backdrop"
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setIsQuickAddOpen(false)}
    >
      <div
        id="quick-add-modal"
        className="w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0d131f]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Quick Add</h2>
              <p className="text-[11px] text-slate-400">Instantly record university items</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-3 pt-2 gap-1 overflow-x-auto">
          {[
            { id: 'task' as QuickAddType, label: 'Task', icon: CheckSquare },
            { id: 'exam' as QuickAddType, label: 'Exam', icon: Award },
            { id: 'note' as QuickAddType, label: 'Note', icon: FileEdit },
            { id: 'event' as QuickAddType, label: 'Event', icon: Calendar },
            { id: 'course' as QuickAddType, label: 'Course', icon: BookOpen },
            { id: 'habit' as QuickAddType, label: 'Habit', icon: Flame },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-slate-800/80'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-5 space-y-4">
          {activeTab === 'task' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Dijkstra runtime benchmark"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Course</label>
                  <select
                    value={taskCourseId}
                    onChange={e => setTaskCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={taskMinutes}
                    onChange={e => setTaskMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'exam' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Assessment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midterm Examination: Dynamic Programming"
                  value={examName}
                  onChange={e => setExamName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Course</label>
                  <select
                    value={examCourseId}
                    onChange={e => setExamCourseId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                  <select
                    value={examType}
                    onChange={e => setExamType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  >
                    <option value="midterm">Midterm Exam</option>
                    <option value="final">Final Exam</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Weight (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={examWeight}
                    onChange={e => setExamWeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'note' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heuristic Functions for A* Graph Search"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Course</label>
                <select
                  value={noteCourseId}
                  onChange={e => setNoteCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Quick Markdown Notes</label>
                <textarea
                  rows={3}
                  placeholder="Record summary formulas or core definitions..."
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </>
          )}

          {activeTab === 'event' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neural Networks Lab Session"
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={eventStart}
                    onChange={e => setEventStart(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={eventEnd}
                    onChange={e => setEventEnd(e.target.value)}
                    className="w-full px-2 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={e => setEventLocation(e.target.value)}
                  placeholder="Room B204 / Library Pod 2"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </>
          )}

          {activeTab === 'course' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Operating Systems"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Code</label>
                  <input
                    type="text"
                    placeholder="e.g. CS305"
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">ECTS Credits</label>
                  <input
                    type="number"
                    value={courseEcts}
                    onChange={e => setCourseEcts(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Professor</label>
                  <input
                    type="text"
                    placeholder="Dr. Professor Name"
                    value={courseProfessor}
                    onChange={e => setCourseProfessor(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Grade (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={courseTargetGrade}
                    onChange={e => setCourseTargetGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'habit' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 1 Academic Paper Daily"
                  value={habitTitle}
                  onChange={e => setHabitTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={habitCategory}
                  onChange={e => setHabitCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="Study">Study</option>
                  <option value="Academics">Academics</option>
                  <option value="Attendance">Attendance</option>
                  <option value="Health">Health / Routine</option>
                </select>
              </div>
            </>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
