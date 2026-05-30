'use client';

import { BACKEND_URL } from "@/api.config";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ModulePageSkeleton } from "@/components/Skeletons";

export default function ChapterRedirect() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string | undefined;
  const chapterId = params?.chapterid as string | undefined;

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
      .then((res) => {
        const targetChapterId = parseInt(chapterId ?? "");
        let activeModule: any = null;
        let lastValidModule: any = null;

        res.data.chapters.forEach((chapter: any) => {
          chapter.modules.forEach((module: any) => {
            if (module.chapter_id === targetChapterId) {
              activeModule = module;
            }
            if (module.serial === res.data.maxModuleSerialProgress + 1) {
              lastValidModule = module;
            }
          });
        });

        if (activeModule !== null) {
          router.replace(
            `/course/${courseId}/${activeModule.chapter_id}/${activeModule.id}`,
          );
        } else if (lastValidModule !== null) {
          router.replace(
            `/course/${courseId}/${lastValidModule.chapter_id}/${lastValidModule.id}`,
          );
        } else {
          const targetChapter = res.data.chapters.find(
            (ch: any) => ch.id === targetChapterId,
          );
          if (targetChapter && targetChapter.modules.length > 0) {
            const firstModule = targetChapter.modules[0];
            router.replace(
              `/course/${courseId}/${firstModule.chapter_id}/${firstModule.id}`,
            );
          } else {
            const chapters: Array<any> = res.data.chapters;
            const lastChapter = chapters[chapters.length - 1];
            const validModule =
              lastChapter.modules[lastChapter.modules.length - 1];
            router.replace(
              `/course/${courseId}/${validModule.chapter_id}/${validModule.id}`,
            );
          }
        }
      })
      .catch(() => {
        setError("fetch-error");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (courseId && chapterId) {
      fetchCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, chapterId]);

  if (loading) {
    return <ModulePageSkeleton />;
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
            Failed to Load Chapter
          </h2>
          <p className="text-paragraph mb-6">
            We couldn&apos;t load this chapter. Please check your internet
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
              onClick={() => router.push(`/course/${courseId}`)}
              className="w-full bg-muted text-muted-foreground px-6 py-3 rounded-lg hover:bg-muted/80 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <ModulePageSkeleton />;
}
