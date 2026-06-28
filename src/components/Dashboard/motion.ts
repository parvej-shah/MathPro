import type { Variants } from "framer-motion";

// Shared framer-motion variants for the dashboard surfaces.
// Keeps the motion convention consistent across both dashboard pages.

/** Single section/card fade-up on mount. */
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/** Parent that staggers its children (grids/lists). */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

/** Child item used inside a `containerVariants` parent. */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: "easeOut" },
  },
};

/** Gamified count "pop" — reserved for streak/rank reward moments. */
export const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 18 },
  },
};
