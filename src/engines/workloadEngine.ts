import { Course, Task, ScheduleEvent, Assessment, WorkloadMetrics, CourseWorkload } from '../types';

export function computeWorkload(
  courses: Course[],
  tasks: Task[],
  scheduleEvents: ScheduleEvent[],
  assessments: Assessment[],
  todayStr: string // YYYY-MM-DD
): WorkloadMetrics {
  const normalWeeklyHours = 18.0; // Baseline reference workload for university course load

  // Parse today's date
  const today = new Date(todayStr);
  const currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...

  // Compute boundaries for this week (Monday to Sunday) and next week
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const thisWeekMonday = new Date(today);
  thisWeekMonday.setDate(today.getDate() + mondayOffset);
  thisWeekMonday.setHours(0, 0, 0, 0);

  const thisWeekSunday = new Date(thisWeekMonday);
  thisWeekSunday.setDate(thisWeekMonday.getDate() + 6);
  thisWeekSunday.setHours(23, 59, 59, 999);

  const nextWeekMonday = new Date(thisWeekSunday);
  nextWeekMonday.setDate(thisWeekSunday.getDate() + 1);
  nextWeekMonday.setHours(0, 0, 0, 0);

  const nextWeekSunday = new Date(nextWeekMonday);
  nextWeekSunday.setDate(nextWeekMonday.getDate() + 6);
  nextWeekSunday.setHours(23, 59, 59, 999);

  // 1. TODAY'S WORKLOAD (in minutes)
  // Tasks due today or in progress
  const todayTasks = tasks.filter(
    t => t.status !== 'completed' && t.dueDate === todayStr
  );
  const taskMinutesToday = todayTasks.reduce((sum, t) => sum + (t.estimatedMinutes || 45), 0);

  // Schedule classes / sessions today
  const todayEvents = scheduleEvents.filter(e => e.date === todayStr);
  let classMinutesToday = 0;
  for (const evt of todayEvents) {
    const [sh, sm] = evt.startTime.split(':').map(Number);
    const [eh, em] = evt.endTime.split(':').map(Number);
    const duration = (eh * 60 + em) - (sh * 60 + sm);
    classMinutesToday += Math.max(0, duration);
  }
  const todayMinutes = taskMinutesToday + classMinutesToday;

  // 2. THIS WEEK'S WORKLOAD (in hours)
  const courseHoursMap = new Map<string, number>();

  let thisWeekMinutes = 0;
  tasks.forEach(t => {
    if (t.status !== 'completed') {
      const d = new Date(t.dueDate);
      if (d >= thisWeekMonday && d <= thisWeekSunday) {
        const mins = t.estimatedMinutes || 45;
        thisWeekMinutes += mins;
        if (t.courseId) {
          courseHoursMap.set(t.courseId, (courseHoursMap.get(t.courseId) || 0) + mins / 60);
        }
      }
    }
  });

  scheduleEvents.forEach(e => {
    const d = new Date(e.date);
    if (d >= thisWeekMonday && d <= thisWeekSunday) {
      const [sh, sm] = e.startTime.split(':').map(Number);
      const [eh, em] = e.endTime.split(':').map(Number);
      const mins = Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
      thisWeekMinutes += mins;
      if (e.courseId) {
        courseHoursMap.set(e.courseId, (courseHoursMap.get(e.courseId) || 0) + mins / 60);
      }
    }
  });

  // Upcoming assessments this week add revision load
  assessments.forEach(a => {
    if (a.status === 'upcoming') {
      const d = new Date(a.date);
      if (d >= thisWeekMonday && d <= thisWeekSunday) {
        const prepMins = (a.weight || 20) * 8; // e.g. 20% exam adds ~160 mins prep
        thisWeekMinutes += prepMins;
        if (a.courseId) {
          courseHoursMap.set(a.courseId, (courseHoursMap.get(a.courseId) || 0) + prepMins / 60);
        }
      }
    }
  });

  const thisWeekHours = Number((thisWeekMinutes / 60).toFixed(1));

  // 3. NEXT WEEK'S PREDICTIVE WORKLOAD (in hours)
  let nextWeekMinutes = 0;
  const nextWeekReasons: string[] = [];

  tasks.forEach(t => {
    if (t.status !== 'completed') {
      const d = new Date(t.dueDate);
      if (d >= nextWeekMonday && d <= nextWeekSunday) {
        const mins = t.estimatedMinutes || 60;
        nextWeekMinutes += mins;
        if (t.priority === 'urgent' || t.priority === 'high') {
          nextWeekReasons.push(`High-priority task: "${t.title}"`);
        }
      }
    }
  });

  // Estimated regular classes recurring next week (approx 12h)
  nextWeekMinutes += 12 * 60;

  assessments.forEach(a => {
    if (a.status === 'upcoming') {
      const d = new Date(a.date);
      if (d >= nextWeekMonday && d <= nextWeekSunday) {
        const prepMins = (a.weight || 30) * 12; // heavy prep for next week exams
        nextWeekMinutes += prepMins;
        const c = courses.find(course => course.id === a.courseId);
        nextWeekReasons.push(`${c?.name || 'Course'} ${a.type.toUpperCase()}: "${a.name}" (${a.weight}% weight)`);
      }
    }
  });

  const nextWeekHours = Number((nextWeekMinutes / 60).toFixed(1));

  // Predictive Warning
  let predictiveWarning: WorkloadMetrics['predictiveWarning'] = undefined;
  const percentAboveNormal = Math.round(((nextWeekHours - normalWeeklyHours) / normalWeeklyHours) * 100);

  if (percentAboveNormal >= 20) {
    predictiveWarning = {
      message: `${nextWeekHours}h estimated workload (${percentAboveNormal}% above baseline).`,
      percentAboveNormal,
      reasons: nextWeekReasons.slice(0, 3),
      recommendation: 'Start preliminary research and exam outline topics this weekend to flatten the peak.',
    };
  }

  // Course Breakdown
  const courseBreakdown: CourseWorkload[] = courses.map(c => {
    const rawHours = courseHoursMap.get(c.id) || (c.status === 'active' ? 2.5 : 0);
    return {
      courseId: c.id,
      courseName: c.name,
      color: c.color,
      hours: Number(rawHours.toFixed(1)),
    };
  });

  // Calculate 7-day daily breakdown for this week
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dailyHours = dayNames.map((name, index) => {
    const dayDate = new Date(thisWeekMonday);
    dayDate.setDate(thisWeekMonday.getDate() + index);
    const dateStr = dayDate.toISOString().slice(0, 10);

    // Sum class events on this date
    let dayMins = 0;
    scheduleEvents
      .filter(e => e.date === dateStr)
      .forEach(e => {
        if (e.startTime && e.endTime) {
          const [sh, sm] = e.startTime.split(':').map(Number);
          const [eh, em] = e.endTime.split(':').map(Number);
          dayMins += Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
        }
      });

    // Sum tasks due on this date
    tasks
      .filter(t => t.dueDate === dateStr)
      .forEach(t => {
        dayMins += (t.estimatedMinutes || 45);
      });

    // Add baseline study if day has low scheduled load on weekdays
    if (index < 5 && dayMins < 180) {
      dayMins += 120; // 2h baseline reading/lab prep
    } else if (index >= 5 && dayMins < 60) {
      dayMins += 90; // weekend review
    }

    return {
      day: name,
      date: dateStr,
      hours: Number((dayMins / 60).toFixed(1)),
    };
  });

  const computedThisWeekHours = Number(dailyHours.reduce((sum, d) => sum + d.hours, 0).toFixed(1)) || thisWeekHours;

  const getStrain = (hrs: number): 'balanced' | 'moderate' | 'heavy' | 'critical' => {
    if (hrs >= 36) return 'critical';
    if (hrs >= 28) return 'heavy';
    if (hrs >= 20) return 'moderate';
    return 'balanced';
  };

  const isNextWeekSurge = nextWeekHours >= 28 || percentAboveNormal >= 20;

  return {
    todayMinutes,
    thisWeekHours: computedThisWeekHours,
    nextWeekHours,
    normalWeeklyHours,
    courseBreakdown,
    thisWeek: {
      totalHours: computedThisWeekHours,
      strainLevel: getStrain(computedThisWeekHours),
      dailyHours,
    },
    nextWeek: {
      totalHours: nextWeekHours,
      strainLevel: getStrain(nextWeekHours),
      isSurge: isNextWeekSurge,
      recommendation:
        predictiveWarning?.recommendation ||
        'Next week has higher deliverable volume. We recommend distributing 4-6 hours of preliminary prep into earlier study windows.',
    },
    predictiveWarning,
  };
}
