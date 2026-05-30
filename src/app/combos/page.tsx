"use client";

import { useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgePercent,
  BookOpenCheck,
  CheckCircle2,
  CircleDollarSign,
  Gift,
  HelpCircle,
  Layers3,
  Sparkles,
} from "lucide-react";
import { BACKEND_URL } from "@/api.config";
import SEO from "@/components/SEO";
import Footer from "@/components/footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { siteConfig } from "@/config/site.config";

interface BundleCourse {
  id: number;
  title: string;
  price: number;
  url: string;
}

interface Bundle {
  id: number;
  title: string;
  price: number;
  url: string;
  courses: BundleCourse[];
  course_count: number;
}

interface BundlesResponse {
  success: boolean;
  data: Bundle[];
}

const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBanglaNumber(value: number | string) {
  return value.toString().replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}

function formatPrice(price: number) {
  return `৳ ${toBanglaNumber(new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(price))}`;
}

function calculateTotalOriginalPrice(courses: BundleCourse[]) {
  return courses.reduce((total, course) => total + Number(course.price || 0), 0);
}

function calculateDiscount(comboPrice: number, originalTotal: number) {
  if (!originalTotal || originalTotal <= comboPrice) return 0;
  return Math.round(((originalTotal - comboPrice) / originalTotal) * 100);
}

function ComboCard({ combo, featured }: { combo: Bundle; featured: boolean }) {
  const courses = combo.courses || [];
  const courseCount = combo.course_count || courses.length;
  const originalTotal = calculateTotalOriginalPrice(courses);
  const discount = calculateDiscount(combo.price, originalTotal);
  const savings = Math.max(originalTotal - combo.price, 0);

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        featured ? "border-primary/40 shadow-primary/10" : "border-border"
      }`}
    >
      {featured && (
        <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning/15 px-3 py-1 text-xs font-bold text-warning">
          <Sparkles className="size-3.5" />
          সবচেয়ে ভালো ভ্যালু
        </div>
      )}

      <div className="relative overflow-hidden bg-linear-to-br from-primary via-primary to-teal px-5 pb-6 pt-16 sm:px-6">
        <div className="absolute -right-10 -top-10 size-36 rounded-full bg-background/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-background/25" />

        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-primary-foreground/25 bg-primary-foreground/15 text-primary-foreground backdrop-blur-md">
              <Gift className="size-7" />
            </div>
            <p className="text-sm font-semibold text-primary-foreground/80">
              {toBanglaNumber(courseCount)}টি কোর্স একসাথে
            </p>
            <h3 className="mt-2 text-2xl font-extrabold leading-snug text-primary-foreground">
              {combo.title}
            </h3>
          </div>

          {discount > 0 && (
            <div className="shrink-0 rounded-2xl border border-warning/30 bg-warning px-3 py-2 text-center text-warning-foreground shadow-lg">
              <span className="block text-xl font-extrabold leading-none">
                {toBanglaNumber(discount)}%
              </span>
              <span className="text-xs font-bold">ছাড়</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-5 rounded-2xl border border-primary/15 bg-primary/5 p-4">
          <p className="mb-3 text-sm font-bold text-foreground">
            এই Combo-তে যা পাচ্ছো
          </p>
          <div className="space-y-2.5">
            {courses.map((course) => (
              <div key={course.id} className="flex items-start gap-2.5 text-sm leading-snug">
                <BookOpenCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="font-medium text-muted-foreground">{course.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border bg-background/70 p-3">
            <p className="text-xs font-semibold text-muted-foreground">মোট কোর্স</p>
            <p className="mt-1 text-lg font-extrabold text-foreground">
              {toBanglaNumber(courseCount)}টি
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-3">
            <p className="text-xs font-semibold text-muted-foreground">তোমার সাশ্রয়</p>
            <p className="mt-1 text-lg font-extrabold text-success">
              {formatPrice(savings)}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="mb-4 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-3xl font-extrabold text-foreground">
              {formatPrice(combo.price)}
            </span>
            {originalTotal > combo.price && (
              <span className="pb-1 text-lg font-semibold text-muted-foreground line-through">
                {formatPrice(originalTotal)}
              </span>
            )}
          </div>

          <Link
            href={`/combos/${combo.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-teal px-5 py-3.5 text-base font-extrabold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30"
          >
            Combo বিস্তারিত দেখো
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function CombosLoading() {
  return (
    <div className="font-sans overflow-x-hidden">
      <SEO title="Course Combos - MathPro" description="MathPro কোর্স Combo লোড হচ্ছে।" />
      <main className="relative min-h-screen overflow-hidden bg-section-a pt-20">
        <div className="mx-auto w-[90%] max-w-360 px-5 pb-16 pt-10 sm:px-6 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="h-9 w-52 animate-pulse rounded-full border border-primary/20 bg-primary/10" />
              <div className="h-14 w-full max-w-[42rem] animate-pulse rounded-xl bg-muted/70" />
              <div className="h-14 w-[88%] max-w-[36rem] animate-pulse rounded-xl bg-muted/70" />
              <div className="h-5 w-[92%] max-w-[34rem] animate-pulse rounded-lg bg-muted/70" />
              <div className="h-5 w-[70%] max-w-[28rem] animate-pulse rounded-lg bg-muted/70" />
              <div className="mt-5 flex gap-3">
                <div className="h-12 w-44 animate-pulse rounded-xl bg-primary/30" />
                <div className="h-12 w-40 animate-pulse rounded-xl border border-border bg-card/70" />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card/80 p-5 shadow-xl">
              <div className="rounded-3xl bg-linear-to-br from-primary/10 to-teal/10 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-primary/30" />
                    <div className="h-8 w-72 animate-pulse rounded-lg bg-muted/70" />
                  </div>
                  <div className="size-14 animate-pulse rounded-2xl bg-primary/30" />
                </div>
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {[0, 1, 2].map((item) => (
                    <div key={item} className="rounded-2xl border border-border bg-background/70 p-4">
                      <div className="mb-3 h-6 w-6 animate-pulse rounded bg-primary/30" />
                      <div className="h-7 w-24 animate-pulse rounded-lg bg-muted/70" />
                      <div className="mt-2 h-4 w-20 animate-pulse rounded bg-muted/70" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 space-y-4">
            <div className="h-4 w-32 animate-pulse rounded bg-primary/30" />
            <div className="h-12 w-full max-w-[38rem] animate-pulse rounded-xl bg-muted/70" />
            <div className="h-5 w-full max-w-[28rem] animate-pulse rounded-lg bg-muted/70" />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
                <div className="h-40 animate-pulse bg-linear-to-br from-primary/35 to-teal/35" />
                <div className="space-y-4 p-5">
                  <div className="h-6 w-3/4 animate-pulse rounded-lg bg-muted/70" />
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-muted/70" />
                    <div className="h-4 w-[90%] animate-pulse rounded bg-muted/70" />
                    <div className="h-4 w-[82%] animate-pulse rounded bg-muted/70" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-14 animate-pulse rounded-xl bg-muted/70" />
                    <div className="h-14 animate-pulse rounded-xl bg-muted/70" />
                  </div>
                  <div className="h-12 animate-pulse rounded-xl bg-primary/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CombosPage() {
  const {
    data: combos = [],
    isLoading: loading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["combos"],
    queryFn: async (): Promise<Bundle[]> => {
      const response = await axios.get<BundlesResponse>(`${BACKEND_URL}/user/bundle`);

      if (!response.data.success) {
        throw new Error("Failed to fetch combos");
      }

      return response.data.data || [];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const pageStats = useMemo(() => {
    const totalCourses = combos.reduce(
      (total, combo) => total + (combo.course_count || combo.courses?.length || 0),
      0,
    );
    const totalSavings = combos.reduce((total, combo) => {
      const originalTotal = calculateTotalOriginalPrice(combo.courses || []);
      return total + Math.max(originalTotal - combo.price, 0);
    }, 0);
    const bestDiscount = combos.reduce((best, combo) => {
      const originalTotal = calculateTotalOriginalPrice(combo.courses || []);
      return Math.max(best, calculateDiscount(combo.price, originalTotal));
    }, 0);

    return { totalCourses, totalSavings, bestDiscount };
  }, [combos]);

  if (loading) return <CombosLoading />;

  if (isError) {
    return (
      <div className="font-sans overflow-x-hidden">
        <SEO title="Course Combos - MathPro" description="MathPro কোর্স Combo দেখো।" />
        <main className="min-h-screen bg-section-a pt-20">
          <div className="flex min-h-[70vh] items-center justify-center px-6 text-center">
            <div className="max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">
              <HelpCircle className="mx-auto mb-4 size-12 text-destructive" />
              <p className="mb-5 text-lg font-bold text-foreground">Combo লোড করা যায়নি</p>
              <button
                onClick={() => refetch()}
                className="rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                আবার চেষ্টা করো
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans overflow-x-hidden">
      <SEO
        title="Course Combos - MathPro"
        description="MathPro কোর্স Combo দিয়ে একসাথে একাধিক কোর্স নাও, বেশি সাশ্রয় করো এবং বোর্ড পরীক্ষার প্রস্তুতি আরও গুছিয়ে নাও।"
      />
      <Toaster position="top-right" />

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-primary/10 dark:bg-primary/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-125 h-125 rounded-full bg-primary/8 dark:bg-primary/12 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-100 h-100 rounded-full bg-primary/5 dark:bg-primary/10 blur-[100px]" />
      </div>
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none z-[39] hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(16, 185, 129, 0.06) 0%, transparent 65%)",
        }}
      />

      <div
        aria-hidden
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative min-h-screen overflow-hidden bg-section-a pt-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
          <div
            className="absolute top-32 -left-10 md:left-4 text-[10rem] md:text-[18rem] text-primary/10 font-serif font-black leading-none animate-motif-float"
            style={{ ["--motif-rot" as string]: "12deg", ["--motif-tx" as string]: "10px", ["--motif-ty" as string]: "-14px", ["--motif-dr" as string]: "2deg", animationDelay: "0s", animationDuration: "13s" }}
          >
            ∫
          </div>
          <div
            className="absolute top-[58%] -right-14 hidden text-[12rem] font-black leading-none text-primary/5 md:right-6 md:block md:text-[15rem] xl:right-16 font-serif animate-motif-float"
            style={{ ["--motif-rot" as string]: "-18deg", ["--motif-tx" as string]: "-8px", ["--motif-ty" as string]: "10px", ["--motif-dr" as string]: "-2deg", animationDelay: "-6s", animationDuration: "14s" }}
          >
            √
          </div>
          <div
            className="absolute top-[90%] right-10 md:right-20 text-[7rem] md:text-[12rem] text-primary/10 font-serif font-black leading-none animate-motif-float"
            style={{ ["--motif-rot" as string]: "-6deg", ["--motif-tx" as string]: "-9px", ["--motif-ty" as string]: "-12px", ["--motif-dr" as string]: "2deg", animationDelay: "-9s", animationDuration: "16s" }}
          >
            ∞
          </div>
        </div>

        <section className="relative z-10 px-5 pb-14 pt-10 sm:px-6 lg:px-12">
          <div className="mx-auto grid max-w-360 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                <Sparkles className="size-4" />
                স্মার্ট প্রস্তুতি, কম খরচে
              </div>

              <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-normal text-foreground sm:text-[2.6rem] lg:text-6xl">
                একাধিক কোর্স একসাথে নিয়ে প্রস্তুতিটা করো আরও গুছিয়ে
              </h1>

              <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground">
                MathPro কোর্স Combo হলো একই লক্ষ্যভিত্তিক কয়েকটি কোর্স একসাথে নেওয়ার সহজ উপায়। কম খরচে বেশি কভারেজ, এক জায়গায় স্টাডি প্ল্যান, আর পরীক্ষার আগে কী পড়বে তা নিয়ে কম দুশ্চিন্তা।
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#combos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-teal px-6 py-3.5 text-base font-extrabold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30"
                >
                  Combo গুলো দেখো
                  <ArrowRight className="size-5" />
                </Link>
                <Link
                  href="/courses"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-6 py-3.5 text-base font-bold text-foreground backdrop-blur-md transition-colors hover:bg-muted"
                >
                  আলাদা কোর্স দেখো
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-md">
                <div className="rounded-3xl bg-linear-to-br from-primary/15 to-teal/15 p-5">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-primary">Combo Snapshot</p>
                      <h2 className="mt-1 text-2xl font-extrabold text-foreground">
                        বেশি কভারেজ, কম সিদ্ধান্তের চাপ
                      </h2>
                    </div>
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                      <Layers3 className="size-7" />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-background/80 p-4">
                      <BookOpenCheck className="mb-3 size-6 text-primary" />
                      <p className="text-2xl font-extrabold text-foreground">
                        {toBanglaNumber(pageStats.totalCourses)}+
                      </p>
                      <p className="text-sm font-semibold text-muted-foreground">কোর্স কভারেজ</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/80 p-4">
                      <CircleDollarSign className="mb-3 size-6 text-success" />
                      <p className="text-2xl font-extrabold text-foreground">
                        {formatPrice(pageStats.totalSavings)}
                      </p>
                      <p className="text-sm font-semibold text-muted-foreground">সম্ভাব্য সাশ্রয়</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-background/80 p-4">
                      <BadgePercent className="mb-3 size-6 text-warning" />
                      <p className="text-2xl font-extrabold text-foreground">
                        {toBanglaNumber(pageStats.bestDiscount)}%
                      </p>
                      <p className="text-sm font-semibold text-muted-foreground">সেরা ছাড়</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="combos" className="relative z-10 overflow-hidden px-5 py-14 sm:px-6 lg:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-10 right-4 hidden font-serif text-[12rem] font-black leading-none text-primary/8 lg:block xl:right-16 xl:text-[15rem]"
            style={{
              transform: "rotate(-10deg)",
            }}
          >
            π
          </div>

          <div className="relative z-10 mx-auto max-w-360">
            <div className="mb-8 max-w-3xl">
              <div>
                <p className="mb-2 text-sm font-extrabold text-primary">Combo সমূহ</p>
                <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                  লক্ষ্য অনুযায়ী সঠিক Combo বেছে নাও
                </h2>
              </div>
              <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
                প্রতিটি কার্ডে সব কোর্স, মোট দাম, সাশ্রয় এবং ছাড় একসাথে দেখানো হয়েছে।
              </p>
            </div>

            {combos.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {combos.map((combo, index) => (
                  <ComboCard key={combo.id} combo={combo} featured={index === 0} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-xl">
                <Gift className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                <h3 className="text-2xl font-extrabold text-foreground">
                  কোনো Combo পাওয়া যায়নি
                </h3>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  শীঘ্রই নতুন Combo যোগ করা হবে। আপাতত আলাদা কোর্স থেকে তোমার প্রস্তুতি শুরু করতে পারো।
                </p>
                <Link
                  href="/courses"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground"
                >
                  সকল কোর্স দেখো
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="relative z-10 bg-section-b px-5 py-16 sm:px-6 lg:px-12">
          <div className="mx-auto grid max-w-360 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-2 text-sm font-extrabold text-primary">Decision Guide</p>
              <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                Combo কেন আলাদা কোর্সের চেয়ে সহজ?
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "একই লক্ষ্যভিত্তিক কোর্সগুলো একসাথে সাজানো থাকে",
                "আলাদা আলাদা করে খুঁজে সিদ্ধান্ত নেওয়ার চাপ কমে",
                "মোট খরচ কমে, কিন্তু শেখার কভারেজ বাড়ে",
                "প্রস্তুতির শুরুতেই পুরো রোডম্যাপ পরিষ্কার হয়",
              ].map((text) => (
                <div key={text} className="flex gap-3 rounded-2xl border border-border bg-card p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                  <p className="font-semibold leading-relaxed text-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative z-10 px-5 py-16 sm:px-6 lg:px-12">
          <div className="mx-auto max-w-360 overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-r from-primary/10 to-teal/10 p-6 shadow-xl md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                  এখনো নিশ্চিত না হলে সব কোর্স দেখে তুলনা করো
                </h2>
                <p className="mt-4 max-w-2xl text-lg font-medium leading-relaxed text-muted-foreground">
                  Combo সবচেয়ে ভালো যখন একসাথে কয়েকটি কোর্স নেওয়ার পরিকল্পনা আছে। একক কোর্স চাইলে MathPro কোর্স পেজ থেকেই শুরু করো।
                </p>
              </div>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-base font-extrabold text-background transition-opacity hover:opacity-90"
              >
                সকল কোর্স দেখো
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppWidget phoneNumber={siteConfig.contact.phone} />
    </div>
  );
}
