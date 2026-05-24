import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BsBook,
  BsChevronRight,
  BsPlayCircle,
  BsPeople,
  BsCameraVideo,
} from "react-icons/bs";
import { FaLanguage } from "react-icons/fa";
import { Course } from "../_lib/types";

interface PremiumCourseCardProps {
  course: Course;
}

// Color map for gradient hex values
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

// All available gradients - diverse color palette
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
  return position === "from" ? "#a855f7" : "#14b8a6"; // fallback to purple/teal
};

// Truncate text helper
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
};

// Generate placeholder thumbnail matching dashboard style
const generatePlaceholderThumbnail = (courseName: string): string => {
  // Extract all words and create initials from first three words
  const words = courseName
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
    initials = courseName.substring(0, 3).toUpperCase();
  }

  // FNV-1a hash for consistent gradient selection
  let hash = 2166136261;
  for (let i = 0; i < courseName.length; i++) {
    hash ^= courseName.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const index = Math.abs(hash >>> 0) % allGradients.length;
  const selectedGradient = allGradients[index];

  const fromColor = getGradientColor(selectedGradient, "from");
  const toColor = getGradientColor(selectedGradient, "to");

  // Generate SVG with modern gradient design
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
      
      <!-- Background gradient -->
      <rect width="800" height="450" fill="url(#grad)"/>
      
      <!-- Grid pattern overlay -->
      <rect width="800" height="450" fill="url(#grid)"/>
      
      <!-- Decorative circles -->
      <circle cx="650" cy="80" r="120" fill="rgba(255,255,255,0.08)"/>
      <circle cx="100" cy="380" r="80" fill="rgba(255,255,255,0.06)"/>
      
      <!-- Course initials -->
      <text x="400" y="250" font-family="Arial, sans-serif" font-size="140" font-weight="bold" 
            fill="white" text-anchor="middle" opacity="0.95">${initials}</text>
      
      <!-- Course title -->
      <text x="400" y="320" font-family="Arial, sans-serif" font-size="20" font-weight="500" 
            fill="white" text-anchor="middle" opacity="0.8">${truncateText(courseName, 40)}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export default function PremiumCourseCard({ course }: PremiumCourseCardProps) {
  const discount =
    course.x_price > course.price
      ? Math.round(((course.x_price - course.price) / course.x_price) * 100)
      : 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  const thumbnail =
    course.chips?.thumbnails?.course_thumbnail_link_16_9 ||
    course.chips?.course_thumbnail_link;

  // Generate fallback thumbnail using the same approach as dashboard
  const fallbackThumbnail = useMemo(
    () => generatePlaceholderThumbnail(course.title),
    [course.title]
  );

  const instructors = course.instructor_list?.instructors || [];

  return (
    <div className="group bg-background/50 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-border dark:border-border/50 backdrop-blur-sm flex flex-col h-full transform hover:-translate-y-1">
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={thumbnail || fallbackThumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // Fallback to placeholder if image fails
            const target = e.target as HTMLImageElement;
            target.src = fallbackThumbnail;
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badge Pills */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {course.is_live ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success/90 text-white backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              লাইভ
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/90 text-white backdrop-blur-md shadow-lg">
              আপকামিং
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-yellow text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {discount}% ছাড়
          </div>
        )}

        {/* Instructor Avatars on Hover */}
        {instructors.length > 0 && (
          <div className="absolute bottom-3 left-3 flex -space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            {instructors.slice(0, 3).map((instructor, idx) => (
              (() => {
                const instructorImage =
                  typeof instructor.image === "string"
                    ? instructor.image.trim()
                    : "";
                return (
              <div
                key={instructor.name || idx}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-purple/20"
                title={instructor.name}
              >
                {instructorImage ? (
                  <Image
                    src={instructorImage}
                    alt={instructor.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-purple text-white text-xs font-bold">
                    {instructor.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
                );
              })()
            ))}
            {instructors.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-800 text-white text-xs font-bold flex items-center justify-center">
                +{instructors.length - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="text-lg font-bold text-heading dark:text-darkHeading mb-2 line-clamp-2 group-hover:text-purple transition-colors duration-300">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-paragraph dark:text-darkParagraph mb-4 line-clamp-2 flex-grow">
          {course.short_description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {course.chips?.sections?.chapter && (
            <div className="flex items-center gap-2 text-xs">
              <BsBook className="text-teal flex-shrink-0" />
              <span className="text-paragraph dark:text-darkParagraph truncate">
                {course.chips.sections.chapter.value} চ্যাপ্টার
              </span>
            </div>
          )}
          {course.chips?.sections?.video && (
            <div className="flex items-center gap-2 text-xs">
              <BsCameraVideo className="text-purple flex-shrink-0" />
              <span className="text-paragraph dark:text-darkParagraph truncate">
                {course.chips.sections.video.value} ভিডিও
              </span>
            </div>
          )}
          {course.chips?.sections?.liveClass && (
            <div className="flex items-center gap-2 text-xs">
              <BsPlayCircle className="text-yellow flex-shrink-0" />
              <span className="text-paragraph dark:text-darkParagraph truncate">
                {course.chips.sections.liveClass.value} লাইভ ক্লাস
              </span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs">
            <BsPeople className="text-[#EE4878] flex-shrink-0" />
            <span className="text-paragraph dark:text-darkParagraph truncate">
              {course.enrolled} শিক্ষার্থী
            </span>
          </div>
        </div>

        {/* Language Badge */}
        <div className="flex items-center gap-2 mb-4">
          <FaLanguage className="text-sm text-purple" />
          <span className="text-xs text-paragraph dark:text-darkParagraph">
            {course.language}
          </span>
        </div>

        {/* Price and CTA Section with Glassmorphism */}
        <div className="mt-auto pt-4 border-t border-border dark:border-border/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-heading dark:text-darkHeading">
                {formatPrice(course.price)}
              </span>
              {course.x_price > course.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(course.x_price)}
                </span>
              )}
            </div>
          </div>

          {/* CTA Button */}
          <Link href={`/course-details/${course.id}`}>
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
