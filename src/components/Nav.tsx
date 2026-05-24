"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isLoggedIn, logout } from "@/helpers";

type NavMode = "landing" | "default";

type NavProps = {
  mode?: NavMode;
};

export default function Nav({ mode = "default" }: NavProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(mode !== "landing");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginHref, setLoginHref] = useState("https://www.mathpro.com/auth/login");

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
    if (mode !== "landing") return;
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode]);

  useEffect(() => {
    setLoginHref(
      `https://www.mathpro.com/auth/login?redirect=${encodeURIComponent(window.location.href)}`,
    );
  }, []);

  const navTextClass = isScrolled ? "text-slate-600" : "text-white/90";
  const navHoverClass = isScrolled
    ? "hover:text-emerald-600"
    : "hover:text-emerald-400";

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 lg:px-12 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-4"
          : "bg-transparent border-b border-white/10 py-6"
      }`}
    >
      <Link href="/" className="flex items-center gap-2 md:gap-3 group/logo">
        <div className="size-8 md:size-10 rounded-lg md:rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-lg md:xl shadow-lg shadow-emerald-500/20 group-hover/logo:rotate-12 transition-transform duration-300">
          M
        </div>
        <span className="text-2xl md:text-4xl font-black tracking-tight font-manrope transition-all duration-300 group-hover/logo:tracking-widest text-emerald-500 group-hover/logo:text-emerald-400">
          MATHPRO
        </span>
      </Link>

      <div className={`hidden md:flex gap-10 text-lg font-bold transition-colors ${navTextClass}`}>
        {mode === "landing" ? (
          <>
            <a href="#courses" className={`transition-colors ${navHoverClass}`}>কোর্সসমূহ</a>
            <a href="#features" className={`transition-colors ${navHoverClass}`}>বৈশিষ্ট্য</a>
            <a href="#branches" className={`transition-colors ${navHoverClass}`}>শাখাসমূহ</a>
          </>
        ) : (
          <>
            <Link
              href="/courses"
              className={`transition-colors ${navHoverClass} ${pathname?.startsWith("/courses") ? "text-emerald-600" : ""}`}
            >
              কোর্সসমূহ
            </Link>
            {loggedIn && (
              <Link
                href="/dashboard"
                className={`transition-colors ${navHoverClass} ${pathname?.startsWith("/dashboard") ? "text-emerald-600" : ""}`}
              >
                আমার কোর্স
              </Link>
            )}
          </>
        )}
      </div>

      {loggedIn ? (
        <button
          onClick={logout}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg transition-all shadow-lg hover:shadow-xl ${
            isScrolled
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-white text-slate-900 hover:bg-emerald-50"
          }`}
        >
          লগআউট
        </button>
      ) : (
        <a
          href={loginHref}
          className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-lg transition-all shadow-lg hover:shadow-xl ${
            isScrolled
              ? "bg-emerald-500 text-white hover:bg-emerald-600"
              : "bg-white text-slate-900 hover:bg-emerald-50"
          }`}
        >
          লগইন
        </a>
      )}
    </nav>
  );
}
