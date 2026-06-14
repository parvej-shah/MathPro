"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { PublicFAQ } from "@/types/faq";

interface UsePublicFaqsResult {
  faqs: PublicFAQ[];
  loading: boolean;
  error: string | null;
}

export function usePublicFaqs(): UsePublicFaqsResult {
  const [faqs, setFaqs] = useState<PublicFAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ success: boolean; data: PublicFAQ[] }>(
          `${BACKEND_URL}/user/faq/list`,
        );

        if (!active) return;

        setFaqs(Array.isArray(response.data?.data) ? response.data.data : []);
        setError(null);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load public FAQs", err);
        setFaqs([]);
        setError("Failed to load FAQs");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchFaqs();

    return () => {
      active = false;
    };
  }, []);

  return { faqs, loading, error };
}
