import { NextRequest, NextResponse } from "next/server";

// Centralized route protection (per conventions.md § Auth & State).
//
// Runs BEFORE any client JS, so it can only read the `token` cookie — not
// localStorage or the `#token=` hash used by cross-LMS redirects. It is
// therefore the *primary* gate; each protected page keeps a thin client-side
// `isLoggedIn()` check as a fallback for the cookie-not-yet-written case
// (hash/localStorage-only sessions). Keep the two in sync.
//
// NOTE: this repo uses a `src/` directory, so this file MUST live at
// `src/middleware.ts` (same level as `app`). A root-level file is ignored by
// Next when `src/` exists — which is why the previous root `middleware.ts`
// silently never ran, leaving protection to the flaky per-page checks.

const AUTH_ROUTES = new Set([
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
]);

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = parts[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// Mirrors helpers/index.ts `checkTokenValidity`: an identity claim + a
// non-expired `exp` (tokens without `exp` are treated as valid).
function hasValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  const hasIdentity = Boolean(
    payload.name || payload.email || payload.user_id || payload.sub || payload.id,
  );
  if (!hasIdentity) return false;

  const exp = payload.exp;
  if (typeof exp === "number") {
    return exp > Date.now() / 1000;
  }

  return true;
}

function isProtectedPath(pathname: string): boolean {
  return (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/course" ||
    pathname.startsWith("/course/") ||
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/billing" ||
    pathname.startsWith("/billing/") ||
    pathname === "/ranking" ||
    pathname.startsWith("/ranking/")
  );
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const loggedIn = hasValidToken(token);

  if (isProtectedPath(pathname) && !loggedIn) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirect", `${req.nextUrl.origin}${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ROUTES.has(pathname) && loggedIn) {
    // `force_logout=1` means another app (e.g. admin) is tearing down a session
    // it can't clear cross-origin. Let the page render so its client code drops
    // the token and shows the form — do NOT auto-redirect a "logged in" user.
    if (req.nextUrl.searchParams.get("force_logout") === "1") {
      return NextResponse.next();
    }

    const redirectTarget = req.nextUrl.searchParams.get("redirect");
    if (redirectTarget) {
      // Only handle SAME-ORIGIN redirects here. Cross-origin targets (e.g. the
      // admin app) need the client-side handler, which checks the user's type
      // and appends the token in the URL `#hash` for the cross-LMS hand-off.
      // Redirecting cross-origin here would strip the token and ignore type,
      // bouncing the user straight back — an infinite loop.
      try {
        const target = new URL(redirectTarget, req.url);
        if (target.origin === req.nextUrl.origin) {
          return NextResponse.redirect(target);
        }
        return NextResponse.next();
      } catch {
        return NextResponse.next();
      }
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/course/:path*",
    "/profile/:path*",
    "/billing/:path*",
    "/ranking/:path*",
    "/auth/:path*",
  ],
};
