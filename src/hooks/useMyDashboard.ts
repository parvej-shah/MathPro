import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../api.config";
import type { NewChips } from "@/features/course-details/_lib/chips";

/**
 * Dashboard course listing from GET /user/course/my-dashboard.
 * Purpose-built for the dashboard cards: enrolled courses + purchased bundles
 * with thumbnail (via chips), slug, instructor, and progress — decoupled from the
 * billing data in /payment/history. See DASHBOARD_MY_COURSES_API_SPEC.md.
 */

export interface MyDashboardCourse {
  id: number;
  title: string;
  slug: string | null;
  short_description: string | null;
  chips: NewChips | null;
  tags: string[] | null;
  instructor_list: { instructors?: Array<{ name: string }> } | null;
  is_live: boolean;
  intro_video: string | null;
  enrollment_date: number;
  total_modules: number;
  completed_modules: number;
  last_accessed: number | null;
  progress_percentage: number;
}

export interface MyDashboardBundleCourse {
  id: number;
  title: string;
  slug: string | null;
  chips: NewChips | null;
  instructor_list: { instructors?: Array<{ name: string }> } | null;
  total_modules: number;
  completed_modules: number;
  progress_percentage: number;
}

export interface MyDashboardBundle {
  id: number;
  title: string;
  short_description: string | null;
  chips: NewChips | null;
  intro_video: string | null;
  is_live: boolean;
  purchase_date: number;
  courses: MyDashboardBundleCourse[];
}

export interface MyDashboardData {
  individual_courses: MyDashboardCourse[];
  bundle_purchases: MyDashboardBundle[];
}

export const useMyDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-dashboard"],
    queryFn: async (): Promise<MyDashboardData> => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const response = await axios.get<{ success: boolean; data: MyDashboardData }>(
        `${BACKEND_URL}/user/course/my-dashboard`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch dashboard courses");
      }
      return response.data.data;
    },
    enabled: typeof window !== "undefined",
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  return {
    data: data || null,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  };
};
