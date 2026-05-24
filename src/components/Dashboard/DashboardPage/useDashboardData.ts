import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import {
  usePaymentHistory,
  IndividualCourse,
  BundlePurchase,
  BundleCourse,
} from "@/hooks/usePaymentHistory";
import { EnrolledCourse } from "./types";

export function useDashboardData() {
  const {
    historyData,
    loading: apiLoading,
    error: historyError,
  } = usePaymentHistory();
  const [resumeCourseProgress, setResumeCourseProgress] = useState<any>(null);
  const [progressLoading, setProgressLoading] = useState(false);

  // Generate modern, content-aware placeholder thumbnail
  const generatePlaceholderThumbnail = useCallback((courseName: string) => {
    // Extract all words and create initials from first three words
    const words = courseName
      .replace(/[^\w\s]/g, "") // Remove special characters
      .split(/\s+/)
      .filter((word) => word.length > 0);

    // Get first letter from first three words
    let initials = "";
    if (words.length >= 3) {
      initials =
        words[0].charAt(0).toUpperCase() +
        words[1].charAt(0).toUpperCase() +
        words[2].charAt(0).toUpperCase();
    } else if (words.length === 2) {
      initials =
        words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    } else if (words.length === 1) {
      initials = words[0].substring(0, 3).toUpperCase();
    } else {
      initials = courseName.substring(0, 3).toUpperCase();
    }

    // All available gradients - diverse color palette
    const allGradients = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-teal-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-purple-500",
      "from-red-500 to-rose-500",
      "from-pink-500 to-fuchsia-500",
      "from-orange-500 to-red-500",
      "from-cyan-500 to-blue-500",
      "from-teal-500 to-green-500",
      "from-violet-500 to-purple-500",
      "from-lime-500 to-green-500",
      "from-amber-500 to-orange-500",
      "from-sky-500 to-blue-500",
      "from-rose-500 to-pink-500",
      "from-emerald-500 to-teal-500",
      "from-fuchsia-500 to-pink-600",
      "from-blue-600 to-indigo-600",
      "from-green-600 to-emerald-600",
      "from-orange-600 to-red-600",
    ];

    // Improved hash function for better distribution (FNV-1a algorithm)
    let hash = 2166136261; // FNV offset basis
    for (let i = 0; i < courseName.length; i++) {
      hash ^= courseName.charCodeAt(i);
      hash +=
        (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    // Make hash positive and get index
    const index = Math.abs(hash >>> 0) % allGradients.length;
    const selectedGradient = allGradients[index];

    // Generate SVG with modern gradient design
    const svg = `
      <svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${getGradientColor(selectedGradient, "from")};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${getGradientColor(selectedGradient, "to")};stop-opacity:1" />
          </linearGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
          </pattern>
        </defs>
        
        <!-- Background gradient -->
        <rect width="800" height="450" fill="url(#grad)"/>
        
        <!-- Grid pattern overlay -->
        <rect width="800" height="450" fill="url(#grid)"/>
        
        <!-- Decorative circles -->
        <circle cx="650" cy="80" r="120" fill="rgba(255,255,255,0.08)"/>
        <circle cx="100" cy="380" r="80" fill="rgba(255,255,255,0.06)"/>
        
        <!-- Course initials -->
        <text x="400" y="250" font-family="Arial, sans-serif" font-size="140" font-weight="bold" 
              fill="white" text-anchor="middle" opacity="0.95">${initials}</text>
        
        <!-- Course title -->
        <text x="400" y="320" font-family="Arial, sans-serif" font-size="20" font-weight="500" 
              fill="white" text-anchor="middle" opacity="0.8">${truncateText(courseName, 40)}</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }, []);

  // Helper function to extract gradient colors
  const getGradientColor = (
    gradientClass: string,
    position: "from" | "to",
  ): string => {
    const colorMap: Record<string, string> = {
      "blue-500": "#3b82f6",
      "blue-600": "#2563eb",
      "cyan-500": "#06b6d4",
      "purple-500": "#a855f7",
      "purple-600": "#9333ea",
      "pink-500": "#ec4899",
      "pink-600": "#db2777",
      "green-500": "#22c55e",
      "green-600": "#16a34a",
      "teal-500": "#14b8a6",
      "yellow-500": "#eab308",
      "orange-500": "#f97316",
      "orange-600": "#ea580c",
      "indigo-500": "#6366f1",
      "indigo-600": "#4f46e5",
      "red-500": "#ef4444",
      "red-600": "#dc2626",
      "rose-500": "#f43f5e",
      "fuchsia-500": "#d946ef",
      "violet-500": "#8b5cf6",
      "lime-500": "#84cc16",
      "amber-500": "#f59e0b",
      "sky-500": "#0ea5e9",
      "emerald-500": "#10b981",
      "emerald-600": "#059669",
    };

    const match = gradientClass.match(
      position === "from" ? /from-(\S+)/ : /to-(\S+)/,
    );
    return match ? colorMap[match[1]] || "#6b7280" : "#6b7280";
  };

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Calculate progress from new API response structure
  const calculateProgress = useCallback((courseData: any) => {
    // New API structure
    if (courseData && courseData.progress) {
      return {
        progress: courseData.progress.progressPercentage,
        totalModules: courseData.progress.totalModules,
        completedModules: courseData.progress.completedModules,
        totalLessons: courseData.progress.totalModules,
        completedLessons: courseData.progress.completedModules,
      };
    }

    // Fallback for old structure (shouldn't happen with new API)
    if (!courseData || !courseData.chapters) {
      return {
        progress: 0,
        totalModules: 0,
        completedModules: 0,
        totalLessons: 0,
        completedLessons: 0,
      };
    }

    const totalModules = courseData.chapters.reduce(
      (sum: number, chapter: any) => sum + (chapter.modules?.length || 0),
      0,
    );

    const completedModules = courseData.maxModuleSerialProgress || 0;
    const progress =
      totalModules > 0
        ? Math.round((completedModules / totalModules) * 100)
        : 0;

    return {
      progress,
      totalModules,
      completedModules,
      totalLessons: totalModules,
      completedLessons: completedModules,
    };
  }, []);

  // Get most recent course ID from localStorage
  const mostRecentCourseId = useMemo(() => {
    if (!historyData || typeof window === "undefined") return null;

    try {
      const stored = localStorage.getItem("codervai_last_viewed_course");
      if (stored) {
        const history = JSON.parse(stored);
        if (Array.isArray(history) && history.length > 0) {
          return history[0].courseId;
        }
      }
    } catch (e) {
      // Ignore errors
    }

    // Fallback: most recently enrolled
    const allCourses: Array<{ id: number; date: number }> = [];
    historyData.individual_courses.forEach((c: IndividualCourse) =>
      allCourses.push({ id: c.course_id, date: c.enrollment_date }),
    );
    historyData.bundle_purchases.forEach((b: BundlePurchase) => {
      b.courses?.forEach((c: BundleCourse) =>
        allCourses.push({ id: c.id, date: b.purchase_date }),
      );
    });

    if (allCourses.length === 0) return null;
    allCourses.sort((a, b) => b.date - a.date);
    return allCourses[0].id;
  }, [historyData]);

  // Fetch progress for resume course using new dashboard API (no caching needed)
  useEffect(() => {
    if (!mostRecentCourseId || !historyData) return;

    const fetchProgress = async () => {
      setProgressLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get(
          `${BACKEND_URL}/user/course/dashboard/${mostRecentCourseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.data.success && response.data.data) {
          setResumeCourseProgress(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching course progress:", error);
      } finally {
        setProgressLoading(false);
      }
    };

    fetchProgress();
  }, [mostRecentCourseId, historyData]);

  // Process courses directly from payment history (no heavy calculations)
  const courses = useMemo(() => {
    if (!historyData) return [];

    const processedCourses: EnrolledCourse[] = [];

    // Process individual courses
    historyData.individual_courses.forEach((course: IndividualCourse) => {
      let instructorName = "Instructor";
      if (
        course.instructor_list &&
        typeof course.instructor_list === "object" &&
        "instructors" in course.instructor_list
      ) {
        instructorName =
          course.instructor_list.instructors?.[0]?.name || "Instructor";
      }

      // Use placeholder thumbnail (actual thumbnails require getfull API which impacts performance)
      const thumbnail = generatePlaceholderThumbnail(course.title);

      processedCourses.push({
        id: course.course_id,
        title: course.title,
        thumbnail,
        progress: 0,
        lastAccessed: new Date(course.enrollment_date * 1000).toISOString(),
        status: "Ongoing",
        totalLessons: 0,
        completedLessons: 0,
        instructor: instructorName,
        isBundle: false,
        originalData: course,
        isLoading: false,
      });
    });

    // Process bundles
    historyData.bundle_purchases.forEach((bundle: BundlePurchase) => {
      let bundleThumbnail = generatePlaceholderThumbnail(bundle.title);

      if (bundle.chips?.thumbnails?.bundle_thumb_16_9?.trim()) {
        bundleThumbnail = bundle.chips.thumbnails.bundle_thumb_16_9;
      } else if (bundle.chips?.image_slider?.image_1_16_9?.trim()) {
        bundleThumbnail = bundle.chips.image_slider.image_1_16_9;
      }

      processedCourses.push({
        id: bundle.id,
        title: bundle.title,
        thumbnail: bundleThumbnail,
        progress: 0,
        lastAccessed: new Date(bundle.purchase_date * 1000).toISOString(),
        status: "Ongoing",
        totalLessons: 0,
        completedLessons: 0,
        instructor: "Multiple Instructors",
        isBundle: true,
        courses: bundle.courses,
        courseCount: bundle.courses?.length || 0,
        originalData: bundle,
        isLoading: false,
      });
    });

    return processedCourses;
  }, [historyData, generatePlaceholderThumbnail]);

  // Get all individual courses for resume banner
  const allIndividualCourses = useMemo(() => {
    if (!historyData) return [];

    const individualCourses: EnrolledCourse[] = [];

    // Add standalone courses
    historyData.individual_courses.forEach((course: IndividualCourse) => {
      const isResumeCourse = course.course_id === mostRecentCourseId;
      const progressInfo =
        isResumeCourse && resumeCourseProgress
          ? calculateProgress(resumeCourseProgress)
          : {
              progress: 0,
              totalModules: 0,
              completedModules: 0,
              totalLessons: 0,
              completedLessons: 0,
            };

      let instructorName = "Instructor";
      if (
        course.instructor_list &&
        typeof course.instructor_list === "object" &&
        "instructors" in course.instructor_list
      ) {
        instructorName =
          course.instructor_list.instructors?.[0]?.name || "Instructor";
      }

      const thumbnail =
        isResumeCourse && (resumeCourseProgress?.thumbnails?.course_thumbnail_link_16_9 || resumeCourseProgress?.thumbnails?.course_thumbnail_link)
          ? (resumeCourseProgress.thumbnails.course_thumbnail_link_16_9 || resumeCourseProgress.thumbnails.course_thumbnail_link)
          : generatePlaceholderThumbnail(course.title);

      individualCourses.push({
        id: course.course_id,
        title: course.title,
        thumbnail,
        progress: progressInfo.progress,
        lastAccessed: new Date(course.enrollment_date * 1000).toISOString(),
        status:
          progressInfo.progress === 100
            ? "Completed"
            : progressInfo.progress === 0
              ? "Not Started"
              : "Ongoing",
        totalLessons: progressInfo.totalLessons,
        completedLessons: progressInfo.completedLessons,
        instructor: instructorName,
        isBundle: false,
        originalData: course,
        isLoading: false,
      });
    });

    // Add courses from bundles
    historyData.bundle_purchases.forEach((bundle: BundlePurchase) => {
      bundle.courses?.forEach((bundleCourse: BundleCourse) => {
        const isResumeCourse = bundleCourse.id === mostRecentCourseId;
        const progressInfo =
          isResumeCourse && resumeCourseProgress
            ? calculateProgress(resumeCourseProgress)
            : {
                progress: 0,
                totalModules: 0,
                completedModules: 0,
                totalLessons: 0,
                completedLessons: 0,
              };

        const thumbnail =
          isResumeCourse && (resumeCourseProgress?.thumbnails?.course_thumbnail_link_16_9 || resumeCourseProgress?.thumbnails?.course_thumbnail_link)
            ? (resumeCourseProgress.thumbnails.course_thumbnail_link_16_9 || resumeCourseProgress.thumbnails.course_thumbnail_link)
            : generatePlaceholderThumbnail(bundleCourse.title);

        individualCourses.push({
          id: bundleCourse.id,
          title: bundleCourse.title,
          thumbnail,
          progress: progressInfo.progress,
          lastAccessed: new Date(bundle.purchase_date * 1000).toISOString(),
          status:
            progressInfo.progress === 100
              ? "Completed"
              : progressInfo.progress === 0
                ? "Not Started"
                : "Ongoing",
          totalLessons: progressInfo.totalLessons,
          completedLessons: progressInfo.completedLessons,
          instructor: "Instructor",
          isBundle: false,
          originalData: bundleCourse,
          isLoading: false,
        });
      });
    });

    return individualCourses;
  }, [
    historyData,
    mostRecentCourseId,
    resumeCourseProgress,
    calculateProgress,
    generatePlaceholderThumbnail,
  ]);

  return {
    courses,
    allIndividualCourses,
    isLoading: apiLoading || progressLoading,
    error: historyError,
    generatePlaceholderThumbnail,
    allProgressCalculated: !apiLoading && !progressLoading,
  };
}
