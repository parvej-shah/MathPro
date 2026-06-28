import "server-only";
import {
  QueryClient,
  dehydrate,
  type DehydratedState,
} from "@tanstack/react-query";
import { BACKEND_URL } from "@/api.config";

/**
 * Server-side prefetch for the public catalog pages.
 *
 * Each public endpoint is fetched on the server with time-based ISR
 * (`next.revalidate`), then dehydrated into a QueryClient whose entries use the
 * SAME query keys the client hooks use. The page wraps its client body in a
 * <HydrationBoundary> with this state, so React Query reads the cache and skips
 * the initial client fetch — real content paints on first load.
 *
 * Returned data shape mirrors the client queryFns exactly: `response.data.data`.
 */

const REVALIDATE_SECONDS = 300; // 5 min ISR, matches the client staleTime.

type CatalogKey =
  | "courses"
  | "featured"
  | "course-directory"
  | "instructors"
  | "bundles"
  | "combos"
  | "public-testimonials";

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

// Maps a logical catalog key to its backend path + React Query key.
const ENDPOINTS: Record<CatalogKey, { path: string; queryKey: unknown[] }> = {
  courses: { path: "/user/course/list", queryKey: ["courses"] },
  featured: { path: "/user/course/featured", queryKey: ["courses", "featured"] },
  "course-directory": {
    path: "/user/course/directory",
    queryKey: ["course-directory"],
  },
  instructors: { path: "/user/instructor/list", queryKey: ["instructors"] },
  bundles: { path: "/user/bundle", queryKey: ["bundles"] },
  combos: { path: "/user/bundle", queryKey: ["combos"] },
  "public-testimonials": {
    path: "/user/testimonial/list",
    queryKey: ["public-testimonials"],
  },
};

async function fetchCatalog<T>(path: string): Promise<T[]> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) return [];
  const json = (await res.json()) as ApiEnvelope<T[]>;
  return Array.isArray(json?.data) ? json.data : [];
}

/**
 * Prefetch the given public catalog endpoints on the server and return the
 * dehydrated React Query state. Failures fall back to an empty array so the
 * client hook simply refetches — the page never blocks on a backend error.
 */
export async function prefetchPublicCatalog(
  keys: CatalogKey[],
): Promise<DehydratedState> {
  const queryClient = new QueryClient();

  await Promise.all(
    keys.map((key) => {
      const { path, queryKey } = ENDPOINTS[key];
      return queryClient.prefetchQuery({
        queryKey,
        queryFn: () => fetchCatalog(path),
      });
    }),
  );

  return dehydrate(queryClient);
}
