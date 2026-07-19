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
  /**
   * True once this attempt is underway. Drives the pre-exam start screen: the
   * quiz body stays hidden until the student presses শুরু করো.
   *
   * Derived from the stored timer entry on mount, not from a fresh piece of
   * state — a reload mid-attempt must resume, never re-show the start screen
   * (which would let a student reset the clock by refreshing).
   */
  quizStarted: boolean;
  startQuiz: () => void;
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

function removeTimer(moduleId: number) {
  try {
    localStorage.removeItem(timerKey(moduleId));
  } catch {
    // localStorage may be unavailable (SSR / privacy mode)
  }
}

export function useQuizTimer(
  activeModule: CourseModule | null,
  alreadySubmitted: boolean,
  onExpire: () => void,
  attemptChecked: boolean,
): UseQuizTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const activeModuleIdRef = useRef<number | null>(null);
  const totalTimeRef = useRef(0);
  useEffect(() => {
    activeModuleIdRef.current = activeModule?.id ?? null;
    totalTimeRef.current =
      activeModule?.quiz_time_limit && activeModule.quiz_time_limit > 0
        ? activeModule.quiz_time_limit * 60
        : 0;
  }, [activeModule?.id, activeModule?.quiz_time_limit]);

  // Stops the countdown interval only — used both on unmount/module-switch
  // (where the stored timer must survive so navigating back resumes the same
  // countdown) and on submit (see submitAndClearQuizTimer, which also drops
  // the stored entry).
  const clearQuizTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerActive(false);
  }, []);

  // A manual/auto submit stops the countdown AND drops the stored entry —
  // otherwise navigating back before the "already submitted" check resolves
  // reads the stale entry as expired and auto-submits again.
  const submitAndClearQuizTimer = useCallback(() => {
    clearQuizTimer();
    if (activeModuleIdRef.current != null) {
      removeTimer(activeModuleIdRef.current);
    }
  }, [clearQuizTimer]);

  const initTimer = useCallback((module: CourseModule) => {
    const moduleId = module.id;
    const totalTime = module.quiz_time_limit && module.quiz_time_limit > 0
      ? module.quiz_time_limit * 60
      : 0;

    // Already-submitted quizzes (server says so) show the reveal, no timer.
    // Also clears any stored timer left behind by a race where the countdown
    // started locally before the "already submitted" check came back from the
    // server (otherwise a later remount reads that stale entry as expired and
    // re-fires onExpire, re-submitting a quiz that's already been graded).
    if (alreadySubmitted) {
      removeTimer(moduleId);
      setTimeRemaining(0);
      setTimerActive(false);
      setTimerExpired(false);
      // Already-graded quizzes go straight to the reveal — the start screen is
      // only for a genuinely fresh attempt.
      setQuizStarted(true);
      return;
    }

    // Untimed quizzes still get the start screen (so the student sees question
    // count and marks first), they just never run a countdown.
    if (totalTime <= 0) {
      setTimeRemaining(0);
      setTimerActive(false);
      setTimerExpired(false);
      setQuizStarted(false);
      return;
    }

    const existing = readTimer(moduleId);
    if (existing && existing.totalTime > 0) {
      // An attempt is already underway — resume it rather than showing the
      // start screen, so reloading can't reset the clock.
      setQuizStarted(true);
      const elapsed = Math.floor(Date.now() / 1000) - existing.startTime;
      const remaining = existing.totalTime - elapsed;
      if (remaining <= 0) {
        // Remove immediately so a remount before the server's "already
        // submitted" check resolves doesn't read this same expired entry
        // again and re-fire onExpire (duplicate auto-submit).
        removeTimer(moduleId);
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
      // No stored attempt: show the start screen and hold the countdown until
      // startQuiz() fires. Previously the timer began here on mount, so merely
      // opening the module burned exam time.
      setTimeRemaining(totalTime);
      setTimerActive(false);
      setTimerExpired(false);
      setQuizStarted(false);
    }
  }, [alreadySubmitted, onExpire]);

  // Begins the attempt: writes the start timestamp (so a reload resumes) and
  // releases the countdown.
  const startQuiz = useCallback(() => {
    const moduleId = activeModuleIdRef.current;
    if (moduleId == null) return;
    setQuizStarted(true);

    const totalTime = totalTimeRef.current;
    if (totalTime <= 0) return; // untimed quiz — just reveal the questions

    writeTimer(moduleId, { startTime: Math.floor(Date.now() / 1000), totalTime });
    setTimeRemaining(totalTime);
    setTimerActive(true);
    setTimerExpired(false);
  }, []);

  // Initialize / tear down timer when the active module changes. Waits for
  // attemptChecked so we never start a fresh countdown before the server has
  // confirmed this quiz isn't already submitted — otherwise a quiz submitted
  // in an earlier visit gets a brand-new full-length timer during the async
  // gap, and if that gap outlasts the request (or it fails) the quiz gets
  // silently re-submitted when it expires.
  useEffect(() => {
    if (!attemptChecked) return;

    if (activeModule?.data?.category === "QUIZ" && activeModule.data?.quiz) {
      queueMicrotask(() => {
        initTimer(activeModule);
      });
    } else {
      queueMicrotask(() => {
        clearQuizTimer();
        setTimerExpired(false);
        setTimeRemaining(0);
        setQuizStarted(false);
      });
    }
    return () => { clearQuizTimer(); };
  }, [activeModule?.id, activeModule?.data?.category, activeModule?.quiz_time_limit, alreadySubmitted, attemptChecked]); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown tick
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          submitAndClearQuizTimer();
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
    quizStarted,
    startQuiz,
    formatTime,
    getTimerColor,
    // Exposed as "clearQuizTimer" to callers submitting the quiz — it stops
    // the countdown and drops the stored entry so it can't be replayed.
    clearQuizTimer: submitAndClearQuizTimer,
  };
}
