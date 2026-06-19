"use client";

import { HindSiliguri } from "@/helpers";
import SEO from "@/components/SEO";
import { useState, useContext, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { UserContext } from "@/Contexts/UserContext";
import { isLoggedIn } from "@/helpers";
import { CourseDetailsSkeleton } from "@/components/Skeletons";
import Link from "next/link";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import AuthTest from "@/components/AuthTest";
import toast, { Toaster } from "react-hot-toast";

// Hooks
import { useCourseDetails } from "@/hooks/useCourseDetails";
import { useCountdown } from "@/hooks/useCountdown";
import Image from "next/image";
import { getYouTubeThumbnail } from "@/features/course-details/_lib/youtubeHelpers";
import { getEnrollmentDates, getCourseThumbnail } from "@/features/course-details/_lib/chips";
import ReactYoutubePlayer from "@/components/ReactYoutubePlayer";

// Components
import {
  PrebookCourseDialog,
  PrebookSuccessDialog,
  CourseHeader,
  CourseStats,
  CourseTabs,
  StudyPlanTab,
  InstructorTab,
  CourseDetailsTab,
  CountdownTimer,
  EnrollmentInfo,
  PriceBillboard,
} from "@/features/course-details/components";
import CheckoutModal from "@/components/CheckoutModal";
import CouponInput from "@/components/CouponInput";
import type { CouponApplyResponse } from "@/services/couponService";
import { jwtDecode } from "jwt-decode";

// Types
import { TabState, PrebookingData, BookSelection } from "@/features/course-details/_lib/types";
import { englishToBanglaNumbers } from "@/helpers";
import dynamic from "next/dynamic";
import {
  mapPublicTestimonialsToFeedbacks,
  usePublicTestimonials,
} from "@/hooks/usePublicTestimonials";

const TestimonialMarquee = dynamic(
  () => import("@/features/courses-page/components/TestimonialMarquee"),
  { ssr: false },
);

export default function CourseDetailsPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const courseId = params?.id;
  const [user] = useContext<any>(UserContext);
  const { testimonials } = usePublicTestimonials();

  // State
  const [activeTab, setActiveTab] = useState<TabState>({
    studyPlan: false,
    instructor: true,
    courseComplete: false,
  });
  const [conditionsChecked, setConditionsChecked] = useState(false);
  const [openBuyCourse, setOpenBuyCourse] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);
  const [openPrebookCourse, setOpenPrebookCourse] = useState(false);
  const [openPrebookCourseSuccessful, setOpenPrebookCourseSuccessful] =
    useState(false);

  // Coupon state
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  );
  const [discountInfo, setDiscountInfo] = useState<
    CouponApplyResponse["data"] | null
  >(null);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  // Get user ID from token
  useEffect(() => {
    if (isLoggedIn()) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          const id =
            decodedToken.id || decodedToken.user_id || decodedToken.sub;
          if (id) {
            setUserId(parseInt(id.toString()));
          }
        } catch {
          // Token decode failed, userId remains unset
        }
      }
    }
  }, []);

  // Hooks
  const {
    courseData,
    loading,
    error,
    fetchCourse,
    buyCourse,
    prebookCourse,
    prebookButtonLoading,
    bundle,
    bundleLoading,
    fetchBundle,
    hasPrebooked,
  } = useCourseDetails(courseId);

  // Clear coupon state when course changes (edge case fix)
  useEffect(() => {
    if (courseId) {
      setAppliedCouponCode(null);
      setDiscountInfo(null);
    }
  }, [courseId]);

  // Edge case: Clear coupon if course price changes (safety measure)
  useEffect(() => {
    if (courseData?.price && discountInfo) {
      // If the course price changed from what we calculated discount for, clear coupon
      // This ensures discount is always calculated with current price
      if (Math.abs(discountInfo.original_price - courseData.price) > 0.01) {
        setAppliedCouponCode(null);
        setDiscountInfo(null);
      }
    }
  }, [courseData?.price, discountInfo]);

  // Helper functions
  const isPrebookingMode = courseData?.is_live === false;
  const isCourseLive = courseData?.is_live === true;

  // Auto-apply coupon from URL parameter (Ambassador Program)
  useEffect(() => {
    const couponFromUrl = searchParams.get("coupon") || undefined;
    
    if (
      couponFromUrl &&
      !appliedCouponCode &&
      courseData?.id &&
      courseData?.price &&
      isCourseLive &&
      !courseData.isTaken
    ) {
      // Auto-apply the coupon
      const autoApplyCoupon = async () => {
        try {
          // Import the coupon service functions
          const { validateCoupon, applyCoupon } = await import('@/services/couponService');

          // Validate coupon
          const validation = await validateCoupon(
            couponFromUrl,
            courseData.id,
            undefined,
            userId
          );

          if (!validation.valid) {
            toast.error(validation.error || 'Invalid coupon code');
            return;
          }

          // Apply coupon
          const applyResult = await applyCoupon(
            couponFromUrl,
            courseData.price,
            courseData.id,
            undefined,
            userId
          );

          if (applyResult.success && applyResult.data) {
            setAppliedCouponCode(couponFromUrl.toUpperCase());
            setDiscountInfo(applyResult.data);
            toast.success(`Coupon ${couponFromUrl.toUpperCase()} applied successfully! 🎉`);
          } else {
            toast.error(applyResult.error || 'Failed to apply coupon');
          }
        } catch (error: any) {
          console.error('Error auto-applying coupon:', error);
          toast.error('Failed to apply coupon automatically');
        }
      };

      autoApplyCoupon();
    }
  }, [
    searchParams,
    appliedCouponCode,
    courseData?.id,
    courseData?.price,
    courseData?.isTaken,
    isCourseLive,
    userId,
  ]);

  // Smart countdown - based on is_live status. Dates come from the new
  // chips.enrollment_details (unix seconds) → ISO strings for the countdown hook.
  const enrollmentDates = getEnrollmentDates(courseData?.chips);
  const { days, hours, minutes, seconds } = useCountdown(
    undefined,
    {
      prebooking_end: enrollmentDates.prebookingEnd?.toISOString(),
      enrollment_end: enrollmentDates.enrollmentEnd?.toISOString(),
    },
    courseData?.is_live, // Pass is_live status to determine which deadline to use
  );

  const changeTab = (tabName: keyof TabState) => {
    const newTab: TabState = {
      studyPlan: false,
      instructor: false,
      courseComplete: false,
    };
    newTab[tabName] = true;
    setActiveTab(newTab);
  };

  const handleBuyCourse = () => {
    if (isLoggedIn() === false) {
      const currentDomain = window.location.href;
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentDomain)}`;
    } else {
      // Open checkout modal instead of directly buying
      setOpenCheckoutModal(true);
    }
  };

  const handleProceedToPayment = (bookSelection: BookSelection | null) => {
    // This is called after CheckoutModal successfully updates profile
    // Pass applied coupon code and optional book selection to buyCourse
    buyCourse(appliedCouponCode, bookSelection);
  };

  const handleCouponApplied = (discountData: CouponApplyResponse["data"]) => {
    setDiscountInfo(discountData);
    if (discountData?.coupon?.code) {
      setAppliedCouponCode(discountData.coupon.code);
    }
  };

  const handleCouponRemoved = () => {
    setAppliedCouponCode(null);
    setDiscountInfo(null);
  };

  const handlePrebookCourse = async (data: PrebookingData) => {
    const success = await prebookCourse(data);
    if (success) {
      setOpenPrebookCourse(false);
      setOpenPrebookCourseSuccessful(true);
    }
    return success;
  };

  const renderGotoCourseButton = () => {
    if (!courseData?.id) return null;
    return (
      <Link
        href={`/dashboard/${courseData.id}`}
        className="flex justify-center text-primary-foreground items-center bg-primary py-3 w-full mt-8 rounded-xl hover:bg-primary/80 ease-in-out duration-150 font-semibold"
      >
        কোর্সে যান
      </Link>
    );
  };

  return (
    <div className={`${HindSiliguri.variable} font-hind overflow-x-hidden`}>
      <SEO
        title={
          courseData?.title || (error ? "Course Not Found" : "Course Details")
        }
        description={
          courseData?.short_description ||
          courseData?.description ||
          (error
            ? "The requested course could not be found. Explore other MathPro courses."
            : "Explore this MathPro course for JSC, SSC, and HSC math students.")
        }
        path={`/courses/${courseId}`}
        image={
          courseData?.chips?.thumbnails?.course_thumbnail_16_9 ||
          courseData?.chips?.thumbnails?.trailer_video_thumb_16_9 ||
          courseData?.thumbnail ||
          courseData?.image?.imageUploadedLink
        }
      />
      <Toaster />

      {/* Ambient gradient blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-primary/10 dark:bg-primary/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-125 h-125 rounded-full bg-primary/8 dark:bg-primary/12 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-100 h-100 rounded-full bg-primary/5 dark:bg-primary/10 blur-[100px]" />
      </div>
      {/* Dark mode ambient top glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-250 h-125 pointer-events-none z-39 hidden dark:block" style={{ background: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.06) 0%, transparent 65%)' }} />
      {/* Graph paper grid overlay */}
      <div
        aria-hidden
        className="fixed inset-0 z-39 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Loading State */}
      {(loading || !courseId) && <CourseDetailsSkeleton />}

      {/* Error State */}
      {!loading && error && (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <p className="text-foreground text-xl">
              {error}
            </p>
            <button
              onClick={fetchCourse}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && courseId && courseData && !error && (
        <>
          {/* Dialogs */}
          {courseData && (
            <CheckoutModal
              isOpen={openCheckoutModal}
              onClose={() => {
                // Don't clear coupon when modal is closed - user might reopen
                setOpenCheckoutModal(false);
              }}
              onProceed={handleProceedToPayment}
              type="course"
              title={courseData.title}
              price={discountInfo?.final_price ?? courseData.price}
              originalPrice={courseData.x_price}
              savings={
                discountInfo
                  ? discountInfo.original_price - discountInfo.final_price
                  : undefined
              }
              attachedBooks={courseData.attached_books}
              booksTotal={courseData.books_total}
            />
          )}

          <PrebookCourseDialog
            isOpen={openPrebookCourse}
            onClose={() => setOpenPrebookCourse(false)}
            onPrebook={handlePrebookCourse}
            courseTitle={courseData.title}
            loading={prebookButtonLoading}
          />

          <PrebookSuccessDialog
            isOpen={openPrebookCourseSuccessful}
            onClose={() => setOpenPrebookCourseSuccessful(false)}
            courseTitle={courseData.title}
          />

          {/* Main Content Section */}
          <div className="pt-20 pb-24 lg:pb-0 bg-background overflow-x-hidden">
            <div className="w-[94%] sm:w-[92%] lg:w-[90%] max-w-[1440px] mx-auto py-8 lg:py-12 z-20">
              <div className="flex flex-col-reverse lg:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-24 relative">
                {/* Background Gradient */}
                <svg
                  viewBox="0 0 980 892"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute -top-[200px] -left-[200px] w-full z-0 h-full"
                >
                  <g filter="url(#filter0_f_261_7530)">
                    <ellipse
                      cx="314.306"
                      cy="293.812"
                      rx="167.107"
                      ry="94.0796"
                      transform="rotate(-10.6934 314.306 293.812)"
                      fill="oklch(0.718 0.147 159.2)"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_f_261_7530"
                      x="-350.838"
                      y="-303.722"
                      width="1330.29"
                      height="1195.07"
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
                        stdDeviation="250"
                        result="effect1_foregroundBlur_261_7530"
                      />
                    </filter>
                  </defs>
                </svg>

                {/* Left Column - Main Content */}
                <div
                  style={{ flex: 2 }}
                  className="text-foreground z-10"
                >
                  <CourseHeader
                    title={courseData.title}
                    isPrebookingMode={isPrebookingMode}
                    enrolled={isPrebookingMode ? courseData?.prebooking : courseData?.enrolled}
                  />

                  {courseData.short_description && (
                    <p className="mt-2 text-muted-foreground text-lg leading-relaxed border-b border-border/30 pb-6">
                      {courseData.short_description}
                    </p>
                  )}

                  {/* What you get */}
                  {(() => {
                    const youGetItems = courseData?.you_get?.you_get
                      ? courseData.you_get.you_get.split(",").map((s: string) => s.trim()).filter(Boolean)
                      : [];
                    return youGetItems.length > 0 ? (
                      <div className="mt-6 mb-2">
                        <p className="text-lg font-bold mb-4">এই কোর্সে তুমি পাচ্ছো</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {youGetItems.map((item: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5 bg-primary/5 border border-primary/15 rounded-lg px-3 py-2.5 text-sm"
                            >
                              <svg className="w-4 h-4 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  <CourseStats chips={courseData?.chips} />

                  {/* Tags (frontend-guide-user.md §2) */}
                  {courseData?.tags && courseData.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {courseData.tags.map((tag, i) => (
                        <span
                          key={`${tag}-${i}`}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Books included (frontend-guide-user.md §2) */}
                  {courseData?.attached_books && courseData.attached_books.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-heading text-xl font-bold text-heading mb-4">
                        কোর্সের সাথে বইসমূহ
                        {courseData.books_total ? (
                          <span className="ml-2 text-sm font-medium text-muted-foreground">
                            (মোট মূল্য ৳{courseData.books_total})
                          </span>
                        ) : null}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {courseData.attached_books.map((book) => (
                          <div
                            key={book.id}
                            className="flex gap-4 p-4 rounded-xl bg-muted/40 dark:bg-white/5 border border-border/40"
                          >
                            {book.image_url && (
                              <Image
                                src={book.image_url}
                                alt={book.title}
                                width={64}
                                height={80}
                                className="rounded-md object-cover h-20 w-16 shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-foreground truncate">{book.title}</p>
                              {typeof book.price === "number" && (
                                <p className="text-sm text-primary font-bold mt-1">৳{book.price}</p>
                              )}
                              {book.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {book.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <CourseTabs activeTab={activeTab} onTabChange={changeTab} />

                  {activeTab.studyPlan && (
                      <StudyPlanTab
                        chapters={courseData.chapters || []}
                        courseId={courseId}
                      />
                  )}

                  {activeTab.instructor && (
                    <InstructorTab
                      instructors={courseData?.instructor_list?.instructors}
                    />
                  )}

                  {activeTab.courseComplete && (
                    <CourseDetailsTab
                      description={courseData.description}
                      feedbacks={courseData?.feedback_list?.feedbacks}
                      faqs={courseData?.faq_list?.faqs}
                      deadline={
                        (enrollmentDates.enrollmentEnd ??
                          enrollmentDates.prebookingEnd)?.toISOString()
                      }
                    />
                  )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="w-full lg:w-[380px] xl:w-[420px] flex-shrink-0">
                  {/* Premium Purchase Card */}
                  <div className="text-foreground bg-card border border-border/60 rounded-2xl shadow-xl shadow-black/5 overflow-hidden sticky top-20">
                    {/* Course Thumbnail/Video */}
                    <div className="w-full aspect-video relative bg-muted">
                      {courseData.intro_video ? (
                        <ReactYoutubePlayer videoUrl={courseData.intro_video} />
                      ) : (
                        (() => {
                          const thumbnail =
                            getCourseThumbnail(courseData?.chips) ||
                            courseData?.thumbnail ||
                            courseData?.image?.imageUploadedLink;
                          const youtubeThumbnail = courseData.intro_video
                            ? getYouTubeThumbnail(courseData.intro_video)
                            : null;
                          const finalThumbnail = thumbnail || youtubeThumbnail;
                          return finalThumbnail ? (
                            <Image
                              src={finalThumbnail}
                              alt={courseData?.title || "Course thumbnail"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-teal/20 flex items-center justify-center">
                              <svg className="w-16 h-16 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                              </svg>
                            </div>
                          );
                        })()
                      )}
                    </div>

                    <div className="p-5">
                      {/* Pricing Block */}
                      <div className="mb-5">
                        <div className="flex items-end gap-3 flex-wrap">
                          <span className="text-4xl font-extrabold text-foreground tracking-tight">
                            ৳{discountInfo ? discountInfo.final_price : courseData?.price}
                          </span>
                          {courseData?.x_price && (
                            <span className="text-lg text-muted-foreground line-through mb-1">
                              ৳{courseData.x_price}
                            </span>
                          )}
                          {courseData?.x_price && courseData?.price && (
                            <span className="mb-1 text-sm font-bold text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded-full">
                              {Math.round(((courseData.x_price - courseData.price) / courseData.x_price) * 100)}% ছাড়
                            </span>
                          )}
                        </div>
                        {/* Discount breakdown */}
                        {discountInfo && (
                          <div className="mt-3 p-3 bg-success/8 border border-success/25 rounded-xl space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">মূল মূল্য</span>
                              <span className="line-through text-muted-foreground">৳{discountInfo.original_price}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">কুপন ছাড়</span>
                              <span className="font-semibold text-success">-৳{discountInfo.discount_amount}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold pt-1 border-t border-success/20">
                              <span className="text-foreground">সর্বমোট</span>
                              <span className="text-success">৳{discountInfo.final_price}</span>
                            </div>
                          </div>
                        )}
                        {/* Social proof */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className={`w-7 h-7 rounded-full border-2 border-card bg-primary/${(i + 2) * 10} flex items-center justify-center text-[10px] font-bold text-primary-foreground`}>
                                {String.fromCharCode(65 + i)}
                              </div>
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">
                              {isPrebookingMode
                                ? englishToBanglaNumbers(courseData?.prebooking || 0)
                                : englishToBanglaNumbers(courseData?.enrolled || 0)}+
                            </span>{" "}
                            জন {isPrebookingMode ? "প্রিবুক করেছে" : "ভর্তি হয়েছে"}
                          </span>
                        </div>
                      </div>

                      {/* Enrollment Info */}
                      <EnrollmentInfo
                        chips={courseData?.chips}
                      />

                      {/* Course Outline Link */}
                      {courseData?.course_outline && (
                        <a
                          href={courseData.course_outline}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 text-foreground border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200 rounded-xl font-medium text-sm group"
                        >
                          <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                          </svg>
                          কোর্স আউটলাইন দেখো
                          <svg className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}

                      {/* Countdown Timer */}
                      <CountdownTimer
                        days={days}
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                        chips={courseData?.chips}
                        isLive={courseData?.is_live}
                      />

                      {/* Coupon Input */}
                      {isCourseLive && !courseData.isTaken && (
                        <div className="mt-5">
                          <CouponInput
                            courseId={courseData.id}
                            originalPrice={courseData.price}
                            userId={userId}
                            onCouponApplied={handleCouponApplied}
                            onCouponRemoved={handleCouponRemoved}
                            appliedCouponCode={appliedCouponCode}
                            disabled={user.loading}
                          />
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div id="purchase-section" className="mt-5">
                        {courseData.isTaken ? (
                          renderGotoCourseButton()
                        ) : isPrebookingMode ? (
                          courseData.isWishList || hasPrebooked ? (
                            <div className="bg-success/15 border border-success/40 text-foreground py-4 px-4 w-full rounded-xl text-center">
                              <div className="flex items-center justify-center gap-2 font-semibold">
                                <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                তুমি প্রিবুক করেছ! ✅
                              </div>
                              <p className="text-sm mt-2 text-muted-foreground">
                                কোর্স লাইভ হলে তোমার ফোন ও ইমেইলে জানানো হবে
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => setOpenPrebookCourse(true)}
                              className="group relative bg-linear-to-r from-primary to-primary/80 text-primary-foreground py-4 px-6 w-full rounded-xl hover:shadow-lg hover:shadow-primary/30 duration-200 font-bold text-lg flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                            >
                              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                              </svg>
                              প্রিবুক করো
                            </button>
                          )
                        ) : (
                          <button
                            onClick={handleBuyCourse}
                            className="group relative overflow-hidden bg-linear-to-r from-primary to-primary/85 text-primary-foreground py-4 w-full rounded-xl hover:shadow-xl hover:shadow-primary/25 duration-200 font-bold text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                          >
                            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
                            <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="relative">এখনই ভর্তি হও</span>
                          </button>
                        )}

                        {/* Trust strip */}
                        {!courseData.isTaken && (
                          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-success" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                              </svg>
                              নিরাপদ পেমেন্ট
                            </span>
                            <span className="w-px h-3 bg-border" />
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              ৭ দিনের রিফান্ড
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Billboard - Only show if bundle_id is present */}
            {courseData?.chips?.bundle_id && (
              <PriceBillboard
                bundle={bundle}
                bundleLoading={bundleLoading}
                purchaseSectionId="purchase-section"
                isLive={bundle?.is_live} // Pass bundle's is_live status for countdown logic
                isCourseDetailsContext={true} // Indicate this is used in course-details page
              />
            )}

          </div>

          <TestimonialMarquee feedbacks={mapPublicTestimonialsToFeedbacks(testimonials)} />

          <WhatsAppWidget
            phoneNumber={
              courseData?.chips?.socials?.whatsapp
                ? courseData.chips.socials.whatsapp.replace(
                    "https://wa.me/",
                    "",
                  )
                : "8801768976036"
            }
            name="CoderVai Team"
            position="Online | Replies instantly"
            welcomeMessage="আমরা এখানে একটিভ আছি! 👋 আপনাকে কিভাবে সাহায্য করতে পারি?"
            avatar="/wasup.svg"
          />

          {process.env.NODE_ENV === "development" && <AuthTest />}

          {/* Sticky Mobile Buy Bar — hidden on lg and above where sidebar is visible */}
          {!courseData.isTaken && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center gap-3">
              <div className="flex flex-col min-w-0">
                <span className="text-xl font-extrabold text-foreground leading-none">
                  ৳{discountInfo ? discountInfo.final_price : courseData?.price}
                </span>
                {courseData?.x_price && (
                  <span className="text-xs text-muted-foreground line-through">
                    ৳{courseData.x_price}
                  </span>
                )}
              </div>
              {isPrebookingMode ? (
                courseData.isWishList || hasPrebooked ? (
                  <div className="flex-1 text-center text-sm font-semibold text-success bg-success/15 border border-success/40 rounded-xl py-3 px-4">
                    ✅ প্রিবুক হয়েছে
                  </div>
                ) : (
                  <button
                    onClick={() => setOpenPrebookCourse(true)}
                    className="flex-1 bg-linear-to-r from-primary to-primary/80 text-primary-foreground font-bold py-3 rounded-xl text-base active:scale-95 transition-transform"
                  >
                    প্রিবুক করো
                  </button>
                )
              ) : (
                <button
                  onClick={handleBuyCourse}
                  className="flex-1 bg-linear-to-r from-primary to-primary/85 text-primary-foreground font-bold py-3 rounded-xl text-base active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  এখনই ভর্তি হও
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
