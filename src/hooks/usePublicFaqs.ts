"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { PublicFAQ } from "@/types/faq";

interface UsePublicFaqsResult {
  faqs: PublicFAQ[];
  loading: boolean;
  error: string | null;
}

export function usePublicFaqs(): UsePublicFaqsResult {
  const { data, isLoading, error } = useQuery({
    queryKey: ["faqs"],
    queryFn: async (): Promise<PublicFAQ[]> => {
      const response = await axios.get<{ success: boolean; data: PublicFAQ[] }>(
        `${BACKEND_URL}/user/faq/list`,
      );
      return Array.isArray(response.data?.data) ? response.data.data : [];
    },
    staleTime: 30 * 60 * 1000,
    retry: 1,
  });

  return {
    faqs: data || [],
    loading: isLoading,
    error: error ? "Failed to load FAQs" : null,
  };
}
