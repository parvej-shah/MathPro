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
  QUIZ: "Quiz:",
  PDF: "Pdf:",
};

/** Icon color: brand emerald when accessible, grey when locked. */
function iconFill(accessible: boolean) {
  return accessible ? "oklch(0.718 0.147 159.2)" : "oklch(0.46 0.025 238)";
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
    case "TEXT":
      return (
        <svg {...base}>
          <path
            d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
            fill={fill}
          />
          <path
            d="M10 6.5V8M10 8H7.5V14.5H12.5V8H10Z"
            stroke="white"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M9 10.5H11M9 12.5H11"
            stroke="white"
            strokeWidth="1"
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
        className={`group flex w-full gap-3 items-center px-2.5 py-2 mb-0.5 rounded-lg text-left transition-colors disabled:cursor-not-allowed ${
          active
            ? "bg-primary/10"
            : accessible
              ? "hover:bg-muted/60"
              : ""
        }`}
      >
        <span className="shrink-0 grid place-items-center">
          <CategoryIcon category={category} accessible={accessible} />
        </span>
        <p
          className={`text-sm leading-snug ${
            active
              ? "text-primary font-semibold"
              : !accessible
                ? "text-muted-foreground"
                : "text-foreground/90"
          }`}
        >
          {label} {module.title}
        </p>
      </button>
    );
  }),
);

export default ModuleListItem;
