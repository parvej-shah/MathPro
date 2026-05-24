import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Course,
  CoursesResponse,
  StatsData,
  Instructor,
  Bundle,
  BundleResponse,
  InstructorResponse,
} from "../_lib/types";

/**
 * Extract number from Bengali/English mixed strings
 * Examples: "10 টি" -> 10, "40+" -> 40, "100+ ঘণ্টা" -> 100
 */
const extractNumber = (value: string | undefined): number => {
  if (!value) return 0;
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export function useCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Debounce search term for better performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Fetch courses with React Query caching
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async (): Promise<Course[]> => {
      const response = await axios.get<CoursesResponse>(
        `${BACKEND_URL}/user/course/list`
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch courses");
      }
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime renamed to gcTime in v5)
    retry: 2,
  });

  const courses: Course[] = useMemo(() => coursesData || [], [coursesData]);

  // Fetch instructors with React Query caching
  const {
    data: instructorsData,
    isLoading: instructorsLoading,
    error: instructorsError,
  } = useQuery({
    queryKey: ["instructors"],
    queryFn: async (): Promise<Instructor[]> => {
      const response = await axios.get<InstructorResponse>(
        `${BACKEND_URL}/user/instructor/list`
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch instructors");
      }
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });

  const instructorsFromAPI: Instructor[] = useMemo(() => instructorsData || [], [instructorsData]);

  // Fetch bundles with React Query caching
  const {
    data: bundlesData,
    isLoading: bundlesLoading,
  } = useQuery({
    queryKey: ["bundles"],
    queryFn: async (): Promise<Bundle[]> => {
      const response = await axios.get<BundleResponse>(
        `${BACKEND_URL}/user/bundle`
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch bundles");
      }
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  const bundles: Bundle[] = useMemo(() => bundlesData || [], [bundlesData]);

  const loading = coursesLoading || instructorsLoading || bundlesLoading;
  const error =
    coursesError || instructorsError
      ? "Failed to fetch data"
      : null;

  // Fallback instructors from courses if API fails
  const finalInstructors = useMemo(() => {
    if (instructorsFromAPI.length > 0) {
      return instructorsFromAPI;
    }
    // Fallback: extract from courses
    const allInstructors = courses.flatMap(
      (c) => c.instructor_list?.instructors || []
    );
    const uniqueMap = new Map<string, Instructor>();
    allInstructors.forEach((i) => {
      if (i.name && !uniqueMap.has(i.name)) {
        uniqueMap.set(i.name, i);
      }
    });
    return Array.from(uniqueMap.values());
  }, [instructorsFromAPI, courses]);

  // Calculate aggregated stats from courses
  const stats: StatsData = useMemo(() => {
    if (courses.length === 0) {
      // Return static fallback data when no courses loaded
      return {
        totalStudents: 5500,
        totalCourses: 11,
        averageRating: 4.8,
        totalLiveClasses: 500,
        totalRecordedVideos: 1000,
      };
    }

    const totalStudents = courses.reduce((sum, c) => sum + (c.enrolled || 0), 0);
    const totalCourses = courses.length;

    // Use regex to extract numbers from Bengali text (e.g., "10 টি" -> 10)
    const totalLiveClasses = courses.reduce((sum, c) => {
      const liveClassValue = c.chips?.sections?.liveClass?.value;
      return sum + extractNumber(liveClassValue);
    }, 0);

    // Use regex to extract numbers from Bengali text (e.g., "100+ ঘণ্টা" -> 100)
    const totalRecordedVideos = courses.reduce((sum, c) => {
      const videoValue = c.chips?.sections?.video?.value;
      return sum + extractNumber(videoValue);
    }, 0);

    // Return calculated values (no fallback when courses exist)
    return {
      totalStudents: totalStudents,
      totalCourses: totalCourses,
      averageRating: 4.8, // Static as no rating data available
      totalLiveClasses: totalLiveClasses,
      totalRecordedVideos: totalRecordedVideos,
    };
  }, [courses]);

  // Filter courses based on search and category (using debounced search)
  const filteredCourses = useMemo(() => {
    if (selectedCategory === "bundles") return [];
    return courses.filter((course) => {
      const matchesSearch =
        debouncedSearchTerm === "" ||
        course.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        course.short_description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "live" && course.is_live) ||
        (selectedCategory === "upcoming" && !course.is_live);

      return matchesSearch && matchesCategory;
    });
  }, [courses, debouncedSearchTerm, selectedCategory]);

  // Filter bundles based on search and category (using debounced search)
  const filteredBundles = useMemo(() => {
    if (selectedCategory === "bundles") {
      return bundles.filter((bundle) => {
        const matchesSearch =
          debouncedSearchTerm === "" ||
          bundle.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          bundle.short_description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        return matchesSearch;
      });
    }
    return bundles.filter((bundle) => {
      const matchesSearch =
        debouncedSearchTerm === "" ||
        bundle.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        bundle.short_description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "live" && bundle.is_live) ||
        (selectedCategory === "upcoming" && !bundle.is_live);

      return matchesSearch && matchesCategory;
    });
  }, [bundles, debouncedSearchTerm, selectedCategory]);

  // Get categories for filtering (includes both courses and bundles)
  const categories = useMemo(() => {
    const liveCourses = courses.filter((c) => c.is_live).length;
    const upcomingCourses = courses.filter((c) => !c.is_live).length;
    const liveBundles = bundles.filter((b) => b.is_live).length;
    const upcomingBundles = bundles.filter((b) => !b.is_live).length;

    const totalLive = liveCourses + liveBundles;
    const totalUpcoming = upcomingCourses + upcomingBundles;
    const total = courses.length + bundles.length;

    return [
      { id: "all", label: "সব কোর্স", count: total },
      { id: "bundles", label: "বান্ডেল", count: bundles.length },
      { id: "live", label: "লাইভ কোর্স", count: totalLive },
      { id: "upcoming", label: "আপকামিং", count: totalUpcoming },
    ];
  }, [courses, bundles]);

  // Aggregate all feedbacks from courses
  const allFeedbacks = useMemo(() => {
    return courses.flatMap((c) => c.feedback_list?.feedbacks || []);
  }, [courses]);

  const refetch = () => {
    refetchCourses();
  };

  return {
    courses,
    filteredCourses,
    filteredBundles,
    loading,
    error,
    stats,
    instructors: finalInstructors,
    bundles,
    categories,
    allFeedbacks,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    refetch,
  };
}