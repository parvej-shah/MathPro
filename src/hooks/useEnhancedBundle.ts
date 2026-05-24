import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/api.config';
import { isLoggedIn } from '@/helpers';
import { jwtDecode } from 'jwt-decode';

const isDev = process.env.NODE_ENV === 'development';

interface BundleCourse {
  id: number;
  title: string;
  url: string;
  enrollment_date: number;
  bundle_title: string;
  bundle_id: number;
  bundle_purchase_date: number;
}

interface AllCourse {
  id: number;
  title: string;
  x_price: number;
  price: number;
  language: string;
  enrolled: number;
  short_description: string;
  url: string;
  course_thumbnail_link?: string; // Old field (backward compatibility)
  enrollment_date: number | null;
  paid_amount: number | null;
  transaction_id: string | null;
  enrollment_source?: 'individual' | 'bundle';
  bundle_title?: string;
  bundle_id?: number;
  bundle_purchase_date?: number;
  // Include other fields from the API response
  you_get?: any;
  chips?: {
    course_thumbnail_link?: string; // Old field (backward compatibility)
    thumbnails?: {
      course_thumbnail_link_16_9?: string;
      trailer_video_thumb_16_9?: string;
      facebook_community_thumb_16_9?: string;
    };
    [key: string]: any;
  };
  study_plan_chips?: any;
  instructor_list?: any;
  faq_list?: any;
  description?: string;
  feedback_list?: any;
  intro_video?: string;
  is_live?: boolean;
  serial?: any;
}

interface DuplicateCheck {
  hasDuplicates: boolean;
  duplicateCount: number;
  duplicateCourses: Array<{
    id: number;
    title: string;
    enrollment_date: number;
    amount_paid: number;
    source: string;
  }>;
  bundlePrice: number;
  alreadyPaidAmount: number;
  potentialSavings: number;
  recommendation: string;
}

export const useEnhancedBundle = () => {
  const [bundleCourses, setBundleCourses] = useState<BundleCourse[]>([]);
  const [allCourses, setAllCourses] = useState<AllCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUserId = (): number | null => {
    // Prevent server-side execution to avoid hydration errors
    if (typeof window === 'undefined') return null;
    
    if (!isLoggedIn()) return null;
    
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.id || decodedToken.user_id || decodedToken.sub || null;
    } catch (error) {
      if (isDev) console.error('Token decode error:', error);
      return null;
    }
  };

  const fetchBundleCourses = async () => {
    // Prevent server-side execution
    if (typeof window === 'undefined') return;
    
    const userId = getUserId();
    if (!userId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userIdInt = parseInt(userId.toString());
      
      // Use new URL parameter format (recommended)
      try {
        const response = await axios.get(`${BACKEND_URL}/user/bundle/bundle-courses/${userIdInt}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          if (isDev) console.log('Bundle courses response (URL params):', response.data.data);
          setBundleCourses(Array.isArray(response.data.data) ? response.data.data : []);
          return;
        }
      } catch (urlError: any) {
        if (isDev) console.warn('URL parameter API failed, trying legacy format:', urlError.message);
        
        // Fallback to legacy request body format
        try {
          const legacyResponse = await axios.get(`${BACKEND_URL}/user/bundle/bundle-courses`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            data: { user_id: userIdInt }
          });

          if (legacyResponse.data.success) {
            if (isDev) console.log('Bundle courses response (legacy):', legacyResponse.data.data);
            setBundleCourses(Array.isArray(legacyResponse.data.data) ? legacyResponse.data.data : []);
            return;
          }
        } catch (legacyError: any) {
          if (isDev) console.error('Both API formats failed:', legacyError);
          throw legacyError;
        }
      }
    } catch (error: any) {
      if (isDev) console.error('Error fetching bundle courses:', error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    // Prevent server-side execution
    if (typeof window === 'undefined') return;
    
    const userId = getUserId();
    if (!userId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userIdInt = parseInt(userId.toString());
      
      // Use new URL parameter format (recommended)
      try {
        const response = await axios.get(`${BACKEND_URL}/user/bundle/all-courses/${userIdInt}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          if (isDev) console.log('All courses response (URL params):', response.data.data);
          setAllCourses(Array.isArray(response.data.data) ? response.data.data : []);
          return;
        }
      } catch (urlError: any) {
        if (isDev) console.warn('URL parameter API failed, trying legacy format:', urlError.message);
        
        // Fallback to legacy request body format
        try {
          const legacyResponse = await axios.get(`${BACKEND_URL}/user/bundle/all-courses`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            data: { user_id: userIdInt }
          });

          if (legacyResponse.data.success) {
            if (isDev) console.log('All courses response (legacy):', legacyResponse.data.data);
            setAllCourses(Array.isArray(legacyResponse.data.data) ? legacyResponse.data.data : []);
            return;
          }
        } catch (legacyError: any) {
          if (isDev) console.error('Both API formats failed:', legacyError);
          throw legacyError;
        }
      }
    } catch (error: any) {
      if (isDev) console.error('Error fetching all courses:', error);
      setError(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkDuplicateCourses = async (bundleId: number): Promise<DuplicateCheck | null> => {
    // Prevent server-side execution
    if (typeof window === 'undefined') return null;
    
    const userId = getUserId();
    if (!userId) return null;

    try {
      const token = localStorage.getItem('token');
      const userIdInt = parseInt(userId.toString());
      
      // Use new URL parameter format
      const response = await axios.get(`${BACKEND_URL}/user/bundle/${bundleId}/check-duplicates/${userIdInt}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        if (isDev) console.log('Duplicate check response:', response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      if (isDev) console.error('Error checking duplicates:', error);
      return null;
    }
  };

  const getCourseAccess = async (bundleId: number) => {
    // Prevent server-side execution
    if (typeof window === 'undefined') return null;
    
    const userId = getUserId();
    if (!userId) return null;

    try {
      const token = localStorage.getItem('token');
      const userIdInt = parseInt(userId.toString());
      
      // Use the new course-access API with request body
      const response = await axios.get(`${BACKEND_URL}/user/bundle/${bundleId}/course-access`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: { user_id: userIdInt }
      });

      if (response.data.success) {
        if (isDev) console.log('Course access response:', response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error: any) {
      if (isDev) console.error('Error fetching course access:', error);
      return null;
    }
  };

  const refreshData = () => {
    fetchBundleCourses();
    fetchAllCourses();
  };

  return {
    bundleCourses,
    allCourses,
    loading,
    error,
    fetchBundleCourses,
    fetchAllCourses,
    checkDuplicateCourses,
    getCourseAccess,
    refreshData,
    getUserId,
  };
};
