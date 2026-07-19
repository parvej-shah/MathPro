"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import type { CourseModule } from "../_components/types";

interface SubmitResult {
  score: number;
  answers: Record<number, string>;
  verdict: boolean[];
  submitted: boolean;
}

// The server rejects a second attempt with this message. Treated as "already
// graded" rather than a failure — the reveal is re-fetched instead of showing
// an error, since the student's attempt does exist, just not in this session.
const ALREADY_SUBMITTED = "Quiz already submitted";

interface UseQuizReturn {
  quizAnswer: Record<number, string>;
  setQuizAnswer: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  quizScore: number;
  quizVerdict: boolean[];
  showQuizAnswer: boolean;
  /** True once the server has answered whether this quiz was already submitted. */
  attemptChecked: boolean;
  justSubmitted: boolean;
  submitting: boolean;
  /** Bengali error message when a submit failed outright; null otherwise. */
  submitError: string | null;
  clearSubmitError: () => void;
  /** Grades on the server, persists the attempt, returns the server verdict. */
  submitQuiz: () => Promise<SubmitResult>;
}

export function useQuiz(
  activeModule: CourseModule | null,
  onProgressSubmit: (moduleId: number, score: number) => void,
): UseQuizReturn {
  const [quizAnswer, setQuizAnswer] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [quizVerdict, setQuizVerdict] = useState<boolean[]>([]);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [attemptChecked, setAttemptChecked] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Ref, not the `submitting` state: two buttons clicked in the same tick would
  // both read the pre-render state value and both fire.
  const submittingRef = useRef(false);

  // Reset quiz UI state whenever the active module changes, then ask the server
  // whether this student already submitted this quiz. Submitted-state, chosen
  // answers, and the verdict are owned by the backend (not localStorage), so a
  // reload / another device shows the same revealed answers.
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setQuizAnswer({});
      setQuizVerdict([]);
      setShowQuizAnswer(false);
      setAttemptChecked(false);
      setJustSubmitted(false);
      setQuizScore(0);
      setSubmitError(null);
    });

    const moduleId = activeModule?.id;
    if (!moduleId || activeModule?.data?.category !== "QUIZ") {
      return () => { cancelled = true; };
    }

    const token = localStorage.getItem("token");
    axios
      .get(`${BACKEND_URL}/user/module/quiz/${moduleId}/attempt`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data;
        if (data?.submitted) {
          setQuizScore(data.score ?? 0);
          setQuizAnswer(data.answers ?? {});
          setQuizVerdict(data.verdict ?? []);
          setShowQuizAnswer(true);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setAttemptChecked(true);
      });

    return () => { cancelled = true; };
  }, [activeModule?.id, activeModule?.data?.category]);

  const clearSubmitError = useCallback(() => { setSubmitError(null); }, []);

  // Submit answers to the server, which grades against the encrypted answer key
  // and persists the attempt. The returned verdict/score drive the reveal.
  const submitQuiz = useCallback(async (): Promise<SubmitResult> => {
    const moduleId = activeModule?.id;
    const empty: SubmitResult = { score: 0, answers: quizAnswer, verdict: [], submitted: false };
    if (!moduleId) return empty;

    // Guard against the two submit buttons (sticky bar + bottom) firing
    // concurrently, and against the timer expiring mid-submit — the second POST
    // would be rejected as a duplicate attempt.
    if (submittingRef.current || showQuizAnswer) return empty;
    submittingRef.current = true;

    setSubmitting(true);
    setSubmitError(null);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${BACKEND_URL}/user/module/quiz/${moduleId}/submit`,
        { answers: quizAnswer },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = res.data?.data ?? {};
      const score = data.score ?? 0;
      const verdict = data.verdict ?? [];

      setShowQuizAnswer(true);
      setQuizScore(score);
      setQuizVerdict(verdict);
      setJustSubmitted(true);

      onProgressSubmit(moduleId, score);
      return { score, answers: quizAnswer, verdict, submitted: true };
    } catch (err) {
      // A rejected duplicate attempt is not a failure: the quiz IS graded
      // server-side, this session just didn't know. Pull the stored attempt so
      // the student sees their result instead of a dead submit button.
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.error ?? err.response?.data?.message)
        : undefined;

      if (typeof message === "string" && message.includes(ALREADY_SUBMITTED)) {
        try {
          const res = await axios.get(
            `${BACKEND_URL}/user/module/quiz/${moduleId}/attempt`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          const data = res.data?.data;
          if (data?.submitted) {
            const score = data.score ?? 0;
            const verdict = data.verdict ?? [];
            setShowQuizAnswer(true);
            setQuizScore(score);
            setQuizAnswer(data.answers ?? {});
            setQuizVerdict(verdict);
            return { score, answers: data.answers ?? {}, verdict, submitted: true };
          }
        } catch {
          // fall through to the error result below
        }
      }

      setSubmitError("উত্তরপত্র জমা দেওয়া যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করো।");
      return empty;
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [activeModule?.id, quizAnswer, showQuizAnswer, onProgressSubmit]);

  return {
    quizAnswer,
    setQuizAnswer,
    quizScore,
    quizVerdict,
    showQuizAnswer,
    attemptChecked,
    justSubmitted,
    submitting,
    submitError,
    clearSubmitError,
    submitQuiz,
  };
}
