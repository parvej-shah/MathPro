import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/api.config';
import jwtDecode from 'jwt-decode';

export interface UserProfile {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  login: string;
  login_type?: 'email' | 'phone';
  profile: {
    email: string | null;
    phone: string | null;
    currentInstitution: string | null;
    department: string | null;
    currentAcademicLevel: 'SSC' | 'HSC' | 'UNIVERSITY' | 'OTHERS' | null;
  };
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserProfile = (): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      // Note: Backend extracts user_id from JWT token automatically
      // No need to extract user_id on frontend for this endpoint

      // Fetch user profile from backend
      // Backend endpoint: GET /user/profile (user_id extracted from JWT token)
      const response = await axios.get(`${BACKEND_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Backend response structure: { success: true, data: {...} }
      if (response.data.success && response.data.data) {
        setProfile(response.data.data);
        setError(null);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      // Backend error response: { success: false, error: "..." }
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch user profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
