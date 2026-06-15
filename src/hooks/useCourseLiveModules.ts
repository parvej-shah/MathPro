import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../api.config';
import { isLoggedIn } from '../helpers';
import { LiveModule } from './useMyLiveModules';

interface LiveModulesResponse {
    success: boolean;
    data?: LiveModule[];
    error?: string;
}

export const useCourseLiveModules = (courseId: string | string[] | undefined) => {
    const fetchLiveModules = async (): Promise<LiveModule[]> => {
        if (!courseId || Array.isArray(courseId)) {
            throw new Error('Invalid course ID');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${BACKEND_URL}/user/module/live/${courseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch live classes: ${response.status}`);
        }

        const result: LiveModulesResponse = await response.json();

        if (result.success && result.data) {
            return result.data;
        } else {
            throw new Error(result.error || 'API returned unsuccessful response');
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['courseLiveModules', courseId],
        queryFn: fetchLiveModules,
        enabled: typeof window !== 'undefined' && isLoggedIn() && !!courseId && !Array.isArray(courseId),
        staleTime: 60 * 1000,
        refetchInterval: 60 * 1000,
        retry: 1,
        retryDelay: 1000,
    });

    return {
        liveModules: data || [],
        loading: isLoading,
        error: error instanceof Error ? error.message : (error ? String(error) : null),
    };
};
