"use client";

import { useEffect, useState } from "react";
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
  const [testimonials, setTestimonials] = useState<PublicTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await axios.get<{ success: boolean; data: PublicTestimonial[] }>(
          `${BACKEND_URL}/user/testimonial/list`,
        );

        if (!active) return;

        setTestimonials(Array.isArray(response.data?.data) ? response.data.data : []);
        setError(null);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load public testimonials", err);
        setTestimonials([]);
        setError("Failed to load testimonials");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchTestimonials();

    return () => {
      active = false;
    };
  }, []);

  return { testimonials, loading, error };
}
