import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/api.config';
import type { LmsPreference } from '@/constants/lmsPreference';

const LMS_PREFERENCE_CACHE_KEY = 'lms_preference';

interface ManagerialProfileRow {
  id?: number;
  name: string;
  cf_handle?: string;
  profile?: Record<string, unknown> | null;
}

interface GetProfileResponse {
  success: boolean;
  rows?: ManagerialProfileRow[];
  data?: ManagerialProfileRow[] | ManagerialProfileRow;
  error?: string;
}

/** Backend may return user in rows[] or data[] or data (single object). */
function getProfileRow(res: GetProfileResponse): ManagerialProfileRow | null {
  if (!res.success) return null;
  const row = res.rows?.[0];
  if (row) return row;
  const data = res.data;
  if (Array.isArray(data) && data[0]) return data[0];
  if (data && typeof data === 'object' && 'name' in data)
    return data as ManagerialProfileRow;
  return null;
}

interface SetProfileResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface UseLmsPreferenceReturn {
  lmsPreference: LmsPreference | null;
  loading: boolean;
  error: string | null;
  setLmsPreference: (value: LmsPreference) => Promise<boolean>;
  refetch: () => Promise<void>;
}

export function useLmsPreference(): UseLmsPreferenceReturn {
  const [lmsPreference, setLmsPreferenceState] = useState<LmsPreference | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const cached = localStorage.getItem(LMS_PREFERENCE_CACHE_KEY);
      if (cached === 'locked' || cached === 'unlocked') return cached;
    } catch {
      // ignore
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreference = useCallback(async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setLmsPreferenceState(null);
      setLoading(false);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<GetProfileResponse>(`${BACKEND_URL}/admin/auth/getProfile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const row = getProfileRow(response.data);
      if (row) {
        const profile = row.profile;
        const value = profile && typeof profile === 'object' && (profile.lms_preference === 'locked' || profile.lms_preference === 'unlocked')
          ? (profile.lms_preference as LmsPreference)
          : null;
        setLmsPreferenceState(value);
        if (value && typeof window !== 'undefined') {
          try {
            localStorage.setItem(LMS_PREFERENCE_CACHE_KEY, value);
          } catch {
            // ignore
          }
        }
      } else {
        setLmsPreferenceState(null);
      }
    } catch (err: unknown) {
      const errMsg = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error ? err.message : 'Failed to fetch preference';
      setError(errMsg);
      setLmsPreferenceState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPreference();
  }, [fetchPreference]);

  const setLmsPreference = useCallback(async (value: LmsPreference): Promise<boolean> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return false;
    try {
      const getRes = await axios.get<GetProfileResponse>(`${BACKEND_URL}/admin/auth/getProfile`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const row = getProfileRow(getRes.data);
      if (!row) {
        setError('Could not load profile to update');
        return false;
      }
      const profile = row.profile && typeof row.profile === 'object' ? { ...row.profile } : {};
      profile.lms_preference = value;

      const setRes = await axios.put<SetProfileResponse>(
        `${BACKEND_URL}/admin/auth/setProfile`,
        { name: row.name, cf_handle: row.cf_handle ?? '', profile },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      if (!setRes.data.success) {
        setError(setRes.data.error || 'Failed to save preference');
        return false;
      }
      setLmsPreferenceState(value);
      setError(null);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(LMS_PREFERENCE_CACHE_KEY, value);
        } catch {
          // ignore
        }
      }
      return true;
    } catch (err: unknown) {
      const errMsg = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error ? err.message : 'Failed to save preference';
      setError(errMsg);
      return false;
    }
  }, []);

  return {
    lmsPreference,
    loading,
    error,
    setLmsPreference,
    refetch: fetchPreference,
  };
}
