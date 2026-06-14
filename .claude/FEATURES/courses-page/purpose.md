# Feature: courses-page — Purpose

## Domain

Owns the course discovery + combo surfaces: `src/features/courses-page/**` and the routes
`src/app/courses/` (catalog) and `src/app/combos/` (multi-course offers). It feeds students
into `course-details`.

## Intent

Help a student find the right course fast and feel that MathPro is credible and worth
paying for. The combos surface specifically sells the **savings + exam-coverage** story of
buying multiple courses together.

## What lives here

- **Cards:** `CourseCard`, `PremiumCourseCard`, `LandingStyleCourseCard`,
  `PremiumBundleCard` (combo card), `FeaturedCourseSlider`.
- **Discovery:** `CourseSearchBar`, `StickyFilters`, `CoursesLoadingSkeleton`.
- **Trust / social:** `HeroStatsStrip`, `TeacherSlider`, `CommunityBentoBox`,
  `FacebookCommunityCTASection`, `StillQuestion`, `FAQSection`.

## Combos surface

`/combos` is a conversion page, not a plain product grid. Its required behaviors (explain
what a Combo is, show every included course on the card, keep value/trust signals near the
grid, Bengali CTAs, rely on the layout navbar) are documented in `context.md` →
"Page Architecture — `/combos`". Read it before editing combo UI.

## Open work (see root TODO.md)

- Tags on courses → inherited by combos → JSC/SSC/HSC filter bar across course listings.
- FAQ sections on course details, combo details, and the combos page.
