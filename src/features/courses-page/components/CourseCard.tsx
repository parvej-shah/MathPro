"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsPeopleFill, BsStar, BsPlayCircleFill } from "react-icons/bs";

// ─── Placeholder thumbnail ────────────────────────────────────────────────────

const colorPairs: [string, string][] = [
  ["#2e9e6b", "#1a7a50"],
  ["#0EA5E9", "#2e9e6b"],
  ["#10B981", "#0EA5E9"],
  ["#f59e0b", "#ef4444"],
  ["#6366f1", "#2e9e6b"],
  ["#14B8A6", "#3B82F6"],
];

function makePlaceholder(title: string): string {
  let hash = 2166136261;
  for (let i = 0; i < title.length; i++) {
    hash ^= title.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  const [c1, c2] = colorPairs[hash % colorPairs.length];
  const words = title.replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
  const initials = words.slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><circle cx="640" cy="80" r="110" fill="rgba(255,255,255,0.07)"/><circle cx="120" cy="390" r="80" fill="rgba(255,255,255,0.05)"/><text x="400" y="260" font-family="Arial,sans-serif" font-size="130" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CourseCardProps {
  id: number | string;
  title: string;
  thumbnail?: string | null;
  href: string;
  price: number;
  originalPrice?: number;
  enrolled?: number;
  categoryLabel?: string;
  isLive?: boolean;
  introVideoUrl?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CourseCard({
  title,
  thumbnail,
  href,
  price,
  originalPrice,
  enrolled,
  categoryLabel,
  isLive,
  introVideoUrl,
}: CourseCardProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const fallback = useMemo(() => makePlaceholder(title), [title]);
  const thumb = thumbnail || fallback;

  const formatPrice = (n: number) =>
    "৳" + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 0 }).format(n);

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300">

      {/* ── Thumbnail ─────────────────────────────────────────────────── */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {introVideoUrl && videoPlaying ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`${introVideoUrl}?rel=0&autoplay=1&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <Image
              src={thumb}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={thumb.startsWith("data:")}
              onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {introVideoUrl && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setVideoPlaying(true); }}
                aria-label="Play intro video"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <span className="w-14 h-14 rounded-full bg-card/90 flex items-center justify-center shadow-lg">
                  <BsPlayCircleFill className="w-8 h-8 text-primary" />
                </span>
              </button>
            )}
          </>
        )}

        {/* Category / status badge — top-left */}
        <div className="absolute top-2.5 left-2.5 z-10">
          {categoryLabel ? (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary text-primary-foreground shadow">
              {categoryLabel}
            </span>
          ) : isLive !== undefined ? (
            isLive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-success text-success-foreground shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                লাইভ
              </span>
            ) : (
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-info text-info-foreground shadow">
                আপকামিং
              </span>
            )
          ) : null}
        </div>

        {/* Star bookmark — top-right */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="w-7 h-7 flex items-center justify-center rounded-full bg-card/90 shadow">
            <BsStar className="w-3.5 h-3.5 text-yellow fill-yellow" />
          </span>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <Link
        href={href}
        className="flex flex-col flex-1 p-4 gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-b-2xl"
      >
        {/* Title */}
        <h3 className="text-[15px] font-bold text-heading leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>

        {/* Enrolled count */}
        {enrolled !== undefined && (
          <div className="flex items-center gap-1.5 text-[13px] text-paragraph">
            <BsPeopleFill className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{new Intl.NumberFormat("en-BD").format(enrolled)} students</span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-baseline justify-between mt-auto pt-2 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-primary">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          {discount > 0 && (
            <span className="text-xs font-bold text-success uppercase tracking-wide">
              {discount}% OFF
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
