import React from "react";
import { Search, X } from "lucide-react";
import { FilterCategory } from "../_lib/types";

interface StickyFiltersProps {
  categories: FilterCategory[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export default function StickyFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm = "",
  onSearchChange,
}: StickyFiltersProps) {
  // Only show categories that have items (count > 0)
  const visibleCategories = categories.filter(
    (c) => c.id === "all" || (c.count !== undefined && c.count > 0)
  );

  return (
    <div className="sticky top-20 z-30 py-3 mb-6 bg-section-a/95 backdrop-blur-xl border-b border-border dark:border-white/8 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {visibleCategories.map((category) => {
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

        {/* Inline Search Bar */}
        {onSearchChange && (
          <div className="relative shrink-0 w-full md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="কোর্স খুঁজুন..."
              className="w-full pl-9.5 pr-8 py-2 text-sm bg-card border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
