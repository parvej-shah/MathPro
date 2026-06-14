"use client";

import { memo } from "react";
import { countAssignmentsAndVideos } from "@/helpers";
import ModuleListItem from "./ModuleListItem";
import type { Chapter, CourseModule } from "./types";

interface ChapterAccordionProps {
  chapter: Chapter;
  /** 1-based display index of the chapter. */
  index: number;
  /** Course has been purchased (unlocks paid chapters). */
  isTaken: boolean;
  /** id of the currently active module. */
  activeModuleId: number | undefined;
  /** Whether this chapter contains the active module (drives default-open). */
  isActive: boolean;
  /** ref setter for the active module row (sidebar auto-scroll). */
  activeModuleRef: React.Ref<HTMLButtonElement>;
  onSelectModule: (module: CourseModule) => void;
}

/** Small count chip used in the chapter metadata row. */
function CountChip({
  count,
  label,
  accessible,
}: {
  count: number;
  label: string;
  accessible: boolean;
}) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <svg
        width="12"
        height="12"
        viewBox="0 0 13 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
          fill={accessible ? "oklch(0.718 0.147 159.2)" : "oklch(0.46 0.025 238)"}
        />
      </svg>
      <p className={`whitespace-nowrap ${!accessible && "text-muted-foreground"}`}>
        {count} {label}
      </p>
    </div>
  );
}

/**
 * One collapsible chapter in the course sidebar: number badge, title, content
 * counts, free/lock indicator, and the list of its modules. Memoized — only
 * re-renders when its own props change (e.g. the active module moves in/out).
 */
const ChapterAccordion = memo(function ChapterAccordion({
  chapter,
  index,
  isTaken,
  activeModuleId,
  isActive,
  activeModuleRef,
  onSelectModule,
}: ChapterAccordionProps) {
  const accessible = chapter.is_free || isTaken || false;
  const isFree = !!chapter.is_free;
  const counts = countAssignmentsAndVideos(chapter.modules);

  return (
    <details
      open={isActive}
      className="bg-card/40 border border-border/60 hover:border-border mb-3 rounded-xl transition-colors group open:bg-card/60"
    >
      <summary className="list-none cursor-pointer px-3.5 py-3.5 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start gap-3">
          {/* Chapter number badge — fixed square so it stays a perfect circle */}
          <span
            className={`grid place-items-center size-9 shrink-0 rounded-full font-semibold text-sm ${
              accessible
                ? "bg-teal/20 text-teal ring-1 ring-teal/30"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {index}
          </span>

          {/* Title + meta */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <p
                className={`text-base font-semibold leading-snug ${
                  !accessible && "text-muted-foreground"
                }`}
              >
                {chapter.title}
              </p>
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                {chapter.is_free && (
                  <span className="px-2 py-0.5 text-accent bg-accent/15 rounded-full text-xs font-semibold whitespace-nowrap">
                    ফ্রি দেখুন
                  </span>
                )}
                {!chapter.is_free && !isTaken && (
                  <svg
                    width="14"
                    height="16"
                    viewBox="0 0 18 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Locked chapter"
                    className="text-muted-foreground"
                  >
                    <path
                      d="M9 13.5V15.5M3 19.5H15C16.1046 19.5 17 18.6046 17 17.5V11.5C17 10.3954 16.1046 9.5 15 9.5H3C1.89543 9.5 1 10.3954 1 11.5V17.5C1 18.6046 1.89543 19.5 3 19.5ZM13 9.5V5.5C13 3.29086 11.2091 1.5 9 1.5C6.79086 1.5 5 3.29086 5 5.5V9.5H13Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 transition-transform duration-200 group-open:rotate-180 text-muted-foreground"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs font-medium text-muted-foreground">
              <CountChip
                count={counts.videoCount}
                label="টি ভিডিও"
                accessible={isFree}
              />
              <CountChip
                count={counts.quizCount}
                label="টি কুইজ"
                accessible={isFree}
              />
              <CountChip
                count={counts.pdfCount}
                label="টি পিডিএফ"
                accessible={isFree}
              />
            </div>
          </div>
        </div>
      </summary>
      <div className="border-t border-border/50 mt-1 pl-3.5 pr-3 pt-3 pb-1.5">
        {chapter.modules.map((module: CourseModule) => {
          const active = module.id === activeModuleId;
          return (
            <ModuleListItem
              key={module.id}
              ref={active ? activeModuleRef : undefined}
              module={module}
              accessible={accessible}
              active={active}
              onSelect={onSelectModule}
            />
          );
        })}
      </div>
    </details>
  );
});

export default ChapterAccordion;
