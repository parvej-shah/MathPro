"use client";

import ChapterAccordion from "./ChapterAccordion";
import type { Chapter, Course, CourseModule } from "./types";

interface CourseSidebarProps {
  courseData: Course | null | undefined;
  activeModuleId: number | undefined;
  /** ref for the active module row, used for auto-scroll-into-view. */
  activeModuleRef: React.Ref<HTMLButtonElement>;
  onSelectModule: (module: CourseModule) => void;
  /** True if the given chapter contains the active module. */
  isActiveChapter: (chapter: Chapter) => boolean;
}

/**
 * The course outline: a scrollable list of live chapters, each an accordion of
 * its modules. Presentational only — all navigation is delegated through
 * onSelectModule so the page owns the access/progress side effects.
 */
export default function CourseSidebar({
  courseData,
  activeModuleId,
  activeModuleRef,
  onSelectModule,
  isActiveChapter,
}: CourseSidebarProps) {
  const isTaken = courseData?.isTaken || false;
  const liveChapters = (courseData?.chapters ?? []).filter(
    (ch: Chapter) => ch.is_live,
  );

  return (
    <div className="text-heading dark:text-darkHeading">
      <div
        className="scrollbar-thumb-rounded-full scrollbar-track-rounded-full h-screen overflow-y-scroll py-6 px-4 border rounded-lg border-gray-300/20 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-rounded-[12px] scrollbar-track-gray-600"
        role="navigation"
        aria-label="Course content"
      >
        {liveChapters.map((chapter: Chapter, index: number) => (
          <ChapterAccordion
            key={chapter.id}
            chapter={chapter}
            index={index + 1}
            isTaken={isTaken}
            activeModuleId={activeModuleId}
            isActive={isActiveChapter(chapter)}
            activeModuleRef={activeModuleRef}
            onSelectModule={onSelectModule}
          />
        ))}
      </div>
    </div>
  );
}
