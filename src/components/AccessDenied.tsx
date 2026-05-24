"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface AccessDeniedProps {
  title?: string;
  message?: string;
  showCourseDetails?: boolean;
  courseId?: string;
  className?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  title = "Access Denied",
  message = "You don't have access to this content. Please enroll first to access it.",
  showCourseDetails = false,
  courseId,
  className = "",
}) => {
  const router = useRouter();

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background px-4 ${className}`}>
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-warning/10">
            <svg
              className="h-8 w-8 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-4">
          {title}
        </h2>
        <p className="text-muted-foreground mb-6">
          {message}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => router.push("/courses")}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Browse Courses
          </button>
          {showCourseDetails && courseId && (
            <button
              onClick={() => router.push(`/course-details/${courseId}`)}
              className="w-full bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors font-semibold"
            >
              View Course Details
            </button>
          )}
          <button
            onClick={() => router.push("/my-courses")}
            className="w-full bg-muted text-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors font-semibold"
          >
            My Courses
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
