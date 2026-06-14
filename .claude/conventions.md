# Conventions — Naming, API Patterns, Coding Standards

Default patterns for this codebase. Follow them unless an `invariants.md` law or a feature
`rules.md` says otherwise. These describe *how* the code is written; `invariants.md`
describes what must *never* change.

## Project layout

```
src/
  app/            Next.js 16 App Router — routes, layouts, route-group dirs
  components/     Global shared UI (ui/ = shadcn primitives; Dashboard/, Ranking/, …)
  features/       Vertical feature slices (see below)
  hooks/          App-wide data hooks — useXxx.ts, mostly @tanstack/react-query
  services/       Imperative API calls not modeled as hooks (couponService, moduleViewService)
  lib/            api.ts (axios instance), utils.ts (cn, helpers)
  Contexts/       React context providers (UserContext)
  helpers/        Pure utility functions (englishToBanglaNumbers, formatters)
  utils/          Cross-cutting trackers/guards (courseViewTracker, moduleAccessUtils)
  config/         siteConfig (SEO/metadata)
  constants/, types/
api.config.ts     BACKEND_URL, COURSE_ID — environment endpoints
```

### Feature slice structure
```
features/<feature>/
  components/     Feature-scoped components + index.ts barrel
  hooks/          Feature-scoped hooks (when not app-wide)
  _lib/           types.ts, utils.ts, and pure helpers private to the feature
```
Underscore-prefixed (`_lib`) = private to the feature; do not import across features.
Cross-feature sharing goes through `src/` top-level dirs, not feature-to-feature imports.

## Naming

- Components: `PascalCase.tsx`, one component per file, default-export or named via barrel.
- Hooks: `useThing.ts`, camelCase.
- Pure helpers / utils: `camelCase.ts`.
- Types live in `_lib/types.ts` (feature) or `src/types/` (global).
- Icon props in tab/menu config arrays are typed `React.ReactNode`.

## Styling

- Token classes only — see `invariants.md` § Styling for the hard bans.
- Tokens are CSS custom properties in `src/app/globals.css`, aliased into Tailwind's
  `@theme inline`. Full palette/role table is in `context.md` → Design Tokens.
- Prefer the spacing scale (`top-17`, `py-3.5`) over arbitrary brackets (`top-[68px]`)
  unless the value is genuinely one-off.
- `cn()` from `src/lib/utils.ts` for conditional class merging (clsx + tailwind-merge).
- Recurring visual patterns (glass panels, gradient CTAs, status badges) are catalogued in
  `context.md` → Visual Aesthetics. Reuse them; don't reinvent.

## Data & API

- HTTP through the shared axios instance in `src/lib/api.ts` (`api`). Don't create ad-hoc
  axios instances or bare `fetch` in components.
- `api.config.ts` holds `BACKEND_URL` / `COURSE_ID`. Note `lib/api.ts` reads
  `NEXT_PUBLIC_API_URL`; keep endpoint config centralized, not inlined in components.
- Server state: `@tanstack/react-query` via `src/hooks/useXxx.ts`. New data fetching gets a
  hook in `src/hooks/` (app-wide) or `features/<f>/hooks/` (feature-scoped), not inline.
- Imperative one-off calls (coupon validation, view tracking) → `src/services/`.

## Auth & State

- Client auth state: `UserContext` (`[user, setUser]` tuple; `isLoggedIn`, `loading`,
  `darkMode`). `"use client"`.
- Route protection: `middleware.ts` — JWT in the `token` cookie, validated by decoding the
  payload (identity claim + `exp`). Protected: `/dashboard`, `/course`, `/profile`.
  Auth routes redirect away when already logged in. Update the `matcher` if you add a
  protected path.

## Routing (App Router, Next.js 16)

- Routes under `src/app/`. Dynamic segments use bracket dirs (`courses/[id]`,
  `course/[courseId]/[chapterid]/[moduleid]`).
- Layout-level navbar is rendered once at the layout; pages must **not** render a second
  page-level `Nav`.
- Before writing route handlers, server components, or router APIs, read the relevant guide
  in `node_modules/next/dist/docs/` — v16 differs from training data.

## Verification

- `npx tsc --noEmit` must pass.
- `npm run lint` (eslint) clean for files you touched.
- `npm run dev` runs on `0.0.0.0` (mobile testing on LAN).
