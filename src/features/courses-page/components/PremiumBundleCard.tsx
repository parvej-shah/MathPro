import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsBook, BsChevronRight, BsPlayCircle, BsCameraVideo } from "react-icons/bs";
import { Bundle } from "../_lib/types";
import { getYouTubeThumbnail } from "@/features/course-details/_lib/youtubeHelpers";

interface PremiumBundleCardProps {
  bundle: Bundle;
}

// Color map for gradient hex values (same as PremiumCourseCard)
const colorMap: Record<string, string> = {
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "cyan-500": "#06b6d4",
  "purple-500": "#a855f7",
  "purple-600": "#9333ea",
  "pink-500": "#ec4899",
  "pink-600": "#db2777",
  "green-500": "#22c55e",
  "green-600": "#16a34a",
  "teal-500": "#14b8a6",
  "yellow-500": "#eab308",
  "orange-500": "#f97316",
  "orange-600": "#ea580c",
  "indigo-500": "#6366f1",
  "indigo-600": "#4f46e5",
  "red-500": "#ef4444",
  "red-600": "#dc2626",
  "rose-500": "#f43f5e",
  "fuchsia-500": "#d946ef",
  "violet-500": "#8b5cf6",
  "lime-500": "#84cc16",
  "amber-500": "#f59e0b",
  "sky-500": "#0ea5e9",
  "emerald-500": "#10b981",
  "emerald-600": "#059669",
};

// All available gradients
const allGradients = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-green-500 to-teal-500",
  "from-yellow-500 to-orange-500",
  "from-indigo-500 to-purple-500",
  "from-red-500 to-rose-500",
  "from-pink-500 to-fuchsia-500",
  "from-orange-500 to-red-500",
  "from-cyan-500 to-blue-500",
  "from-teal-500 to-green-500",
  "from-violet-500 to-purple-500",
  "from-lime-500 to-green-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-500",
  "from-rose-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-fuchsia-500 to-pink-600",
  "from-blue-600 to-indigo-600",
  "from-green-600 to-emerald-600",
  "from-orange-600 to-red-600",
];

// Helper function to extract gradient colors
const getGradientColor = (
  gradientClass: string,
  position: "from" | "to"
): string => {
  const match = gradientClass.match(
    position === "from" ? /from-(\S+)/ : /to-(\S+)/
  );
  if (match && colorMap[match[1]]) {
    return colorMap[match[1]];
  }
  return position === "from" ? "#a855f7" : "#14b8a6";
};

// Truncate text helper
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

// Generate placeholder thumbnail
const generatePlaceholderThumbnail = (bundleName: string): string => {
  const words = bundleName
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0);

  let initials = "";
  if (words.length >= 3) {
    initials =
      words[0].charAt(0).toUpperCase() +
      words[1].charAt(0).toUpperCase() +
      words[2].charAt(0).toUpperCase();
  } else if (words.length === 2) {
    initials =
      words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
  } else if (words.length === 1) {
    initials = words[0].substring(0, 3).toUpperCase();
  } else {
    initials = bundleName.substring(0, 3).toUpperCase();
  }

  // FNV-1a hash for consistent gradient selection
  let hash = 2166136261;
  for (let i = 0; i < bundleName.length; i++) {
    hash ^= bundleName.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const index = Math.abs(hash >>> 0) % allGradients.length;
  const selectedGradient = allGradients[index];

  const fromColor = getGradientColor(selectedGradient, "from");
  const toColor = getGradientColor(selectedGradient, "to");

  const svg = `
    <svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${fromColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${toColor};stop-opacity:1" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
        </pattern>
      </defs>
      
      <rect width="800" height="450" fill="url(#grad)"/>
      <rect width="800" height="450" fill="url(#grid)"/>
      
      <circle cx="650" cy="80" r="120" fill="rgba(255,255,255,0.08)"/>
      <circle cx="100" cy="380" r="80" fill="rgba(255,255,255,0.06)"/>
      
      <text x="400" y="250" font-family="Arial, sans-serif" font-size="140" font-weight="bold" 
            fill="white" text-anchor="middle" opacity="0.95">${initials}</text>
      
      <text x="400" y="320" font-family="Arial, sans-serif" font-size="20" font-weight="500" 
            fill="white" text-anchor="middle" opacity="0.8">${truncateText(bundleName, 40)}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Extract number from Bengali/English mixed strings
const extractNumber = (value: string | undefined): number => {
  if (!value) return 0;
  const match = value.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function PremiumBundleCard({ bundle }: PremiumBundleCardProps) {
  const [showVideo, setShowVideo] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  // Priority: intro_video thumbnail > bundle_thumb_16_9 > bundle_thumb_4_3 > fallback
  const thumbnail = useMemo(() => {
    if (bundle.intro_video) {
      return getYouTubeThumbnail(bundle.intro_video);
    }
    return (
      bundle.chips?.thumbnails?.bundle_thumb_16_9 ||
      bundle.chips?.thumbnails?.bundle_thumb_4_3 ||
      null
    );
  }, [bundle.intro_video, bundle.chips?.thumbnails]);

  // Generate fallback thumbnail
  const fallbackThumbnail = useMemo(
    () => generatePlaceholderThumbnail(bundle.title),
    [bundle.title]
  );

  const hasVideo = !!bundle.intro_video;

  return (
    <div className="group bg-background/50 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border dark:border-gray-700/50 backdrop-blur-sm flex flex-col h-full transform hover:-translate-y-1">
      {/* Thumbnail/Video Container */}
      <div className="relative aspect-video overflow-hidden">
        {hasVideo && showVideo ? (
          <iframe
            className="w-full h-full"
            src={`${bundle.intro_video}?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1`}
            title={bundle.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={thumbnail || fallbackThumbnail}
              alt={bundle.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                // Fallback to placeholder if image fails
                const target = e.target as HTMLImageElement;
                target.src = fallbackThumbnail;
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* YouTube-Style Play Button Overlay */}
            {hasVideo && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowVideo(true);
                }}
                className="absolute inset-0 flex items-center justify-center group"
              >
                {/* Large YouTube Play Button */}
                <div className="relative">
                  {/* Red YouTube Button Background */}
                  <div className="w-24 h-16 lg:w-32 lg:h-20 rounded-2xl bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-all duration-300 shadow-2xl">
                    {/* White Play Triangle */}
                    <svg
                      className="w-10 h-10 lg:w-12 lg:h-12 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </button>
            )}
          </>
        )}

        {/* Badge Pills - Match course card style */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {bundle.is_live ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/90 text-white backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              লাইভ
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/90 text-white backdrop-blur-md shadow-lg">
              আপকামিং
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-heading dark:text-darkHeading mb-2 line-clamp-2 group-hover:text-purple transition-colors duration-300">
          {bundle.title}
        </h3>

        {/* Description */}
        {bundle.short_description && (
          <p className="text-sm text-paragraph dark:text-darkParagraph mb-4 line-clamp-2 flex-grow">
            {bundle.short_description}
          </p>
        )}

        {/* Stats Row - Match course card layout */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {bundle.chips?.sections?.liveClass && (
            <div className="flex items-center gap-2 text-xs">
              <BsPlayCircle className="text-yellow flex-shrink-0" />
              <span className="text-paragraph dark:text-darkParagraph truncate">
                {bundle.chips.sections.liveClass.value} লাইভ ক্লাস
              </span>
            </div>
          )}
          {bundle.chips?.sections?.video && (
            <div className="flex items-center gap-2 text-xs">
              <BsCameraVideo className="text-purple flex-shrink-0" />
              <span className="text-paragraph dark:text-darkParagraph truncate">
                {bundle.chips.sections.video.value} ভিডিও
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs">
            <BsBook className="text-teal flex-shrink-0" />
            <span className="text-paragraph dark:text-darkParagraph truncate">
              {bundle.course_count}টি কোর্স
            </span>
          </div>
        </div>

        {/* Price and CTA Section */}
        <div className="mt-auto pt-4 border-t border-border dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-heading dark:text-darkHeading">
                {formatPrice(bundle.price)}
              </span>
            </div>
          </div>

          {/* CTA Button - Match course card style */}
          <Link href={bundle.url || `/bundle/${bundle.id}`}>
            <button className="w-full bg-gradient-to-r from-purple to-purple/80 hover:from-purple/90 hover:to-purple text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-lg shadow-purple/20 hover:shadow-xl hover:shadow-purple/30">
              বিস্তারিত দেখুন
              <BsChevronRight className="transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

