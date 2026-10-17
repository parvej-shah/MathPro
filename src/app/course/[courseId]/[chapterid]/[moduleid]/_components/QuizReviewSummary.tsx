"use client";

import { memo } from "react";
import { englishToBanglaNumbers } from "@/helpers";

export type QuizReviewFilter = "ALL" | "WRONG" | "CORRECT" | "SKIPPED";

interface QuizReviewSummaryProps {
  totalQuestionPoints: number;
  earnedQuestionPoints: number;
  earnedPercentage: number;
  totalQuestionsCount: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  filter: QuizReviewFilter;
  setFilter: (filter: QuizReviewFilter) => void;
  quizVerdict: boolean[];
  quizAnswer: Record<number, string>;
  onJumpToQuestion: (index: number) => void;
}

export const QuizReviewSummary = memo(function QuizReviewSummary({
  totalQuestionPoints,
  earnedQuestionPoints,
  earnedPercentage,
  totalQuestionsCount,
  correctCount,
  wrongCount,
  skippedCount,
  filter,
  setFilter,
  quizVerdict,
  quizAnswer,
  onJumpToQuestion,
}: QuizReviewSummaryProps) {
  const getMotivationalFeedback = (pct: number) => {
    if (pct >= 80) {
      return {
        badge: "🎉 চমৎকার!",
        title: "অসাধারণ ফলাফল!",
        desc: "তোমার প্রস্তুতি খুব ভালো হয়েছে। এভাবেই ধারাবাহিকতা বজায় রাখো!",
      };
    }
    if (pct >= 50) {
      return {
        badge: "👍 ভালো চেষ্টা!",
        title: "বেশ ভালো হয়েছে!",
        desc: "যে প্রশ্নগুলো ভুল হয়েছে, নিচের সমাধান ও ব্যাখ্যা দেখে সেগুলো ক্লিয়ার করে নাও।",
      };
    }
    return {
      badge: "💪 হাল ছেড়ো না!",
      title: "আরও অনুশীলন প্রয়োজন!",
      desc: "ভুলগুলো মনোযোগ দিয়ে দেখো এবং নিয়মগুলো রিভিশন দিয়ে আবার প্রস্তুত হও।",
    };
  };

  const feedback = getMotivationalFeedback(earnedPercentage);

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-border/70 bg-linear-to-b from-card to-card/50 shadow-md">
      {/* ── Top Hero Score Section ───────────────────────────────────── */}
      <div className="border-b border-border/50 p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Donut percentage ring */}
            <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  className="text-muted/30"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 15}`}
                  strokeDashoffset={`${2 * Math.PI * 15 * (1 - Math.min(Math.max(earnedPercentage, 0), 100) / 100)}`}
                  className={`transition-all duration-1000 ease-out ${earnedPercentage >= 50 ? "text-emerald-500" : "text-destructive"}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-extrabold text-foreground sm:text-lg">
                  {englishToBanglaNumbers(earnedPercentage)}%
                </span>
                <span className="text-[10px] text-muted-foreground">প্রাপ্তি</span>
              </div>
            </div>

            {/* Motivational Text & Points */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {feedback.badge}
              </div>
              <h4 className="text-lg font-bold text-foreground sm:text-xl">
                {feedback.title}
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                {feedback.desc}
              </p>
              <div className="mt-2.5 flex items-baseline gap-1.5 text-sm sm:text-base">
                <span className="text-muted-foreground">প্রাপ্ত মোট নম্বর:</span>
                <span className="text-lg font-extrabold text-primary sm:text-xl">
                  {englishToBanglaNumbers(earnedQuestionPoints)}
                </span>
                <span className="text-muted-foreground">
                  / {englishToBanglaNumbers(totalQuestionPoints)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 Quick Stats Badges ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 border-b border-border/40 bg-muted/20 p-3 sm:grid-cols-4 sm:gap-4 sm:p-5">
        {/* Total Questions */}
        <div className="rounded-xl border border-border/50 bg-background/60 p-3 text-center sm:p-4">
          <p className="text-lg font-extrabold text-foreground sm:text-2xl">
            {englishToBanglaNumbers(totalQuestionsCount)}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            মোট প্রশ্ন
          </p>
        </div>

        {/* Correct Answers */}
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-3 text-center sm:p-4">
          <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-2xl">
            {englishToBanglaNumbers(correctCount)}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            সঠিক উত্তর
          </p>
        </div>

        {/* Wrong Answers */}
        <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-center sm:p-4">
          <p className="text-lg font-extrabold text-destructive sm:text-2xl">
            {englishToBanglaNumbers(wrongCount)}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-destructive">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            ভুল উত্তর
          </p>
        </div>

        {/* Unanswered */}
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-center sm:p-4">
          <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400 sm:text-2xl">
            {englishToBanglaNumbers(skippedCount)}
          </p>
          <p className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            অনুত্তরিত
          </p>
        </div>
      </div>

      {/* ── Filters & Quick Jump Section ─────────────────────────────── */}
      <div className="p-4 sm:p-5">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground mr-1">ফিল্টার:</span>

          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === "ALL"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/60 bg-background/50 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            সবগুলো ({englishToBanglaNumbers(totalQuestionsCount)})
          </button>

          <button
            type="button"
            onClick={() => setFilter("WRONG")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === "WRONG"
                ? "bg-destructive text-white shadow-sm"
                : "border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/15"
            }`}
          >
            <span>ভুল উত্তরগুলো</span>
            <span>({englishToBanglaNumbers(wrongCount)})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter("CORRECT")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === "CORRECT"
                ? "bg-emerald-600 text-white shadow-sm"
                : "border border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15"
            }`}
          >
            <span>সঠিকগুলো</span>
            <span>({englishToBanglaNumbers(correctCount)})</span>
          </button>

          {skippedCount > 0 && (
            <button
              type="button"
              onClick={() => setFilter("SKIPPED")}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filter === "SKIPPED"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "border border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15"
              }`}
            >
              <span>অনুত্তরিত</span>
              <span>({englishToBanglaNumbers(skippedCount)})</span>
            </button>
          )}
        </div>

        {/* Quick Question Jump Matrix */}
        <div className="mt-4 border-t border-border/40 pt-3.5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              নির্দিষ্ট প্রশ্নে দ্রুত যাও:
            </span>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> সঠিক
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-destructive" /> ভুল
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> অনুত্তরিত
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {Array.from({ length: totalQuestionsCount }).map((_, index) => {
              const isSelected = quizAnswer[index] !== undefined && quizAnswer[index] !== "";
              const isCorrect = !!quizVerdict[index];
              const isWrong = isSelected && !isCorrect;

              let pillColor = "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25";
              if (isCorrect) {
                pillColor = "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/25";
              } else if (isWrong) {
                pillColor = "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/25";
              }

              return (
                <button
                  key={`jump-${index}`}
                  type="button"
                  onClick={() => onJumpToQuestion(index)}
                  title={`প্রশ্ন ${englishToBanglaNumbers(index + 1)} (${isCorrect ? "সঠিক" : isWrong ? "ভুল" : "অনুত্তরিত"})`}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-bold transition-all sm:h-8 sm:w-8 ${pillColor}`}
                >
                  {englishToBanglaNumbers(index + 1)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
