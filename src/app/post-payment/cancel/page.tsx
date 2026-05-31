"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const courseId = searchParams.get("courseId") ?? "12";
    const timer = setTimeout(() => {
      router.push(`/course-details/${courseId}`);
    }, 3000);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4 px-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-destructive"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          কোর্সটি কেনা হয়নি
        </h1>
        <p className="text-muted-foreground text-sm">অপেক্ষা করো, রিডাইরেক্ট হচ্ছে...</p>
        <div className="flex justify-center">
          <span className="inline-block w-6 h-6 border-2 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
}
