"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import PremiumCourseCard from "@/features/courses-page/components/PremiumCourseCard";
import TestimonialMarquee from "@/features/courses-page/components/TestimonialMarquee";
import FAQSection from "@/features/courses-page/components/FAQSection";
import type { CourseCategory } from "@/features/courses-page/_lib/types";
import { useCourseDirectory } from "@/hooks/useCourseDirectory";
import {
  mapPublicTestimonialsToFeedbacks,
  usePublicTestimonials,
} from "@/hooks/usePublicTestimonials";
import { englishToBanglaNumbers } from "@/helpers";
import Link from "next/link";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  CheckCircle2,
  PlayCircle,
  TrendingUp,
  ChevronRight,
  Star,
  MapPin,
  BookOpen,
  Sparkles,
  GraduationCap,
  Calculator,
  FlaskConical,
  Laptop,
  Users,
  ArrowUpRight,
  Video,
} from "lucide-react";

const slides = [
  {
    id: 1,
    title: "গণিতে আত্মবিশ্বাস গড়ুন",
    subtitle: "ক্লাস ৮ থেকে HSC পর্যন্ত শিক্ষার্থীদের জন্য লাইভ ক্লাস, রেকর্ডেড লেকচার, প্র্যাকটিস ও প্রগ্রেস ট্র্যাকিং।",
    cta: "কোর্সগুলো দেখুন",
    bgClass: "bg-emerald-950",
    pattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-emerald-950 to-slate-950",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Coordinate Axis Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
          <div className="w-full h-px bg-emerald-400 absolute"></div>
          <div className="h-full w-px bg-emerald-400 absolute"></div>
          {/* Subtle math equations floating in background */}
          <div className="absolute top-[20%] left-[10%] text-emerald-400/40 font-serif text-2xl md:text-3xl -rotate-12 select-none">f(x) = x²</div>
          <div className="absolute bottom-[20%] right-[10%] text-emerald-400/40 font-serif text-2xl md:text-3xl rotate-12 select-none">∫ e^x dx</div>
        </div>
        {/* Single prominent cap icon */}
        <motion.div
          animate={{ y: -10 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 3, ease: "easeInOut", type: "tween" }}
          style={{ willChange: "transform" }}
          className="relative flex items-center justify-center"
        >
          {/* Glow rings */}
          <div className="absolute size-[280px] sm:size-[340px] md:size-[400px] lg:size-[440px] rounded-full border border-emerald-500/10 animate-pulse"></div>
          <div className="absolute size-[220px] sm:size-[280px] md:size-[320px] lg:size-[340px] rounded-full border border-emerald-500/15"></div>
          <div className="absolute size-[160px] sm:size-[220px] md:size-[240px] lg:size-[240px] rounded-full bg-emerald-500/5 border border-emerald-400/20 shadow-[0_0_60px_rgba(16,185,129,0.2)]"></div>

          {/* Main icon */}
          <div className="relative size-32 md:size-52 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/10 flex items-center justify-center backdrop-blur-xl border border-emerald-400/30 shadow-[0_0_80px_rgba(16,185,129,0.25)]">
            <span className="text-[5rem] md:text-[9rem] drop-shadow-[0_0_30px_rgba(16,185,129,0.6)] select-none leading-none">🎓</span>
          </div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: -12 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 2.5, ease: "easeInOut", type: "tween" }}
          style={{ willChange: "transform" }}
          className="absolute -top-4 -right-4 md:top-6 md:right-6 lg:top-16 lg:right-16 bg-white/5 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/10 shadow-2xl flex items-center gap-3 md:gap-4 scale-90 md:scale-95 lg:scale-100"
        >
          <div className="size-8 md:size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="text-emerald-400 size-4 md:size-5" />
          </div>
          <div>
            <div className="text-white font-extrabold text-lg md:text-xl">১০০%</div>
            <div className="text-emerald-200/60 text-[9px] md:text-[11px] font-bold tracking-widest uppercase">সিলেবাস কভার</div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: 14 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 3.2, ease: "easeInOut", type: "tween" }}
          style={{ willChange: "transform" }}
          className="absolute -bottom-4 -left-4 md:bottom-10 md:left-6 lg:bottom-20 lg:left-16 bg-white/5 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/10 shadow-2xl flex items-center gap-3 md:gap-4 scale-90 md:scale-95 lg:scale-100"
        >
          <div className="text-emerald-400 font-bold text-3xl md:text-4xl font-serif leading-none mt-1">∑</div>
          <div>
            <div className="text-white font-extrabold text-base md:text-lg">গণিতভীতি দূর</div>
            <div className="text-emerald-200/60 text-[9px] md:text-[11px] font-bold tracking-widest uppercase">সহজ সমাধান</div>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: 2,
    title: "লাইভ ও রেকর্ডেড ক্লাসের দারুণ সমন্বয়",
    subtitle: "সরাসরি শিক্ষকদের কাছে প্রশ্ন করো, কিংবা মিস করা ক্লাসগুলো এইচডি রেকর্ডিংয়ে দেখে নাও যেকোনো সময়।",
    cta: "ফ্রি ক্লাসগুলো দেখুন",
    bgClass: "bg-slate-900",
    pattern: "bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/10 via-slate-900 to-slate-950",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-[90%] md:w-[85%] aspect-video bg-[#0b1120] rounded-[2rem] border border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          {/* Video Player Header */}
          <div className="h-12 bg-[#0f172a] border-b border-slate-800/50 flex items-center px-5 gap-2 relative z-10">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-auto px-3 py-1 bg-slate-800/50 rounded-md text-[10px] text-emerald-400 font-mono tracking-widest border border-emerald-500/20 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-1 bg-slate-900/50 flex items-center justify-center relative backdrop-blur-sm">
            <div className="size-16 md:size-24 rounded-full bg-emerald-500/20 flex items-center justify-center backdrop-blur-md border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500 cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <PlayCircle className="w-8 h-8 md:w-12 md:h-12 text-emerald-400 drop-shadow-lg ml-1" />
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 flex items-center gap-3 md:gap-4">
              <span className="text-[10px] md:text-xs text-slate-400 font-mono">12:45</span>
              <div className="flex-1 h-1 md:h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer group/progress">
                <div className="w-1/3 h-full bg-emerald-500 relative group-hover/progress:bg-emerald-400 transition-colors">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 md:size-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(16,185,129,1)] scale-0 group-hover/progress:scale-100 transition-transform"></div>
                </div>
              </div>
              <span className="text-[10px] md:text-xs text-slate-400 font-mono">45:00</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "প্রগ্রেস ট্র্যাকিং ও ইন্টারঅ্যাকটিভ কুইজ",
    subtitle: "অধ্যায়ভিত্তিক কুইজ ও মক টেস্ট দিয়ে নিজের ভুলগুলো শুধরে নাও এবং পরীক্ষার জন্য ১০০% প্রস্তুত হও।",
    cta: "মডেল টেস্ট দিন",
    bgClass: "bg-teal-950",
    pattern: "bg-[conic-gradient(at_center_right,_var(--tw-gradient-stops))] from-emerald-950 via-teal-950 to-slate-900",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center gap-4 md:gap-6 flex-col md:flex-row scale-90 md:scale-100 lg:scale-110">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut", type: "tween" }}
            className={`bg-white/5 backdrop-blur-sm p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border w-[260px] md:w-64 lg:w-72 shadow-2xl relative ${i === 2 ? 'border-emerald-400/40 bg-emerald-900/30 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)] z-10 md:-translate-y-8 lg:-translate-y-10' : 'border-white/10 opacity-70 scale-95 hidden sm:block'}`}
          >
            {i === 2 && (
              <div className="absolute -top-4 -right-4 size-10 rounded-full bg-emerald-500 flex items-center justify-center border-[3px] border-teal-950 text-white shadow-xl rotate-12">
                <Star className="size-5 fill-white" />
              </div>
            )}

            <div className="h-5 w-1/2 bg-white/20 rounded-md mb-8"></div>
            <div className="space-y-4">
              <div className={`h-14 w-full rounded-2xl border flex items-center px-4 gap-4 transition-all ${i === 2 ? 'bg-emerald-500/20 border-emerald-500/30 translate-x-2' : 'bg-white/5 border-white/5'}`}>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 ${i === 2 ? 'border-emerald-400 bg-emerald-400' : 'border-white/20'}`}>
                  {i === 2 && <CheckCircle2 className="size-4 text-emerald-950" />}
                </div>
                <div className="h-2.5 w-1/2 bg-white/20 rounded-full"></div>
              </div>

              <div className="h-14 w-full bg-white/5 border border-white/5 rounded-2xl flex items-center px-4 gap-4">
                <div className="size-6 rounded-full border-2 border-white/20 shrink-0"></div>
                <div className="h-2.5 w-2/3 bg-white/10 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
];

const classCategories = [
  {
    title: "অষ্টম শ্রেণি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#dbeafe] dark:bg-[#1e3a8a]/30",
    iconBgClass: "bg-[#3b82f6]",
    titleClass: "text-[#2563eb] dark:text-blue-300",
    descClass: "text-[#1e3a8a]/70 dark:text-blue-200/60",
    icon: BookOpen
  },
  {
    title: "নবম শ্রেণি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#dcfce7] dark:bg-emerald-900/30",
    iconBgClass: "bg-[#10b981]",
    titleClass: "text-[#059669] dark:text-emerald-300",
    descClass: "text-[#064e3b]/70 dark:text-emerald-200/60",
    icon: Calculator
  },
  {
    title: "দশম শ্রেণি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#f3e8ff] dark:bg-purple-900/30",
    iconBgClass: "bg-[#a855f7]",
    titleClass: "text-[#7e22ce] dark:text-purple-300",
    descClass: "text-[#4c1d95]/70 dark:text-purple-200/60",
    icon: GraduationCap
  },
  {
    title: "এসএসসি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#ffedd5] dark:bg-orange-900/30",
    iconBgClass: "bg-[#f97316]",
    titleClass: "text-[#ea580c] dark:text-orange-300",
    descClass: "text-[#7c2d12]/70 dark:text-orange-200/60",
    icon: FlaskConical
  },
  {
    title: "এইচএসসি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#e0e7ff] dark:bg-indigo-900/30",
    iconBgClass: "bg-[#6366f1]",
    titleClass: "text-[#4f46e5] dark:text-indigo-300",
    descClass: "text-[#312e81]/70 dark:text-indigo-200/60",
    icon: Laptop
  },
  {
    title: "এডমিশন",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#fce7f3] dark:bg-pink-900/30",
    iconBgClass: "bg-[#ec4899]",
    titleClass: "text-[#e11d48] dark:text-pink-300",
    descClass: "text-[#881337]/70 dark:text-pink-200/60",
    icon: Users
  }
];

const features = [
  { icon: Users, title: "অভিজ্ঞ ম্যাথ মেন্টর", desc: "পরীক্ষাকেন্দ্রিক পড়াশোনা ও বিশেষ টেকনিকের মাধ্যমে কঠিন অংক খুব সহজভাবে বোঝানো হয়।" },
  { icon: Video, title: "লাইভ + রেকর্ডেড শেখা", desc: "সরাসরি ক্লাসে প্রশ্ন করার সুযোগ। ক্লাস মিস হলেও পরে যতবার খুশি রেকর্ডিং দেখে নেওয়া যাবে।" },
  { icon: BookOpen, title: "অধ্যায়ভিত্তিক গোছানো প্রস্তুতি", desc: "এলোমেলো পড়া নয়, একদম বেসিক থেকে অ্যাডভান্সড লেভেল পর্যন্ত ধাপে ধাপে ম্যাথ শেখানো হয়।" },
  { icon: CheckCircle2, title: "প্রচুর প্র্যাকটিস ও কুইজ", desc: "প্রতিটি ক্লাসের পর লেকচার শিট, অধ্যায়ভিত্তিক কুইজ ও মডেল টেস্ট দিয়ে নিজেকে যাচাই করার সুযোগ।" },
  { icon: TrendingUp, title: "স্মার্ট প্রগ্রেস ট্র্যাকিং", desc: "পড়াশোনার অগ্রগতি ড্যাশবোর্ডে ট্র্যাক করো এবং নিজের ভুলগুলো চিহ্নিত করে দ্রুত উন্নতি করো।" },
  { icon: Laptop, title: "দ্রুত ও সহজ এক্সেস", desc: "বিকাশ বা নগদে পেমেন্ট করেই সাথে সাথে কোর্সে যুক্ত হও। যেকোনো ডিভাইস থেকে অনায়াসে ক্লাস করার সুবিধা।" },
];

const ALL_TAG_ID = "all";
const sessionTagPattern = /(?:^|\s)(jsc|ssc|hsc)(?:\s|$)|[০-৯]{2,4}|\d{2,4}/i;
const nonSessionTagKeywords = [
  "লাইভ",
  "রেকর্ডেড",
  "ভিডিও",
  "কুইজ",
  "quiz",
  "live",
  "recorded",
];

function normalizeTag(tag: string) {
  return tag.replace(/\s+/g, " ").trim();
}

function banglaDigitsToEnglish(value: string) {
  return value.replace(/[০-৯]/g, (digit) =>
    String("০১২৩৪৫৬৭৮৯".indexOf(digit)),
  );
}

function isSessionFilterTag(tag: string) {
  const normalized = normalizeTag(tag);
  if (!normalized) return false;

  const lowerCased = normalized.toLowerCase();
  if (nonSessionTagKeywords.some((keyword) => lowerCased.includes(keyword))) {
    return false;
  }

  return sessionTagPattern.test(lowerCased);
}

function formatTagLabel(tag: string) {
  return normalizeTag(tag).replace(/\d+/g, (match) =>
    englishToBanglaNumbers(Number(match)),
  );
}

function extractTagSortValue(tag: string) {
  const digits = banglaDigitsToEnglish(tag).match(/\d{2,4}/g);
  if (!digits || digits.length === 0) return -1;
  return Number(digits[digits.length - 1]);
}

function CategoryCourseSection({ category }: { category: CourseCategory }) {
  const filterTags = useMemo(() => {
    const uniqueTags = new Map<string, string>();

    category.courses.forEach((course) => {
      course.tags?.forEach((tag) => {
        if (!isSessionFilterTag(tag)) return;
        const normalized = normalizeTag(tag);
        if (!uniqueTags.has(normalized)) {
          uniqueTags.set(normalized, tag);
        }
      });
    });

    return Array.from(uniqueTags.values()).sort((a, b) => {
      const yearDifference = extractTagSortValue(b) - extractTagSortValue(a);
      if (yearDifference !== 0) return yearDifference;
      return normalizeTag(a).localeCompare(normalizeTag(b), "en", {
        sensitivity: "base",
      });
    });
  }, [category.courses]);

  const [selectedTag, setSelectedTag] = useState(ALL_TAG_ID);

  const activeTag =
    selectedTag === ALL_TAG_ID || filterTags.includes(selectedTag)
      ? selectedTag
      : ALL_TAG_ID;

  const visibleCourses = useMemo(() => {
    const courses =
      activeTag === ALL_TAG_ID
        ? category.courses
        : category.courses.filter((course) =>
            course.tags?.some((tag) => normalizeTag(tag) === activeTag),
          );

    return courses.slice(0, 3);
  }, [activeTag, category.courses]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 relative z-[45]">
        <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-heading">
          {category.category_name}
        </h3>
        <Link
          href="/courses"
          className="text-sm font-bold text-primary hover:gap-2 flex items-center gap-1 transition-all"
        >
          সব দেখুন <span>&gt;</span>
        </Link>
      </div>

      {filterTags.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10 relative z-[45]">
          <button
            type="button"
            onClick={() => setSelectedTag(ALL_TAG_ID)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
              selectedTag === ALL_TAG_ID
                ? "border-primary bg-primary text-primary-foreground shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary"
            }`}
          >
            সব
          </button>
          {filterTags.map((tag) => (
              <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(normalizeTag(tag))}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-all ${
                activeTag === normalizeTag(tag)
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary"
              }`}
            >
              {formatTagLabel(tag)}
            </button>
          ))}
        </div>
      )}

      {visibleCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {visibleCourses.map((course) => (
            <PremiumCourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-10 text-center text-muted-foreground relative z-[45]">
          এই ট্যাগে এখনো কোনো কোর্স পাওয়া যায়নি।
        </div>
      )}
    </div>
  );
}

export function LandingPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Live category sections from GET /user/course/directory (COURSE_DIRECTORY_API_SPEC.md).
  const { categories: courseCategories, loading: coursesLoading } = useCourseDirectory();
  const { testimonials } = usePublicTestimonials();

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="min-h-screen bg-page-bg font-sans text-foreground overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900 dark:selection:bg-emerald-800 dark:selection:text-emerald-100 relative z-0">
      {/* Global subtle graph paper grid overlay */}
      <div className="fixed inset-0 z-[40] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      {/* Dark mode ambient glow — top-center emerald radial, invisible in light */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none z-[39] hidden dark:block" style={{ background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.07) 0%, transparent 70%)' }}></div>

      {/* --- HERO CAROUSEL --- */}
      <section className="relative h-[100dvh] min-h-[700px] w-full bg-slate-950 overflow-hidden">
        {/* Carousel */}
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-full">
                <div className={`absolute inset-0 ${slide.bgClass} ${slide.pattern} opacity-90`}></div>
                <div className="relative z-[45] h-full container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center pt-32 md:pt-24 lg:pt-0 pb-12 md:pb-0">

                  {/* Text Content */}
                  <div className="w-full md:w-1/2 z-10 flex flex-col items-center md:items-start text-center md:text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, y: selectedIndex === index ? 0 : 16 }}
                      transition={{ duration: 0.5, delay: 0.15, ease: "easeOut", type: "tween" }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6"
                    >
                      <Sparkles className="size-3.5" />
                      প্ল্যাটফর্ম ২.০ লাইভ
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, y: selectedIndex === index ? 0 : 16 }}
                      transition={{ duration: 0.5, delay: 0.25, ease: "easeOut", type: "tween" }}
                      className="font-heading text-4xl sm:text-5xl md:text-5xl lg:text-7xl font-extrabold text-white leading-[1.2] md:leading-[1.1] tracking-tight mb-4 md:mb-6 drop-shadow-sm"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, y: selectedIndex === index ? 0 : 16 }}
                      transition={{ duration: 0.5, delay: 0.35, ease: "easeOut", type: "tween" }}
                      className="text-lg md:text-2xl text-emerald-50/90 mb-8 md:mb-10 max-w-lg leading-relaxed font-medium"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, y: selectedIndex === index ? 0 : 16 }}
                      transition={{ duration: 0.5, delay: 0.45, ease: "easeOut", type: "tween" }}
                      className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full transition-colors hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 text-lg"
                    >
                      {slide.cta}
                      <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>

                  {/* Visual Content */}
                  <div className="w-full md:w-1/2 h-[35vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] relative mt-8 md:mt-16 lg:mt-24">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, scale: selectedIndex === index ? 1 : 0.92 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut", type: "tween" }}
                      style={{ willChange: "opacity, transform" }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {slide.visual}
                    </motion.div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Pips */}
        <div className="absolute bottom-6 md:bottom-12 left-0 right-0 flex justify-center gap-2 md:gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-500 ${selectedIndex === i ? 'w-12 bg-emerald-400' : 'w-3 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* --- TRUST STATS BAR --- */}
      <section className="bg-emerald-900 border-y border-emerald-800 relative z-[45] shadow-xl overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 py-6 md:py-8">
          <div className="flex flex-wrap justify-center lg:justify-between gap-6 md:gap-10 lg:gap-12 items-center max-w-5xl mx-auto">

            <div className="flex items-center gap-3 md:gap-5">
              <div className="size-10 md:size-14 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 border border-emerald-700/50 shadow-inner shrink-0">
                <Users className="size-5 md:size-7" />
              </div>
              <div>
                <div className="text-white font-extrabold text-xl md:text-3xl font-heading tracking-tight leading-none mb-1">৫০,০০০+</div>
                <div className="text-emerald-300/80 font-bold tracking-widest text-[9px] md:text-xs uppercase">শিক্ষার্থী যুক্ত আছে</div>
              </div>
            </div>

            <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-emerald-700 to-transparent"></div>

            <div className="flex items-center gap-3 md:gap-5">
              <div className="size-10 md:size-14 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 border border-emerald-700/50 shadow-inner shrink-0">
                <CheckCircle2 className="size-5 md:size-7" />
              </div>
              <div>
                <div className="text-white font-extrabold text-xl md:text-3xl font-heading tracking-tight leading-none mb-1">১,০০০+</div>
                <div className="text-emerald-300/80 font-bold tracking-widest text-[9px] md:text-xs uppercase">লাইভ ও রেকর্ডেড ক্লাস</div>
              </div>
            </div>

            <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-emerald-700 to-transparent"></div>

            <div className="flex items-center gap-3 md:gap-5">
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

      {/* --- CLASS CATEGORIES --- */}
      <section className="py-24 bg-section-b relative border-b border-border overflow-hidden">
        {/* Math Motif Background */}
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
              <a key={i} href={category.href} className="group outline-none relative z-[45] block">
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
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --- VALUE PROP SECTION --- */}
      <section id="features" className="py-28 bg-section-a relative overflow-hidden">
        {/* Math Motif Background */}
        <div className="absolute top-10 md:top-20 right-0 md:right-10 text-[8rem] md:text-[14rem] text-emerald-100/60 dark:text-emerald-900/30 font-serif font-black select-none pointer-events-none leading-none animate-motif-float" style={{ ["--motif-rot" as string]: "-12deg", ["--motif-tx" as string]: "-10px", ["--motif-ty" as string]: "12px", ["--motif-dr" as string]: "-2deg", animationDuration: "15s" }}>∑</div>
        <div className="absolute bottom-10 left-0 md:left-10 text-[6rem] md:text-[12rem] text-emerald-100/50 dark:text-emerald-900/20 font-serif font-black select-none pointer-events-none leading-none animate-motif-float" style={{ ["--motif-rot" as string]: "12deg", ["--motif-tx" as string]: "10px", ["--motif-ty" as string]: "-10px", ["--motif-dr" as string]: "3deg", animationDelay: "-7s", animationDuration: "17s" }}>∞</div>
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20 relative z-[45]">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-heading font-heading">কেন MathPro বেছে নিবে?</h2>
            <p className="text-muted-foreground text-xl font-medium leading-relaxed">আমরা শুধু গণিত পড়াই না। আমরা এমন সিস্টেম তৈরি করি যা তোমাকে গণিতে দক্ষ করে তুলবে।</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="p-8 md:p-10 rounded-[2rem] bg-card border border-border shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 dark:hover:border-emerald-500/30 transition-all duration-300 group flex flex-col items-start relative z-[45]"
              >
                <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="size-7 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-heading font-heading tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium text-[15px]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED COURSES (Grouped) --- */}
      <section id="courses" className="py-28 bg-section-b relative overflow-hidden">
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

          <div className="flex flex-col gap-24">
            {coursesLoading ? (
              // Lightweight skeleton rows while the directory loads.
              [0, 1].map((i) => (
                <div key={i} className="flex flex-col">
                  <div className="h-10 w-48 bg-muted rounded-lg mb-10 animate-pulse" />
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                    {[0, 1, 2].map((j) => (
                      <div key={j} className="h-72 bg-muted rounded-2xl animate-pulse" />
                    ))}
                  </div>
                </div>
              ))
            ) : courseCategories.length === 0 ? (
              <div className="text-center text-muted-foreground py-16 relative z-[45]">
                নতুন কোর্স শীঘ্রই যোগ করা হবে।
              </div>
            ) : (
              courseCategories.map((category) => (
                <CategoryCourseSection key={category.slug} category={category} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* --- STUDENT REVIEWS (MARQUEE) --- */}
      <TestimonialMarquee
        feedbacks={mapPublicTestimonialsToFeedbacks(testimonials)}
      />

      {/* --- OFFLINE BRANCHES (O2O Strategy) --- */}
      <section id="branches" className="py-32 bg-section-a overflow-hidden relative">
        {/* Math Motif Background */}
        <div className="absolute -bottom-4 md:bottom-10 right-0 md:right-10 text-[10rem] md:text-[20rem] text-muted/20 font-serif font-black select-none pointer-events-none z-0 animate-motif-float" style={{ ["--motif-rot" as string]: "12deg", ["--motif-tx" as string]: "-10px", ["--motif-ty" as string]: "-12px", ["--motif-dr" as string]: "2deg", animationDuration: "16s" }}>Ω</div>
        <div className="container mx-auto px-6 lg:px-12 relative z-[45]">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-20 items-center max-w-[1400px] mx-auto">

            {/* Geometric Map Visual (Left Side) */}
            <div className="relative z-[45] h-[550px] w-full rounded-[3rem] bg-[#0f172a] border border-slate-800/80 flex items-center justify-center overflow-hidden shadow-2xl shadow-slate-900/20 group">
              {/* Animated Geometric Grid */}
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>

              {/* Radar Sweep Effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 origin-center"
                style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.15) 360deg)', borderRadius: '50%' }}
              />

              {/* Concentric Geometry */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[250px] rounded-full border border-emerald-500/20"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[450px] rounded-full border border-emerald-500/10"></div>

              {/* SVG Connecting Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  x1="35%" y1="35%" x2="65%" y2="65%"
                  stroke="#10b981" strokeWidth="2" strokeDasharray="6 6" className="opacity-60"
                />
              </svg>

              {/* Tech UI Overlays */}
              <div className="absolute top-8 left-8 font-geist-mono text-[11px] text-emerald-400/80 tracking-[0.2em] leading-relaxed uppercase">
                LAT_ 23.8103° N <br />
                LON_ 90.4125° E <br />
                <span className="text-white mt-2 inline-block">SYS.ACTIVE</span>
              </div>
              <div className="absolute bottom-8 right-8 font-geist-mono text-[11px] text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase text-right">
                MATHPRO_NET_V2 <br />
                O2O_CONNECT
              </div>

              {/* Branch Pin 1 - Mirpur */}
              <a
                href="https://maps.google.com/?q=Mirpur+10+Center,+Dhaka"
                target="_blank"
                rel="noreferrer"
                className="absolute top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin cursor-pointer z-10"
              >
                <div className="bg-slate-900/90 backdrop-blur-xl px-5 py-2.5 rounded-[1.2rem] shadow-2xl text-[15px] font-extrabold text-white mb-4 border border-emerald-500/30 group-hover/pin:bg-emerald-500 group-hover/pin:border-emerald-400 group-hover/pin:shadow-emerald-500/30 transition-all duration-300 transform group-hover/pin:-translate-y-2 group-hover/pin:scale-105 tracking-wide">
                  মিরপুর শাখা
                </div>
                <div className="size-6 bg-emerald-500 rounded-full border-[3px] border-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.5)] relative flex items-center justify-center group-hover/pin:scale-[1.4] transition-transform duration-300">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
                  <div className="size-1.5 bg-white rounded-full"></div>
                </div>
              </a>

              {/* Branch Pin 2 - Uttara */}
              <a
                href="https://maps.google.com/?q=Uttara+Sector+7,+Dhaka"
                target="_blank"
                rel="noreferrer"
                className="absolute top-[65%] left-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin cursor-pointer z-10"
              >
                <div className="bg-slate-900/90 backdrop-blur-xl px-5 py-2.5 rounded-[1.2rem] shadow-2xl text-[15px] font-extrabold text-white mb-4 border border-emerald-500/30 group-hover/pin:bg-emerald-500 group-hover/pin:border-emerald-400 group-hover/pin:shadow-emerald-500/30 transition-all duration-300 transform group-hover/pin:-translate-y-2 group-hover/pin:scale-105 tracking-wide">
                  উত্তরা শাখা
                </div>
                <div className="size-6 bg-emerald-500 rounded-full border-[3px] border-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.5)] relative flex items-center justify-center group-hover/pin:scale-[1.4] transition-transform duration-300">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
                  <div className="size-1.5 bg-white rounded-full"></div>
                </div>
              </a>
            </div>

            {/* Content (Right Side) */}
            <div className="flex flex-col items-start lg:pl-4 relative z-[45]">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-widest mb-6">
                <MapPin className="size-3.5 stroke-[2.5]" />
                আমাদের শাখাসমূহ
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.15] text-heading font-heading">
                অনলাইনে শেখো।<br />অফলাইনে যুক্ত হও।
              </h2>
              <p className="text-muted-foreground text-[1.15rem] mb-12 leading-relaxed font-medium">
                অনলাইনে সেরা অভিজ্ঞতার পাশাপাশি, ঢাকায় MathPro-এর অফলাইন শাখাও রয়েছে। মক এক্সাম দিতে, প্রিন্টেড শিট নিতে বা শিক্ষকদের সাথে সরাসরি কথা বলতে চলে এসো আমাদের শাখায়।
              </p>

              <div className="space-y-5 w-full">
                {[
                  { name: "মিরপুর ১০ সেন্টার", address: "বাড়ি ১২, রোড ৪, ব্লক সি, মিরপুর, ঢাকা", mapUrl: "https://maps.google.com/?q=Mirpur+10+Center,+Dhaka" },
                  { name: "উত্তরা সেক্টর ৭", address: "সেক্টর ৭, সোনারগাঁও জনপথ রোড, ঢাকা", mapUrl: "https://maps.google.com/?q=Uttara+Sector+7,+Dhaka" }
                ].map((branch, i) => (
                  <a key={i} href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 md:p-8 rounded-[1.5rem] border border-border hover:border-emerald-400/50 dark:hover:border-emerald-500/40 transition-all duration-300 bg-card hover:bg-card/80 group cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/10 hover:-translate-y-1 relative z-[45]">
                    <div>
                      <h4 className="font-extrabold text-[22px] text-heading mb-1.5 font-heading tracking-tight group-hover:text-emerald-600 transition-colors">{branch.name}</h4>
                      <p className="text-muted-foreground font-medium text-[15px] flex items-center gap-2">
                        <MapPin className="size-4 text-emerald-500" />
                        {branch.address}
                      </p>
                    </div>
                    <div className="size-12 rounded-full bg-muted text-muted-foreground group-hover:text-white group-hover:bg-primary flex items-center justify-center transition-all duration-300 shadow-sm group-hover:rotate-45 group-hover:scale-110">
                      <ArrowUpRight className="size-6 stroke-[2.5]" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

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
