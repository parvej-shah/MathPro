"use client";

import { useState, useCallback, useEffect } from "react";
import { decryptString } from "@/helpers";
import type { CourseModule } from "../_components/types";

interface UseQuizReturn {
  quizAnswer: Record<number, string>;
  setQuizAnswer: (answers: Record<number, string>) => void;
  quizScore: number;
  quizVerdict: boolean[];
  showQuizAnswer: boolean;
  justSubmitted: boolean;
  submitQuiz: () => { score: number; answers: Record<number, string>; verdict: boolean[] };
  retakeQuiz: () => void;
  restoreFromTimer: (score: number, answers: Record<number, string>, verdict: boolean[]) => void;
  resetQuizState: () => void;
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
    setQuizAnswer({});
    setQuizVerdict([]);
    setShowQuizAnswer(false);
    setJustSubmitted(false);
    setQuizScore(0);
  }, [activeModule?.id]);

  const submitQuiz = useCallback((): { score: number; answers: Record<number, string>; verdict: boolean[] } => {
    const quizes = (activeModule?.data?.quiz as any[]) ?? [];
    const verdict: boolean[] = [];
    let accepted = 0;

    quizes.forEach((quiz: any, index: number) => {
      const decrypted = decryptString(
        quiz.answer || quiz.correct_answer,
        process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ,
      );
      if (decrypted === quizAnswer[index]) {
        verdict.push(true);
        accepted++;
      } else {
        verdict.push(false);
      }
    });

    const realScore = quizes.length > 0 ? (accepted / quizes.length) * (activeModule?.score ?? 0) : 0;

    setShowQuizAnswer(true);
    setQuizScore(realScore);
    setQuizVerdict(verdict);
    setJustSubmitted(true);

    if (activeModule?.id != null) {
      onProgressSubmit(activeModule.id, realScore);
    }

    return { score: realScore, answers: quizAnswer, verdict };
  }, [activeModule, quizAnswer, onProgressSubmit]);

  const retakeQuiz = useCallback(() => {
    setQuizAnswer({});
    setQuizVerdict([]);
    setShowQuizAnswer(false);
    setQuizScore(0);
    setJustSubmitted(false);
  }, []);

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

  const resetQuizState = useCallback(() => {
    setQuizAnswer({});
    setQuizVerdict([]);
    setShowQuizAnswer(false);
    setQuizScore(0);
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
    retakeQuiz,
    restoreFromTimer,
    resetQuizState,
  };
}
