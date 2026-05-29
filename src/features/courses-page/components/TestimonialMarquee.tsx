"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { Feedback } from "../_lib/types";

// ─── Static fallback ───────────────────────────────────────────────────────────

const staticTestimonials: Feedback[] = [
  {
    name: "Tahmid Mahmud",
    bio: "CP101 Student",
    description:
      "The course was a whole itself. I still managed to get a decent knowledge about the problems, processes of thinking a way, making the solution efficient and much more.",
    imageUploadedLink: "",
  },
  {
    name: "Israt Tamanna",
    bio: "CP101 Student",
    description:
      "The instructors are incredibly supportive and the content is top-notch. Highly recommended!",
    imageUploadedLink: "",
  },
  {
    name: "Salman Farsi",
    bio: "CP101 Student",
    description:
      "Learnt some tricks, got familiar with some resources & could figure out my weaknesses.",
    imageUploadedLink: "",
  },
  {
    name: "Minara Munmun",
    bio: "CP101 Student",
    description:
      "I managed to get a decent knowledge about the problems, processes of thinking a way and making the solution efficient.",
    imageUploadedLink: "",
  },
  {
    name: "Tohidur Mujahid",
    bio: "CP101 Student",
    description:
      "Your course design was the best. Everything was well structured and easy to follow.",
    imageUploadedLink: "",
  },
  {
    name: "Nadia Akter",
    bio: "Web Development Student",
    description:
      "Best investment I made for my career. The live classes and community support are exceptional!",
    imageUploadedLink: "",
  },
  {
    name: "Tanvir Ahmed",
    bio: "CP101 Student",
    description:
      "From zero to hero in competitive programming. This course changed my approach to problem-solving completely.",
    imageUploadedLink: "",
  },
  {
    name: "Fahmida Khatun",
    bio: "App Development Student",
    description:
      "The structured approach and real-world projects helped me land my dream internship. Forever grateful!",
    imageUploadedLink: "",
  },
  {
    name: "Rakib Hassan",
    bio: "CP101 Student",
    description:
      "The problem-solving techniques taught here are world-class. I've improved my Codeforces rating significantly!",
    imageUploadedLink: "",
  },
  {
    name: "Sumaiya Akter",
    bio: "CP101 Student",
    description:
      "Finally found a course that explains complex algorithms in Bengali. Made learning so much easier for me.",
    imageUploadedLink: "",
  },
  {
    name: "Mehedi Hasan",
    bio: "CP101 Student",
    description:
      "The contest practice sessions were amazing. I feel prepared for ICPC now!",
    imageUploadedLink: "",
  },
  {
    name: "Sadia Rahman",
    bio: "CP101 Student",
    description:
      "Amazing experience! The practice problems were challenging but helped me grow as a programmer.",
    imageUploadedLink: "",
  },
];

// ─── Single card ───────────────────────────────────────────────────────────────

function TestimonialCard({ feedback }: { feedback: Feedback }) {
  return (
    <div className="flex-shrink-0 w-[300px] md:w-[340px] bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8 dark:hover:border-emerald-500/25 dark:hover:shadow-emerald-400/10 transition-all duration-300">
      {/* Quote icon + stars */}
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
          <Quote className="size-4 text-primary" />
        </div>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="size-3 fill-warning text-warning" />
          ))}
          <span className="text-muted-foreground text-xs ml-1.5">5.0</span>
        </div>
      </div>

      {/* Review text */}
      <p className="text-sm text-paragraph leading-relaxed line-clamp-3 flex-1">
        &ldquo;{feedback.description}&rdquo;
      </p>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Author */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 overflow-hidden flex items-center justify-center shrink-0">
          {feedback.imageUploadedLink ? (
            <Image
              src={feedback.imageUploadedLink}
              alt={feedback.name}
              width={36}
              height={36}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-primary font-bold text-sm">
              {feedback.name?.charAt(0) || "?"}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-heading leading-none mb-0.5">
            {feedback.name}
          </p>
          <p className="text-xs text-muted-foreground">{feedback.bio}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Marquee row ───────────────────────────────────────────────────────────────

function MarqueeRow({
  items,
  reverse = false,
  paused,
}: {
  items: Feedback[];
  reverse?: boolean;
  paused: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div
        className={`flex gap-5 w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {doubled.map((feedback, i) => (
          <TestimonialCard key={`${feedback.name}-${i}`} feedback={feedback} />
        ))}
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────────

export interface TestimonialMarqueeProps {
  feedbacks?: Feedback[];
}

export default function TestimonialMarquee({
  feedbacks = [],
}: TestimonialMarqueeProps) {
  const [paused, setPaused] = useState(false);

  const hasProperNames =
    feedbacks.filter(
      (f) => f.name && !f.name.toLowerCase().includes("anonymous"),
    ).length >
    feedbacks.length / 2;

  const source =
    feedbacks.length > 0 && hasProperNames ? feedbacks : staticTestimonials;

  const row1 = source.filter((_, i) => i % 2 === 0);
  const row2 = source.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative py-16 md:py-20 bg-section-a overflow-hidden dark:border-t dark:border-white/5">
      {/* Math motif background */}
      <div
        aria-hidden
        className="absolute top-1 -left-10 md:-left-10 text-[12rem] md:text-[25rem] text-primary/10 font-serif font-black select-none pointer-events-none leading-none z-0 animate-motif-float"
        style={{ ["--motif-rot" as string]: "12deg", ["--motif-tx" as string]: "12px", ["--motif-ty" as string]: "-14px", ["--motif-dr" as string]: "2deg", animationDuration: "14s" }}
      >
        Δ
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 lg:px-12 mb-12 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">
          শিক্ষার্থীদের মতামত
        </p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading leading-tight mb-4">
          তাদের অভিজ্ঞতা, আপনার অনুপ্রেরণা
        </h2>
        <p className="text-base text-paragraph max-w-xl mx-auto">
          হাজারো শিক্ষার্থীর সাফল্যের গল্প — তাদের কথায় জানুন MathPro কীভাবে
          পরিবর্তন এনেছে।
        </p>
      </div>

      {/* Tilted marquee area — same sleek vibe as before */}
      <div
        className="relative z-10 py-6"
        style={{ transform: "rotate(-2deg) scale(1.03)", transformOrigin: "center center" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 md:w-56 z-10 pointer-events-none bg-gradient-to-r from-section-a to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-32 md:w-56 z-10 pointer-events-none bg-gradient-to-l from-section-a to-transparent" />

        <div className="flex flex-col gap-5">
          <MarqueeRow items={row1} paused={paused} />
          <MarqueeRow items={row2} reverse paused={paused} />
        </div>
      </div>
    </section>
  );
}
