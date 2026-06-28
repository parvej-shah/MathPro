import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { REVALIDATE_TAGS, type RevalidateTag } from "@/lib/catalog-server";

/**
 * On-demand cache revalidation receiver.
 *
 * The backend POSTs here after a catalog mutation so the affected static pages
 * (/, /courses, /combos) refresh within seconds instead of waiting on the ISR
 * safety-net timer. Guarded by a shared secret (REVALIDATE_SECRET) that must
 * match the backend's value.
 *
 * Contract:
 *   POST /api/revalidate
 *   Header: x-revalidate-secret: <REVALIDATE_SECRET>
 *   Body:   { "tags": ["courses", "combos"] }
 *   200 { revalidated: true, tags: [...] } | 400 bad body | 401 bad secret | 500 misconfig
 */

// Never cache the receiver itself.
export const dynamic = "force-dynamic";

const VALID_TAGS = new Set<string>(REVALIDATE_TAGS);

/** Constant-time secret comparison; false on any length/encoding mismatch. */
function secretMatches(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false; // timingSafeEqual throws on length mismatch
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    // Misconfiguration, not a client error — never silently 200.
    console.error("[revalidate] REVALIDATE_SECRET is not set");
    return NextResponse.json(
      { revalidated: false, message: "Revalidation not configured" },
      { status: 500 },
    );
  }

  if (!secretMatches(req.headers.get("x-revalidate-secret"), expected)) {
    return NextResponse.json(
      { revalidated: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  // Defensive body parse — never throw on malformed/empty JSON.
  const body = await req.json().catch(() => null);
  const rawTags = (body as { tags?: unknown })?.tags;
  if (!Array.isArray(rawTags)) {
    return NextResponse.json(
      { revalidated: false, message: "Body must be { tags: string[] }" },
      { status: 400 },
    );
  }

  // Keep only known tags, de-duplicated.
  const tags = [...new Set(rawTags)].filter(
    (t): t is RevalidateTag => typeof t === "string" && VALID_TAGS.has(t),
  );
  if (tags.length === 0) {
    return NextResponse.json(
      {
        revalidated: false,
        message: `No valid tags. Allowed: ${[...VALID_TAGS].join(", ")}`,
      },
      { status: 400 },
    );
  }

  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return NextResponse.json({ revalidated: true, tags });
}
