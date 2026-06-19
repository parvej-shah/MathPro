"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BellIcon, MenuIcon, XIcon } from "lucide-react";
import { BACKEND_URL } from "@/api.config";
import { getUserIdFromToken, isLoggedIn, logout } from "@/helpers";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavMode = "landing" | "default";

type NavProps = {
  mode?: NavMode;
};

type CourseSummary = {
  id: string | number;
};

type NotificationCountResponse = {
  data?: Array<{ count?: string | number }>;
};

const NOTIFICATION_UPDATED_EVENT = "notificationUpdated";

export default function Nav({ mode = "default" }: NavProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(mode !== "landing");
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const loginHref = `/auth/login?redirect=${encodeURIComponent(pathname || "/")}`;

  const fetchNotificationCount = useCallback(async () => {
    if (!isLoggedIn()) {
      setNotificationCount(0);
      return;
    }

    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken();
    if (!token || !userId) {
      setNotificationCount(0);
      return;
    }

    try {
      const coursesResponse = await axios.get<{ data?: CourseSummary[] }>(
        `${BACKEND_URL}/user/bundle/all-courses/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const courses = coursesResponse.data.data || [];
      if (courses.length === 0) {
        setNotificationCount(0);
        return;
      }

      const countResponses = await Promise.all(
        courses.map((course) =>
          axios
            .get<NotificationCountResponse>(
              `${BACKEND_URL}/user/notification/count?courseId=${course.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .catch(() => ({ data: { data: [] } } as { data: NotificationCountResponse }))
        )
      );

      const totalCount = countResponses.reduce((total, response) => {
        const courseCount = Number(response.data.data?.[0]?.count ?? 0);
        return total + (Number.isNaN(courseCount) ? 0 : courseCount);
      }, 0);

      setNotificationCount(totalCount);
    } catch (error) {
      console.warn("Failed to fetch notification count:", error);
      setNotificationCount(0);
    }
  }, []);

  useEffect(() => {
    const sync = () => setLoggedIn(isLoggedIn());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("tokenUpdated", sync as EventListener);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("tokenUpdated", sync as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      setNotificationCount(0);
      return;
    }

    void fetchNotificationCount();
  }, [fetchNotificationCount, loggedIn]);

  useEffect(() => {
    const refresh = () => {
      void fetchNotificationCount();
    };

    window.addEventListener(NOTIFICATION_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener(NOTIFICATION_UPDATED_EVENT, refresh);
    };
  }, [fetchNotificationCount]);

  useEffect(() => {
    if (mode !== "landing") {
      setIsScrolled(true);
      return;
    }
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  const navTextClass = isScrolled ? "text-foreground/80" : "text-white/90";
  const navHoverClass = isScrolled
    ? "hover:text-emerald-600 dark:hover:text-emerald-400"
    : "hover:text-emerald-400";
  const coursesActive = pathname?.startsWith("/courses");
  const dashboardActive = pathname?.startsWith("/dashboard");
  const profileActive = pathname?.startsWith("/profile");
  const notificationsActive = pathname?.startsWith("/notifications");
  const billingActive = pathname?.startsWith("/billing");
  const authButtonClass = `px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg transition-all shadow-lg hover:shadow-xl ${
    isScrolled
      ? "bg-emerald-500 text-white hover:bg-emerald-600"
      : "bg-white text-slate-900 hover:bg-emerald-50 dark:bg-white/90 dark:text-slate-900"
  }`;
  const notificationButtonClass = `relative inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
    isScrolled
      ? notificationsActive
        ? "border-primary/30 bg-primary/15 text-primary"
        : "border-border bg-background text-foreground hover:bg-muted"
      : notificationsActive
        ? "border-primary/40 bg-primary/20 text-primary"
        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
  }`;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[9000] transition-all duration-300 ${
        isScrolled
          ? "bg-background supports-[backdrop-filter]:bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent border-b border-white/10"
      }`}
    >
      <div className={`px-4 sm:px-6 lg:px-12 ${isScrolled ? "py-3" : "py-5"}`}>
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group/logo">
            <div className="size-8 md:size-10 rounded-lg md:rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg md:xl shadow-lg shadow-emerald-500/20 group-hover/logo:rotate-12 transition-transform duration-300">
              M
            </div>
            <span className="text-2xl md:text-4xl font-black tracking-tight font-manrope transition-all duration-300 group-hover/logo:tracking-widest text-emerald-500 group-hover/logo:text-emerald-400">
              MATHPRO
            </span>
          </Link>

          <div className={`hidden lg:flex gap-8 text-lg font-bold transition-colors ${navTextClass}`}>
            <Link
              href="/courses"
              className={`transition-colors ${navHoverClass} ${coursesActive ? "text-emerald-600" : ""}`}
            >
              কোর্সসমূহ
            </Link>
            {loggedIn && (
              <Link
                href="/dashboard"
                className={`transition-colors ${navHoverClass} ${dashboardActive ? "text-emerald-600" : ""}`}
              >
                ড্যাশবোর্ড
              </Link>
            )}
            {loggedIn && (
              <Link
                href="/billing"
                className={`transition-colors ${navHoverClass} ${billingActive ? "text-emerald-600" : ""}`}
              >
                পেমেন্ট হিস্টরি
              </Link>
            )}
            {loggedIn && (
              <Link
                href="/profile"
                className={`transition-colors ${navHoverClass} ${profileActive ? "text-emerald-600" : ""}`}
              >
                প্রোফাইল
              </Link>
            )}
            {mode === "landing" && (
              <>
                <a href="#features" className={`transition-colors ${navHoverClass}`}>বৈশিষ্ট্য</a>
                <a href="#branches" className={`transition-colors ${navHoverClass}`}>শাখাসমূহ</a>
              </>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {loggedIn && (
              <Link
                href="/notifications"
                className={notificationButtonClass}
                aria-label="নোটিফিকেশন"
                title={
                  notificationCount > 0
                    ? `নোটিফিকেশন (${notificationCount})`
                    : "নোটিফিকেশন"
                }
              >
                <BellIcon className="size-5" aria-hidden="true" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground shadow">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </Link>
            )}
            <ThemeToggle />
            {loggedIn ? (
              <button
                onClick={logout}
                className={authButtonClass}
              >
                লগআউট
              </button>
            ) : (
              <a
                href={loginHref}
                className={authButtonClass}
              >
                লগইন
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            {loggedIn && (
              <Link
                href="/notifications"
                className={notificationButtonClass}
                aria-label="নোটিফিকেশন"
                title={
                  notificationCount > 0
                    ? `নোটিফিকেশন (${notificationCount})`
                    : "নোটিফিকেশন"
                }
              >
                <BellIcon className="size-5" aria-hidden="true" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground shadow">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </span>
                )}
              </Link>
            )}
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                render={
                  <button
                    type="button"
                    aria-label="Open menu"
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                      isScrolled
                        ? "border-border bg-background text-foreground hover:bg-muted"
                        : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    }`}
                  />
                }
              >
                <MenuIcon className="size-5" aria-hidden />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>

              <SheetContent
                side="right"
                showCloseButton={false}
                className="w-[82vw] max-w-[340px] gap-0 overflow-hidden border-l border-emerald-400/20 !bg-[#03110f] !text-white shadow-[-24px_0_80px_rgba(0,0,0,0.55)]"
              >
                <SheetHeader className="border-b border-white/10 bg-[#071815] px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <SheetTitle className="text-base font-black text-emerald-300">
                      মেনু
                    </SheetTitle>
                    <SheetClose
                      render={
                        <button
                          type="button"
                          aria-label="Close menu"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white shadow-sm transition-colors hover:bg-white/15"
                        />
                      }
                    >
                      <XIcon className="size-4" aria-hidden />
                      <span className="sr-only">Close menu</span>
                    </SheetClose>
                  </div>
                </SheetHeader>

                <div className="flex min-h-0 flex-1 flex-col px-5 py-5">
                  <div className="flex flex-col gap-2.5 text-base font-extrabold">
                    <Link
                      href="/courses"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-xl border px-4 py-3 transition-colors ${
                        coursesActive
                          ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                          : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                      }`}
                    >
                      কোর্সসমূহ
                    </Link>
                    {loggedIn && (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-xl border px-4 py-3 transition-colors ${
                          dashboardActive
                            ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                            : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                        }`}
                      >
                        ড্যাশবোর্ড
                      </Link>
                    )}
                    {loggedIn && (
                      <Link
                        href="/billing"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-xl border px-4 py-3 transition-colors ${
                          billingActive
                            ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                            : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                        }`}
                      >
                        পেমেন্ট হিস্টরি
                      </Link>
                    )}
                    {loggedIn && (
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-xl border px-4 py-3 transition-colors ${
                          profileActive
                            ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                            : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                        }`}
                      >
                        প্রোফাইল
                      </Link>
                    )}
                    {loggedIn && (
                      <Link
                        href="/notifications"
                        onClick={() => setMobileMenuOpen(false)}
                        className={`rounded-xl border px-4 py-3 transition-colors ${
                          notificationsActive
                            ? "border-emerald-400/30 bg-emerald-400/15 text-emerald-200"
                            : "border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                        }`}
                      >
                        নোটিফিকেশন
                      </Link>
                    )}
                    {mode === "landing" && (
                      <>
                        <a
                          href="#features"
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white transition-colors hover:bg-white/[0.1]"
                        >
                          বৈশিষ্ট্য
                        </a>
                        <a
                          href="#branches"
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white transition-colors hover:bg-white/[0.1]"
                        >
                          শাখাসমূহ
                        </a>
                      </>
                    )}
                  </div>

                  <div className="mt-auto border-t border-white/10 pt-5">
                    {loggedIn ? (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          logout();
                        }}
                        className="inline-flex w-full justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/30 transition-colors hover:bg-emerald-400"
                      >
                        লগআউট
                      </button>
                    ) : (
                      <a
                        href={loginHref}
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex w-full justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/30 transition-colors hover:bg-emerald-400"
                      >
                        লগইন
                      </a>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </nav>
  );
}
