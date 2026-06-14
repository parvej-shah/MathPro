"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { CourseModule } from "../_components/types";

interface StoredTimer {
  startTime: number;
  totalTime: number;
  submitted: boolean;
  quizScore?: number;
  quizAnswer?: Record<number, string>;
  quizVerdict?: boolean[];
}

interface RestoredSubmission {
  quizScore: number;
  quizAnswer: Record<number, string>;
  quizVerdict: boolean[];
}

interface UseQuizTimerReturn {
  timeRemaining: number;
  timerActive: boolean;
  timerExpired: boolean;
  formatTime: (seconds: number) => string;
  getTimerColor: (remaining: number, total: number) => string;
  clearQuizTimer: () => void;
  persistSubmission: (moduleId: number, score: number, answers: Record<number, string>, verdict: boolean[]) => void;
  /** Non-null when the quiz was previously submitted and the page reloaded. */
  restoredSubmission: RestoredSubmission | null;
}

function timerKey(moduleId: number) {
  return `quiz_timer_${moduleId}`;
}

function readTimer(moduleId: number): StoredTimer | null {
  try {
    const raw = localStorage.getItem(timerKey(moduleId));
    return raw ? (JSON.parse(raw) as StoredTimer) : null;
  } catch {
    return null;
  }
}

function writeTimer(moduleId: number, data: StoredTimer) {
  try {
    localStorage.setItem(timerKey(moduleId), JSON.stringify(data));
  } catch {
    // localStorage may be unavailable (SSR / privacy mode)
  }
}

export function useQuizTimer(
  activeModule: CourseModule | null,
  onExpire: () => RestoredSubmission | null,
): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [restoredSubmission, setRestoredSubmission] = useState<RestoredSubmission | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearQuizTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  }, []);

  const persistSubmission = useCallback((
    moduleId: number,
    score: number,
    answers: Record<number, string>,
    verdict: boolean[],
  ) => {
    const existing = readTimer(moduleId);
    writeTimer(moduleId, {
      startTime: existing?.startTime ?? Math.floor(Date.now() / 1000),
      totalTime: existing?.totalTime ?? 0,
      submitted: true,
      quizScore: score,
      quizAnswer: answers,
      quizVerdict: verdict,
    });
  }, []);

  const initTimer = useCallback((module: CourseModule) => {
    const moduleId = module.id;
    const totalTime = module.quiz_time_limit && module.quiz_time_limit > 0
      ? module.quiz_time_limit * 60
      : 0;
    const existing = readTimer(moduleId);

    if (existing) {
      if (existing.submitted) {
        // Quiz was already submitted — restore results, don't show timer
        setTimerExpired(false);
        setTimerActive(false);
        setRestoredSubmission({
          quizScore: existing.quizScore ?? 0,
          quizAnswer: existing.quizAnswer ?? {},
          quizVerdict: existing.quizVerdict ?? [],
        });
        return;
      }

      if (existing.totalTime <= 0 || totalTime <= 0) {
        setTimeRemaining(0);
        setTimerActive(false);
        setTimerExpired(false);
        setRestoredSubmission(null);
        return;
      }

      const elapsed = Math.floor(Date.now() / 1000) - existing.startTime;
      const remaining = existing.totalTime - elapsed;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setTimerExpired(true);
        setTimerActive(false);
        const submission = onExpire();
        if (submission) {
          persistSubmission(
            moduleId,
            submission.quizScore,
            submission.quizAnswer,
            submission.quizVerdict,
          );
        } else {
          writeTimer(moduleId, { ...existing, submitted: true });
        }
      } else {
        setTimeRemaining(remaining);
        setTimerActive(true);
        setTimerExpired(false);
        setRestoredSubmission(null);
      }
    } else if (totalTime > 0) {
      const startTime = Math.floor(Date.now() / 1000);
      writeTimer(moduleId, { startTime, totalTime, submitted: false });
      setTimeRemaining(totalTime);
      setTimerActive(true);
      setTimerExpired(false);
      setRestoredSubmission(null);
    } else {
      setTimeRemaining(0);
      setTimerActive(false);
      setTimerExpired(false);
      setRestoredSubmission(null);
    }
  }, [onExpire, persistSubmission]);

  // Initialize / tear down timer when the active module changes
  useEffect(() => {
    if (activeModule?.data?.category === "QUIZ" && activeModule.data?.quiz) {
      queueMicrotask(() => {
        initTimer(activeModule);
      });
    } else {
      queueMicrotask(() => {
        clearQuizTimer();
        setTimerExpired(false);
        setRestoredSubmission(null);
        setTimeRemaining(0);
      });
    }
    return () => { clearQuizTimer(); };
  }, [activeModule?.id, activeModule?.data?.category, activeModule?.quiz_time_limit]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown tick
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearQuizTimer();
          setTimerExpired(true);
          if (activeModule?.id) {
            const submission = onExpire();
            if (submission) {
              persistSubmission(
                activeModule.id,
                submission.quizScore,
                submission.quizAnswer,
                submission.quizVerdict,
              );
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive, activeModule?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  const getTimerColor = useCallback((remaining: number, total: number): string => {
    const pct = total > 0 ? (remaining / total) * 100 : 0;
    if (pct > 50) return "#10b981";
    if (pct > 20) return "#f59e0b";
    return "#ef4444";
  }, []);

  return {
    timeRemaining,
    timerActive,
    timerExpired,
    formatTime,
    getTimerColor,
    clearQuizTimer,
    persistSubmission,
    restoredSubmission,
  };
}
