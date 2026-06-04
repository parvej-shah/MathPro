import { NextRequest, NextResponse } from "next/server";

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
    pathname.startsWith("/profile/")
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
    const redirectTarget = req.nextUrl.searchParams.get("redirect");
    if (redirectTarget) {
      return NextResponse.redirect(new URL(redirectTarget, req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/course/:path*", "/profile/:path*", "/auth/:path*"],
};
