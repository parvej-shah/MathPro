import React from 'react';

// ─── Premium Shimmer Block ────────────────────────────────────────
// Multi-layered shimmer with subtle glass + gradient sweep
const Bone: React.FC<{ className?: string; rounded?: string }> = ({
  className = '',
  rounded = 'rounded-lg',
}) => (
  <div
    className={`relative overflow-hidden bg-gray-200/60 dark:bg-white/[0.06] ${rounded} ${className}`}
  >
    {/* Primary shimmer sweep */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/[0.08] to-transparent" />
    {/* Secondary slower sweep for depth */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer-slow bg-gradient-to-r from-transparent via-purple/[0.04] to-transparent" />
  </div>
);

// ─── Video Player Skeleton ────────────────────────────────────────
export const VideoPlayerSkeleton: React.FC = () => (
  <div className="w-full aspect-video rounded-2xl overflow-hidden relative bg-gray-200/50 dark:bg-white/[0.04]">
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/15 dark:via-white/[0.06] to-transparent" />
    {/* Play button ghost */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-300/30 dark:bg-white/[0.08] backdrop-blur-sm flex items-center justify-center border border-gray-300/20 dark:border-white/[0.06]">
        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-gray-400/40 dark:border-l-white/20 border-b-[10px] border-b-transparent ml-1" />
      </div>
    </div>
    {/* Bottom progress bar ghost */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-300/20 dark:bg-white/[0.04]">
      <div className="h-full w-1/3 bg-purple/20 rounded-r" />
    </div>
  </div>
);

// ─── Module Content Skeleton ──────────────────────────────────────
export const ModuleContentSkeleton: React.FC = () => (
  <div className="space-y-7">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2">
      <Bone className="h-4 w-20" />
      <Bone className="h-4 w-4" rounded="rounded" />
      <Bone className="h-4 w-28" />
      <Bone className="h-4 w-4" rounded="rounded" />
      <Bone className="h-4 w-36" />
    </div>

    {/* Title */}
    <div className="space-y-2">
      <Bone className="h-9 w-[70%]" />
      <Bone className="h-5 w-[45%]" />
    </div>

    {/* Video player */}
    <VideoPlayerSkeleton />

    {/* Tab bar */}
    <div className="flex gap-6 border-b border-gray-200/60 dark:border-white/[0.06] pb-3">
      <Bone className="h-5 w-[90px]" />
      <Bone className="h-5 w-[70px]" />
      <Bone className="h-5 w-[85px]" />
      <Bone className="h-5 w-[65px]" />
    </div>

    {/* Text content block */}
    <div className="space-y-3 pt-2">
      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-full" />
      <Bone className="h-4 w-[92%]" />
      <Bone className="h-4 w-[78%]" />
    </div>

    {/* Action buttons */}
    <div className="flex gap-4 pt-2">
      <Bone className="h-11 w-36" rounded="rounded-xl" />
      <Bone className="h-11 w-36" rounded="rounded-xl" />
    </div>
  </div>
);

// ─── Quiz Skeleton ────────────────────────────────────────────────
export const QuizSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Bone className="h-8 w-2/3" />
    <div className="flex justify-end">
      <Bone className="h-9 w-28" rounded="rounded-full" />
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-gray-100/50 dark:bg-white/[0.02] rounded-xl p-5 space-y-4 border border-gray-200/40 dark:border-white/[0.04]">
        <Bone className="h-5 w-[85%]" />
        <div className="space-y-3 pt-1">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="flex items-center gap-3">
              <Bone className="h-[18px] w-[18px] flex-shrink-0" rounded="rounded-full" />
              <Bone className={`h-4 ${j % 2 === 0 ? 'w-[60%]' : 'w-[75%]'}`} />
            </div>
          ))}
        </div>
      </div>
    ))}
    <div className="flex justify-center pt-2">
      <Bone className="h-11 w-44" rounded="rounded-xl" />
    </div>
  </div>
);

// ─── Module Sidebar Skeleton ──────────────────────────────────────
export const ModuleSidebarSkeleton: React.FC = () => (
  <div className="space-y-5">
    {/* Course title */}
    <Bone className="h-6 w-[80%]" />

    {/* Progress */}
    <div className="space-y-2">
      <div className="flex justify-between">
        <Bone className="h-3 w-20" />
        <Bone className="h-3 w-10" />
      </div>
      <Bone className="h-2 w-full" rounded="rounded-full" />
    </div>

    {/* Chapters */}
    {[1, 2, 3, 4].map((ch) => (
      <div key={ch} className="space-y-2">
        <Bone className="h-11 w-full" rounded="rounded-xl" />
        {ch === 1 && (
          <div className="space-y-1.5 pl-3">
            {[1, 2, 3, 4, 5].map((m) => (
              <Bone key={m} className="h-9 w-full" rounded="rounded-lg" />
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

// ─── Discussion Skeleton ──────────────────────────────────────────
export const DiscussionSkeleton: React.FC = () => (
  <div className="space-y-4">
    {/* Comment input ghost */}
    <Bone className="h-20 w-full" rounded="rounded-xl" />
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex gap-3 p-4 bg-gray-100/40 dark:bg-white/[0.02] rounded-xl border border-gray-200/30 dark:border-white/[0.04]">
        <Bone className="h-10 w-10 flex-shrink-0" rounded="rounded-full" />
        <div className="flex-1 space-y-2.5">
          <div className="flex items-center justify-between">
            <Bone className="h-4 w-28" />
            <Bone className="h-3 w-16" />
          </div>
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-[65%]" />
          <div className="flex gap-3 pt-1">
            <Bone className="h-6 w-14" rounded="rounded-md" />
            <Bone className="h-6 w-14" rounded="rounded-md" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Full Module Page Skeleton ────────────────────────────────────
export const ModulePageSkeleton: React.FC = () => (
  <div className="pt-16 bg-background min-h-screen">
    <div className="w-[90%] lgXl:w-[80%] mx-auto py-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Main content area */}
        <div className="flex-[2] min-w-0 space-y-8">
          <ModuleContentSkeleton />
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[340px] flex-shrink-0">
          <div className="lg:sticky lg:top-24 bg-gray-100/40 dark:bg-white/[0.02] rounded-2xl p-5 border border-gray-200/40 dark:border-white/[0.04]">
            <ModuleSidebarSkeleton />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Compact loading skeleton for quick transitions
export const CompactModuleSkeleton: React.FC = () => (
  <div className="space-y-5 p-6">
    <Bone className="h-8 w-[60%]" />
    <VideoPlayerSkeleton />
    <div className="space-y-2.5">
      {[1, 2, 3].map((i) => (
        <Bone key={i} className={`h-4 ${i === 3 ? 'w-[80%]' : 'w-full'}`} />
      ))}
    </div>
  </div>
);

export default ModulePageSkeleton;
