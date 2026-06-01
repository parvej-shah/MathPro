"use client";

import { memo } from "react";
import Link from "next/link";
import ReactYoutubePlayer from "@/components/ReactYoutubePlayer";
import ModuleUpcoming from "@/components/ModuleUpcoming";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";
import { RichFieldRenderer } from "@/components/RichFieldRenderer";
import { decryptString } from "@/helpers";
import type { CourseModule, Course } from "./types";

interface ModulePlayerProps {
  activeModule: CourseModule;
  courseData: Course;
  // assignment state
  assignmentEvaluted: any[];
  assignmentSubmission: { github_link: string; youtube_link: string };
  setAssignmentSubmission: React.Dispatch<
    React.SetStateAction<{ github_link: string; youtube_link: string }>
  >;
  submitAssignment: (e: React.FormEvent) => void;
  // code/CF state
  cfHandle: string;
  setCfHandle: (v: string) => void;
  checkCFStatus: () => void;
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
  retakeQuiz: () => void;
}

const ModulePlayer = memo(function ModulePlayer({
  activeModule,
  courseData,
  assignmentEvaluted,
  assignmentSubmission,
  setAssignmentSubmission,
  submitAssignment,
  cfHandle,
  setCfHandle,
  checkCFStatus,
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
  retakeQuiz,
}: ModulePlayerProps) {
  const category = activeModule?.data?.category;
  const totalTime = ((activeModule?.data?.quiz as any[])?.length ?? 0) * 60;

  return (
    <div className="mt-8">
      {/* Module Title */}
      <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-6">
        {activeModule?.title}
      </h3>

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

      {/* ── ASSIGNMENT ────────────────────────────────────────── */}
      {category === "ASSIGNMENT" &&
        (!activeModule?.description ||
        activeModule.description.trim() === "" ? (
          <ModuleUpcoming />
        ) : (
          <div className="mx-auto z-20">
            <p className="text-lg mb-2">
              Assignment Status:{" "}
              {assignmentEvaluted.length === 0 && (
                <span className="font-semibold text-xl text-destructive">
                  INCOMPLETE
                </span>
              )}
              {assignmentEvaluted.length > 0 && (
                <span className="font-semibold text-xl text-success">
                  {assignmentEvaluted[0]?.status}
                </span>
              )}
            </p>
            <p className="text-lg mb-2">
              Verdict:{" "}
              {assignmentEvaluted.length > 0 &&
                assignmentEvaluted[0]?.status === "EVALUATED" && (
                  <span
                    className={`font-semibold text-xl ${
                      assignmentEvaluted[0]?.evaluation?.verdict === "PASSED"
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {assignmentEvaluted[0]?.evaluation?.verdict}
                  </span>
                )}
            </p>
            <p className="text-lg mb-2">
              Feedback:{" "}
              {assignmentEvaluted.length > 0 &&
                assignmentEvaluted[0]?.status === "EVALUATED" && (
                  <span className="text-foreground">
                    {assignmentEvaluted[0]?.evaluation?.feedback}
                  </span>
                )}
            </p>
            <form
              onSubmit={submitAssignment}
              className="lg:px-8 px-6 py-6 text-foreground bg-muted/20 backdrop-blur-xl rounded-xl mx-auto flex flex-col items-center gap-4"
            >
              <div className="w-full">
                <p className="text-lg font-semibold mb-1">Github URL</p>
                <input
                  className="w-full px-3 py-3 rounded bg-gray-200/20 outline-none focus:ring ring-gray-300/80"
                  placeholder="Github URL"
                  value={assignmentSubmission.github_link}
                  required
                  onChange={(e) =>
                    setAssignmentSubmission((prev) => ({
                      ...prev,
                      github_link: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-full">
                <p className="text-lg font-semibold mb-1">Youtube URL</p>
                <input
                  className="w-full px-3 py-3 rounded bg-gray-200/20 outline-none focus:ring ring-gray-300/80"
                  placeholder="Youtube URL"
                  value={assignmentSubmission.youtube_link}
                  required
                  onChange={(e) =>
                    setAssignmentSubmission((prev) => ({
                      ...prev,
                      youtube_link: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  className="py-2 px-8 bg-primary hover:bg-primary/85 ease-in-out duration-150 focus:ring ring-primary/30 rounded-lg font-semibold text-primary-foreground text-lg"
                >
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        ))}

      {/* ── CODE (internal problem page) ─────────────────────── */}
      {category === "CODE" && !activeModule?.data?.is_cf && (
        <div className="mx-auto z-20">
          <p className="text-lg mb-2">
            Coding Status:{" "}
            {(activeModule?.serial ?? 0) >=
            (courseData?.maxModuleSerialProgress ?? 0) + 1 ? (
              <span className="font-semibold text-xl text-destructive">
                INCOMPLETE
              </span>
            ) : (
              <span className="font-semibold text-xl text-success">
                COMPLETED
              </span>
            )}
          </p>
          <div className="mt-6">
            <Link
              href={`/problem/${activeModule.id}`}
              className="py-2 px-8 bg-primary hover:bg-primary/85 ease-in-out duration-150 focus:ring ring-primary/30 rounded-lg font-semibold text-primary-foreground text-lg"
            >
              Go to Problem Page
            </Link>
          </div>
        </div>
      )}

      {/* ── CODE (Codeforces) ────────────────────────────────── */}
      {category === "CODE" && activeModule?.data?.is_cf && (
        <div className="mx-auto z-20">
          <p className="text-lg mb-2">
            Coding Status:{" "}
            {(activeModule?.serial ?? 0) >=
            (courseData?.maxModuleSerialProgress ?? 0) + 1 ? (
              <span className="font-semibold text-xl text-destructive">
                INCOMPLETE
              </span>
            ) : (
              <span className="font-semibold text-xl text-success">
                COMPLETED
              </span>
            )}
          </p>
          <div className="w-full my-8">
            <p className="text-lg font-semibold mb-1">Codeforces Handle</p>
            <input
              className="w-full px-3 py-3 rounded bg-gray-200/20 outline-none focus:ring ring-gray-300/80"
              placeholder="Codeforces Handle"
              value={cfHandle}
              required
              onChange={(e) => setCfHandle(e.target.value)}
            />
          </div>
          <div className="mt-6">
            <a
              href={activeModule?.data?.cf_url as string}
              target="_blank"
              className="py-2 px-8 bg-primary hover:bg-primary/85 ease-in-out duration-150 focus:ring ring-primary/30 rounded-lg font-semibold text-primary-foreground text-lg"
            >
              Go to Codeforces Problem
            </a>
          </div>
          <div className="mt-12">
            <button
              onClick={checkCFStatus}
              className="py-2 px-8 bg-success hover:bg-success/85 ease-in-out duration-150 focus:ring ring-success/30 rounded-lg font-semibold text-white text-lg"
            >
              Verify
            </button>
          </div>
        </div>
      )}

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
                          {(activeModule?.data?.quiz as any[])?.length}
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
          {showQuizAnswer && !justSubmitted && (
            <div className="mb-8 overflow-hidden rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row items-center justify-between p-8 gap-8">
                <div className="flex items-center gap-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-700/30" />
                      <circle
                        cx="64" cy="64" r="58" stroke="oklch(0.718 0.147 159.2)" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 58}`}
                        strokeDashoffset={`${2 * Math.PI * 58 * (1 - (quizVerdict.filter(Boolean).length || 0) / ((activeModule?.data?.quiz as any[])?.length || 1))}`}
                        className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_oklch(0.718_0.147_159.2/0.5)]"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {Math.round(
                          ((quizVerdict.filter(Boolean).length || 0) /
                            ((activeModule?.data?.quiz as any[])?.length || 1)) * 100,
                        )}%
                      </span>
                    </div>
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-white mb-1">Quiz Completed</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-400">Score:</span>
                      <span className="text-xl font-bold text-primary">{quizVerdict.filter(Boolean).length || 0}</span>
                      <span className="text-gray-500">/ {(activeModule?.data?.quiz as any[])?.length}</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 max-w-[200px]">
                      {(quizVerdict.filter(Boolean).length || 0) /
                        ((activeModule?.data?.quiz as any[])?.length || 1) >= 0.8
                        ? "Excellent work! You've mastered this topic."
                        : "Keep practicing to improve your score."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-4">
                  <button
                    onClick={retakeQuiz}
                    className="group flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/85 rounded-lg font-semibold text-primary-foreground transition-all duration-200 shadow-lg shadow-primary/20"
                  >
                    <svg
                      className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-500"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retake Quiz
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quiz questions (taking or just submitted) */}
          {(!showQuizAnswer || justSubmitted) &&
            (activeModule?.data?.quiz as any[])?.map((quiz: any, index: number) => (
              <div
                key={`quiz-question-${index}`}
                className="my-6 bg-primary/10 border border-primary/40 dark:bg-muted/10 rounded-lg p-6"
              >
                <RichFieldRenderer
                  htmlContent={quiz.question_html}
                  plainContent={quiz.question}
                  className="text-foreground forced-white font-bold"
                />
                <div className="flex flex-col gap-2 mt-3">
                  {quiz.options?.map((elem: any, optIndex: number) => {
                    const optionContent = quiz.options_html?.[optIndex] || elem;
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
                        quiz.answer || quiz.correct_answer,
                        process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ,
                      )}
                    </p>
                    {(quiz.explanation_html || quiz.explanation) && (
                      <RichFieldRenderer
                        htmlContent={quiz.explanation_html ? decryptString(quiz.explanation_html, process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ) : undefined}
                        plainContent={quiz.explanation ? decryptString(quiz.explanation, process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ) : undefined}
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
