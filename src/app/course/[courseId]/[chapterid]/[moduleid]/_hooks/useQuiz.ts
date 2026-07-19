"use client";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import type { CourseModule } from "../_components/types";

interface SubmitResult {
  score: number;
  answers: Record<number, string>;
  verdict: boolean[];
  submitted: boolean;
}

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

  // Submit answers to the server, which grades against the encrypted answer key
  // and persists the attempt. The returned verdict/score drive the reveal.
  const submitQuiz = useCallback(async (): Promise<SubmitResult> => {
    const moduleId = activeModule?.id;
    const empty: SubmitResult = { score: 0, answers: quizAnswer, verdict: [], submitted: false };
    if (!moduleId) return empty;

    setSubmitting(true);
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
    } catch {
      return empty;
    } finally {
      setSubmitting(false);
    }
  }, [activeModule?.id, quizAnswer, onProgressSubmit]);

  return {
    quizAnswer,
    setQuizAnswer,
    quizScore,
    quizVerdict,
    showQuizAnswer,
    attemptChecked,
    justSubmitted,
    submitting,
    submitQuiz,
  };
}
