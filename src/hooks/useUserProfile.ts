import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/api.config';

export interface UserProfileDetails {
  email: string | null;
  phone: string | null;
  facebookId: string | null;
  address: string | null;
  schoolCollege: string | null;
  group: 'Science' | 'Arts' | 'Commerce' | null;
  guardianName: string | null;
  guardianMobile: string | null;
  relationWithGuardian: string | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  classLevel: 'JSC' | 'SSC' | 'HSC' | null;
  version: 'Bangla' | 'English' | null;
  department: string | null;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  login: string;
  login_type?: 'email' | 'phone';
  auth_providers?: string[];
  has_password?: boolean;
  profile: UserProfileDetails;
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
    } catch (err: unknown) {
      console.error('Error fetching user profile:', err);
      // Backend error response: { success: false, error: "..." }
      const errorMessage = axios.isAxiosError<{ error?: string; message?: string }>(err)
        ? err.response?.data?.error ||
          err.response?.data?.message ||
          err.message
        : err instanceof Error
          ? err.message
          : 'Failed to fetch user profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProfile();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
};
