import axios from "axios";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "@/api.config";
import type { Course, CoursesResponse } from "../_lib/types";

export function useFeaturedCourses() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses", "featured"],
    queryFn: async (): Promise<Course[]> => {
      const response = await axios.get<CoursesResponse>(
        `${BACKEND_URL}/user/course/featured`,
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch featured courses");
      }
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const featuredCourses = useMemo(() => data || [], [data]);

  return {
    featuredCourses,
    isLoading,
    error,
  };
}
