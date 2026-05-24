import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../api.config';

// New optimized dashboard API response structure
interface CourseDashboardData {
  id: number;
  title: string;
  short_description: string;
  thumbnails: {
    course_thumbnail_link_16_9?: string;
    course_thumbnail_link?: string;
    trailer_video_thumb_16_9?: string;
  };
  progress: {
    maxModuleSerialProgress: number;
    totalModules: number;
    totalChapters: number;
    completedModules: number;
    progressPercentage: number;
  };
  instructor?: {
    name: string;
    credibility?: string;
  };
  community?: {
    facebook_community?: string;
    facebook_private_group?: string;
    whatsapp?: string;
    phone?: string;
    email?: string;
  };
  enrollment: {
    enrollment_date: number;
    is_enrolled: boolean;
  };
  metadata: {
    is_live: boolean;
    language?: string;
    url: string;
  };
  // Optional backward compatibility fields
  chapters?: Array<{
    id: number;
    title: string;
    modules?: Array<{
      id: number;
      title: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  }>;
  maxModuleSerialProgress?: number;
}

interface CourseProgress {
  courseId: number;
  currentModule: number;
  totalModules: number;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastLesson?: string;
}

export const useCourseDashboard = (courseId: string | string[] | undefined) => {
  const fetchCourseData = async (): Promise<CourseDashboardData> => {
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

    const response = await fetch(`${BACKEND_URL}/user/course/dashboard/${courseId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (response.status === 404) {
        throw new Error('Course not found.');
      } else {
        throw new Error(`Failed to fetch course data: ${response.status}`);
      }
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch course data');
    }

    return result.data;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['courseDashboard', courseId],
    queryFn: fetchCourseData,
    enabled: typeof window !== 'undefined' && !!courseId && !Array.isArray(courseId),
    staleTime: 2 * 60 * 1000, // 2 minutes - fresh data with optimized API
    retry: 1,
    retryDelay: 1000,
  });

  const progress: CourseProgress | null = data ? {
    courseId: data.id,
    currentModule: Math.min(data.progress.completedModules + 1, data.progress.totalModules),
    totalModules: data.progress.totalModules,
    progress: data.progress.progressPercentage,
    completedLessons: data.progress.completedModules,
    totalLessons: data.progress.totalModules,
    lastLesson: 'Continue Learning',
  } : null;

  return {
    courseData: data || null,
    progress,
    loading: isLoading,
    error: error instanceof Error ? error.message : (error ? String(error) : null),
    refetch,
  };
};

export type { CourseDashboardData, CourseProgress };
