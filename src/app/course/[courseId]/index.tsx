import { BACKEND_URL, COURSE_ID } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import { decryptString, isLoggedIn } from "@/helpers";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { recordCourseView } from "@/utils/courseViewTracker";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import { selectOptimalModule } from "@/utils/moduleAccessUtils";
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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  let activeModule: any = null;
  let courseData: any = {};

  // Payment history for access verification
  const { historyData, loading: historyLoading } = usePaymentHistory();

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
      .then(async (res) => {
        // Set courseData FIRST before any other operations
        courseData = res.data;
        // Track course view for resume learning feature
        const courseId = parseInt(router.query.courseId as string);
        if (!isNaN(courseId)) {
          const progress = res.data.maxModuleSerialProgress || 0;
          const totalModules = res.data.chapters.reduce((sum: number, chapter: any) =>
            sum + (chapter.modules?.length || 0), 0
          );
          const progressPercent = totalModules > 0 ? Math.round((progress / totalModules) * 100) : 0;
          recordCourseView(courseId, progressPercent);
          //console.log('📚 Recorded course view:', { courseId, progress: progressPercent });
        }

        // Check if course has any content
        if (!res.data.chapters || res.data.chapters.length === 0) {
          setError("no-content");
          setLoading(false);
          setUser({ ...user, loading: false });
          return;
        }

        // Check if any chapter has modules
        const hasModules = res.data.chapters.some(
          (chapter: any) => chapter.modules && chapter.modules.length > 0,
        );

        if (!hasModules) {
          setError("no-content");
          setLoading(false);
          setUser({ ...user, loading: false });
          return;
        }

        // Don't auto-submit progress - causes crashes and infinite loops
        // Let users start naturally by clicking on modules
        // Use selectOptimalModule to get the best module to start from
        // This will prioritize nextModule from mostRecent API, then recent access, then progress
        try {
          const selectedModule = await selectOptimalModule({
            courseData: res.data,
            courseId: router.query.courseId as string,
            requestedModuleId: undefined,
            requestedChapterId: undefined,
          });

          // Find the actual module object
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
            setUser({ ...user, loading: false });
            router.replace(
              `/course/${router.query.courseId}/${activeModule.chapter_id}/${activeModule.id}`,
            );
            return;
          }
        } catch (error) {
          console.warn("Error in smart module selection, falling back to progress-based:", error);
        }

        // Fallback: If selectOptimalModule fails, use progress-based selection
        // Find the next module based on progress
        res.data.chapters.forEach((chapter: any) => {
          chapter.modules.forEach((module: any) => {
            if (module.serial === res.data.maxModuleSerialProgress + 1) {
              activeModule = module;
            }
          });
        });

        setUser({ ...user, loading: false });

        // If no active module found or course has no progress, get first available module
        if (activeModule === null) {
          // Find first module in first chapter
          for (const chapter of res.data.chapters) {
            if (chapter.modules && chapter.modules.length > 0) {
              activeModule = chapter.modules[0];
              break;
            }
          }

          // Fallback: use last module of last chapter if still null
          if (activeModule === null) {
            const chapters: Array<any> = res.data.chapters;
            const chapter = chapters[chapters.length - 1];
            const modules: Array<any> = chapter.modules;
            activeModule = modules[modules.length - 1];
          }
        }

        if (activeModule === null) {
          setError("no-content");
          setLoading(false);
          return;
        }

        router.replace(
          `/course/${router.query.courseId}/${activeModule.chapter_id}/${activeModule.id}`,
        );
      })
      .catch(() => {
        setError("fetch-error");
        setLoading(false);
        setUser({ ...user, loading: false });
      });
  };

  const submitProgress = (module_id: any, score: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!courseData || !courseData.chapters) return;

    const module_search = findObjectById(courseData, module_id);
    if (!module_search) return;

    if (module_search.is_live) {
      // Use a safe category or default to 'VIDEO'
      const moduleCategory = activeModule?.data?.category || "VIDEO";

      axios
        .post(
          `${BACKEND_URL}/user/module/addProgress/${module_id}?points=${score}&type=${moduleCategory}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(() => {
          // Don't refetch course data immediately to avoid infinite loops
          setUser({
            ...user,
            loading: false,
            scoreTrigger: !user.scoreTrigger,
          });
        })
        .catch(() => {
          setUser({ ...user, loading: false });
        });
    }
  };

  // Check if user has access to this course
  const courseAccess = historyData?.individual_courses?.find(
    (course) => course.course_id.toString() === router.query.courseId,
  );

  const bundleAccess = historyData?.bundle_purchases?.find((bundle) =>
    bundle.courses?.some((course) => course.id.toString() === router.query.courseId),
  );

  const hasAccess = !!courseAccess || !!bundleAccess;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Wait for router to be ready before checking authentication
  useEffect(() => {
    if (!router.isReady) return;

    if (!isLoggedIn()) {
      const currentDomain = window.location.href;
      window.location.href = `https://www.codervai.com/auth/login?redirect=${encodeURIComponent(currentDomain)}`;
      return;
    }
  }, [router.isReady, router]);

  useEffect(() => {

    // Only proceed if router is ready and we have courseId
    if (!router.isReady || !router.query.courseId) return;

    // Extract courseId from URL if router.query is empty
    let courseId = router.query.courseId;
    if (!courseId && router.asPath) {
      const match = router.asPath.match(/\/course\/(\d+)/);
      if (match) {
        courseId = match[1];
      }
    }

    // Fetch when we have a courseId (either from query or extracted from URL)
    if (courseId) {
      // Temporarily set the router query to help with the fetch
      if (!router.query.courseId) {
        router.query.courseId = courseId;
      }
      fetchCourse();
    }
  }, [router.isReady, router.query.courseId, router.asPath]);

  // Show initial loading only while router is not ready or critical data is loading
  const showInitialLoading =
    !mounted ||
    !router.isReady ||
    (loading && !courseData) ||
    (historyLoading && !historyData);

  if (showInitialLoading) {
    return <ModulePageSkeleton />;
  }

  // Security: Check if user has access to this course - redirect to course details if no access
  if (
    mounted &&
    historyData &&
    !hasAccess &&
    router.query.courseId
  ) {
    router.replace(`/course-details/${router.query.courseId}`);
    return <ModulePageSkeleton />;
  }

  // Show loading state for course content
  if (loading) {
    return <ModulePageSkeleton />;
  }

  // Show error states
  if (error === "no-content") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <svg
                className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Content Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This course doesn&apos;t have any content yet. Please check back
            later or contact support if you think this is an error.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.back()}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() =>
                router.push("/course-details/" + router.query.courseId)
              }
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
            Failed to Load Course
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn&apos;t load this course. Please check your internet
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
              onClick={() => router.back()}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // This should rarely be reached as we redirect on success
  return <></>;
}
