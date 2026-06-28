"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { isLoggedIn, redirectToLogin } from "@/helpers";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import CourseDashboardLoadingSkeleton from "@/components/Dashboard/CourseDashboardLoadingSkeleton";

import { useCourseDashboard } from "@/hooks/useCourseDashboard";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { useCourseRoutine } from "@/hooks/useCourseRoutine";
import { useCourseLiveModules } from "@/hooks/useCourseLiveModules";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { recordCourseView } from "@/utils/courseViewTracker";
import { getMostRecentModule } from "@/services/moduleViewService";
import {
    RoutineHero,
    ProgressCard,
    LiveClassesSection,
    AnnouncementsCard,
    CommunityCard,
    FeedbackCard,
    StreakCountCard,
    RankingCard,
} from "@/components/Dashboard/CourseDashboard";
import { sectionVariants, containerVariants, itemVariants } from "@/components/Dashboard/motion";
export default function CourseDashboardPage() {
    const router = useRouter();
    const params = useParams<{ courseId: string }>();
    const courseId = params?.courseId;
    const [mounted, setMounted] = useState(false);

    // Fetch real course data once courseId is available
    const shouldFetch = typeof courseId === "string" && courseId.length > 0;

    const {
        courseData,
        loading: courseLoading,
        error: courseError,
        authExpired,
    } = useCourseDashboard(shouldFetch ? courseId : undefined);
    const { historyData, loading: historyLoading } = usePaymentHistory();
    const { routineData } = useCourseRoutine(shouldFetch ? courseId : undefined);
    const {
        liveModules,
        loading: liveClassesLoading,
    } = useCourseLiveModules(shouldFetch ? courseId : undefined);
    const {
        announcements,
        totalCount,
        loading: announcementsLoading,
    } = useAnnouncements(shouldFetch ? courseId : undefined, 6, 0);

    // Generate placeholder thumbnail with course name
    const generatePlaceholderThumbnail = (
        courseName: string,
        courseId: string,
    ) => {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(courseName)}&size=800&background=random&color=fff&bold=true&format=svg`;
    };

    // Get routine image: routine API > course thumbnail > placeholder
    const routineImage = React.useMemo(() => {
        // Priority 1: Routine image from routine API
        if (routineData?.routine_image_url) {
            return routineData.routine_image_url;
        }
        // Priority 2: Course thumbnail from new API structure (frontend-guide-user.md §5)
        if (courseData?.thumbnails?.course_thumbnail_16_9) {
            return courseData.thumbnails.course_thumbnail_16_9;
        }
        // Priority 3: Placeholder with course name
        const courseName = courseData?.title || "Course";
        return generatePlaceholderThumbnail(courseName, courseId as string);
    }, [routineData, courseData, courseId]);

    // Calculate REAL progress from course data (using new API structure)
    const calculateProgress = () => {
        // New dashboard API structure
        if (courseData && courseData.progress) {
            return {
                progress: courseData.progress.progressPercentage,
                totalModules: courseData.progress.totalModules,
                completedModules: courseData.progress.completedModules,
                totalLessons: courseData.progress.totalModules,
                completedLessons: courseData.progress.completedModules,
                currentModule: Math.min(courseData.progress.completedModules + 1, courseData.progress.totalModules),
            };
        }

        // Fallback for old structure (backward compatibility)
        if (!courseData || !courseData.chapters) {
            return {
                progress: 0,
                totalModules: 0,
                completedModules: 0,
                totalLessons: 0,
                completedLessons: 0,
                currentModule: 1,
            };
        }

        // Calculate total modules and lessons from chapters
        const totalModules = courseData.chapters.reduce(
            (sum: number, chapter: any) => sum + (chapter.modules?.length || 0),
            0,
        );

        const totalLessons = totalModules; // Each module is a lesson

        // Get completed modules from maxModuleSerialProgress
        const completedModules = courseData.maxModuleSerialProgress || 0;
        const completedLessons = completedModules;

        // Calculate progress percentage
        const progress =
            totalModules > 0
                ? Math.round((completedModules / totalModules) * 100)
                : 0;

        // Current module is the next one to complete
        const currentModule = Math.min(completedModules + 1, totalModules);

        return {
            progress,
            totalModules,
            completedModules,
            totalLessons,
            completedLessons,
            currentModule,
        };
    };

    const progressInfo = calculateProgress();
    const calculatedProgress = progressInfo.progress;
    const totalModules = progressInfo.totalModules;
    const totalLessons = progressInfo.totalLessons;
    const completedLessons = progressInfo.completedLessons;
    const currentModule = progressInfo.currentModule;

    // Track course view when course data is loaded
    useEffect(() => {
        if (courseData && courseId) {
            const courseIdNum = parseInt(courseId);
            if (!isNaN(courseIdNum)) {
                recordCourseView(courseIdNum, calculatedProgress);
            }
        }
    }, [courseData, courseId, calculatedProgress]);

    // Get next lesson from backend API (mostRecent endpoint returns nextModule)
    const [nextLesson, setNextLesson] = React.useState<{
        title: string;
        chapterTitle: string;
        moduleId?: number;
        chapterId?: number;
    } | null>(null);
    const [nextLessonLoading, setNextLessonLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchNextLesson = async () => {
            if (!courseId || !courseData) {
                return;
            }

            setNextLessonLoading(true);
            try {
                const response = await getMostRecentModule(courseId);
                
                if (response.success && response.data.nextModule) {
                    setNextLesson({
                        title: response.data.nextModule.moduleTitle,
                        chapterTitle: response.data.nextModule.chapterTitle,
                        moduleId: response.data.nextModule.moduleId,
                        chapterId: response.data.nextModule.chapterId,
                    });
                } else {
                    // Fallback to progress-based calculation if API doesn't return nextModule
                    if (courseData?.chapters && courseData.chapters.length > 0) {
                        const completedModules = courseData.maxModuleSerialProgress || 0;
                        let moduleCount = 0;

                        for (const chapter of courseData.chapters) {
                            if (!chapter.modules) continue;

                            for (const courseModule of chapter.modules) {
                                moduleCount++;
                                if (moduleCount === completedModules + 1) {
                                    setNextLesson({
                                        title: courseModule.title,
                                        chapterTitle: chapter.title,
                                        moduleId: courseModule.id,
                                        chapterId: courseModule.chapter_id,
                                    });
                                    setNextLessonLoading(false);
                                    return;
                                }
                            }
                        }
                    }
                    setNextLesson(null);
                }
            } catch (error) {
                // Fallback to progress-based calculation on error
                console.warn("Failed to get next lesson from API, using fallback:", error);
                if (courseData?.chapters && courseData.chapters.length > 0) {
                    const completedModules = courseData.maxModuleSerialProgress || 0;
                    let moduleCount = 0;

                    for (const chapter of courseData.chapters) {
                        if (!chapter.modules) continue;

                        for (const courseModule of chapter.modules) {
                            moduleCount++;
                            if (moduleCount === completedModules + 1) {
                                setNextLesson({
                                    title: courseModule.title,
                                    chapterTitle: chapter.title,
                                    moduleId: courseModule.id,
                                    chapterId: courseModule.chapter_id,
                                });
                                setNextLessonLoading(false);
                                return;
                            }
                        }
                    }
                }
                setNextLesson(null);
            } finally {
                setNextLessonLoading(false);
            }
        };

        fetchNextLesson();
    }, [courseId, courseData]);

    useEffect(() => {
        setMounted(true);
    }, []);

    
    useEffect(() => {
        if (!isLoggedIn()) {
            const currentDomain = window.location.href;
            window.location.href = `/auth/login?redirect=${encodeURIComponent(currentDomain)}`;
            return;
        }
    }, [router]);

    // Token was present but the backend rejected it as expired/invalid: clear it
    // and bounce to login (returning here after re-auth) instead of showing the
    // dead-end "Error Loading Course" card.
    useEffect(() => {
        if (authExpired) {
            redirectToLogin();
        }
    }, [authExpired]);

    // Check if user has access to this course and get transaction_id
    const courseAccess = historyData?.individual_courses?.find(
        (course) => course.course_id.toString() === courseId,
    );

    const bundleAccess = historyData?.bundle_purchases?.find((bundle) =>
        bundle.courses?.some((course) => course.id.toString() === courseId),
    );

    const hasAccess = !!courseAccess || !!bundleAccess;

    // Get transaction_id (access code) from either individual course or bundle
    const accessCode =
        courseAccess?.transaction_id || bundleAccess?.transaction_id;

    // Show initial loading only while router is not ready or critical data is loading
    // Allow partial loading for other sections
    const showInitialLoading =
        !mounted ||
        (courseLoading && !courseData) ||
        (historyLoading && !historyData);

    if (showInitialLoading) {
        return (
            <DashboardLayout>
                <CourseDashboardLoadingSkeleton />
            </DashboardLayout>
        );
    }

    // An expired/invalid session redirects to login (effect above). Show the
    // loading skeleton meanwhile instead of flashing the error card.
    if (authExpired) {
        return (
            <DashboardLayout>
                <CourseDashboardLoadingSkeleton />
            </DashboardLayout>
        );
    }

    if (courseError) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-page-bg flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="text-destructive text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            কোর্স লোড করা যায়নি
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {courseError}
                        </p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                        >
                            ড্যাশবোর্ডে ফিরে যাও
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

  // Security: Check if user has access to this course - redirect to course details if no access
  if (
    mounted &&
    historyData &&
    !hasAccess &&
    courseId
  ) {
    router.replace(`/course-details/${courseId}`);
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-page-bg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              Redirecting to course details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

    return (
        <DashboardLayout key={courseId as string}>
            <main className="pt-20 bg-page-bg min-h-screen">
                <div className="w-[95%] sm:w-[92%] lg:w-[90%] xl:w-[85%] mx-auto py-5 sm:py-8 lg:py-12">
                    {/* Course Title Section - REAL DATA */}
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        animate="show"
                        className="mb-8"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
                            {courseData?.title || "Course Dashboard"}
                        </h1>

                        {/* Outline link (frontend-guide-user.md §5) */}
                        {courseData?.metadata?.course_outline && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {courseData?.metadata?.course_outline && (
                                    <a
                                        href={courseData.metadata.course_outline}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1 rounded-full text-xs font-semibold bg-card text-foreground border border-border hover:border-primary/40 hover:bg-primary/5 transition-all inline-flex items-center gap-1"
                                    >
                                        কোর্স আউটলাইন
                                        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        )}
                    </motion.div>

                    {/* Section A: The Hero (The Routine) - ROUTINE IMAGE from API */}
                    <RoutineHero
                        routineImage={routineImage}
                        courseTitle={courseData?.title || "Course"}
                        currentModule={currentModule}
                        totalModules={totalModules}
                        routineDownloadUrl={routineData?.routine_image_url}
                        loading={courseLoading}
                    />

                    {/* Section B: The "Action Zone".
                        Two independent columns on desktop (flex) so each stack flows by its
                        own content height — no row-pinning, so the columns can't leave a void
                        when one side is taller. Mobile: a single ordered column via `order-*`
                        on a flat list, with `lg:contents` dissolving the column wrappers so
                        the flat order applies. */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8"
                    >
                        {/* Left column (≈60%) */}
                        <div className="contents lg:flex lg:flex-3 lg:flex-col lg:gap-6">
                            <motion.div variants={itemVariants} className="order-1 lg:order-0">
                                <StreakCountCard
                                    courseId={courseId as string}
                                    loading={courseLoading}
                                />
                            </motion.div>
                            <motion.div variants={itemVariants} className="order-2 lg:order-0">
                                <ProgressCard
                                    currentModule={currentModule}
                                    progress={calculatedProgress}
                                    courseId={courseId as string}
                                    nextLesson={nextLesson}
                                    loading={courseLoading}
                                />
                            </motion.div>
                            <motion.div variants={itemVariants} className="order-4 lg:order-0">
                                <LiveClassesSection
                                    liveModules={liveModules}
                                    loading={liveClassesLoading}
                                />
                            </motion.div>
                            <motion.div variants={itemVariants} className="order-7 lg:order-0">
                                <FeedbackCard
                                    courseId={courseId as string}
                                    loading={courseLoading}
                                />
                            </motion.div>
                        </div>

                        {/* Right column (≈40%) */}
                        <div className="contents lg:flex lg:flex-2 lg:flex-col lg:gap-6">
                            {/* Ranking — high on mobile (gamified reward), top of right column */}
                            <motion.div variants={itemVariants} className="order-3 lg:order-0">
                                <RankingCard
                                    courseId={courseId as string}
                                    loading={courseLoading}
                                />
                            </motion.div>
                            <motion.div variants={itemVariants} className="order-5 lg:order-0">
                                <AnnouncementsCard
                                    announcements={announcements}
                                    loading={announcementsLoading}
                                    totalCount={totalCount}
                                />
                            </motion.div>
                            <motion.div variants={itemVariants} className="order-6 lg:order-0">
                                <CommunityCard
                                    communityLink={courseData?.community?.facebook_private_group}
                                    telegramLink={courseData?.community?.telegram_group}
                                    accessCode={accessCode}
                                />
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </main>
        </DashboardLayout>
    );
}
