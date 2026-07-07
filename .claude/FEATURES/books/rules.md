# Feature: books — Rules & Guardrails

Inherits all of `invariants.md` and `conventions.md`. Invariants always win.

## CheckoutModal reuse

- `type="book"` is a checkout **variant**, not a new component. Any new book-purchase field
  or validation belongs in `CheckoutModal.tsx` gated on `isBookCheckout`/`showShippingForm`,
  not a forked modal.
- Do not fix the pre-existing "Bundle ক্রয়..." copy bug (should say Combo) on the
  `bundle`/`course` branches while touching this file for book work — that's a separate,
  known issue outside this feature's scope.

## Data

- `book` may appear in API/types as-is; no Combo-style rename applies to books (client and
  backend both say "বই"/"book").
- Never trust a client-supplied book price — `/user/payment/initiate-for-book/:id` always
  re-derives price server-side; the frontend only displays it.
- Shipping fields (`name`, `phone`, `address`) are mandatory for a book purchase — don't
  make them optional even if a future feature wants a "digital book" concept; that would be
  a new item type, not a relaxation of this one.

## Coupons

- Book coupons go through the same `coupon_code` flow as course/bundle, scoped via
  `bookId` in `couponService.ts`/`CouponInput.tsx`. A coupon can be scoped to specific books
  the same way it's scoped to specific courses/bundles (admin-managed, out of this repo).

## Order history

- `book_purchases` in `usePaymentHistory` is **standalone purchases only**
  (`course_id`/`bundle_id` both null server-side). Don't merge course/bundle add-on book
  rows into it — those already surface through their parent course/bundle transaction.
