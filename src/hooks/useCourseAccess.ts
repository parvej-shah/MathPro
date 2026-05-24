import { usePaymentHistory } from './usePaymentHistory';
import { isLoggedIn } from '@/helpers';

interface CourseAccessResult {
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
  accessType: 'individual' | 'bundle' | null;
  transactionId: string | null;
}

/**
 * Hook to verify if a user has access to a specific course
 * @param courseId - The course ID to check access for
 * @returns Object containing access status, loading state, and error information
 */
export const useCourseAccess = (courseId: string | string[] | undefined): CourseAccessResult => {
  const { historyData, loading, error } = usePaymentHistory();

  // Early return if no courseId or not logged in
  if (!courseId || Array.isArray(courseId) || !isLoggedIn()) {
    return {
      hasAccess: false,
      loading: false,
      error: 'Invalid course ID or user not authenticated',
      accessType: null,
      transactionId: null,
    };
  }

  // Still loading payment history
  if (loading) {
    return {
      hasAccess: false,
      loading: true,
      error: null,
      accessType: null,
      transactionId: null,
    };
  }

  // Error loading payment history
  if (error) {
    return {
      hasAccess: false,
      loading: false,
      error,
      accessType: null,
      transactionId: null,
    };
  }

  // No payment history data
  if (!historyData) {
    return {
      hasAccess: false,
      loading: false,
      error: 'No payment history available',
      accessType: null,
      transactionId: null,
    };
  }

  // Check individual course purchases
  const courseAccess = historyData.individual_courses?.find(
    (course) => course.course_id.toString() === courseId,
  );

  if (courseAccess) {
    return {
      hasAccess: true,
      loading: false,
      error: null,
      accessType: 'individual',
      transactionId: courseAccess.transaction_id,
    };
  }

  // Check bundle purchases (courses included in bundles)
  const bundleAccess = historyData.bundle_purchases?.find((bundle) =>
    bundle.courses?.some((course) => course.id.toString() === courseId),
  );

  if (bundleAccess) {
    return {
      hasAccess: true,
      loading: false,
      error: null,
      accessType: 'bundle',
      transactionId: bundleAccess.transaction_id,
    };
  }

  // No access found
  return {
    hasAccess: false,
    loading: false,
    error: null,
    accessType: null,
    transactionId: null,
  };
};

/**
 * Hook to verify if a user has access to a specific bundle
 * @param bundleId - The bundle ID to check access for
 * @returns Object containing access status, loading state, and error information
 */
export const useBundleAccess = (bundleId: string | string[] | undefined): CourseAccessResult => {
  const { historyData, loading, error } = usePaymentHistory();

  // Early return if no bundleId or not logged in
  if (!bundleId || Array.isArray(bundleId) || !isLoggedIn()) {
    return {
      hasAccess: false,
      loading: false,
      error: 'Invalid bundle ID or user not authenticated',
      accessType: null,
      transactionId: null,
    };
  }

  // Still loading payment history
  if (loading) {
    return {
      hasAccess: false,
      loading: true,
      error: null,
      accessType: null,
      transactionId: null,
    };
  }

  // Error loading payment history
  if (error) {
    return {
      hasAccess: false,
      loading: false,
      error,
      accessType: null,
      transactionId: null,
    };
  }

  // No payment history data
  if (!historyData) {
    return {
      hasAccess: false,
      loading: false,
      error: 'No payment history available',
      accessType: null,
      transactionId: null,
    };
  }

  // Check bundle purchases
  const bundleAccess = historyData.bundle_purchases?.find(
    (bundle) => bundle.id.toString() === bundleId,
  );

  if (bundleAccess) {
    return {
      hasAccess: true,
      loading: false,
      error: null,
      accessType: 'bundle',
      transactionId: bundleAccess.transaction_id,
    };
  }

  // No access found
  return {
    hasAccess: false,
    loading: false,
    error: null,
    accessType: null,
    transactionId: null,
  };
};

export type { CourseAccessResult };