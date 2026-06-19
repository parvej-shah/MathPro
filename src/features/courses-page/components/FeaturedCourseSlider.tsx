"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { englishToBanglaNumbers } from "@/helpers";
import { Course } from "../_lib/types";

interface FeaturedCourseSliderProps {
  courses: Course[];
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

const getPlaceholderSrc = (title: string): string => {
  const words = title.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  const initials =
    words.length >= 2
      ? words[0].charAt(0) + words[1].charAt(0)
      : title.substring(0, 2);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#8b5cf6"/><stop offset="100%" style="stop-color:#ec4899"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><text x="400" y="240" font-family="Arial,sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">${initials.toUpperCase()}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

function getCourseThumbnail(course: Course): string {
  return (
    course.chips?.thumbnails?.course_thumbnail_16_9 ||
    getPlaceholderSrc(course.title)
  );
}

export default function FeaturedCourseSlider({
  courses,
}: FeaturedCourseSliderProps) {
  const slides = useMemo<Course[]>(() => courses, [courses]);

  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DURATION = 6000;

  const goTo = useCallback(
    (index: number, dir: "next" | "prev") => {
      if (animating || slides.length <= 1) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setActive(index);
        setAnimating(false);
      }, 550);
    },
    [animating, slides.length]
  );

  const next = useCallback(() => {
    goTo((active + 1) % slides.length, "next");
  }, [active, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + slides.length) % slides.length, "prev");
  }, [active, slides.length, goTo]);

  useEffect(() => {
    if (slides.length <= 1 || paused) return;
    timerRef.current = setTimeout(next, DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active, paused, slides.length, next]);

  if (slides.length === 0) return null;

  const slide = slides[active];
  const thumb = getCourseThumbnail(slide);
  const href = `/courses/${slide.slug || slide.id}`;
  const desc = truncateText(slide.short_description || "", 150);

  // Progress bar key forces remount on slide change
  const progressKey = `${active}-${paused}`;

  return (
    <>
      <style>{`
        @keyframes fcs-in-next {
          from { opacity: 0; transform: translateX(48px) scale(0.98); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
        @keyframes fcs-in-prev {
          from { opacity: 0; transform: translateX(-48px) scale(0.98); }
          to   { opacity: 1; transform: translateX(0)    scale(1); }
        }
        @keyframes fcs-out-next {
          from { opacity: 1; transform: translateX(0)    scale(1); }
          to   { opacity: 0; transform: translateX(-48px) scale(0.98); }
        }
        @keyframes fcs-out-prev {
          from { opacity: 1; transform: translateX(0)   scale(1); }
          to   { opacity: 0; transform: translateX(48px) scale(0.98); }
        }
        @keyframes fcs-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        .fcs-slide-in-next  { animation: fcs-in-next  0.55s cubic-bezier(0.33,1,0.68,1) forwards; }
        .fcs-slide-in-prev  { animation: fcs-in-prev  0.55s cubic-bezier(0.33,1,0.68,1) forwards; }
        .fcs-slide-out-next { animation: fcs-out-next 0.55s cubic-bezier(0.33,1,0.68,1) forwards; }
        .fcs-slide-out-prev { animation: fcs-out-prev 0.55s cubic-bezier(0.33,1,0.68,1) forwards; }
        .fcs-progress-bar { animation: fcs-progress ${DURATION}ms linear forwards; }
      `}</style>

      <div
        className="relative isolate w-full max-w-full overflow-hidden rounded-3xl border border-white/10 dark:border-white/8 select-none aspect-[16/9] sm:aspect-[16/8] lg:aspect-[16/7] min-h-[250px] sm:min-h-[320px] lg:min-h-[420px] max-h-[620px] shadow-[0_20px_60px_-10px_rgba(139,92,246,0.25)] dark:shadow-[0_20px_80px_-10px_rgba(16,185,129,0.18)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Slide content */}
        <div
          key={active}
          className={`absolute inset-0 ${animating ? (direction === "next" ? "fcs-slide-out-next" : "fcs-slide-out-prev") : (direction === "next" ? "fcs-slide-in-next" : "fcs-slide-in-prev")}`}
        >
          <Image
            src={thumb}
            alt={slide.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 1440px"
            unoptimized={thumb.startsWith("data:")}
            priority
          />

          {/* Multi-layer gradient */}
          <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/10" />

          {/* Content */}
          <Link
            href={href}
            className="absolute inset-0 flex flex-col justify-end p-3 sm:p-6 md:p-10 lg:p-14 group/link focus:outline-none"
            tabIndex={0}
          >
            <div className="w-full max-w-full min-w-0 rounded-2xl bg-black/40 p-4 backdrop-blur-md sm:rounded-none sm:bg-transparent sm:p-0 sm:backdrop-blur-0">
              {/* Badge row */}
              <div className="flex items-center gap-3 mb-2 sm:mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-widest rounded-full bg-primary/80 text-white backdrop-blur-sm border border-primary/30 shadow-lg">
                  ফিচার্ড কোর্স
                </span>
              </div>

              <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white mb-2 sm:mb-3 leading-tight drop-shadow-lg max-w-full sm:max-w-[78%] lg:max-w-[65%] tracking-tight break-words">
                {slide.title}
              </h2>

              {desc && (
                <p className="text-white/75 text-[11px] sm:text-sm md:text-base max-w-full sm:max-w-xl mb-3 sm:mb-5 line-clamp-2 leading-relaxed break-words">
                  {desc}
                </p>
              )}

              <span className="inline-flex w-fit max-w-full items-center gap-2 text-sm sm:text-base font-semibold text-emerald-200 group-hover/link:text-white group-hover/link:gap-3 transition-all duration-300">
                বিস্তারিত দেখো
                <BsChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/link:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>

        {/* Nav arrows — only when multiple slides */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Previous slide"
              className="absolute left-1 top-1/2 -translate-y-1/2 sm:left-5 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/55 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <BsChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Next slide"
              className="absolute right-1 top-1/2 -translate-y-1/2 sm:right-5 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/30 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/55 hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <BsChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </>
        )}

        {/* Bottom controls bar */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i, i > active ? "next" : "prev")}
                aria-label={`Go to slide ${i + 1}`}
                className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-400 focus:outline-none ${
                  i === active
                    ? "w-7 bg-white/30"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
              >
                {i === active && !paused && (
                  <span
                    key={progressKey}
                    className="fcs-progress-bar absolute inset-y-0 left-0 bg-white rounded-full"
                  />
                )}
                {i === active && paused && (
                  <span className="absolute inset-y-0 left-0 w-full bg-white/70 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Slide counter top-right */}
        {slides.length > 1 && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 text-[10px] sm:text-[11px] font-semibold text-white/50 tabular-nums tracking-wide select-none">
            {englishToBanglaNumbers(active + 1)} / {englishToBanglaNumbers(slides.length)}
          </div>
        )}
      </div>
    </>
  );
}
