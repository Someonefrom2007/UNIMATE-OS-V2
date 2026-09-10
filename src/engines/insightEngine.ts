import {
  Course,
  Task,
  ScheduleEvent,
  Assessment,
  Habit,
  FocusSession,
  SemesterHealthScore,
  AcademicInsight,
  RecommendedAction,
  WorkloadMetrics,
} from '../types';

export function computeSemesterHealth(
  courses: Course[],
  tasks: Task[],
  habits: Habit[],
  focusSessions: FocusSession[],
  workload: WorkloadMetrics
): SemesterHealthScore {
  // 1. Academic Score (from course grades, normalized to 0-10)
  const gradedCourses = courses.filter(c => c.currentGrade > 0);
  const avgGrade =
    gradedCourses.length > 0
      ? gradedCourses.reduce((sum, c) => sum + c.currentGrade, 0) / gradedCourses.length
      : 7.5;
  const academic = Number(avgGrade.toFixed(1));

  // 2. Workload Score (10 if balanced, drops if extreme overload)
  let workloadScore = 8.5;
  if (workload.thisWeekHours > workload.normalWeeklyHours * 1.4) {
    workloadScore = 6.2;
  } else if (workload.thisWeekHours > workload.normalWeeklyHours * 1.2) {
    workloadScore = 7.4;
  } else if (workload.thisWeekHours >= workload.normalWeeklyHours * 0.8) {
    workloadScore = 9.2;
  }
  const workloadRating = Number(workloadScore.toFixed(1));

  // 3. Consistency (Habits streak + tasks completed ratio)
  const totalHabits = habits.length || 1;
  const avgStreak = habits.reduce((sum, h) => sum + h.streak, 0) / totalHabits;
  const totalTasks = tasks.length || 1;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = completedTasks / totalTasks;
  const consistency = Number(Math.min(10, Math.max(5.0, (avgStreak * 0.4) + (completionRate * 6))).toFixed(1));

  // 4. Attendance Score
  let totalAttended = 0;
  let totalClasses = 0;
  courses.forEach(c => {
    if (c.attendance) {
      totalAttended += c.attendance.attended;
      totalClasses += c.attendance.total;
    }
  });
  const attendanceRatio = totalClasses > 0 ? (totalAttended / totalClasses) * 10 : 9.0;
  const attendance = Number(attendanceRatio.toFixed(1));

  // 5. Focus Score (weekly focus hours vs 10h ideal target)
  const totalFocusMins = focusSessions.reduce((sum, f) => sum + f.durationMinutes, 0);
  const weeklyFocusHours = totalFocusMins / 60;
  const focus = Number(Math.min(10, Math.max(4.0, (weeklyFocusHours / 10) * 10)).toFixed(1));

  // Overall Weighted Score
  const overall = Number(
    (academic * 0.35 + workloadRating * 0.2 + consistency * 0.15 + attendance * 0.15 + focus * 0.15).toFixed(1)
  );

  let explanation = '';
  if (overall >= 8.5) {
    explanation = "You are performing strongly across academics, maintaining high lecture attendance and steady study consistency.";
  } else if (overall >= 7.5) {
    explanation = "Strong academic trajectory. Keep an eye on upcoming next-week workload peaks to avoid study bottlenecks.";
  } else {
    explanation = "Attention required on urgent assignment deadlines and lecture attendance thresholds.";
  }

  return {
    overall,
    academic,
    workload: workloadRating,
    consistency,
    attendance,
    focus,
    explanation,
  };
}

export function generateInsights(
  courses: Course[],
  tasks: Task[],
  assessments: Assessment[],
  workload: WorkloadMetrics,
  todayStr: string
): AcademicInsight[] {
  const insights: AcademicInsight[] = [];
  const today = new Date(todayStr);

  // 1. Deadlines in next 5 days
  const fiveDaysOut = new Date(today);
  fiveDaysOut.setDate(today.getDate() + 5);

  const upcomingDeadlines = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const d = new Date(t.dueDate);
    return d >= today && d <= fiveDaysOut;
  });

  if (upcomingDeadlines.length > 0) {
    insights.push({
      id: 'insight-deadlines-5d',
      type: 'warning',
      title: 'Upcoming Assessment Cluster',
      description: `You have ${upcomingDeadlines.length} task${upcomingDeadlines.length > 1 ? 's' : ''} and submissions due within the next 5 days.`,
      metric: `${upcomingDeadlines.length} due`,
      actionLabel: 'Review Tasks',
      actionView: 'tasks',
    });
  }

  // 2. Highest workload course
  if (workload.courseBreakdown.length > 0) {
    const sorted = [...workload.courseBreakdown].sort((a, b) => b.hours - a.hours);
    const topCourse = sorted[0];
    if (topCourse && topCourse.hours > 0) {
      const totalHours = workload.thisWeekHours || 1;
      const pct = Math.round((topCourse.hours / totalHours) * 100);
      insights.push({
        id: 'insight-top-workload',
        type: 'info',
        title: 'Workload Concentration',
        description: `${topCourse.courseName} represents ${pct}% of your scheduled workload this week (${topCourse.hours}h).`,
        metric: `${pct}% of week`,
        actionLabel: 'Course Overview',
        actionView: 'courses',
        courseId: topCourse.courseId,
      });
    }
  }

  // 3. Attendance Warning if close to limit
  courses.forEach(c => {
    if (c.attendance && c.attendance.total > 0) {
      const absences = c.attendance.total - c.attendance.attended;
      const currentPct = Math.round((c.attendance.attended / c.attendance.total) * 100);
      const minPct = c.attendance.minRequiredPercent || 80;
      if (currentPct <= minPct + 6) {
        insights.push({
          id: `insight-attendance-${c.id}`,
          type: 'warning',
          title: `Attendance Threshold Warning`,
          description: `${c.name}: Currently at ${currentPct}% attendance. 1-2 more missed lectures will breach the ${minPct}% requirement.`,
          metric: `${currentPct}%`,
          actionLabel: 'View Course',
          actionView: 'courses',
          courseId: c.id,
        });
      }
    }
  });

  // 4. Strongest course vs course needing most attention
  const activeCourses = courses.filter(c => c.status === 'active');
  if (activeCourses.length > 1) {
    const sortedByGrade = [...activeCourses].sort((a, b) => b.currentGrade - a.currentGrade);
    const strongest = sortedByGrade[0];
    const lowest = sortedByGrade[sortedByGrade.length - 1];

    if (strongest && strongest.currentGrade >= 8.5) {
      insights.push({
        id: 'insight-strongest-course',
        type: 'success',
        title: 'Academic Peak',
        description: `${strongest.name} is your highest-performing course with a ${strongest.currentGrade.toFixed(1)} / 10 average.`,
        metric: `${strongest.currentGrade.toFixed(1)} GPA`,
        actionLabel: 'Open Grades',
        actionView: 'grades',
      });
    }

    if (lowest && lowest.currentGrade < 6.8) {
      insights.push({
        id: 'insight-attention-course',
        type: 'action',
        title: 'Target Focus Recommended',
        description: `${lowest.name} is currently at ${lowest.currentGrade.toFixed(1)} / 10 (target: ${lowest.targetGrade.toFixed(1)}). Allocating a 45m focus session will boost midterm readiness.`,
        metric: `${lowest.currentGrade.toFixed(1)} / ${lowest.targetGrade.toFixed(1)}`,
        actionLabel: 'Study Course',
        actionView: 'focus',
        courseId: lowest.id,
      });
    }
  }

  return insights;
}

export function computeNextRecommendedAction(
  courses: Course[],
  tasks: Task[],
  scheduleEvents: ScheduleEvent[],
  assessments: Assessment[],
  todayStr: string,
  currentTimeStr: string // "14:15"
): RecommendedAction {
  // Check next class today
  const todayEvents = scheduleEvents.filter(e => e.date === todayStr && e.type === 'class');
  const [currH, currM] = currentTimeStr.split(':').map(Number);
  const currentMinuteOfDay = currH * 60 + currM;

  let nextClass = null;
  let gapMinutes = 60;

  for (const evt of todayEvents) {
    const [startH, startM] = evt.startTime.split(':').map(Number);
    const evtMinute = startH * 60 + startM;
    if (evtMinute > currentMinuteOfDay) {
      nextClass = evt;
      gapMinutes = evtMinute - currentMinuteOfDay;
      break;
    }
  }

  // Find most urgent uncompleted task
  const urgentTask = tasks.find(
    t => t.status !== 'completed' && (t.priority === 'urgent' || t.dueDate === todayStr)
  );

  if (urgentTask) {
    const course = courses.find(c => c.id === urgentTask.courseId);
    return {
      title: `Finish "${urgentTask.title}"`,
      subtitle: `Due ${urgentTask.dueDate === todayStr ? 'today' : urgentTask.dueDate}. Estimated ${urgentTask.estimatedMinutes} minutes.`,
      courseName: course?.name,
      estimatedMinutes: Math.min(gapMinutes, urgentTask.estimatedMinutes || 45),
      dueInfo: urgentTask.dueDate === todayStr ? 'Due today' : 'High priority',
      actionType: 'task',
      targetId: urgentTask.id,
    };
  }

  // Next, check upcoming exam preparation
  const nextExam = assessments.find(a => a.status === 'upcoming');
  if (nextExam) {
    const course = courses.find(c => c.id === nextExam.courseId);
    const lowestTopic = [...nextExam.topics].sort((a, b) => a.readiness - b.readiness)[0];
    return {
      title: `Review ${lowestTopic ? lowestTopic.name : nextExam.name}`,
      subtitle: `${course?.name || 'Course'} exam on ${nextExam.date} (${nextExam.weight}% weight). Current readiness ${lowestTopic ? lowestTopic.readiness : 70}%.`,
      courseName: course?.name,
      estimatedMinutes: Math.min(gapMinutes, 45),
      dueInfo: `Exam on ${nextExam.date}`,
      actionType: 'focus',
      targetId: nextExam.id,
    };
  }

  return {
    title: 'Review lecture notes & flashcards',
    subtitle: 'Consolidate key concepts before tomorrow’s morning lectures.',
    estimatedMinutes: 30,
    dueInfo: 'Recommended review',
    actionType: 'focus',
  };
}
