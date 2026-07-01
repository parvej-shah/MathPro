"use client";

import Image from "next/image";
import { GraduationCap, BookOpen, Users } from "lucide-react";
import type { Instructor } from "../_lib/types";

interface AboutSectionProps {
  instructors: Instructor[];
}

function SocialLinks({ social }: { social: Instructor["social"] }) {
  if (!social) return null;
  const links = [
    { key: "facebook", href: social.facebook, label: "Facebook", icon: (
      <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )},
    { key: "linkedin", href: social.linkedin, label: "LinkedIn", icon: (
      <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    )},
    { key: "github", href: social.github, label: "GitHub", icon: (
      <svg className="size-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    )},
    { key: "website", href: social.website, label: "Website", icon: (
      <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    )},
  ].filter((l) => !!l.href);

  if (links.length === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
      {links.map(({ key, href, label, icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all"
        >
          {icon}
        </a>
      ))}
    </div>
  );
}


function SingleInstructor({ instructor }: { instructor: Instructor }) {
  return (
    <section className="bg-section-a relative overflow-hidden py-10 sm:py-14 lg:py-20">
      <div className="container mx-auto px-6 sm:px-12 lg:px-24 xl:px-36 grid lg:grid-cols-[1fr_40%] gap-6 lg:gap-10 items-stretch min-h-125">
        {/* Left — content */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          <div className="max-w-xl">
            <div className="h-1 w-16 bg-primary rounded-full mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
              আমার সম্পর্কে
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-heading font-heading mb-2">
              {instructor.name}
            </h2>
            {instructor.role && (
              <p className="text-lg md:text-xl font-semibold text-primary mb-5">{instructor.role}</p>
            )}
            {instructor.credibility && (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5">
                {instructor.credibility}
              </p>
            )}

            {instructor.achievements && instructor.achievements.length > 0 && (
              <ul className="flex flex-col gap-2.5 mb-5">
                {instructor.achievements.slice(0, 4).map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-0.5 size-4 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-[10px] font-bold">✓</span>
                    {a}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-col gap-2.5">
              {instructor.university && (
                <div className="flex items-center gap-2.5 text-base text-muted-foreground">
                  <GraduationCap className="size-5 shrink-0 text-primary" />
                  <span>{instructor.university}</span>
                </div>
              )}
              {instructor.coursesCount > 0 && (
                <div className="flex items-center gap-2.5 text-base text-muted-foreground">
                  <BookOpen className="size-5 shrink-0 text-primary" />
                  <span>{instructor.coursesCount} টি কোর্স</span>
                </div>
              )}
              {instructor.totalStudents > 0 && (
                <div className="flex items-center gap-2.5 text-base text-muted-foreground">
                  <Users className="size-5 shrink-0 text-primary" />
                  <span>{instructor.totalStudents.toLocaleString()} জন শিক্ষার্থী</span>
                </div>
              )}
            </div>

            <SocialLinks social={instructor.social} />
          </div>
        </div>

        {/* Right — photo */}
        <div className="relative aspect-square lg:aspect-auto lg:min-h-full rounded-2xl overflow-hidden bg-muted order-1 lg:order-2">
          {instructor.image ? (
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 30vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl font-extrabold text-muted-foreground/30">
                {instructor.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MultipleInstructors({ instructors }: { instructors: Instructor[] }) {
  return (
    <section className="py-24 bg-section-a relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading leading-tight mb-4">
            আমাদের সম্পর্কে
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            দেশের সেরা শিক্ষকদের সাথে গণিতের ভয় জয় করো। আমাদের বিশেষজ্ঞ শিক্ষকমণ্ডলী সবসময় তোমার পাশে।
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {instructors.map((instructor) => (
            <div
              key={instructor.id}
              className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/8 dark:hover:shadow-emerald-400/12 dark:hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Photo */}
              <div className="relative aspect-square w-full bg-muted overflow-hidden">
                {instructor.image ? (
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl font-extrabold text-muted-foreground/30">
                      {instructor.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-extrabold text-heading text-base leading-snug mb-1 font-heading">
                  {instructor.name}
                </h3>
                {instructor.role && (
                  <p className="text-sm font-semibold text-primary mb-3 line-clamp-1">
                    {instructor.role}
                  </p>
                )}

                {instructor.credibility && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                    {instructor.credibility}
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
                  {instructor.totalStudents > 0 && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="size-3.5 shrink-0 text-primary/70" />
                      <span>{instructor.totalStudents.toLocaleString()} জন শিক্ষার্থী</span>
                    </div>
                  )}
                </div>

                <SocialLinks social={instructor.social} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default function AboutSection({ instructors }: AboutSectionProps) {
  if (!instructors || instructors.length === 0) return null;

  if (instructors.length === 1) {
    return <SingleInstructor instructor={instructors[0]} />;
  }

  return <MultipleInstructors instructors={instructors} />;
}
