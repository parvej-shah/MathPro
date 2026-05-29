import React from 'react';

const DashboardLoadingSkeleton: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-page-bg">
      <div className="w-[90%] lg:w-[85%] max-w-[1440px] mx-auto py-12">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-10 bg-muted/80 animate-pulse rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-muted/80 animate-pulse rounded w-96 max-w-full"></div>
        </div>

        {/* Stats Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden bg-card rounded-2xl p-6 border border-border shadow-sm"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/25 to-teal/25 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-8 bg-muted/80 animate-pulse rounded w-16 mb-2"></div>
                  <div className="h-4 bg-muted/80 animate-pulse rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resume Banner Skeleton */}
        <div className="w-full bg-gradient-to-r from-primary/10 to-teal/10 dark:from-primary/20 dark:to-teal/20 rounded-3xl p-6 md:p-8 mb-10 border border-primary/15 dark:border-primary/25">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            {/* Thumbnail Skeleton */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="aspect-video bg-muted/80 animate-pulse rounded-xl"></div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-grow w-full">
              <div className="h-6 bg-muted/80 animate-pulse rounded-full w-48 mb-4"></div>
              <div className="h-8 bg-muted/80 animate-pulse rounded w-3/4 mb-6"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6">
                <div className="w-full md:w-64">
                  <div className="h-2 bg-muted/80 animate-pulse rounded-full mb-2"></div>
                  <div className="h-2 bg-muted/80 animate-pulse rounded-full w-full"></div>
                </div>
              </div>

              <div className="h-12 bg-gradient-to-r from-primary/40 to-teal/40 animate-pulse rounded-xl w-40"></div>
            </div>
          </div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="bg-card rounded-2xl p-6 mb-8 border border-border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="h-12 bg-muted/80 animate-pulse rounded-xl"></div>
            </div>
            <div className="h-12 bg-muted/80 animate-pulse rounded-xl"></div>
            <div className="h-12 bg-muted/80 animate-pulse rounded-xl"></div>
            <div className="h-12 bg-muted/80 animate-pulse rounded-xl"></div>
          </div>
        </div>

        {/* Courses Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="group relative rounded-3xl overflow-hidden border border-border/80 bg-card/95 shadow-[0_12px_28px_-20px_rgba(16,123,97,0.45)]"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              {/* Thumbnail */}
              <div className="relative aspect-video animate-pulse bg-[radial-gradient(circle_at_18%_20%,oklch(0.718_0.147_159.2_/_22%),transparent_38%),radial-gradient(circle_at_80%_75%,oklch(0.65_0.15_185_/_18%),transparent_42%),linear-gradient(165deg,oklch(0.20_0.015_240),oklch(0.15_0.008_238))]">
                <div className="absolute right-3 top-3 h-7 w-20 rounded-full bg-primary/35" />
                <div className="absolute inset-x-4 bottom-4">
                  <div className="mb-2 h-2 w-28 rounded bg-white/25" />
                  <div className="h-1.5 rounded-full bg-white/20" />
                </div>
              </div>
              
              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <div className="h-6 bg-muted/80 animate-pulse rounded mb-2"></div>
                <div className="h-6 bg-muted/80 animate-pulse rounded w-3/4 mb-4"></div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-muted/80 animate-pulse rounded-full mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-muted/80 animate-pulse rounded w-20"></div>
                    <div className="h-3 bg-muted/80 animate-pulse rounded w-12"></div>
                  </div>
                </div>

                {/* Button */}
                <div className="h-10 bg-gradient-to-r from-primary/40 to-teal/40 animate-pulse rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLoadingSkeleton;
