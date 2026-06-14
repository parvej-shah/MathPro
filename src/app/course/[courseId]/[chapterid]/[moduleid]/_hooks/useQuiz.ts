"use client";

import { useState, useCallback, useEffect } from "react";
import { decryptString } from "@/helpers";
import type { CourseModule, QuizQuestionData } from "../_components/types";

interface UseQuizReturn {
  quizAnswer: Record<number, string>;
  setQuizAnswer: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  quizScore: number;
  quizVerdict: boolean[];
  showQuizAnswer: boolean;
  justSubmitted: boolean;
  submitQuiz: () => { score: number; answers: Record<number, string>; verdict: boolean[] };
  restoreFromTimer: (score: number, answers: Record<number, string>, verdict: boolean[]) => void;
}

export function useQuiz(
  activeModule: CourseModule | null,
  onProgressSubmit: (moduleId: number, score: number) => void,
): UseQuizReturn {
  const [quizAnswer, setQuizAnswer] = useState<Record<number, string>>({});
  const [quizScore, setQuizScore] = useState(0);
  const [quizVerdict, setQuizVerdict] = useState<boolean[]>([]);
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  // Reset quiz UI state whenever the active module changes
  useEffect(() => {
    queueMicrotask(() => {
      setQuizAnswer({});
      setQuizVerdict([]);
      setShowQuizAnswer(false);
      setJustSubmitted(false);
      setQuizScore(0);
    });
  }, [activeModule?.id]);

  const submitQuiz = useCallback((): { score: number; answers: Record<number, string>; verdict: boolean[] } => {
    const quizes = (activeModule?.data?.quiz as QuizQuestionData[]) ?? [];
    const verdict: boolean[] = [];
    let acceptedPoints = 0;
    let totalPoints = 0;
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "";

    quizes.forEach((quiz, index: number) => {
      const questionPoints = typeof quiz.points === "number" && quiz.points > 0
        ? quiz.points
        : 1;
      totalPoints += questionPoints;

      const decrypted = decryptString(
        quiz.answer || quiz.correct_answer || "",
        secretKey,
      );
      if (decrypted === quizAnswer[index]) {
        verdict.push(true);
        acceptedPoints += questionPoints;
      } else {
        verdict.push(false);
      }
    });

    const realScore = totalPoints > 0
      ? (acceptedPoints / totalPoints) * (activeModule?.score ?? 0)
      : 0;

    setShowQuizAnswer(true);
    setQuizScore(realScore);
    setQuizVerdict(verdict);
    setJustSubmitted(true);

    if (activeModule?.id != null) {
      onProgressSubmit(activeModule.id, realScore);
    }

    return { score: realScore, answers: quizAnswer, verdict };
  }, [activeModule, quizAnswer, onProgressSubmit]);

  // Called by the page after useQuizTimer detects a previously-submitted quiz
  // on reload — restore the persisted results directly into quiz state.
  const restoreFromTimer = useCallback((
    score: number,
    answers: Record<number, string>,
    verdict: boolean[],
  ) => {
    setQuizScore(score);
    setQuizAnswer(answers);
    setQuizVerdict(verdict);
    setShowQuizAnswer(true);
    setJustSubmitted(false);
  }, []);

  return {
    quizAnswer,
    setQuizAnswer,
    quizScore,
    quizVerdict,
    showQuizAnswer,
    justSubmitted,
    submitQuiz,
    restoreFromTimer,
  };
}
