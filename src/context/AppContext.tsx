import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  AppView,
  StudentProfile,
  Course,
  ScheduleEvent,
  Task,
  Project,
  Assessment,
  Note,
  Resource,
  FocusSession,
  Goal,
  Habit,
  Flashcard,
  WorkloadMetrics,
  SemesterHealthScore,
  AcademicInsight,
  RecommendedAction,
  ChatMessage,
  BrainDumpSticky,
} from '../types';
import {
  initialProfile,
  initialCourses,
  initialScheduleEvents,
  initialTasks,
  initialProjects,
  initialAssessments,
  initialNotes,
  initialResources,
  initialFocusSessions,
  initialGoals,
  initialHabits,
  initialFlashcards,
  initialBrainDumpStickies,
} from '../mockData';
import { calculateEctsWeightedGpa } from '../engines/gradeEngine';
import { computeWorkload } from '../engines/workloadEngine';
import {
  computeSemesterHealth,
  generateInsights,
  computeNextRecommendedAction,
} from '../engines/insightEngine';
import {
  playCyberClick,
  playTapeSnap,
  playCoffeeSurge,
  playOverclockSound,
  setSoundMuted,
  toggleAmbientDrone,
} from '../utils/cyberAudio';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedCourseId: string | null;
  setSelectedCourseId: (id: string | null) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isStudyModeActive: boolean;
  setIsStudyModeActive: (active: boolean) => void;

  profile: StudentProfile;
  updateProfile: (profile: Partial<StudentProfile>) => void;

  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  recordAttendance: (courseId: string, attended: boolean) => void;

  scheduleEvents: ScheduleEvent[];
  addScheduleEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  updateScheduleEvent: (id: string, updates: Partial<ScheduleEvent>) => void;
  deleteScheduleEvent: (id: string) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;

  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;

  assessments: Assessment[];
  addAssessment: (assessment: Omit<Assessment, 'id'>) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;

  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleNotePin: (id: string) => void;
  toggleNoteFavorite: (id: string) => void;

  flashcards: Flashcard[];
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'repetitions' | 'intervalDays'>) => Flashcard;
  updateFlashcardReview: (id: string, rating: 'easy' | 'good' | 'hard') => void;
  deleteFlashcard: (id: string) => void;

  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id'>) => void;
  deleteResource: (id: string) => void;

  focusSessions: FocusSession[];
  logFocusSession: (session: Omit<FocusSession, 'id' | 'timestamp'>) => void;
  activeFocusCourseId: string | null;
  activeFocusTaskId: string | null;
  setActiveFocusContext: (courseId: string | null, taskId: string | null) => void;

  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => void;
  toggleHabitToday: (id: string) => void;
  deleteHabit: (id: string) => void;

  stickies: BrainDumpSticky[];
  addSticky: (text: string, color?: BrainDumpSticky['color'], tag?: string) => void;
  deleteSticky: (id: string) => void;
  toggleStickyPin: (id: string) => void;

  caffeineCups: number;
  addCaffeineCup: () => void;
  isChaosMode: boolean;
  setIsChaosMode: React.Dispatch<React.SetStateAction<boolean>>;
  toggleChaosMode: () => void;
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  isAmbientDroneActive: boolean;
  toggleAmbientDroneSound: () => void;

  chatMessages: ChatMessage[];
  sendChatMessage: (text: string) => Promise<void>;
  isAiLoading: boolean;

  todayDateStr: string;
  currentTimeStr: string;
  workload: WorkloadMetrics;
  semesterHealth: SemesterHealthScore;
  insights: AcademicInsight[];
  nextAction: RecommendedAction;
  gpa: number;
  totalEcts: number;
  syncStatus: 'synced' | 'syncing' | 'offline';

  exportDataAsJson: () => void;
  exportDataAsCsv: () => void;
  importDataFromJson: (jsonStr: string) => boolean;
  resetToDefaultData: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const STORAGE_PREFIX = 'unimate_v3_media_';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (Array.isArray(fallback) && !Array.isArray(parsed)) {
      return fallback;
    }
    return parsed;
  } catch (e) {
    console.warn(`Failed to read from localStorage [${key}]`, e);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Failed to save to localStorage [${key}]`, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isStudyModeActive, setIsStudyModeActive] = useState(false);
  const [activeFocusCourseId, setActiveFocusCourseId] = useState<string | null>(null);
  const [activeFocusTaskId, setActiveFocusTaskId] = useState<string | null>(null);

  const [profile, setProfile] = useState<StudentProfile>(() => loadStorage('profile', initialProfile));
  const [courses, setCourses] = useState<Course[]>(() => loadStorage('courses', initialCourses));
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(() =>
    loadStorage('schedule', initialScheduleEvents)
  );
  const [tasks, setTasks] = useState<Task[]>(() => loadStorage('tasks', initialTasks));
  const [projects, setProjects] = useState<Project[]>(() => loadStorage('projects', initialProjects));
  const [assessments, setAssessments] = useState<Assessment[]>(() =>
    loadStorage('assessments', initialAssessments)
  );
  const [notes, setNotes] = useState<Note[]>(() => loadStorage('notes', initialNotes));
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() =>
    loadStorage('flashcards', initialFlashcards)
  );
  const [resources, setResources] = useState<Resource[]>(() => loadStorage('resources', initialResources));
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() =>
    loadStorage('focus', initialFocusSessions)
  );
  const [goals, setGoals] = useState<Goal[]>(() => loadStorage('goals', initialGoals));
  const [habits, setHabits] = useState<Habit[]>(() => loadStorage('habits', initialHabits));
  const [stickies, setStickies] = useState<BrainDumpSticky[]>(() => loadStorage('stickies', initialBrainDumpStickies));
  const [caffeineCups, setCaffeineCups] = useState<number>(() => loadStorage('caffeine_cups', 3));
  const [isChaosMode, setIsChaosMode] = useState<boolean>(() => loadStorage('chaos_mode', false));
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => loadStorage('audio_muted', false));
  const [isAmbientDroneActive, setIsAmbientDroneActive] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  const todayDateStr = '2026-09-10';
  const currentTimeStr = '13:18';

  useEffect(() => { saveStorage('profile', profile); }, [profile]);
  useEffect(() => { saveStorage('courses', courses); }, [courses]);
  useEffect(() => { saveStorage('schedule', scheduleEvents); }, [scheduleEvents]);
  useEffect(() => { saveStorage('tasks', tasks); }, [tasks]);
  useEffect(() => { saveStorage('projects', projects); }, [projects]);
  useEffect(() => { saveStorage('assessments', assessments); }, [assessments]);
  useEffect(() => { saveStorage('notes', notes); }, [notes]);
  useEffect(() => { saveStorage('flashcards', flashcards); }, [flashcards]);
  useEffect(() => { saveStorage('resources', resources); }, [resources]);
  useEffect(() => { saveStorage('focus', focusSessions); }, [focusSessions]);
  useEffect(() => { saveStorage('goals', goals); }, [goals]);
  useEffect(() => { saveStorage('habits', habits); }, [habits]);
  useEffect(() => { saveStorage('stickies', stickies); }, [stickies]);
  useEffect(() => { saveStorage('caffeine_cups', caffeineCups); }, [caffeineCups]);
  useEffect(() => { saveStorage('chaos_mode', isChaosMode); }, [isChaosMode]);

  const { gpa, totalEcts } = useMemo(() => calculateEctsWeightedGpa(courses), [courses]);

  const workload = useMemo(
    () => computeWorkload(courses, tasks, scheduleEvents, assessments, todayDateStr),
    [courses, tasks, scheduleEvents, assessments, todayDateStr]
  );

  const semesterHealth = useMemo(
    () => computeSemesterHealth(courses, tasks, habits, focusSessions, workload),
    [courses, tasks, habits, focusSessions, workload]
  );

  const insights = useMemo(
    () => generateInsights(courses, tasks, assessments, workload, todayDateStr),
    [courses, tasks, assessments, workload, todayDateStr]
  );

  const nextAction = useMemo(
    () => computeNextRecommendedAction(courses, tasks, scheduleEvents, assessments, todayDateStr, currentTimeStr),
    [courses, tasks, scheduleEvents, assessments, todayDateStr, currentTimeStr]
  );

  const updateProfile = (updates: Partial<StudentProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = { ...courseData, id: `course-${Date.now()}` };
    setCourses(prev => [...prev, newCourse]);
  };
  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };
  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };
  const recordAttendance = (courseId: string, attended: boolean) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id !== courseId) return c;
        const record = c.attendance || { attended: 0, total: 0, minRequiredPercent: 80 };
        return {
          ...c,
          attendance: {
            ...record,
            attended: attended ? record.attended + 1 : record.attended,
            total: record.total + 1,
          },
        };
      })
    );
  };

  const addScheduleEvent = (evtData: Omit<ScheduleEvent, 'id'>) => {
    const newEvt: ScheduleEvent = { ...evtData, id: `evt-${Date.now()}` };
    setScheduleEvents(prev => [...prev, newEvt]);
  };
  const updateScheduleEvent = (id: string, updates: Partial<ScheduleEvent>) => {
    setScheduleEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };
  const deleteScheduleEvent = (id: string) => {
    setScheduleEvents(prev => prev.filter(e => e.id !== id));
  };

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: `task-${Date.now()}` };
    setTasks(prev => [newTask, ...prev]);
  };
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };
  const toggleTaskCompleted = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
        return {
          ...t,
          status: nextStatus,
          subtasks: (t.subtasks || []).map(s => ({ ...s, completed: nextStatus === 'completed' })),
        };
      })
    );
  };
  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addProject = (projData: Omit<Project, 'id'>) => {
    const newProj: Project = { ...projData, id: `proj-${Date.now()}` };
    setProjects(prev => [...prev, newProj]);
  };
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };
  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        const milestones = (p.milestones || []).map(m =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = milestones.filter(m => m.completed).length;
        const progress = Math.round((completedCount / (milestones.length || 1)) * 100);
        return { ...p, milestones, progress };
      })
    );
  };

  const addAssessment = (assessmentData: Omit<Assessment, 'id'>) => {
    const newAssessment: Assessment = { ...assessmentData, id: `exam-${Date.now()}` };
    setAssessments(prev => [...prev, newAssessment]);
  };
  const updateAssessment = (id: string, updates: Partial<Assessment>) => {
    setAssessments(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };
  const deleteAssessment = (id: string) => {
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  const addNote = (noteData: Omit<Note, 'id' | 'updatedAt'>): Note => {
    const newNote: Note = {
      ...noteData,
      id: `note-${Date.now()}`,
      updatedAt: todayDateStr,
    };
    setNotes(prev => [newNote, ...prev]);
    return newNote;
  };
  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updates, updatedAt: todayDateStr } : n))
    );
  };
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };
  const toggleNotePin = (id: string) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)));
  };
  const toggleNoteFavorite = (id: string) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n)));
  };

  const addFlashcard = (cardData: Omit<Flashcard, 'id' | 'repetitions' | 'intervalDays'>): Flashcard => {
    const newCard: Flashcard = {
      ...cardData,
      id: `card-${Date.now()}`,
      repetitions: 0,
      intervalDays: 1,
    };
    setFlashcards(prev => [...prev, newCard]);
    return newCard;
  };
  const updateFlashcardReview = (id: string, rating: 'easy' | 'good' | 'hard') => {
    setFlashcards(prev =>
      prev.map(c => {
        if (c.id !== id) return c;
        const multiplier = rating === 'easy' ? 2.2 : rating === 'good' ? 1.5 : 1.0;
        const nextInterval = Math.max(1, Math.round(c.intervalDays * multiplier));
        return {
          ...c,
          repetitions: c.repetitions + 1,
          intervalDays: nextInterval,
          lastReviewed: todayDateStr,
        };
      })
    );
  };
  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(c => c.id !== id));
  };

  const addResource = (resData: Omit<Resource, 'id'>) => {
    const newRes: Resource = { ...resData, id: `res-${Date.now()}` };
    setResources(prev => [newRes, ...prev]);
  };
  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const logFocusSession = (sessionData: Omit<FocusSession, 'id' | 'timestamp'>) => {
    const newSession: FocusSession = {
      ...sessionData,
      id: `foc-${Date.now()}`,
      timestamp: Date.now(),
    };
    setFocusSessions(prev => [newSession, ...prev]);
  };
  const setActiveFocusContext = (courseId: string | null, taskId: string | null) => {
    setActiveFocusCourseId(courseId);
    setActiveFocusTaskId(taskId);
  };

  const addGoal = (goalData: Omit<Goal, 'id'>) => {
    const newGoal: Goal = { ...goalData, id: `goal-${Date.now()}` };
    setGoals(prev => [...prev, newGoal]);
  };
  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };
  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'completedDates'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit-${Date.now()}`,
      streak: 0,
      completedDates: [],
    };
    setHabits(prev => [...prev, newHabit]);
  };
  const toggleHabitToday = (id: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== id) return h;
        const isDone = h.completedDates.includes(todayDateStr);
        const completedDates = isDone
          ? h.completedDates.filter(d => d !== todayDateStr)
          : [...h.completedDates, todayDateStr];
        const streak = isDone ? Math.max(0, h.streak - 1) : h.streak + 1;
        return { ...h, completedDates, streak };
      })
    );
  };
  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const addSticky = (text: string, color: BrainDumpSticky['color'] = 'yellow', tag?: string) => {
    playTapeSnap();
    const newSticky: BrainDumpSticky = {
      id: `sticky-${Date.now()}`,
      text,
      color,
      rotation: Number((Math.random() * 5 - 2.5).toFixed(1)),
      createdAt: 'Just now',
      tag,
      isPinned: true,
    };
    setStickies(prev => [newSticky, ...prev]);
  };

  const deleteSticky = (id: string) => {
    playTapeSnap();
    setStickies(prev => prev.filter(s => s.id !== id));
  };

  const toggleStickyPin = (id: string) => {
    playCyberClick();
    setStickies(prev => prev.map(s => (s.id === id ? { ...s, isPinned: !s.isPinned } : s)));
  };

  const addCaffeineCup = () => {
    playCoffeeSurge();
    setCaffeineCups(prev => prev + 1);
  };

  const toggleChaosMode = () => {
    setIsChaosMode(prev => {
      const next = !prev;
      playOverclockSound(next);
      return next;
    });
  };

  const toggleAudioMute = () => {
    setIsAudioMuted(prev => {
      const next = !prev;
      setSoundMuted(next);
      return next;
    });
  };

  const toggleAmbientDroneSound = () => {
    const active = toggleAmbientDrone();
    setIsAmbientDroneActive(active);
  };

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Good day, ${profile.name.split(' ')[0]}. I am your UNI·MATE Academic Copilot.`,
      timestamp: '13:18',
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages(prev => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          context: {
            student: profile,
            courses: courses.map(c => ({ name: c.name, code: c.code, grade: c.currentGrade, ects: c.ects })),
            tasks: tasks.filter(t => t.status !== 'completed').map(t => ({ title: t.title, due: t.dueDate, priority: t.priority })),
            exams: assessments.filter(a => a.status === 'upcoming').map(a => ({ name: a.name, date: a.date, weight: a.weight })),
            gpa,
            ects: `${profile.earnedCredits} / ${profile.totalCreditsRequired}`,
            workload: { todayMinutes: workload.todayMinutes, thisWeekHours: workload.thisWeekHours, nextWeekHours: workload.nextWeekHours },
            healthScore: semesterHealth.overall,
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "Context received.";

      setChatMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const exportDataAsJson = () => {
    const data = { profile, courses, scheduleEvents, tasks, projects, assessments, notes, flashcards, resources, focusSessions, goals, habits };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UNIMATE_Backup_${todayDateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportDataAsCsv = () => {
    let csv = 'Type,ID,Title/Name,Course,Status/Grade,Date/Due\n';
    courses.forEach(c => { csv += `Course,${c.id},"${c.name}",${c.code},${c.currentGrade},${c.semester}\n`; });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UNIMATE_Academic_Data_${todayDateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataFromJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.courses)) setCourses(data.courses);
      return true;
    } catch (e) {
      return false;
    }
  };

  const resetToDefaultData = () => {
    setProfile(initialProfile);
    setCourses(initialCourses);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCourseId,
        setSelectedCourseId,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isStudyModeActive,
        setIsStudyModeActive,
        profile,
        updateProfile,
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        recordAttendance,
        scheduleEvents,
        addScheduleEvent,
        updateScheduleEvent,
        deleteScheduleEvent,
        tasks,
        addTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
        projects,
        addProject,
        updateProject,
        toggleProjectMilestone,
        assessments,
        addAssessment,
        updateAssessment,
        deleteAssessment,
        notes,
        addNote,
        updateNote,
        deleteNote,
        toggleNotePin,
        toggleNoteFavorite,
        flashcards,
        addFlashcard,
        updateFlashcardReview,
        deleteFlashcard,
        resources,
        addResource,
        deleteResource,
        focusSessions,
        logFocusSession,
        activeFocusCourseId,
        activeFocusTaskId,
        setActiveFocusContext,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        habits,
        addHabit,
        toggleHabitToday,
        deleteHabit,
        stickies,
        addSticky,
        deleteSticky,
        toggleStickyPin,
        caffeineCups,
        addCaffeineCup,
        isChaosMode,
        setIsChaosMode,
        toggleChaosMode,
        isAudioMuted,
        toggleAudioMute,
        isAmbientDroneActive,
        toggleAmbientDroneSound,
        chatMessages,
        sendChatMessage,
        isAiLoading,
        todayDateStr,
        currentTimeStr,
        workload,
        semesterHealth,
        insights,
        nextAction,
        gpa,
        totalEcts,
        syncStatus,
        exportDataAsJson,
        exportDataAsCsv,
        importDataFromJson,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};