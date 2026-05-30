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
    <div className="flex items-center gap-3">
      <svg
        width="13"
        height="12"
        viewBox="0 0 13 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
          fill={accessible ? "#B153E0" : "#565656"}
        />
      </svg>
      <p className={` ${!accessible && "text-[#565656]"}`}>
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
    <div className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mb-6">
      <input
        type="radio"
        name="my-accordion-3"
        defaultChecked={isActive}
        aria-label={`Chapter ${index}: ${chapter.title}`}
      />
      <div className="collapse-title font-medium">
        <div className="flex justify-between">
          <div
            className="flex gap-4 flex-col lg:flex-row justify-start"
            style={{ flex: 3 }}
          >
            <div>
              <div
                className={`px-2 py-2 rounded-full inline-block ${
                  accessible ? "bg-[#B153E0]/14" : "bg-[#FFFFFF]/14"
                }`}
              >
                <p
                  className={`px-4 py-1 rounded-full font-bold text-xl inline-block ${
                    accessible ? "bg-[#B153E0]/32" : "bg-[#FFFFFF]/32"
                  }`}
                >
                  {index}
                </p>
              </div>
            </div>
            <div>
              <p className={`text-2xl ${!accessible && "text-[#565656]"}`}>
                {chapter.title}
              </p>
              <div className="flex flex-wrap gap-3 lg:items-center mt-3 text-sm font-medium">
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
                  count={counts.codeCount}
                  label="টি কোডিং চ্যালেঞ্জ"
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
          <div>
            {chapter.is_free && (
              <p
                className="px-4 py-1 text-[#1CAB55] bg-[#1CAB55]/10 rounded-full text-sm"
                style={{ flex: 1 }}
              >
                ফ্রি দেখুন
              </p>
            )}
            {!chapter.is_free && !isTaken && (
              <svg
                width="18"
                height="21"
                viewBox="0 0 18 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Locked chapter"
              >
                <path
                  d="M9 13.5V15.5M3 19.5H15C16.1046 19.5 17 18.6046 17 17.5V11.5C17 10.3954 16.1046 9.5 15 9.5H3C1.89543 9.5 1 10.3954 1 11.5V17.5C1 18.6046 1.89543 19.5 3 19.5ZM13 9.5V5.5C13 3.29086 11.2091 1.5 9 1.5C6.79086 1.5 5 3.29086 5 5.5V9.5H13Z"
                  stroke="#2E2E2E"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div className="collapse-content border-t border-gray-400/50 dark:border-gray-300/10">
        <div className="pt-6"></div>
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
    </div>
  );
});

export default ChapterAccordion;
