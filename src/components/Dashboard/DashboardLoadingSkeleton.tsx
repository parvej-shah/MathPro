import React from 'react';

const DashboardLoadingSkeleton: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen">
      <div className="w-[90%] lg:w-[85%] max-w-[1440px] mx-auto py-12">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-10 bg-muted animate-pulse rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-96"></div>
        </div>

        {/* Stats Section Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-background rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl animate-pulse"></div>
                <div className="flex-1">
                  <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resume Banner Skeleton */}
        <div className="w-full bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 rounded-3xl p-6 md:p-8 mb-10 border border-purple-100 dark:border-purple-800">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            {/* Thumbnail Skeleton */}
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="aspect-video bg-muted animate-pulse rounded-xl"></div>
            </div>

            {/* Content Skeleton */}
            <div className="flex-grow w-full">
              <div className="h-6 bg-muted animate-pulse rounded-full w-48 mb-4"></div>
              <div className="h-8 bg-muted animate-pulse rounded w-3/4 mb-6"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6">
                <div className="w-full md:w-64">
                  <div className="h-2 bg-muted animate-pulse rounded-full mb-2"></div>
                  <div className="h-2 bg-muted animate-pulse rounded-full w-full"></div>
                </div>
              </div>

              <div className="h-12 bg-muted animate-pulse rounded-xl w-40"></div>
            </div>
          </div>
        </div>

        {/* Search and Filters Skeleton */}
        <div className="bg-background rounded-2xl p-6 mb-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="h-12 bg-muted animate-pulse rounded-xl"></div>
            </div>
            <div className="h-12 bg-muted animate-pulse rounded-xl"></div>
            <div className="h-12 bg-muted animate-pulse rounded-xl"></div>
            <div className="h-12 bg-muted animate-pulse rounded-xl"></div>
          </div>
        </div>

        {/* Courses Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-background rounded-2xl overflow-hidden border border-border">
              {/* Thumbnail */}
              <div className="aspect-video bg-muted animate-pulse"></div>
              
              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <div className="h-6 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-4"></div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-2 bg-muted animate-pulse rounded-full mb-2"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-muted animate-pulse rounded w-20"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-12"></div>
                  </div>
                </div>

                {/* Button */}
                <div className="h-10 bg-muted animate-pulse rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLoadingSkeleton;
