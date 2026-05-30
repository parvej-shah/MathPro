'use client';

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/Contexts/UserContext";
import { Toaster, toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { saveLastAccessedModule } from "@/utils/moduleAccessUtils";
import DiscussionSection from "@/components/DiscussionSection";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";
import ModuleFeedback from "@/components/ModuleFeedback";
import { ModulePageSkeleton } from "@/components/Skeletons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CourseSidebar from "./_components/CourseSidebar";
import ModulePlayer from "./_components/ModulePlayer";
import ModuleNavButtons from "./_components/ModuleNavButtons";
import type { Chapter, Course, CourseModule } from "./_components/types";
import { useCourseData } from "./_hooks/useCourseData";
import { useModuleProgress } from "./_hooks/useModuleProgress";
import { useQuiz } from "./_hooks/useQuiz";
import { useQuizTimer } from "./_hooks/useQuizTimer";
import { useAssignment } from "./_hooks/useAssignment";
import { useDiscussions } from "./_hooks/useDiscussions";

function findObjectBySerial(data: Course, targetSerial: number): CourseModule | undefined {
  for (const chapter of data.chapters) {
    for (const mod of chapter.modules) {
      if (mod.serial === targetSerial) return mod;
    }
  }
  return undefined;
}

export default function CourseDetailsPage() {
  const [user, setUser] = useContext<any>(UserContext);
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string | undefined;
  const chapterId = params?.chapterid as string | undefined;
  const moduleId = params?.moduleid as string | undefined;

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const activeModuleRef = useRef<HTMLButtonElement>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const {
    courseData,
    activeModule,
    setActiveModule,
    loading: pageLoading,
    error: pageError,
    refetch,
  } = useCourseData(courseId, chapterId, moduleId);

  // ── Score trigger (updates header score display) ──────────────────────────
  const onScoreTrigger = useCallback(() => {
    setUser((prev: any) => ({ ...prev, scoreTrigger: !prev.scoreTrigger }));
  }, [setUser]);

  // ── Progress ──────────────────────────────────────────────────────────────
  const { submitProgress } = useModuleProgress(
    courseId,
    courseData,
    activeModule,
    refetch,
    onScoreTrigger,
  );

  // ── Quiz ──────────────────────────────────────────────────────────────────
  const {
    quizAnswer,
    setQuizAnswer,
    quizScore,
    quizVerdict,
    showQuizAnswer,
    justSubmitted,
    submitQuiz: submitQuizBase,
    retakeQuiz: retakeQuizBase,
    restoreFromTimer,
    resetQuizState,
  } = useQuiz(activeModule, submitProgress);

  const onTimerExpire = useCallback(() => {
    submitQuizBase();
  }, [submitQuizBase]);

  const {
    timeRemaining,
    timerActive,
    timerExpired,
    formatTime,
    getTimerColor,
    clearQuizTimer,
    markSubmitted,
    restoredSubmission,
    resetTimer,
  } = useQuizTimer(activeModule, onTimerExpire);

  // When the timer hook detects a quiz was previously submitted (reload), wire
  // the restored answers/score/verdict into the quiz hook.
  useEffect(() => {
    if (restoredSubmission) {
      restoreFromTimer(
        restoredSubmission.quizScore,
        restoredSubmission.quizAnswer,
        restoredSubmission.quizVerdict,
      );
    }
  }, [restoredSubmission]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitQuiz = useCallback(() => {
    const { score, answers, verdict } = submitQuizBase();
    if (activeModule?.id) {
      const timerKey = `quiz_timer_${activeModule.id}`;
      const existing = localStorage.getItem(timerKey);
      if (existing) {
        const parsed = JSON.parse(existing);
        markSubmitted(activeModule.id, parsed.startTime, parsed.totalTime, score, answers, verdict);
      }
    }
    clearQuizTimer();
  }, [submitQuizBase, activeModule, markSubmitted, clearQuizTimer]);

  const retakeQuiz = useCallback(() => {
    retakeQuizBase();
    resetQuizState();
    if (activeModule?.data?.quiz) {
      resetTimer(activeModule.id, (activeModule.data.quiz as unknown[]).length);
    }
  }, [retakeQuizBase, resetQuizState, activeModule, resetTimer]);

  // ── Assignment ────────────────────────────────────────────────────────────
  const {
    assignmentEvaluted,
    assignmentSubmission,
    setAssignmentSubmission,
    submitAssignment,
    fetchEvalutedAssignment,
  } = useAssignment(activeModule, submitProgress);

  // ── Codeforces ────────────────────────────────────────────────────────────
  // cfHandle lives in ModulePlayer; checkCFStatus needs submitProgress.
  // Kept minimal here — just a thin pass-through.
  const checkCFStatus = useCallback((handle: string) => {
    import("axios").then(({ default: axios }) => {
      import("@/api.config").then(({ BACKEND_URL }) => {
        const token = localStorage.getItem("token");
        axios
          .post(
            `${BACKEND_URL}/user/module/checkCfStatus`,
            { problem: activeModule?.data?.cf_name, handle },
            { headers: { Authorization: `Bearer ${token}` } },
          )
          .then((res) => {
            if (res.data.data.solved) {
              submitProgress(activeModule?.id as number, activeModule?.score ?? 0);
            } else {
              toast.error("You have not solved this problem yet!");
            }
          })
          .catch(() => {
            toast.error("Please provide a valid Codeforces handle!");
          });
      });
    });
  }, [activeModule, submitProgress]);

  // ── Discussions ───────────────────────────────────────────────────────────
  const {
    discussions,
    discussionLoading,
    newDiscussion,
    setNewDiscussion,
    activeThreads,
    setActiveThreads,
    subdiscussionTexts,
    setSubdiscussionTexts,
    subdiscussionComments,
    openDiscussionDeleteDialogue,
    setOpenDicussionDeleteDialogue,
    deleteOption,
    setDeleteOption,
    activeCommentDeletionData,
    setActiveCommentDeletionData,
    fetchDiscussions,
    fetchSubdiscussions,
    postSubdiscussion,
    submitNewDiscussion: submitNewDiscussionBase,
    deleteDiscussion,
  } = useDiscussions();

  const submitNewDiscussion = useCallback(() => {
    if (activeModule?.id) submitNewDiscussionBase(activeModule.id);
  }, [activeModule?.id, submitNewDiscussionBase]);

  // ── Module navigation ─────────────────────────────────────────────────────
  const goToModule = useCallback((module: CourseModule) => {
    if (!module) return;

    saveLastAccessedModule(courseId as string, module.id, module.chapter_id).catch(() => {});

    const category = module.data?.category;
    const taken = courseData?.isTaken || false;

    if (category === "ASSIGNMENT" && taken) {
      fetchEvalutedAssignment(module.id);
    }
    if (category === "VIDEO" || category === "PDF" || category === "TEXT") {
      submitProgress(module.id, module.score ?? 0);
    }

    setActiveModule(module);
    setMobileSidebarOpen(false);

    if (typeof window !== "undefined" && courseId) {
      window.history.replaceState(
        null,
        "",
        `/course/${courseId}/${module.chapter_id}/${module.id}`,
      );
    }
  }, [courseId, courseData, fetchEvalutedAssignment, submitProgress, setActiveModule]);

  // ── Side effects ──────────────────────────────────────────────────────────
  // Fetch discussions + auto-submit progress on module change
  useEffect(() => {
    if (!activeModule?.id) return;

    fetchDiscussions(activeModule.id);

    if (activeModule.is_free || courseData?.isTaken) {
      const cat = activeModule.data?.category;
      if (cat === "VIDEO" || cat === "PDF" || cat === "TEXT") {
        submitProgress(activeModule.id, activeModule.score ?? 0);
      }
    }
  }, [activeModule?.id, courseData?.isTaken, courseData?.maxModuleSerialProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll active module into view
  useEffect(() => {
    activeModuleRef?.current?.scrollIntoView({ behavior: "smooth", block: "center", inline: "start" });
  }, [activeModule?.id]);

  // Prefetch next module URL so navigation feels instant
  useEffect(() => {
    if (!courseId || !courseData || !activeModule) return;
    const nextModule = findObjectBySerial(courseData, (activeModule.serial ?? 0) + 1);
    if (nextModule) {
      router.prefetch(`/course/${courseId}/${nextModule.chapter_id}/${nextModule.id}`);
    }
  }, [activeModule?.id, courseId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Unlock chapter ────────────────────────────────────────────────────────
  const shouldShowUnlockChapterButton = useCallback((): boolean => {
    if (!courseData?.chapters || !chapterId) return false;
    const ch = courseData.chapters.find((c: Chapter) => c.id === parseInt(chapterId));
    return ch?.allowed_unlock === true;
  }, [courseData, chapterId]);

  const unlockCurrentChapter = useCallback(() => {
    if (!courseData?.chapters || !chapterId) return;
    const currentChapterId = parseInt(chapterId);
    const chapter = courseData.chapters.find((c: Chapter) => c.id === currentChapterId);
    const modules = chapter?.modules ?? [];
    if (modules.length === 0) { toast.error("No modules found in current chapter"); return; }
    const last = modules.reduce((a: CourseModule, b: CourseModule) => (b.serial > a.serial ? b : a));
    submitProgress(last.id, last.score ?? 0);
    toast.success("Chapter unlocked! All modules in this chapter are now accessible.");
    setTimeout(() => { refetch(); }, 1000);
  }, [courseData, chapterId, submitProgress, refetch]);

  const isActiveChapter = useCallback((chapter: Chapter): boolean => {
    return chapter.modules.some((m) => String(m.id) === String(activeModule?.id));
  }, [activeModule?.id]);

  // ── Initial progress for first-ever visit ────────────────────────────────
  // submitProgress on first module when maxModuleSerialProgress === 0 is now
  // handled inside useCourseData after fetch; kept here as a safety net if
  // courseData arrives with 0 after hook init.
  useEffect(() => {
    if (
      courseData &&
      courseData.maxModuleSerialProgress === 0 &&
      courseData.chapters?.[0]?.modules?.[0]
    ) {
      const first = courseData.chapters[0].modules[0];
      submitProgress(first.id, first.score ?? 0, courseData);
    }
  }, [courseData?.maxModuleSerialProgress]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Error state ───────────────────────────────────────────────────────────
  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg px-4">
        <Toaster />
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-destructive/15">
              <svg className="h-8 w-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-heading mb-4">Failed to Load Course</h2>
          <p className="text-paragraph mb-6">
            We couldn&apos;t load this course. Please check your internet connection and try again.
          </p>
          <button
            onClick={refetch}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="overflow-x-hidden">
      <Toaster />
      {pageLoading ? (
        <ModulePageSkeleton />
      ) : (
        <>
          {/* Floating compiler button — right side so it's reachable on mobile */}
          <button
            style={{ zIndex: 999 }}
            onClick={() => { setUser({ ...user, openCompiler: true }); }}
            className="fixed top-1/2 -translate-y-1/2 right-0 bg-[#0B060D] bg-opacity-30 backdrop-blur-lg border border-gray-200/20 p-3 hover:bg-gray-300/20 rounded-l-lg"
          >
            <svg width={40} height={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5 9L15.6716 9.17157C17.0049 10.5049 17.6716 11.1716 17.6716 12C17.6716 12.8284 17.0049 13.4951 15.6716 14.8284L15.5 15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M13.2942 7.17041L12.0001 12L10.706 16.8297" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8.49994 9L8.32837 9.17157C6.99504 10.5049 6.32837 11.1716 6.32837 12C6.32837 12.8284 6.99504 13.4951 8.32837 14.8284L8.49994 15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Discussions modal */}
          <Transition appear show={false} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {}}>
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                    <Dialog.Panel className="w-[90vw] md:w-[80vw] transform overflow-hidden rounded-2xl bg-[#0B060D]/60 dark:bg-[#0B060D]/30 backdrop-blur-lg border border-gray-200/20 p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title as="div" className="text-lg font-medium leading-6">
                        <div className="flex justify-end mb-4">
                          <svg className="cursor-pointer" width="30" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <g id="Icon-Set" transform="translate(-568.000000, -1087.000000)" fill="#ffffff">
                                <path d="M584,1117 C576.268,1117 570,1110.73 570,1103 C570,1095.27 576.268,1089 584,1089 C591.732,1089 598,1095.27 598,1103 C598,1110.73 591.732,1117 584,1117 L584,1117 Z M584,1087 C575.163,1087 568,1094.16 568,1103 C568,1111.84 575.163,1119 584,1119 C592.837,1119 600,1111.84 600,1103 C600,1094.16 592.837,1087 584,1087 L584,1087 Z M589.717,1097.28 C589.323,1096.89 588.686,1096.89 588.292,1097.28 L583.994,1101.58 L579.758,1097.34 C579.367,1096.95 578.733,1096.95 578.344,1097.34 C577.953,1097.73 577.953,1098.37 578.344,1098.76 L582.58,1102.99 L578.314,1107.26 C577.921,1107.65 577.921,1108.29 578.314,1108.69 C578.708,1109.08 579.346,1109.08 579.74,1108.69 L584.006,1104.42 L588.242,1108.66 C588.633,1109.05 589.267,1109.05 589.657,1108.66 C590.048,1108.27 590.048,1107.63 589.657,1107.24 L585.42,1103.01 L589.717,1098.71 C590.11,1098.31 590.11,1097.68 589.717,1097.28 L589.717,1097.28 Z" id="cross-circle" />
                              </g>
                            </g>
                          </svg>
                        </div>
                        <textarea
                          className="w-full px-3 py-3 rounded mb-2 resize-none bg-gray-200/20 outline-none focus:ring ring-gray-300/80 text-white"
                          placeholder="Write a question or an answer"
                          value={newDiscussion}
                          onChange={(e) => { setNewDiscussion(e.target.value); }}
                        />
                        <div className="flex justify-end mb-4">
                          <button onClick={submitNewDiscussion} className="py-2 px-8 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80 rounded font-semibold text-white text-lg">Submit</button>
                        </div>
                      </Dialog.Title>
                      <div className="mt-2 max-h-[50vh] overflow-y-scroll">
                        {discussions?.map((elem) => (
                          <div className="my-4" key={elem.id}>
                            <p className="text-white text-2xl">{String(elem.name ?? "")}</p>
                            <p className="text-white">{String(elem.content ?? "")}</p>
                          </div>
                        ))}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          {/* Delete confirmation dialog */}
          <Transition appear show={openDiscussionDeleteDialogue} as={Fragment}>
            <Dialog as="div" className="relative" style={{ zIndex: 99999 }} onClose={() => {}}>
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                    <Dialog.Panel className="w-[90vw] md:w-[50vw] lg:w-[40vw] text-darkHeading transform overflow-hidden rounded-2xl bg-gray-900/70 backdrop-blur-3xl border border-gray-300/30 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title as="div" className="text-lg font-medium leading-6 p-2">
                        <div className="flex justify-end">
                          <button className="hover:bg-gray-300/20 p-2 mr-2 rounded" onClick={() => { setOpenDicussionDeleteDialogue(false); }}>
                            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M13 1.25L1 13.25M1 1.25L13 13.25" stroke="#FBEEEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </Dialog.Title>
                      <div className="border-b border-t border-gray-300/20 py-3 px-6">
                        <div className="flex flex-col items-center">
                          <FontAwesomeIcon icon={faTriangleExclamation} className="text-4xl text-orange-300" />
                          <p className="text-xl font-bold text-darkHeading mt-1">Warning!</p>
                          <p className="text-darkHeading text-center mt-1">Do you want to delete your comment?</p>
                        </div>
                      </div>
                      <div className="p-6 flex gap-4">
                        <button onClick={() => { setOpenDicussionDeleteDialogue(false); }} className="bg-gray-300/30 hover:opacity-60 ease-in-out duration-150 text-darkHeading py-3 w-full rounded-xl font-bold">Cancel</button>
                        <button onClick={() => { deleteDiscussion(); setOpenDicussionDeleteDialogue(false); }} className="bg-red-600 hover:bg-opacity-50 ease-in-out duration-150 text-darkHeading py-3 w-full rounded-xl font-bold">Delete</button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          {/* Main layout */}
          <div className="py-16 bg-white dark:bg-[#0B060D] overflow-x-hidden">
            <div className="w-[90%] lgXl:w-[80%] mx-auto py-12 z-20">

              {/* Mobile-only top bar: course title + sidebar sheet trigger */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-xl font-semibold text-heading dark:text-darkHeading line-clamp-1 flex-1 mr-3">
                  {courseData?.title}
                </h2>
                <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                  <SheetTrigger
                    render={
                      <button
                        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300/30 bg-gray-100/10 hover:bg-gray-200/20 text-heading dark:text-darkHeading text-sm font-medium"
                        aria-label="Open course content"
                      />
                    }
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    Contents
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 flex flex-col bg-white dark:bg-[#0B060D]">
                    <SheetHeader className="px-4 pt-4 pb-2 border-b border-gray-300/20">
                      <SheetTitle className="text-heading dark:text-darkHeading text-base">
                        Course Contents
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-hidden">
                      <CourseSidebar
                        courseData={courseData}
                        activeModuleId={activeModule?.id}
                        activeModuleRef={activeModuleRef}
                        onSelectModule={goToModule}
                        isActiveChapter={isActiveChapter}
                        className="h-full border-0 rounded-none"
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex flex-col lg:flex-row gap-24 justify-between relative">
                {/* Background glow */}
                <svg viewBox="0 0 980 892" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute hidden -top-17.5 -left-50 h-full z-0">
                  <g filter="url(#filter0_f_261_7530)">
                    <ellipse cx="314.306" cy="293.812" rx="167.107" ry="94.0796" transform="rotate(-10.6934 314.306 293.812)" fill="#B153E0" />
                  </g>
                  <defs>
                    <filter id="filter0_f_261_7530" x="-350.838" y="-303.722" width="1330.29" height="1195.07" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                      <feGaussianBlur stdDeviation="250" result="effect1_foregroundBlur_261_7530" />
                    </filter>
                  </defs>
                </svg>

                {/* Content column */}
                <div style={{ flex: 2 }} className="text-heading dark:text-darkHeading z-10 min-w-0">
                  {/* Course title — desktop only (mobile shows it in the top bar above) */}
                  <h2 className="hidden lg:block text-2xl lg:text-4xl font-semibold mb-0">{courseData?.title}</h2>
                  {!(courseData?.isTaken || false) && (
                    <div className="flex gap-8 items-center pb-6 border-b border-gray-400/50 dark:border-gray-300/10 relative" />
                  )}
                  {(courseData?.isTaken || false) && (
                    <div className="pb-6 border-b border-gray-400/50 dark:border-gray-300/10" />
                  )}

                  <ModulePlayer
                    activeModule={activeModule as any}
                    courseData={courseData as any}
                    assignmentEvaluted={assignmentEvaluted}
                    assignmentSubmission={assignmentSubmission}
                    setAssignmentSubmission={setAssignmentSubmission as any}
                    submitAssignment={submitAssignment}
                    cfHandle=""
                    setCfHandle={() => {}}
                    checkCFStatus={checkCFStatus as any}
                    quizAnswer={quizAnswer}
                    setQuizAnswer={setQuizAnswer as any}
                    quizVerdict={quizVerdict}
                    showQuizAnswer={showQuizAnswer}
                    justSubmitted={justSubmitted}
                    timeRemaining={timeRemaining}
                    timerActive={timerActive}
                    timerExpired={timerExpired}
                    formatTime={formatTime}
                    getTimerColor={getTimerColor}
                    submitQuiz={submitQuiz}
                    retakeQuiz={retakeQuiz}
                    user={user}
                  />

                  {activeModule?.description && activeModule.description.length > 0 &&
                    activeModule?.data?.category !== "TEXT" && (
                    <div className="mt-12">
                      <p className="font-semibold text-2xl pb-4 border-b border-gray-300/10">Description</p>
                      <SafeHtmlRenderer
                        content={activeModule.description}
                        className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-lg text-paragraph dark:text-darkParagraph border-t border-gray-400/50 pt-2 dark:border-gray-300/10"
                      />
                    </div>
                  )}

                  <ModuleNavButtons
                    courseData={courseData as Course}
                    activeModule={activeModule as CourseModule}
                    courseId={courseId as string}
                    findObjectBySerial={findObjectBySerial}
                    goToModule={goToModule}
                    setActiveModule={setActiveModule}
                    shouldShowUnlockChapterButton={shouldShowUnlockChapterButton}
                    unlockCurrentChapter={unlockCurrentChapter}
                  />

                  {activeModule?.id && (courseData?.isTaken || activeModule?.is_free) && (
                    <div className="mt-8">
                      <ModuleFeedback moduleId={activeModule.id} moduleTitle={activeModule.title} />
                    </div>
                  )}

                  <div className="mt-10">
                    <DiscussionSection
                      discussions={discussions as any}
                      discussionLoading={discussionLoading}
                      newDiscussion={newDiscussion}
                      setNewDiscussion={setNewDiscussion}
                      submitNewDiscussion={submitNewDiscussion}
                      activeThreads={activeThreads}
                      setActiveThreads={setActiveThreads as any}
                      subdiscussionTexts={subdiscussionTexts}
                      setSubdiscussionTexts={setSubdiscussionTexts as any}
                      subdiscussionComments={subdiscussionComments as any}
                      fetchSubdiscussions={fetchSubdiscussions}
                      postSubdiscussion={postSubdiscussion}
                      setDeleteOption={setDeleteOption}
                      setOpenDicussionDeleteDialogue={setOpenDicussionDeleteDialogue}
                      setActiveCommentDeletionData={setActiveCommentDeletionData as any}
                    />
                  </div>
                </div>

                {/* Sidebar column — hidden on mobile, shown on lg+ */}
                <div style={{ flex: 1 }} className="hidden lg:block z-10 relative">
                  <CourseSidebar
                    courseData={courseData}
                    activeModuleId={activeModule?.id}
                    activeModuleRef={activeModuleRef}
                    onSelectModule={goToModule}
                    isActiveChapter={isActiveChapter}
                    className="max-h-[calc(100vh-8rem)] sticky top-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
