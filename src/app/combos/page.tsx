import { HydrationBoundary } from "@tanstack/react-query";
import { prefetchPublicCatalog } from "@/lib/catalog-server";
import CombosPageClient from "./CombosPageClient";

// ISR: revalidated by the prefetched fetch() calls (next.revalidate in catalog-server).
export default async function CombosPage() {
  const state = await prefetchPublicCatalog([
    "combos",
    "public-testimonials",
    "faqs",
  ]);

  return (
    <HydrationBoundary state={state}>
      <CombosPageClient />
    </HydrationBoundary>
  );
}
