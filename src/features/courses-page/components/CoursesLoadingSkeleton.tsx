import React from "react";

// ─── Shimmer bone ─────────────────────────────────────────────────────────────
const Bone: React.FC<{ className?: string; rounded?: string }> = ({
  className = "",
  rounded = "rounded-lg",
}) => (
  <div
    className={`relative overflow-hidden bg-gray-200/60 dark:bg-white/[0.06] ${rounded} ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/[0.08] to-transparent" />
  </div>
);

// ─── Hero slider skeleton ─────────────────────────────────────────────────────
const HeroSliderSkeleton: React.FC = () => (
  <div
    className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-10px_rgba(139,92,246,0.25)] dark:shadow-[0_20px_80px_-10px_rgba(16,185,129,0.18)] mb-10"
    style={{ aspectRatio: "16/7", minHeight: 300, maxHeight: 620 }}
  >
    {/* Dark image placeholder — mimics the real slide's thumbnail */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950" />
    {/* Shimmer sweep */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    {/* Same dual overlays as real slider */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
    {/* Content area at bottom-left */}
    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-14">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-5 w-28 rounded-full bg-white/15" />
      </div>
      <div className="h-9 w-[58%] rounded-lg bg-white/12 mb-2" />
      <div className="h-9 w-[40%] rounded-lg bg-white/10 mb-5" />
      <div className="h-4 w-[50%] rounded bg-white/8 mb-1" />
      <div className="h-4 w-[38%] rounded bg-white/8 mb-5" />
      <div className="flex items-center gap-2">
        <div className="h-5 w-32 rounded bg-white/20" />
        <div className="w-4 h-4 rounded bg-white/15" />
      </div>
    </div>
    {/* Prev/next arrows */}
    <div className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 border border-white/15" />
    <div className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/30 border border-white/15" />
    {/* Dot indicators — bottom center, same as real slider */}
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5">
      <div className="h-1.5 w-7 rounded-full bg-white/30" />
      <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
    </div>
  </div>
);

// ─── Filter pills skeleton ────────────────────────────────────────────────────
const PILL_WIDTHS = ["w-24", "w-20", "w-28", "w-22"];
const FiltersSkeleton: React.FC = () => (
  <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
    {PILL_WIDTHS.map((w, i) => (
      <Bone key={i} className={`h-9 shrink-0 ${w}`} rounded="rounded-full" />
    ))}
  </div>
);

// ─── Course card skeleton ─────────────────────────────────────────────────────
const CourseCardSkeleton: React.FC = () => (
  <div className="bg-card rounded-2xl overflow-hidden border border-border/50 flex flex-col">
    <Bone className="w-full aspect-video" rounded="rounded-none" />
    <div className="p-5 flex flex-col gap-3 flex-1">
      {/* Badge */}
      <Bone className="h-5 w-20" rounded="rounded-full" />
      {/* Title */}
      <div className="space-y-2">
        <Bone className="h-6 w-full" />
        <Bone className="h-6 w-[70%]" />
      </div>
      {/* Short description */}
      <div className="space-y-1.5">
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-[85%]" />
      </div>
      {/* Stats row */}
      <div className="flex items-center gap-4 pt-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <Bone className="h-4 w-4" rounded="rounded" />
            <Bone className="h-4 w-12" />
          </div>
        ))}
      </div>
      {/* Price + CTA */}
      <div className="mt-auto pt-4 border-t border-border/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-end gap-2">
            <Bone className="h-8 w-24" />
            <Bone className="h-5 w-16 mb-0.5" />
          </div>
          <Bone className="h-6 w-14" rounded="rounded-full" />
        </div>
        <Bone className="h-11 w-full" rounded="rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── Full courses page skeleton ───────────────────────────────────────────────
export default function CoursesLoadingSkeleton() {
  return (
    <div className="pt-20 min-h-screen bg-section-a">
      <div className="w-[90%] lg:w-[85%] max-w-360 mx-auto pt-8 pb-20">
        <HeroSliderSkeleton />
        <FiltersSkeleton />
        <div id="courses-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
