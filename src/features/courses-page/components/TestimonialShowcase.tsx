"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Star,
  Quote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  PlayCircle,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Feedback } from "../_lib/types";
import { getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from "../_lib/youtube";
// TEMP: dev-only preview data — remove with `_lib/testimonial-mock.ts`
import { MOCK_TESTIMONIALS } from "../_lib/testimonial-mock";

// ─── Shared bits ────────────────────────────────────────────────────────────────

/** Explains the check badge on hover / to screen readers. */
const VERIFIED_LABEL = "কোর্সে ভর্তি হওয়া শিক্ষার্থীর যাচাইকৃত রিভিউ";

function Avatar({
  name,
  imageUploadedLink,
  size,
}: {
  name: string;
  imageUploadedLink?: string;
  size: number;
}) {
  return (
    <div
      className="rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {imageUploadedLink ? (
        <Image
          src={imageUploadedLink}
          alt={name}
          width={size}
          height={size}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-primary font-bold" style={{ fontSize: size * 0.4 }}>
          {name?.charAt(0) || "?"}
        </span>
      )}
    </div>
  );
}

function StarRow({
  rating = 5,
  size = "size-3.5",
  className = "",
  emptyClassName = "text-muted-foreground/30",
}: {
  rating?: number;
  size?: string;
  className?: string;
  emptyClassName?: string;
}) {
  const rounded = Math.round(rating);
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < rounded ? "fill-warning text-warning" : emptyClassName}`}
        />
      ))}
    </div>
  );
}

/**
 * Auto-advances a horizontal scroll row by one card-width, looping back to the
 * start at the end. Pauses on hover/focus and whenever `hold` is true.
 */
function useAutoScroll(
  ref: React.RefObject<HTMLDivElement | null>,
  step: number,
  interval: number,
  hold = false,
) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || hold) return;
    const row = ref.current;
    if (!row) return;

    const timer = setInterval(() => {
      const maxScroll = row.scrollWidth - row.clientWidth;
      if (maxScroll <= 0) return;
      const next = row.scrollLeft + 1 >= maxScroll ? 0 : row.scrollLeft + step;
      row.scrollTo({ left: next, behavior: "smooth" });
    }, interval);

    return () => clearInterval(timer);
  }, [ref, step, interval, paused, hold]);

  return {
    scrollBy: (dir: 1 | -1) =>
      ref.current?.scrollBy({ left: dir * step, behavior: "smooth" }),
    pauseHandlers: {
      onMouseEnter: () => setPaused(true),
      onMouseLeave: () => setPaused(false),
      onFocusCapture: () => setPaused(true),
      onBlurCapture: () => setPaused(false),
    },
  };
}

// ─── Hero band ──────────────────────────────────────────────────────────────────

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Converts ASCII digits to Bengali numerals, per the Copy invariant. */
function toBengaliNumerals(value: string | number) {
  return String(value).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)]);
}

/**
 * Stats derived from the testimonials actually on screen. Only claims we can
 * substantiate from real data — deliberately no invented "students taught" or
 * "% recommended" figures.
 */
function buildHeroStats(items: Feedback[]) {
  const rated = items.filter((item) => typeof item.rating === "number");
  const fiveStar = rated.filter((item) => item.rating === 5).length;
  const average =
    rated.length > 0
      ? rated.reduce((sum, item) => sum + (item.rating ?? 0), 0) / rated.length
      : 0;

  const stats = [
    {
      icon: Quote,
      value: `${toBengaliNumerals(items.length)}+`,
      label: "শিক্ষার্থীর মতামত",
    },
  ];

  if (rated.length > 0) {
    stats.push({
      icon: Star,
      value: `${toBengaliNumerals(average.toFixed(1))}/৫`,
      label: "গড় রেটিং",
    });
  }

  if (fiveStar > 0) {
    stats.push({
      icon: Trophy,
      value: `${toBengaliNumerals(fiveStar)}`,
      label: "৫ স্টার রিভিউ",
    });
  }

  return stats;
}

function HeroBand({ items }: { items: Feedback[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroStats = useMemo(() => buildHeroStats(items), [items]);

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  const goTo = (i: number) =>
    setIndex(((i % items.length) + items.length) % items.length);

  return (
    <div className="relative bg-emerald-950 overflow-hidden">
      {/* Math motif */}
      <div
        aria-hidden
        className="absolute -top-10 right-10 text-[16rem] text-emerald-900/40 font-serif font-black select-none pointer-events-none leading-none animate-motif-float"
        style={{
          ["--motif-rot" as string]: "10deg",
          ["--motif-tx" as string]: "10px",
          ["--motif-ty" as string]: "-12px",
          ["--motif-dr" as string]: "2deg",
          animationDuration: "16s",
        }}
      >
        ∑
      </div>

      <div className="container mx-auto px-6 lg:px-12 py-14 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] gap-10 lg:gap-12 items-center">
          {/* Left column — copy + stats */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">
              সাফল্যের গল্প
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-[1.15] mb-4 font-heading">
              সত্যিকারের শিক্ষার্থী।
              <br />
              <span className="text-emerald-400">সত্যিকারের ফলাফল।</span>
            </h2>
            <p className="text-emerald-100/80 leading-relaxed max-w-md mb-8">
              MathPro-র শিক্ষার্থীরা কীভাবে গণিতের ভয় জয় করেছে, শোনো তাদের নিজের
              কথায়।
            </p>

            <div className="rounded-2xl border border-emerald-800/80 bg-emerald-900/40 px-5 py-5">
              {/* Icon sits inline with the value on mobile so the tiles stay
                  readable at 390px instead of stacking into a cramped column. */}
              <div className="flex flex-wrap gap-x-8 gap-y-5">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="min-w-[6.5rem]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <stat.icon
                        className={`size-4 shrink-0 text-emerald-400 ${stat.icon === Star ? "fill-current" : ""}`}
                      />
                      <span className="text-white font-extrabold text-xl leading-none">
                        {stat.value}
                      </span>
                    </div>
                    <div className="text-emerald-300/70 text-xs font-semibold leading-tight">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column — featured testimonial card */}
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="rounded-[1.75rem] border border-emerald-800/80 bg-emerald-900/30 overflow-hidden shadow-2xl">
              <div className="relative min-h-[380px] sm:min-h-[300px]">
                {items.map((feedback, i) => (
                  <div
                    key={`${feedback.name}-${i}`}
                    className={`absolute inset-0 transition-opacity duration-500 ${i === index ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"}`}
                  >
                    <div className="flex flex-col sm:flex-row h-full">
                      <div className="relative w-full sm:w-[38%] aspect-square sm:aspect-auto bg-emerald-800/50 shrink-0">
                        {feedback.imageUploadedLink ? (
                          <Image
                            src={feedback.imageUploadedLink}
                            alt={feedback.name}
                            fill
                            sizes="(min-width: 640px) 30vw, 100vw"
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-emerald-400 font-extrabold text-6xl">
                              {feedback.name?.charAt(0) || "?"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center min-w-0">
                        <StarRow
                          rating={feedback.rating}
                          size="size-4"
                          className="mb-4"
                          emptyClassName="text-emerald-700"
                        />
                        <p className="relative text-base sm:text-lg text-white leading-relaxed mb-6">
                          <Quote className="inline size-4 text-emerald-500/70 -translate-y-1 mr-1" />
                          {feedback.description}
                        </p>
                        <div className="h-px bg-emerald-800 mb-4" />
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{feedback.name}</span>
                          <span title={VERIFIED_LABEL} className="inline-flex shrink-0">
                            <CheckCircle2
                              className="size-4 text-emerald-400"
                              role="img"
                              aria-label={VERIFIED_LABEL}
                            />
                          </span>
                        </div>
                        <p className="text-sm text-emerald-200/70 mt-1">{feedback.bio}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {items.length > 1 && (
              <>
                <button
                  onClick={() => goTo(index - 1)}
                  aria-label="Previous testimonial"
                  className="absolute -left-3 lg:-left-5 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white shadow-lg flex items-center justify-center text-emerald-950 hover:bg-emerald-400 transition-colors z-20"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  onClick={() => goTo(index + 1)}
                  aria-label="Next testimonial"
                  className="absolute -right-3 lg:-right-5 top-1/2 -translate-y-1/2 size-10 rounded-full bg-white shadow-lg flex items-center justify-center text-emerald-950 hover:bg-emerald-400 transition-colors z-20"
                >
                  <ChevronRight className="size-5" />
                </button>

                <div className="flex justify-center gap-2 mt-5">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-7 bg-emerald-400" : "w-1.5 bg-white/25 hover:bg-white/50"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Review card ────────────────────────────────────────────────────────────────

function ReviewCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/8 dark:hover:border-emerald-500/25 dark:hover:shadow-emerald-400/10 transition-all duration-300">
      <div className="flex items-start gap-3">
        <Avatar
          name={feedback.name}
          imageUploadedLink={feedback.imageUploadedLink}
          size={48}
        />
        <div className="min-w-0 flex-1">
          <StarRow rating={feedback.rating} className="mb-2" />
          <p className="text-sm text-paragraph leading-relaxed line-clamp-4">
            &ldquo;{feedback.description}&rdquo;
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="min-w-0">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold text-heading leading-none truncate">
            {feedback.name}
          </p>
          <span title={VERIFIED_LABEL} className="inline-flex shrink-0">
              <CheckCircle2
                className="size-3.5 text-primary"
                role="img"
                aria-label={VERIFIED_LABEL}
              />
            </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-1">{feedback.bio}</p>
      </div>
    </div>
  );
}

// ─── Video panel ────────────────────────────────────────────────────────────────

function VideoShortCard({
  feedback,
  playing,
  onPlay,
}: {
  feedback: Feedback;
  playing: boolean;
  onPlay: () => void;
}) {
  const embedUrl = feedback.videoUrl ? getYouTubeEmbedUrl(feedback.videoUrl) : null;
  const thumbnailUrl = feedback.videoUrl
    ? getYouTubeThumbnailUrl(feedback.videoUrl)
    : null;

  if (!embedUrl) return null;

  return (
    <div className="flex-shrink-0 w-[210px] sm:w-[240px] snap-start">
      <div className="relative aspect-9/16 rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
        {playing ? (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            title={`${feedback.name} video testimonial`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={onPlay}
            className="group relative h-full w-full"
            aria-label={`Play ${feedback.name} video testimonial`}
          >
            {thumbnailUrl && (
              <Image
                src={thumbnailUrl}
                alt={feedback.name}
                fill
                sizes="240px"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="size-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="size-6 text-slate-900 fill-current translate-x-0.5" />
              </span>
            </div>
          </button>
        )}
      </div>
      <div className="mt-3">
        <div className="flex items-center gap-1">
          <p className="text-sm font-bold text-heading truncate">{feedback.name}</p>
          <span title={VERIFIED_LABEL} className="inline-flex shrink-0">
              <CheckCircle2
                className="size-3.5 text-primary"
                role="img"
                aria-label={VERIFIED_LABEL}
              />
            </span>
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{feedback.bio}</p>
      </div>
    </div>
  );
}

function VideoPanel({ items }: { items: Feedback[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  // Hold the auto-scroll while a video is playing so it can't scroll away.
  const { scrollBy, pauseHandlers } = useAutoScroll(
    rowRef,
    252,
    3500,
    playingIndex !== null,
  );

  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
            <PlayCircle className="size-4 text-primary" />
          </span>
          <h3 className="text-lg md:text-xl font-bold text-heading font-heading">
            ওদের গল্প, ওদের কণ্ঠে
          </h3>
        </div>
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => scrollBy(-1)}
            aria-label="Scroll videos left"
            className="size-9 rounded-full bg-card border border-border flex items-center justify-center text-heading hover:bg-primary hover:text-white hover:border-primary transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scrollBy(1)}
            aria-label="Scroll videos right"
            className="size-9 rounded-full bg-card border border-border flex items-center justify-center text-heading hover:bg-primary hover:text-white hover:border-primary transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="relative" {...pauseHandlers}>
        <div className="absolute right-0 top-0 bottom-4 w-10 md:w-16 z-10 pointer-events-none bg-linear-to-l from-section-a to-transparent" />
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
        >
          {items.map((feedback, i) => (
            <VideoShortCard
              key={`${feedback.name}-video-${i}`}
              feedback={feedback}
              playing={playingIndex === i}
              onPlay={() => setPlayingIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export interface TestimonialShowcaseProps {
  feedbacks?: Feedback[];
}

export default function TestimonialShowcase({
  feedbacks = [],
}: TestimonialShowcaseProps) {
  const source = useMemo(() => {
    const valid = feedbacks.filter(
      (feedback) =>
        Boolean(feedback.name?.trim()) &&
        Boolean(feedback.bio?.trim()) &&
        Boolean(feedback.description?.trim()),
    );

    // TEMP (dev only): backfill sample entries so the video row is previewable
    // until real testimonials carry photos and video URLs.
    if (process.env.NODE_ENV !== "development") return valid;
    if (valid.length === 0) return MOCK_TESTIMONIALS;
    if (valid.some((feedback) => feedback.videoUrl)) return valid;
    return [...valid, ...MOCK_TESTIMONIALS.filter((mock) => mock.videoUrl)];
  }, [feedbacks]);

  const reviewRowRef = useRef<HTMLDivElement>(null);
  const { scrollBy: scrollReviews, pauseHandlers: reviewPauseHandlers } =
    useAutoScroll(reviewRowRef, 320, 4000);

  if (source.length === 0) {
    return null;
  }

  const featured = source.slice(0, 5);
  const videoItems = source.filter((feedback) => Boolean(feedback.videoUrl));

  return (
    <section id="student-reviews" className="relative overflow-hidden">
      {/* 1 — Hero band */}
      <HeroBand items={featured} />

      {/* 2 + 3 — light band */}
      <div className="bg-section-a py-12 md:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Review row */}
          <div className="relative mb-12">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg md:text-xl font-bold text-heading font-heading">
                শিক্ষার্থীদের রিভিউ
              </h3>
              {source.length > 1 && (
                <div className="hidden sm:flex gap-2">
                  <button
                    onClick={() => scrollReviews(-1)}
                    aria-label="Scroll reviews left"
                    className="size-9 rounded-full bg-card border border-border flex items-center justify-center text-heading hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    onClick={() => scrollReviews(1)}
                    aria-label="Scroll reviews right"
                    className="size-9 rounded-full bg-card border border-border flex items-center justify-center text-heading hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="relative" {...reviewPauseHandlers}>
              <div className="absolute right-0 top-0 bottom-4 w-10 md:w-16 z-10 pointer-events-none bg-linear-to-l from-section-a to-transparent" />
              <div
                ref={reviewRowRef}
                className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
              >
                {source.map((feedback, i) => (
                  <ReviewCard key={`${feedback.name}-${i}`} feedback={feedback} />
                ))}
              </div>
            </div>
          </div>

          {/* Video row — full width */}
          {videoItems.length > 0 && <VideoPanel items={videoItems} />}

          {/* CTA — centered, own row */}
          <div className="relative overflow-hidden bg-emerald-950 rounded-[2rem] px-6 py-14 md:py-16 text-center">
            <Trophy
              aria-hidden
              className="absolute -bottom-12 -right-8 size-64 text-emerald-400/10 rotate-12 pointer-events-none"
            />
            <h3 className="relative text-3xl md:text-4xl font-extrabold text-white leading-snug mb-4 font-heading">
              পরবর্তী সাফল্যের গল্পটি{" "}
              <span className="text-emerald-400">তোমারই হোক</span>
            </h3>
            <p className="relative text-emerald-100/80 mb-8 max-w-xl mx-auto">
              তুমিও যুক্ত হও MathPro-তে এবং নিজের গণিত জয়ের গল্প
              শুরু করো।
            </p>
            <a
              href="#courses"
              className="relative inline-flex items-center gap-2 px-10 py-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold rounded-full text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/50"
            >
              আজই শুরু করো
              <ArrowRight className="size-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
