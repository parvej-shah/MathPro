import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_URL } from '../api.config';

interface Course {
  id: number;
  title: string;
  x_price: number;
  price: number;
  language: string;
  enrolled: number;
  short_description: string;
  chips: {
    course_thumbnail_link?: string; // Old field (backward compatibility)
    thumbnails?: {
      course_thumbnail_link_16_9?: string;
      trailer_video_thumb_16_9?: string;
      facebook_community_thumb_16_9?: string;
    };
  };
  instructor_list?: {
    instructors: Array<{
      name: string;
      credibility?: string;
    }>;
  };
}

interface CoursesResponse {
  success: boolean;
  data: Course[];
}

export const useAllCourses = () => {
  const fetchCourses = async (): Promise<Course[]> => {
    const response = await axios.get<CoursesResponse>(
      `${BACKEND_URL}/user/course/list`
    );

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch courses');
    }
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['allCourses'],
    queryFn: fetchCourses,
    enabled: typeof window !== 'undefined',
    staleTime: 10 * 60 * 1000, // 10 minutes - reasonable freshness for course list
    retry: 1,
    retryDelay: 1000,
  });

  return {
    courses: data || [],
    loading: isLoading,
    error: error instanceof Error ? error.message : (error ? String(error) : null),
  };
};

export type { Course };
