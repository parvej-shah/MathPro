import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BACKEND_URL } from '../api.config';

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate?: string;
    isNewRecord?: boolean;
}

interface UpdateStreakResponse {
    success: boolean;
    data: StreakData;
}

interface CourseStreakResponse {
    success: boolean;
    data: StreakData;
}

/**
 * Hook to fetch course streak data
 */
export const useCourseStreak = (courseId: string | string[] | undefined) => {
    const fetchCourseStreak = async (): Promise<StreakData> => {
        if (!courseId || Array.isArray(courseId)) {
            throw new Error('Invalid course ID');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }

        const response = await fetch(`${BACKEND_URL}/user/streak/course/${courseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed');
            }
            throw new Error(`Failed to fetch streak data: ${response.status}`);
        }

        const result: CourseStreakResponse = await response.json();

        if (!result.success) {
            throw new Error('Failed to fetch streak data');
        }

        return result.data;
    };

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['courseStreak', courseId],
        queryFn: fetchCourseStreak,
        enabled: typeof window !== 'undefined' && !!courseId && !Array.isArray(courseId),
        staleTime: 2 * 60 * 1000, // 2 minutes - fresh streak data
        retry: 1,
        retryDelay: 1000,
    });

    return {
        streakData: data || null,
        loading: isLoading,
        error: error instanceof Error ? error.message : (error ? String(error) : null),
        refetch,
    };
};

/**
 * Hook to update streak when a lesson is completed
 */
export const useUpdateStreak = () => {
    const queryClient = useQueryClient();

    const updateStreak = async (courseId: string): Promise<StreakData> => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required');
        }

        // Get user's timezone
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const response = await fetch(`${BACKEND_URL}/user/streak/complete-lesson`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ courseId, timezone }),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Authentication failed');
            }
            throw new Error(`Failed to update streak: ${response.status}`);
        }

        const result: UpdateStreakResponse = await response.json();

        if (!result.success) {
            throw new Error('Failed to update streak');
        }

        return result.data;
    };

    const mutation = useMutation({
        mutationFn: updateStreak,
        onSuccess: (data, courseId) => {
            // Invalidate and refetch course streak
            queryClient.invalidateQueries({ queryKey: ['courseStreak', courseId] });

            // Optionally invalidate dashboard streaks if you have that query
            queryClient.invalidateQueries({ queryKey: ['dashboardStreaks'] });
        },
    });

    return {
        updateStreak: mutation.mutate,
        updateStreakAsync: mutation.mutateAsync,
        isUpdating: mutation.isPending,
        error: mutation.error instanceof Error ? mutation.error.message : (mutation.error ? String(mutation.error) : null),
        data: mutation.data || null,
    };
};

export type { StreakData, UpdateStreakResponse, CourseStreakResponse };
