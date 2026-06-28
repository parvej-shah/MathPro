import React from 'react';

const CourseDashboardLoadingSkeleton: React.FC = () => {
  return (
    <div className="pt-20 bg-page-bg min-h-screen animate-pulse">
      <div className="w-[95%] sm:w-[92%] lg:w-[90%] xl:w-[85%] mx-auto py-5 sm:py-8 lg:py-12">
        {/* Course Title Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-muted rounded-lg w-2/3 md:w-1/2"></div>
        </div>

        {/* Routine Hero Skeleton (Tier 1) */}
        <div className="relative bg-linear-to-br from-primary/80 via-primary to-teal/80 rounded-3xl overflow-hidden mb-6 sm:mb-8 h-48 sm:h-64 md:h-80 lg:h-96 ring-1 ring-foreground/10 shadow-xl">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary-foreground/40 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4 px-6">
              <div className="h-8 bg-primary-foreground/20 rounded-lg w-64 mx-auto"></div>
              <div className="h-12 bg-primary-foreground/20 rounded-lg w-48 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Action Zone — two columns matching the loaded layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 lg:items-start">
          {/* Left Column (cols 1–3) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Streak Card Skeleton */}
            <div className="bg-secondary rounded-2xl p-5 sm:p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-secondary-foreground/15 rounded w-32"></div>
                  <div className="h-10 bg-secondary-foreground/15 rounded w-24"></div>
                  <div className="h-3 bg-secondary-foreground/15 rounded w-40"></div>
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-secondary-foreground/15 rounded-full"></div>
              </div>
            </div>

            {/* Progress Card Skeleton */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border border-l-4 border-l-primary shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 bg-muted rounded w-40"></div>
                <div className="h-8 bg-muted rounded-full w-20"></div>
              </div>
              <div className="mb-6">
                <div className="h-3 bg-muted rounded-full mb-2"></div>
              </div>
              <div className="h-12 bg-muted rounded-xl"></div>
            </div>

            {/* Live Classes Skeleton */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border border-l-4 border-l-border shadow-sm">
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
            <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-sm">
              <div className="h-6 bg-muted rounded w-48 mb-4"></div>
              <div className="h-32 bg-muted rounded-xl mb-4"></div>
              <div className="h-12 bg-muted rounded-xl"></div>
            </div>
          </div>

          {/* Right Column (cols 4–5) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ranking Card Skeleton (Tier 3 reward) */}
            <div className="bg-linear-to-br from-primary via-primary to-teal/90 rounded-2xl p-5 sm:p-6 border border-primary/20 shadow-lg">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <div className="h-3 bg-primary-foreground/30 rounded w-24"></div>
                  <div className="h-8 bg-primary-foreground/30 rounded w-12"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-primary-foreground/30 rounded w-16 ml-auto"></div>
                  <div className="h-8 bg-primary-foreground/30 rounded w-10 ml-auto"></div>
                </div>
              </div>
            </div>

            {/* Announcements Card Skeleton */}
            <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border border-l-4 border-l-warning shadow-sm">
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

            {/* Community Card Skeleton */}
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-muted rounded w-48 mx-auto mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-6"></div>
                <div className="h-12 bg-muted rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDashboardLoadingSkeleton;
