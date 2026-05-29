"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instructor } from "../_lib/types";
import { GraduationCap, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

interface TeacherSliderProps {
  instructors: Instructor[];
}

const CARDS_PER_PAGE = 4;

export default function TeacherSlider({ instructors }: TeacherSliderProps) {
  const [page, setPage] = useState(0);

  if (!instructors || instructors.length === 0) return null;

  const totalPages = Math.ceil(instructors.length / CARDS_PER_PAGE);
  const visible = instructors.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE);

  return (
    <section className="relative py-16 bg-section-b overflow-hidden dark:border-t dark:border-white/5">
      {/* Math motif background */}
      <div
        aria-hidden
        className="absolute -top-10 -left-10 md:-left-6 text-[10rem] md:text-[18rem] text-primary/10 font-serif font-black select-none pointer-events-none leading-none z-0 animate-motif-float"
        style={{ ["--motif-rot" as string]: "-12deg", ["--motif-tx" as string]: "12px", ["--motif-ty" as string]: "-10px", ["--motif-dr" as string]: "3deg", animationDuration: "13s" }}
      >
        ∞
      </div>

      <div className="relative z-10 w-[90%] lg:w-[85%] max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
              আমাদের শিক্ষকমণ্ডলী
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-heading leading-tight">
              সেরাদের কাছ থেকে শিখুন
            </h2>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary dark:hover:border-emerald-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="text-xs text-muted-foreground tabular-nums">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                disabled={page === totalPages - 1}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary dark:hover:border-emerald-500/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {visible.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-primary/8 dark:hover:shadow-emerald-400/12 dark:hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Photo */}
              <div className="relative h-52 w-full bg-muted overflow-hidden">
                {instructor.image ? (
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-5xl font-extrabold text-muted-foreground/30">
                      {instructor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-extrabold text-heading text-base leading-snug mb-1">
                  {instructor.name}
                </h3>

                {instructor.role && (
                  <p className="text-sm font-semibold text-primary mb-2 line-clamp-1">
                    {instructor.role}
                  </p>
                )}

                <div className="flex flex-col gap-1.5 mt-auto">
                  {instructor.university && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <GraduationCap className="size-3.5 shrink-0 text-primary/70" />
                      <span className="line-clamp-1">{instructor.university}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <BookOpen className="size-3.5 shrink-0 text-primary/70" />
                    <span>{instructor.coursesCount} টি কোর্স</span>
                  </div>
                </div>

                {/* Social links */}
                {instructor.social && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                    {instructor.social.facebook && (
                      <a
                        href={instructor.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                        aria-label="Facebook"
                      >
                        <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    )}
                    {instructor.social.linkedin && (
                      <a
                        href={instructor.social.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                        aria-label="LinkedIn"
                      >
                        <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                    )}
                    {instructor.social.github && (
                      <a
                        href={instructor.social.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                        aria-label="GitHub"
                      >
                        <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                    {instructor.social.website && (
                      <a
                        href={instructor.social.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
                        aria-label="Website"
                      >
                        <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </a>
                    )}

                    <Link
                      href="#courses-grid"
                      className="ml-auto text-xs font-bold text-primary hover:underline whitespace-nowrap"
                    >
                      কোর্স দেখুন →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
