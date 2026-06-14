import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../api.config";
import type {
  CourseCategory,
  DirectoryResponse,
} from "@/features/courses-page/_lib/types";

/**
 * Grouped course directory (category -> courses) from
 * GET /user/course/directory. See COURSE_DIRECTORY_API_SPEC.md.
 * Powers the homepage and the /courses page category sections.
 */
export const useCourseDirectory = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, isLoading, error } = useQuery({
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
    enabled: mounted,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  return {
    categories: data || [],
    loading: !mounted || isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  };
};

export type { CourseCategory };
