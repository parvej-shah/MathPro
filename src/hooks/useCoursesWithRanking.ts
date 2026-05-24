import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_URL } from '../api.config';
import { getAuthToken, getUserIdFromToken, isLoggedIn } from '../helpers';

interface CourseWithRanking {
  id: number;
  title: string;
  participants?: number;
}

interface PaymentHistoryResponse {
  success: boolean;
  data?: {
    individual_courses: Array<{
      course_id: number;
      title: string;
      id: number;
    }>;
    bundle_purchases: Array<{
      courses: Array<{
        id: number;
        title: string;
      }>;
    }>;
  };
  error?: string;
}

export const useCoursesWithRanking = () => {
  const fetchCoursesWithRanking = async (): Promise<CourseWithRanking[]> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      // Use payment history API to get all courses (individual + bundle courses)
      const response = await fetch(`${BACKEND_URL}/user/payment/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: PaymentHistoryResponse = await response.json();

      if (result.success && result.data) {
        const allCourses: CourseWithRanking[] = [];
        
        // Add individual courses
        if (result.data.individual_courses) {
          result.data.individual_courses.forEach(course => {
            allCourses.push({
              id: course.course_id || course.id,
              title: course.title,
            });
          });
        }
        
        // Add courses from bundles
        if (result.data.bundle_purchases) {
          result.data.bundle_purchases.forEach(bundle => {
            if (bundle.courses) {
              bundle.courses.forEach(course => {
                // Avoid duplicates
                if (!allCourses.find(c => c.id === course.id)) {
                  allCourses.push({
                    id: course.id,
                    title: course.title,
                  });
                }
              });
            }
          });
        }

        return allCourses;
      } else {
        throw new Error(result.error || 'Failed to fetch payment history');
      }
    } catch (error) {
      throw error;
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['coursesWithRanking'],
    queryFn: fetchCoursesWithRanking,
    enabled: typeof window !== 'undefined' && isLoggedIn(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  return {
    courses: data || [],
    loading: isLoading,
    error: error instanceof Error ? error.message : (error ? String(error) : null),
    refetch,
  };
};

export type { CourseWithRanking };
