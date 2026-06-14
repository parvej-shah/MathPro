"use client";

import { memo } from "react";
import ReactYoutubePlayer from "@/components/ReactYoutubePlayer";
import ModuleUpcoming from "@/components/ModuleUpcoming";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";
import { RichFieldRenderer } from "@/components/RichFieldRenderer";
import { decryptString } from "@/helpers";
import type { CourseModule, QuizQuestionData } from "./types";

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

  return (
    <div className="mt-8">
      {/* Module Title */}
      <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-6">
        {activeModule?.title}
      </h3>

      {/* ── LIVE CLASS (overlay on a VIDEO module while live) ──── */}
      {activeModule?.live_status === "LIVE" && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/[.08] p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
            </span>
            <span className="font-bold text-destructive tracking-wide">
              লাইভ ক্লাস চলছে
            </span>
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
        </div>
      )}

      {/* ── VIDEO ─────────────────────────────────────────────── */}
      {category === "VIDEO" && activeModule?.data?.videoHost === "Youtube" &&
        (!activeModule?.data?.videoUrl ||
        (activeModule.data.videoUrl as string).trim() === "" ? (
          <ModuleUpcoming />
        ) : (
          <ReactYoutubePlayer videoUrl={activeModule.data.videoUrl as string} />
        ))}

      {category === "VIDEO" && activeModule?.data?.videoHost === "BunnyCDN" &&
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
          {/* Timer */}
          {!showQuizAnswer && timerActive && (
            <div className="mb-8 relative overflow-hidden">
              <div
                className="absolute inset-0 blur-xl opacity-30 transition-all duration-1000"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${getTimerColor(timeRemaining, totalTime)}, transparent 70%)`,
                }}
              />
              <div
                className="relative p-8 rounded-2xl border-2 bg-gray-900/70 backdrop-blur-xl shadow-2xl transition-all duration-500"
                style={{
                  borderColor: getTimerColor(timeRemaining, totalTime),
                  boxShadow: `0 0 30px ${getTimerColor(timeRemaining, totalTime)}40`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div
                        className={`absolute inset-0 rounded-full blur-lg opacity-50 ${timeRemaining <= totalTime * 0.1 ? "animate-pulse" : ""}`}
                        style={{ backgroundColor: getTimerColor(timeRemaining, totalTime) }}
                      />
                      <div
                        className="relative w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${getTimerColor(timeRemaining, totalTime)}20` }}
                      >
                        <svg
                          className={`w-9 h-9 ${timeRemaining <= totalTime * 0.1 ? "animate-pulse" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: getTimerColor(timeRemaining, totalTime) }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-medium mb-1 tracking-wide uppercase">
                        Time Remaining
                      </p>
                      <p
                        className={`text-5xl font-bold tabular-nums tracking-tight ${timeRemaining <= totalTime * 0.1 ? "animate-pulse" : ""}`}
                        style={{ color: getTimerColor(timeRemaining, totalTime) }}
                      >
                        {formatTime(timeRemaining)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 font-medium mb-1">Questions</p>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-linear-to-br from-teal/30 to-primary/20 flex items-center justify-center border border-teal/30">
                        <p className="text-2xl font-bold text-white">
                          {quizQuestions.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 relative">
                  <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                    <div
                      className="h-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{
                        width: `${(timeRemaining / totalTime) * 100}%`,
                        background: `linear-gradient(90deg, ${getTimerColor(timeRemaining, totalTime)}, ${getTimerColor(timeRemaining, totalTime)}dd)`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {Math.round((timeRemaining / totalTime) * 100)}% remaining
                    </span>
                    <span className="text-xs text-gray-500">{totalTime} sec total</span>
                  </div>
                </div>

                {timeRemaining <= totalTime * 0.2 && (
                  <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-sm text-yellow-300 font-semibold">Hurry up! Time is running out</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Time's Up */}
          {timerExpired && !showQuizAnswer && (
            <div className="mb-8 p-6 rounded-lg border-2 border-red-500 bg-red-900/20 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-2xl font-bold text-destructive">Time&apos;s Up!</p>
                  <p className="text-sm text-gray-300">Your quiz has been automatically submitted</p>
                </div>
              </div>
            </div>
          )}

          {/* Score card (returning user) */}
          {showQuizAnswer && (
            <div className="mb-8 overflow-hidden rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between p-8 gap-8">
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700/30" />
                      <circle
                        cx="64" cy="64" r="58" stroke="oklch(0.718 0.147 159.2)" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 58}`}
                        strokeDashoffset={`${2 * Math.PI * 58 * (1 - earnedPercentage / 100)}`}
                        className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_oklch(0.718_0.147_159.2/0.5)]"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {earnedPercentage}%
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white mb-1">Quiz Completed</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-400">নম্বর:</span>
                      <span className="text-xl font-bold text-primary">{earnedQuestionPoints}</span>
                      <span className="text-gray-500">/ {totalQuestionPoints}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 max-w-[200px]">
                      {earnedPercentage >= 80
                        ? "Excellent work! You've mastered this topic."
                        : "Keep practicing to improve your score."}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 px-5 py-4 text-sm text-primary-foreground/90">
                  এই কুইজ একবারই সাবমিট করা যাবে।
                </div>
              </div>
            </div>
          )}

          {/* Quiz questions (taking or just submitted) */}
          {(!showQuizAnswer || justSubmitted) &&
            (activeModule?.data?.quiz as Array<Record<string, unknown>>)?.map((quiz, index: number) => (
              <div
                key={`quiz-question-${index}`}
                className="my-6 bg-primary/10 border border-primary/40 dark:bg-muted/10 rounded-lg p-6"
              >
                <RichFieldRenderer
                  htmlContent={quiz.question_html as string | undefined}
                  plainContent={quiz.question as string | undefined}
                  className="text-foreground forced-white font-bold"
                />
                <div className="flex flex-col gap-2 mt-3">
                  {(quiz.options as string[] | undefined)?.map((elem: string, optIndex: number) => {
                    const optionContent = (quiz.options_html as string[] | undefined)?.[optIndex] || elem;
                    const isSelected = elem === quizAnswer[index];
                    const isCorrect = showQuizAnswer && isSelected && quizVerdict[index];
                    const isWrong = showQuizAnswer && isSelected && !quizVerdict[index];
                    const accentColor = isCorrect ? "oklch(0.65 0.15 145)" : isWrong ? "oklch(0.577 0.245 27)" : "oklch(0.718 0.147 159.2)";
                    return (
                      <label
                        key={`option-${index}-${optIndex}`}
                        className="flex items-center gap-3 cursor-pointer"
                        style={{ color: showQuizAnswer && isSelected ? accentColor : undefined }}
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
                          style={{ accentColor }}
                          className="shrink-0 w-4 h-4"
                        />
                        <SafeHtmlRenderer content={optionContent} />
                      </label>
                    );
                  })}
                </div>
                {showQuizAnswer && (
                  <div>
                    <p className="text-foreground text-xl mt-2">Answer:</p>
                    <p className="text-success">
                      {decryptString(
                        String(quiz.answer || quiz.correct_answer || ""),
                        process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "",
                      )}
                    </p>
                    {(quiz.explanation_html != null || quiz.explanation != null) && (
                      <RichFieldRenderer
                        htmlContent={quiz.explanation_html ? decryptString(String(quiz.explanation_html), process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "") : undefined}
                        plainContent={quiz.explanation ? decryptString(String(quiz.explanation), process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ ?? "") : undefined}
                        className="text-muted-foreground mt-2"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}

          {!showQuizAnswer && (
            <button
              onClick={submitQuiz}
              type="submit"
              disabled={showQuizAnswer}
              className="py-2 mt-5 px-8 bg-primary hover:bg-primary/85 ease-in-out duration-150 focus:ring ring-primary/30 rounded-lg font-semibold text-primary-foreground text-lg"
            >
              Submit Answer
            </button>
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
