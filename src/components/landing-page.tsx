"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import founderPhoto from "../../public/assets/proffesionalFounder.webp";

// Below-the-fold sections — lazy-loaded to keep the landing page's initial JS small.
const TestimonialShowcase = dynamic(
  () => import("@/features/courses-page/components/TestimonialShowcase"),
  { ssr: false },
);
const FAQSection = dynamic(
  () => import("@/features/courses-page/components/FAQSection"),
  { ssr: false },
);
const AboutSection = dynamic(
  () => import("@/features/courses-page/components/AboutSection"),
  { ssr: false },
);
const LandingCourseTabs = dynamic(
  () =>
    import("@/components/LandingCourseTabs").then(
      (module) => module.LandingCourseTabs,
    ),
  { ssr: false },
);
import { useCourseDirectory } from "@/hooks/useCourseDirectory";
import {
  mapPublicTestimonialsToFeedbacks,
  usePublicTestimonials,
} from "@/hooks/usePublicTestimonials";
import { usePublicInstructors } from "@/hooks/usePublicInstructors";
import Link from "next/link";
import {
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  Star,
  BookOpen,
  GraduationCap,
  Calculator,
  FlaskConical,
  Laptop,
  Users,
} from "lucide-react";

const classCategories = [
  {
    title: "অষ্টম শ্রেণি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "/courses?category=%E0%A6%85%E0%A6%B7%E0%A7%8D%E0%A6%9F%E0%A6%AE%20%E0%A6%B6%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%A3%E0%A6%BF#courses-grid",
    bgClass: "bg-[#dbeafe] dark:bg-[#1e3a8a]/30",
    iconBgClass: "bg-[#3b82f6]",
    titleClass: "text-[#2563eb] dark:text-blue-300",
    descClass: "text-[#1e3a8a]/70 dark:text-blue-200/60",
    icon: BookOpen
  },
  {
    title: "নবম শ্রেণি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "/courses?category=%E0%A6%A8%E0%A6%AC%E0%A6%AE%20%E0%A6%B6%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%A3%E0%A6%BF#courses-grid",
    bgClass: "bg-[#dcfce7] dark:bg-emerald-900/30",
    iconBgClass: "bg-[#10b981]",
    titleClass: "text-[#059669] dark:text-emerald-300",
    descClass: "text-[#064e3b]/70 dark:text-emerald-200/60",
    icon: Calculator
  },
  {
    title: "দশম শ্রেণি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "/courses?category=%E0%A6%A6%E0%A6%B6%E0%A6%AE%20%E0%A6%B6%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%A3%E0%A6%BF#courses-grid",
    bgClass: "bg-[#f3e8ff] dark:bg-purple-900/30",
    iconBgClass: "bg-[#a855f7]",
    titleClass: "text-[#7e22ce] dark:text-purple-300",
    descClass: "text-[#4c1d95]/70 dark:text-purple-200/60",
    icon: GraduationCap
  },
  {
    title: "এসএসসি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "/courses?category=%E0%A6%8F%E0%A6%B8%E0%A6%8F%E0%A6%B8%E0%A6%B8%E0%A6%BF#courses-grid",
    bgClass: "bg-[#ffedd5] dark:bg-orange-900/30",
    iconBgClass: "bg-[#f97316]",
    titleClass: "text-[#ea580c] dark:text-orange-300",
    descClass: "text-[#7c2d12]/70 dark:text-orange-200/60",
    icon: FlaskConical
  },
  {
    title: "এইচএসসি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "/courses?category=%E0%A6%8F%E0%A6%87%E0%A6%9A%E0%A6%8F%E0%A6%B8%E0%A6%B8%E0%A6%BF#courses-grid",
    bgClass: "bg-[#e0e7ff] dark:bg-indigo-900/30",
    iconBgClass: "bg-[#6366f1]",
    titleClass: "text-[#4f46e5] dark:text-indigo-300",
    descClass: "text-[#312e81]/70 dark:text-indigo-200/60",
    icon: Laptop
  },
  {
    title: "এডমিশন",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "/courses?category=%E0%A6%8F%E0%A6%A1%E0%A6%AE%E0%A6%BF%E0%A6%B6%E0%A6%A8#courses-grid",
    bgClass: "bg-[#fce7f3] dark:bg-pink-900/30",
    iconBgClass: "bg-[#ec4899]",
    titleClass: "text-[#e11d48] dark:text-pink-300",
    descClass: "text-[#881337]/70 dark:text-pink-200/60",
    icon: Users
  }
];

/**
 * Value props, tiered by how much they actually persuade a scared math student.
 * The bento grid below gives each tier a different size — six equal-weight cards
 * read as a generic feature list and get scrolled past.
 *
 * Copy is written from the student's fear ("I'll fall behind", "I don't know where
 * I'm weak"), not from the feature name.
 */

/** Tier 1 — the strongest objection to kill: falling behind permanently. */
const heroFeature = {
  title: "ক্লাস মিস হলেও পিছিয়ে পড়বে না",
  desc: "লাইভ ক্লাসে সরাসরি প্রশ্ন করো। না বুঝলে বা ক্লাস মিস হলে রেকর্ডিং আছেই — যতবার খুশি দেখে নাও, যতক্ষণ না পুরোটা পরিষ্কার হয়।",
  stat: "∞",
  statLabel: "আনলিমিটেড রিপ্লে",
};

/** Tier 2 — the two promises that carry the most weight after the hero. */
const majorFeatures = [
  {
    icon: BookOpen,
    title: "গোড়া থেকে, ধাপে ধাপে",
    desc: "এলোমেলো পড়া নয়। প্রতিটি অধ্যায় একদম বেসিক থেকে অ্যাডভান্সড পর্যন্ত সাজানো — আগেরটা না বুঝে পরেরটায় যেতে হয় না।",
  },
  {
    icon: TrendingUp,
    title: "কোথায় দুর্বল, নিজেই দেখো",
    desc: "কোন অধ্যায়ে আটকে যাচ্ছো ড্যাশবোর্ড বলে দেবে। পরীক্ষার আগে অনুমান করে পড়তে হবে না।",
  },
];

/** Tier 3 — hygiene factors. They reassure; they don't sell. One line each. */
const minorFeatures = [
  {
    icon: Users,
    title: "অভিজ্ঞ ম্যাথ মেন্টর",
    desc: "কঠিন অংক সহজ টেকনিকে বোঝানো হয়।",
  },
  {
    icon: CheckCircle2,
    title: "প্র্যাকটিস ও কুইজ",
    desc: "প্রতি ক্লাসের পর শিট, কুইজ ও মডেল টেস্ট।",
  },
  {
    icon: Laptop,
    title: "সাথে সাথে শুরু",
    desc: "বিকাশ বা নগদে পেমেন্ট করেই ক্লাস শুরু।",
  },
];

export function LandingPage() {
  // Live category sections from GET /user/course/directory (COURSE_DIRECTORY_API_SPEC.md).
  const { categories: courseCategories, loading: coursesLoading } = useCourseDirectory();
  const { testimonials } = usePublicTestimonials();
  const { instructors } = usePublicInstructors();
  const founder = instructors[0];

  return (
    <div className="min-h-screen bg-page-bg font-sans text-foreground overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900 dark:selection:bg-emerald-800 dark:selection:text-emerald-100 relative z-0">
      {/* Global subtle graph paper grid overlay */}
      <div className="graph-paper-overlay fixed inset-0 z-[40] pointer-events-none"></div>
      {/* Dark mode ambient glow — top-center emerald radial, invisible in light */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none z-[39] hidden dark:block" style={{ background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.07) 0%, transparent 70%)' }}></div>

      {/* --- HERO --- */}
      <section className="relative w-full overflow-hidden bg-emerald-950">
        {/* Depth: soft emerald bloom top-right, deep fade bottom-left */}
        <div className="absolute inset-0 bg-linear-to-br from-emerald-900 via-emerald-950 to-slate-950"></div>
        <div className="absolute -top-40 -right-32 w-[720px] h-[720px] rounded-full bg-emerald-500/12 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[520px] h-[520px] rounded-full bg-teal-500/8 blur-3xl pointer-events-none"></div>

        {/* Faint math motifs — kept to the edges so the text column stays quiet */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden hidden lg:block" aria-hidden="true">
          <div className="absolute top-[8%] left-[2%] text-emerald-300/[0.06] font-serif text-6xl -rotate-12">f(x) = x²</div>
          <div className="absolute bottom-[10%] left-[3%] text-emerald-300/[0.06] font-serif text-5xl rotate-6">∫ e<sup>x</sup> dx</div>
        </div>

        {/* Top padding clears the fixed, transparent navbar (~96px at lg) with room to breathe */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-32 md:pt-36 lg:pt-40 pb-16 lg:pb-20">
          <div className="grid lg:grid-cols-[1fr_0.85fr] gap-12 lg:gap-20 items-center">

            {/* ── Left: message — one idea, read top to bottom in a single glance ── */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Headline — the promise, in the student's own words */}
              <h1 className="font-heading text-[2.75rem] sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
                গণিত ভয়ের নয়,
                <br />
                <span className="text-emerald-400">বোঝার বিষয়</span>
              </h1>

              {/* Subhead — who it's for and what happens, in one breath */}
              <p className="text-lg lg:text-xl text-emerald-50/65 mb-10 max-w-sm leading-relaxed">
                ক্লাস ৮ থেকে HSC — প্রতিটি অধ্যায় গোড়া থেকে বুঝিয়ে শেখানো হয়,
                যতবার দরকার ততবার।
              </p>

              {/* One action. The secondary path stays quiet. */}
              <div className="flex flex-col sm:flex-row items-center gap-x-7 gap-y-4 w-full sm:w-auto">
                <Link
                  href="/courses"
                  className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-9 py-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold rounded-full transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-emerald-500/25 text-lg"
                >
                  কোর্সগুলো দেখো
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#student-reviews"
                  className="text-emerald-100/70 hover:text-white font-semibold text-base underline-offset-4 hover:underline transition-colors"
                >
                  শিক্ষার্থীরা কী বলছে
                </Link>
              </div>
            </div>

            {/* ── Right: the teacher ── */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-[300px] sm:w-[360px] lg:w-[420px]">
                {/* Halo behind the portrait */}
                <div className="absolute -inset-6 rounded-[2.5rem] bg-emerald-400/10 blur-2xl pointer-events-none"></div>

                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-emerald-900/60 ring-1 ring-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
                  <Image
                    src={founderPhoto}
                    alt={founder?.name ?? "MathPro"}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 360px, 420px"
                  />

                  {/* Scrim — fuses the photo into the dark scene and gives the name plate a bed */}
                  <div className="absolute inset-0 bg-linear-to-t from-emerald-950 via-emerald-950/25 to-transparent pointer-events-none"></div>

                  {/* Name plate — inside the frame, over the scrim, clear of the face */}
                  <div className="absolute left-0 right-0 bottom-0 p-5 lg:p-6">
                    <div className="text-white font-extrabold text-xl lg:text-2xl font-heading leading-tight">
                      {founder?.name ?? "MathPro"}
                    </div>
                    <div className="text-emerald-300 text-sm font-semibold mt-0.5">
                      {founder?.role?.trim() ?? "ফাউন্ডার ও ইন্সট্রাক্টর"}
                    </div>
                    {founder?.university && (
                      <div className="flex items-center gap-1.5 text-emerald-100/50 text-xs mt-2">
                        <GraduationCap className="size-3.5 shrink-0" />
                        {founder.university}
                      </div>
                    )}
                  </div>
                </div>

                {/* Single floating credential — pinned low-right so it never covers the face */}
                <div className="absolute right-2 sm:-right-3 lg:-right-6 bottom-36 sm:bottom-28 lg:bottom-28 bg-emerald-950/90 backdrop-blur-md px-4 py-3 rounded-2xl ring-1 ring-emerald-400/20 shadow-xl flex items-center gap-3">
                  <div className="size-9 rounded-full bg-emerald-400/15 flex items-center justify-center shrink-0">
                    <TrendingUp className="text-emerald-400 size-4" />
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-base leading-none mb-1">১০+ বছর</div>
                    <div className="text-emerald-200/50 text-[10px] font-bold tracking-wide">শিক্ষকতার অভিজ্ঞতা</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- TRUST STATS BAR --- */}
      <section className="bg-emerald-900 border-y border-emerald-800 relative z-[45] shadow-xl overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 py-6 md:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10 lg:gap-12 items-center max-w-5xl mx-auto">

            <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-5">
              <div className="size-10 md:size-14 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 border border-emerald-700/50 shadow-inner shrink-0">
                <Users className="size-5 md:size-7" />
              </div>
              <div>
                <div className="text-white font-extrabold text-xl md:text-3xl font-heading tracking-tight leading-none mb-1">৫০,০০০+</div>
                <div className="text-emerald-300/80 font-bold tracking-widest text-[9px] md:text-xs uppercase">শিক্ষার্থী যুক্ত আছে</div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-5">
              <div className="size-10 md:size-14 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 border border-emerald-700/50 shadow-inner shrink-0">
                <CheckCircle2 className="size-5 md:size-7" />
              </div>
              <div>
                <div className="text-white font-extrabold text-xl md:text-3xl font-heading tracking-tight leading-none mb-1">১,০০০+</div>
                <div className="text-emerald-300/80 font-bold tracking-widest text-[9px] md:text-xs uppercase">লাইভ ও রেকর্ডেড ক্লাস</div>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3 md:gap-5">
              <div className="size-10 md:size-14 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 border border-emerald-700/50 shadow-inner shrink-0">
                <Star className="size-5 md:size-7 fill-emerald-400" />
              </div>
              <div>
                <div className="text-white font-extrabold text-xl md:text-3xl font-heading tracking-tight leading-none mb-1">৪.৮/৫</div>
                <div className="text-emerald-300/80 font-bold tracking-widest text-[9px] md:text-xs uppercase">গড় রেটিং</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CLASS CATEGORIES (COMMENTED OUT — 2026-08-13) ---

      Kept, not deleted, so it can be restored if the reasons below stop holding.

      Why it was removed:
      1. Redundant with the course tabs directly below. Both answer the same student
      question — "which class am I?" — but the tabs answer it in place, with live
      data, while these cards navigate away to /courses. Asking twice in a row
      raised cognitive load on the landing page for no added information.
      2. The list is hardcoded (six classes) while the catalog is driven by
      GET /user/course/directory (currently four categories). The cards could
      therefore advertise class levels that have no courses behind them yet.

      When to bring it back:
      - If the courses tab row is removed or moved far down the page, this becomes
      the only class-level entry point again.
      - If it returns, drive `classCategories` from the directory API instead of the
      hardcoded array above, so it can never promise a class the catalog lacks.

      Note: the `classCategories` array near the top of this file is now unused and
      is retained only for this block. `Link` and the lucide icons it references are
      still used by other sections.


      --- markup preserved below ---
            <section className="py-24 bg-section-b relative border-b border-border overflow-hidden">
              {/* Math Motif Background *\/}
              <div className="absolute top-10 left-4 md:left-10 text-[6rem] md:text-[10rem] text-[#3b82f6]/5 font-serif font-bold select-none pointer-events-none animate-motif-float" style={{ ["--motif-rot" as string]: "12deg", ["--motif-tx" as string]: "10px", ["--motif-ty" as string]: "-12px", ["--motif-dr" as string]: "2deg", animationDuration: "14s" }}>∫</div>
              <div className="absolute bottom-10 right-4 md:right-20 text-[5rem] md:text-[8rem] text-[#10b981]/5 font-serif font-bold select-none pointer-events-none animate-motif-float" style={{ ["--motif-rot" as string]: "-12deg", ["--motif-tx" as string]: "-9px", ["--motif-ty" as string]: "10px", ["--motif-dr" as string]: "-2deg", animationDelay: "-5s", animationDuration: "16s" }}>π</div>
              <div className="absolute top-40 right-4 md:right-10 text-[4rem] md:text-[6rem] text-[#a855f7]/5 font-serif font-bold select-none pointer-events-none animate-motif-float" style={{ ["--motif-rot" as string]: "45deg", ["--motif-tx" as string]: "8px", ["--motif-ty" as string]: "-10px", ["--motif-dr" as string]: "3deg", animationDelay: "-9s", animationDuration: "13s" }}>√</div>
              <div className="container mx-auto px-6 lg:px-12">
                <div className="text-center max-w-2xl mx-auto mb-16 relative z-[45]">
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-teal font-heading">
                    আমাদের ক্যাটাগরিসমূহ
                  </h2>
                  <p className="text-muted-foreground text-lg font-medium">
                    তোমার সুবিধামতো বেছে নাও যেকোনো একটি ক্যাটাগরি এবং শুরু করো তোমার শেখার যাত্রা।
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {classCategories.map((category, i) => (
                    <Link key={i} href={category.href} className="group outline-none relative z-[45] block">
                      <div className={`p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-primary/15 border border-transparent dark:border-white/5 dark:hover:border-white/10 relative flex flex-col justify-between min-h-[220px] ${category.bgClass}`}>
                        <div>
                          <div className={`size-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm ${category.iconBgClass}`}>
                            <category.icon className="size-7" />
                          </div>
                          <h3 className={`text-2xl font-bold mb-2 font-heading ${category.titleClass}`}>{category.title}</h3>
                          <p className={`font-medium text-sm leading-relaxed ${category.descClass}`}>{category.desc}</p>
                        </div>
                        <div className="flex justify-end mt-8">
                          <span className={`text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${category.titleClass}`}>
                            Explore <span>&gt;</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
      --- END CLASS CATEGORIES ---
      */}

      {/* --- FEATURED COURSES (Grouped) --- */}
      <section id="courses" className="py-28 bg-section-a relative overflow-hidden">
        {/* Math Motif Background */}
        <div className="absolute top-6 md:top-1/4 left-10 md:left-5 text-[10rem] md:text-[11rem] text-muted/40 dark:text-muted/20 font-serif font-bold -rotate-12 select-none pointer-events-none">θ</div>
        <div className="absolute top-2/3 right-0 md:right-10 text-[6rem] md:text-[11rem] text-muted/50 dark:text-muted/20 font-serif font-bold rotate-12 select-none pointer-events-none">Φ</div>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-24 relative z-[45]">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-heading font-heading">
              আমাদের জনপ্রিয় <span className="text-primary">কোর্সসমূহ</span>
            </h2>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">
              দেশের সেরা শিক্ষকদের সাথে তোমার স্বপ্ন পূরণের যাত্রা শুরু হোক এখান থেকেই।
            </p>
          </div>

          <LandingCourseTabs
            categories={courseCategories}
            loading={coursesLoading}
          />
        </div>
      </section>

      {/* --- VALUE PROP SECTION --- */}
      <section id="features" className="py-28 bg-section-b relative overflow-hidden">
        {/* Math Motif Background */}
        <div className="absolute top-10 md:top-20 right-0 md:right-10 text-[8rem] md:text-[14rem] text-emerald-100/60 dark:text-emerald-900/30 font-serif font-black select-none pointer-events-none leading-none animate-motif-float" style={{ ["--motif-rot" as string]: "-12deg", ["--motif-tx" as string]: "-10px", ["--motif-ty" as string]: "12px", ["--motif-dr" as string]: "-2deg", animationDuration: "15s" }}>∑</div>
        <div className="absolute bottom-10 left-0 md:left-10 text-[6rem] md:text-[12rem] text-emerald-100/50 dark:text-emerald-900/20 font-serif font-black select-none pointer-events-none leading-none animate-motif-float" style={{ ["--motif-rot" as string]: "12deg", ["--motif-tx" as string]: "10px", ["--motif-ty" as string]: "-10px", ["--motif-dr" as string]: "3deg", animationDelay: "-7s", animationDuration: "17s" }}>∞</div>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 relative z-[45]">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-heading font-heading">কেন MathPro বেছে নিবে?</h2>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">গণিতে ভয়ের কারণ একটাই — কোথাও একটা ধাপ বাদ পড়ে গেছে। আমরা সেই ফাঁকটাই বন্ধ করি।</p>
          </div>

          {/*
            Bento grid: one hero cell, two major cells, three compact cells.
            Deliberate asymmetry — size encodes how much each claim matters.
          */}
          <div className="grid lg:grid-cols-3 gap-5 xl:gap-6 relative z-[45]">

            {/* Hero cell — spans 2 cols on desktop. Type carries it; no icon. */}
            <div className="lg:col-span-2 relative overflow-hidden p-9 md:p-12 rounded-[2rem] bg-linear-to-br from-emerald-950 via-emerald-900 to-slate-950 shadow-lg flex flex-col justify-center min-h-[320px]">
              {/* Soft bloom for depth, matching the hero section's treatment */}
              <div className="absolute -top-24 -right-16 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" aria-hidden="true"></div>

              <div className="relative">
                <h3 className="font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.15] tracking-tight mb-5 max-w-xl">
                  {heroFeature.title}
                </h3>
                <p className="text-emerald-50/70 text-base md:text-lg leading-relaxed max-w-lg">
                  {heroFeature.desc}
                </p>
              </div>

              <div className="relative flex items-center gap-3 mt-8 pt-6 border-t border-emerald-400/15">
                <span className="font-heading text-4xl font-extrabold text-emerald-400 leading-none">
                  {heroFeature.stat}
                </span>
                <span className="text-sm font-semibold text-emerald-100/60 tracking-wide">
                  {heroFeature.statLabel}
                </span>
              </div>
            </div>

            {/* Major cells — stacked beside the hero on desktop */}
            <div className="grid gap-5 xl:gap-6">
              {majorFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="p-7 md:p-8 rounded-[2rem] bg-card border border-border shadow-sm hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 dark:hover:border-emerald-500/30 transition-all duration-300 group flex flex-col"
                >
                  <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="size-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-2.5 text-heading font-heading tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium text-[15px]">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Compact cells — hygiene factors, one line each, icon inline */}
            {minorFeatures.map((feature, i) => (
              <div
                key={i}
                className="p-6 md:p-7 rounded-[2rem] bg-card border border-border shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 dark:hover:border-emerald-500/30 transition-all duration-300 group flex items-start gap-4"
              >
                <div className="size-11 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="size-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold mb-1 text-heading font-heading tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed font-medium text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* --- ABOUT SECTION --- */}
      <AboutSection instructors={instructors} />


      {/* --- STUDENT REVIEWS (SHOWCASE) --- */}
      <TestimonialShowcase
        feedbacks={mapPublicTestimonialsToFeedbacks(testimonials)}
      />

      <FAQSection />

      {/* --- FOOTER CTA --- */}
      <section className="bg-emerald-950 py-24 relative overflow-hidden">
        {/* Math Motif Background - Prominent */}
        <div className="absolute -bottom-55 md:top-1/4 left-1/2 -translate-x-1/2 -translate-y-[45%] text-[25rem] md:text-[50rem] text-emerald-900/80 font-serif font-black select-none pointer-events-none leading-none">∞</div>
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>

        <div className="container mx-auto px-6 relative z-[45] text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight font-heading">গণিত জয় করতে প্রস্তুত?</h2>
          <p className="text-emerald-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">একটি ফ্রি ডেমো ক্লাস করে দেখো এবং বুঝো, কেন হাজারো শিক্ষার্থী MathPro বেছে নিয়েছে তাদের গণিতের ভয় জয় করতে।</p>
          <button className="px-16 py-6 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/50">
            ফ্রি ডেমো ক্লাস দেখো
          </button>
        </div>
      </section>

    </div>
  );
}
