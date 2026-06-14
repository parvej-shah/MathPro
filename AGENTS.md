<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. They sit above the project
contract and are reinforced as enforced laws in `.claude/invariants.md`.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.** (See `.claude/invariants.md` § Scope Control.)

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require
constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due
to overcomplication, and clarifying questions come before implementation rather than after
mistakes.

---

# MathPro Frontend — Operating Contract

This file is the operating contract for any agent working in this repo. It governs
**behavior, routing, and execution order**. It does not restate facts that live in the
files below — it points at them. Read the linked file before acting in its domain.

## Document map

| File | Authority | Read when |
|---|---|---|
| `.claude/invariants.md` | **Non-negotiable.** Global laws. Never overrideable, even on explicit request without the user acknowledging the override. | Always — before any code change. |
| `.claude/conventions.md` | Naming, API patterns, coding standards. | Before writing or editing any file. |
| `.claude/memory.md` | Append-only execution log. Continuity across sessions. | Start of session; append at end. |
| `.claude/FEATURES/<feature>/purpose.md` | Domain ownership + intent for that feature. | Before touching anything under that feature's directory. |
| `.claude/FEATURES/<feature>/rules.md` | Feature-level constraints + guardrails. | Same. |
| `context.md` | Long-form product/design reference (audience, tokens, page architecture). | When you need the *why* behind a design rule. Invariants/conventions are the *enforced* subset. |

`invariants.md` > `conventions.md` > feature `rules.md` > `context.md`.
If a feature rule conflicts with an invariant, the invariant wins and you stop and flag it.

## Behavior

1. **Read before writing.** This is Next.js 16 + Tailwind v4 + React 19 — APIs differ from
   training data. When touching App Router, Tailwind, or React internals, consult
   `node_modules/next/dist/docs/` (per the rules at the top of this file) before writing.
2. **Scope discipline.** You make the change asked for and the changes that change *requires*.
   You do not refactor adjacent code because it "looks cleaner." A locally-correct change
   that alters global behavior is a defect. See `invariants.md` § Scope Control.
3. **Bengali-first, student-facing.** All user-facing copy follows `invariants.md` § Copy.
4. **Tokens, never raw values.** All colors/spacing through the token system. See
   `conventions.md` § Styling.
5. **Ask, don't assume, on irreversible or cross-cutting moves** — deleting files, renaming
   public exports, changing API contracts, migrating a shared pattern.

## Routing — where work goes

| Touching… | Owner doc to read first |
|---|---|
| `src/features/course-details/**` | `FEATURES/course-details/` |
| `src/features/courses-page/**` | `FEATURES/courses-page/` |
| `src/app/**` (routes, layouts) | `conventions.md` § Routing + the relevant feature |
| `src/services/**`, `src/lib/api.ts`, `src/hooks/use*` | `conventions.md` § Data & API |
| `src/Contexts/**`, `middleware.ts` | `conventions.md` § Auth & State |
| styling / tokens anywhere | `invariants.md` § Styling + `context.md` design tokens |

## Execution order for a typical task

1. Read `invariants.md` + `conventions.md` (cheap, always).
2. Identify the feature; read its `purpose.md` + `rules.md`.
3. Make the minimal change. Stay in scope.
4. `npx tsc --noEmit` clean. `npm run lint` clean for touched files.
5. Append a one-line entry to `memory.md` (what changed, why, scope).
