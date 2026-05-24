import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";
import { Course, Bundle } from "../_lib/types";
import { getYouTubeThumbnail } from "@/features/course-details/_lib/youtubeHelpers";

interface FeaturedCourseSliderProps {
  featuredBundle: Bundle | null;
  recentCourse: Course | null;
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

// Simple placeholder when no thumbnail (gradient with initials)
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
    course.chips?.thumbnails?.course_thumbnail_link_16_9 ||
    course.chips?.course_thumbnail_link ||
    getPlaceholderSrc(course.title)
  );
}

function getBundleThumbnail(bundle: Bundle): string {
  if (bundle.intro_video) {
    const yt = getYouTubeThumbnail(bundle.intro_video);
    if (yt) return yt;
  }
  return (
    bundle.chips?.thumbnails?.bundle_thumb_16_9 ||
    bundle.chips?.thumbnails?.bundle_thumb_4_3 ||
    getPlaceholderSrc(bundle.title)
  );
}

// Custom arrow components for world-class navigation
function PrevArrow(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Previous slide"
      className="featured-slider-prev absolute left-4 md:left-6 z-20 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-transparent"
    >
      <BsChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
}

function NextArrow(props: { onClick?: () => void }) {
  const { onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Next slide"
      className="featured-slider-next absolute right-4 md:right-6 z-20 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-transparent"
    >
      <BsChevronRight className="w-6 h-6 md:w-7 md:h-7" />
    </button>
  );
}

export default function FeaturedCourseSlider({
  featuredBundle,
  recentCourse,
}: FeaturedCourseSliderProps) {
  const slides = useMemo(() => {
    const items: Array<{ type: "bundle"; data: Bundle } | { type: "course"; data: Course }> = [];
    if (featuredBundle) items.push({ type: "bundle", data: featuredBundle });
    if (recentCourse) items.push({ type: "course", data: recentCourse });
    return items;
  }, [featuredBundle, recentCourse]);

  const settings = {
    dots: true,
    infinite: slides.length > 1,
    speed: 800,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: true,
    fade: false,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots: React.ReactNode) => (
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
        <ul className="flex items-center gap-2 m-0 p-0 list-none">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <span className="block w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-all duration-300 cursor-pointer" />
    ),
  };

  if (slides.length === 0) return null;

  return (
    <>
      <style jsx global>{`
        .featured-hero-slider {
          position: relative;
        }
        .featured-hero-slider .slick-slider {
          height: 100% !important;
          position: relative;
        }
        .featured-hero-slider .slick-list {
          height: 100% !important;
          min-height: 340px;
        }
        .featured-hero-slider .slick-track {
          height: 100% !important;
          display: flex !important;
        }
        .featured-hero-slider .slick-slide {
          height: 100%;
          float: none !important;
          width: 100% !important;
        }
        .featured-hero-slider .slick-slide > div {
          height: 100%;
        }
        .featured-hero-slider .slick-dots {
          position: absolute !important;
          bottom: 1.5rem;
          left: 0;
          right: 0;
        }
        .featured-hero-slider .slick-dots li {
          width: auto;
          height: auto;
          margin: 0 4px;
        }
        .featured-hero-slider .slick-dots li.slick-active span {
          width: 24px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.95);
        }
        .featured-hero-slider .slick-dots li span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transition: width 0.3s ease, background 0.3s ease;
        }
        .featured-hero-slider .slick-prev,
        .featured-hero-slider .slick-next {
          position: absolute !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          z-index: 20;
        }
        .featured-hero-slider .slick-prev {
          left: 1rem;
        }
        .featured-hero-slider .slick-next {
          right: 1rem;
        }
      `}</style>
      <div className="my-10 rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50 featured-hero-slider group flex flex-col h-[58vh] min-h-[340px] sm:h-[62vh] sm:min-h-[400px] md:h-[68vh] md:min-h-[460px] lg:h-[72vh] lg:min-h-[520px] xl:h-[75vh] xl:min-h-[560px]">
        <div className="flex-1 min-h-0 w-full relative">
          <Slider {...settings} className="h-full w-full">
          {slides.map((slide) => {
            if (slide.type === "bundle") {
              const bundle = slide.data;
              const href = bundle.url || `/bundle/${bundle.id}`;
              const thumb = getBundleThumbnail(bundle);
              const desc = truncateText(bundle.short_description || "", 160);
              return (
                <div key={`bundle-${bundle.id}`} className="relative outline-none h-full min-h-[340px]">
                  <Link
                    href={href}
                    className="block relative w-full h-full min-h-[340px]"
                  >
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={thumb}
                        alt={bundle.title}
                        fill
                        className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 1440px"
                        unoptimized={thumb.startsWith("data:")}
                        priority
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12 text-white">
                      <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold bg-purple/90 rounded-full border border-white/10">
                        বান্ডেল
                      </span>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-md tracking-tight">
                        {bundle.title}
                      </h2>
                      {desc && (
                        <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mb-5 line-clamp-2 leading-relaxed">
                          {desc}
                        </p>
                      )}
                      <span className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-purple-200 hover:text-white transition-all duration-300 group/cta">
                        বিস্তারিত দেখুন
                        <BsChevronRight className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </div>
              );
            }
            const course = slide.data;
            const href = `/course-details/${course.id}`;
            const thumb = getCourseThumbnail(course);
            const desc = truncateText(course.short_description || "", 160);
            return (
              <div key={`course-${course.id}`} className="relative outline-none h-full min-h-[340px]">
                <Link
                  href={href}
                  className="block relative w-full h-full min-h-[340px]"
                >
                  <div className="absolute inset-0 w-full h-full">
                    <Image
                      src={thumb}
                      alt={course.title}
                      fill
                      className="object-cover object-center transition-transform duration-[800ms] ease-out group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 1440px"
                      unoptimized={thumb.startsWith("data:")}
                      priority
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10 lg:p-12 text-white">
                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold bg-purple/90 rounded-full border border-white/10">
                      কোর্স
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 drop-shadow-md tracking-tight">
                      {course.title}
                    </h2>
                    {desc && (
                      <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mb-5 line-clamp-2 leading-relaxed">
                        {desc}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-purple-200 hover:text-white transition-all duration-300 group/cta">
                      বিস্তারিত দেখুন
                      <BsChevronRight className="w-5 h-5 transition-transform duration-300 group-hover/cta:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </div>
            );
          })}
          </Slider>
        </div>
      </div>
    </>
  );
}
