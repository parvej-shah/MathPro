import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Instructor } from "../_lib/types";
import {
  BsChevronLeft,
  BsChevronRight,
  BsPlayFill,
  BsArrowRight,
} from "react-icons/bs";
import { HiSparkles, HiAcademicCap } from "react-icons/hi2";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeacherSliderProps {
  instructors: Instructor[];
}

// Vibrant gradient pairs for instructor cards
const gradientPairs = [
  { from: "#667eea", to: "#764ba2" },
  { from: "#f093fb", to: "#f5576c" },
  { from: "#4facfe", to: "#00f2fe" },
  { from: "#43e97b", to: "#38f9d7" },
  { from: "#fa709a", to: "#fee140" },
  { from: "#ff0844", to: "#ffb199" },
  { from: "#30cfd0", to: "#330867" },
  { from: "#a18cd1", to: "#fbc2eb" },
];

export default function TeacherSlider({ instructors }: TeacherSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const scrollbarContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Detect scroll to end of info panel to change slides
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    const scrollContainer = scrollbarContainerRef.current;
    if (!scrollContainer) return;

    let scrollTimeout: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtEnd = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold

      if (isAtEnd && activeIndex < instructors.length - 1) {
        // Clear any existing timeout
        if (scrollTimeout) clearTimeout(scrollTimeout);

        // Wait a bit before changing slide to avoid accidental triggers
        scrollTimeout = setTimeout(() => {
          setActiveIndex((prev) => Math.min(prev + 1, instructors.length - 1));
          // Reset scroll position for new instructor
          scrollContainer.scrollTop = 0;
        }, 300);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [mounted, activeIndex, instructors.length]);

  // GSAP ScrollTrigger setup with proper cleanup
  useLayoutEffect(() => {
    if (!mounted || !instructors.length || typeof window === "undefined")
      return;

    const section = sectionRef.current;
    const cardsContainer = cardsContainerRef.current;

    if (!section || !cardsContainer) return;

    let scrollTrigger: ScrollTrigger | null = null;
    let indicatorAnimation: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      // ~30vh per instructor for comfortable scroll pace
      const scrollPerInstructor = 30;
      const totalScrollHeight = instructors.length * scrollPerInstructor;

      scrollTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalScrollHeight}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.15, // Faster response to scroll
        onUpdate: (self) => {
          const progress = self.progress;
          const newIndex = Math.min(
            Math.floor(progress * instructors.length),
            instructors.length - 1,
          );
          setActiveIndex(newIndex);

          // Update progress bar
          if (progressRef.current) {
            progressRef.current.style.width = `${progress * 100}%`;
          }
        },
      });

      // Animate scroll indicator
      if (scrollIndicatorRef.current) {
        indicatorAnimation = gsap.to(scrollIndicatorRef.current, {
          y: 10,
          opacity: 0.5,
          duration: 1,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }
    }, section);

    // Cleanup on unmount
    return () => {
      // Kill animations first
      if (indicatorAnimation) {
        indicatorAnimation.kill();
      }
      // Kill ScrollTrigger
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
      // Revert GSAP context (cleans up all animations in context)
      ctx.revert();
    };
  }, [mounted, instructors.length]);

  // Update scrollbar gradient dynamically to match card gradient
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !mounted ||
      !instructors ||
      instructors.length === 0
    )
      return;

    const gradientPair = gradientPairs[activeIndex % gradientPairs.length];

    const styleId = "teacher-slider-scrollbar-style";
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Update scrollbar to match the active instructor's gradient
    styleElement.textContent = `
      .teacher-slider-scrollbar::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, ${gradientPair.from}, ${gradientPair.to}) !important;
      }
      .teacher-slider-scrollbar::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, ${gradientPair.to}, ${gradientPair.from}) !important;
        opacity: 0.9 !important;
      }
    `;

    // Update Firefox scrollbar via CSS variable
    if (scrollbarContainerRef.current) {
      scrollbarContainerRef.current.style.setProperty(
        "--scrollbar-color",
        gradientPair.from,
      );
    }
  }, [activeIndex, mounted, instructors]);

  if (!instructors || instructors.length === 0) return null;

  const activeInstructor = instructors[activeIndex];
  const gradientPair = gradientPairs[activeIndex % gradientPairs.length];

  const goToPrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const goToNext = () => {
    setActiveIndex((prev) =>
      prev < instructors.length - 1 ? prev + 1 : instructors.length - 1,
    );
  };

  // Calculate card styles based on position relative to active (deck of cards effect)
  const getCardStyles = (index: number) => {
    const diff = index - activeIndex;

    if (diff < 0) {
      // Cards that have passed (stacked behind/below) - only show last 4
      const stackOffset = Math.abs(diff);
      if (stackOffset > 4) {
        return {
          transform: `translateY(48px) scale(0.8) translateX(-32px)`,
          opacity: 0,
          zIndex: 0,
          filter: `blur(4px)`,
        };
      }
      return {
        transform: `translateY(${stackOffset * 12}px) scale(${1 - stackOffset * 0.05}) translateX(${-stackOffset * 8}px)`,
        opacity: Math.max(0.3, 1 - stackOffset * 0.2),
        zIndex: instructors.length - stackOffset,
        filter: `blur(${Math.min(stackOffset * 1, 3)}px)`,
      };
    } else if (diff === 0) {
      // Active card - front and center
      return {
        transform: "translateY(0) scale(1) translateX(0)",
        opacity: 1,
        zIndex: instructors.length + 1,
        filter: "blur(0px)",
      };
    } else {
      // Cards yet to come (hidden below)
      return {
        transform: `translateY(${diff * 100}%) scale(0.9)`,
        opacity: 0,
        zIndex: 0,
        filter: "blur(0px)",
      };
    }
  };

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[#050508] transition-all duration-300">
        {/* Animated gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full blur-[150px] opacity-40 transition-all duration-400"
          style={{
            background: `radial-gradient(circle, ${gradientPair.from}60, transparent 70%)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 transition-all duration-400"
          style={{
            background: `radial-gradient(circle, ${gradientPair.to}50, transparent 70%)`,
          }}
        />

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <div className="pt-2 sm:pt-3 md:pt-4 px-4 md:px-6 lg:px-12 max-w-[1440px] mx-auto w-full flex-shrink-0">
          <div className="flex items-end justify-between gap-2 sm:gap-4 mb-2 sm:mb-2 lg:mb-3">
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 lg:px-3 lg:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-1 sm:mb-1.5">
                <HiSparkles className="text-yellow-400 text-xs sm:text-sm" />
                <span className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-medium">
                  Meet Our Experts
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                শিখুন সেরাদের
                <span
                  className="block mt-0.5 sm:mt-1 bg-clip-text text-transparent transition-all duration-200"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${gradientPair.from}, ${gradientPair.to})`,
                  }}
                >
                  কাছ থেকে
                </span>
              </h2>
            </div>

            {/* Counter */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              <span
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent transition-all duration-150"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${gradientPair.from}, ${gradientPair.to})`,
                }}
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <div className="h-4 sm:h-5 lg:h-6 w-px bg-white/20" />
              <span className="text-xs sm:text-sm lg:text-base text-white/40">
                {String(instructors.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Mobile: Image on top, Desktop: Side by side */}
        <div className="flex-1 flex items-start lg:items-center px-4 md:px-6 lg:px-12 overflow-visible min-h-0 pt-2 sm:pt-4">
          <div className="max-w-[1440px] mx-auto w-full">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 xl:gap-16 items-center h-full">
              {/* Stacked Cards Container - Mobile: Top & Smaller, Desktop: Left */}
              <div className="w-full lg:col-span-5 order-1 lg:order-1 flex items-start lg:items-center justify-center lg:h-auto">
                <div
                  ref={cardsContainerRef}
                  className="relative w-full max-w-[220px] sm:max-w-[260px] md:max-w-sm lg:max-w-none mx-auto aspect-[2/3] lg:aspect-auto lg:h-[clamp(400px,50vh,600px)]"
                  style={{
                    perspective: "1000px",
                  }}
                >
                  {/* Render only visible cards in stack (active + 4 behind) */}
                  {instructors.map((instructor, index) => {
                    const cardStyles = getCardStyles(index);
                    const gradient =
                      gradientPairs[index % gradientPairs.length];
                    const isActive = index === activeIndex;
                    const diff = index - activeIndex;

                    // Only render cards that are visible (active, up to 4 behind, none ahead)
                    if (diff > 0 || diff < -4) return null;

                    return (
                      <div
                        key={instructor.name || index}
                        className="absolute inset-0"
                        style={{
                          transform: cardStyles.transform,
                          opacity: cardStyles.opacity,
                          zIndex: cardStyles.zIndex,
                          filter: cardStyles.filter,
                          transition:
                            "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease-out, filter 0.2s ease-out",
                        }}
                      >
                        {/* Card glow */}
                        {isActive && (
                          <div
                            className="absolute -inset-4 rounded-[2rem] blur-2xl opacity-50 transition-all duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                            }}
                          />
                        )}

                        {/* Card */}
                        <div
                          className={`relative h-full rounded-2xl lg:rounded-[1.5rem] overflow-hidden border-2 transition-all duration-300 ${
                            isActive ? "border-white/30" : "border-white/10"
                          }`}
                          style={{
                            boxShadow: isActive
                              ? `0 25px 50px -12px ${gradient.from}40, 0 0 0 1px ${gradient.from}20`
                              : "0 10px 40px -10px rgba(0,0,0,0.5)",
                          }}
                        >
                          {/* Image */}
                          {instructor.image ? (
                            <Image
                              src={instructor.image}
                              alt={instructor.name}
                              fill
                              className="object-cover object-[center_15%] sm:object-top"
                              priority={index < 3}
                              sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, (max-width: 1024px) 400px, 100vw"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                              }}
                            >
                              <span className="text-[80px] md:text-[120px] lg:text-[150px] font-bold text-white/20">
                                {instructor.name?.charAt(0) || "?"}
                              </span>
                            </div>
                          )}

                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Instructor number badge */}
                          <div
                            className="absolute top-3 left-3 lg:top-4 lg:left-4 w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-white text-xs lg:text-sm"
                            style={{
                              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                            }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          {/* Bottom info - only name on mobile */}
                          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 lg:p-4">
                            <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white">
                              {instructor.name}
                            </h4>
                          </div>

                          {/* Play button - only on active, hidden on mobile */}
                          {isActive && (
                            <div className="hidden lg:flex absolute inset-0 items-center justify-center">
                              <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-2xl border border-white/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 hover:scale-110">
                                <BsPlayFill className="text-white text-3xl ml-1" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Stack indicator dots - hidden on mobile */}
                  <div className="hidden lg:flex absolute -right-8 top-1/2 -translate-y-1/2 flex-col gap-2">
                    {Array.from({ length: Math.min(5, activeIndex + 1) }).map(
                      (_, i) => {
                        const dotIndex =
                          activeIndex - (Math.min(4, activeIndex) - i);
                        return (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-150 ${
                              dotIndex === activeIndex
                                ? "bg-white scale-125"
                                : "bg-white/30"
                            }`}
                            style={
                              dotIndex === activeIndex
                                ? {
                                    background: `linear-gradient(135deg, ${gradientPair.from}, ${gradientPair.to})`,
                                  }
                                : {}
                            }
                          />
                        );
                      },
                    )}
                    {activeIndex < instructors.length - 1 && (
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                    )}
                  </div>
                </div>
              </div>

              {/* Info Panel - Mobile: Below image, Desktop: Right */}
              <div
                ref={scrollbarContainerRef}
                className="w-full lg:col-span-7 order-2 lg:order-2 max-h-[40vh] sm:max-h-[45vh] lg:max-h-full lg:h-full overflow-y-auto overflow-x-hidden pr-2 lg:pr-4 pb-4 teacher-slider-scrollbar"
                style={
                  {
                    "--scrollbar-color": gradientPair.from,
                  } as React.CSSProperties
                }
              >
                <div className="max-w-xl mx-auto lg:mx-0">
                  {/* All content is now scrollable */}
                  {/* Name */}
                  <h3
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-1.5 lg:mb-2 transition-all duration-200"
                    key={`name-${activeIndex}`}
                  >
                    {activeInstructor?.name}
                  </h3>

                  {/* Role */}
                  {activeInstructor?.role && (
                    <p
                      className="text-sm sm:text-base lg:text-lg font-medium mb-1 sm:mb-1.5 transition-all duration-200"
                      style={{ color: gradientPair.from }}
                    >
                      {activeInstructor.role}
                    </p>
                  )}

                  {/* University */}
                  {activeInstructor?.university && (
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
                      <HiAcademicCap
                        className="text-base sm:text-lg lg:text-xl opacity-70 flex-shrink-0"
                        style={{ color: gradientPair.from }}
                      />
                      <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                        {activeInstructor.university}
                      </p>
                    </div>
                  )}

                  {/* Bio */}
                  {activeInstructor?.bio && (
                    <div className="mb-3 sm:mb-4 lg:mb-5">
                      <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed max-h-[60px] sm:max-h-[80px] lg:max-h-[100px] overflow-hidden">
                        {activeInstructor.bio}
                      </p>
                    </div>
                  )}

                  {/* Achievements */}
                  {activeInstructor?.achievements &&
                    activeInstructor.achievements.length > 0 && (
                      <div className="mb-3 sm:mb-4 lg:mb-5">
                        <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-white mb-2 sm:mb-2.5 lg:mb-3 flex items-center gap-1.5 sm:gap-2">
                          <HiSparkles
                            className="text-yellow-400 flex-shrink-0"
                            style={{ color: gradientPair.from }}
                          />
                          <span>Achievements</span>
                        </h4>
                        <div className="space-y-1.5 sm:space-y-2">
                          {activeInstructor.achievements.map(
                            (achievement, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 sm:gap-3 text-muted-foreground group/item"
                              >
                                <div
                                  className="flex-shrink-0 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mt-1.5 sm:mt-2 opacity-60 group-hover/item:opacity-100 transition-opacity"
                                  style={{ backgroundColor: gradientPair.from }}
                                />
                                <span className="text-xs sm:text-sm lg:text-base leading-relaxed">
                                  {achievement}
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Connect, Course Count, and CTA - Now part of scrollable content */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 pt-3 sm:pt-4 pb-2">
                    {/* Connect Section */}
                    {activeInstructor?.social &&
                      (activeInstructor.social.facebook ||
                        activeInstructor.social.linkedin ||
                        activeInstructor.social.twitter ||
                        activeInstructor.social.github ||
                        activeInstructor.social.website) && (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <h4 className="text-sm lg:text-base font-semibold text-white whitespace-nowrap">
                            Connect
                          </h4>
                          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                            {activeInstructor.social.facebook && (
                              <a
                                href={activeInstructor.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                              >
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                              </a>
                            )}
                            {activeInstructor.social.linkedin && (
                              <a
                                href={activeInstructor.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
                                aria-label="LinkedIn"
                              >
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                              </a>
                            )}
                            {activeInstructor.social.twitter && (
                              <a
                                href={activeInstructor.social.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
                                aria-label="Twitter"
                              >
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                              </a>
                            )}
                            {activeInstructor.social.github && (
                              <a
                                href={activeInstructor.social.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
                                aria-label="GitHub"
                              >
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </a>
                            )}
                            {activeInstructor.social.website && (
                              <a
                                href={activeInstructor.social.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300 hover:scale-110"
                                aria-label="Website"
                              >
                                <svg
                                  className="w-4 h-4 sm:w-5 sm:h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                  />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Course Count */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: gradientPair.from }}
                      />
                      <span className="text-sm lg:text-base text-muted-foreground whitespace-nowrap">
                        {activeInstructor?.coursesCount || 0} কোর্স
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Link href="#courses-grid" className="flex-shrink-0">
                      <button
                        className="group/btn inline-flex items-center gap-1.5 sm:gap-2 lg:gap-3 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded-lg sm:rounded-xl font-bold text-white text-xs sm:text-sm lg:text-base transition-all duration-300 hover:scale-105 whitespace-nowrap"
                        style={{
                          background: `linear-gradient(135deg, ${gradientPair.from}, ${gradientPair.to})`,
                          boxShadow: `0 20px 40px -10px ${gradientPair.from}50`,
                        }}
                      >
                        কোর্স দেখুন
                        <BsArrowRight className="transform group-hover/btn:translate-x-1 transition-transform text-xs sm:text-sm lg:text-base" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}