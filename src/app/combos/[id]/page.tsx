"use client";

import { useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgePercent,
  BookOpenCheck,
  Layers3,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { BACKEND_URL } from "@/api.config";
import SEO from "@/components/SEO";
import Footer from "@/components/footer";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { siteConfig } from "@/config/site.config";

interface ComboCourse {
  id: number;
  title: string;
  price: number;
  short_description?: string;
  url?: string;
  chips?: {
    course_thumbnail_link?: string;
    thumbnails?: {
      course_thumbnail_link_16_9?: string;
    };
    sections?: {
      chapter?: { label: string; value: string };
      video?: { label: string; value: string };
    };
  };
}

interface Combo {
  id: number;
  title: string;
  price: number;
  short_description?: string;
  course_count: number;
  courses: ComboCourse[];
  enrolled?: number;
  prebooking?: number;
  is_live?: boolean;
  intro_video?: string;
  chips?: {
    thumbnails?: {
      bundle_thumb_16_9?: string;
      bundle_thumb_4_3?: string;
    };
    enrollment?: {
      classStart?: { label: string; value: string };
      classTime?: { label: string; value: string };
      enrollment_end?: { label: string; value: string };
      prebooking_end?: { label: string; value: string };
    };
  };
}

interface ComboResponse {
  success: boolean;
  data: Combo[] | Combo;
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

function calculateOriginalPrice(courses: ComboCourse[]) {
  return courses.reduce((sum, course) => sum + Number(course.price || 0), 0);
}

function calculateDiscount(price: number, original: number) {
  if (!original || original <= price) return 0;
  return Math.round(((original - price) / original) * 100);
}

function getCourseThumb(course: ComboCourse) {
  return (
    course.chips?.thumbnails?.course_thumbnail_link_16_9 ||
    course.chips?.course_thumbnail_link ||
    null
  );
}

function ComboBackgroundLayers() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-primary/10 blur-[120px] dark:bg-primary/15" />
        <div className="absolute top-1/3 -right-40 w-125 h-125 rounded-full bg-primary/8 blur-[100px] dark:bg-primary/12" />
        <div className="absolute bottom-0 left-1/4 w-100 h-100 rounded-full bg-primary/5 blur-[100px] dark:bg-primary/10" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 z-[39] hidden h-[500px] w-[1000px] -translate-x-1/2 dark:block"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(16, 185, 129, 0.06) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </>
  );
}

function ComboMotifField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden">
      <div
        className="absolute top-32 -left-10 text-[10rem] font-serif font-black leading-none text-primary/10 animate-motif-float md:left-4 md:text-[18rem]"
        style={{ ["--motif-rot" as string]: "12deg", ["--motif-tx" as string]: "10px", ["--motif-ty" as string]: "-14px", ["--motif-dr" as string]: "2deg", animationDelay: "0s", animationDuration: "13s" }}
      >
        ∫
      </div>
      <div
        className="absolute top-[38%] -right-12 text-[9rem] font-serif font-black leading-none text-primary/8 animate-motif-float md:right-8 md:text-[16rem]"
        style={{ ["--motif-rot" as string]: "-12deg", ["--motif-tx" as string]: "-12px", ["--motif-ty" as string]: "10px", ["--motif-dr" as string]: "-3deg", animationDelay: "-3s", animationDuration: "15s" }}
      >
        π
      </div>
      <div
        className="absolute top-[64%] -left-10 text-[8rem] font-serif font-black leading-none text-primary/8 animate-motif-float md:left-12 md:text-[14rem]"
        style={{ ["--motif-rot" as string]: "45deg", ["--motif-tx" as string]: "8px", ["--motif-ty" as string]: "-10px", ["--motif-dr" as string]: "3deg", animationDelay: "-6s", animationDuration: "14s" }}
      >
        √
      </div>
      <div
        className="absolute top-[90%] right-10 text-[7rem] font-serif font-black leading-none text-primary/10 animate-motif-float md:right-20 md:text-[12rem]"
        style={{ ["--motif-rot" as string]: "-6deg", ["--motif-tx" as string]: "-9px", ["--motif-ty" as string]: "-12px", ["--motif-dr" as string]: "2deg", animationDelay: "-9s", animationDuration: "16s" }}
      >
        ∞
      </div>
    </div>
  );
}

function ComboDetailsSkeleton() {
  return (
    <div className="font-sans overflow-x-hidden">
      <main className="relative min-h-screen overflow-hidden bg-section-a pt-20">
        <ComboBackgroundLayers />
        <ComboMotifField />
        <div className="relative z-10 mx-auto w-[90%] max-w-360 px-5 pb-16 pt-10 sm:px-6 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              <div className="h-8 w-40 animate-pulse rounded-full bg-primary/20" />
              <div className="h-14 w-full animate-pulse rounded-xl bg-muted/70" />
              <div className="h-5 w-[85%] animate-pulse rounded-lg bg-muted/70" />
              <div className="h-5 w-[70%] animate-pulse rounded-lg bg-muted/70" />
              <div className="h-12 w-48 animate-pulse rounded-xl bg-primary/25" />
            </div>
            <div className="h-72 animate-pulse rounded-3xl border border-border bg-card" />
          </div>

          <div className="mt-10 space-y-3">
            <div className="h-10 w-60 animate-pulse rounded-xl bg-muted/70" />
            <div className="grid gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl border border-border bg-card" />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ComboDetailsPage() {
  const params = useParams<{ id: string }>();
  const comboId = params?.id;

  const {
    data: combo,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["combo-details", comboId],
    enabled: Boolean(comboId),
    queryFn: async (): Promise<Combo> => {
      const response = await axios.get<ComboResponse>(`${BACKEND_URL}/user/bundle/${comboId}`);
      if (!response.data.success) {
        throw new Error("Failed to fetch combo details");
      }

      const payload = response.data.data;
      const parsed = Array.isArray(payload) ? payload[0] : payload;
      if (!parsed) {
        throw new Error("Combo not found");
      }

      return parsed;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  const computed = useMemo(() => {
    const courses = combo?.courses || [];
    const originalPrice = calculateOriginalPrice(courses);
    const savings = Math.max(originalPrice - (combo?.price || 0), 0);
    const discount = calculateDiscount(combo?.price || 0, originalPrice);

    return {
      courseCount: combo?.course_count || courses.length,
      originalPrice,
      savings,
      discount,
    };
  }, [combo]);

  if (isLoading) {
    return <ComboDetailsSkeleton />;
  }

  if (isError || !combo) {
    return (
      <div className="font-sans overflow-x-hidden">
        <SEO title="Combo পাওয়া যায়নি - MathPro" description="MathPro কোর্স Combo বিস্তারিত।" />
        <main className="relative min-h-screen overflow-hidden bg-section-a pt-20">
          <ComboBackgroundLayers />
          <ComboMotifField />
          <div className="relative z-10 mx-auto flex min-h-[70vh] w-[90%] max-w-360 items-center justify-center px-5 text-center">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-xl">
              <p className="text-2xl font-extrabold text-foreground">Combo খুঁজে পাওয়া যায়নি</p>
              <p className="mt-3 text-muted-foreground">এই Combo টি এখন পাওয়া যাচ্ছে না। অন্য Combo বা কোর্স দেখে শুরু করো।</p>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  onClick={() => refetch()}
                  className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground"
                >
                  আবার চেষ্টা করো
                </button>
                <Link
                  href="/combos"
                  className="rounded-xl border border-border bg-background px-5 py-3 font-bold text-foreground"
                >
                  সব Combo দেখো
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const thumb = combo.chips?.thumbnails?.bundle_thumb_16_9 || combo.chips?.thumbnails?.bundle_thumb_4_3;
  return (
    <div className="font-sans overflow-x-hidden">
      <SEO
        title={`${combo.title} - MathPro Combo`}
        description={
          combo.short_description ||
          `এই Combo-তে ${toBanglaNumber(computed.courseCount)}টি কোর্স একসাথে নিয়ে কম খরচে প্রস্তুতি নাও।`
        }
        path={`/combos/${combo.id}`}
        image={thumb}
      />

      <ComboBackgroundLayers />

      <main className="relative min-h-screen overflow-hidden bg-section-a pt-20">
        <ComboMotifField />
        <section className="relative z-10 px-5 pb-12 pt-10 sm:px-6 lg:px-12">
          <div className="mx-auto grid w-[90%] max-w-360 items-start gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-xl backdrop-blur-md md:p-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                <Sparkles className="size-4" />
                কোর্স Combo
              </div>

              <h1 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">{combo.title}</h1>

              {combo.short_description && (
                <p className="mt-4 text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
                  {combo.short_description}
                </p>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/85 p-4">
                  <p className="text-sm font-semibold text-muted-foreground">মোট কোর্স</p>
                  <p className="mt-1 text-2xl font-extrabold text-foreground">{toBanglaNumber(computed.courseCount)}টি</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/85 p-4">
                  <p className="text-sm font-semibold text-muted-foreground">তোমার সাশ্রয়</p>
                  <p className="mt-1 text-2xl font-extrabold text-success">{formatPrice(computed.savings)}</p>
                </div>
              </div>

            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-extrabold text-primary">Combo Snapshot</p>
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Layers3 className="size-5" />
                </div>
              </div>

              {thumb ? (
                <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-2xl border border-border">
                  <Image src={thumb} alt={combo.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
                  <PlayCircle className="size-8" />
                </div>
              )}

              <div className="mt-5 grid gap-3">
                <div className="rounded-xl border border-border bg-background/80 p-4">
                  <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                    <p className="text-4xl font-extrabold text-foreground">{formatPrice(combo.price)}</p>
                    {computed.originalPrice > combo.price && (
                      <p className="pb-1 text-xl font-bold text-muted-foreground line-through">
                        {formatPrice(computed.originalPrice)}
                      </p>
                    )}
                    {computed.discount > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/15 px-3 py-1 text-sm font-extrabold text-warning">
                        <BadgePercent className="size-4" />
                        {toBanglaNumber(computed.discount)}% ছাড়
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href="https://www.mathpro.com/auth/login"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-primary to-teal px-6 py-3.5 text-base font-extrabold text-primary-foreground shadow-xl shadow-primary/20"
                >
                  Combo নাও
                  <ArrowRight className="size-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 overflow-hidden bg-section-b px-5 py-14 sm:px-6 lg:px-12">
          <div className="mx-auto w-[90%] max-w-360">
            <div className="mb-12 rounded-3xl border border-border bg-card/70 p-5 shadow-xl backdrop-blur-md md:p-8">
              <div className="mb-6 text-center">
                <p className="text-sm font-extrabold text-primary">দাম তুলনা</p>
                <h2 className="mt-1 text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                  কেনো Combo নেবে?
                </h2>
                <p className="mt-3 text-base font-medium text-muted-foreground">
                  আলাদা করে কিনলে বেশি খরচ, Combo নিলে একসাথে সাশ্রয়।
                </p>
              </div>

              <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
                <div className="rounded-2xl border border-border bg-background/70 p-4">
                  <p className="mb-3 text-sm font-bold text-muted-foreground">আলাদা কিনলে</p>
                  <div className="space-y-2">
                    {(combo.courses || []).map((course, index) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {toBanglaNumber(index + 1)}. {course.title}
                        </p>
                        <p className="text-sm font-bold text-muted-foreground">
                          {formatPrice(course.price || 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-destructive/25 bg-destructive/10 px-3 py-2.5">
                    <p className="flex items-center justify-between text-base font-extrabold text-foreground">
                      <span>মোট</span>
                      <span className="text-destructive">
                        {formatPrice(computed.originalPrice)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary lg:h-20 lg:w-20">
                  <span className="text-2xl font-extrabold">VS</span>
                </div>

                <div className="rounded-2xl border border-primary/30 bg-linear-to-br from-primary/10 to-teal/10 p-4 shadow-lg">
                  <div className="mb-3 inline-flex rounded-full border border-primary/25 bg-primary/15 px-3 py-1 text-xs font-extrabold text-primary">
                    Best Value
                  </div>
                  <p className="text-lg font-extrabold text-foreground">{combo.title}</p>
                  <p className="mt-3 text-sm font-semibold text-muted-foreground">Combo দাম</p>
                  <p className="text-4xl font-extrabold text-foreground">{formatPrice(combo.price)}</p>

                  <div className="mt-4 rounded-xl border border-success/30 bg-success/15 p-3">
                    <p className="text-sm font-bold text-success">তুমি সেভ করছো</p>
                    <p className="text-3xl font-extrabold text-success">
                      {formatPrice(computed.savings)}
                    </p>
                    {computed.discount > 0 && (
                      <p className="text-lg font-extrabold text-success">
                        ({toBanglaNumber(computed.discount)}% ছাড়)
                      </p>
                    )}
                  </div>

                  <p className="mt-4 text-sm font-bold text-foreground">
                    {toBanglaNumber(computed.courseCount)}টি কোর্স অন্তর্ভুক্ত
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 max-w-3xl">
              <p className="mb-2 text-sm font-extrabold text-primary">এই Combo-তে যা পাচ্ছো</p>
              <h2 className="text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
                সব কোর্স এক জায়গায়, একবারে দেখে নাও
              </h2>
            </div>

            <div className="grid gap-3">
              {(combo.courses || []).map((course, index) => (
                <div
                  key={course.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="grid gap-4 md:grid-cols-[280px_1fr]">
                    <div className="relative min-h-44 border-b border-border md:min-h-full md:border-b-0 md:border-r">
                      {getCourseThumb(course) ? (
                        <Image
                          src={getCourseThumb(course) as string}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                          <BookOpenCheck className="size-8" />
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start gap-2.5">
                        <BookOpenCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                        <div className="min-w-0">
                          <p className="font-extrabold text-foreground">
                            {toBanglaNumber(index + 1)}. {course.title}
                          </p>
                          {course.short_description && (
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                              {course.short_description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.chips?.sections?.chapter?.value && (
                          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                            {course.chips.sections.chapter.value}
                          </span>
                        )}
                        {course.chips?.sections?.video?.value && (
                          <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                            {course.chips.sections.video.value}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-lg font-extrabold text-primary">
                          {formatPrice(course.price || 0)}
                        </p>
                        <Link
                          href={`/courses/${course.url || course.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary"
                        >
                          কোর্স দেখো
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppWidget
        phoneNumber={siteConfig.contact.phone.replace("+", "")}
        message="হ্যালো! Combo নিয়ে জানতে চাই"
      />
    </div>
  );
}
