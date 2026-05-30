"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/api.config";
import { selectOptimalModule, saveLastAccessedModule } from "@/utils/moduleAccessUtils";
import type { Course, CourseModule } from "../_components/types";

interface UseCourseDataReturn {
  courseData: Course | null;
  activeModule: CourseModule | null;
  setActiveModule: (module: CourseModule) => void;
  loading: boolean;
  error: boolean;
  refetch: () => void;
}

export function useCourseData(
  courseId: string | undefined,
  chapterId: string | undefined,
  moduleId: string | undefined,
): UseCourseDataReturn {
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchCourse = useCallback(() => {
    if (!courseId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError(false);

    axios
      .get(`${BACKEND_URL}/user/course/getfull/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const data: Course = res.data;
        setCourseData(data);

        if (!data.chapters || data.chapters.length === 0) {
          toast.error("This course has no content available");
          setLoading(false);
          return;
        }

        try {
          const selected = await selectOptimalModule({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            courseData: data as any,
            courseId: courseId,
            requestedModuleId: moduleId ? parseInt(moduleId) : undefined,
            requestedChapterId: chapterId ? parseInt(chapterId) : undefined,
          });

          let targetModule: CourseModule | null = null;
          for (const chapter of data.chapters) {
            for (const mod of chapter.modules) {
              if (mod.id === selected.moduleId && mod.chapter_id === selected.chapterId) {
                targetModule = mod;
                break;
              }
            }
            if (targetModule) break;
          }

          if (targetModule) {
            setActiveModule(targetModule);
            saveLastAccessedModule(courseId, targetModule.id, targetModule.chapter_id).catch(() => {});
          } else {
            const firstLive = data.chapters.find((ch) => ch.is_live);
            const fallback = firstLive?.modules?.[0] ?? null;
            if (fallback) {
              setActiveModule(fallback);
              saveLastAccessedModule(courseId, fallback.id, fallback.chapter_id).catch(() => {});
            } else {
              toast.error("Unable to load course content");
            }
          }
        } catch {
          const firstLive = data.chapters.find((ch) => ch.is_live);
          const fallback = firstLive?.modules?.[0] ?? null;
          if (fallback) {
            setActiveModule(fallback);
          } else {
            toast.error("Error loading module. Please try again.");
          }
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [courseId, chapterId, moduleId]);

  // Refresh course data in the background (after progress submit) without
  // touching the active module — the module is already set via goToModule.
  const refreshCourseData = useCallback(() => {
    if (!courseId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${BACKEND_URL}/user/course/getfull/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCourseData(res.data);
      })
      .catch(() => {});
  }, [courseId]);

  // Expose refreshCourseData via refetch so external callers (unlockChapter,
  // submitProgress) can pull a fresh snapshot without resetting the active module.
  const refetch = useCallback(() => {
    refreshCourseData();
  }, [refreshCourseData]);

  useEffect(() => {
    if (courseId) {
      fetchCourse();
    }
  }, [courseId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { courseData, activeModule, setActiveModule, loading, error, refetch };
}
