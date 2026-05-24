import React from "react";
import { FilterCategory } from "../_lib/types";

interface StickyFiltersProps {
  categories: FilterCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export default function StickyFilters({
  categories,
  selectedCategory,
  onCategoryChange,
}: StickyFiltersProps) {
  return (
    <div className="sticky top-20 z-30 py-4 -mx-4 px-4 bg-background/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-border/20">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
              selectedCategory === category.id
                ? "bg-purple text-white shadow-lg shadow-purple/25"
                : "bg-muted/50 text-paragraph dark:text-darkParagraph hover:bg-muted"
            }`}
          >
            {category.label}
            {category.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-200/80 dark:bg-muted/50 text-paragraph dark:text-darkParagraph"
                }`}
              >
                {category.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}


