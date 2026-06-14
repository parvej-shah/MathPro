# Feature: course-details — Rules & Guardrails

Feature-level constraints. Inherits all of `invariants.md` and `conventions.md`; these add
specifics. An invariant always wins over a rule here.

## Layout guardrails

- Sticky stack is intentional: navbar `top-0 z-50`, tab strip `sticky top-17 z-30
  bg-background/90 backdrop-blur-md`, sidebar card `sticky top-20` (desktop only), mobile
  buy bar `fixed bottom-0 z-50 lg:hidden`. Main content keeps `pb-24 lg:pb-0` to clear the
  buy bar. Do not change a z-index or sticky offset without checking the others.
- The tab strip has a small fixed number of tabs — `flex items-center gap-1`, **no
  `overflow-x-auto`**.
- Tab content placement (স্টাডি প্ল্যান / ইন্সট্রাক্টর / কোর্স সম্পর্কে) and what goes in
  each is fixed by `context.md`. `you_get` belongs in কোর্স সম্পর্কে, not the sidebar.

## Conversion guardrails

- Never remove or weaken the persistent buy affordance (mobile buy bar / desktop sticky
  card). It is the primary conversion lever.
- Price, savings badge (`X% ছাড়`), social proof, and buy button stay together in the
  purchase card. Don't dilute it with secondary content.
- Status badges follow the catalogued patterns: live = green pulse dot + "ভর্তি চলছে";
  prebook = clock + "প্রিবুকিং চলছে" (`context.md` → Visual Aesthetics).

## Data

- Course data comes via the course hooks in `src/hooks/` (`useCourseDetails`,
  `useCourseAccess`, `useCountdown`, etc.) — don't fetch inline.
- `bundle` may appear in API/types; **display** must say Combo (invariant § Copy).

## Media access

- Free vs. paid content gating goes through `useFreeContentAccess` / `moduleAccessUtils`.
  Don't reimplement access checks per component.
