# Course Player — Behavior Inventory (refactor contract)

> Dev-only notes. This captures the exact behavior of the original 2840-line
> `page.tsx` before the phased refactor. Each extracted component/hook must preserve
> these contracts. Baseline: `npx tsc --noEmit` passes clean (exit 0).

## Route & params
- Path: `src/app/course/[courseId]/[chapterid]/[moduleid]/page.tsx`
- Params via `useParams()`: `courseId`, `chapterid` → `chapterId`, `moduleid` → `moduleId`
  (all `string | undefined`).
- Client component (`'use client'`).

## Module categories (the switch surface)
`activeModule.data.category` ∈ `VIDEO | PDF | TEXT | QUIZ | ASSIGNMENT | CODE`.
- **VIDEO**: YouTube (`data.youtube_id` via `ReactYoutubePlayer`) or BunnyCDN iframe.
- **PDF**: iframe, `w-full h-[70vh]` / responsive min-heights.
- **TEXT**: `activeModule.description` via `SafeHtmlRenderer`; empty → `<ModuleUpcoming/>`.
- **QUIZ**: `data.quiz[]`, MUI Radio options, timer, submit/retake. Answers encrypted
  (`decryptString(quiz.answer || quiz.correct_answer, NEXT_PUBLIC_SECRET_KEY_QUIZ)`).
- **ASSIGNMENT**: github/youtube link form + evaluation status.
- **CODE**: Codeforces (`data.is_cf`, `data.cf_name`) handle verify.

## Description rendering — NOT a duplicate (plan correction)
Three `SafeHtmlRenderer` usages exist and are all distinct:
- L2029: quiz **option label** content (per-option).
- L2097: TEXT-category description (only when category === "TEXT" and non-empty).
- L2112: non-TEXT description (only when category !== "TEXT").
L2097 and L2112 are mutually exclusive by category guard. **No true duplicate render —
do NOT remove either.** (Phase 1.2 in the plan is therefore a no-op; document & skip.)

## API calls (endpoints, all Bearer token from localStorage "token")
| Fn | Method | Endpoint |
|----|--------|----------|
| fetchCourse | GET | `/user/course/getfull/{courseId}` |
| submitProgress | POST | `/user/module/addProgress/{module_id}?points={score}&type={category}` then re-GET getfull |
| fetchEvalutedAssignment | GET | `/user/assignment/view/{moduleId}` |
| submitAssignment (new) | POST | `/user/assignment/submit/{moduleId}` |
| submitAssignment (edit) | PUT | `/user/assignment/edit/{moduleId}` (when assignmentEvaluted.length>0) |
| checkCFStatus | POST | `/user/module/checkCfStatus` `{problem, handle}` |
| getCFHandle | GET | `/user/module/getCfHandle` → `res.data.data[0].cf_handle` |
| fetchDiscussions | GET | `/user/discussion/list/{activeModule.id}` |
| submitNewDiscussion | POST | `/user/discussion/create/{activeModule.id}` `{content}` |
| fetchSubdiscussions | GET | `/user/subDiscussion/list/{id}` |
| postSubdiscussion | POST | `/user/subDiscussion/create/{id}` `{content}` |
| deleteDiscussion | DELETE | `/user/subDiscussion/delete/{activeCommentDeletionData.id}` (only deleteOption==="subdiscussion"; "discussion" branch is a no-op) |
| (streak) updateStreakAsync(courseId) | — | via `useUpdateStreak` after progress |

## localStorage keys
- `quiz_timer_{moduleId}` — JSON `{startTime, totalTime, submitted, quizScore, quizAnswer, quizVerdict}`.
  60s per question. On return: if `submitted` → show results (restore score/answers/verdict),
  no timer; else compute remaining, resume or expire.
- `lastStreakNotificationDate` — toDateString; throttles streak toasts to once/day.
- (module access) `saveLastAccessedModule` / `selectOptimalModule` use their own keys in
  `@/utils/moduleAccessUtils` (7-day TTL).

## Effects
1. `[activeModule?.id, courseData?.isTaken, courseData?.maxModuleSerialProgress]`:
   reset quiz answer/verdict/showAnswer; if `activeModule?.id` → `fetchDiscussions()`;
   auto-`submitProgress` for VIDEO/PDF/TEXT when `is_free || isTaken`.
2. `[courseId, chapterId, moduleId]`: if all present → `fetchCourse()`.
3. `[activeModule]`: dev logging; if CODE+is_cf → `getCFHandle()`; `activeModuleRef.scrollIntoView`.
4. `[activeModule?.id, activeModule?.data?.category]`: QUIZ → `initializeQuizTimer`, else `clearQuizTimer`; cleanup → `clearQuizTimer`.
5. `[timerActive, activeModule?.id]`: 1s countdown interval; at 0 → clear + `handleTimerExpiry` (auto-submit).

## Navigation rules (CRITICAL — preserve exactly)
Access gate everywhere: a module is openable iff `elem.is_free || courseData?.isTaken`.
`findObjectBySerial(courseData, serial)` locates module by `serial` across chapters.

### Previous button
- `prev = findObjectBySerial(courseData, activeModule.serial - 1)`.
- If `prev`: `setActiveModule(prev)` + `saveLastAccessedModule` (fire-and-forget). No URL push. No gate check.

### Next button
- `next = findObjectBySerial(courseData, activeModule.serial + 1)`.
- Guard: only if `next && (next.is_free || isTaken)`.
- `saveLastAccessedModule` (fire-and-forget), then per category:
  - ASSIGNMENT (isTaken): `fetchEvalutedAssignment(next.id)` + `setActiveModule`.
  - CODE (isTaken): `setActiveModule`.
  - VIDEO: `setActiveModule` + `submitProgress(next.id, next.score)`.
  - QUIZ (isTaken): `setActiveModule`.
  - PDF: `setActiveModule` + `submitProgress`.
  - TEXT: `setActiveModule` + `submitProgress`.
- Note: Next does NOT push URL (only sets state); Prev also only sets state.

### Sidebar module click (differs from Next: uses router.push, NOT setActiveModule)
Gate: `elem.is_free || isTaken` (chapter-level `elem.is_free`).
- ASSIGNMENT (isTaken): `fetchEvalutedAssignment(module.id)` + `router.push(/course/{courseId}/{chapter_id}/{id})`.
- CODE (isTaken): `router.push`.
- VIDEO: `submitProgress` + `router.push`.
- QUIZ (isTaken): `router.push`.
- PDF: `submitProgress` + `router.push`.
- TEXT: `submitProgress` + `router.push`.
- `saveLastAccessedModule` fire-and-forget before the branch.
> Sidebar click → router.push → effect #2 re-runs fetchCourse → **double fetch**. This is the
> bug Phase 1.3 fixes: unify on setActiveModule + router.replace (shallow), fetch only when
> courseId changes.

## Auto-progress quirks
- On `fetchCourse`, if `maxModuleSerialProgress === 0`: auto-`submitProgress` first module.
- `submitProgress` re-fetches full course after success and flips `user.scoreTrigger`.

## Chapter gating UI
- Only chapters with `elem.is_live` render in the sidebar.
- Free/taken chapters: purple `#B153E0` accents; locked: white/`#565656` greyed.
- `isActiveChapter(chapter)`: true if any module.id === activeModule.id (used for accordion defaultChecked).
- `shouldShowUnlockChapterButton()`: chapter `allowed_unlock === true`.

## Known smells to fix (Phase 1)
- `key={Math.random()}` at L1237 (discussion modal list), L2275 (chapter map), L2528 (module map).
- `nonActiveModuleRef` assigned to every non-active module (shared ref, harmless but pointless).
- Compiler button `fixed top-80 -left-2` → off-screen on mobile (Phase 4).
- Sidebar `h-[100vh] overflow-y-scroll` nested scroll (Phase 4).
