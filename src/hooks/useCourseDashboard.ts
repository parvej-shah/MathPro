import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../api.config';

// New optimized dashboard API response structure
interface CourseDashboardData {
  id: number;
  title: string;
  short_description: string;
  // New shape (frontend-guide-user.md §5).
  thumbnails: {
    course_thumbnail_16_9?: string;
    trailer_video_thumb_16_9?: string;
    facebook_community_thumb_16_9?: string;
  };
  media?: {
    intro_video?: string; // NEW grouping — dashboard video player
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
    facebook_page?: string;
    facebook_private_group?: string;
    telegram_group?: string; // NEW — enrolled-only link
    whatsapp?: string;
    phone?: string;
    email?: string;
  };
  enrollment: {
    enrollment_date: number;
    is_enrolled: boolean;
    total_seats?: number | null; // NEW
    enrolled?: number; // NEW
  };
  enrollment_details?: {
    // NEW — unix seconds, all optional
    prebooking_end_date?: number | null;
    enrollment_end_date?: number | null;
    course_start_date?: number | null;
  };
  metadata: {
    is_live: boolean;
    language?: string;
    url: string;
    slug?: string | null; // NEW
    tags?: string[]; // NEW
    course_outline?: string | null; // NEW
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
      const message = result.error || 'Failed to fetch course data';
      // The backend returns 200 + { success:false } for a bad token, with a
      // distinct message for expired vs. invalid sessions. Flag those so the
      // page can re-login instead of showing a dead-end error card.
      if (/session has expired|session is invalid/i.test(message)) {
        const err = new Error(message) as Error & { authExpired?: boolean };
        err.authExpired = true;
        throw err;
      }
      throw new Error(message);
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
    authExpired: !!(error as (Error & { authExpired?: boolean }) | null)?.authExpired,
    refetch,
  };
};

export type { CourseDashboardData, CourseProgress };
