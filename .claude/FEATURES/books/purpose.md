# Feature: books — Purpose

## Domain

Owns the standalone book purchase surface: `src/app/books/page.tsx` (catalogue) and
`src/app/books/[id]/page.tsx` (detail + buy). Lets a student buy a physical book directly,
with no course/combo enrollment required — a separate purchase path from the existing
"include books" add-on inside course/combo checkout (`src/app/courses/[id]/page.tsx`,
`src/app/combos/[id]/page.tsx`), which remains unchanged.

## What lives here

- **Catalogue/detail pages:** `src/app/books/page.tsx`, `src/app/books/[id]/page.tsx` —
  fetch `GET /user/book` / `GET /user/book/:id`.
- **Purchase:** `src/hooks/useBookPayment.ts` (`buyBook`) → `POST
  /user/payment/initiate-for-book/:id`. Shipping is **mandatory** (unlike the optional
  add-on flow) since the book itself is the purchase.
- **Checkout UI:** reuses `src/components/CheckoutModal.tsx` with a third `type="book"`
  variant — skips the "include books?" checkbox, always shows the shipping sub-form, skips
  school/class fields (irrelevant for a book-only purchase).
- **Coupons:** reuses `src/components/CouponInput.tsx` / `src/services/couponService.ts`
  with a new `bookId` prop/param, alongside the existing `courseId`/`bundleId`.
- **Order history:** standalone book orders surface in `src/hooks/usePaymentHistory.ts`
  (`book_purchases`, `total_book_spent`/`total_books_purchased` in `summary`) and render via
  `src/components/PaymentBooks.tsx` on `/billing`, plus in `PaymentTransactions.tsx` /
  `PaymentSummary.tsx` / `InvoiceDocument.tsx`.

## Relationship to course/combo book add-on

The pre-existing "buy a course/combo and optionally add its attached book(s)" flow
(`AttachedBook`/`BookSelection` types in `src/features/course-details/_lib/types.ts`,
`useBundlePayment.ts`, `useCourseDetails.ts`) is untouched by this feature. A book bought as
an add-on still surfaces via its parent course/bundle's history entry, not via
`book_purchases` (that array is standalone-only, to avoid double counting).
