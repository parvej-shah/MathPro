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
import TestimonialModal from "./TestimonialModal";

// ─── Shared bits ────────────────────────────────────────────────────────────────

/** Explains the check badge on hover / to screen readers. */
const VERIFIED_LABEL = "কোর্সে ভর্তি হওয়া শিক্ষার্থীর যাচাইকৃত রিভিউ";

/** Roughly how many characters the hero card's 4-line clamp can hold before clipping. */
const HERO_TEXT_CLAMP_THRESHOLD = 220;

/** True when the hero card's displayed text is likely clipped by its 4-line clamp, or a longer full story exists. */
function isHeroTextTruncated(feedback: Feedback) {
  const displayed = feedback.hook || feedback.description;
  if (displayed.length > HERO_TEXT_CLAMP_THRESHOLD) return true;
  return Boolean(
    feedback.hook && feedback.description && feedback.description !== feedback.hook,
  );
}

function Avatar({
  name,
  imageUploadedLink,
  size,
}: {
  name: string;
  imageUploadedLink?: string;
  size: number;
}) {
  // Avatar hosts can 404 (e.g. a CDN domain that isn't serving the bucket yet).
  // Without this, a failed load renders alt text spilling out of the circle.
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {imageUploadedLink && !failed ? (
        <Image
          src={imageUploadedLink}
          alt=""
          width={size}
          height={size}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-primary font-bold" style={{ fontSize: size * 0.4 }}>
          {name?.charAt(0) || "?"}
        </span>
      )}
    </div>
  );
}

/** Full-bleed portrait for the featured quote panel, with the same 404 fallback. */
function PortraitOrInitial({
  name,
  imageUploadedLink,
}: {
  name: string;
  imageUploadedLink?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!imageUploadedLink || failed) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-emerald-400 font-extrabold text-6xl">
          {name?.charAt(0) || "?"}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={imageUploadedLink}
      alt=""
      fill
      sizes="(min-width: 640px) 30vw, 100vw"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

/** Institution logo + name — the logo reads as a small circular crest sitting next to the name it identifies. */
function InstitutionLine({
  name,
  logoUrl,
  textClassName = "text-xs text-muted-foreground truncate",
  logoSize = "size-4",
  dark = false,
}: {
  name: string;
  logoUrl?: string;
  textClassName?: string;
  logoSize?: string;
  dark?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex items-center gap-2 min-w-0">
      {logoUrl && !failed && (
        <span
          className={`relative ${logoSize} shrink-0 rounded-full overflow-hidden bg-white ${
            dark ? "ring-1 ring-emerald-400/30" : "ring-1 ring-border"
          }`}
        >
          <Image src={logoUrl} alt="" fill className="object-cover" onError={() => setFailed(true)} />
        </span>
      )}
      <p className={textClassName}>{name}</p>
    </div>
  );
}

/** Institution logo shown as a framed mark. `anchor="corner"` pins it to a card's own corner
 *  padding (needs a tall `relative` ancestor); `anchor="center"` centers it on the right edge
 *  of its immediate `relative` parent, so it tracks a short content row instead of the whole card. */
function InstitutionMark({
  logoUrl,
  name,
  size = "size-14",
  dark = false,
  anchor = "corner",
}: {
  logoUrl?: string;
  name: string;
  size?: string;
  dark?: boolean;
  anchor?: "corner" | "center";
}) {
  const [failed, setFailed] = useState(false);
  if (!logoUrl || failed) return null;
  return (
    <span
      className={`absolute ${
        anchor === "center"
          ? "top-1/2 right-0 -translate-y-1/2"
          : "bottom-6 right-6 sm:bottom-8 sm:right-8"
      } ${size} shrink-0 rounded-xl overflow-hidden shadow-lg ${
        dark
          ? "bg-white/95 ring-1 ring-emerald-400/25"
          : "bg-white ring-1 ring-border"
      }`}
      title={name}
    >
      <Image src={logoUrl} alt="" fill className="object-cover" onError={() => setFailed(true)} />
    </span>
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

function HeroBand({
  items,
  onOpen,
}: {
  items: Feedback[];
  onOpen: (feedback: Feedback) => void;
}) {
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
              গণিতের ভয় জয় করে
              <br />
              <span className="text-emerald-400">বোর্ড পরীক্ষায় A+</span>
            </h2>
            <p className="text-emerald-100/80 leading-relaxed max-w-md mb-8">
              কীভাবে শত শত শিক্ষার্থী মুখস্থ নির্ভরতা কাটিয়ে বোর্ড পরীক্ষা ও ভর্তি পরীক্ষায় সেরা ফলাফল করেছে—শোনো তাদের বাস্তব অভিজ্ঞতা।
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
            <div className="rounded-[1.75rem] border border-emerald-500/25 bg-linear-to-br from-emerald-900/70 via-emerald-950/90 to-slate-950 backdrop-blur-xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden">
              {/* Subtle radial emerald highlight inside card top-right */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" aria-hidden="true" />

              <div className="relative">
                {items.map((feedback, i) => (
                  <div
                    key={`${feedback.name}-${i}`}
                    className={`transition-opacity duration-500 ${i === index ? "opacity-100 z-10 relative" : "opacity-0 pointer-events-none z-0 absolute inset-0"}`}
                  >
                    <div className="flex flex-col sm:flex-row h-full min-h-[320px]">
                      <div className="relative w-full aspect-square sm:aspect-auto sm:w-[38%] bg-emerald-900/60 shrink-0 overflow-hidden">
                        <PortraitOrInitial
                          name={feedback.name}
                          imageUploadedLink={feedback.imageUploadedLink}
                        />
                        {/* Soft mobile gradient scrim blending photo into text card below */}
                        <div className="absolute inset-0 bg-linear-to-t from-emerald-950/90 via-transparent to-transparent sm:hidden pointer-events-none" />
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpen(feedback)}
                        className="relative flex-1 p-6 sm:p-8 flex flex-col justify-center min-w-0 text-left"
                      >
                        <StarRow
                          rating={feedback.rating}
                          size="size-4"
                          className="mb-4"
                          emptyClassName="text-emerald-700"
                        />
                        <p className="relative text-base sm:text-lg text-white leading-relaxed line-clamp-4">
                          <Quote className="inline size-4 text-emerald-500/70 -translate-y-1 mr-1" />
                          {feedback.hook || feedback.description}
                        </p>
                        {isHeroTextTruncated(feedback) && (
                          <span className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 mb-6 mt-1 inline-block">
                            সম্পূর্ণ পড়ুন
                          </span>
                        )}
                        <div className="h-px bg-emerald-800/80 mb-4 mt-6" />
                        <div className="relative flex items-center gap-4 pr-16 sm:pr-20">
                          <div className="min-w-0">
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
                            <InstitutionLine
                              name={feedback.bio}
                              textClassName="text-sm text-emerald-200/70 truncate"
                              dark
                            />
                          </div>
                          <InstitutionMark
                            logoUrl={feedback.institutionLogoUrl}
                            name={feedback.bio}
                            size="size-14 sm:size-16"
                            dark
                            anchor="center"
                          />
                        </div>
                      </button>
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
                  className="absolute -left-3 sm:-left-4 lg:-left-5 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-full bg-white text-emerald-950 shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-emerald-100 flex items-center justify-center hover:bg-emerald-400 hover:scale-110 active:scale-95 transition-all duration-200 z-20 cursor-pointer"
                >
                  <ChevronLeft className="size-5 stroke-[2.5]" />
                </button>
                <button
                  onClick={() => goTo(index + 1)}
                  aria-label="Next testimonial"
                  className="absolute -right-3 sm:-right-4 lg:-right-5 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-full bg-white text-emerald-950 shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-emerald-100 flex items-center justify-center hover:bg-emerald-400 hover:scale-110 active:scale-95 transition-all duration-200 z-20 cursor-pointer"
                >
                  <ChevronRight className="size-5 stroke-[2.5]" />
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

function ReviewCard({
  feedback,
  onOpen,
}: {
  feedback: Feedback;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="relative flex-shrink-0 w-[320px] sm:w-[380px] snap-start text-left bg-card border border-border rounded-[1.75rem] p-7 flex flex-col gap-5 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/8 dark:hover:border-emerald-500/25 dark:hover:shadow-emerald-400/10 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <Avatar
          name={feedback.name}
          imageUploadedLink={feedback.imageUploadedLink}
          size={88}
        />
        <div className="min-w-0 flex-1 pt-1">
          <StarRow rating={feedback.rating} className="mb-2.5" />
          <p className="text-base text-paragraph leading-relaxed line-clamp-4">
            &ldquo;{feedback.hook || feedback.description}&rdquo;
          </p>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="relative flex items-center gap-3 pr-16">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-base font-bold text-heading leading-none truncate">
              {feedback.name}
            </p>
            <span title={VERIFIED_LABEL} className="inline-flex shrink-0">
                <CheckCircle2
                  className="size-4 text-primary"
                  role="img"
                  aria-label={VERIFIED_LABEL}
                />
              </span>
          </div>
          <div className="mt-1.5">
            <InstitutionLine name={feedback.bio} />
          </div>
        </div>

        <InstitutionMark
          logoUrl={feedback.institutionLogoUrl}
          name={feedback.bio}
          size="size-14"
          anchor="center"
        />
      </div>
    </button>
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
    <div>
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-lg">
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
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
        <div className="mt-0.5">
          <InstitutionLine name={feedback.bio} logoUrl={feedback.institutionLogoUrl} />
        </div>
      </div>
    </div>
  );
}

function VideoPanel({ items }: { items: Feedback[] }) {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-14">
      <div className="flex items-center gap-2 mb-5">
        <span className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
          <PlayCircle className="size-4 text-primary" />
        </span>
        <h3 className="text-lg md:text-xl font-bold text-heading font-heading">
          শিক্ষার্থীদের ভিডিও রিভিউ ও অভিজ্ঞতা
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
    return feedbacks.filter(
      (feedback) =>
        Boolean(feedback.name?.trim()) &&
        Boolean(feedback.bio?.trim()) &&
        Boolean(feedback.description?.trim()),
    );
  }, [feedbacks]);

  const reviewRowRef = useRef<HTMLDivElement>(null);
  const { scrollBy: scrollReviews, pauseHandlers: reviewPauseHandlers } =
    useAutoScroll(reviewRowRef, 400, 4000);
  const [activeFeedback, setActiveFeedback] = useState<Feedback | null>(null);

  if (source.length === 0) {
    return null;
  }

  const featured = source.slice(0, 5);
  const videoItems = source.filter(
    (feedback) =>
      Boolean(
        feedback.videoUrl &&
          feedback.videoUrl.trim() !== "" &&
          feedback.videoUrl.toLowerCase() !== "null" &&
          feedback.videoUrl.toLowerCase() !== "undefined",
      ),
  );

  return (
    <section id="student-reviews" className="relative overflow-hidden">
      {/* 1 — Hero band */}
      <HeroBand items={featured} onOpen={setActiveFeedback} />

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
                  <ReviewCard
                    key={`${feedback.name}-${i}`}
                    feedback={feedback}
                    onOpen={() => setActiveFeedback(feedback)}
                  />
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
              পরবর্তী A+ অর্জনকারী হতে{" "}
              <span className="text-emerald-400">তুমি প্রস্তুত?</span>
            </h3>
            <p className="relative text-emerald-100/80 mb-8 max-w-xl mx-auto">
              আজই যুক্ত হও MathPro-এর ইন্টারেক্টিভ লাইভ ক্লাসে এবং শুরু করো তোমার গণিত জয়ের যাত্রা।
            </p>
            <a
              href="#courses"
              className="relative inline-flex items-center gap-2 px-10 py-4 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold rounded-full text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/50"
            >
              তোমার ব্যাচ বেছে নাও
              <ArrowRight className="size-5" />
            </a>
          </div>
        </div>
      </div>

      <TestimonialModal
        feedback={activeFeedback}
        onOpenChange={(open) => {
          if (!open) setActiveFeedback(null);
        }}
      />
    </section>
  );
}
