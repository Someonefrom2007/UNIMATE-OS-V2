import { Course, Assessment } from '../types';

export interface GradeClassification {
  label: string;
  spanishLabel: string;
  color: string;
  badgeClass: string;
}

export function getGradeClassification(grade: number): GradeClassification {
  if (grade >= 10.0) {
    return {
      label: 'Honors',
      spanishLabel: 'Matrícula de Honor',
      color: '#f59e0b',
      badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    };
  }
  if (grade >= 9.0) {
    return {
      label: 'Outstanding',
      spanishLabel: 'Sobresaliente',
      color: '#10b981',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    };
  }
  if (grade >= 7.0) {
    return {
      label: 'Notable',
      spanishLabel: 'Notable',
      color: '#06b6d4',
      badgeClass: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
    };
  }
  if (grade >= 5.0) {
    return {
      label: 'Pass',
      spanishLabel: 'Aprobado',
      color: '#3b82f6',
      badgeClass: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    };
  }
  return {
    label: 'Fail',
    spanishLabel: 'Suspenso',
    color: '#ef4444',
    badgeClass: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };
}

/**
 * Calculates course grade based on graded assessments and weights
 */
export function calculateCourseGrade(assessments: Assessment[]): {
  currentGrade: number;
  completedWeight: number;
  remainingWeight: number;
} {
  const graded = assessments.filter(a => a.status === 'graded' && typeof a.grade === 'number');
  if (graded.length === 0) {
    return { currentGrade: 0, completedWeight: 0, remainingWeight: 100 };
  }

  const completedWeight = graded.reduce((sum, a) => sum + a.weight, 0);
  if (completedWeight === 0) {
    return { currentGrade: 0, completedWeight: 0, remainingWeight: 100 };
  }

  const weightedSum = graded.reduce((sum, a) => sum + (a.grade! * a.weight), 0);
  const currentGrade = Number((weightedSum / completedWeight).toFixed(2));
  const remainingWeight = Math.max(0, 100 - completedWeight);

  return { currentGrade, completedWeight, remainingWeight };
}

/**
 * Calculates ECTS-weighted overall GPA: SUM(grade * credits) / SUM(credits)
 */
export function calculateEctsWeightedGpa(courses: Course[]): {
  gpa: number;
  totalEcts: number;
  gradedEcts: number;
} {
  const activeCourses = courses.filter(c => c.status !== 'archived');
  let weightedSum = 0;
  let gradedCredits = 0;
  let totalCredits = 0;

  for (const course of activeCourses) {
    totalCredits += course.ects;
    if (course.currentGrade > 0) {
      weightedSum += course.currentGrade * course.ects;
      gradedCredits += course.ects;
    }
  }

  const gpa = gradedCredits > 0 ? Number((weightedSum / gradedCredits).toFixed(2)) : 0;
  return { gpa, totalEcts: totalCredits, gradedEcts: gradedCredits };
}

/**
 * Grade Simulator: "What grade do I need?"
 * Calculates required grade on remaining weight to reach target final grade.
 */
export function simulateRequiredGrade(
  currentWeightedAccrued: number, // Sum of (grade * weight / 100) already locked in
  remainingWeightPercent: number, // 0 - 100
  targetFinalGrade: number // e.g. 5.0, 7.0, 8.0, 9.0, 10.0
): {
  requiredGrade: number | null;
  achievable: boolean;
  explanation: string;
} {
  if (remainingWeightPercent <= 0) {
    const achievable = currentWeightedAccrued >= targetFinalGrade;
    return {
      requiredGrade: null,
      achievable,
      explanation: achievable
        ? 'All assessments are completed. You have achieved or surpassed this target.'
        : 'All assessments are completed. This target can no longer be modified.',
    };
  }

  const remainingWeightFactor = remainingWeightPercent / 100;
  const neededFromRemaining = targetFinalGrade - currentWeightedAccrued;
  const requiredGrade = Number((neededFromRemaining / remainingWeightFactor).toFixed(2));

  if (requiredGrade > 10.0) {
    return {
      requiredGrade,
      achievable: false,
      explanation: `Mathematically unattainable (requires ${requiredGrade.toFixed(2)} / 10.0 on the remaining ${remainingWeightPercent}%).`,
    };
  }

  if (requiredGrade <= 0) {
    return {
      requiredGrade: 0,
      achievable: true,
      explanation: `Target secured! Even with a 0.0 on remaining assessments, your final grade will meet or exceed ${targetFinalGrade.toFixed(1)}.`,
    };
  }

  return {
    requiredGrade,
    achievable: true,
    explanation: `You need approximately ${requiredGrade.toFixed(2)} on the remaining ${remainingWeightPercent}% assessment weight to achieve a final ${targetFinalGrade.toFixed(1)}.`,
  };
}
