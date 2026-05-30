"use client";

import { useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BACKEND_URL } from "@/api.config";
import { useUpdateStreak } from "@/hooks/useStreak";
import type { Course, CourseModule } from "../_components/types";

function findModuleById(courseData: Course, moduleId: number): CourseModule | undefined {
  for (const chapter of courseData.chapters) {
    const found = chapter.modules.find((m) => m.id === moduleId);
    if (found) return found;
  }
  return undefined;
}

function shouldShowStreakToday(): boolean {
  const today = new Date().toDateString();
  return localStorage.getItem("lastStreakNotificationDate") !== today;
}

function markStreakShown() {
  localStorage.setItem("lastStreakNotificationDate", new Date().toDateString());
}

interface UseModuleProgressReturn {
  submitProgress: (moduleId: number, score: number, courseDataOverride?: Course) => void;
}

export function useModuleProgress(
  courseId: string | undefined,
  courseData: Course | null,
  activeModule: CourseModule | null,
  onCourseRefresh: () => void,
  onScoreTrigger: () => void,
): UseModuleProgressReturn {
  const { updateStreakAsync } = useUpdateStreak();

  const submitProgress = useCallback((
    moduleId: number,
    score: number,
    courseDataOverride?: Course,
  ) => {
    const token = localStorage.getItem("token");
    const source = courseDataOverride ?? courseData;
    if (!source) return;

    const mod = findModuleById(source, moduleId);
    if (!mod || !mod.is_live) return;

    const category = activeModule?.data?.category ?? "";

    axios
      .post(
        `${BACKEND_URL}/user/module/addProgress/${moduleId}?points=${score}&type=${category}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        if (courseId) {
          updateStreakAsync(courseId)
            .then((streakData) => {
              if (shouldShowStreakToday()) {
                if (streakData?.isNewRecord) {
                  toast.success(`🎉 New streak record: ${streakData.currentStreak} days!`, { duration: 4000 });
                  markStreakShown();
                } else if (streakData?.currentStreak && streakData.currentStreak > 1) {
                  toast.success(`🔥 ${streakData.currentStreak} day streak!`, { duration: 3000 });
                  markStreakShown();
                }
              }
            })
            .catch(() => {});
        }

        onCourseRefresh();
        onScoreTrigger();
      })
      .catch(() => {});
  }, [courseId, courseData, activeModule, updateStreakAsync, onCourseRefresh, onScoreTrigger]);

  return { submitProgress };
}
