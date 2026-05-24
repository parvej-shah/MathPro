import React from "react";
import { cn } from "@/lib/utils";

type Props = {
  loading?: boolean;
  gradientStyle?: string;
  label: React.ReactNode;
  type?: "button" | "submit" | "reset";
  callBackFunction?: () => void;
};

export default function GradientButton({
  loading,
  gradientStyle,
  label,
  type = "button",
  callBackFunction,
}: Props) {
  return (
    <button
      onClick={callBackFunction}
      type={type}
      disabled={loading}
      style={loading || !gradientStyle ? undefined : { background: gradientStyle }}
      className={cn(
        "py-3 w-full rounded-xl justify-center flex gap-2 items-center px-6",
        "font-semibold text-white text-lg transition-opacity duration-150",
        loading
          ? "bg-muted text-muted-foreground cursor-not-allowed opacity-70"
          : "cursor-pointer hover:opacity-75 focus:ring-2 focus:ring-ring/50",
        !gradientStyle && !loading && "bg-linear-to-r from-primary to-accent",
      )}
    >
      {loading && (
        <svg
          className="animate-spin size-5 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {label}
    </button>
  );
}
