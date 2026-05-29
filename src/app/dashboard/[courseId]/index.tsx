import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
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
import { useLmsPreference } from "@/hooks/useLmsPreference";
import { isLmsPreferenceCourse, getCpLmsUrlForCourse } from "@/constants/lmsPreference";
import LmsPreferenceModal from "@/components/LmsPreferenceModal";

export default function CourseDashboardPage() {
    const router = useRouter();
    const { courseId } = router.query;
    const [mounted, setMounted] = useState(false);
    const { lmsPreference, loading: lmsLoading, setLmsPreference, error: lmsError } = useLmsPreference();

    // Debug logging
    // console.log('🔍 CourseDashboardPage render:', {
    //     isReady: router.isReady,
    //     courseId,
    //     pathname: router.pathname
    // });

    // Fetch real course data - only when router is ready and courseId is available
    const shouldFetch = router.isReady && !!courseId && !Array.isArray(courseId);

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
    } = useAnnouncements(shouldFetch ? (courseId as string) : undefined, 6, 0);

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
        if (courseData && courseId && !Array.isArray(courseId)) {
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
            if (!courseId || Array.isArray(courseId) || !courseData) {
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

    // Debug: Track when router becomes ready
    useEffect(() => {
        // console.log('🔄 Router state changed:', {
        //     isReady: router.isReady,
        //     courseId,
        //     shouldFetch
        // });
    }, [router.isReady, courseId, shouldFetch]);

    // Wait for router to be ready before checking authentication
    useEffect(() => {
        if (!router.isReady) return;

        if (!isLoggedIn()) {
            const currentDomain = window.location.href;
            window.location.href = `https://www.codervai.com/auth/login?redirect=${encodeURIComponent(currentDomain)}`;
            return;
        }
    }, [router.isReady, router]);

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
        !router.isReady ||
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
                <div className="min-h-screen bg-white dark:bg-[#0B060D] flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-heading dark:text-darkHeading mb-2">
                            Error Loading Course
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {courseError}
                        </p>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="bg-purple text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple/90 transition-colors"
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
        <div className="min-h-screen bg-white dark:bg-[#0B060D] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Redirecting to course details...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

    const showLmsModal = Boolean(
        mounted &&
        router.isReady &&
        courseId &&
        !Array.isArray(courseId) &&
        isLmsPreferenceCourse(courseId) &&
        lmsPreference === null &&
        !lmsLoading &&
        isLoggedIn()
    );

    return (
        <DashboardLayout key={courseId as string}>
            <LmsPreferenceModal
                isOpen={showLmsModal}
                onClose={() => {}}
                setLmsPreference={setLmsPreference}
                error={lmsError}
            />
            <main className="pt-20 bg-white dark:bg-[#0B060D] min-h-screen">
                <div className="w-[95%] lg:w-[90%] xl:w-[85%] mx-auto py-8 lg:py-12">
                    {/* Course Title Section - REAL DATA */}
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-heading dark:text-darkHeading">
                            {courseData?.title || "Course Dashboard"}
                        </h1>
                    </div>

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
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
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
                                continueLearningUrl={
                                    lmsPreference === 'locked' && courseId && !Array.isArray(courseId) && isLmsPreferenceCourse(courseId)
                                        ? getCpLmsUrlForCourse(courseId)
                                        : undefined
                                }
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
                        <div className="lg:col-span-2 space-y-8">
                            {/* Ranking Card - Shows user's current rank and score */}
                            <RankingCard
                                courseId={courseId as string}
                                loading={courseLoading}
                            />

                            {/* Announcements - REAL DATA from Announcements API
                                Always shows latest announcement as featured
                                Remaining announcements shown in list below (if any)
                                Limited to 6 most recent announcements */}
                            <AnnouncementsCard
                                announcements={announcements}
                                loading={announcementsLoading}
                                totalCount={totalCount}
                            />

                            {/* Important Messages Link - Link to post-payment success page */}
                            {courseData?.id && (
                                <Link
                                    href={`/post-payment/success?type=course&courseId=${courseData.id}`}
                                    className="block"
                                >
                                    <div className="bg-purple/10 dark:bg-purple/20 border border-purple/30 rounded-xl p-6 hover:bg-purple/20 dark:hover:bg-purple/30 transition-all duration-200 group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0 w-12 h-12 bg-purple/20 dark:bg-purple/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <svg
                                                    className="w-6 h-6 text-purple"
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
                                                <h3 className="font-bold text-heading dark:text-darkHeading text-lg mb-1 group-hover:text-purple transition-colors">
                                                    গুরুত্বপূর্ণ বার্তা দেখুন
                                                </h3>
                                                <p className="text-sm text-paragraph dark:text-darkParagraph">
                                                    এনরোলমেন্টের পরের গুরুত্বপূর্ণ তথ্য এবং নির্দেশাবলী
                                                    দেখুন
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="w-5 h-5 text-purple group-hover:translate-x-1 transition-transform"
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
                    </div>

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
