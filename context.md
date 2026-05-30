# MathPro — Project Context

## What MathPro Is

MathPro is a Bengali-first online learning platform (LMS) targeting **JSC, SSC, and HSC students in Bangladesh**. The product sells structured math courses taught by local teachers. Every design and copy decision is optimised for this audience — teenage students on mobile phones, often on slower connections, who need to feel confident and motivated to enrol.

---

## Audience

| Signal | Detail |
|---|---|
| **Age** | 13–18 (JSC → HSC) |
| **Language** | Bengali primary, English secondary |
| **Device** | Mobile-first; most traffic on Android |
| **Motivation** | Board exam prep, fear of math, peer competition |
| **Trust triggers** | Enrolled count, teacher credibility, refund guarantee, peer testimonials |

All CTAs, labels, badges, and status text must be written in Bengali. English is acceptable only for technical UI chrome (e.g., form field placeholders, nav icons).

Copy should speak to students as juniors, not seniors. Prefer friendly informal wording such as **"তুমি"**, **"দেখো"**, **"কেনো"**, **"নাও"**, and **"করো"**. Avoid respectful/formal wording such as **"আপনি"**, **"দেখুন"**, **"কিনুন"**, **"নিন"**, and **"করুন"** in student-facing marketing UI.

---

## Product Terminology

- Public-facing marketing and UI copy must use **"Combo" / "কোর্স Combo"** for multi-course offers.
- Avoid using **"Bundle"** in user-facing headings, badges, CTAs, and empty states for the `/combos` experience.
- Backend/API/internal types can remain `bundle` where needed for compatibility, but displayed text must stay combo-first.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16** (App Router) — breaking changes vs older versions; always read `node_modules/next/dist/docs/` before writing router code |
| Styling | **Tailwind CSS v4** — canonical gradient class is `bg-linear-to-{dir}`, NOT `bg-gradient-to-{dir}` |
| UI primitives | shadcn/ui (via `components.json`) |
| Fonts | **Anek Bangla** (default sans + heading + Bengali), Geist Mono (code), Manrope (English accent) |
| Animation | Framer Motion |
| React | 19.2 |

---

## Design Tokens

All tokens are defined as CSS custom properties in `src/app/globals.css` and aliased into Tailwind's `@theme inline` block. **Never use raw hex or oklch values in JSX.** Always use the token class name.

### Colour Palette

#### Brand

| Token | Class | Role |
|---|---|---|
| `--primary` | `text-primary` / `bg-primary` | Emerald — main brand colour, CTAs, active states |
| `--teal` | `text-teal` / `bg-teal` | Secondary cool accent, gradients |
| `--accent` | `text-accent` / `bg-accent` | Vivid orange — call-to-action highlights |
| `--secondary` | `text-secondary-foreground` / `bg-secondary` | Warm amber tint |

#### Semantic (LMS)

| Token | Class | Use |
|---|---|---|
| `--success` | `text-success` / `bg-success` | Enrolled / live / correct answer |
| `--warning` | `text-warning` / `bg-warning` | Prebooking / deadline / caution |
| `--info` | `text-info` / `bg-info` | Informational badges |
| `--destructive` | `text-destructive` | Errors, delete actions |

#### Surface

| Token | Class | Use |
|---|---|---|
| `--background` | `bg-background` | Page background |
| `--card` | `bg-card` | Card / sidebar / modal surfaces |
| `--muted` | `bg-muted` | Subtle fill (hover, disabled) |
| `--border` | `border-border` | All borders |
| `--muted-foreground` | `text-muted-foreground` | Secondary body text |
| `--section-a` / `--section-b` | `bg-section-a` / `bg-section-b` | Alternating zebra-stripe section backgrounds |

#### Forbidden patterns

- `text-darkHeading`, `text-paragraph` — legacy tokens removed from the system
- `bg-purple`, `bg-[#…]`, `text-[#…]` — hardcoded colours
- `bg-gradient-to-*` — Tailwind v4 dropped this; use `bg-linear-to-*`
- `top-[68px]` — use the spacing scale (`top-17`) unless truly arbitrary

### Typography

- **Heading scale:** `text-3xl` → `text-[2.6rem]` → `text-5xl` (mobile → tablet → desktop)
- **Body:** `text-base` / `text-lg` / `text-muted-foreground` for secondary
- **Font weight:** `font-bold` / `font-extrabold` for prices and hero titles; `font-semibold` for section headings; `font-medium` for UI labels
- **Line height:** `leading-tight` / `leading-snug` on large headings
- **Bengali numerals:** always convert via `englishToBanglaNumbers()` helper before rendering counts or days

### Border Radius

Scaled off `--radius: 0.5rem`:

| Token | Class | Typical use |
|---|---|---|
| `--radius-sm` | `rounded-sm` | Tags, small chips |
| `--radius-lg` | `rounded-lg` | Input fields, small cards |
| `--radius-xl` | `rounded-xl` | Medium cards |
| `--radius-2xl` | `rounded-2xl` | Sidebar cards, modals |
| `--radius-3xl` | `rounded-3xl` | Hero images, featured cards |

---

## Visual Aesthetics

### Core principles

1. **Premium but accessible** — feels modern (glassmorphism, blur, shadows) but loads fast and reads clearly on a small screen.
2. **Trust-first** — enrolled counts, refund guarantee, teacher photos, live pulse dots all appear near the buy CTA.
3. **Emerald as hero** — `--primary` (emerald) is the dominant hue. Every active state, highlight, or progress indicator uses it.
4. **Dark mode is first-class** — all tokens have dark overrides. Never hard-code a colour that breaks on dark backgrounds.

### Recurring visual patterns

| Pattern | Implementation |
|---|---|
| Glassmorphism panels | `backdrop-blur-md bg-background/90` or `bg-card/80` |
| Gradient CTAs | `bg-linear-to-r from-primary to-primary/85` |
| Gradient backgrounds | `bg-linear-to-br from-primary/20 to-teal/20` |
| Active tab indicator | `border-b-2 border-primary bg-primary/8` + small `rounded-full bg-primary` dot at bottom center |
| Status badge — live | green pulse dot `animate-pulse` + "ভর্তি চলছে" in `text-success bg-success/15 border-success/40` |
| Status badge — prebook | clock icon + "প্রিবুকিং চলছে" in `text-warning bg-warning/15 border-warning/40` |
| Pill feature cards | `bg-primary/5 border border-primary/15 rounded-lg` with a filled checkmark icon in `text-primary` |
| Savings badge | `bg-warning/15 text-warning border border-warning/30 rounded-full` — shows `X% ছাড়` |
| Shadow depth | `shadow-xl` on sticky sidebar cards; `shadow-2xl` on hero/banner elements |
| Subtle glow | `blur-3xl` coloured `div`s as absolute decorative background elements |

---

## Page Architecture — `/courses/[id]`

The redesigned course detail page is the flagship UX. Key layout decisions:

```
Mobile (< lg)                 Desktop (≥ lg)
─────────────────────         ───────────────────────────────
Navbar                        Navbar
CourseHeader (title+badges)   ┌─ Left col (main) ──┬─ Right col (sidebar) ─┐
Short description             │ CourseHeader        │ Sticky purchase card  │
Sticky tab strip              │ Short description   │  - Thumbnail          │
  [স্টাডি প্ল্যান]             │ Sticky tabs         │  - Price + savings    │
  [ইন্সট্রাক্টর]               │ Tab content         │  - Social proof       │
  [কোর্স সম্পর্কে]             │                     │  - Buy button         │
Tab content                   │                     │  - Trust strip        │
pb-24 clearance              └─────────────────────┴───────────────────────┘
─────────────────────
Fixed bottom buy bar (z-50)
  Price | "এখনই ভর্তি হও"
```

### Sticky behaviours

- **Navbar:** `top-0 z-50`
- **Tab strip:** `sticky top-17 z-30 bg-background/90 backdrop-blur-md` — follows scroll below the navbar
- **Sidebar card:** `sticky top-20` — desktop only, floats alongside scrolling content
- **Mobile buy bar:** `fixed bottom-0 left-0 right-0 z-50 lg:hidden` — always visible; main content has `pb-24 lg:pb-0` to clear it

### Tab content placement

| Tab | Content |
|---|---|
| স্টাডি প্ল্যান | Curriculum / module list |
| ইন্সট্রাক্টর | Teacher profile |
| কোর্স সম্পর্কে | "এই কোর্সে তুমি পাচ্ছো" pill grid → description → testimonials → FAQs |

The "what you get" (`you_get`) feature list lives inside the "কোর্স সম্পর্কে" tab, **not** the sidebar — keeps the purchase card focused on conversion.

---

## Page Architecture — `/combos`

The `/combos` page is a conversion page for multi-course offers, not a plain product grid.

- Use the same ambient background system as `/courses`: `bg-section-a` / `bg-section-b`, fixed `primary`/`teal` glows, subtle graph-paper texture, and large math motifs.
- The first viewport must explain what a **Combo** is, why it saves money, and who it helps.
- Combo cards must show every included course directly on the card. Do not hide course lists behind an inner scrollbar or "+ more" summary.
- Keep trust/value signals near the grid: total course coverage, savings, discount, live/recorded access, and exam-focused planning.
- Public CTAs should use Bengali action language such as "Combo বিস্তারিত দেখো", "Combo গুলো দেখো", and "সকল কোর্স দেখো".
- The page should rely on the layout-level navbar. Do not render a second page-level `Nav`.

---

## Component Conventions

### File structure

```
src/
  app/                      # Next.js App Router pages
  components/               # Global shared UI
  features/
    course-details/
      _lib/                 # Types, utils, hooks
      components/           # Feature-scoped components
    courses-page/
      components/
  hooks/                    # Custom React hooks
  helpers/                  # Pure utility functions
```

### Key rules

- **No hardcoded colours.** Token classes only.
- **No `overflow-x-auto` on tab strips** that have a fixed, small number of tabs — just `flex items-center gap-1`.
- **Aspect ratio for media:** use `aspect-video` on thumbnail containers.
- **Gradient syntax:** `bg-linear-to-{dir}` (Tailwind v4).
- **Arbitrary spacing:** prefer scale values (`top-17`, `py-3.5`) over bracket notation unless truly one-off.
- **`React.ReactNode`** for icon prop types in tab/menu arrays.
- **Bengali numbers:** run through `englishToBanglaNumbers()` before rendering.

---

## Goals

1. **Convert** — every screen state should guide the student toward clicking "এখনই ভর্তি হও". Trust signals, scarcity cues (deadline countdown, enrolled count), and a persistent buy bar all serve this.
2. **Inspire confidence** — the design must feel as premium as apps students see globally (YouTube, Duolingo) so they trust MathPro with their exam prep.
3. **Perform on mobile** — no heavy images without fallbacks, no layout shifts, sticky elements use `backdrop-blur` not opaque paint.
4. **Bengali-first identity** — the product speaks the student's language, literally and culturally.
5. **Dark mode parity** — every component must look intentional in both light and dark themes.
