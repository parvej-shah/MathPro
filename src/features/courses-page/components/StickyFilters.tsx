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
    <div className="sticky top-20 z-30 py-3 mb-6 bg-section-a backdrop-blur-xl border-b border-border dark:border-white/8">
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 dark:shadow-primary/30"
                  : "bg-card text-paragraph border border-border hover:border-primary/40 hover:text-primary dark:hover:border-emerald-500/40 dark:hover:shadow-sm dark:hover:shadow-emerald-500/10"
              }`}
            >
              <span>{category.label}</span>
              {category.count !== undefined && (
                <span
                  className={`min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-bold leading-none ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {category.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
