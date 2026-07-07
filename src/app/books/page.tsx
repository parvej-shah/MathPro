"use client";

import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BookOpen, HelpCircle } from "lucide-react";
import { BACKEND_URL } from "@/api.config";
import SEO from "@/components/SEO";
import type { AttachedBook } from "@/features/course-details/_lib/types";

interface BooksResponse {
  success: boolean;
  data: AttachedBook[];
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

function BooksLoading() {
  return (
    <div className="font-sans overflow-x-hidden">
      <main className="relative min-h-screen bg-section-a pt-20">
        <section className="relative z-10 px-5 py-14 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-360">
            <div className="mb-8 h-10 w-64 animate-pulse rounded-xl bg-muted/70" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item} className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
                  <div className="aspect-3/4 animate-pulse bg-linear-to-br from-primary/30 to-teal/30" />
                  <div className="space-y-3 p-4">
                    <div className="h-5 w-full animate-pulse rounded-lg bg-muted/70" />
                    <div className="h-6 w-24 animate-pulse rounded-lg bg-muted/70" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function BooksPage() {
  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["books"],
    queryFn: async (): Promise<AttachedBook[]> => {
      const response = await axios.get<BooksResponse>(`${BACKEND_URL}/user/book`);
      if (!response.data.success) {
        throw new Error("Failed to fetch books");
      }
      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  if (isLoading) return <BooksLoading />;

  if (isError) {
    return (
      <div className="font-sans overflow-x-hidden">
        <SEO title="বই - MathPro" description="MathPro বই সমূহ দেখো।" />
        <main className="min-h-screen bg-section-a pt-20">
          <div className="flex min-h-[70vh] items-center justify-center px-6 text-center">
            <div className="max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">
              <HelpCircle className="mx-auto mb-4 size-12 text-destructive" />
              <p className="mb-5 text-lg font-bold text-foreground">বই লোড করা যায়নি</p>
              <button
                onClick={() => refetch()}
                className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                আবার চেষ্টা করো
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans overflow-x-hidden">
      <SEO
        title="বই - MathPro"
        description="MathPro থেকে সরাসরি বই কিনো, কোনো কোর্সে ভর্তি হওয়া ছাড়াই।"
      />
      <Toaster position="top-right" />

      <main className="relative min-h-screen bg-section-a pt-20">
        <section className="relative z-10 px-5 py-14 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-360">
            <div className="mb-8 max-w-3xl">
              <p className="mb-2 text-sm font-extrabold text-primary">বই সমূহ</p>
              <h1 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                কোর্স ছাড়াই বই কিনো
              </h1>
              <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
                পছন্দের বই বেছে নাও, সরাসরি অর্ডার করো — কোনো কোর্সে ভর্তি হওয়ার প্রয়োজন নেই।
              </p>
            </div>

            {books.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {books.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="group overflow-hidden rounded-3xl border border-border bg-card shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <div className="relative aspect-3/4 w-full overflow-hidden bg-muted">
                      {book.image_url ? (
                        <Image
                          src={book.image_url}
                          alt={book.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <BookOpen className="size-12 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="line-clamp-2 font-bold leading-snug text-foreground">
                        {book.title}
                      </p>
                      {typeof book.price === "number" && (
                        <p className="text-lg font-extrabold text-primary">
                          {formatPrice(book.price)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-xl">
                <BookOpen className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                <h3 className="text-2xl font-extrabold text-foreground">কোনো বই পাওয়া যায়নি</h3>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  শীঘ্রই নতুন বই যোগ করা হবে।
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
