import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../api.config';
import { isLoggedIn } from '../helpers';

export interface LiveModule {
    id: number;
    title: string;
    data: Record<string, unknown>;
    is_live: boolean;
    live_status: 'SCHEDULED' | 'LIVE';
    live_meeting_id: string | null;
    live_meeting_pass: string | null;
    live_scheduled_at: number | null;
    course_id: number;
    course_title: string;
}

interface LiveModulesResponse {
    success: boolean;
    data?: LiveModule[];
    error?: string;
}

export const useMyLiveModules = () => {
    const fetchLiveModules = async (): Promise<LiveModule[]> => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${BACKEND_URL}/user/module/live`, {
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
        queryKey: ['myLiveModules'],
        queryFn: fetchLiveModules,
        enabled: typeof window !== 'undefined' && isLoggedIn(),
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
