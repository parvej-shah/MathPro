import type { Bundle, CourseCategory } from "./types";

export function normalizeTag(tag: string) {
  return tag.replace(/\s+/g, " ").trim();
}

export function collectNormalizedTags(tags?: string[] | null) {
  const unique = new Set<string>();

  tags?.forEach((tag) => {
    const normalized = normalizeTag(tag);
    if (normalized) unique.add(normalized);
  });

  return unique;
}

export function getCategoryTagSet(category?: CourseCategory | null) {
  const tags = new Set<string>();

  category?.courses.forEach((course) => {
    course.tags?.forEach((tag) => {
      const normalized = normalizeTag(tag);
      if (normalized) tags.add(normalized);
    });
  });

  return tags;
}

export function getBundleTagSet(bundle: Pick<Bundle, "tags" | "courses">) {
  const tags = collectNormalizedTags(bundle.tags);

  bundle.courses?.forEach((course) => {
    course.tags?.forEach((tag) => {
      const normalized = normalizeTag(tag);
      if (normalized) tags.add(normalized);
    });
  });

  return tags;
}

export function bundleMatchesCategory(
  bundle: Pick<Bundle, "tags" | "courses">,
  categoryCourseIds: Set<number> | null,
  categoryTags: Set<string> | null,
) {
  if (categoryCourseIds && categoryCourseIds.size > 0) {
    const bundleCourseIds = new Set<number>();

    bundle.courses?.forEach((course) => {
      bundleCourseIds.add(course.id);
    });

    for (const courseId of bundleCourseIds) {
      if (categoryCourseIds.has(courseId)) return true;
    }
  }

  if (!categoryTags || categoryTags.size === 0) return false;

  const bundleTags = getBundleTagSet(bundle);
  for (const tag of bundleTags) {
    if (categoryTags.has(tag)) return true;
  }

  return false;
}
