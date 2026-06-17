"use client";

import { useMemo, useState } from "react";
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
  /** Extra classes forwarded to the scroll container (e.g. for Sheet vs column contexts). */
  className?: string;
  /** Optional close button rendered inside the header (for mobile Sheet). */
  onClose?: () => void;
}

/**
 * The course outline: a compact header (progress + search) above a scrollable
 * list of live chapters, each an accordion of its modules. Presentational only —
 * all navigation is delegated through onSelectModule so the page owns the
 * access/progress side effects.
 */
export default function CourseSidebar({
  courseData,
  activeModuleId,
  activeModuleRef,
  onSelectModule,
  isActiveChapter,
  className = "",
  onClose,
}: CourseSidebarProps) {
  const isTaken = courseData?.isTaken || false;
  const [query, setQuery] = useState("");

  const liveChapters = useMemo(
    () => (courseData?.chapters ?? []).filter((ch: Chapter) => ch.is_live),
    [courseData],
  );

  // Filter chapters by module/chapter title against the search query.
  const filteredChapters = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return liveChapters;
    return liveChapters
      .map((ch) => {
        const chapterMatches = ch.title?.toLowerCase().includes(q);
        if (chapterMatches) return ch;
        const modules = ch.modules.filter((m) => {
          const cat = (m.data?.category as string) ?? "";
          const searchText = `${cat} ${m.title ?? ""}`.toLowerCase();
          return searchText.includes(q);
        });
        return modules.length ? { ...ch, modules } : null;
      })
      .filter((ch): ch is Chapter => ch !== null);
  }, [liveChapters, query]);

  return (
    <div
      className={`flex flex-col overflow-hidden border border-border/60 rounded-2xl bg-card/30 ${className}`}
    >
      {/* Search header */}
      <div className="shrink-0 px-3 pt-3.5 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Lesson"
            aria-label="Search lessons"
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg bg-muted/40 border border-border/40 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:bg-muted/60 transition-colors"
          />
          </div>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close sidebar"
              className="grid place-items-center w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable chapter list */}
      <div
        className="flex-1 min-h-0 overflow-y-auto py-3 px-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40"
        role="navigation"
        aria-label="Course content"
      >
        {filteredChapters.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No lessons found.
          </p>
        ) : (
          filteredChapters.map((chapter: Chapter) => {
            // Keep the original chapter number even when filtering.
            const displayIndex =
              liveChapters.findIndex((c) => c.id === chapter.id) + 1;
            return (
              <ChapterAccordion
                key={`${chapter.id}-${query.trim() ? "search" : "default"}`}
                chapter={chapter}
                index={displayIndex}
                isTaken={isTaken}
                activeModuleId={activeModuleId}
                isActive={
                  query.trim()
                    ? true
                    : isActiveChapter(chapter)
                }
                activeModuleRef={activeModuleRef}
                onSelectModule={onSelectModule}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
