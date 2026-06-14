import { useMemo } from 'react';
import { usePaymentHistory } from './usePaymentHistory';

interface CourseWithRanking {
  id: number;
  title: string;
  participants?: number;
}

export const useCoursesWithRanking = () => {
  const { historyData, loading, error, refetch } = usePaymentHistory();

  const courses = useMemo<CourseWithRanking[]>(() => {
    if (!historyData) return [];

    const allCourses: CourseWithRanking[] = [];

    // Add individual courses
    historyData.individual_courses?.forEach(course => {
      allCourses.push({
        id: course.course_id || course.id,
        title: course.title,
      });
    });

    // Add courses from bundles
    historyData.bundle_purchases?.forEach(bundle => {
      bundle.courses?.forEach(course => {
        // Avoid duplicates
        if (!allCourses.find(c => c.id === course.id)) {
          allCourses.push({
            id: course.id,
            title: course.title,
          });
        }
      });
    });

    return allCourses;
  }, [historyData]);

  return {
    courses,
    loading,
    error,
    refetch,
  };
};

export type { CourseWithRanking };
