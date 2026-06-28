"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { PublicTestimonial } from "@/types/testimonial";
import type { Feedback } from "@/features/courses-page/_lib/types";

interface UsePublicTestimonialsResult {
  testimonials: PublicTestimonial[];
  loading: boolean;
  error: string | null;
}

export function mapPublicTestimonialsToFeedbacks(
  testimonials: PublicTestimonial[],
): Feedback[] {
  return testimonials.map((item) => ({
    name: item.user_name,
    bio: item.course_name || "MathPro Student",
    description: item.comment,
    imageUploadedLink: "",
  }));
}

export function usePublicTestimonials(): UsePublicTestimonialsResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["public-testimonials"],
    queryFn: async (): Promise<PublicTestimonial[]> => {
      const response = await axios.get<{ success: boolean; data: PublicTestimonial[] }>(
        `${BACKEND_URL}/user/testimonial/list`,
      );
      return Array.isArray(response.data?.data) ? response.data.data : [];
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  return {
    testimonials: data || [],
    loading: isLoading,
    error: error ? "Failed to load testimonials" : null,
  };
}
