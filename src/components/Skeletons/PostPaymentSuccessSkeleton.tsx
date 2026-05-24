import React from "react";

const Bone: React.FC<{ className?: string; rounded?: string }> = ({
  className = "",
  rounded = "rounded-lg",
}) => (
  <div
    className={`relative overflow-hidden bg-gray-200/60 dark:bg-white/[0.06] [@media(prefers-color-scheme:dark)]:bg-white/[0.06] ${rounded} ${className}`}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/[0.08] [@media(prefers-color-scheme:dark)]:via-white/[0.08] to-transparent" />
    <div className="absolute inset-0 -translate-x-full animate-shimmer-slow bg-gradient-to-r from-transparent via-purple/[0.04] dark:via-purple/[0.06] [@media(prefers-color-scheme:dark)]:via-purple/[0.06] to-transparent" />
  </div>
);

const SectionCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="bg-gray-100/40 dark:bg-white/[0.02] [@media(prefers-color-scheme:dark)]:bg-white/[0.02] rounded-2xl border border-gray-200/30 dark:border-white/[0.05] [@media(prefers-color-scheme:dark)]:border-white/[0.05] p-6 lg:p-8">
    {children}
  </section>
);

const SuccessHeaderSkeleton: React.FC = () => (
  <SectionCard>
    <div className="flex flex-col items-center text-center space-y-4">
      <Bone className="h-16 w-16" rounded="rounded-full" />
      <Bone className="h-9 w-[55%]" />
      <Bone className="h-5 w-[70%]" />
      <Bone className="h-5 w-[45%]" />
    </div>
  </SectionCard>
);

const ImportantMessagesSkeleton: React.FC = () => (
  <SectionCard>
    <div className="space-y-4">
      <Bone className="h-7 w-44" />
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex gap-3 items-start">
          <Bone className="h-5 w-5 mt-0.5 flex-shrink-0" rounded="rounded-full" />
          <div className="flex-1 space-y-2">
            <Bone className="h-4 w-full" />
            {index !== 3 && <Bone className="h-4 w-[80%]" />}
          </div>
        </div>
      ))}
    </div>
  </SectionCard>
);

const OrderSummarySkeleton: React.FC = () => (
  <SectionCard>
    <div className="space-y-5">
      <Bone className="h-7 w-40" />

      <div className="space-y-3">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <Bone className="h-4 w-28" />
            <Bone className={`h-4 ${index === 2 ? "w-44" : "w-28"}`} />
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200/40 dark:border-white/[0.08] pt-4 flex items-center justify-between">
        <Bone className="h-5 w-24" />
        <Bone className="h-8 w-24" />
      </div>
    </div>
  </SectionCard>
);

const WhatYouGetSkeleton: React.FC = () => (
  <SectionCard>
    <div className="space-y-4">
      <Bone className="h-7 w-36" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="flex items-center gap-3">
            <Bone className="h-5 w-5 flex-shrink-0" rounded="rounded-full" />
            <Bone
              className={`h-4 ${index % 3 === 0 ? "w-[60%]" : index % 2 === 0 ? "w-[72%]" : "w-[80%]"}`}
            />
          </div>
        ))}
      </div>
    </div>
  </SectionCard>
);

const YourCoursesSkeleton: React.FC = () => (
  <SectionCard>
    <div className="space-y-4">
      <Bone className="h-7 w-32" />
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-xl border border-gray-200/30 dark:border-white/[0.06]"
        >
          <div className="space-y-2 flex-1">
            <Bone className={`h-5 ${index === 1 ? "w-[75%]" : index === 2 ? "w-[65%]" : "w-[70%]"}`} />
            <Bone className="h-4 w-[85%]" />
          </div>
          <Bone className="h-10 w-32" rounded="rounded-xl" />
        </div>
      ))}
    </div>
  </SectionCard>
);

const NextStepsSkeleton: React.FC = () => (
  <SectionCard>
    <div className="space-y-4">
      <Bone className="h-7 w-36" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="p-4 rounded-xl border border-gray-200/30 dark:border-white/[0.06] space-y-3"
          >
            <Bone className="h-10 w-10" rounded="rounded-full" />
            <Bone className="h-5 w-[70%]" />
            <Bone className="h-4 w-full" />
            <Bone className="h-4 w-[80%]" />
          </div>
        ))}
      </div>
    </div>
  </SectionCard>
);

export const PostPaymentSuccessSkeleton: React.FC = () => (
  <div className="min-h-screen bg-background [@media(prefers-color-scheme:dark)]:bg-[#0B060D]">
    <main className="relative z-10 pt-10 lg:pt-20 bg-background [@media(prefers-color-scheme:dark)]:bg-[#0B060D] min-h-screen overflow-hidden">
      <div className="w-[90%] lg:w-[85%] max-w-[1000px] mx-auto py-12 space-y-16 lg:space-y-20">
        <SuccessHeaderSkeleton />
        <ImportantMessagesSkeleton />
        <OrderSummarySkeleton />
        <WhatYouGetSkeleton />
        <YourCoursesSkeleton />
        <NextStepsSkeleton />
      </div>
    </main>
  </div>
);

export default PostPaymentSuccessSkeleton;
