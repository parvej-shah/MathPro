"use client";

import { toast } from "react-hot-toast";
import { saveLastAccessedModule } from "@/utils/moduleAccessUtils";
import type { CourseModule, Course } from "./types";

interface ModuleNavButtonsProps {
  courseData: Course;
  activeModule: CourseModule;
  courseId: string;
  findAdjacentModule: (data: Course, current: CourseModule, direction: 1 | -1) => CourseModule | undefined;
  goToModule: (module: CourseModule) => void;
  setActiveModule: (module: CourseModule) => void;
  shouldShowUnlockChapterButton: () => boolean;
  unlockCurrentChapter: () => void;
}

export default function ModuleNavButtons({
  courseData,
  activeModule,
  courseId,
  findAdjacentModule,
  goToModule,
  setActiveModule,
  shouldShowUnlockChapterButton,
  unlockCurrentChapter,
}: ModuleNavButtonsProps) {
  const isTaken = courseData?.isTaken || false;

  // Same silent no-op bug as handleNext had: no module, or a locked module,
  // produced a dead-looking button with no explanation.
  const handlePrev = () => {
    const prevModule = findAdjacentModule(courseData, activeModule, -1);
    if (!prevModule) {
      toast("এটিই প্রথম অধ্যায়/পাঠ।");
      return;
    }
    if (!prevModule.is_free && !isTaken) {
      toast.error("এই কোর্সটি কেনার পর এই অংশ দেখা যাবে।");
      return;
    }
    const cat = prevModule.data?.category;
    const gated = cat === "QUIZ";
    if (gated && !isTaken) {
      toast.error("কোর্সটি কেনার পর পরীক্ষা দেওয়া যাবে।");
      return;
    }
    setActiveModule(prevModule);
    saveLastAccessedModule(courseId, prevModule.id, prevModule.chapter_id).catch(() => {});
    if (typeof window !== "undefined") {
      window.history.replaceState(
        null,
        "",
        `/course/${courseId}/${prevModule.chapter_id}/${prevModule.id}`,
      );
    }
  };

  // Previously silent no-op when the next module was locked — the button
  // looked broken with no explanation. Every blocked path now tells the
  // student why nothing happened.
  const handleNext = () => {
    const nextModule = findAdjacentModule(courseData, activeModule, 1);
    if (!nextModule) {
      toast("এটিই শেষ অধ্যায়/পাঠ।");
      return;
    }
    if (!nextModule.is_free && !isTaken) {
      toast.error("এই কোর্সটি কেনার পর এই অংশ দেখা যাবে।");
      return;
    }
    const cat = nextModule.data?.category;
    const gated = cat === "QUIZ";
    if (gated && !isTaken) {
      toast.error("কোর্সটি কেনার পর পরীক্ষা দেওয়া যাবে।");
      return;
    }
    goToModule(nextModule);
  };

  return (
    <div className="mt-1">
      {shouldShowUnlockChapterButton() && (
        <button
          onClick={unlockCurrentChapter}
          className="py-2 mt-5 px-6 bg-accent hover:bg-accent/85 ease-in-out duration-150 focus:ring ring-accent/30 rounded-lg font-semibold text-accent-foreground text-lg"
        >
          Unlock Chapter
        </button>
      )}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          className="py-2 mt-5 px-6 bg-primary hover:bg-primary/85 ease-in-out duration-150 focus:ring ring-primary/30 rounded-lg font-semibold text-primary-foreground text-lg"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="py-2 mt-5 px-6 bg-primary hover:bg-primary/85 ease-in-out duration-150 focus:ring ring-primary/30 rounded-lg font-semibold text-primary-foreground text-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
