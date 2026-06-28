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
 *
 * Freshness comes from on-demand revalidation: the backend POSTs to
 * /api/revalidate on every catalog mutation, which calls revalidateTag() for
 * the affected `RevalidateTag`. REVALIDATE_SECONDS is only a long safety net in
 * case a webhook is ever missed.
 */

const REVALIDATE_SECONDS = 3600; // 1h safety net; real freshness via revalidateTag.

/**
 * On-demand cache tags. SINGLE SOURCE OF TRUTH — shared by:
 *  - the `next.tags` attached to each catalog fetch below, and
 *  - the /api/revalidate route handler's allow-list.
 * Must stay in sync with the backend's util/revalidateFrontend.js tag names.
 */
export const REVALIDATE_TAGS = [
  "courses",
  "combos",
  "instructors",
  "public-testimonials",
] as const;

export type RevalidateTag = (typeof REVALIDATE_TAGS)[number];

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

// Maps a logical catalog key to its backend path + React Query key + cache tag.
// `featured`/`course-directory` ride the `courses` tag; `bundles`/`combos` ride
// the `combos` tag — so one mutation tag refreshes every page that shows it.
const ENDPOINTS: Record<
  CatalogKey,
  { path: string; queryKey: unknown[]; tag: RevalidateTag }
> = {
  courses: { path: "/user/course/list", queryKey: ["courses"], tag: "courses" },
  featured: {
    path: "/user/course/featured",
    queryKey: ["courses", "featured"],
    tag: "courses",
  },
  "course-directory": {
    path: "/user/course/directory",
    queryKey: ["course-directory"],
    tag: "courses",
  },
  instructors: {
    path: "/user/instructor/list",
    queryKey: ["instructors"],
    tag: "instructors",
  },
  bundles: { path: "/user/bundle", queryKey: ["bundles"], tag: "combos" },
  combos: { path: "/user/bundle", queryKey: ["combos"], tag: "combos" },
  "public-testimonials": {
    path: "/user/testimonial/list",
    queryKey: ["public-testimonials"],
    tag: "public-testimonials",
  },
};

async function fetchCatalog<T>(path: string, tag: RevalidateTag): Promise<T[]> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
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
      const { path, queryKey, tag } = ENDPOINTS[key];
      return queryClient.prefetchQuery({
        queryKey,
        queryFn: () => fetchCatalog(path, tag),
      });
    }),
  );

  return dehydrate(queryClient);
}
