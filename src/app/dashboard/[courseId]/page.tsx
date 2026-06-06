"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { isLoggedIn } from "@/helpers";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import CourseDashboardLoadingSkeleton from "@/components/Dashboard/CourseDashboardLoadingSkeleton";

import { useCourseDashboard } from "@/hooks/useCourseDashboard";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { useAllCourses } from "@/hooks/useAllCourses";
import { useCourseRoutine } from "@/hooks/useCourseRoutine";
import { useLiveClasses } from "@/hooks/useLiveClasses";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { recordCourseView } from "@/utils/courseViewTracker";
import { getMostRecentModule } from "@/services/moduleViewService";
import {
    RoutineHero,
    ProgressCard,
    LiveClassesSection,
    AnnouncementsCard,
    CommunityCard,
    RecommendedCourses,
    FeedbackCard,
    StreakCountCard,
    RankingCard,
} from "@/components/Dashboard/CourseDashboard";
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
    } = useCourseDashboard(shouldFetch ? courseId : undefined);
    const { historyData, loading: historyLoading } = usePaymentHistory();
    const { courses: allCourses } = useAllCourses();
    const { routineData } = useCourseRoutine(shouldFetch ? courseId : undefined);
    const {
        liveClasses,
        loading: liveClassesLoading,
        serverTime,
    } = useLiveClasses(shouldFetch ? courseId : undefined);
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
        // Priority 2: Course thumbnail from new API structure
        if (courseData?.thumbnails?.course_thumbnail_link_16_9) {
            return courseData.thumbnails.course_thumbnail_link_16_9;
        }
        if (courseData?.thumbnails?.course_thumbnail_link) {
            return courseData.thumbnails.course_thumbnail_link;
        }
        // Priority 3: Placeholder with course name
        const courseName = courseData?.title || "Course";
        return generatePlaceholderThumbnail(courseName, courseId as string);
    }, [routineData, courseData, courseId]);

    // Get 2 random courses for recommendations (excluding current course and all purchased courses)
    const recommendedCourses = React.useMemo(() => {
        if (!historyData) return [];

        // Get all purchased course IDs (individual courses + courses from bundles)
        const purchasedCourseIds = new Set<number>();

        // Add individual courses
        historyData.individual_courses?.forEach((course) => {
            purchasedCourseIds.add(course.course_id);
        });

        // Add courses from bundles
        historyData.bundle_purchases?.forEach((bundle) => {
            bundle.courses?.forEach((course) => {
                purchasedCourseIds.add(course.id);
            });
        });

        // Filter out current course and all purchased courses
        return allCourses
            .filter((course) => {
                const courseIdNum =
                    typeof course.id === "string" ? parseInt(course.id) : course.id;
                return (
                    course.id.toString() !== courseId &&
                    !purchasedCourseIds.has(courseIdNum)
                );
            })
            .slice(0, 2);
    }, [allCourses, courseId, historyData]);

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

    if (courseError) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-page-bg flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">
                            Error Loading Course
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {courseError}
                        </p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        >
                            Back to Dashboard
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
                <div className="w-[95%] lg:w-[90%] xl:w-[85%] mx-auto py-8 lg:py-12">
                    {/* Course Title Section - REAL DATA */}
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        animate="show"
                        className="mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                            {courseData?.title || "Course Dashboard"}
                        </h1>
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

                    {/* Section B: The "Action Zone" (Split Layout) */}
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.08, duration: 0.35 }}
                        className="grid grid-cols-1 lg:grid-cols-5 gap-8"
                    >
                        {/* Left Column: Progress & Learning (60% -> col-span-3) */}
                        <div className="lg:col-span-3 space-y-8">
                            {/* Streak Count Card */}
                            <StreakCountCard
                                courseId={courseId as string}
                                loading={courseLoading}
                            />

                            {/* Current Status Card - DYNAMIC PROGRESS from course data */}
                            <ProgressCard
                                currentModule={currentModule}
                                progress={calculatedProgress}
                                courseId={courseId as string}
                                nextLesson={nextLesson}
                                loading={courseLoading}
                            />

                            {/* Live Classes - REAL DATA from Live Classes API */}
                            <LiveClassesSection
                                liveClasses={liveClasses}
                                serverTime={serverTime}
                                loading={liveClassesLoading}
                            />

                            {/* Feedback Card */}
                            <FeedbackCard
                                courseId={courseId as string}
                                loading={courseLoading}
                            />
                        </div>

                        {/* Right Column: Community & Updates (40% -> col-span-2) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Ranking Card - Shows user's current rank and score */}
                            <RankingCard
                                courseId={courseId as string}
                                loading={courseLoading}
                            />

                            {/* Announcements - REAL DATA from Announcements API
                                Always shows latest announcement as featured
                                Remaining announcements shown in list below (if any)
                                Limited to 6 most recent announcements */}
                            <div className="mt-6">
                                <AnnouncementsCard
                                    announcements={announcements}
                                    loading={announcementsLoading}
                                    totalCount={totalCount}
                                />
                            </div>

                            {/* Important Messages Link - Link to post-payment success page */}
                            {courseData?.id && (
                                <Link
                                    href={`/post-payment/success?type=course&courseId=${courseData.id}`}
                                    className="block"
                                >
                                    <div className="bg-card border border-primary/25 rounded-2xl p-6 hover:bg-primary/10 transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-lg hover:shadow-primary/10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <svg
                                                    className="w-6 h-6 text-primary"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                                                    গুরুত্বপূর্ণ বার্তা দেখুন
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    এনরোলমেন্টের পরের গুরুত্বপূর্ণ তথ্য এবং নির্দেশাবলী
                                                    দেখুন
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Community Access - REAL ACCESS CODE from payment history */}
                            <CommunityCard
                                communityLink={
                                    courseData?.community?.facebook_private_group ||
                                    "https://www.facebook.com/groups/codervaicommunity"
                                }
                                accessCode={accessCode}
                            />
                        </div>
                    </motion.div>

                    {/* Section C: Recommended Courses - REAL DATA from courses API */}
                    {recommendedCourses.length > 0 && (
                        <RecommendedCourses
                            courses={recommendedCourses}
                            isMockData={false}
                        />
                    )}
                </div>
            </main>
        </DashboardLayout>
    );
}
    const sectionVariants = {
        hidden: { opacity: 0, y: 16 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.35, ease: "easeOut" as const },
        },
    };
