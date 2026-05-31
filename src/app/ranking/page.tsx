"use client";

import React, {
  Suspense,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  isLoggedIn,
  createLoginRedirectUrl,
  getUserIdFromToken,
} from "@/helpers";
import { useRanking } from "@/hooks/useRanking";
import {
  useCoursesWithRanking,
  CourseWithRanking,
} from "@/hooks/useCoursesWithRanking";

// Import new components
import { RankingPageSkeleton } from "@/components/Skeletons/RankingSkeletons";
import PodiumCard from "@/components/Ranking/PodiumCard";
import MyRankBanner from "@/components/Ranking/MyRankBanner";
import RankingTable from "@/components/Ranking/RankingTable";
import CourseSelector from "@/components/Ranking/CourseSelector";

const subscribeToHydration = () => () => {};
const getHydratedSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function useHydrated() {
  return useSyncExternalStore(
    subscribeToHydration,
    getHydratedSnapshot,
    getServerHydrationSnapshot,
  );
}

export default function RankingPage() {
  return (
    <Suspense fallback={<RankingPageSkeleton />}>
      <RankingPageContent />
    </Suspense>
  );
}

function RankingPageContent() {
  const hydrated = useHydrated();
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseIdFromUrl = searchParams.get("course");
  const courseIdFromUrlNumber =
    courseIdFromUrl && !Number.isNaN(Number(courseIdFromUrl))
      ? Number(courseIdFromUrl)
      : undefined;
  const [currentPage, setCurrentPage] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const itemsPerPage = 10;

  // Get userId from localStorage
  const [userId] = useState<number | undefined>(() => {
    if (typeof window === "undefined") return undefined;

    const userIdFromToken = getUserIdFromToken();
    return userIdFromToken ? parseInt(userIdFromToken) : undefined;
  });

  // Fetch courses with ranking
  const {
    courses: coursesWithRanking,
    loading: coursesLoading,
    error: coursesError,
  } = useCoursesWithRanking();

  const effectiveCourseId =
    courseIdFromUrlNumber ?? coursesWithRanking[0]?.id ?? 1;

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined" && !isLoggedIn()) {
      const loginUrl = createLoginRedirectUrl();
      router.replace(loginUrl);
      return;
    }

    if (!userId) {
      console.error("No userId found in JWT token");
    }
  }, [router, userId]);

  // Fetch ranking data
  const { rankingData, myData, top3, allRankings, loading, error, refetch } =
    useRanking({
      courseId: effectiveCourseId,
      offset: currentPage * itemsPerPage,
      limit: itemsPerPage,
      userId,
    });


  const handleCourseChange = (courseId: number) => {
    setCurrentPage(0);
    setDropdownOpen(false);

    // Update URL
    router.push(`/ranking?course=${courseId}`);
  };

  const selectedCourse = coursesWithRanking.find(
    (c: CourseWithRanking) => c.id === effectiveCourseId,
  );

  // Show loading state for initial data fetch
  if (
    !hydrated ||
    (loading && !rankingData) ||
    (coursesLoading && coursesWithRanking.length === 0)
  ) {
    return <RankingPageSkeleton />;
  }

  return (
      <main className="min-h-screen bg-background text-foreground">
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-primary/10 to-accent/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="w-[90%] lg:w-[85%] max-w-[1440px] mx-auto py-12">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-10"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-[2.6rem] lg:text-5xl font-extrabold leading-tight text-foreground mb-2"
              >
                কোর্স <span className="text-primary">র‍্যাঙ্কিং</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                নিজের অগ্রগতি দেখো, বন্ধুদের সাথে স্বাস্থ্যকর প্রতিযোগিতা করো,
                আর লিডারবোর্ডে জায়গা করে নাও।
              </motion.p>
            </motion.div>

            {/* Course Selector */}
            <CourseSelector
              courses={coursesWithRanking}
              selectedCourse={selectedCourse}
              isOpen={dropdownOpen}
              onToggle={() => setDropdownOpen(!dropdownOpen)}
              onSelect={handleCourseChange}
              loading={coursesLoading}
            />

            {/* Error State */}
            {(error || coursesError) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto mb-8 bg-destructive/10 border border-destructive/30 rounded-xl p-6 text-center backdrop-blur-lg"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-destructive/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"
                >
                  <svg
                    className="w-8 h-8 text-destructive"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
                <p className="text-destructive font-medium mb-4">
                  {error || coursesError}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (error) refetch();
                    if (coursesError) window.location.reload();
                  }}
                  className="px-6 py-2 bg-destructive/15 text-destructive rounded-lg hover:bg-destructive/25 transition-colors border border-destructive/30"
                >
                  আবার চেষ্টা করো
                </motion.button>
              </motion.div>
            )}

            {/* Top 3 Podium */}
            {top3.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mb-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {/* 2nd Place */}
                  {top3[1] && (
                    <PodiumCard user={top3[1]} position={2} delay={0.1} />
                  )}

                  {/* 1st Place */}
                  {top3[0] && (
                    <PodiumCard user={top3[0]} position={1} delay={0} />
                  )}

                  {/* 3rd Place */}
                  {top3[2] && (
                    <PodiumCard user={top3[2]} position={3} delay={0.2} />
                  )}
                </div>
              </motion.div>
            )}

            {/* My Rank Banner */}
            {myData && <MyRankBanner myData={myData} />}

            {/* Full Rankings Table */}
            <RankingTable
              rankings={allRankings}
              currentUserId={userId}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              loading={loading}
            />

            {/* No Data State */}
            {!loading && !error && allRankings.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto mt-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="bg-muted/70 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                >
                  <svg
                    className="w-12 h-12 text-muted-foreground"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  এখনো কোনো র‍্যাঙ্কিং নেই
                </h3>
                <p className="text-muted-foreground">
                  আগে মডিউল শেষ করো, তারপর লিডারবোর্ডে তোমার নাম দেখাও।
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </main>
  );
}
