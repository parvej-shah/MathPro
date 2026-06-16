"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import type { Instructor } from "@/features/courses-page/_lib/types";

interface UsePublicInstructorsResult {
  instructors: Instructor[];
  loading: boolean;
}

export function usePublicInstructors(): UsePublicInstructorsResult {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    axios
      .get<{ success: boolean; data: Instructor[] }>(
        `${BACKEND_URL}/user/instructor/list`,
      )
      .then((res) => {
        if (!active) return;
        setInstructors(Array.isArray(res.data?.data) ? res.data.data : []);
      })
      .catch(() => {
        if (active) setInstructors([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { instructors, loading };
}
