"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import PremiumCourseCard from "@/features/courses-page/components/PremiumCourseCard";
import PremiumBundleCard from "@/features/courses-page/components/PremiumBundleCard";
import type {
  CourseCategory,
  Bundle,
  BundleResponse,
} from "@/features/courses-page/_lib/types";
import {
  bundleMatchesCategory,
  getCategoryTagSet,
} from "@/features/courses-page/_lib/tagUtils";

/** Tab ids. Directory categories are keyed `cat-${slug}` to match /courses. */
const ALL_TAB = "all";
const COMBO_TAB = "bundles";
const CATEGORY_PREFIX = "cat-";

/** Cards shown per tab before sending the student to /courses for the rest. */
const VISIBLE_LIMIT = 6;

export function LandingCourseTabs({
  categories,
  loading,
}: {
  categories: CourseCategory[];
  loading: boolean;
}) {
  // Shares the ["bundles"] cache with /courses — no extra request when warm.
  const { data: bundlesData } = useQuery({
    queryKey: ["bundles"],
    queryFn: async (): Promise<Bundle[]> => {
      const response = await axios.get<BundleResponse>(
        `${BACKEND_URL}/user/bundle`,
      );
      if (!response.data.success) {
        throw new Error("Failed to fetch bundles");
      }
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const bundles = useMemo(() => {
    // Bundle urls come through as /bundle/:id but the student-facing route is /combos/:id.
    return (bundlesData || []).map((bundle) => ({
      ...bundle,
      url: bundle.url?.startsWith("/bundle/")
        ? bundle.url.replace("/bundle/", "/combos/")
        : bundle.url,
    }));
  }, [bundlesData]);

  const allCourses = useMemo(
    () => categories.flatMap((cat) => cat.courses),
    [categories],
  );

  const tabs = useMemo(() => {
    const built = [
      {
        id: ALL_TAB,
        label: "সব কোর্স",
        count: allCourses.length + bundles.length,
      },
    ];

    if (bundles.length > 0) {
      built.push({ id: COMBO_TAB, label: "Combo", count: bundles.length });
    }

    categories.forEach((cat) => {
      const matchingBundles = bundles.filter((bundle) =>
        bundleMatchesCategory(
          bundle,
          new Set(cat.courses.map((course) => course.id)),
          getCategoryTagSet(cat),
        ),
      ).length;
      built.push({
        id: `${CATEGORY_PREFIX}${cat.slug}`,
        label: cat.category_name,
        count: cat.courses.length + matchingBundles,
      });
    });

    return built;
  }, [categories, bundles, allCourses]);

  const [selectedTab, setSelectedTab] = useState(ALL_TAB);

  // Guard against a tab disappearing when the directory refetches.
  const activeTab = tabs.some((t) => t.id === selectedTab) ? selectedTab : ALL_TAB;

  const activeCategory = useMemo(() => {
    if (!activeTab.startsWith(CATEGORY_PREFIX)) return null;
    const slug = activeTab.slice(CATEGORY_PREFIX.length);
    return categories.find((cat) => cat.slug === slug) ?? null;
  }, [activeTab, categories]);

  const visibleCourses = useMemo(() => {
    if (activeTab === COMBO_TAB) return [];
    if (activeTab === ALL_TAB) return allCourses;
    return activeCategory?.courses ?? [];
  }, [activeTab, allCourses, activeCategory]);

  const visibleBundles = useMemo(() => {
    if (activeTab === COMBO_TAB) return bundles;
    if (activeTab === ALL_TAB) return bundles;
    if (!activeCategory) return [];
    return bundles.filter((bundle) =>
      bundleMatchesCategory(
        bundle,
        new Set(activeCategory.courses.map((c) => c.id)),
        getCategoryTagSet(activeCategory),
      ),
    );
  }, [activeTab, bundles, activeCategory]);

  // Combos lead — they're the higher-value option — then courses fill the grid.
  const items = useMemo(
    () => [
      ...visibleBundles.map((b) => ({ kind: "bundle" as const, data: b })),
      ...visibleCourses.map((c) => ({ kind: "course" as const, data: c })),
    ],
    [visibleBundles, visibleCourses],
  );

  const shown = items.slice(0, VISIBLE_LIMIT);
  const hasMore = items.length > VISIBLE_LIMIT;

  // "See all" deep-links into /courses with this tab preselected.
  const seeAllHref =
    activeTab === ALL_TAB
      ? "/courses"
      : activeTab === COMBO_TAB
        ? "/courses?category=bundles"
        : `/courses?category=${activeTab.slice(CATEGORY_PREFIX.length)}`;

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="flex gap-2.5 mb-10">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-10 w-28 bg-muted rounded-full animate-pulse" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
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
    <div className="flex flex-col">
      {/* Tabs — one row, horizontally scrollable on small screens */}
      <div
        role="tablist"
        aria-label="কোর্স ক্যাটাগরি"
        className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide pb-1 mb-10 relative z-[45]"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 dark:shadow-primary/30"
                  : "bg-card text-paragraph border border-border hover:border-primary/40 hover:text-primary dark:hover:border-emerald-500/40"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`min-w-5 h-5 px-1.5 flex items-center justify-center rounded-full text-xs font-bold leading-none ${
                  isActive
                    ? "bg-white/25 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {shown.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {shown.map((item) =>
            item.kind === "bundle" ? (
              <PremiumBundleCard key={`b-${item.data.id}`} bundle={item.data} />
            ) : (
              <PremiumCourseCard key={`c-${item.data.id}`} course={item.data} />
            ),
          )}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center text-muted-foreground relative z-[45]">
          এই ক্যাটাগরিতে এখনো কোনো কোর্স পাওয়া যায়নি।
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-12 relative z-[45]">
          <Link
            href={seeAllHref}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border bg-card text-heading font-bold hover:border-primary/40 hover:text-primary transition-all"
          >
            সব কোর্স দেখুন
            <span aria-hidden>&gt;</span>
          </Link>
        </div>
      )}
    </div>
  );
}
