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

// Single course card skeleton
export const CourseCardSkeleton: React.FC = () => (
  <div className="bg-gray-300/5 dark:bg-gray-800/20 rounded-2xl overflow-hidden backdrop-blur-lg border border-gray-300/10">
    {/* Course image */}
    <Bone className="w-full aspect-video" />
    
    <div className="p-6 space-y-4">
      {/* Badge */}
      <div className="flex gap-2">
        <Bone className="h-6 w-20 rounded-full" />
        <Bone className="h-6 w-24 rounded-full" />
      </div>
      
      {/* Title */}
      <Bone className="h-8 w-full rounded-lg" />
      
      {/* Description */}
      <div className="space-y-2">
        <Bone className="h-4 w-full rounded" />
        <Bone className="h-4 w-4/5 rounded" />
      </div>
      
      {/* Stats */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-300/10">
        <div className="flex items-center gap-2">
          <Bone className="h-5 w-5 rounded-full" />
          <Bone className="h-4 w-16 rounded" />
        </div>
        <Bone className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  </div>
);

// Grid of course cards
export const CourseGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <CourseCardSkeleton key={index} />
    ))}
  </div>
);

// Horizontal course list skeleton
export const CourseListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="bg-gray-300/5 dark:bg-gray-800/20 rounded-2xl p-6 flex gap-6 backdrop-blur-lg border border-gray-300/10">
        {/* Course image */}
        <Bone className="w-48 h-32 rounded-lg flex-shrink-0" />
        
        <div className="flex-1 space-y-4">
          {/* Title */}
          <Bone className="h-7 w-3/4 rounded-lg" />
          
          {/* Description */}
          <div className="space-y-2">
            <Bone className="h-4 w-full rounded" />
            <Bone className="h-4 w-5/6 rounded" />
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Bone className="h-6 w-20 rounded-full" />
              <Bone className="h-6 w-24 rounded-full" />
            </div>
            <Bone className="h-10 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default CourseCardSkeleton;
