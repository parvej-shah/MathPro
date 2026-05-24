"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Video, FileText } from "lucide-react";

// ─── Deterministic gradient from title ───────────────────────────────────────

const gradients = [
  "from-[#0f172a] via-[#1e3a8a] to-[#312e81]",
  "from-[#4c1d95] via-[#581c87] to-[#701a75]",
  "from-[#7f1d1d] via-[#991b1b] to-[#450a0a]",
  "from-[#064e3b] via-[#065f46] to-[#047857]",
  "from-[#1d4ed8] via-[#2563eb] to-[#3b82f6]",
  "from-[#db2777] via-[#be185d] to-[#831843]",
];

function pickGradient(title: string): string {
  let hash = 2166136261;
  for (let i = 0; i < title.length; i++) {
    hash ^= title.charCodeAt(i);
    hash = (hash * 16777619) >>> 0;
  }
  return gradients[hash % gradients.length];
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LandingStyleCourseCardProps {
  id: number | string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  href: string;
  price: number;
  originalPrice?: number;
  tags?: string[];
  isLive?: boolean;
  hasRecorded?: boolean;
  hasExam?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function LandingStyleCourseCard({
  title,
  description,
  thumbnail,
  href,
  price,
  originalPrice,
  tags = [],
  isLive,
  hasRecorded = true,
  hasExam = true,
}: LandingStyleCourseCardProps) {
  const [imgError, setImgError] = useState(false);
  const gradient = useMemo(() => pickGradient(title), [title]);

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const formatPrice = (n: number) =>
    "৳" + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 0 }).format(n);

  const showThumbnail = thumbnail && !imgError;

  return (
    <div className="group bg-card rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 flex flex-col">

      {/* ── Banner ──────────────────────────────────────────────────── */}
      <div className={`relative h-48 w-full overflow-hidden flex flex-col justify-center items-center text-center bg-gradient-to-tr ${gradient}`}>
        {showThumbnail ? (
          <Image
            src={thumbnail!}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.12) 1px, transparent 0)",
                backgroundSize: "16px 16px",
              }}
            />
            <h4 className="text-white font-extrabold text-xl lg:text-2xl z-10 leading-tight px-6 drop-shadow-md line-clamp-2">
              {title.split("|")[0].trim()}
            </h4>
          </>
        )}

        {/* MathPro watermark */}
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2.5 py-1 flex items-center justify-center rounded-xl z-20 font-bold text-white text-[11px] tracking-wide">
          MathPro
        </div>

        {/* Live badge */}
        {isLive !== undefined && (
          <div className="absolute top-4 left-4 z-20">
            {isLive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-success text-success-foreground shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                লাইভ
              </span>
            ) : (
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-info text-info-foreground shadow">
                আপকামিং
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div className="p-6 flex flex-col flex-1">

        {/* Tags + price */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-extrabold uppercase tracking-widest border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-destructive/8 text-destructive text-sm font-extrabold px-3.5 py-1.5 border border-destructive/20 shadow-sm whitespace-nowrap">
            {formatPrice(price)}
            {discount > 0 && (
              <span className="text-xs font-bold text-success">−{discount}%</span>
            )}
          </div>
        </div>

        {/* Title */}
        <Link
          href={href}
          className="font-extrabold text-xl text-heading leading-snug mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2 focus:outline-none focus-visible:underline"
        >
          {title}
        </Link>

        {/* Description */}
        {description && (
          <p className="text-base font-medium text-paragraph mb-6 leading-relaxed line-clamp-3 flex-1">
            {description}
          </p>
        )}

        {/* ── CTA buttons ─────────────────────────────────────────── */}
        <div className="mt-auto flex gap-3 pt-5 border-t border-border">
          {hasRecorded && (
            <Link
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3.5 rounded-2xl bg-muted hover:bg-foreground text-muted-foreground hover:text-background text-xs font-extrabold transition-all duration-300 border border-border hover:border-foreground hover:shadow-lg hover:shadow-foreground/20 hover:-translate-y-0.5"
            >
              <div className="p-1.5 rounded-full bg-border/60 group-hover:bg-white/20 transition-colors">
                <PlayCircle className="size-5" />
              </div>
              রেকর্ডেড
            </Link>
          )}

          {isLive !== undefined && (
            <Link
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3.5 rounded-2xl bg-destructive/8 hover:bg-destructive text-destructive hover:text-white text-xs font-extrabold transition-all duration-300 border border-destructive/20 hover:border-destructive hover:shadow-lg hover:shadow-destructive/30 hover:-translate-y-0.5 relative overflow-hidden"
            >
              {isLive && (
                <span className="absolute top-2.5 right-2.5 flex size-2.5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex rounded-full size-2 bg-destructive" />
                </span>
              )}
              <div className="p-1.5 rounded-full bg-destructive/15 transition-colors">
                <Video className="size-5" />
              </div>
              লাইভ
            </Link>
          )}

          {hasExam && (
            <Link
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3.5 rounded-2xl bg-warning/10 hover:bg-warning text-warning hover:text-warning-foreground text-xs font-extrabold transition-all duration-300 border border-warning/30 hover:border-warning hover:shadow-lg hover:shadow-warning/30 hover:-translate-y-0.5"
            >
              <div className="p-1.5 rounded-full bg-warning/20 transition-colors">
                <FileText className="size-5" />
              </div>
              পরীক্ষা
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
