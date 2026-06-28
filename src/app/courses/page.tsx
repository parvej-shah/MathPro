import { HydrationBoundary } from "@tanstack/react-query";
import { prefetchPublicCatalog } from "@/lib/catalog-server";
import CoursesPageClient from "./CoursesPageClient";

// ISR: revalidated by the prefetched fetch() calls (next.revalidate in catalog-server).
export default async function CoursesPage() {
  const state = await prefetchPublicCatalog([
    "courses",
    "featured",
    "course-directory",
    "instructors",
    "bundles",
    "public-testimonials",
  ]);

  return (
    <HydrationBoundary state={state}>
      <CoursesPageClient />
    </HydrationBoundary>
  );
}
