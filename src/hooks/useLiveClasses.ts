import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../api.config';

interface LiveClassData {
    recordedMeetingLink?: string;
}

interface LiveClass {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    can_join: boolean;
    scheduled_at: number;
    duration: string;
    data: LiveClassData;
    interested: boolean;
}

interface LiveClassesResponse {
    success: boolean;
    data: {
        list: LiveClass[];
        serverTimeStamp: number;
    };
}

interface LiveClassesData {
    liveClasses: LiveClass[];
    serverTime: number;
}

export const useLiveClasses = (courseId: string | string[] | undefined) => {
    const fetchLiveClasses = async (): Promise<LiveClassesData> => {
        if (!courseId || Array.isArray(courseId)) {
            throw new Error('Invalid course ID');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(
            `${BACKEND_URL}/user/live/list/${courseId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch live classes: ${response.status}`);
        }

        const data: LiveClassesResponse = await response.json();

        if (data.success) {
            return {
                liveClasses: data.data.list || [],
                serverTime: data.data.serverTimeStamp || Math.floor(Date.now() / 1000)
            };
        } else {
            throw new Error('API returned unsuccessful response');
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['liveClasses', courseId],
        queryFn: fetchLiveClasses,
        enabled: typeof window !== 'undefined' && !!courseId && !Array.isArray(courseId),
        staleTime: 5 * 60 * 1000, // 5 minutes - fresh live class data
        retry: 1,
        retryDelay: 1000,
    });

    return {
        liveClasses: data?.liveClasses || [],
        loading: isLoading,
        error: error instanceof Error ? error.message : (error ? String(error) : null),
        serverTime: data?.serverTime || 0
    };
};
