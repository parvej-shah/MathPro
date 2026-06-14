# Feature: courses-page — Rules & Guardrails

Inherits all of `invariants.md` and `conventions.md`. Invariants always win.

## Combos guardrails

- Combo cards must show **every included course directly on the card**. Do not hide course
  lists behind an inner scrollbar or a "+ N more" summary.
- The first viewport of `/combos` must explain what a Combo is and why it saves money.
- Keep value/trust signals near the grid: total course coverage, savings, discount,
  live/recorded access, exam-focused planning.
- Combo CTAs are Bengali: "Combo বিস্তারিত দেখো", "Combo গুলো দেখো", "সকল কোর্স দেখো".
- "Bundle" never appears in user-facing combo text (invariant § Copy). `PremiumBundleCard`
  is the internal component name — its rendered copy says Combo.

## Listing / discovery guardrails

- Use the shared ambient background system (`bg-section-a`/`bg-section-b`, fixed
  primary/teal glows, graph-paper texture) consistently with `/courses` — see `context.md`.
- Do **not** render a page-level `Nav`; the layout owns the navbar.
- Course/combo lists fetch via the `src/hooks/` data hooks (`useAllCourses`,
  `useCourseDirectory`, `useEnhancedBundle`, `useBundleAccess`, …) — not inline fetch.
- Loading states use `CoursesLoadingSkeleton` / the shared skeletons, not ad-hoc spinners,
  to avoid layout shift on mobile.

## When adding the filter bar / tags (TODO)

- Tags live on the course; combos **inherit** course tags — don't define a separate combo
  tag taxonomy.
- Filter dimensions are the exam levels: JSC / SSC / HSC. Keep labels Bengali-first.
