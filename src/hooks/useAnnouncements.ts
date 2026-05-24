import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../api.config';

export interface Announcement {
    id: number;
    title: string;
    content: string;
    created_date: string;
}

interface AnnouncementsResponse {
    success: boolean;
    data?: {
        announcements: Announcement[];
        total_count: number;
    };
    error?: string;
}

interface AnnouncementsData {
    announcements: Announcement[];
    totalCount: number;
}

export const useAnnouncements = (
    courseId: string | string[] | undefined,
    limit: number = 10,
    offset: number = 0
) => {
    const fetchAnnouncements = async (): Promise<AnnouncementsData> => {
        if (!courseId || Array.isArray(courseId)) {
            throw new Error('Invalid course ID');
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(
            `${BACKEND_URL}/user/course/${courseId}/announcements?limit=${limit}&offset=${offset}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch announcements: ${response.status}`);
        }

        const data: AnnouncementsResponse = await response.json();

        if (data.success && data.data) {
            return {
                announcements: data.data.announcements || [],
                totalCount: data.data.total_count || 0
            };
        } else if (data.error) {
            throw new Error(data.error);
        } else {
            // Empty announcements
            return {
                announcements: [],
                totalCount: 0
            };
        }
    };

    const { data, isLoading, error } = useQuery({
        queryKey: ['announcements', courseId, limit, offset],
        queryFn: fetchAnnouncements,
        enabled: typeof window !== 'undefined' && !!courseId && !Array.isArray(courseId),
        staleTime: 3 * 60 * 1000, // 3 minutes - fresh announcements
        retry: 1,
        retryDelay: 1000,
    });

    return {
        announcements: data?.announcements || [],
        totalCount: data?.totalCount || 0,
        loading: isLoading,
        error: error instanceof Error ? error.message : (error ? String(error) : null)
    };
};
