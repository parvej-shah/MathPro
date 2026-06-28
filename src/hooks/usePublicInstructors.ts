"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import type { Instructor } from "@/features/courses-page/_lib/types";

interface UsePublicInstructorsResult {
  instructors: Instructor[];
  loading: boolean;
}

export function usePublicInstructors(): UsePublicInstructorsResult {
  const { data, isLoading } = useQuery({
    queryKey: ["instructors"],
    queryFn: async (): Promise<Instructor[]> => {
      const response = await axios.get<{ success: boolean; data: Instructor[] }>(
        `${BACKEND_URL}/user/instructor/list`,
      );
      return Array.isArray(response.data?.data) ? response.data.data : [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
  });

  return {
    instructors: data || [],
    loading: isLoading,
  };
}
