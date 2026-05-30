"use client";

import { saveLastAccessedModule } from "@/utils/moduleAccessUtils";
import type { CourseModule, Course } from "./types";

interface ModuleNavButtonsProps {
  courseData: Course;
  activeModule: CourseModule;
  courseId: string;
  findObjectBySerial: (data: Course, serial: number) => CourseModule | undefined;
  goToModule: (module: CourseModule) => void;
  setActiveModule: (module: CourseModule) => void;
  shouldShowUnlockChapterButton: () => boolean;
  unlockCurrentChapter: () => void;
}

export default function ModuleNavButtons({
  courseData,
  activeModule,
  courseId,
  findObjectBySerial,
  goToModule,
  setActiveModule,
  shouldShowUnlockChapterButton,
  unlockCurrentChapter,
}: ModuleNavButtonsProps) {
  const isTaken = courseData?.isTaken || false;

  const handlePrev = () => {
    const prevModule = findObjectBySerial(courseData, (activeModule?.serial ?? 0) - 1);
    if (prevModule) {
      setActiveModule(prevModule);
      saveLastAccessedModule(courseId, prevModule.id, prevModule.chapter_id).catch(() => {});
      if (typeof window !== "undefined") {
        window.history.replaceState(
          null,
          "",
          `/course/${courseId}/${prevModule.chapter_id}/${prevModule.id}`,
        );
      }
    }
  };

  const handleNext = () => {
    const nextModule = findObjectBySerial(courseData, (activeModule?.serial ?? 0) + 1);
    if (nextModule && (nextModule.is_free || isTaken)) {
      const cat = nextModule.data?.category;
      const gated = cat === "ASSIGNMENT" || cat === "CODE" || cat === "QUIZ";
      if (!gated || isTaken) {
        goToModule(nextModule);
      }
    }
  };

  return (
    <div className="mt-1">
      {shouldShowUnlockChapterButton() && (
        <button
          onClick={unlockCurrentChapter}
          className="py-2 mt-5 px-6 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80 rounded font-semibold text-white text-lg"
        >
          Unlock Chapter
        </button>
      )}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          className="py-2 mt-5 px-6 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80 rounded font-semibold text-white text-lg"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="py-2 mt-5 px-6 bg-[#532e62] hover:opacity-75 ease-in-out duration-150 focus:ring ring-gray-300/80 rounded font-semibold text-white text-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
