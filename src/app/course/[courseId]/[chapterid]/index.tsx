import { BACKEND_URL, COURSE_ID } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import { decryptString } from "@/helpers";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ModulePageSkeleton } from "@/components/Skeletons";

function findObjectById(data: any, targetId: any) {
  // Check if chapters exist in the data
  const chapters = data?.chapters || [];

  // Iterate through chapters
  for (const chapter of chapters) {
    // Check if modules exist in the current chapter
    const modules = chapter?.modules || [];

    // Iterate through modules searching for matching serial key
    for (let result of modules) {
      if (result.id === targetId) {
        return result;
      }
    }
  }

  // If no match is found, return undefined
  return undefined;
}

export default function CourseRedirect(): JSX.Element {
  const [user, setUser] = useContext<any>(UserContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  let activeModule: any = null;
  let lastValidModule: any = null;
  let courseData: any = {};

  const fetchCourse = () => {
    if (!router.query.courseId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setUser({ ...user, loading: true });
    setLoading(true);
    setError(null);
    axios
      .get(BACKEND_URL + "/user/course/getfull/" + router.query.courseId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        courseData = res.data;

        if (res.data.maxModuleSerialProgress === 0) {
          submitProgress(
            res.data.chapters[0].modules[0].id,
            res.data.chapters[0].modules[0].score,
            res.data,
          );
        }

        const targetChapterId = parseInt(router.query.chapterid as string);

        res.data.chapters.forEach((chapter: any) => {
          chapter.modules.forEach((module: any) => {
            // All modules are now unlocked - just find the target module
            if (module.chapter_id === targetChapterId) {
              activeModule = module;
            }

            // Keep track of next module for fallback
            if (module.serial === res.data.maxModuleSerialProgress + 1) {
              lastValidModule = module;
            }
          });
        });

        setUser({ ...user, loading: false });

        if (activeModule !== null) {
          router.replace(
            `/course/${router.query.courseId}/${activeModule.chapter_id}/${activeModule.id}`,
          );
        } else if (lastValidModule !== null) {
          router.replace(
            `/course/${router.query.courseId}/${lastValidModule.chapter_id}/${lastValidModule.id}`,
          );
        } else {
          // Find first module in target chapter or fallback to last module
          const targetChapter = res.data.chapters.find(
            (ch: any) => ch.id === targetChapterId,
          );
          if (targetChapter && targetChapter.modules.length > 0) {
            const firstModule = targetChapter.modules[0];
            router.replace(
              `/course/${router.query.courseId}/${firstModule.chapter_id}/${firstModule.id}`,
            );
          } else {
            const chapters: Array<any> = res.data.chapters;
            const chapter = chapters[chapters.length - 1];
            const modules: Array<any> = chapter.modules;
            const validModule = modules[modules.length - 1];
            router.replace(
              `/course/${router.query.courseId}/${validModule.chapter_id}/${validModule.id}`,
            );
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching course chapter:", err);
        setError("fetch-error");
        setLoading(false);
        setUser({ ...user, loading: false });
      });
  };

  const submitProgress = (
    module_id: any,
    score: any,
    courseDataOverride?: any,
  ) => {
    const token = localStorage.getItem("token");
    const sourceCourseData = courseDataOverride || courseData;
    const module_search = findObjectById(sourceCourseData, module_id);

    if (!module_search || !module_search.is_live) {
      return;
    }

    if (module_search.is_live) {
      axios
        .post(
          `${BACKEND_URL}/user/module/addProgress/${module_id}?points=${score}&type=${activeModule?.data?.category}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          axios
            .get(
              BACKEND_URL + "/user/course/getfull/" + router.query.courseId,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            .then((res) => {
              courseData = res.data;

              if (res.data.maxModuleSerialProgress === 0) {
                submitProgress(
                  res.data.chapters[0].modules[0].id,
                  res.data.chapters[0].modules[0].score,
                  res.data,
                );
              }

              setUser({
                ...user,
                loading: false,
                scoreTrigger: !user.scoreTrigger,
              });
            })
            .catch((err) => {
              setUser({ ...user, loading: false });
            });
        })
        .catch((err) => {
          setUser({ ...user, loading: false });
        });
    }
  };

  useEffect(() => {
    // Only fetch when router is ready and courseId is available
    if (router.isReady && router.query.courseId) {
      fetchCourse();
    }
  }, [router.isReady, router.query.courseId]);

  // Show loading state
  if (loading) {
    return <ModulePageSkeleton />;
  }

  // Show error state
  if (error === "fetch-error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900">
              <svg
                className="h-8 w-8 text-red-600 dark:text-red-400"
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Failed to Load Chapter
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn&apos;t load this chapter. Please check your internet
            connection and try again.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setError(null);
                fetchCourse();
              }}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/course/" + router.query.courseId)}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  // This should rarely be reached as we redirect on success
  return <></>;
}
