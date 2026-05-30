"use client";

import { forwardRef, memo } from "react";
import type { CourseModule, ModuleCategory } from "./types";

interface ModuleListItemProps {
  module: CourseModule;
  /** Whether the module is reachable (chapter free or course taken). */
  accessible: boolean;
  /** Whether this row is the currently active module. */
  active: boolean;
  onSelect: (module: CourseModule) => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  VIDEO: "Video:",
  ASSIGNMENT: "Assignment:",
  CODE: "Code:",
  QUIZ: "Quiz:",
  PDF: "Pdf:",
};

/** Icon color: brand purple when accessible, grey when locked. */
function iconFill(accessible: boolean) {
  return accessible ? "#B153E0" : "#565656";
}

function CategoryIcon({
  category,
  accessible,
}: {
  category: ModuleCategory | string | undefined;
  accessible: boolean;
}) {
  const fill = iconFill(accessible);
  const base = {
    width: 20,
    height: 21,
    viewBox: "0 0 20 21",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  } as const;

  switch (category) {
    case "VIDEO":
      return (
        <svg {...base}>
          <path
            d="M10 20.5C15.523 20.5 20 16.023 20 10.5C20 4.977 15.523 0.5 10 0.5C4.477 0.5 0 4.977 0 10.5C0 16.023 4.477 20.5 10 20.5Z"
            fill={fill}
          />
          <path
            d="M14.2164 11.3862C14.7194 10.9382 14.7194 10.0622 14.2164 9.61419C12.7337 8.28108 11.0347 7.21042 9.19235 6.44819L8.86235 6.31319C8.22935 6.05319 7.56235 6.54719 7.47635 7.30019C7.23705 9.42681 7.23705 11.5736 7.47635 13.7002C7.56135 14.4532 8.22935 14.9462 8.86235 14.6872L9.19235 14.5522C11.0347 13.7899 12.7337 12.7193 14.2164 11.3862Z"
            fill="white"
          />
        </svg>
      );
    case "ASSIGNMENT":
      return (
        <svg {...base}>
          <path
            d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
            fill={fill}
          />
          <path
            d="M13.7836 6.69037L8.99914 13.0833L7.1543 11.2384C6.93311 11.0172 6.57458 11.0172 6.35339 11.2384C6.1322 11.4596 6.1322 11.8181 6.35339 12.0393L8.6668 14.3527C8.77295 14.4589 8.91698 14.5185 9.06714 14.5185C9.0745 14.5185 9.08191 14.5184 9.08928 14.5181C9.24752 14.5119 9.39523 14.4402 9.49709 14.3199L14.6735 7.41391C14.8753 7.18113 14.853 6.82896 14.6232 6.62327C14.3934 6.41757 14.0407 6.43488 13.8341 6.66471L13.7836 6.69037Z"
            fill="white"
          />
        </svg>
      );
    case "CODE":
      return (
        <svg {...base}>
          <path
            d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
            fill={fill}
          />
          <path
            d="M7.5 13L4.5 10.5L7.5 8M12.5 8L15.5 10.5L12.5 13M11 6.5L9 14.5"
            stroke="white"
            strokeWidth="1.2"
          />
        </svg>
      );
    case "QUIZ":
      return (
        <svg {...base}>
          <path
            d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
            fill={fill}
          />
          <path
            d="M9.5 7.5C9.5 7.22386 9.72386 7 10 7C10.2761 7 10.5 7.22386 10.5 7.5V11.5C10.5 11.7761 10.2761 12 10 12C9.72386 12 9.5 11.7761 9.5 11.5V7.5Z"
            fill="white"
          />
          <path
            d="M10 13.5C9.72386 13.5 9.5 13.7239 9.5 14C9.5 14.2761 9.72386 14.5 10 14.5C10.2761 14.5 10.5 14.2761 10.5 14C10.5 13.7239 10.2761 13.5 10 13.5Z"
            fill="white"
          />
        </svg>
      );
    case "PDF":
      return (
        <svg {...base}>
          <path
            d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
            fill={fill}
          />
          <path
            d="M7 8.5H13M7 11.5H13M7 14.5H10"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * A single module row in the course sidebar. Semantic <button> so it is
 * keyboard-focusable and announces selection state (aria-current). Memoized so
 * unrelated state changes in the page (quiz answers, discussions) don't re-render
 * the whole module list.
 */
const ModuleListItem = memo(
  forwardRef<HTMLButtonElement, ModuleListItemProps>(function ModuleListItem(
    { module, accessible, active, onSelect },
    ref,
  ) {
    const category = module.data?.category;
    const label = (category && CATEGORY_LABEL[category]) ?? "";

    return (
      <button
        ref={ref}
        type="button"
        aria-current={active ? "true" : undefined}
        disabled={!accessible}
        onClick={() => {
          if (accessible) onSelect(module);
        }}
        className="flex w-full gap-4 items-center mb-4 text-left disabled:cursor-not-allowed"
      >
        <CategoryIcon category={category} accessible={accessible} />
        <p
          className={`text-lg ${
            active
              ? "text-[#B153E0] font-semibold"
              : !accessible
                ? "text-[#565656]"
                : ""
          }`}
        >
          {label} {module.title}
        </p>
      </button>
    );
  }),
);

export default ModuleListItem;
