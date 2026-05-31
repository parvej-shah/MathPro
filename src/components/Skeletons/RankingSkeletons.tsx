import React from 'react';

// Skeleton animation component
const SkeletonPulse: React.FC<{ className?: string; children?: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => (
  <div className={`animate-pulse ${className}`}>
    {children}
  </div>
);

// Podium skeleton
export const PodiumSkeleton: React.FC = () => (
  <div className="mb-12">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {/* 2nd Place Skeleton */}
      <div className="order-2 md:order-1 md:mt-16">
        <SkeletonPulse>
          <div className="relative bg-linear-to-br from-card/80 to-muted/70 backdrop-blur-xl border-2 border-border rounded-3xl p-8 shadow-2xl">
            <div className="absolute -top-4 -right-4 bg-muted-foreground/25 w-12 h-12 rounded-full"></div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-muted-foreground/25 mb-6"></div>
              <div className="h-6 bg-muted-foreground/25 rounded-lg w-32 mb-2"></div>
              <div className="h-4 bg-muted-foreground/25 rounded w-20 mb-4"></div>
              <div className="h-10 bg-muted-foreground/25 rounded w-16 mb-1"></div>
              <div className="h-4 bg-muted-foreground/25 rounded w-12"></div>
            </div>
          </div>
        </SkeletonPulse>
      </div>

      {/* 1st Place Skeleton */}
      <div className="order-1 md:order-2">
        <SkeletonPulse>
          <div className="relative bg-linear-to-br from-card/80 to-muted/70 backdrop-blur-xl border-2 border-border rounded-3xl p-8 shadow-2xl">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-muted-foreground/25 rounded-full"></div>
            <div className="absolute -top-4 -right-4 bg-muted-foreground/25 w-16 h-16 rounded-full"></div>
            <div className="flex flex-col items-center pt-6">
              <div className="w-36 h-36 rounded-full bg-muted-foreground/25 mb-6"></div>
              <div className="h-8 bg-muted-foreground/25 rounded-lg w-40 mb-2"></div>
              <div className="h-4 bg-muted-foreground/25 rounded w-24 mb-4"></div>
              <div className="h-12 bg-muted-foreground/25 rounded w-20 mb-1"></div>
              <div className="h-4 bg-muted-foreground/25 rounded w-12"></div>
            </div>
          </div>
        </SkeletonPulse>
      </div>

      {/* 3rd Place Skeleton */}
      <div className="order-3 md:order-3 md:mt-16">
        <SkeletonPulse>
          <div className="relative bg-linear-to-br from-card/80 to-muted/70 backdrop-blur-xl border-2 border-border rounded-3xl p-8 shadow-2xl">
            <div className="absolute -top-4 -right-4 bg-muted-foreground/25 w-12 h-12 rounded-full"></div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-muted-foreground/25 mb-6"></div>
              <div className="h-6 bg-muted-foreground/25 rounded-lg w-32 mb-2"></div>
              <div className="h-4 bg-muted-foreground/25 rounded w-20 mb-4"></div>
              <div className="h-10 bg-muted-foreground/25 rounded w-16 mb-1"></div>
              <div className="h-4 bg-muted-foreground/25 rounded w-12"></div>
            </div>
          </div>
        </SkeletonPulse>
      </div>
    </div>
  </div>
);

// My rank banner skeleton
export const MyRankSkeleton: React.FC = () => (
  <div className="max-w-5xl mx-auto mb-8">
    <SkeletonPulse>
      <div className="bg-linear-to-r from-card/80 to-muted/70 backdrop-blur-lg border border-border rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-muted-foreground/25 p-3 rounded-full w-14 h-14"></div>
            <div className="text-center sm:text-left">
              <div className="h-4 bg-muted-foreground/25 rounded w-20 mb-2"></div>
              <div className="h-8 bg-muted-foreground/25 rounded w-12"></div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <div className="h-4 bg-muted-foreground/25 rounded w-16 mb-1"></div>
              <div className="h-6 bg-muted-foreground/25 rounded w-12"></div>
            </div>
            <div className="h-10 bg-muted-foreground/25 rounded-lg w-24"></div>
          </div>
        </div>
      </div>
    </SkeletonPulse>
  </div>
);

// Table skeleton
export const TableSkeleton: React.FC = () => (
  <div className="max-w-5xl mx-auto">
    <div className="bg-card/85 backdrop-blur-lg border border-border rounded-2xl overflow-hidden">
      {/* Header skeleton */}
      <SkeletonPulse>
        <div className="bg-linear-to-r from-card/80 to-muted/70 backdrop-blur-lg border-b border-border px-6 py-4">
          <div className="h-6 bg-muted-foreground/25 rounded w-32"></div>
        </div>
      </SkeletonPulse>

      {/* Table header skeleton */}
      <div className="bg-muted/60 border-b border-border">
        <div className="grid grid-cols-4 gap-4 px-6 py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonPulse key={i}>
              <div className="h-4 bg-muted-foreground/25 rounded w-16"></div>
            </SkeletonPulse>
          ))}
        </div>
      </div>

      {/* Table rows skeleton */}
      <div className="divide-y divide-border/70">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 px-6 py-4">
            <SkeletonPulse>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-muted-foreground/25 rounded"></div>
                <div className="h-5 bg-muted-foreground/25 rounded w-8"></div>
              </div>
            </SkeletonPulse>
            <SkeletonPulse>
              <div className="h-5 bg-muted-foreground/25 rounded w-24"></div>
            </SkeletonPulse>
            <SkeletonPulse>
              <div className="h-6 bg-muted-foreground/25 rounded w-12"></div>
            </SkeletonPulse>
            <SkeletonPulse>
              <div className="h-4 bg-muted-foreground/25 rounded w-20"></div>
            </SkeletonPulse>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Course selector skeleton
export const CourseSelectorSkeleton: React.FC = () => (
  <div className="mb-8 max-w-2xl mx-auto">
    <SkeletonPulse>
      <div className="bg-muted/60 backdrop-blur-lg border border-border rounded-xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-5 h-5 bg-muted-foreground/25 rounded"></div>
            <div className="flex-1">
              <div className="h-3 bg-muted-foreground/25 rounded w-20 mb-1"></div>
              <div className="h-5 bg-muted-foreground/25 rounded w-32"></div>
            </div>
          </div>
          <div className="w-5 h-5 bg-muted-foreground/25 rounded"></div>
        </div>
      </div>
    </SkeletonPulse>
  </div>
);

// Header skeleton
export const HeaderSkeleton: React.FC = () => (
  <div className="text-center mb-12">
    <SkeletonPulse>
      <div className="h-12 bg-muted rounded-lg w-80 mx-auto mb-4"></div>
      <div className="h-6 bg-muted rounded w-96 mx-auto"></div>
    </SkeletonPulse>
  </div>
);

// Full page skeleton
export const RankingPageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background">
    <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <HeaderSkeleton />
        <CourseSelectorSkeleton />
        <PodiumSkeleton />
        <MyRankSkeleton />
        <TableSkeleton />
      </div>
    </div>
  </div>
);