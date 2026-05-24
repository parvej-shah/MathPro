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

// ─── Course Header Skeleton ───────────────────────────────────────
const CourseHeaderSkeleton: React.FC = () => (
  <div className="space-y-4">
    {/* Tag / badge */}
    <Bone className="h-6 w-24" rounded="rounded-full" />
    {/* Title */}
    <Bone className="h-10 w-[85%]" />
    <Bone className="h-10 w-[55%]" />
    {/* Separator */}
    <div className="border-b border-gray-200/40 dark:border-white/[0.06] pb-4" />
    {/* Short description */}
    <Bone className="h-5 w-full" />
    <Bone className="h-5 w-[90%]" />
    <Bone className="h-5 w-[70%]" />
  </div>
);

// ─── Course Stats Skeleton ────────────────────────────────────────
const CourseStatsSkeleton: React.FC = () => (
  <div className="flex flex-wrap gap-6 py-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center gap-2">
        <Bone className="h-5 w-5" rounded="rounded" />
        <Bone className="h-4 w-20" />
      </div>
    ))}
  </div>
);

// ─── Course Tabs Skeleton ─────────────────────────────────────────
const CourseTabsSkeleton: React.FC = () => (
  <div className="flex gap-1 border-b border-gray-200/40 dark:border-white/[0.06] mb-6">
    <div className="pb-3"><Bone className="h-9 w-[100px]" rounded="rounded-lg" /></div>
    <div className="pb-3"><Bone className="h-9 w-[80px]" rounded="rounded-lg" /></div>
    <div className="pb-3"><Bone className="h-9 w-[120px]" rounded="rounded-lg" /></div>
  </div>
);

// ─── Study Plan (Chapter List) Skeleton ───────────────────────────
const StudyPlanSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="bg-gray-100/50 dark:bg-white/[0.02] rounded-xl p-4 border border-gray-200/30 dark:border-white/[0.04]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Bone className="h-5 w-5 flex-shrink-0" rounded="rounded" />
            <div className="flex-1 space-y-1.5">
              <Bone className={`h-5 ${i % 2 === 0 ? 'w-[65%]' : 'w-[80%]'}`} />
              <Bone className="h-3 w-32" />
            </div>
          </div>
          <Bone className="h-5 w-5 flex-shrink-0" rounded="rounded" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Sidebar Thumbnail Skeleton ───────────────────────────────────
const SidebarThumbnailSkeleton: React.FC = () => (
  <div className="w-full min-h-[200px] lg:min-h-[260px] relative overflow-hidden bg-gray-200/50 dark:bg-white/[0.04]" style={{ borderRadius: '12px 12px 0 0' }}>
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/15 dark:via-white/[0.06] to-transparent" />
    {/* Play button ghost */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-gray-300/30 dark:bg-white/[0.08] backdrop-blur-sm flex items-center justify-center border border-gray-300/20 dark:border-white/[0.06]">
        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-gray-400/40 dark:border-l-white/20 border-b-[8px] border-b-transparent ml-0.5" />
      </div>
    </div>
  </div>
);

// ─── Sidebar Pricing Skeleton ─────────────────────────────────────
const SidebarPricingSkeleton: React.FC = () => (
  <div className="p-4 space-y-5">
    {/* Price & enrolled row */}
    <div className="flex items-center justify-between pt-2 pb-4 border-b border-gray-200/20 dark:border-white/[0.04]">
      <div className="space-y-2">
        <Bone className="h-4 w-20" />
        <div className="flex items-center gap-3">
          <Bone className="h-8 w-24" />
          <Bone className="h-5 w-14" />
        </div>
      </div>
      <div className="space-y-2 text-right">
        <Bone className="h-4 w-28" />
        <Bone className="h-8 w-16 ml-auto" />
      </div>
    </div>

    {/* Enrollment info */}
    <div className="space-y-2">
      <Bone className="h-4 w-36" />
      <Bone className="h-4 w-48" />
    </div>

    {/* Features heading */}
    <Bone className="h-5 w-40" />

    {/* Features list */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-2 gap-x-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="flex items-center gap-2">
          <Bone className="h-4 w-4 flex-shrink-0" rounded="rounded-full" />
          <Bone className={`h-4 ${i % 3 === 0 ? 'w-20' : i % 2 === 0 ? 'w-28' : 'w-24'}`} />
        </div>
      ))}
    </div>

    {/* Countdown placeholder */}
    <div className="flex justify-center gap-3 py-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center space-y-1">
          <Bone className="h-10 w-12" rounded="rounded-lg" />
          <Bone className="h-3 w-10 mx-auto" />
        </div>
      ))}
    </div>

    {/* CTA button */}
    <Bone className="h-12 w-full" rounded="rounded-xl" />
  </div>
);

// ─── Full Course Details Page Skeleton ────────────────────────────
export const CourseDetailsSkeleton: React.FC = () => (
  <div className="pt-20 bg-background min-h-screen">
    <div className="w-[90%] lg:w-[90%] max-w-[1440px] mx-auto py-12">
      <div className="flex flex-col-reverse lg:flex-row gap-24 relative">
        {/* Left Column — Main Content */}
        <div style={{ flex: 2 }} className="space-y-6 z-10">
          <CourseHeaderSkeleton />
          <CourseStatsSkeleton />
          <CourseTabsSkeleton />
          <StudyPlanSkeleton />
        </div>

        {/* Right Column — Sidebar */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="bg-gray-200/30 dark:bg-gray-100/5 backdrop-blur-xl rounded-xl overflow-hidden">
            <SidebarThumbnailSkeleton />
            <SidebarPricingSkeleton />
          </div>
        </div>
      </div>
    </div>

    {/* Community section placeholder */}
    <div className="w-[90%] lg:w-[90%] max-w-[1440px] mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <Bone className="h-7 w-48" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-[80%]" />
          <div className="flex gap-3 pt-2">
            <Bone className="h-10 w-10" rounded="rounded-full" />
            <Bone className="h-10 w-10" rounded="rounded-full" />
            <Bone className="h-10 w-10" rounded="rounded-full" />
          </div>
        </div>
        <Bone className="h-48 w-full md:w-80" rounded="rounded-xl" />
      </div>
    </div>
  </div>
);

export default CourseDetailsSkeleton;
