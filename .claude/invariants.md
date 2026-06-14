# Invariants — Non-Negotiable Global Laws

These are never overrideable by a feature rule, by "it looks cleaner," or by an implicit
inference. They may only be broken if the user explicitly names the invariant and confirms
they want it broken. Otherwise: **stop and flag, do not proceed.**

## Scope Control (the most important one)

- Change **only** what the task requires. The blast radius of an edit must match the
  intent of the request.
- Never refactor, rename, reformat, dedupe, or "clean up" code outside the task's scope —
  even if it is clearly improvable. Note it; do not do it.
- A change that is *locally correct* but *globally harmful* (alters shared behavior, breaks
  a contract elsewhere, changes a public export) is a **defect**, not an improvement.
- "This pattern is repeated, I'll extract it" is a proposal, not an action. Propose it.

## Documentation / Memory

- Never delete `context.md`, `.claude/*.md`, or any `FEATURES/**` doc without explicit
  instruction naming the file.
- Never replace a doc with an alias, stub, or "see other file" pointer.
- Never auto-deduplicate or auto-condense docs. Structure may improve; usability must not
  drop. If a restructure would reduce usability, **stop and ask.**
- `memory.md` is append-only. Do not rewrite or prune past entries.

## Styling

- **No raw color values in JSX.** No hex, no `oklch(...)`, no `bg-[#…]` / `text-[#…]`.
  Token classes only. (Palette + roles: `context.md` → Design Tokens.)
- **Tailwind v4 gradient syntax is `bg-linear-to-{dir}`**, never `bg-gradient-to-{dir}`.
- Forbidden legacy tokens: `text-darkHeading`, `text-paragraph`, `text-darkParagraph`,
  `bg-purple`. They are removed from the system.
- Every component must render correctly in **both light and dark mode**. Dark mode is
  first-class, not an afterthought.

## Copy (user-facing)

- All user-facing copy is **Bengali**. English is allowed only for technical UI chrome
  (form placeholders, icon labels).
- Address students informally: তুমি / দেখো / নাও / করো. Never আপনি / দেখুন / নিন / করুন
  in student-facing marketing UI.
- Multi-course offers are **"Combo" / "কোর্স Combo"** in all user-facing text. Never
  "Bundle". (Backend/API types may stay `bundle` for compatibility — display text may not.)
- Counts, days, and numerals shown to users go through `englishToBanglaNumbers()`.

## Platform

- This is **Next.js 16 / Tailwind v4 / React 19**. Do not assume APIs from older versions.
  Read `node_modules/next/dist/docs/` before App Router / router-API work.
- Never commit a change that fails `npx tsc --noEmit`.
