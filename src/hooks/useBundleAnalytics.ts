import { useEffect } from 'react';

interface BundleAnalytics {
  bundleId: number;
  bundleTitle: string;
  action: 'view' | 'purchase_attempt' | 'purchase_success' | 'course_click';
  metadata?: {
    courseId?: number;
    courseTitle?: string;
    price?: number;
    savings?: number;
    access_method?: string;
    purchased?: boolean;
    owned_courses_count?: number;
  };
}

export const useBundleAnalytics = () => {
  const trackBundleEvent = (analytics: BundleAnalytics) => {
    // Log to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Bundle Analytics:', analytics);
    }

    // Here you can integrate with your analytics service
    // Example: Google Analytics, Mixpanel, etc.
    
    try {
      // Example for Google Analytics (if implemented)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', `bundle_${analytics.action}`, {
          bundle_id: analytics.bundleId,
          bundle_title: analytics.bundleTitle,
          ...analytics.metadata,
        });
      }

      // Example for custom analytics API
      // fetch('/api/analytics/bundle', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(analytics),
      // });

    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  };

  return { trackBundleEvent };
};

// Bundle performance metrics hook
export const useBundleMetrics = () => {
  const calculateBundleMetrics = (bundles: any[]) => {
    const metrics = {
      totalBundles: bundles.length,
      totalRevenue: 0,
      averageBundlePrice: 0,
      totalSavings: 0,
      averageCoursesPerBundle: 0,
    };

    if (bundles.length > 0) {
      metrics.totalRevenue = bundles.reduce((sum, bundle) => sum + bundle.price, 0);
      metrics.averageBundlePrice = metrics.totalRevenue / bundles.length;
      
      const totalCourses = bundles.reduce((sum, bundle) => sum + bundle.course_count, 0);
      metrics.averageCoursesPerBundle = totalCourses / bundles.length;

      metrics.totalSavings = bundles.reduce((sum, bundle) => {
        const originalTotal = bundle.courses?.reduce((courseSum: number, course: any) => courseSum + course.price, 0) || 0;
        return sum + (originalTotal - bundle.price);
      }, 0);
    }

    return metrics;
  };

  return { calculateBundleMetrics };
};
