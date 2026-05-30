"use client";

import { useTheme } from "@/components/theme-provider";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`size-9 flex items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10 ${className ?? ""}`}
    >
      {isDark ? (
        <MdOutlineLightMode className="size-5 text-yellow-300" />
      ) : (
        <MdOutlineDarkMode className="size-5 text-slate-600" />
      )}
    </button>
  );
}
