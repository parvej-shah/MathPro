import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { BACKEND_URL } from '../api.config';
import { getAuthToken } from '../helpers';

interface RankingUser {
  id: number;
  name: string;
  cf_handle: string | null;
  score: string;
  earliest_timestamp: number | null;
  rank: string;
}

interface RankingData {
  myData: RankingUser | null;
  top3Positions: RankingUser[];
  allPositions: RankingUser[];
}

interface RankingResponse {
  success: boolean;
  data: RankingData;
  rowCount: number;
}

interface UseRankingParams {
  courseId: number;
  offset?: number;
  limit?: number;
  userId?: number;
}

export const useRanking = ({ courseId, offset = 0, limit = 10, userId }: UseRankingParams) => {
  const fetchRanking = async (): Promise<RankingData> => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      // Use GET request with query parameters as per documentation
      const response = await axios.get<RankingResponse>(
        `${BACKEND_URL}/user/course/getRanking/${courseId}`,
        {
          params: { 
            offset, 
            limit,
            ...(userId && { user_id: userId })
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to fetch ranking data');
      }
    } catch (error) {
      throw error;
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['courseRanking', courseId, offset, limit],
    queryFn: fetchRanking,
    enabled: typeof window !== 'undefined' && !!courseId,
    staleTime: 2 * 60 * 1000, // 2 minutes - ranking data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  return {
    rankingData: data || null,
    myData: data?.myData || null,
    top3: data?.top3Positions || [],
    allRankings: data?.allPositions || [],
    loading: isLoading,
    error: error instanceof Error ? error.message : (error ? String(error) : null),
    refetch,
  };
};

export type { RankingUser, RankingData };
