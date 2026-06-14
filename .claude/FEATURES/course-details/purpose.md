# Feature: course-details — Purpose

## Domain

Owns the course detail experience: `src/features/course-details/**` and the route
`src/app/courses/[id]/`. This is the **flagship conversion surface** — a student lands
here from the course list and decides whether to enroll.

## Intent

Every layout and copy decision exists to move the student toward **"এখনই ভর্তি হও"**.
The page is a conversion page, not a spec sheet. Trust signals (enrolled count, teacher
credibility, refund guarantee, live/prebook status), scarcity cues (countdown, deadline),
and a persistent buy affordance are deliberate, not decorative.

## What lives here

- **Purchase flow:** `BuyCourseDialog`, `PrebookCourseDialog`, `PrebookSuccessDialog`,
  `PriceBillboard`, `CountdownTimer`.
- **Content tabs:** `CourseTabs` + `StudyPlanTab` (curriculum / `ChapterAccordion`),
  `InstructorTab`, `CourseDetailsTab` ("কোর্স সম্পর্কে").
- **Header / proof:** `CourseHeader`, `CourseStats`, `EnrollmentInfo`,
  `CommunitySupportSection`.
- **Media:** `FreeVideoModal`, `VideoItem`, `PdfItem` + `useFreeContentAccess`.
- **`_lib/`:** `types.ts`, `bengaliFormatter.ts`, `chips.ts`, `enrollmentIcons.ts`,
  `youtubeHelpers.ts`, `utils.ts`.

## Canonical layout

The mobile/desktop split, sticky behaviors, and tab content placement are documented in
`context.md` → "Page Architecture — `/courses/[id]`". That is the source of truth for
where each element goes. Read it before moving anything.

Key intent that's easy to get wrong:
- The "what you get" (`you_get`) feature list lives in the **কোর্স সম্পর্কে tab**, not the
  sidebar — the sidebar stays focused on price + proof + buy.
