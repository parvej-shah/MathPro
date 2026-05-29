"use client";

import { useEffect, useState } from "react";
import { isLoggedIn, createLoginRedirectUrl } from "@/helpers";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardLoadingSkeleton from "@/components/Dashboard/DashboardLoadingSkeleton";
import ResumeBanner from "@/components/Dashboard/ResumeBanner";
import {
  DashboardHeader,
  StatsSection,
  SearchAndFilters,
  CoursesSection,
  EmptyState,
  useDashboardData,
  useDashboardFilters,
  useBundleExpansion,
} from "@/components/Dashboard/DashboardPage";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined" && !isLoggedIn()) {
      const loginUrl = createLoginRedirectUrl();
      window.location.href = loginUrl;
    }
  }, []);

  const {
    courses,
    allIndividualCourses,
    isLoading,
    error,
    generatePlaceholderThumbnail,
    allProgressCalculated,
  } = useDashboardData();

  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    availableBundles,
    filteredCourses,
    mostRecentCourse,
    stats,
  } = useDashboardFilters(courses, allIndividualCourses);

  const { expandedBundleId, expandedBundleCourses, handleShowAll, handleBackToBundles } =
    useBundleExpansion({
      generatePlaceholderThumbnail,
    });

  if (!mounted) return null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardLoadingSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-page-bg">
          <div className="text-center max-w-md mx-auto p-8 rounded-2xl border border-border bg-card">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Unable to Load Dashboard
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const hasFilters = searchTerm !== "" || filterStatus !== "All" || filterType !== "All";

  return (
    <DashboardLayout>
      <main className="pt-20 min-h-screen bg-page-bg">
        <div className="w-[90%] lg:w-[85%] max-w-[1440px] mx-auto py-12">
          <DashboardHeader />

          <StatsSection
            totalCourses={stats.totalCourses}
            totalBundles={stats.totalBundles}
            totalIndividualCourses={stats.totalIndividualCourses}
          />

          {!allProgressCalculated ? (
            <ResumeBanner isLoading={true} />
          ) : mostRecentCourse ? (
            <ResumeBanner course={mostRecentCourse} />
          ) : null}

          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            availableBundles={availableBundles}
          />

          {filteredCourses.length > 0 ? (
            <CoursesSection
              filteredCourses={filteredCourses}
              expandedBundleId={expandedBundleId}
              expandedBundleCourses={expandedBundleCourses}
              onShowAll={handleShowAll}
              onBackToBundles={handleBackToBundles}
            />
          ) : (
            <EmptyState hasFilters={hasFilters} />
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
