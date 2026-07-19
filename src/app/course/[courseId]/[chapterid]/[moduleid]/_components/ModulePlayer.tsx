"use client";

import { memo } from "react";
import ReactYoutubePlayer from "@/components/ReactYoutubePlayer";
import ModuleUpcoming from "@/components/ModuleUpcoming";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";
import { RichFieldRenderer } from "@/components/RichFieldRenderer";
import { decryptString, englishToBanglaNumbers } from "@/helpers";
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
  // quiz state
  quizAnswer: Record<number, string>;
  setQuizAnswer: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  quizVerdict: boolean[];
  showQuizAnswer: boolean;
  justSubmitted: boolean;
  timeRemaining: number;
  timerActive: boolean;
  timerExpired: boolean;
  quizStarted: boolean;
  startQuiz: () => void;
  formatTime: (s: number) => string;
  getTimerColor: (remaining: number, total: number) => string;
  submitQuiz: () => void;
}

const ModulePlayer = memo(function ModulePlayer({
  activeModule,
  quizAnswer,
  setQuizAnswer,
  quizVerdict,
  showQuizAnswer,
  justSubmitted,
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

  const liveStatus = activeModule?.live_status;
  const isLiveOverlay = liveStatus === "LIVE" || liveStatus === "SCHEDULED";

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
          <ReactYoutubePlayer videoUrl={activeModule.data.videoUrl as string} />
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
          {/* ── Pre-exam start screen ──────────────────────────────────────
              Shown until the student presses শুরু করো. Opening the module no
              longer starts the clock — see useQuizTimer.startQuiz. */}
          {!quizStarted && !showQuizAnswer && (
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
                    onClick={submitQuiz}
                    className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground duration-150 ease-in-out hover:bg-primary/85 sm:px-4 sm:text-sm"
                  >
                    জমা দাও
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
                  <p className="text-sm text-muted-foreground">তোমার উত্তরপত্র স্বয়ংক্রিয়ভাবে জমা হয়ে গেছে</p>
                </div>
              </div>
            </div>
          )}

          {/* Score card (returning user) */}
          {showQuizAnswer && (
            <div className="mb-6 flex items-center gap-4 rounded-xl border border-primary/30 bg-primary/10 px-5 py-4">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="3" fill="none" className="text-gray-700/30" />
                  <circle
                    cx="18" cy="18" r="15" stroke="oklch(0.718 0.147 159.2)" strokeWidth="3" fill="none"
                    strokeDasharray={`${2 * Math.PI * 15}`}
                    strokeDashoffset={`${2 * Math.PI * 15 * (1 - earnedPercentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {earnedPercentage}%
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-foreground leading-tight">
                  {earnedPercentage >= 80 ? "🎉 দারুণ করেছো!" : earnedPercentage >= 50 ? "👍 ভালো চেষ্টা!" : "আবার চেষ্টা করো"}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  নম্বর: <span className="font-bold text-primary">{earnedQuestionPoints}</span> / {totalQuestionPoints}
                </p>
              </div>
            </div>
          )}

          {/* Quiz questions */}
          {(activeModule?.data?.quiz as Array<Record<string, unknown>>)?.map((quiz, index: number) => {
            const correctAnswerRaw = decryptString(
              String(quiz.answer || quiz.correct_answer || ""),
              process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "",
            );
            return (
              <div
                key={`quiz-question-${index}`}
                className="my-4 rounded-2xl border border-border/60 bg-card/40 p-4 transition-colors sm:my-5 sm:p-6"
              >
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/40 pb-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                      {englishToBanglaNumbers(index + 1)}
                    </span>
                    প্রশ্ন
                  </span>
                  <span className="shrink-0 rounded-full bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {englishToBanglaNumbers(
                      typeof quiz.points === "number" && (quiz.points as number) > 0
                        ? (quiz.points as number)
                        : 1,
                    )}{" "}
                    নম্বর
                  </span>
                </div>

                <RichFieldRenderer
                  htmlContent={quiz.question_html as string | undefined}
                  plainContent={quiz.question as string | undefined}
                  className={`text-base font-semibold text-foreground ${MATH_OVERFLOW}`}
                />
                <div className="mt-4 flex flex-col gap-2.5">
                  {(quiz.options as string[] | undefined)?.map((elem: string, optIndex: number) => {
                    const optionContent = (quiz.options_html as string[] | undefined)?.[optIndex] || elem;
                    const isSelected = elem === quizAnswer[index];
                    const isCorrectOption = showQuizAnswer && elem === correctAnswerRaw;
                    const isWrongSelection = showQuizAnswer && isSelected && !quizVerdict[index];

                    // Card state: green when revealed-correct, red when the
                    // student's pick was wrong, primary when merely selected.
                    let rowClass =
                      "border-border/50 bg-background/40 hover:border-primary/50 hover:bg-primary/5";
                    let pillClass = "border-border/60 text-muted-foreground";
                    if (showQuizAnswer) {
                      if (isCorrectOption) {
                        rowClass = "border-primary/60 bg-primary/10";
                        pillClass = "border-primary bg-primary text-primary-foreground";
                      } else if (isWrongSelection) {
                        rowClass = "border-destructive/60 bg-destructive/10";
                        pillClass = "border-destructive bg-destructive text-white";
                      } else {
                        rowClass = "border-border/40 bg-background/20";
                      }
                    } else if (isSelected) {
                      rowClass = "border-primary bg-primary/10";
                      pillClass = "border-primary bg-primary text-primary-foreground";
                    }

                    return (
                      <label
                        key={`option-${index}-${optIndex}`}
                        className={`flex min-h-11 items-start gap-2.5 rounded-xl border px-3 py-3 transition-colors sm:gap-3 sm:px-3.5 ${rowClass} ${showQuizAnswer ? "cursor-default" : "cursor-pointer"}`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${index}`}
                          value={elem}
                          checked={isSelected}
                          disabled={showQuizAnswer}
                          onChange={() => {
                            if (!showQuizAnswer) {
                              setQuizAnswer((prev) => ({ ...prev, [index]: elem }));
                            }
                          }}
                          className="sr-only"
                        />
                        <span
                          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors ${pillClass}`}
                          aria-hidden="true"
                        >
                          {OPTION_LABELS[optIndex] ?? englishToBanglaNumbers(optIndex + 1)}
                        </span>
                        <span className={`min-w-0 flex-1 self-center text-foreground ${MATH_OVERFLOW}`}>
                          <SafeHtmlRenderer content={optionContent} />
                        </span>
                        {showQuizAnswer && isCorrectOption && (
                          <svg className="mt-0.5 h-5 w-5 shrink-0 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                          </svg>
                        )}
                        {showQuizAnswer && isWrongSelection && (
                          <svg className="mt-0.5 h-5 w-5 shrink-0 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                          </svg>
                        )}
                      </label>
                    );
                  })}
                </div>
                {showQuizAnswer && (() => {
                  const expHtml = quiz.explanation_html ? decryptString(String(quiz.explanation_html), process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "") : "";
                  const expPlain = quiz.explanation ? decryptString(String(quiz.explanation), process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "") : "";
                  if (!expHtml?.trim() && !expPlain?.trim()) return null;
                  return (
                    <div className="mt-4 p-4 rounded-lg bg-muted/20 border border-border/40">
                      <p className="text-sm font-semibold text-foreground mb-2">ব্যাখ্যা:</p>
                      <RichFieldRenderer
                        htmlContent={expHtml || undefined}
                        plainContent={expPlain || undefined}
                        className={`text-muted-foreground ${MATH_OVERFLOW}`}
                      />
                    </div>
                  );
                })()}
              </div>
            );
          })}

          {!showQuizAnswer && (
            <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <button
                onClick={submitQuiz}
                type="submit"
                className="w-full rounded-xl bg-primary px-8 py-3 text-base font-bold text-primary-foreground duration-150 ease-in-out hover:bg-primary/85 focus:ring ring-primary/30 sm:w-auto sm:text-lg"
              >
                উত্তরপত্র জমা দাও
              </button>
              {answeredCount < quizQuestions.length && (
                <p className="text-center text-sm text-muted-foreground sm:text-left">
                  {englishToBanglaNumbers(quizQuestions.length - answeredCount)} টি প্রশ্নের
                  উত্তর এখনো বাকি
                </p>
              )}
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
