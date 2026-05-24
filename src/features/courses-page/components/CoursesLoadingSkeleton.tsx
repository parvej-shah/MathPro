import React from "react";

export default function CoursesLoadingSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="w-[90%] lg:w-[85%] max-w-[1440px] mx-auto py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-8">
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-lg w-80 mx-auto mb-4 animate-shimmer bg-[length:200%_100%]" />
          <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded w-[500px] max-w-full mx-auto animate-shimmer bg-[length:200%_100%]" />
        </div>

        {/* Stats Strip Skeleton */}
        <div className="bg-background/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-border/20 p-6 md:p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl animate-shimmer bg-[length:200%_100%]" />
                <div className="flex-1">
                  <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded w-16 mb-2 animate-shimmer bg-[length:200%_100%]" />
                  <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded w-20 animate-shimmer bg-[length:200%_100%]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="h-14 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl animate-shimmer bg-[length:200%_100%]" />
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full animate-shimmer bg-[length:200%_100%]"
              style={{ width: `${80 + i * 20}px` }}
            />
          ))}
        </div>

        {/* Course Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-background/50 rounded-2xl overflow-hidden border border-border dark:border-border/50"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-shimmer bg-[length:200%_100%]" />

              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded mb-2 animate-shimmer bg-[length:200%_100%]" />
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-3/4 mb-4 animate-shimmer bg-[length:200%_100%]" />

                {/* Description */}
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded mb-2 animate-shimmer bg-[length:200%_100%]" />
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-2/3 mb-4 animate-shimmer bg-[length:200%_100%]" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer bg-[length:200%_100%]"
                    />
                  ))}
                </div>

                {/* Price and Button */}
                <div className="pt-4 border-t border-border dark:border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-20 animate-shimmer bg-[length:200%_100%]" />
                    <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-16 animate-shimmer bg-[length:200%_100%]" />
                  </div>
                  <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-xl animate-shimmer bg-[length:200%_100%]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


