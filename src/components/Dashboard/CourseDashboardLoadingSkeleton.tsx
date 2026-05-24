import React from 'react';

const CourseDashboardLoadingSkeleton: React.FC = () => {
  return (
    <div className="pt-20 bg-background min-h-screen animate-pulse">
      <div className="w-[95%] lg:w-[90%] xl:w-[85%] mx-auto py-8 lg:py-12">
        {/* Course Title Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-muted rounded-lg w-2/3 md:w-1/2"></div>
        </div>

        {/* Routine Hero Skeleton */}
        <div className="relative bg-gradient-to-br from-purple-600/90 to-indigo-700/90 dark:from-purple-900/90 dark:to-indigo-900/90 rounded-3xl overflow-hidden mb-8 h-[400px] md:h-[500px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white space-y-4 px-6">
              <div className="h-8 bg-white/20 rounded-lg w-64 mx-auto"></div>
              <div className="h-12 bg-white/20 rounded-lg w-48 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column (60%) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Streak Card Skeleton */}
            <div className="bg-background rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="h-8 w-8 bg-muted rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/40 rounded-xl">
                  <div className="h-10 bg-muted rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
                </div>
                <div className="text-center p-4 bg-muted/40 rounded-xl">
                  <div className="h-10 bg-muted rounded w-16 mx-auto mb-2"></div>
                  <div className="h-4 bg-muted rounded w-24 mx-auto"></div>
                </div>
              </div>
            </div>

            {/* Progress Card Skeleton */}
            <div className="bg-background rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-muted rounded w-40"></div>
                <div className="h-8 bg-muted rounded-full w-20"></div>
              </div>
              <div className="mb-6">
                <div className="h-3 bg-muted rounded-full mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
              </div>
              <div className="h-12 bg-muted rounded-xl"></div>
            </div>

            {/* Live Classes Skeleton */}
            <div className="bg-background rounded-2xl p-6 border border-border">
              <div className="h-6 bg-muted rounded w-40 mb-6"></div>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-muted/40 rounded-xl p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Card Skeleton */}
            <div className="bg-background rounded-2xl p-6 border border-border">
              <div className="h-6 bg-muted rounded w-48 mb-4"></div>
              <div className="h-32 bg-muted rounded-xl mb-4"></div>
              <div className="h-12 bg-muted rounded-xl"></div>
            </div>
          </div>

          {/* Right Column (40%) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Announcements Card Skeleton */}
            <div className="bg-background rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded-full w-16"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-muted/40 rounded-xl p-4">
                    <div className="h-5 bg-muted rounded w-full mb-2"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Message Skeleton */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-5 bg-purple-200 dark:bg-purple-800 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-purple-200 dark:bg-purple-800 rounded w-full"></div>
                </div>
                <div className="w-5 h-5 bg-purple-200 dark:bg-purple-800 rounded"></div>
              </div>
            </div>

            {/* Community Card Skeleton */}
            <div className="bg-info/10 border border-info/30 rounded-2xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-info/20 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-info/20 rounded w-48 mx-auto mb-2"></div>
                <div className="h-4 bg-info/20 rounded w-full mb-6"></div>
                <div className="h-12 bg-info/20 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Courses Skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-muted rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-background rounded-2xl overflow-hidden border border-border">
                <div className="aspect-video bg-muted"></div>
                <div className="p-5">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-muted rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboardLoadingSkeleton;
