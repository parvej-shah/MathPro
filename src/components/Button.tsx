import React from "react";
import { Button as UiButton, buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";

type Props = {
  loading?: boolean;
  label: React.ReactNode;
  type?: "button" | "submit" | "reset";
  callBackFunction?: () => void;
  className?: string;
} & VariantProps<typeof buttonVariants>;

export default function Button({
  loading,
  label,
  type = "button",
  callBackFunction,
  variant,
  size,
  className,
}: Props) {
  return (
    <UiButton
      onClick={callBackFunction}
      type={type}
      variant={variant}
      size={size}
      disabled={loading}
      className={className ? `gap-2 ${className}` : "gap-2"}
    >
      {loading && (
        <svg
          className="animate-spin size-4 shrink-0"
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
    </UiButton>
  );
}
