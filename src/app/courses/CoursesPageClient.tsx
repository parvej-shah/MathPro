"use client";

import SEO from "@/components/SEO";
import { Toaster } from "react-hot-toast";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { siteConfig } from "@/config/site.config";
import { BsBook } from "react-icons/bs";
import { useSearchParams } from "next/navigation";

import dynamic from "next/dynamic";
import {
  FeaturedCourseSlider,
  StickyFilters,
  PremiumCourseCard,
  PremiumBundleCard,
  AboutSection,
  // FacebookCommunityCTASection,
  FAQSection,
  CoursesLoadingSkeleton,
} from "@/features/courses-page/components";

const TestimonialMarquee = dynamic(
  () =>
    import("@/features/courses-page/components/TestimonialMarquee").then(
      (mod) => ({ default: mod.default }),
    ),
  { ssr: false },
);

import { useCoursesPage } from "@/features/courses-page/hooks/useCoursesPage";
import {
  mapPublicTestimonialsToFeedbacks,
  usePublicTestimonials,
} from "@/hooks/usePublicTestimonials";

export default function CoursesPageClient() {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const pageTitle = "MathPro Courses";
  const pageDescription =
    "MathPro-এর JSC, SSC ও HSC গণিত কোর্স এক জায়গায়। লাইভ ক্লাস, রেকর্ডেড লেকচার, কুইজ ও প্র্যাকটিসের মাধ্যমে পরীক্ষার পূর্ণ প্রস্তুতি নিন।";

  const {
    filteredCourses,
    filteredBundles,
    loading,
    error,
    instructors,
    featuredCourses,
    categories,
    selectedCategory,
    setSelectedCategory,
    refetch,
  } = useCoursesPage(requestedCategory);
  const { testimonials } = usePublicTestimonials();

  if (loading) {
    return (
      <div className="font-hind overflow-x-hidden">
        <SEO title={pageTitle} description={pageDescription} />
        <CoursesLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-hind overflow-x-hidden">
        <SEO title={pageTitle} description={pageDescription} />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalVisible = filteredBundles.length + filteredCourses.length;

  return (
    <div className="font-hind overflow-x-hidden">
      <SEO title={pageTitle} description={pageDescription} />
      <Toaster position="top-right" />

      {/* Ambient gradient blobs — theme-aware */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-primary/10 dark:bg-primary/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-125 h-125 rounded-full bg-primary/8 dark:bg-primary/12 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-100 h-100 rounded-full bg-primary/5 dark:bg-primary/10 blur-[100px]" />
      </div>
      {/* Dark mode ambient top glow — matches landing page atmosphere */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none z-[39] hidden dark:block" style={{ background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.06) 0%, transparent 65%)' }} />

      {/* Global subtle graph paper grid overlay */}
      <div
        aria-hidden
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative pt-20 bg-section-a min-h-screen overflow-hidden">
        {/* Math motifs — decorative background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none">
          <div
            className="absolute top-32 -left-10 md:left-4 text-[10rem] md:text-[18rem] text-primary/10 font-serif font-black leading-none animate-motif-float"
            style={{ ["--motif-rot" as string]: "12deg", ["--motif-tx" as string]: "10px", ["--motif-ty" as string]: "-14px", ["--motif-dr" as string]: "2deg", animationDelay: "0s", animationDuration: "13s" }}
          >
            ∫
          </div>
          <div
            className="absolute top-[35%] -right-10 md:right-8 text-[9rem] md:text-[16rem] text-primary/10 font-serif font-black leading-none animate-motif-float"
            style={{ ["--motif-rot" as string]: "-12deg", ["--motif-tx" as string]: "-12px", ["--motif-ty" as string]: "10px", ["--motif-dr" as string]: "-3deg", animationDelay: "-3s", animationDuration: "15s" }}
          >
            π
          </div>
          <div
            className="absolute top-[65%] -left-6 md:left-12 text-[8rem] md:text-[14rem] text-primary/10 font-serif font-black leading-none animate-motif-float"
            style={{ ["--motif-rot" as string]: "45deg", ["--motif-tx" as string]: "8px", ["--motif-ty" as string]: "-10px", ["--motif-dr" as string]: "3deg", animationDelay: "-6s", animationDuration: "14s" }}
          >
            √
          </div>
          <div
            className="absolute top-[90%] right-10 md:right-20 text-[7rem] md:text-[12rem] text-primary/10 font-serif font-black leading-none animate-motif-float"
            style={{ ["--motif-rot" as string]: "-6deg", ["--motif-tx" as string]: "-9px", ["--motif-ty" as string]: "-12px", ["--motif-dr" as string]: "2deg", animationDelay: "-9s", animationDuration: "16s" }}
          >
            ∞
          </div>
        </div>

        <div className="relative z-10">
        <div className="w-[90%] lg:w-[85%] max-w-360 mx-auto pt-8 pb-20">

          {/* ── Hero Slider ───────────────────────────────────────────── */}
          {featuredCourses.length > 0 && (
            <div className="mb-10">
              <FeaturedCourseSlider courses={featuredCourses} />
            </div>
          )}

          {/* ── Filter tabs ───────────────────────────────────────────── */}
          <StickyFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />


          {/* ── Grid ──────────────────────────────────────────────────── */}
          <div id="courses-grid" className="scroll-mt-24">
            {totalVisible > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBundles.map((bundle) => (
                  <PremiumBundleCard key={`bundle-${bundle.id}`} bundle={bundle} />
                ))}
                {filteredCourses.map((course) => (
                  <PremiumCourseCard key={`course-${course.id}`} course={course} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <BsBook className="w-14 h-14 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  কোনো কোর্স পাওয়া যায়নি
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  JSC, SSC ও HSC এর নতুন গণিত কোর্স শীঘ্রই যোগ করা হবে।
                </p>
              </div>
            )}
          </div>
        </div>

          {instructors.length > 0 && <AboutSection instructors={instructors} />}
          {/* <FacebookCommunityCTASection /> */}
          <TestimonialMarquee feedbacks={mapPublicTestimonialsToFeedbacks(testimonials)} />
          <FAQSection />
        </div>
      </main>
      <WhatsAppWidget phoneNumber={siteConfig.contact.phone} />
    </div>
  );
}
