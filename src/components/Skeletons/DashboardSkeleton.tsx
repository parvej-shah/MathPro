import React from 'react';

// ─── Premium Shimmer Bone ─────────────────────────────────────────
const Bone: React.FC<{ className?: string; rounded?: string }> = ({
  className = '',
  rounded = 'rounded-lg',
}) => (
  <div
    className={`relative overflow-hidden bg-gray-200/60 dark:bg-white/[0.06] ${rounded} ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/[0.08] to-transparent" />
    <div className="absolute inset-0 -translate-x-full animate-shimmer-slow bg-gradient-to-r from-transparent via-purple/[0.04] to-transparent" />
  </div>
);

// Stats card skeleton
export const StatsCardSkeleton: React.FC = () => (
  <div className="bg-gray-300/5 dark:bg-gray-800/20 rounded-2xl p-6 backdrop-blur-lg border border-gray-300/10">
    <div className="flex items-center justify-between">
      <div className="space-y-3 flex-1">
        <Bone className="h-5 w-24 rounded" />
        <Bone className="h-10 w-32 rounded-lg" />
      </div>
      <Bone className="h-16 w-16 rounded-full" />
    </div>
  </div>
);

// Progress bar skeleton
export const ProgressBarSkeleton: React.FC = () => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <Bone className="h-5 w-32 rounded" />
      <Bone className="h-5 w-16 rounded" />
    </div>
    <Bone className="h-3 w-full rounded-full" />
  </div>
);

// Activity item skeleton
export const ActivityItemSkeleton: React.FC = () => (
  <div className="flex items-start gap-4 py-4 border-b border-gray-300/10 last:border-0">
    <Bone className="h-12 w-12 rounded-full flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <Bone className="h-5 w-3/4 rounded" />
      <Bone className="h-4 w-1/2 rounded" />
    </div>
    <Bone className="h-4 w-20 rounded" />
  </div>
);

// Full dashboard skeleton
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Header section */}
    <div className="space-y-4">
      <Bone className="h-10 w-64 rounded-lg" />
      <Bone className="h-5 w-96 rounded" />
    </div>

    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>

    {/* Main content grid */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left column - Course progress */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gray-300/5 dark:bg-gray-800/20 rounded-2xl p-6 backdrop-blur-lg border border-gray-300/10">
          <Bone className="h-7 w-48 rounded-lg mb-6" />
          
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4 pb-6 border-b border-gray-300/10 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <Bone className="h-6 w-48 rounded-lg" />
                  <Bone className="h-8 w-24 rounded-full" />
                </div>
                <ProgressBarSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column - Recent activity */}
      <div className="space-y-6">
        <div className="bg-gray-300/5 dark:bg-gray-800/20 rounded-2xl p-6 backdrop-blur-lg border border-gray-300/10">
          <Bone className="h-7 w-40 rounded-lg mb-6" />
          
          <div>
            {[1, 2, 3, 4, 5].map((i) => (
              <ActivityItemSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Mini dashboard for profile pages
export const ProfileDashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Profile header */}
    <div className="bg-gray-300/5 dark:bg-gray-800/20 rounded-2xl p-8 backdrop-blur-lg border border-gray-300/10">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Bone className="h-32 w-32 rounded-full" />
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <Bone className="h-8 w-48 rounded-lg mx-auto md:mx-0" />
          <Bone className="h-5 w-64 rounded mx-auto md:mx-0" />
          <div className="flex gap-4 justify-center md:justify-start">
            <Bone className="h-10 w-32 rounded-lg" />
            <Bone className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>

    {/* Content tabs */}
    <div className="bg-gray-300/5 dark:bg-gray-800/20 rounded-2xl p-6 backdrop-blur-lg border border-gray-300/10">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-300/10 pb-4 mb-6">
        <Bone className="h-10 w-32 rounded-lg" />
        <Bone className="h-10 w-32 rounded-lg" />
        <Bone className="h-10 w-32 rounded-lg" />
      </div>

      {/* Content */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Bone key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
