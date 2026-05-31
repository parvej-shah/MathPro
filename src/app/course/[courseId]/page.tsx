'use client';

import { BACKEND_URL } from "@/api.config";
import { isLoggedIn } from "@/helpers";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { recordCourseView } from "@/utils/courseViewTracker";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { selectOptimalModule } from "@/utils/moduleAccessUtils";
import { ModulePageSkeleton } from "@/components/Skeletons";

export default function CourseRedirect() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string | undefined;

  const { historyData, loading: historyLoading } = usePaymentHistory();

  const fetchCourse = () => {
    if (!courseId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError(null);

    axios
      .get(`${BACKEND_URL}/user/course/getfull/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(async (res) => {
        const parsedCourseId = parseInt(courseId);
        if (!isNaN(parsedCourseId)) {
          const progress = res.data.maxModuleSerialProgress || 0;
          const totalModules = res.data.chapters.reduce(
            (sum: number, chapter: any) => sum + (chapter.modules?.length || 0),
            0,
          );
          const progressPercent =
            totalModules > 0 ? Math.round((progress / totalModules) * 100) : 0;
          recordCourseView(parsedCourseId, progressPercent);
        }

        if (
          !res.data.chapters ||
          res.data.chapters.length === 0 ||
          !res.data.chapters.some(
            (chapter: any) => chapter.modules && chapter.modules.length > 0,
          )
        ) {
          setError("no-content");
          setLoading(false);
          return;
        }

        let activeModule: any = null;

        try {
          const selectedModule = await selectOptimalModule({
            courseData: res.data,
            courseId,
            requestedModuleId: undefined,
            requestedChapterId: undefined,
          });

          res.data.chapters.forEach((chapter: any) => {
            chapter.modules.forEach((module: any) => {
              if (
                module.id === selectedModule.moduleId &&
                module.chapter_id === selectedModule.chapterId
              ) {
                activeModule = module;
              }
            });
          });

          if (activeModule) {
            router.replace(
              `/course/${courseId}/${activeModule.chapter_id}/${activeModule.id}`,
            );
            return;
          }
        } catch {
          // fall through to progress-based selection
        }

        // Progress-based fallback
        res.data.chapters.forEach((chapter: any) => {
          chapter.modules.forEach((module: any) => {
            if (module.serial === res.data.maxModuleSerialProgress + 1) {
              activeModule = module;
            }
          });
        });

        if (activeModule === null) {
          for (const chapter of res.data.chapters) {
            if (chapter.modules && chapter.modules.length > 0) {
              activeModule = chapter.modules[0];
              break;
            }
          }
        }

        if (activeModule === null) {
          const chapters: Array<any> = res.data.chapters;
          const lastChapter = chapters[chapters.length - 1];
          const modules: Array<any> = lastChapter.modules;
          activeModule = modules[modules.length - 1];
        }

        if (activeModule === null) {
          setError("no-content");
          setLoading(false);
          return;
        }

        router.replace(
          `/course/${courseId}/${activeModule.chapter_id}/${activeModule.id}`,
        );
      })
      .catch(() => {
        setError("fetch-error");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      const currentDomain = window.location.href;
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentDomain)}`;
      return;
    }

    if (courseId) {
      fetchCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Access check
  const courseAccess = historyData?.individual_courses?.find(
    (course) => course.course_id.toString() === courseId,
  );
  const bundleAccess = historyData?.bundle_purchases?.find((bundle) =>
    bundle.courses?.some((course) => course.id.toString() === courseId),
  );
  const hasAccess = !!courseAccess || !!bundleAccess;

  if (historyData && !hasAccess && courseId) {
    router.replace(`/course-details/${courseId}`);
    return <ModulePageSkeleton />;
  }

  if (!courseId || historyLoading || loading) {
    return <ModulePageSkeleton />;
  }

  if (error === "no-content") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-warning/15">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-heading mb-4">
            No Content Available
          </h2>
          <p className="text-paragraph mb-6">
            This course doesn&apos;t have any content yet. Please check back
            later or contact support if you think this is an error.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push(`/course-details/${courseId}`)}
              className="w-full bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
            >
              View Course Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error === "fetch-error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-destructive/15">
              <svg
                className="h-8 w-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-heading mb-4">
            Failed to Load Course
          </h2>
          <p className="text-paragraph mb-6">
            We couldn&apos;t load this course. Please check your internet
            connection and try again.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                fetchCourse();
              }}
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
            <button
              onClick={() => router.back()}
              className="w-full bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ModulePageSkeleton />;
}
