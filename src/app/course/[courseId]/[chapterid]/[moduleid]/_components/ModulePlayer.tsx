"use client";

import { memo, useState, useCallback } from "react";
import ReactYoutubePlayer from "@/components/ReactYoutubePlayer";
import ModuleUpcoming from "@/components/ModuleUpcoming";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";
import { RichFieldRenderer } from "@/components/RichFieldRenderer";
import { decryptString, englishToBanglaNumbers } from "@/helpers";
import { QuizReviewSummary, type QuizReviewFilter } from "./QuizReviewSummary";
import type { CourseModule, QuizQuestionData } from "./types";

// Option labels for the answer pills (ক, খ, গ, ঘ, ঙ …). Falls back to the
// number for quizzes authored with more options than we have letters.
const OPTION_LABELS = ["ক", "খ", "গ", "ঘ", "ঙ", "চ", "ছ", "জ"];

// Wide KaTeX block math renders as a fixed-width block that does not wrap. On a
// phone that overflows the card, and because the page ancestors use
// overflow-x-clip it gets silently cut off rather than scrolled. Scoped to the
// quiz body: let the math scroll inside its own box, and keep long unbroken
// option text from pushing the row wide.
const MATH_OVERFLOW =
  "break-words [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1 [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto";

interface ModulePlayerProps {
  activeModule: CourseModule;
  initialTime?: number;
  // quiz state
  quizAnswer: Record<number, string>;
  setQuizAnswer: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  quizVerdict: boolean[];
  showQuizAnswer: boolean;
  /** True once the server has answered whether this quiz was already submitted. */
  attemptChecked: boolean;
  justSubmitted: boolean;
  submitting: boolean;
  submitError: string | null;
  clearSubmitError: () => void;
  timeRemaining: number;
  timerActive: boolean;
  timerExpired: boolean;
  quizStarted: boolean;
  startQuiz: () => void;
  formatTime: (s: number) => string;
  getTimerColor: (remaining: number, total: number) => string;
  submitQuiz: () => void | Promise<void>;
}

const ModulePlayer = memo(function ModulePlayer({
  activeModule,
  initialTime,
  quizAnswer,
  setQuizAnswer,
  quizVerdict,
  showQuizAnswer,
  attemptChecked,
  justSubmitted,
  submitting,
  submitError,
  clearSubmitError,
  timeRemaining,
  timerActive,
  timerExpired,
  quizStarted,
  startQuiz,
  formatTime,
  getTimerColor,
  submitQuiz,
}: ModulePlayerProps) {
  const category = activeModule?.data?.category;
  const quizQuestions = (activeModule?.data?.quiz as QuizQuestionData[] | undefined) ?? [];
  const totalTime = activeModule?.quiz_time_limit && activeModule.quiz_time_limit > 0
    ? activeModule.quiz_time_limit * 60
    : 0;
  const totalQuestionPoints = quizQuestions.reduce((sum, quiz) => {
    const points = typeof quiz.points === "number" && quiz.points > 0 ? quiz.points : 1;
    return sum + points;
  }, 0);
  const earnedQuestionPoints = quizQuestions.reduce((sum, quiz, index) => {
    if (!quizVerdict[index]) return sum;
    const points = typeof quiz.points === "number" && quiz.points > 0 ? quiz.points : 1;
    return sum + points;
  }, 0);
  const earnedPercentage = totalQuestionPoints > 0
    ? Math.round((earnedQuestionPoints / totalQuestionPoints) * 100)
    : 0;

  const answeredCount = quizQuestions.reduce(
    (sum, _quiz, index) => (quizAnswer[index] ? sum + 1 : sum),
    0,
  );

  const correctCount = quizQuestions.filter((_, i) => !!quizVerdict[i]).length;
  const wrongCount = quizQuestions.filter(
    (_, i) => quizAnswer[i] !== undefined && quizAnswer[i] !== "" && !quizVerdict[i],
  ).length;
  const skippedCount = quizQuestions.filter(
    (_, i) => quizAnswer[i] === undefined || quizAnswer[i] === "",
  ).length;

  const [reviewFilter, setReviewFilter] = useState<QuizReviewFilter>("ALL");

  const handleJumpToQuestion = useCallback((index: number) => {
    setReviewFilter("ALL");
    setTimeout(() => {
      const el = document.getElementById(`quiz-question-${index}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary");
        setTimeout(() => {
          el.classList.remove("ring-2", "ring-primary");
        }, 1500);
      }
    }, 50);
  }, []);

  const liveStatus = activeModule?.live_status;
  const isLiveOverlay = liveStatus === "LIVE" || liveStatus === "SCHEDULED";

  // Submitting is irreversible (one attempt only), so both submit buttons route
  // through a confirm step that names how many questions are still unanswered.
  const [confirmOpen, setConfirmOpen] = useState(false);
  const unansweredCount = quizQuestions.length - answeredCount;

  // Attempts made before the quiz_attempt table existed have a score but no
  // stored answers/verdict. Rendering that as a normal reveal would mark every
  // question wrong and show 0% — show the "already submitted" notice instead.
  const isLegacyAttempt =
    showQuizAnswer && !justSubmitted && quizQuestions.length > 0 && quizVerdict.length === 0;

  return (
    <div className="mt-8">
      {/* Module Title */}
      <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-4">
        {activeModule?.title}
      </h3>

      {/* Quiz description — rendered as rich text right below the title */}
      {category === "QUIZ" && activeModule?.description && activeModule.description.trim() !== "" && (
        <SafeHtmlRenderer
          content={activeModule.description}
          className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground mb-6"
        />
      )}

      {/* ── LIVE CLASS (replaces the video player while scheduled/live) ──── */}
      {category === "VIDEO" && isLiveOverlay && (
        <div className="rounded-xl border border-primary/30 bg-primary/[.08] p-5">
          <div className="flex items-center gap-2 mb-3">
            {liveStatus === "LIVE" ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
                </span>
                <span className="font-bold text-destructive tracking-wide">
                  লাইভ ক্লাস চলছে
                </span>
              </>
            ) : (
              <span className="font-bold text-primary tracking-wide">
                লাইভ ক্লাস শীঘ্রই শুরু হবে
              </span>
            )}
          </div>
          {activeModule?.live_scheduled_at ? (
            <p className="text-sm text-foreground/80 mb-2">
              সময়:{" "}
              {new Date(
                activeModule.live_scheduled_at * 1000,
              ).toLocaleString("bn-BD")}
            </p>
          ) : null}
          {activeModule?.live_meeting_id ? (
            <p className="text-base text-foreground mb-1">
              জুম মিটিং আইডি:{" "}
              <span className="font-semibold">
                {activeModule.live_meeting_id}
              </span>
            </p>
          ) : null}
          {activeModule?.live_meeting_pass ? (
            <p className="text-base text-foreground">
              পাসকোড:{" "}
              <span className="font-semibold">
                {activeModule.live_meeting_pass}
              </span>
            </p>
          ) : null}
          {liveStatus === "LIVE" && activeModule?.live_meeting_id ? (
            <button
              onClick={() =>
                window.open(
                  `https://zoom.us/j/${activeModule.live_meeting_id}`,
                  "_blank",
                )
              }
              className="mt-4 px-8 py-3 rounded-xl cursor-pointer font-bold transition-all duration-300 bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-red-500/30"
            >
              জুম ক্লাসে যোগ দাও
            </button>
          ) : null}
        </div>
      )}

      {/* ── VIDEO ─────────────────────────────────────────────── */}
      {category === "VIDEO" && !isLiveOverlay && activeModule?.data?.videoHost === "Youtube" &&
        (!activeModule?.data?.videoUrl ||
        (activeModule.data.videoUrl as string).trim() === "" ? (
          <ModuleUpcoming />
        ) : (
          <ReactYoutubePlayer
            videoUrl={activeModule.data.videoUrl as string}
            initialTime={initialTime}
          />
        ))}

      {category === "VIDEO" && !isLiveOverlay && activeModule?.data?.videoHost === "BunnyCDN" &&
        (!activeModule?.data?.videoUrl ||
        (activeModule.data.videoUrl as string).trim() === "" ? (
          <ModuleUpcoming />
        ) : (
          <div className="flex justify-center">
            <div className="w-full aspect-video max-h-[65vh] rounded-xl overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src={activeModule.data.videoUrl as string}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        ))}

      {/* ── PDF ───────────────────────────────────────────────── */}
      {category === "PDF" &&
        (!activeModule?.data?.pdf_link ||
        (activeModule.data.pdf_link as string).trim() === "" ? (
          <ModuleUpcoming />
        ) : (
          <iframe
            src={`https://docs.google.com/viewer?url=${activeModule.data.pdf_link as string}&embedded=true`}
            className="w-full h-[65vh] rounded-xl border border-border/40"
          />
        ))}

      {/* ── QUIZ ─────────────────────────────────────────────── */}
      {category === "QUIZ" && (
        <div>
          {/* While the server hasn't yet said whether this quiz was already
              submitted, show a neutral loading state instead of the start
              screen — otherwise "শুরু করো" flashes for an already-taken quiz
              until the /attempt check resolves and flips to the reveal. */}
          {!attemptChecked && (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-8 text-center text-muted-foreground">
              পরীক্ষার তথ্য লোড হচ্ছে…
            </div>
          )}

          {/* ── Pre-exam start screen ──────────────────────────────────────
              Shown until the student presses শুরু করো. Opening the module no
              longer starts the clock — see useQuizTimer.startQuiz. */}
          {attemptChecked && !quizStarted && !showQuizAnswer && (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-5 text-center sm:p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 sm:mb-5 sm:h-16 sm:w-16">
                <svg className="h-7 w-7 text-primary sm:h-8 sm:w-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              <h4 className="mb-2 text-xl font-bold text-foreground sm:text-2xl">
                পরীক্ষা শুরু করতে প্রস্তুত?
              </h4>
              <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground sm:mb-7">
                শুরু করার পর সময় গণনা শুরু হবে। পেজ রিলোড করলেও সময় থামবে না,
                তাই প্রস্তুতি নিয়ে তবেই শুরু করো।
              </p>

              <div className="mx-auto mb-7 grid max-w-md grid-cols-3 gap-2 sm:mb-8 sm:gap-3">
                <div className="rounded-xl border border-border/50 bg-muted/20 px-2 py-3 sm:px-3 sm:py-4">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">
                    {englishToBanglaNumbers(quizQuestions.length)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">প্রশ্ন</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/20 px-2 py-3 sm:px-3 sm:py-4">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">
                    {englishToBanglaNumbers(totalQuestionPoints)}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">নম্বর</p>
                </div>
                <div className="rounded-xl border border-border/50 bg-muted/20 px-2 py-3 sm:px-3 sm:py-4">
                  <p className="text-xl font-bold text-foreground sm:text-2xl">
                    {totalTime > 0
                      ? englishToBanglaNumbers(Math.round(totalTime / 60))
                      : "—"}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground sm:text-xs">
                    {totalTime > 0 ? "মিনিট" : "সময়সীমা নেই"}
                  </p>
                </div>
              </div>

              <button
                onClick={startQuiz}
                className="w-full rounded-xl bg-primary px-10 py-3.5 text-base font-bold text-primary-foreground duration-150 ease-in-out hover:bg-primary/85 focus:ring ring-primary/30 sm:w-auto sm:text-lg"
              >
                পরীক্ষা শুরু করো
              </button>
            </div>
          )}

          {/* Everything below is the live exam / reveal — hidden until started. */}
          {(quizStarted || showQuizAnswer) && (
          <>
          {/* Compact sticky timer bar. The old card was ~250px tall, which made
              sticky useless; this stays out of the way while scrolling. */}
          {!showQuizAnswer && timerActive && (
            <div className="sticky top-16 z-30 mb-6 rounded-xl border border-border/60 bg-card/90 px-3 py-2.5 shadow-lg backdrop-blur-md sm:top-20 sm:mb-8 sm:px-4 sm:py-3">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <svg
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${timeRemaining <= totalTime * 0.1 ? "animate-pulse" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                    style={{ color: getTimerColor(timeRemaining, totalTime) }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span
                    className={`text-xl font-bold tabular-nums tracking-tight sm:text-2xl ${timeRemaining <= totalTime * 0.1 ? "animate-pulse" : ""}`}
                    style={{ color: getTimerColor(timeRemaining, totalTime) }}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {/* "উত্তর দেওয়া" is dropped below sm — the bar has to fit a
                      360px screen alongside the clock and submit button. */}
                  <span className="text-xs text-muted-foreground sm:text-sm">
                    <span className="font-semibold text-foreground">
                      {englishToBanglaNumbers(answeredCount)}
                    </span>
                    /{englishToBanglaNumbers(quizQuestions.length)}
                    <span className="hidden sm:inline"> উত্তর দেওয়া</span>
                  </span>
                  <button
                    onClick={() => setConfirmOpen(true)}
                    disabled={submitting}
                    className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground duration-150 ease-in-out hover:bg-primary/85 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
                  >
                    {submitting ? "জমা হচ্ছে…" : "জমা দাও"}
                  </button>
                </div>
              </div>

              {/* Time-remaining bar */}
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${(timeRemaining / totalTime) * 100}%`,
                    backgroundColor: getTimerColor(timeRemaining, totalTime),
                  }}
                />
              </div>
            </div>
          )}

          {/* Time's Up */}
          {timerExpired && !showQuizAnswer && (
            <div className="mb-8 rounded-xl border border-destructive/40 bg-destructive/10 p-5">
              <div className="flex items-center gap-3">
                <svg className="h-7 w-7 shrink-0 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xl font-bold text-destructive">সময় শেষ!</p>
                  {/* Only claim the auto-submit worked when it actually did —
                      submitError means nothing was recorded. */}
                  <p className="text-sm text-muted-foreground">
                    {submitError
                      ? "উত্তরপত্র জমা দেওয়া যায়নি, নিচে আবার চেষ্টা করো"
                      : "তোমার উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা হয়ে গেছে"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Legacy attempt — submitted, but the per-question record predates
              quiz_attempt, so only the fact of submission is shown. */}
          {isLegacyAttempt && (
            <div className="mb-6 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4">
              <p className="text-lg font-semibold text-foreground">
                তুমি এই পরীক্ষাটি আগেই জমা দিয়েছো
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                এই পরীক্ষার বিস্তারিত উত্তরপত্র সংরক্ষিত নেই, তাই প্রশ্নভিত্তিক ফলাফল দেখানো যাচ্ছে না।
              </p>
            </div>
          )}

          {/* Score card & review summary (post-submission) */}
          {showQuizAnswer && !isLegacyAttempt && (
            <QuizReviewSummary
              totalQuestionPoints={totalQuestionPoints}
              earnedQuestionPoints={earnedQuestionPoints}
              earnedPercentage={earnedPercentage}
              totalQuestionsCount={quizQuestions.length}
              correctCount={correctCount}
              wrongCount={wrongCount}
              skippedCount={skippedCount}
              filter={reviewFilter}
              setFilter={setReviewFilter}
              quizVerdict={quizVerdict}
              quizAnswer={quizAnswer}
              onJumpToQuestion={handleJumpToQuestion}
            />
          )}

          {/* Quiz questions — suppressed for legacy attempts, where there is no
              stored selection or verdict to display against them. */}
          {!isLegacyAttempt && (() => {
            const mappedQuestions = quizQuestions.map((quiz, index) => {
              const isSelected = quizAnswer[index] !== undefined && quizAnswer[index] !== "";
              const isCorrect = !!quizVerdict[index];
              const isWrong = isSelected && !isCorrect;
              const isSkipped = !isSelected;
              return { quiz, index, isSelected, isCorrect, isWrong, isSkipped };
            });

            const visibleQuestions = mappedQuestions.filter((item) => {
              if (!showQuizAnswer || reviewFilter === "ALL") return true;
              if (reviewFilter === "WRONG") return item.isWrong;
              if (reviewFilter === "CORRECT") return item.isCorrect;
              if (reviewFilter === "SKIPPED") return item.isSkipped;
              return true;
            });

            if (showQuizAnswer && visibleQuestions.length === 0) {
              return (
                <div className="my-8 rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
                  <p className="text-lg font-bold text-foreground">
                    {reviewFilter === "WRONG"
                      ? "🎉 চমৎকার! তোমার কোনো ভুল উত্তর নেই।"
                      : reviewFilter === "SKIPPED"
                      ? "👍 দারুণ! কোনো প্রশ্ন বাদ পড়েনি।"
                      : "এই ফিল্টারে কোনো প্রশ্ন পাওয়া যায়নি।"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setReviewFilter("ALL")}
                    className="mt-4 rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/85"
                  >
                    সবগুলো প্রশ্ন দেখো
                  </button>
                </div>
              );
            }

            return visibleQuestions.map(({ quiz, index, isCorrect, isWrong, isSkipped }) => {
              const correctAnswerRaw = decryptString(
                String(quiz.answer || quiz.correct_answer || ""),
                process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "",
              );

              const questionPoints =
                typeof quiz.points === "number" && quiz.points > 0 ? quiz.points : 1;

              // Card styling & border accent
              let cardBorderClass = "border-border/60 bg-card/40";
              let pillNumberClass = "bg-primary/15 text-primary";

              if (showQuizAnswer) {
                if (isCorrect) {
                  cardBorderClass = "border-emerald-500/35 bg-card/60 border-l-4 border-l-emerald-500";
                  pillNumberClass = "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
                } else if (isWrong) {
                  cardBorderClass = "border-destructive/40 bg-card/60 border-l-4 border-l-destructive shadow-sm";
                  pillNumberClass = "bg-destructive/15 text-destructive";
                } else {
                  cardBorderClass = "border-amber-500/35 bg-card/40 border-l-4 border-l-amber-500/70";
                  pillNumberClass = "bg-amber-500/15 text-amber-600 dark:text-amber-400";
                }
              }

              return (
                <div
                  id={`quiz-question-${index}`}
                  key={`quiz-question-${index}`}
                  className={`my-4 scroll-mt-24 rounded-2xl border p-4 transition-all duration-300 sm:my-5 sm:p-6 sm:scroll-mt-28 ${cardBorderClass}`}
                >
                  {/* Question Header */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 border-b border-border/40 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${pillNumberClass}`}>
                          {englishToBanglaNumbers(index + 1)}
                        </span>
                        প্রশ্ন
                      </span>

                      {showQuizAnswer && (
                        <>
                          {isCorrect && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              সঠিক উত্তর
                            </span>
                          )}
                          {isWrong && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              ভুল উত্তর
                            </span>
                          )}
                          {isSkipped && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              উত্তর দেওয়া হয়নি
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {showQuizAnswer ? (
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isCorrect
                              ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border border-border/40 bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          {isCorrect ? englishToBanglaNumbers(questionPoints) : "০"} / {englishToBanglaNumbers(questionPoints)} নম্বর
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {englishToBanglaNumbers(questionPoints)} নম্বর
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  <RichFieldRenderer
                    htmlContent={quiz.question_html as string | undefined}
                    plainContent={quiz.question as string | undefined}
                    className={`text-base font-semibold text-foreground ${MATH_OVERFLOW}`}
                  />

                  {/* Options List */}
                  <div className="mt-4 flex flex-col gap-2.5">
                    {(quiz.options as string[] | undefined)?.map((elem: string, optIndex: number) => {
                      const optionContent =
                        (quiz.options_html as string[] | undefined)?.[optIndex] || elem;
                      const isOptionSelected =
                        elem === quizAnswer[index] ||
                        (Boolean(quizAnswer[index]) && typeof quizAnswer[index] === "string" && elem.trim() === quizAnswer[index].trim());
                      const isCorrectOption =
                        showQuizAnswer &&
                        (elem === correctAnswerRaw ||
                          (Boolean(correctAnswerRaw) && elem.trim() === correctAnswerRaw.trim()));
                      const isWrongSelection = showQuizAnswer && isOptionSelected && !quizVerdict[index];

                      let rowClass =
                        "border-border/50 bg-background/40 hover:border-primary/50 hover:bg-primary/5";
                      let pillClass = "border-border/60 text-muted-foreground";

                      if (showQuizAnswer) {
                        if (isCorrectOption) {
                          rowClass = "border-emerald-500/70 bg-emerald-500/10 dark:bg-emerald-500/15 ring-1 ring-emerald-500/30";
                          pillClass = "border-emerald-500 bg-emerald-500 text-white font-bold";
                        } else if (isWrongSelection) {
                          rowClass = "border-destructive/70 bg-destructive/10 dark:bg-destructive/15 ring-1 ring-destructive/30";
                          pillClass = "border-destructive bg-destructive text-white font-bold";
                        } else {
                          rowClass = "border-border/40 bg-background/20 opacity-75";
                          pillClass = "border-border/50 text-muted-foreground";
                        }
                      } else if (isOptionSelected) {
                        rowClass = "border-primary bg-primary/10";
                        pillClass = "border-primary bg-primary text-primary-foreground font-bold";
                      }

                      return (
                        <label
                          key={`option-${index}-${optIndex}`}
                          className={`flex min-h-11 items-center gap-2.5 rounded-xl border px-3 py-3 transition-colors sm:gap-3 sm:px-3.5 ${rowClass} ${showQuizAnswer ? "cursor-default" : "cursor-pointer"}`}
                        >
                          <input
                            type="radio"
                            name={`quiz-${index}`}
                            value={elem}
                            checked={isOptionSelected}
                            disabled={showQuizAnswer}
                            onChange={() => {
                              if (!showQuizAnswer) {
                                setQuizAnswer((prev) => ({ ...prev, [index]: elem }));
                              }
                            }}
                            className="sr-only"
                          />
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${pillClass}`}
                            aria-hidden="true"
                          >
                            {OPTION_LABELS[optIndex] ?? englishToBanglaNumbers(optIndex + 1)}
                          </span>

                          <span className={`min-w-0 flex-1 self-center text-foreground ${MATH_OVERFLOW}`}>
                            <SafeHtmlRenderer content={optionContent} />
                          </span>

                          {showQuizAnswer && isCorrectOption && (
                            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span>সঠিক উত্তর</span>
                              {isOptionSelected && <span className="opacity-80 font-normal">(তোমার পছন্দ)</span>}
                            </span>
                          )}

                          {showQuizAnswer && isWrongSelection && (
                            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-md bg-destructive/20 px-2 py-0.5 text-xs font-semibold text-destructive">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              <span>তোমার উত্তর (ভুল)</span>
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Explanation Section */}
                  {showQuizAnswer && (() => {
                    const expHtml = quiz.explanation_html
                      ? decryptString(String(quiz.explanation_html), process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "")
                      : "";
                    const expPlain = quiz.explanation
                      ? decryptString(String(quiz.explanation), process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "")
                      : "";
                    if (!expHtml?.trim() && !expPlain?.trim()) return null;
                    return (
                      <div className="mt-5 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 sm:p-5">
                        <div className="mb-2.5 flex items-center gap-2 text-sm font-bold text-primary">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span>ব্যাখ্যা ও সঠিক সমাধান:</span>
                        </div>
                        <RichFieldRenderer
                          htmlContent={expHtml || undefined}
                          plainContent={expPlain || undefined}
                          className={`text-sm sm:text-base text-foreground/90 leading-relaxed ${MATH_OVERFLOW}`}
                        />
                      </div>
                    );
                  })()}
                </div>
              );
            });
          })()}

          {!showQuizAnswer && (
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <button
                onClick={() => setConfirmOpen(true)}
                type="button"
                disabled={submitting}
                className="w-full rounded-xl bg-primary px-8 py-3 text-base font-bold text-primary-foreground duration-150 ease-in-out hover:bg-primary/85 focus:ring ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-lg"
              >
                {submitting ? "জমা হচ্ছে…" : "উত্তরপত্র জমা দাও"}
              </button>
              {unansweredCount > 0 && (
                <p className="text-center text-sm text-muted-foreground sm:text-left">
                  {englishToBanglaNumbers(unansweredCount)} টি প্রশ্নের
                  উত্তর এখনো বাকি
                </p>
              )}
            </div>
          )}

          {/* Submit failed outright — the attempt was NOT recorded, so the exam
              stays open and the student can retry. */}
          {submitError && !showQuizAnswer && (
            <div
              role="alert"
              className="mt-4 flex flex-col gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm font-medium text-destructive">{submitError}</p>
              <button
                onClick={() => { clearSubmitError(); submitQuiz(); }}
                disabled={submitting}
                className="shrink-0 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white duration-150 ease-in-out hover:bg-destructive/85 disabled:cursor-not-allowed disabled:opacity-60"
              >
                আবার চেষ্টা করো
              </button>
            </div>
          )}

          {/* Confirm — one attempt only, so make the student acknowledge it. */}
          {confirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-2xl">
                <h4 className="mb-2 text-lg font-bold text-foreground">
                  উত্তরপত্র জমা দেবে?
                </h4>
                <p className="mb-1 text-sm text-muted-foreground">
                  একবার জমা দিলে আর পরিবর্তন করা যাবে না।
                </p>
                {unansweredCount > 0 && (
                  <p className="mb-1 text-sm font-medium text-destructive">
                    {englishToBanglaNumbers(unansweredCount)} টি প্রশ্নের উত্তর এখনো বাকি।
                  </p>
                )}
                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="w-full rounded-xl bg-muted/30 py-2.5 font-semibold text-foreground duration-150 ease-in-out hover:opacity-70"
                  >
                    ফিরে যাও
                  </button>
                  <button
                    onClick={() => { setConfirmOpen(false); submitQuiz(); }}
                    className="w-full rounded-xl bg-primary py-2.5 font-bold text-primary-foreground duration-150 ease-in-out hover:bg-primary/85"
                  >
                    জমা দাও
                  </button>
                </div>
              </div>
            </div>
          )}
          </>
          )}
        </div>
      )}

      {/* ── TEXT ─────────────────────────────────────────────── */}
      {category === "TEXT" &&
        (!activeModule?.description || activeModule.description.trim() === "" ? (
          <ModuleUpcoming />
        ) : (
          <SafeHtmlRenderer
            content={activeModule.description}
            className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-lg text-muted-foreground dark:border-border/10"
          />
        ))}
    </div>
  );
});

export default ModulePlayer;
