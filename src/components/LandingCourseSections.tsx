"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PremiumCourseCard from "@/features/courses-page/components/PremiumCourseCard";
import type { CourseCategory } from "@/features/courses-page/_lib/types";
import { englishToBanglaNumbers } from "@/helpers";

const ALL_TAG_ID = "all";
const sessionTagPattern = /(?:^|\s)(jsc|ssc|hsc)(?:\s|$)|[০-৯]{2,4}|\d{2,4}/i;
const nonSessionTagKeywords = [
  "লাইভ",
  "রেকর্ডেড",
  "ভিডিও",
  "কুইজ",
  "quiz",
  "live",
  "recorded",
];

function normalizeTag(tag: string) {
  return tag.replace(/\s+/g, " ").trim();
}

function banglaDigitsToEnglish(value: string) {
  return value.replace(/[০-৯]/g, (digit) =>
    String("০১২৩৪৫৬৭৮৯".indexOf(digit)),
  );
}

function isSessionFilterTag(tag: string) {
  const normalized = normalizeTag(tag);
  if (!normalized) return false;

  const lowerCased = normalized.toLowerCase();
  if (nonSessionTagKeywords.some((keyword) => lowerCased.includes(keyword))) {
    return false;
  }

  return sessionTagPattern.test(lowerCased);
}

function formatTagLabel(tag: string) {
  return normalizeTag(tag).replace(/\d+/g, (match) =>
    englishToBanglaNumbers(Number(match)),
  );
}

function extractTagSortValue(tag: string) {
  const digits = banglaDigitsToEnglish(tag).match(/\d{2,4}/g);
  if (!digits || digits.length === 0) return -1;
  return Number(digits[digits.length - 1]);
}

function CategoryCourseSection({ category }: { category: CourseCategory }) {
  const filterTags = useMemo(() => {
    const uniqueTags = new Map<string, string>();

    category.courses.forEach((course) => {
      course.tags?.forEach((tag) => {
        if (!isSessionFilterTag(tag)) return;
        const normalized = normalizeTag(tag);
        if (!uniqueTags.has(normalized)) {
          uniqueTags.set(normalized, tag);
        }
      });
    });

    return Array.from(uniqueTags.values()).sort((a, b) => {
      const yearDifference = extractTagSortValue(b) - extractTagSortValue(a);
      if (yearDifference !== 0) return yearDifference;
      return normalizeTag(a).localeCompare(normalizeTag(b), "en", {
        sensitivity: "base",
      });
    });
  }, [category.courses]);

  const [selectedTag, setSelectedTag] = useState(ALL_TAG_ID);

  const activeTag =
    selectedTag === ALL_TAG_ID || filterTags.includes(selectedTag)
      ? selectedTag
      : ALL_TAG_ID;

  const visibleCourses = useMemo(() => {
    const courses =
      activeTag === ALL_TAG_ID
        ? category.courses
        : category.courses.filter((course) =>
            course.tags?.some((tag) => normalizeTag(tag) === activeTag),
          );

    return courses.slice(0, 3);
  }, [activeTag, category.courses]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 relative z-[45]">
        <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-heading">
          {category.category_name}
        </h3>
        <Link
          href="/courses"
          className="text-sm font-bold text-primary hover:gap-2 flex items-center gap-1 transition-all"
        >
          সব দেখুন <span>&gt;</span>
        </Link>
      </div>

      {filterTags.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10 relative z-[45]">
          <button
            type="button"
            onClick={() => setSelectedTag(ALL_TAG_ID)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
              selectedTag === ALL_TAG_ID
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary"
            }`}
          >
            সব
          </button>
          {filterTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(normalizeTag(tag))}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                activeTag === normalizeTag(tag)
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary"
              }`}
            >
              {formatTagLabel(tag)}
            </button>
          ))}
        </div>
      )}

      {visibleCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {visibleCourses.map((course) => (
            <PremiumCourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center text-muted-foreground relative z-[45]">
          এই ট্যাগে এখনো কোনো কোর্স পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
}

export function LandingCourseSections({
  categories,
  loading,
}: {
  categories: CourseCategory[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <>
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col">
            <div className="h-10 w-48 bg-muted rounded-lg mb-10 animate-pulse" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
              {[0, 1, 2].map((j) => (
                <div key={j} className="h-72 bg-muted rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16 relative z-[45]">
        নতুন কোর্স শীঘ্রই যোগ করা হবে।
      </div>
    );
  }

  return (
    <>
      {categories.map((category) => (
        <CategoryCourseSection key={category.slug} category={category} />
      ))}
    </>
  );
}
