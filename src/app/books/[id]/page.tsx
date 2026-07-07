"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { Toaster } from "react-hot-toast";
import { ArrowRight, BookOpen, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { BACKEND_URL } from "@/api.config";
import SEO from "@/components/SEO";
import CheckoutModal from "@/components/CheckoutModal";
import CouponInput from "@/components/CouponInput";
import type { CouponApplyResponse } from "@/services/couponService";
import type { BookSelection } from "@/features/course-details/_lib/types";
import { isLoggedIn } from "@/helpers";
import { useBookPayment } from "@/hooks/useBookPayment";

interface Book {
  id: number;
  title: string;
  image_url?: string | null;
  description?: string | null;
  class_levels?: string[];
  tags?: string[];
  price: number;
  is_active: boolean;
}

interface BookResponse {
  success: boolean;
  data: Book[] | Book;
}

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBanglaNumber(value: number | string) {
  return value.toString().replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}

function formatPrice(price: number) {
  return `৳ ${toBanglaNumber(
    new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(price),
  )}`;
}

function BookDetailsSkeleton() {
  return (
    <div className="font-sans overflow-x-hidden">
      <main className="relative min-h-screen bg-section-a pt-20">
        <section className="relative z-10 px-5 py-14 sm:px-6 lg:px-12">
          <div className="mx-auto grid max-w-360 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="aspect-3/4 w-full max-w-md animate-pulse rounded-3xl bg-linear-to-br from-primary/30 to-teal/30" />
            <div className="space-y-4">
              <div className="h-10 w-full max-w-lg animate-pulse rounded-xl bg-muted/70" />
              <div className="h-6 w-32 animate-pulse rounded-lg bg-muted/70" />
              <div className="h-24 w-full animate-pulse rounded-xl bg-muted/70" />
              <div className="h-12 w-48 animate-pulse rounded-xl bg-primary/30" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function BookDetailsPage() {
  const params = useParams<{ id: string }>();
  const bookId = params?.id;
  const { buyBook } = useBookPayment();

  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [discountInfo, setDiscountInfo] = useState<CouponApplyResponse["data"] | null>(null);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  const {
    data: book,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["book-details", bookId],
    enabled: Boolean(bookId),
    queryFn: async (): Promise<Book> => {
      const response = await axios.get<BookResponse>(`${BACKEND_URL}/user/book/${bookId}`);
      if (!response.data.success) {
        throw new Error("Failed to fetch book details");
      }
      const payload = response.data.data;
      const parsed = Array.isArray(payload) ? payload[0] : payload;
      if (!parsed) {
        throw new Error("Book not found");
      }
      return parsed;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  useEffect(() => {
    if (isLoggedIn()) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken: { id?: string | number; user_id?: string | number; sub?: string | number } = jwtDecode(token);
          const id = decodedToken.id || decodedToken.user_id || decodedToken.sub;
          if (id) {
            setUserId(parseInt(id.toString()));
          }
        } catch {
          // Token decode failed, userId remains unset
        }
      }
    }
  }, []);

  const handleBuyBook = () => {
    if (isLoggedIn() === false) {
      const currentDomain = window.location.href;
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentDomain)}`;
    } else {
      setOpenCheckoutModal(true);
    }
  };

  const handleProceedToPayment = (bookSelection: BookSelection | null) => {
    if (!book || !bookSelection?.shipping) return;
    buyBook(book.id, bookSelection.shipping, appliedCouponCode);
  };

  const handleCouponApplied = (discountData: CouponApplyResponse["data"]) => {
    setDiscountInfo(discountData);
    if (discountData?.coupon?.code) {
      setAppliedCouponCode(discountData.coupon.code);
    }
  };

  const handleCouponRemoved = () => {
    setAppliedCouponCode(null);
    setDiscountInfo(null);
  };

  if (isLoading) {
    return <BookDetailsSkeleton />;
  }

  if (isError || !book) {
    return (
      <div className="font-sans overflow-x-hidden">
        <SEO title="বই পাওয়া যায়নি - MathPro" description="MathPro বই বিস্তারিত।" />
        <main className="relative min-h-screen bg-section-a pt-20">
          <div className="mx-auto flex min-h-[70vh] max-w-360 items-center justify-center px-5 text-center">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-xl">
              <p className="text-2xl font-extrabold text-foreground">বইটি খুঁজে পাওয়া যায়নি</p>
              <p className="mt-3 text-muted-foreground">এই বইটি এখন পাওয়া যাচ্ছে না।</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => refetch()}
                  className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground"
                >
                  আবার চেষ্টা করো
                </button>
                <Link
                  href="/books"
                  className="rounded-xl border border-border bg-background px-5 py-3 font-bold text-foreground"
                >
                  সব বই দেখো
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const displayPrice = discountInfo ? discountInfo.final_price : book.price;

  return (
    <div className="font-sans overflow-x-hidden">
      <SEO
        title={`${book.title} - MathPro`}
        description={book.description || `${book.title} বইটি MathPro থেকে সরাসরি কিনো।`}
        path={`/books/${book.id}`}
        image={book.image_url || undefined}
      />
      <Toaster />

      <CheckoutModal
        isOpen={openCheckoutModal}
        onClose={() => setOpenCheckoutModal(false)}
        onProceed={handleProceedToPayment}
        type="book"
        title={book.title}
        price={displayPrice}
      />

      <main className="relative min-h-screen bg-section-a pt-20">
        <section className="relative z-10 px-5 py-14 sm:px-6 lg:px-12">
          <div className="mx-auto grid max-w-360 items-start gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative mx-auto aspect-3/4 w-full max-w-md overflow-hidden rounded-3xl border border-border bg-muted shadow-xl">
              {book.image_url ? (
                <Image src={book.image_url} alt={book.title} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <BookOpen className="size-16 text-muted-foreground/40" />
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
              <h1 className="text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
                {book.title}
              </h1>

              {book.description && (
                <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground">
                  {book.description}
                </p>
              )}

              {book.class_levels && book.class_levels.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {book.class_levels.map((level) => (
                    <span
                      key={level}
                      className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 rounded-2xl border border-border bg-background/85 p-4">
                <div className="flex items-end gap-x-3">
                  <p className="text-4xl font-extrabold tracking-tight text-foreground">
                    {formatPrice(displayPrice)}
                  </p>
                  {discountInfo && (
                    <p className="pb-1 text-lg font-extrabold text-destructive line-through decoration-2">
                      {formatPrice(book.price)}
                    </p>
                  )}
                </div>
                {discountInfo && (
                  <p className="mt-2 text-sm font-semibold text-success">
                    কুপনে সাশ্রয় ৳{discountInfo.discount_amount}
                  </p>
                )}
              </div>

              <div className="mt-4">
                <CouponInput
                  bookId={book.id}
                  originalPrice={book.price}
                  userId={userId}
                  onCouponApplied={handleCouponApplied}
                  onCouponRemoved={handleCouponRemoved}
                  appliedCouponCode={appliedCouponCode}
                />
              </div>

              <button
                onClick={handleBuyBook}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-teal px-6 py-3.5 text-base font-extrabold text-primary-foreground shadow-xl shadow-primary/20"
              >
                <ShoppingBag className="size-5" />
                বইটি কিনো
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
