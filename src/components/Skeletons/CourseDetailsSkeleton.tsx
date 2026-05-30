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
  </div>
);

// ─── Course Header Skeleton ───────────────────────────────────────
const CourseHeaderSkeleton: React.FC = () => (
  <div className="space-y-4">
    {/* Status badge + enrolled chip */}
    <div className="flex gap-2">
      <Bone className="h-6 w-28" rounded="rounded-full" />
      <Bone className="h-6 w-36" rounded="rounded-full" />
    </div>
    {/* Title */}
    <Bone className="h-10 w-[85%]" />
    <Bone className="h-10 w-[55%]" />
    {/* Short description */}
    <div className="pt-2 border-b border-gray-200/40 dark:border-white/[0.06] pb-6 space-y-2">
      <Bone className="h-5 w-full" />
      <Bone className="h-5 w-[90%]" />
      <Bone className="h-5 w-[70%]" />
    </div>
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
  <div className="mt-8 flex gap-1 border-b border-gray-200/40 dark:border-white/[0.06]">
    <div className="pb-3"><Bone className="h-10 w-[110px]" rounded="rounded-t-lg" /></div>
    <div className="pb-3"><Bone className="h-10 w-[100px]" rounded="rounded-t-lg" /></div>
    <div className="pb-3"><Bone className="h-10 w-[120px]" rounded="rounded-t-lg" /></div>
  </div>
);

// ─── Study Plan (Chapter List) Skeleton ───────────────────────────
const StudyPlanSkeleton: React.FC = () => (
  <div className="space-y-3 mt-6">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="bg-gray-100/50 dark:bg-white/[0.02] rounded-xl p-4 border border-gray-200/30 dark:border-white/[0.04]"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Bone className="h-5 w-5 shrink-0" rounded="rounded" />
            <div className="flex-1 space-y-1.5">
              <Bone className={`h-5 ${i % 2 === 0 ? 'w-[65%]' : 'w-[80%]'}`} />
              <Bone className="h-3 w-32" />
            </div>
          </div>
          <Bone className="h-5 w-5 shrink-0" rounded="rounded" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Sidebar Skeleton ─────────────────────────────────────────────
const SidebarSkeleton: React.FC = () => (
  <div className="bg-gray-200/30 dark:bg-gray-100/5 border border-gray-200/40 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
    {/* Thumbnail */}
    <div className="w-full aspect-video relative bg-gray-200/50 dark:bg-white/[0.04]">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/15 dark:via-white/[0.06] to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-gray-300/30 dark:bg-white/[0.08] flex items-center justify-center border border-gray-300/20 dark:border-white/[0.06]">
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-gray-400/40 dark:border-l-white/20 border-b-[8px] border-b-transparent ml-0.5" />
        </div>
      </div>
    </div>

    {/* Pricing block */}
    <div className="p-5 space-y-5">
      {/* Price row */}
      <div className="flex items-end gap-3">
        <Bone className="h-10 w-28" />
        <Bone className="h-6 w-16 mb-1" />
        <Bone className="h-6 w-14 mb-1" rounded="rounded-full" />
      </div>
      {/* Social proof */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <Bone key={i} className="w-7 h-7 border-2 border-white dark:border-gray-900" rounded="rounded-full" />
          ))}
        </div>
        <Bone className="h-4 w-36" />
      </div>
      {/* Enrollment info */}
      <div className="space-y-2">
        <Bone className="h-4 w-48" />
        <Bone className="h-4 w-40" />
      </div>
      {/* Countdown */}
      <div className="flex justify-center gap-3 py-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="text-center space-y-1">
            <Bone className="h-10 w-12" rounded="rounded-lg" />
            <Bone className="h-3 w-10 mx-auto" />
          </div>
        ))}
      </div>
      {/* CTA button */}
      <Bone className="h-14 w-full" rounded="rounded-xl" />
      {/* Trust strip */}
      <div className="flex items-center justify-center gap-4">
        <Bone className="h-4 w-24" />
        <Bone className="h-4 w-24" />
      </div>
    </div>
  </div>
);

// ─── Community Support Skeleton ───────────────────────────────────
const CommunitySkeleton: React.FC = () => (
  <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-360 mx-auto pt-12 border-t border-gray-200/40 dark:border-white/[0.06] mt-12 pb-16">
    {/* Heading */}
    <div className="text-center mb-8 space-y-3">
      <Bone className="h-8 w-64 mx-auto" />
      <Bone className="h-5 w-56 mx-auto" />
    </div>
    {/* 2-column card grid */}
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Facebook community card */}
      <div className="rounded-xl border border-gray-200/40 dark:border-white/[0.06] p-5 space-y-4 bg-gray-100/30 dark:bg-white/[0.02]">
        <Bone className="w-full aspect-video rounded-lg" />
        <Bone className="h-6 w-48 mx-auto" />
        <div className="space-y-2">
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-[90%]" />
          <Bone className="h-4 w-[75%]" />
        </div>
        <Bone className="h-11 w-full" rounded="rounded-lg" />
      </div>
      {/* Support card */}
      <div className="rounded-xl border border-gray-200/40 dark:border-white/[0.06] p-5 space-y-4 bg-gray-100/30 dark:bg-white/[0.02]">
        <Bone className="h-6 w-40 mx-auto" />
        <Bone className="h-4 w-64 mx-auto" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200/30 dark:border-white/[0.04]">
            <Bone className="w-10 h-10 shrink-0" rounded="rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Bone className="h-4 w-24" />
              <Bone className="h-3 w-32" />
            </div>
            <Bone className="h-4 w-4" rounded="rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Full Course Details Page Skeleton ────────────────────────────
export const CourseDetailsSkeleton: React.FC = () => (
  <div className="pt-20 bg-background min-h-screen">
    <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-360 mx-auto py-8 lg:py-12">
      <div className="flex flex-col-reverse lg:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-24 relative">
        {/* Left Column — Main Content */}
        <div style={{ flex: 2 }} className="space-y-0 z-10">
          <CourseHeaderSkeleton />
          <CourseStatsSkeleton />
          <CourseTabsSkeleton />
          <StudyPlanSkeleton />
        </div>

        {/* Right Column — Sidebar */}
        <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
          <SidebarSkeleton />
        </div>
      </div>
    </div>

  </div>
);

export default CourseDetailsSkeleton;
