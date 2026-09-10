export type AppView =
  | 'dashboard'
  | 'courses'
  | 'schedule'
  | 'tasks'
  | 'exams'
  | 'grades'
  | 'notes'
  | 'resources'
  | 'focus'
  | 'goals'
  | 'habits'
  | 'workload'
  | 'insights'
  | 'ai'
  | 'profile'
  | 'settings'
  | 'plans';

export interface StudentProfile {
  name: string;
  avatar: string;
  university: string;
  degree: string;
  year: string;
  semester: string;
  academicGoals: string;
  targetGpa: number;
  totalCreditsRequired: number;
  earnedCredits: number;
  preferredStudyTime: string;
  typicalFocusDuration: number;
}

export interface AttendanceRecord {
  attended: number;
  total: number;
  minRequiredPercent: number;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  room: string;
  ects: number;
  semester: string;
  academicYear: string;
  targetGrade: number;
  currentGrade: number;
  color: string;
  status: 'active' | 'completed' | 'archived';
  attendance: AttendanceRecord;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  courseId?: string;
  type: 'class' | 'exam' | 'study' | 'assignment' | 'event';
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location?: string;
  notes?: string;
  completed?: boolean;
}

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  courseId?: string;
  projectId?: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  estimatedMinutes: number;
  actualMinutes: number;
  tags: string[];
  subtasks: SubTask[];
  notes?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  deadline: string;
  progress: number; // 0 - 100
  estimatedHours: number;
  actualHours: number;
  milestones: ProjectMilestone[];
}

export interface ExamTopic {
  name: string;
  readiness: number; // 0 - 100
}

export interface Assessment {
  id: string;
  name: string;
  courseId: string;
  type: 'midterm' | 'final' | 'quiz' | 'assignment' | 'presentation' | 'project';
  date: string; // YYYY-MM-DD
  time?: string;
  weight: number; // Percentage, e.g. 40
  grade?: number; // 0.00 - 10.00
  expectedGrade?: number;
  status: 'upcoming' | 'graded';
  topics: ExamTopic[];
  notes?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  folder?: string;
  tags: string[];
  isPinned: boolean;
  isFavorite: boolean;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  courseId: string;
  noteId?: string;
  front: string;
  back: string;
  repetitions: number;
  intervalDays: number;
  lastReviewed?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'slides' | 'document' | 'video';
  url: string;
  courseId?: string;
  tag?: string;
  isFavorite: boolean;
  size?: string;
}

export interface FocusSession {
  id: string;
  courseId?: string;
  taskId?: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
  completed: boolean;
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  currentProgress: number;
  targetProgress: number;
  unit: string;
  deadline: string;
  category: 'academic' | 'study' | 'personal' | 'university';
  status: 'active' | 'achieved';
}

export interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  targetDaysPerWeek: number;
  completedDates: string[]; // ['YYYY-MM-DD']
  frequency: 'daily' | 'weekly';
}

export interface CourseWorkload {
  courseId: string;
  courseName: string;
  color: string;
  hours: number;
}

export interface DailyWorkload {
  day: string;
  date: string;
  hours: number;
}

export interface WeeklyWorkloadSummary {
  totalHours: number;
  strainLevel: 'balanced' | 'moderate' | 'heavy' | 'critical';
  dailyHours?: DailyWorkload[];
  isSurge?: boolean;
  recommendation?: string;
}

export interface WorkloadMetrics {
  todayMinutes: number;
  thisWeekHours: number;
  nextWeekHours: number;
  normalWeeklyHours: number;
  courseBreakdown: CourseWorkload[];
  thisWeek: WeeklyWorkloadSummary;
  nextWeek: WeeklyWorkloadSummary;
  predictiveWarning?: {
    message: string;
    percentAboveNormal: number;
    reasons: string[];
    recommendation: string;
  };
}

export interface SemesterHealthScore {
  overall: number; // 0 - 10
  academic: number;
  workload: number;
  consistency: number;
  attendance: number;
  focus: number;
  explanation: string;
}

export interface AcademicInsight {
  id: string;
  type: 'warning' | 'info' | 'success' | 'action';
  title: string;
  description: string;
  metric?: string;
  actionLabel?: string;
  actionView?: AppView;
  courseId?: string;
}

export interface RecommendedAction {
  title: string;
  subtitle: string;
  courseName?: string;
  estimatedMinutes: number;
  dueInfo: string;
  actionType: 'focus' | 'task' | 'exam';
  targetId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionProposal?: {
    type: 'create_task' | 'schedule_focus' | 'open_view';
    title: string;
    payload?: any;
  };
}

export interface BrainDumpSticky {
  id: string;
  text: string;
  color: 'yellow' | 'pink' | 'cyan' | 'green' | 'purple';
  rotation: number;
  createdAt: string;
  tag?: string;
  isPinned?: boolean;
}

