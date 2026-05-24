"use client";

import Nav from "@/components/Nav";
import SEO from "@/components/SEO";
import Footer from "@/components/footer";
import toast, { Toaster } from "react-hot-toast";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { siteConfig } from "@/config/site.config";
import { BsBook } from "react-icons/bs";

// Feature components - Lazy load heavy components
import dynamic from "next/dynamic";
import {
  FeaturedCourseSlider,
  HeroStatsStrip,
  CourseSearchBar,
  StickyFilters,
  PremiumCourseCard,
  PremiumBundleCard,
  FacebookCommunityCTASection,
  FAQSection,
  CoursesLoadingSkeleton,
} from "@/features/courses-page/components";

// Lazy load heavy animation components
const TeacherSlider = dynamic(
  () =>
    import("@/features/courses-page/components/TeacherSlider").then((mod) => ({
      default: mod.default,
    })),
  { ssr: false },
);

const TestimonialMarquee = dynamic(
  () =>
    import("@/features/courses-page/components/TestimonialMarquee").then(
      (mod) => ({ default: mod.default }),
    ),
  { ssr: false },
);

import { useCoursesPage } from "@/features/courses-page/hooks/useCoursesPage";

export default function CoursesPage() {
  const pageTitle = "MathPro Courses";
  const pageDescription =
    "MathPro-এর JSC, SSC ও HSC গণিত কোর্স এক জায়গায়। লাইভ ক্লাস, রেকর্ডেড লেকচার, কুইজ ও প্র্যাকটিসের মাধ্যমে পরীক্ষার পূর্ণ প্রস্তুতি নিন।";

  const {
    filteredCourses,
    filteredBundles,
    loading,
    error,
    stats,
    instructors,
    bundles,
    categories,
    allFeedbacks,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    refetch,
    courses,
  } = useCoursesPage();

  if (loading) {
    return (
      <div className={"font-hind overflow-x-hidden"}>
        <SEO
          title={pageTitle}
          description={pageDescription}
        />
        <Nav />
        <CoursesLoadingSkeleton />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className={"font-hind overflow-x-hidden"}>
        <SEO
          title={pageTitle}
          description={pageDescription}
        />
        <Nav />
        <div className="min-h-screen bg-white dark:bg-[#0B060D] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={refetch}
              className="bg-purple text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              পুনরায় চেষ্টা করুন
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={"font-hind overflow-x-hidden"}>
      <SEO
        title={pageTitle}
        description={pageDescription}
      />

      <Nav />
      <Toaster position="top-right" />

      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 980 892"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -top-[200px] -left-[200px] w-full h-full opacity-20"
        >
          <g filter="url(#filter0_f_261_7530)">
            <ellipse
              cx="314.306"
              cy="293.812"
              rx="167.107"
              ry="94.0796"
              transform="rotate(-10.6934 314.306 293.812)"
              fill="#B153E0"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_261_7530"
              x="0.158203"
              y="0.158203"
              width="628.295"
              height="587.308"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="75"
                result="effect1_foregroundBlur_261_7530"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <main className="relative z-10 pt-20 bg-white dark:bg-[#0B060D] min-h-screen">
        {/* Hero Section */}
        <div className="w-[90%] lg:w-[85%] max-w-[1440px] mx-auto py-16 md:py-20">
          {/* Header */}
          <div className="text-center mb-12">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple/10 dark:bg-purple/20 border border-purple/20 mb-6">
              <span className="w-2 h-2 bg-purple rounded-full animate-pulse" />
              <span className="text-sm text-purple font-medium">
                {courses.length}+ গণিত কোর্স এবং {bundles.length}+ প্রস্তুতি বান্ডেল
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading dark:text-darkHeading mb-6">
              সকল{" "}
              <span className="relative">
                <span className="bg-gradient-to-r from-purple via-pink-500 to-purple bg-clip-text text-transparent">
                  কোর্স
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 8.5C50 2.5 150 2.5 198 8.5"
                    stroke="url(#underline-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="underline-gradient"
                      x1="0"
                      y1="0"
                      x2="200"
                      y2="0"
                    >
                      <stop stopColor="#a855f7" />
                      <stop offset="0.5" stopColor="#ec4899" />
                      <stop offset="1" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-lg md:text-xl text-paragraph dark:text-darkParagraph max-w-3xl mx-auto leading-relaxed">
              JSC, SSC ও HSC শিক্ষার্থীদের জন্য MathPro-র সেরা গণিত কোর্স ও বান্ডেল একসাথে।{" "}
              <span className="text-heading dark:text-darkHeading font-medium">
                লাইভ ক্লাস
              </span>{" "}
              ,{" "}
              <span className="text-heading dark:text-darkHeading font-medium">
                রেকর্ডেড কনটেন্ট
              </span>{" "}
              , কুইজ ও মডেল টেস্ট দিয়ে বোর্ড পরীক্ষার জন্য আত্মবিশ্বাসী প্রস্তুতি নিন।
            </p>
          </div>

          {/* Stats Strip */}
          <HeroStatsStrip stats={stats} />

          {/* Featured Course / Bundle Hero Slider */}
          {(bundles.length > 0 || courses.length > 0) && (
            <div className="mt-14 mb-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-heading dark:text-darkHeading mb-3">
                  MathPro ফিচার্ড গণিত কোর্স
                </h2>
                <p className="text-base sm:text-lg text-paragraph dark:text-darkParagraph max-w-2xl mx-auto">
                  JSC, SSC ও HSC প্রস্তুতির জন্য বিশেষভাবে বেছে নেওয়া কোর্স ও বান্ডেল
                </p>
              </div>
              <FeaturedCourseSlider
                featuredBundle={bundles.length > 0 ? bundles[0] : null}
                recentCourse={courses.length > 0 ? courses[0] : null}
              />
            </div>
          )}

          {/* Search Bar */}
          <div className="my-10">
            <CourseSearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>

          {/* Sticky Filters */}
          <StickyFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Courses and Bundles - Grouped: Bundles first, then Courses */}
          <div id="courses-grid" className="py-8 scroll-mt-24 space-y-14">
            {filteredCourses.length > 0 || filteredBundles.length > 0 ? (
              <>
                {/* Bundles Section - First, highlighted */}
                {filteredBundles.length > 0 && (
                  <section>
                    <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-heading dark:text-darkHeading flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-purple/15 text-purple">
                            <BsBook className="w-5 h-5" />
                          </span>
                          বান্ডেল
                        </h2>
                        <p className="mt-1 text-paragraph dark:text-darkParagraph text-sm md:text-base">
                          SSC ও HSC পরীক্ষার ফুল প্রস্তুতির জন্য সাশ্রয়ী প্যাকেজ — {filteredBundles.length}টি বান্ডেল
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {filteredBundles.map((bundle) => (
                        <div
                          key={bundle.id}
                          className="relative rounded-2xl overflow-hidden border-l-4 border-purple ring-1 ring-purple/20 dark:ring-purple/30 shadow-md hover:shadow-lg hover:shadow-purple/10 transition-shadow duration-300"
                        >
                          <PremiumBundleCard bundle={bundle} />
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Courses Section - Second */}
                {filteredCourses.length > 0 && (
                  <section>
                    <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-heading dark:text-darkHeading flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gray-200/80 dark:bg-gray-600/50 text-heading dark:text-darkHeading">
                            <BsBook className="w-5 h-5" />
                          </span>
                          কোর্স
                        </h2>
                        <p className="mt-1 text-paragraph dark:text-darkParagraph text-sm md:text-base">
                          অধ্যায়ভিত্তিক ও পরীক্ষাভিত্তিক একক কোর্স — {filteredCourses.length}টি কোর্স
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {filteredCourses.map((course) => (
                        <PremiumCourseCard key={course.id} course={course} />
                      ))}
                    </div>
                  </section>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-20">
                <BsBook className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-heading dark:text-darkHeading mb-2">
                  কোনো কোর্স পাওয়া যায়নি
                </h3>
                <p className="text-paragraph dark:text-darkParagraph">
                  {searchTerm
                    ? `"${searchTerm}" এর জন্য কোনো ফলাফল নেই`
                    : "JSC, SSC ও HSC এর নতুন গণিত কোর্স শীঘ্রই যোগ করা হবে।"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 px-6 py-2 bg-purple text-white rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    সার্চ পরিষ্কার করুন
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Teacher Slider Section */}
        {instructors.length > 0 && <TeacherSlider instructors={instructors} />}

        {/* Community Section */}
        <FacebookCommunityCTASection />

        {/* Testimonials Marquee */}
        <TestimonialMarquee feedbacks={allFeedbacks} />

        {/* FAQ Section */}
        <FAQSection />
      </main>

      <Footer />
      <WhatsAppWidget phoneNumber={siteConfig.contact.phone} />
    </div>
  );
}
