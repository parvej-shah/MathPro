import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../api.config';

interface CourseRoutine {
  routine_image_url: string;
  week_number: number;
  week_start_date: string;
  week_end_date: string;
  course_title: string;
}

export const useCourseRoutine = (courseId: string | string[] | undefined) => {
  const fetchRoutineData = async (): Promise<CourseRoutine | null> => {
    if (!courseId || Array.isArray(courseId)) {
      throw new Error('Invalid course ID');
    }

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BACKEND_URL}/user/course/${courseId}/routine`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (response.status === 404) {
        // Routine not found - this is acceptable, return null
        return null;
      } else {
        throw new Error(`Failed to fetch routine data: ${response.status}`);
      }
    }

    const data = await response.json();

    if (data.success) {
      if (data.data) {
        return data.data;
      } else {
        return null;
      }
    } else {
      throw new Error(data.error || data.message || 'Failed to fetch routine data');
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['courseRoutine', courseId],
    queryFn: fetchRoutineData,
    enabled: typeof window !== 'undefined' && !!courseId && !Array.isArray(courseId),
    staleTime: 5 * 60 * 1000, // 5 minutes - fresh routine data
    retry: 1,
    retryDelay: 1000,
  });

  return {
    routineData: data || null,
    loading: isLoading,
    error: error instanceof Error ? error.message : (error ? String(error) : null),
    refetch,
  };
};

export type { CourseRoutine };
