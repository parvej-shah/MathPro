import { useMemo, useState } from "react";
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
  CourseCategory,
  DirectoryResponse,
} from "../_lib/types";
import { getStatSections } from "@/features/course-details/_lib/chips";
import { useFeaturedCourses } from "./useFeaturedCourses";
import {
  bundleMatchesCategory,
  getCategoryTagSet,
} from "../_lib/tagUtils";

/**
 * Extract number from Bengali/English mixed strings
 * Examples: "10 টি" -> 10, "40+" -> 40, "100+ ঘণ্টা" -> 100
 */
const extractNumber = (value: string | undefined): number => {
  if (!value) return 0;
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export function useCoursesPage(initialCategory?: string | null) {
  const [searchTerm, setSearchTerm] = useState("");
  const [manualSelectedCategory, setSelectedCategory] = useState<string | null>(null);
  const {
    featuredCourses,
    isLoading: featuredCoursesLoading,
  } = useFeaturedCourses();
  
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

  // Server-side category grouping for the directory layout (COURSE_DIRECTORY_API_SPEC.md).
  const { data: directoryData } = useQuery({
    queryKey: ["course-directory"],
    queryFn: async (): Promise<CourseCategory[]> => {
      const response = await axios.get<DirectoryResponse>(
        `${BACKEND_URL}/user/course/directory`,
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch course directory");
      }
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const courseCategories: CourseCategory[] = useMemo(
    () => directoryData || [],
    [directoryData],
  );

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

  const bundles: Bundle[] = useMemo(() => {
    const rawBundles = bundlesData || [];
    return rawBundles.map((bundle) => {
      const normalizedUrl = bundle.url?.startsWith("/bundle/")
        ? bundle.url.replace("/bundle/", "/combos/")
        : bundle.url;
      return {
        ...bundle,
        url: normalizedUrl,
      };
    });
  }, [bundlesData]);

  const loading =
    coursesLoading || instructorsLoading || bundlesLoading || featuredCoursesLoading;
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

    // chips.sections is now a flat [{label,value}] array (frontend-guide-user.md §4).
    // Match the relevant stat by its Bengali/English label, then extract its number.
    const sumByLabel = (needles: string[]) =>
      courses.reduce((sum, c) => {
        const sec = getStatSections(c.chips).find((s) =>
          needles.some((n) => s.label.toLowerCase().includes(n)),
        );
        return sum + extractNumber(sec ? String(sec.value) : undefined);
      }, 0);

    const totalLiveClasses = sumByLabel(["লাইভ", "live"]);
    const totalRecordedVideos = sumByLabel(["ভিডিও", "video"]);

    // Return calculated values (no fallback when courses exist)
    return {
      totalStudents: totalStudents,
      totalCourses: totalCourses,
      averageRating: 4.8, // Static as no rating data available
      totalLiveClasses: totalLiveClasses,
      totalRecordedVideos: totalRecordedVideos,
    };
  }, [courses]);

  const CATEGORY_PREFIX = "cat-";

  // Get categories for filtering: "all", "Combo", and one tab per course directory category.
  const categories = useMemo(() => {
    const total = courses.length + bundles.length;

    const tabs = [
      { id: "all", label: "সব কোর্স", count: total },
      { id: "bundles", label: "Combo", count: bundles.length },
    ];

    courseCategories.forEach((cat) => {
      const categoryTags = getCategoryTagSet(cat);
      const matchingBundles = bundles.filter((bundle) =>
        bundleMatchesCategory(
          bundle,
          new Set(cat.courses.map((course) => course.id)),
          categoryTags,
        ),
      ).length;
      tabs.push({
        id: `${CATEGORY_PREFIX}${cat.slug}`,
        label: cat.category_name,
        count: cat.courses.length + matchingBundles,
      });
    });

    return tabs;
  }, [courses, bundles, courseCategories]);

  const selectedCategory = useMemo(() => {
    if (manualSelectedCategory) {
      return manualSelectedCategory;
    }

    if (!initialCategory) {
      return "all";
    }

    const normalizedCategory = initialCategory.trim().toLowerCase();
    const matchedCategory = categories.find((category) => {
      const normalizedId = category.id.toLowerCase();
      const normalizedLabel = category.label.trim().toLowerCase();
      const normalizedSlug = normalizedId.startsWith(CATEGORY_PREFIX)
        ? normalizedId.slice(CATEGORY_PREFIX.length)
        : normalizedId;

      return (
        normalizedId === normalizedCategory ||
        normalizedLabel === normalizedCategory ||
        normalizedSlug === normalizedCategory
      );
    });

    return matchedCategory?.id || "all";
  }, [categories, initialCategory, manualSelectedCategory]);

  // Category-tab selection is keyed as `cat-${slug}` for directory categories.
  const activeCategorySlug = selectedCategory.startsWith(CATEGORY_PREFIX)
    ? selectedCategory.slice(CATEGORY_PREFIX.length)
    : null;

  // Course ids belonging to the currently selected directory category (if any).
  const activeCategoryCourseIds = useMemo(() => {
    if (!activeCategorySlug) return null;
    const category = courseCategories.find((cat) => cat.slug === activeCategorySlug);
    return category ? new Set(category.courses.map((c) => c.id)) : new Set<number>();
  }, [courseCategories, activeCategorySlug]);

  const activeCategoryTags = useMemo(() => {
    if (!activeCategorySlug) return null;
    const category = courseCategories.find((cat) => cat.slug === activeCategorySlug);
    return getCategoryTagSet(category);
  }, [courseCategories, activeCategorySlug]);

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
        (activeCategoryCourseIds !== null && activeCategoryCourseIds.has(course.id));

      return matchesSearch && matchesCategory;
    });
  }, [courses, debouncedSearchTerm, selectedCategory, activeCategoryCourseIds]);

  // Filter bundles based on search and category (using debounced search)
  const filteredBundles = useMemo(() => {
    return bundles.filter((bundle) => {
      const matchesSearch =
        debouncedSearchTerm === "" ||
        bundle.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        bundle.short_description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        selectedCategory === "bundles" ||
        bundleMatchesCategory(bundle, activeCategoryCourseIds, activeCategoryTags);

      return matchesSearch && matchesCategory;
    });
  }, [bundles, debouncedSearchTerm, selectedCategory, activeCategoryCourseIds, activeCategoryTags]);

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
    featuredCourses,
    categories,
    courseCategories,
    allFeedbacks,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    refetch,
  };
}
