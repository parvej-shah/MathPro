'use client';

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/Contexts/UserContext";
import { Toaster, toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { saveLastAccessedModule } from "@/utils/moduleAccessUtils";
import DiscussionSection from "@/components/DiscussionSection";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";
import ModuleFeedback from "@/components/ModuleFeedback";
import { ModulePageSkeleton } from "@/components/Skeletons";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import CourseSidebar from "./_components/CourseSidebar";
import ModulePlayer from "./_components/ModulePlayer";
import ModuleNavButtons from "./_components/ModuleNavButtons";
import PdfAttachment from "./_components/PdfAttachment";
import type { Chapter, Course, CourseModule } from "./_components/types";
import { useCourseData } from "./_hooks/useCourseData";
import { useModuleProgress } from "./_hooks/useModuleProgress";
import { useQuiz } from "./_hooks/useQuiz";
import { useQuizTimer } from "./_hooks/useQuizTimer";
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
  const [, setUser] = useContext(UserContext);
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
    setUser((prev) => ({ ...prev, scoreTrigger: !prev.scoreTrigger }));
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
  // Submitted-state, answers, verdict, and score are owned by the backend
  // (useQuiz fetches/persists them); the timer is local countdown only.
  const {
    quizAnswer,
    setQuizAnswer,
    quizVerdict,
    showQuizAnswer,
    attemptChecked,
    justSubmitted,
    submitting,
    submitError,
    clearSubmitError,
    submitQuiz: submitQuizBase,
  } = useQuiz(activeModule, submitProgress);

  const onTimerExpire = useCallback(() => {
    submitQuizBase();
  }, [submitQuizBase]);

  const {
    timeRemaining,
    timerActive,
    timerExpired,
    quizStarted,
    startQuiz,
    formatTime,
    getTimerColor,
    clearQuizTimer,
  } = useQuizTimer(activeModule, showQuizAnswer, onTimerExpire, attemptChecked);

  // Only stop the countdown once the server has actually recorded the attempt.
  // Clearing it unconditionally meant a failed submit silently ended the exam
  // with nothing saved and no way back.
  const submitQuiz = useCallback(async () => {
    const result = await submitQuizBase();
    if (result.submitted) clearQuizTimer();
  }, [submitQuizBase, clearQuizTimer]);

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
    fetchSubdiscussions,
    postSubdiscussion,
    submitNewDiscussion: submitNewDiscussionBase,
    deleteDiscussion,
  } = useDiscussions();

  const submitNewDiscussion = useCallback(() => {
    if (activeModule?.id) submitNewDiscussionBase(activeModule.id);
  }, [activeModule, submitNewDiscussionBase]);

  // ── Module navigation ─────────────────────────────────────────────────────
  const goToModule = useCallback((module: CourseModule) => {
    if (!module) return;

    saveLastAccessedModule(courseId as string, module.id, module.chapter_id).catch(() => {});

    const category = module.data?.category;

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
  }, [courseId, submitProgress, setActiveModule]);

  // ── Side effects ──────────────────────────────────────────────────────────
  // Auto-submit progress on module change
  useEffect(() => {
    if (!activeModule?.id) return;

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
          <h2 className="text-2xl font-bold text-foreground mb-4">Failed to Load Course</h2>
          <p className="text-muted-foreground mb-6">
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
    // overflow-x-clip, not -hidden: `hidden` makes this a scroll container,
    // which silently kills `position: sticky` for the quiz timer inside.
    // `clip` suppresses the horizontal overflow without that side effect.
    <div className="overflow-x-clip">
      <Toaster />
      {pageLoading ? (
        <div className="pt-24 pb-8">
          <ModulePageSkeleton />
        </div>
      ) : (
        <>
          {/* Discussions modal */}
          <Transition appear show={false} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {}}>
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                    <Dialog.Panel className="w-[90vw] md:w-[80vw] transform overflow-hidden rounded-2xl bg-card/80 backdrop-blur-lg border border-border/20 p-6 text-left align-middle shadow-xl transition-all">
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
                          className="w-full px-3 py-3 rounded mb-2 resize-none bg-gray-200/20 outline-none focus:ring ring-border/50 text-foreground"
                          placeholder="Write a question or an answer"
                          value={newDiscussion}
                          onChange={(e) => { setNewDiscussion(e.target.value); }}
                        />
                        <div className="flex justify-end mb-4">
                          <button onClick={submitNewDiscussion} className="py-2 px-8 bg-primary hover:bg-primary/85 ease-in-out duration-150 focus:ring ring-primary/30 rounded-lg font-semibold text-primary-foreground text-lg">Submit</button>
                        </div>
                      </Dialog.Title>
                      <div className="mt-2 max-h-[50vh] overflow-y-scroll">
                        {discussions?.map((elem) => (
                          <div className="my-4" key={elem.id}>
                            <p className="text-foreground text-2xl">{String(elem.name ?? "")}</p>
                            <p className="text-muted-foreground">{String(elem.content ?? "")}</p>
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
                    <Dialog.Panel className="w-[90vw] md:w-[50vw] lg:w-[40vw] text-foreground transform overflow-hidden rounded-2xl bg-card/90 backdrop-blur-3xl border border-border/30 text-left align-middle shadow-xl transition-all">
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
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-orange-300"><path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg>
                          <p className="text-xl font-bold text-foreground mt-1">Warning!</p>
                          <p className="text-foreground text-center mt-1">Do you want to delete your comment?</p>
                        </div>
                      </div>
                      <div className="p-6 flex gap-4">
                        <button onClick={() => { setOpenDicussionDeleteDialogue(false); }} className="bg-muted/30 hover:opacity-60 ease-in-out duration-150 text-foreground py-3 w-full rounded-xl font-bold">Cancel</button>
                        <button onClick={() => { deleteDiscussion(); setOpenDicussionDeleteDialogue(false); }} className="bg-destructive hover:bg-destructive/80 ease-in-out duration-150 text-white py-3 w-full rounded-xl font-bold">Delete</button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>

          {/* Main layout */}
          <div className="pt-24 pb-8 bg-background overflow-x-clip">
            <div className="w-[90%] lgXl:w-[80%] mx-auto z-20">

              {/* Mobile-only top bar: course title + sidebar sheet trigger */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-xl font-semibold text-foreground line-clamp-1 flex-1 mr-3">
                  {courseData?.title}
                </h2>
                <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                  <SheetTrigger
                    render={
                      <button
                        className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg border border-border/30 bg-muted/10 hover:bg-muted/20 text-foreground text-sm font-medium"
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
                  <SheetContent side="right" showCloseButton={false} className="w-[85vw] sm:w-[400px] p-0 flex flex-col bg-background">
                    {/* Visually-hidden title for a11y; the sidebar renders its own header. */}
                    <SheetHeader className="sr-only">
                      <SheetTitle>Course Contents</SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-hidden p-3">
                      <CourseSidebar
                        courseData={courseData}
                        activeModuleId={activeModule?.id}
                        activeModuleRef={activeModuleRef}
                        onSelectModule={goToModule}
                        isActiveChapter={isActiveChapter}
                        className="h-full border-0 rounded-none"
                        onClose={() => setMobileSidebarOpen(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex flex-col lg:flex-row gap-24 justify-between relative">
                {/* Background glow */}
                <svg viewBox="0 0 980 892" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute hidden -top-17.5 -left-50 h-full z-0">
                  <g filter="url(#filter0_f_261_7530)">
                    <ellipse cx="314.306" cy="293.812" rx="167.107" ry="94.0796" transform="rotate(-10.6934 314.306 293.812)" fill="oklch(0.718 0.147 159.2)" />
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
                <div style={{ flex: 2 }} className="text-foreground z-10 min-w-0">
                  {/* Course title — desktop only (mobile shows it in the top bar above) */}
                  <h2 className="hidden lg:block text-2xl lg:text-3xl font-semibold mb-3 pb-3 border-b border-border/50">{courseData?.title}</h2>

                  {activeModule && (
                    <ModulePlayer
                      activeModule={activeModule}
                      quizAnswer={quizAnswer}
                      setQuizAnswer={setQuizAnswer}
                      quizVerdict={quizVerdict}
                      showQuizAnswer={showQuizAnswer}
                      justSubmitted={justSubmitted}
                      submitting={submitting}
                      submitError={submitError}
                      clearSubmitError={clearSubmitError}
                      timeRemaining={timeRemaining}
                      timerActive={timerActive}
                      timerExpired={timerExpired}
                      quizStarted={quizStarted}
                      startQuiz={startQuiz}
                      formatTime={formatTime}
                      getTimerColor={getTimerColor}
                      submitQuiz={submitQuiz}
                    />
                  )}

                  {activeModule?.description && activeModule.description.length > 0 &&
                    activeModule?.data?.category !== "TEXT" &&
                    activeModule?.data?.category !== "QUIZ" && (
                    <div className="mt-12">
                      <p className="font-semibold text-2xl pb-4 border-b border-gray-300/10">Description</p>
                      <SafeHtmlRenderer
                        content={activeModule.description}
                        className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-lg text-muted-foreground border-t border-border/50 pt-2"
                      />
                    </div>
                  )}

                  {activeModule?.data?.category === "VIDEO" &&
                    !!(activeModule?.pdf_drive_link || activeModule?.data?.pdf_drive_link || activeModule?.data?.pdf_attachment) && (
                    <PdfAttachment
                      url={String(activeModule.pdf_drive_link || activeModule.data?.pdf_drive_link || activeModule.data?.pdf_attachment)}
                    />
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

                  {/* {activeModule?.id && (courseData?.isTaken || activeModule?.is_free) && (
                    <div className="mt-8">
                      <ModuleFeedback moduleId={activeModule.id} moduleTitle={activeModule.title} />
                    </div>
                  )} */}

                  {/* <div className="mt-10">
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
                  </div> */}
                </div>

                {/* Sidebar column — hidden on mobile, shown on lg+ */}
                <div style={{ flex: 1 }} className="hidden lg:block z-10 relative">
                  <CourseSidebar
                    courseData={courseData}
                    activeModuleId={activeModule?.id}
                    activeModuleRef={activeModuleRef}
                    onSelectModule={goToModule}
                    isActiveChapter={isActiveChapter}
                    className="max-h-[calc(100vh-7rem)] sticky top-24"
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
