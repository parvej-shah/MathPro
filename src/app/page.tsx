import { HydrationBoundary } from "@tanstack/react-query";
import { LandingPage } from "@/components/landing-page";
import { prefetchPublicCatalog } from "@/lib/catalog-server";

// ISR: revalidated by the prefetched fetch() calls (next.revalidate in catalog-server).
export default async function Home() {
  const state = await prefetchPublicCatalog([
    "course-directory",
    "public-testimonials",
    "instructors",
  ]);

  return (
    <HydrationBoundary state={state}>
      <LandingPage />
    </HydrationBoundary>
  );
}
