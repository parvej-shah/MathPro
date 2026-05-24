import { useState, useMemo } from "react";
import {
  usePaymentHistory,
  BundlePurchase,
  BundleCourse,
} from "@/hooks/usePaymentHistory";
import { EnrolledCourse } from "./types";

interface UseBundleExpansionProps {
  generatePlaceholderThumbnail: (courseName: string) => string;
}

export function useBundleExpansion({
  generatePlaceholderThumbnail,
}: UseBundleExpansionProps) {
  const { historyData } = usePaymentHistory();
  const [expandedBundleId, setExpandedBundleId] = useState<string | null>(null);

  const handleShowAll = (bundleId: string) => {
    setExpandedBundleId(bundleId);
  };

  const handleBackToBundles = () => {
    setExpandedBundleId(null);
  };

  // Get expanded bundle courses directly from payment history
  const expandedBundleCourses = useMemo(() => {
    if (!expandedBundleId || !historyData) return [];

    const bundle = historyData.bundle_purchases.find(
      (b: BundlePurchase) => b.id.toString() === expandedBundleId,
    );
    if (!bundle || !bundle.courses) return [];

    return bundle.courses.map((bundleCourse: BundleCourse) => {
      // Use placeholder thumbnail (actual thumbnails require getfull API which impacts performance)
      const thumbnail = generatePlaceholderThumbnail(bundleCourse.title);

      return {
        id: bundleCourse.id,
        title: bundleCourse.title,
        thumbnail,
        progress: 0,
        lastAccessed: new Date(
          bundleCourse.enrollment_date * 1000,
        ).toISOString(),
        status: "Ongoing" as const,
        totalLessons: 0,
        completedLessons: 0,
        instructor: "Instructor",
        isBundle: false,
        originalData: bundleCourse,
      } as EnrolledCourse;
    });
  }, [expandedBundleId, historyData, generatePlaceholderThumbnail]);

  return {
    expandedBundleId,
    expandedBundleCourses,
    handleShowAll,
    handleBackToBundles,
  };
}
