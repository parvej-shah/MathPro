'use client';

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "@/Contexts/UserContext";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { decryptString } from "@/helpers";
import { Toaster, toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import {
  selectOptimalModule,
  saveLastAccessedModule,
} from "@/utils/moduleAccessUtils";
import { useUpdateStreak } from "@/hooks/useStreak";
import DiscussionSection from "@/components/DiscussionSection";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";
import ModuleFeedback from "@/components/ModuleFeedback";
import { ModulePageSkeleton } from "@/components/Skeletons";
import CourseSidebar from "./_components/CourseSidebar";
import ModulePlayer from "./_components/ModulePlayer";
import ModuleNavButtons from "./_components/ModuleNavButtons";

function findObjectBySerial(data: any, targetSerial: any) {
  // Check if chapters exist in the data
  const chapters = data?.chapters || [];

  // Iterate through chapters
  for (const chapter of chapters) {
    // Check if modules exist in the current chapter
    const modules = chapter?.modules || [];

    // Iterate through modules searching for matching serial key
    for (let result of modules) {
      if (result.serial === targetSerial) {
        return result;
      }
    }
  }

  // If no match is found, return undefined
  return undefined;
}
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

export default function CourseDetailsPage() {
  const [user, setUser] = useContext<any>(UserContext);
  const [quizAnswer, setQuizAnswer] = useState<any>({});
  const [fetchingTrigger, setFetchingTrigger] = useState(false);
  const [assignmentSubmission, setAssignmentSubmission] = useState({
    youtube_link: "",
    github_link: "",
  });
  const [assignmentEvaluted, setAssignmentEvaluted] = useState<any>([]);
  const [discussionLoading, setDiscussionLoading] = useState(false);
  const [activeModule, setActiveModule] = useState<any>({});
  const [quizScore, setQuizScore] = useState<any>(0);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<boolean>(false);

  const [cfHandle, setCfHandle] = useState<any>("");

  const params = useParams();
  const courseId = params?.courseId as string | undefined;
  const chapterId = params?.chapterid as string | undefined;
  const moduleId = params?.moduleid as string | undefined;

  // Streak tracking hook
  const { updateStreakAsync } = useUpdateStreak();

  // Utility function to check if we should show streak notification today
  const shouldShowStreakNotification = () => {
    const today = new Date().toDateString();
    const lastNotificationDate = localStorage.getItem(
      "lastStreakNotificationDate",
    );
    return lastNotificationDate !== today;
  };

  // Utility function to mark streak notification as shown today
  const markStreakNotificationShown = () => {
    localStorage.setItem(
      "lastStreakNotificationDate",
      new Date().toDateString(),
    );
  };

  const [courseData, setCourseData] = useState<any>({});
  const [discussions, setDiscussions] = useState<any>([]);
  const [openDiscussions, setOpenDiscussions] = useState<any>(false);
  const [quizVerdict, setQuizVerdict] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState<any>("");
  const [showQuizAnswer, setShowQuizAnswer] = useState(false);
  const activeModuleRef = useRef<HTMLButtonElement>(null);
  const [activeThreads, setActiveThreads] = useState<any>({});
  const [subdiscussionTexts, setSubdiscussionTexts] = useState<any>({});
  const [subdiscussionComments, setSubdiscussionComments] = useState<any>({});
  const [openDiscussionDeleteDialogue, setOpenDicussionDeleteDialogue] =
    useState<any>(false);
  const [deleteOption, setDeleteOption] = useState<any>("");
  const [activeCommentDeletionData, setActiveCommentDeletionData] =
    useState<any>(null);

  // Quiz timer states
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [timerExpired, setTimerExpired] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Track if quiz was just submitted (for showing answers immediately)
  const [justSubmitted, setJustSubmitted] = useState<boolean>(false);

  // Helper function to check if unlock chapter button should be shown
  const shouldShowUnlockChapterButton = () => {
    if (!courseData?.chapters || !chapterId) return false;

    const currentChapterId = parseInt(chapterId);
    const currentChapter = courseData.chapters.find(
      (chapter: any) => chapter.id === currentChapterId,
    );

    // Show button only if the current chapter has allowed_unlock set to true
    return currentChapter?.allowed_unlock === true;
  };

  // Helper function to get all modules in the current chapter
  const getCurrentChapterModules = () => {
    if (!courseData?.chapters || !chapterId) return [];

    const currentChapterId = parseInt(chapterId);
    const currentChapter = courseData.chapters.find(
      (chapter: any) => chapter.id === currentChapterId,
    );

    return currentChapter?.modules || [];
  };

  // Helper function to unlock all modules in the current chapter
  const unlockCurrentChapter = () => {
    const currentChapterModules = getCurrentChapterModules();

    if (currentChapterModules.length === 0) {
      toast.error("No modules found in current chapter");
      return;
    }

    // Find the last module in the current chapter
    const lastModuleInChapter = currentChapterModules.reduce(
      (latest: any, current: any) => {
        return current.serial > latest.serial ? current : latest;
      },
    );

    if (!lastModuleInChapter) {
      toast.error("Unable to find chapter modules");
      return;
    }

    // Submit progress for the last module in the chapter
    // This will unlock all modules up to that point
    submitProgress(lastModuleInChapter.id, lastModuleInChapter.score);

    toast.success(
      `Chapter unlocked! All modules in this chapter are now accessible.`,
    );

    // Optionally refresh the course data to reflect the changes
    setTimeout(() => {
      fetchCourse();
    }, 1000);
  };

  const isActiveChapter = (chapter: any) => {
    for (const mod of chapter.modules) {
      if (String(mod.id) === String(activeModule?.id)) {
        return true;
      }
    }

    return false;
  };

  const submitNewDiscussion = () => {
    const token = localStorage.getItem("token");
    if (newDiscussion.length > 0) {
      axios
        .post(
          BACKEND_URL + "/user/discussion/create/" + activeModule.id,
          {
            content: newDiscussion,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          fetchDiscussions();
          setNewDiscussion("");
          toast.success("Your comment was added!");
        })
        .catch((err) => {});
    }
  };

  const deleteDiscussion = () => {
    const token = localStorage.getItem("token");
    let url = "";
    if (deleteOption == "subdiscussion") {
      url =
        BACKEND_URL +
        "/user/subDiscussion/delete/" +
        activeCommentDeletionData.id;
    } else if (deleteOption == "discussion") {
    }
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast.success("You comment was deleted successfully!");
        if (deleteOption == "subdiscussion") {
          fetchSubdiscussions(activeCommentDeletionData.discussion_id);
          setActiveCommentDeletionData({});
        }
      })
      .catch((err) => {
        toast.error("You comment deletion failed!");
      });
  };

  // Quiz Timer Helper Functions
  const getQuizTimerKey = (moduleId: number) => `quiz_timer_${moduleId}`;

  const getTimerFromStorage = (moduleId: number) => {
    try {
      const timerData = localStorage.getItem(getQuizTimerKey(moduleId));
      if (timerData) {
        return JSON.parse(timerData);
      }
    } catch (error) {
      console.error("Error reading timer from localStorage:", error);
    }
    return null;
  };

  const saveTimerToStorage = (
    moduleId: number,
    startTime: number,
    totalTime: number,
    submitted: boolean,
    quizScore: number = 0,
    quizAnswer: any = {},
    quizVerdict: boolean[] = [],
  ) => {
    try {
      const timerData = {
        startTime,
        totalTime,
        submitted,
        quizScore,
        quizAnswer,
        quizVerdict,
      };
      localStorage.setItem(
        getQuizTimerKey(moduleId),
        JSON.stringify(timerData),
      );
    } catch (error) {
      console.error("Error saving timer to localStorage:", error);
    }
  };

  const clearTimerFromStorage = (moduleId: number) => {
    try {
      localStorage.removeItem(getQuizTimerKey(moduleId));
    } catch (error) {
      console.error("Error clearing timer from localStorage:", error);
    }
  };

  const initializeQuizTimer = (moduleId: number, totalQuestions: number) => {
    const totalTime = totalQuestions * 60; // 60 seconds per question
    const existingTimer = getTimerFromStorage(moduleId);

    if (existingTimer) {
      // Timer exists in storage
      if (existingTimer.submitted) {
        // Quiz already submitted - NEVER show timer again
        // Just show the results without any timer UI
        setTimerExpired(false); // Don't show "Time's Up" message
        setTimerActive(false); // Don't show timer
        setShowQuizAnswer(true); // Show results
        setJustSubmitted(false); // NOT just submitted (returning after refresh)

        // RESTORE SCORE, ANSWERS and VERDICT if available
        if (existingTimer.quizScore !== undefined) {
          setQuizScore(existingTimer.quizScore);
        }
        if (existingTimer.quizAnswer) {
          setQuizAnswer(existingTimer.quizAnswer);
        }
        if (existingTimer.quizVerdict) {
          setQuizVerdict(existingTimer.quizVerdict);
        }
        return;
      }

      // Calculate remaining time
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsedTime = currentTime - existingTimer.startTime;
      const remaining = existingTimer.totalTime - elapsedTime;

      if (remaining <= 0) {
        // Timer expired while user was away
        setTimeRemaining(0);
        setTimerExpired(true);
        setTimerActive(false);
        handleTimerExpiry(moduleId);
      } else {
        // Resume timer
        setTimeRemaining(remaining);
        setTimerActive(true);
        setTimerExpired(false);
      }
    } else {
      // No existing timer, create new one (first time taking this quiz)
      const startTime = Math.floor(Date.now() / 1000);
      saveTimerToStorage(moduleId, startTime, totalTime, false);
      setTimeRemaining(totalTime);
      setTimerActive(true);
      setTimerExpired(false);
    }
  };

  const handleTimerExpiry = (moduleId: number) => {
    setTimerExpired(true);
    setTimerActive(false);

    // Determine which calculation to use - this needs to match submitQuiz logic roughly
    // BUT submitQuiz is an async/complex function.
    // For auto-submit, we might just mark as submitted with 0 score if we can't calculate it here easily,
    // OR we trigger the actual submitQuiz function mechanism?

    // In strict auto-submit we often just close the quiz.
    // If we want to save the score, we'd need to calculate it.
    // But handleTimerExpiry is called from interval/init check.

    // Best interaction: call submitQuiz() programmatically?
    // submitQuiz expects an event or just call it.
    submitQuiz();

    // Mark as submitted in storage
    const existingTimer = getTimerFromStorage(moduleId);
    if (existingTimer) {
      // When auto-submitting, we don't have the final score/answers yet from submitQuiz()
      // as it's async. So we mark as submitted and let the subsequent fetch/re-render
      // pick up the actual score/answers from the backend.
      // For now, we just mark it as submitted.
      saveTimerToStorage(
        moduleId,
        existingTimer.startTime,
        existingTimer.totalTime,
        true,
      );
    }
  };

  const clearQuizTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTimerActive(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = (remaining: number, total: number): string => {
    const percentage = (remaining / total) * 100;
    if (percentage > 50) return "#10b981"; // green
    if (percentage > 20) return "#f59e0b"; // orange
    return "#ef4444"; // red
  };

  const retakeQuiz = () => {
    // Clear timer from localStorage
    clearTimerFromStorage(activeModule.id);

    // Reset all quiz states
    setQuizAnswer([]);
    setQuizVerdict([]);
    setShowQuizAnswer(false);
    setQuizScore(0);
    setTimerExpired(false);
    setTimerActive(false);
    setTimeRemaining(0);
    setJustSubmitted(false); // Reset just submitted flag

    // Reinitialize timer
    if (activeModule?.data?.quiz) {
      const totalQuestions = activeModule?.data?.quiz?.length;
      initializeQuizTimer(activeModule.id, totalQuestions);
    }
  };

  const checkCFStatus = () => {
    const token = localStorage.getItem("token");
    axios
      .post(
        BACKEND_URL + `/user/module/checkCfStatus`,
        { problem: activeModule?.data?.cf_name, handle: cfHandle },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        if (res.data.data.solved) {
          submitProgress(activeModule?.id, activeModule.score);
        } else {
          toast.error("You have not solved this problem yet!");
        }
      })
      .catch((err) => {
        toast.error("Please provide a valid Codeforces handle!");
      });
  };

  // Centralized in-course module switch. Updates active module via state (no full
  // course refetch) and syncs the URL shallowly so it does NOT retrigger the
  // course-fetch effect (which now keys on courseId only). Per-category side
  // effects mirror the original sidebar/Next behavior.
  const goToModule = (module: any) => {
    if (!module) return;

    // Persist last position (fire and forget).
    saveLastAccessedModule(
      courseId as string,
      module.id,
      module.chapter_id,
    ).catch(() => {
      // Silently handle errors - already logged in service
    });

    const category = module.data?.category;
    const taken = courseData?.isTaken || false;

    // ASSIGNMENT needs its evaluation fetched before showing.
    if (category === "ASSIGNMENT" && taken) {
      fetchEvalutedAssignment(module.id);
    }
    // VIDEO/PDF/TEXT auto-submit progress on open.
    if (category === "VIDEO" || category === "PDF" || category === "TEXT") {
      submitProgress(module.id, module.score);
    }

    setActiveModule(module);

    // Shallow URL sync — keep the address bar correct without re-fetching the
    // course. window.history avoids triggering useParams-driven effects.
    if (typeof window !== "undefined" && courseId) {
      window.history.replaceState(
        null,
        "",
        `/course/${courseId}/${module.chapter_id}/${module.id}`,
      );
    }
  };

  const fetchCourse = () => {
    if (!courseId) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setPageLoading(true);
    setPageError(false);
    axios
      .get(BACKEND_URL + "/user/course/getfull/" + courseId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        setCourseData(res.data);
        if (res.data.maxModuleSerialProgress === 0) {
          submitProgress(
            res.data.chapters[0].modules[0].id,
            res.data.chapters[0].modules[0].score,
            res.data,
          );
        }

        // REMOVED: Progress-based access restriction (unrestricted-module-access feature)
        // Previous behavior: Only allowed access to modules up to maxModuleSerialProgress + 1
        // The code below checked if module.serial <= res.data.maxModuleSerialProgress + 1
        // and redirected users to "valid" modules based on their progress.
        //
        // OLD CODE (commented out):
        // let targetModule: any = null;
        // let lastValidModule: any = null;
        //
        // res.data.chapters.forEach((chapter: any) => {
        //   chapter.modules.forEach((module: any) => {
        //     if (
        //       module.id === parseInt(moduleId as string) &&
        //       module.chapter_id ===
        //       parseInt(chapterId as string) &&
        //       module.serial <= res.data.maxModuleSerialProgress + 1  // <-- PROGRESS CHECK REMOVED
        //     ) {
        //       targetModule = module;
        //     }
        //
        //     if (module.serial === res.data.maxModuleSerialProgress + 1) {
        //       lastValidModule = module;
        //     }
        //   });
        // });
        //
        // if (targetModule !== null) {
        //   setActiveModule(targetModule);
        //   console.log("Target module found:", targetModule);
        // } else if (lastValidModule !== null) {
        //   router.replace(
        //     `/course/${lastValidModule.chapter_id}/${lastValidModule.id}`,
        //   );
        //   console.log("Last valid module found:", lastValidModule);
        // } else {
        //   const chapters: Array<any> = res.data.chapters;
        //   const chapter = chapters[chapters.length - 1];
        //   const modules: Array<any> = chapter.modules;
        //   const validModule = modules[modules.length - 1];
        //
        //   router.replace(`/course/${validModule.chapter_id}/${validModule.id}`);
        //   console.log("No valid module found:", validModule);
        // }

        // NEW CODE: Unrestricted module access with smart module selection
        // Users can now access any module regardless of progress
        // Use smart module selector to determine optimal starting module
        try {
          // Error handling: Validate course data structure
          if (!res.data.chapters || res.data.chapters.length === 0) {
            console.error("No chapters found in course data");
            toast.error("This course has no content available");
            setPageLoading(false);
            return;
          }

          const selectedModule = await selectOptimalModule({
            courseData: res.data,
            courseId: courseId as string,
            requestedModuleId: moduleId ? parseInt(moduleId) : undefined,
            requestedChapterId: chapterId ? parseInt(chapterId) : undefined,
          });

          // Find the actual module object
          let targetModule: any = null;
          res.data.chapters.forEach((chapter: any) => {
            chapter.modules.forEach((module: any) => {
              if (
                module.id === selectedModule.moduleId &&
                module.chapter_id === selectedModule.chapterId
              ) {
                targetModule = module;
              }
            });
          });

          if (targetModule !== null) {
            setActiveModule(targetModule);
            // Save to backend for future visits (fire and forget - don't block UI)
            saveLastAccessedModule(
              courseId as string,
              targetModule.id,
              targetModule.chapter_id,
            ).catch((err) => {
              // Silently handle errors - already logged in service
            });

          } else {
            // Fallback: Selected module not found, try first module
            console.warn(
              "Selected module not found in course data, falling back to first module",
            );
            const firstChapter = res.data.chapters.find(
              (ch: any) => ch.is_live,
            );
            if (
              firstChapter &&
              firstChapter.modules &&
              firstChapter.modules.length > 0
            ) {
              const firstModule = firstChapter.modules[0];
              setActiveModule(firstModule);
              saveLastAccessedModule(
                courseId as string,
                firstModule.id,
                firstModule.chapter_id,
              ).catch((err) => {
                // Silently handle errors - already logged in service
              });

              // Development logging for fallback module
              if (process.env.NODE_ENV === "development") {
                console.log(
                  `⚠️ FALLBACK: ${firstModule.title} (ID: ${firstModule.id}) | ${firstModule.data?.category}`,
                );
              }
            } else {
              console.error("No valid modules found in course");
              toast.error("Unable to load course content");
            }
          }
        } catch (error) {
          // Error handling: Catch any errors from smart module selector or module finding
          console.error("Error in module selection:", error);
          toast.error("Error loading module. Please try again.");

          // Fallback to first available module
          try {
            const firstChapter = res.data.chapters.find(
              (ch: any) => ch.is_live,
            );
            if (
              firstChapter &&
              firstChapter.modules &&
              firstChapter.modules.length > 0
            ) {
              const firstModule = firstChapter.modules[0];
              setActiveModule(firstModule);

              // Development logging for error fallback module
              if (process.env.NODE_ENV === "development") {
                console.log(
                  `🚨 ERROR FALLBACK: ${firstModule.title} (ID: ${firstModule.id})`,
                );
              }
            }
          } catch (fallbackError) {
            console.error(
              "Fallback module selection also failed:",
              fallbackError,
            );
          }
        }

        setPageLoading(false);
      })
      .catch((err) => {
        setPageLoading(false);
        setPageError(true);
      });
  };

  const fetchEvalutedAssignment = (moduleId: any) => {
    const token = localStorage.getItem("token");
    axios
      .get(BACKEND_URL + "/user/assignment/view/" + moduleId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAssignmentEvaluted(res.data.data);
        if (res.data.data.length > 0) {
          setAssignmentSubmission(res.data.data[0].submission);
        } else {
          setAssignmentSubmission({ youtube_link: "", github_link: "" });
        }
      })
      .catch((err) => {
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
          // Update streak after successful progress submission
          if (courseId) {
            updateStreakAsync(courseId)
              .then((streakData) => {
                // Only show notifications once per day
                if (shouldShowStreakNotification()) {
                  // Show celebration if new record
                  if (streakData?.isNewRecord) {
                    toast.success(
                      `🎉 New streak record: ${streakData.currentStreak} days!`,
                      {
                        duration: 4000,
                      },
                    );
                    markStreakNotificationShown();
                  } else if (
                    streakData?.currentStreak &&
                    streakData.currentStreak > 1
                  ) {
                    // Show regular streak notification for continuing streaks
                    toast.success(
                      `🔥 ${streakData.currentStreak} day streak!`,
                      {
                        duration: 3000,
                      },
                    );
                    markStreakNotificationShown();
                  }
                }
              })
              .catch((error) => {
                // Silently fail - don't disrupt the user experience
                console.error("Failed to update streak:", error);
              });
          }

          axios
            .get(
              BACKEND_URL + "/user/course/getfull/" + courseId,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            .then((res) => {
              setCourseData(res.data);
              if (res.data.maxModuleSerialProgress === 0) {
                submitProgress(
                  res.data.chapters[0].modules[0].id,
                  res.data.chapters[0].modules[0].score,
                  res.data,
                );
              }

              setUser({
                ...user,
                scoreTrigger: !user.scoreTrigger,
              });
            })
            .catch((err) => {
            });
        })
        .catch((err) => {
        });
    }
  };

  const submitQuiz = () => {
    let quizes = activeModule?.data?.quiz;
    let verdict: any = [];
    const total_quiz = quizes.length;
    let accepted_answer = 0;
    quizes.forEach((quiz: any, index: any) => {
      // Use answer or correct_answer for backward/forward compatibility
      const decrypted = decryptString(
        quiz.answer || quiz.correct_answer,
        process.env.NEXT_PUBLIC_SECRET_KEY_QUIZ,
      );
      if (decrypted === quizAnswer[index]) {
        verdict.push(true);
        accepted_answer += 1;
        // submitProgress(activeModule.id);
      } else {
        verdict.push(false);
      }
    });
    setShowQuizAnswer(true);
    const real_score = (accepted_answer / total_quiz) * activeModule.score;
    setQuizScore(real_score);

    setQuizVerdict(verdict);
    submitProgress(activeModule.id, real_score);

    // Mark as just submitted (to show answers immediately)
    setJustSubmitted(true);

    // Clear timer and mark as submitted WITH SCORE, ANSWERS AND VERDICT
    clearQuizTimer();
    const existingTimer = getTimerFromStorage(activeModule.id);
    if (existingTimer) {
      saveTimerToStorage(
        activeModule.id,
        existingTimer.startTime,
        existingTimer.totalTime,
        true,
        real_score,
        quizAnswer,
        verdict,
      );
    }
  };

  useEffect(() => {
    setQuizAnswer([]);
    setQuizVerdict([]);
    setShowQuizAnswer(false);

    // Only fetch discussions when activeModule.id is available
    if (activeModule?.id) {
      fetchDiscussions();
    }

    // Auto-submit progress for VIDEO/PDF/TEXT on first view only
    // Backend tracks if already submitted, so this won't duplicate
    if (activeModule?.is_free || courseData?.isTaken) {
      if (
        activeModule?.data?.category === "VIDEO" ||
        activeModule?.data?.category === "PDF" ||
        activeModule?.data?.category === "TEXT"
      ) {
        submitProgress(activeModule.id, activeModule.score);
      }
    }
  }, [
    activeModule?.id,
    courseData?.isTaken,
    courseData?.maxModuleSerialProgress,
  ]);

  const submitAssignment = (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (assignmentEvaluted?.length > 0) {
      axios
        .put(
          BACKEND_URL + "/user/assignment/edit/" + activeModule.id,
          {
            submission: assignmentSubmission,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(() => {
          toast.success("Assignment Submitted Successfully");
          submitProgress(activeModule.id, activeModule.score);
        })
        .catch((err) => {
          toast.error("Something Went Wrong");
        });
    } else {
      axios
        .post(
          BACKEND_URL + "/user/assignment/submit/" + activeModule.id,
          {
            submission: assignmentSubmission,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then(() => {
          toast.success("Assignment Submitted Successfully");
          submitProgress(activeModule.id, activeModule.score);
        })
        .catch((err) => {
          toast.error("Something Went Wrong");
        });
    }
  };

  const fetchDiscussions = () => {
    if (!activeModule?.id) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setDiscussionLoading(true);
    setDiscussions([]);
    axios
      .get(BACKEND_URL + `/user/discussion/list/${activeModule.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDiscussionLoading(false);
        setDiscussions(res.data.data);
        let tempActiveThreads: any = {};
        let tempSubdiscussionTexts: any = {};
        let tempSubdiscussionComments: any = {};
        res.data.data.forEach((elem: any, index: any) => {
          tempActiveThreads[elem.id] = false;
          ((tempSubdiscussionTexts[elem.id] = ""),
            (tempSubdiscussionComments[elem.id] = []));
        });
        setSubdiscussionComments(tempSubdiscussionComments);
        setSubdiscussionTexts(tempSubdiscussionTexts);
        setActiveThreads(tempActiveThreads);
      })
      .catch((err) => {
        console.warn("Error fetching discussions:", err);
        setDiscussionLoading(false);
      });
  };
  const fetchSubdiscussions = (id: any) => {
    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + `/user/subDiscussion/list/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setSubdiscussionComments((prev: any) => ({
          ...prev,
          [id]: res.data.data,
        }));
      })
      .catch((err) => {});
  };
  const postSubdiscussion = (id: any) => {
    const token = localStorage.getItem("token");
    if (subdiscussionTexts[id].length > 0) {
      axios
        .post(
          BACKEND_URL + "/user/subDiscussion/create/" + id,
          {
            content: subdiscussionTexts[id],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          fetchSubdiscussions(id);
          setSubdiscussionTexts((prev: any) => ({ ...prev, [id]: "" }));
          toast.success("Your comment was added!");
        })
        .catch((err) => {});
    }
  };

  const getCFHandle = () => {
    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + "/user/module/getCfHandle", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCfHandle(res.data.data[0].cf_handle);
      })
      .catch((err) => {
      });
  };

  useEffect(() => {
    // Fetch the full course only when the course itself changes. Module/chapter
    // selection within a loaded course is handled by goToModule (state + shallow
    // URL sync), so switching modules no longer refetches the whole course.
    if (courseId) {
      fetchCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  useEffect(() => {
    // Development logging when activeModule changes
    if (process.env.NODE_ENV === "development" && activeModule?.id) {
      const category = activeModule.data?.category;
      const resources =
        [
          activeModule.data?.video_url ||
          activeModule.data?.videoUrl ||
          activeModule.data?.video
            ? "Video"
            : null,
          activeModule.data?.youtube_id ? "YouTube" : null,
          activeModule.data?.pdf_url ||
          activeModule.data?.pdfUrl ||
          activeModule.data?.pdf_link
            ? "PDF"
            : null,
          activeModule.data?.quiz?.length
            ? `Quiz(${activeModule?.data?.quiz.length})`
            : null,
          category === "ASSIGNMENT" && activeModule.data?.description
            ? "Assignment"
            : null,
          category === "CODE" &&
          (activeModule.data?.problem_url || activeModule.data?.problemUrl)
            ? "Code"
            : null,
          category === "TEXT" &&
          (activeModule.data?.content || activeModule.data?.textContent)
            ? "Text"
            : null,
        ]
          .filter(Boolean)
          .join(", ") || "None";

      console.log(
        `🔄 ACTIVE: ${activeModule.title} | ${category} | Resources: ${resources}`,
      );
    }

    if (activeModule?.data?.category === "CODE" && activeModule?.data?.is_cf) {
      getCFHandle();
    }
    activeModuleRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  }, [activeModule]);

  // Initialize quiz timer when quiz module loads
  useEffect(() => {
    if (activeModule?.data?.category === "QUIZ" && activeModule?.data?.quiz) {
      const totalQuestions = activeModule?.data?.quiz?.length;
      initializeQuizTimer(activeModule.id, totalQuestions);
    } else {
      // Clear timer if not a quiz module
      clearQuizTimer();
    }

    // Cleanup on unmount
    return () => {
      clearQuizTimer();
    };
  }, [activeModule?.id, activeModule?.data?.category]);

  // Timer countdown logic
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          const newTime = prev - 1;

          if (newTime <= 0) {
            clearQuizTimer();
            handleTimerExpiry(activeModule.id);
            return 0;
          }

          return newTime;
        });
      }, 1000);
    }

    // Always clear any running interval when this effect re-runs or the
    // component unmounts, regardless of which branch above executed. This
    // guarantees the countdown can never leak across module changes.
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timerActive, activeModule?.id]);

  if (pageError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg px-4">
        <Toaster />
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
          <button
            onClick={() => fetchCourse()}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Toaster />
      {/* Show skeleton loader while page is loading */}
      {pageLoading ? (
        <ModulePageSkeleton />
      ) : (
        <>
          <button
            style={{ zIndex: 999 }}
            onClick={() => {
              setUser({ ...user, openCompiler: true });
            }}
            className="fixed top-80 -left-2 bg-[#0B060D] bg-opacity-30  backdrop-blur-lg border border-gray-200/20 p-3 hover:bg-gray-300/20 "
          >
            <svg
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                  d="M15.5 9L15.6716 9.17157C17.0049 10.5049 17.6716 11.1716 17.6716 12C17.6716 12.8284 17.0049 13.4951 15.6716 14.8284L15.5 15"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M13.2942 7.17041L12.0001 12L10.706 16.8297"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M8.49994 9L8.32837 9.17157C6.99504 10.5049 6.32837 11.1716 6.32837 12C6.32837 12.8284 6.99504 13.4951 8.32837 14.8284L8.49994 15"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
                <path
                  d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>{" "}
              </g>
            </svg>
          </button>
      <Transition appear show={openDiscussions} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setOpenDiscussions(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className=" w-[90vw] md:w-[80vw] transform overflow-hidden rounded-2xl bg-[#0B060D]/60 dark:bg-[#0B060D]/30  backdrop-blur-lg border border-gray-200/20 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 "
                  >
                    <div className="flex justify-end mb-4">
                      <svg
                        onClick={() => {
                          setOpenDiscussions(false);
                        }}
                        className="cursor-pointer"
                        width="30"
                        viewBox="0 0 32 32"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#000000"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          {" "}
                          <title>cross-circle</title>{" "}
                          <desc>Created with Sketch Beta.</desc> <defs> </defs>{" "}
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                          >
                            {" "}
                            <g
                              id="Icon-Set"
                              transform="translate(-568.000000, -1087.000000)"
                              fill="#ffffff"
                            >
                              {" "}
                              <path
                                d="M584,1117 C576.268,1117 570,1110.73 570,1103 C570,1095.27 576.268,1089 584,1089 C591.732,1089 598,1095.27 598,1103 C598,1110.73 591.732,1117 584,1117 L584,1117 Z M584,1087 C575.163,1087 568,1094.16 568,1103 C568,1111.84 575.163,1119 584,1119 C592.837,1119 600,1111.84 600,1103 C600,1094.16 592.837,1087 584,1087 L584,1087 Z M589.717,1097.28 C589.323,1096.89 588.686,1096.89 588.292,1097.28 L583.994,1101.58 L579.758,1097.34 C579.367,1096.95 578.733,1096.95 578.344,1097.34 C577.953,1097.73 577.953,1098.37 578.344,1098.76 L582.58,1102.99 L578.314,1107.26 C577.921,1107.65 577.921,1108.29 578.314,1108.69 C578.708,1109.08 579.346,1109.08 579.74,1108.69 L584.006,1104.42 L588.242,1108.66 C588.633,1109.05 589.267,1109.05 589.657,1108.66 C590.048,1108.27 590.048,1107.63 589.657,1107.24 L585.42,1103.01 L589.717,1098.71 C590.11,1098.31 590.11,1097.68 589.717,1097.28 L589.717,1097.28 Z"
                                id="cross-circle"
                              >
                                {" "}
                              </path>{" "}
                            </g>{" "}
                          </g>{" "}
                        </g>
                      </svg>
                    </div>
                    <textarea
                      className="w-full px-3 py-3 rounded mb-2 resize-none bg-gray-200/20 outline-none focus:ring ring-gray-300/80 text-white"
                      placeholder="Write a question or an answer"
                      value={newDiscussion}
                      onChange={(e) => {
                        setNewDiscussion(e.target.value);
                      }}
                    />
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={submitNewDiscussion}
                        className="py-2 px-8 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80  rounded font-semibold text-white text-lg "
                      >
                        Submit
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="mt-2 max-h-[50vh]  overflow-y-scroll">
                    {discussions?.map((elem: any) => (
                      <div className="my-4" key={elem.id}>
                        <p className="text-white text-2xl">{elem.name}</p>
                        <p className="text-white ">{elem.content}</p>
                      </div>
                    ))}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={openDiscussionDeleteDialogue} as={Fragment}>
        <Dialog
          as="div"
          className="relative "
          style={{ zIndex: 99999 }}
          onClose={() => {
            // setCoursePurchaseSuccessfull(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="md:w-[50vw] lg:w-[40vw] text-darkHeading transform overflow-hidden  rounded-2xl bg-gray-900/70 backdrop-blur-3xl border border-gray-300/30  text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 p-2 "
                  >
                    <div className="flex justify-end">
                      <button
                        className="hover:bg-gray-300/20 p-2 mr-2 rounded"
                        onClick={() => {
                          setOpenDicussionDeleteDialogue(false);
                        }}
                      >
                        <svg
                          width="14"
                          height="15"
                          viewBox="0 0 14 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13 1.25L1 13.25M1 1.25L13 13.25"
                            stroke="#FBEEEC"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </Dialog.Title>

                  <div className="border-b border-t border-gray-300/20 py-3 px-6">
                    <div className="flex flex-col items-center ">
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        className="text-4xl text-orange-300"
                      />
                      <p className="text-xl font-bold text-darkHeading mt-1">
                        Warning!
                      </p>
                      <p className="text-darkHeading text-center mt-1 ">
                        Do you want to delete your comment?
                      </p>
                    </div>
                  </div>
                  <div className="p-6 flex gap-4">
                    <button
                      onClick={() => {
                        setOpenDicussionDeleteDialogue(false);
                      }}
                      className={`bg-gray-300/30 hover:opacity-60 ease-in-out duration-150  text-darkHeading py-3 w-full  rounded-xl font-bold`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        deleteDiscussion();
                        setOpenDicussionDeleteDialogue(false);
                      }}
                      className={`bg-red-600 hover:bg-opacity-50 ease-in-out duration-150  text-darkHeading py-3 w-full  rounded-xl font-bold`}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="py-16 bg-white dark:bg-[#0B060D] overflow-x-hidden">
        <div className="w-[90%] lgXl:w-[80%] mx-auto py-12 z-20">
          <div className="flex flex-col lg:flex-row gap-24 justify-between relative">
            <svg
              viewBox="0 0 980 892"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute hidden -top-[70px] -left-[200px] h-full z-0"
            >
              <g filter="url(#filter0_f_261_7530)">
                <ellipse
                  cx="314.306"
                  cy="293.812"
                  rx="167.107"
                  ry="94.0796"
                  transform="rotate(-10.6934 314.306 293.812)"
                  fill="#B153E0"
                />
              </g>
              <defs>
                <filter
                  id="filter0_f_261_7530"
                  x="-350.838"
                  y="-303.722"
                  width="1330.29"
                  height="1195.07"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="BackgroundImageFix"
                    result="shape"
                  />
                  <feGaussianBlur
                    stdDeviation="250"
                    result="effect1_foregroundBlur_261_7530"
                  />
                </filter>
              </defs>
            </svg>
            <div
              style={{ flex: 2 }}
              className="text-heading dark:text-darkHeading z-10"
            >
              <h2 className="text-2xl lg:text-4xl font-semibold">
                {courseData.title}
              </h2>
              {!(courseData?.isTaken || false) && (
                <div className="flex gap-8 items-center pb-6 border-b border-gray-400/50 dark:border-gray-300/10 relative ">
                  {/* <div className="flex gap-3 mt-6 items-center bg-[#FFF1E9]/20 px-3 py-2 rounded-xl">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.99855 17.6269C4.23361 17.6269 0.371094 13.7645 0.371094 8.99951C0.371094 4.23457 4.23361 0.37207 8.99855 0.37207C13.7635 0.37207 17.6259 4.23457 17.6259 8.99951C17.6259 13.7645 13.7635 17.6269 8.99855 17.6269ZM8.99855 15.9015C10.8291 15.9015 12.5846 15.1743 13.879 13.8799C15.1733 12.5856 15.9005 10.83 15.9005 8.99951C15.9005 7.16901 15.1733 5.41346 13.879 4.1191C12.5846 2.82472 10.8291 2.09756 8.99855 2.09756C7.16803 2.09756 5.4125 2.82472 4.11812 4.1191C2.82376 5.41346 2.09659 7.16901 2.09659 8.99951C2.09659 10.83 2.82376 12.5856 4.11812 13.8799C5.4125 15.1743 7.16803 15.9015 8.99855 15.9015ZM9.8613 8.99951H13.3123V10.725H8.1358V4.68579H9.8613V8.99951Z"
                        fill="#F1BA41"
                      />
                    </svg>
                    {englishToBanglaNumbers(
                      calculateRemainingDays(courseData?.chips?.deadline),
                    )}{" "}
                    দিন বাকি
                  </div> */}
                  {/* <div className="flex gap-3 mt-6 items-center bg-[#A144FF]/10 px-3 py-2 rounded-xl">
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.0943 12.9745V14.807C12.3007 14.5264 11.4514 14.4403 10.6177 14.5561C9.78391 14.6717 8.99011 14.9858 8.30288 15.4719C7.61567 15.9579 7.05511 16.6017 6.66827 17.3492C6.28144 18.0968 6.07963 18.9263 6.07979 19.768L4.32617 19.7671C4.32589 18.6965 4.57073 17.6399 5.04191 16.6785C5.51309 15.717 6.1981 14.8762 7.04447 14.2204C7.89084 13.5647 8.8761 13.1114 9.92476 12.8953C10.9734 12.6791 12.0576 12.7068 13.0943 12.9745ZM11.3407 11.8767C8.43403 11.8767 6.07979 9.52248 6.07979 6.61585C6.07979 3.70922 8.43403 1.35498 11.3407 1.35498C14.2473 1.35498 16.6016 3.70922 16.6016 6.61585C16.6016 9.52248 14.2473 11.8767 11.3407 11.8767ZM11.3407 10.1231C13.2784 10.1231 14.8479 8.5536 14.8479 6.61585C14.8479 4.67809 13.2784 3.1086 11.3407 3.1086C9.40291 3.1086 7.83341 4.67809 7.83341 6.61585C7.83341 8.5536 9.40291 10.1231 11.3407 10.1231ZM16.42 17.939L19.5195 14.8395L20.7602 16.0792L16.42 20.4195L13.3196 17.3191L14.5604 16.0792L16.42 17.939Z"
                        fill="#A144FF"
                      />
                    </svg>
                    {englishToBanglaNumbers(
                      parseInt(courseData?.chips?.total_seats) -
                        courseData?.enrolled,
                    )}{" "}
                    টি সিট বাকি
                  </div> */}
                </div>
              )}
              {(courseData?.isTaken || false) && (
                <div className="pb-6 border-b border-gray-400/50 dark:border-gray-300/10 "></div>
              )}

              <ModulePlayer
                activeModule={activeModule}
                courseData={courseData}
                assignmentEvaluted={assignmentEvaluted}
                assignmentSubmission={assignmentSubmission}
                setAssignmentSubmission={setAssignmentSubmission}
                submitAssignment={submitAssignment}
                cfHandle={cfHandle}
                setCfHandle={setCfHandle}
                checkCFStatus={checkCFStatus}
                quizAnswer={quizAnswer}
                setQuizAnswer={setQuizAnswer}
                quizVerdict={quizVerdict}
                showQuizAnswer={showQuizAnswer}
                justSubmitted={justSubmitted}
                timeRemaining={timeRemaining}
                timerActive={timerActive}
                timerExpired={timerExpired}
                formatTime={formatTime}
                getTimerColor={getTimerColor}
                submitQuiz={submitQuiz}
                retakeQuiz={retakeQuiz}
                user={user}
              />
              {activeModule?.description?.length > 0 &&
                activeModule?.data?.category !== "TEXT" && (
                  <div className="mt-12">
                    <p className="font-semibold text-2xl pb-4 border-b border-gray-300/10">
                      Description
                    </p>
                    <SafeHtmlRenderer
                      content={activeModule?.description}
                      className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-lg text-paragraph dark:text-darkParagraph border-t border-gray-400/50 pt-2 dark:border-gray-300/10"
                    />
                  </div>
                )}
              <ModuleNavButtons
                courseData={courseData}
                activeModule={activeModule}
                courseId={courseId as string}
                findObjectBySerial={findObjectBySerial}
                goToModule={goToModule}
                setActiveModule={setActiveModule}
                shouldShowUnlockChapterButton={shouldShowUnlockChapterButton}
                unlockCurrentChapter={unlockCurrentChapter}
              />

              {/* Module Feedback Section */}
              {activeModule?.id && (courseData?.isTaken || activeModule?.is_free) && (
                <div className="mt-8">
                  <ModuleFeedback
                    moduleId={activeModule.id}
                    moduleTitle={activeModule.title}
                  />
                </div>
              )}

              <div className="mt-10">
                <DiscussionSection
                  discussions={discussions}
                  discussionLoading={discussionLoading}
                  newDiscussion={newDiscussion}
                  setNewDiscussion={setNewDiscussion}
                  submitNewDiscussion={submitNewDiscussion}
                  activeThreads={activeThreads}
                  setActiveThreads={setActiveThreads}
                  subdiscussionTexts={subdiscussionTexts}
                  setSubdiscussionTexts={setSubdiscussionTexts}
                  subdiscussionComments={subdiscussionComments}
                  fetchSubdiscussions={fetchSubdiscussions}
                  postSubdiscussion={postSubdiscussion}
                  setDeleteOption={setDeleteOption}
                  setOpenDicussionDeleteDialogue={
                    setOpenDicussionDeleteDialogue
                  }
                  setActiveCommentDeletionData={setActiveCommentDeletionData}
                />
              </div>
            </div>
            <div style={{ flex: 1 }} className="z-10 relative">
              <CourseSidebar
                courseData={courseData}
                activeModuleId={activeModule?.id}
                activeModuleRef={activeModuleRef}
                onSelectModule={goToModule}
                isActiveChapter={isActiveChapter}
              />
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
