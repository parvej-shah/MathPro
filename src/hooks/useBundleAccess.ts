import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/api.config';
import { isLoggedIn } from '@/helpers';
import { jwtDecode } from 'jwt-decode';

const isDev = process.env.NODE_ENV === 'development';

interface CourseAccess {
  id: number;
  title: string;
  url: string;
  has_access: boolean;
  enrollment_date?: number;
  access_method?: 'bundle_purchase' | 'individual_purchase';
  course_url: string;
}

interface BundleAccess {
  bundle_id: number;
  bundle_title: string;
  bundle_purchased: boolean;
  purchase_date?: number;
  courses: CourseAccess[];
}

export const useBundleAccess = (bundleId: number) => {
  const [bundleAccess, setBundleAccess] = useState<BundleAccess | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBundleAccess = async () => {
    if (!bundleId || !isLoggedIn()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) return;

      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.id || decodedToken.user_id || decodedToken.sub;

      if (!userId) {
        setError('User ID not found');
        return;
      }

      // Try to call the bundle course access API
      // This API might not exist yet, so we'll handle the error gracefully
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/bundle/${bundleId}/course-access`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            data: { user_id: userId }
          }
        );

        if (response.data.success) {
          setBundleAccess(response.data.data);
        } else {
          setError('Failed to fetch bundle access');
        }
      } catch (apiError: any) {
        // If the API doesn't exist yet, we'll create a fallback
        if (isDev) console.warn('Bundle access API not available, using fallback');
        
        // Fallback: Check bundle purchase status
        const bundleResponse = await axios.get(`${BACKEND_URL}/user/bundle/${bundleId}`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          data: { user_id: userId }
        });

        if (bundleResponse.data.success) {
          const bundle = bundleResponse.data.data[0];
          
          // Create fallback response structure
          const fallbackAccess: BundleAccess = {
            bundle_id: bundle.id,
            bundle_title: bundle.title,
            bundle_purchased: bundle.purchased || false,
            purchase_date: bundle.purchase_date,
            courses: bundle.courses.map((course: any) => ({
              id: course.id,
              title: course.title,
              url: course.url,
              has_access: bundle.purchased || bundle.owned_courses?.includes(course.id) || false,
              access_method: bundle.purchased ? 'bundle_purchase' : 'individual_purchase',
              course_url: `/course/${course.id}`
            }))
          };
          
          setBundleAccess(fallbackAccess);
        }
      }
    } catch (error: any) {
      if (isDev) console.error('Error fetching bundle access:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundleAccess();
  }, [bundleId]);

  const refreshAccess = () => {
    fetchBundleAccess();
  };

  return {
    bundleAccess,
    loading,
    error,
    refreshAccess,
    hasAccess: bundleAccess?.bundle_purchased || false,
  };
};

// Hook for checking if user owns individual courses
export const useCourseOwnership = (courseIds: number[]) => {
  const [ownedCourses, setOwnedCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      if (!courseIds.length || !isLoggedIn()) return;

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) return;

        const decodedToken: any = jwtDecode(token);
        const userId = decodedToken.id || decodedToken.user_id || decodedToken.sub;
        if (!userId) return;

        // This would require a new API endpoint to check multiple course ownership
        // For now, we'll use individual course checks
        const ownershipPromises = courseIds.map(async (courseId) => {
          try {
            const response = await axios.get(
              `${BACKEND_URL}/user/course/check-enrollment/${courseId}`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                data: { user_id: userId }
              }
            );
            return response.data.success && response.data.enrolled ? courseId : null;
          } catch (error) {
            return null;
          }
        });

        const results = await Promise.all(ownershipPromises);
        const owned = results.filter((id): id is number => id !== null);
        setOwnedCourses(owned);
      } catch (error) {
        if (isDev) console.error('Error checking course ownership:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [courseIds]);

  return { ownedCourses, loading };
};
