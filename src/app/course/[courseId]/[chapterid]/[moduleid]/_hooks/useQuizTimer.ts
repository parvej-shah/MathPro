"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { CourseModule } from "../_components/types";

// Only the countdown is local. Submitted-state, answers, and verdict are owned
// by the backend (see useQuiz). localStorage here just remembers when a timed
// quiz was started so a reload resumes the same countdown instead of restarting.
interface StoredTimer {
  startTime: number;
  totalTime: number;
}

interface UseQuizTimerReturn {
  timeRemaining: number;
  timerActive: boolean;
  timerExpired: boolean;
  formatTime: (seconds: number) => string;
  getTimerColor: (remaining: number, total: number) => string;
  clearQuizTimer: () => void;
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
  alreadySubmitted: boolean,
  onExpire: () => void,
): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearQuizTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  }, []);

  const initTimer = useCallback((module: CourseModule) => {
    const moduleId = module.id;
    const totalTime = module.quiz_time_limit && module.quiz_time_limit > 0
      ? module.quiz_time_limit * 60
      : 0;

    // Already-submitted quizzes (server says so) show the reveal, no timer.
    if (alreadySubmitted) {
      setTimeRemaining(0);
      setTimerActive(false);
      setTimerExpired(false);
      return;
    }

    if (totalTime <= 0) {
      setTimeRemaining(0);
      setTimerActive(false);
      setTimerExpired(false);
      return;
    }

    const existing = readTimer(moduleId);
    if (existing && existing.totalTime > 0) {
      const elapsed = Math.floor(Date.now() / 1000) - existing.startTime;
      const remaining = existing.totalTime - elapsed;
      if (remaining <= 0) {
        setTimeRemaining(0);
        setTimerExpired(true);
        setTimerActive(false);
        onExpire();
      } else {
        setTimeRemaining(remaining);
        setTimerActive(true);
        setTimerExpired(false);
      }
    } else {
      const startTime = Math.floor(Date.now() / 1000);
      writeTimer(moduleId, { startTime, totalTime });
      setTimeRemaining(totalTime);
      setTimerActive(true);
      setTimerExpired(false);
    }
  }, [alreadySubmitted, onExpire]);

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
        setTimeRemaining(0);
      });
    }
    return () => { clearQuizTimer(); };
  }, [activeModule?.id, activeModule?.data?.category, activeModule?.quiz_time_limit, alreadySubmitted]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown tick
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearQuizTimer();
          setTimerExpired(true);
          onExpire();
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
  };
}
