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

// Componentsz
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
  CommunitySupportSection,
  PriceBillboard,
} from "@/features/course-details/components";
import CheckoutModal from "@/components/CheckoutModal";
import CouponInput from "@/components/CouponInput";
import type { CouponApplyResponse } from "@/services/couponService";
import { jwtDecode } from "jwt-decode";

// Types
import { TabState, PrebookingData } from "@/features/course-details/_lib/types";
import { englishToBanglaNumbers } from "@/helpers";
import { useLmsPreference } from "@/hooks/useLmsPreference";
import { isLmsPreferenceCourse, getCpLmsUrlForCourse } from "@/constants/lmsPreference";
import Footer from "@/components/footer";

export default function CourseDetailsPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const courseId = params?.id;
  const [user, setUser] = useContext<any>(UserContext);
  const { lmsPreference } = useLmsPreference();

  // State
  const [activeTab, setActiveTab] = useState<TabState>({
    studyPlan: true,
    instructor: false,
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

  // Smart countdown - based on is_live status
  const { days, hours, minutes, seconds } = useCountdown(
    courseData?.chips?.deadline, // Old structure (backward compatible)
    {
      prebooking_end:
        typeof courseData?.chips?.enrollment?.prebooking_end?.value === "string"
          ? courseData.chips.enrollment.prebooking_end.value
          : undefined,
      enrollment_end:
        typeof courseData?.chips?.enrollment?.enrollment_end?.value === "string"
          ? courseData.chips.enrollment.enrollment_end.value
          : undefined,
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
      window.location.href = `https://www.mathpro.com/auth/login?redirect=${encodeURIComponent(currentDomain)}`;
    } else {
      // Open checkout modal instead of directly buying
      setOpenCheckoutModal(true);
    }
  };

  const handleProceedToPayment = () => {
    // This is called after CheckoutModal successfully updates profile
    // Pass applied coupon code to buyCourse
    buyCourse(appliedCouponCode);
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
    const courseId = courseData.id.toString();
    if (lmsPreference === "locked" && isLmsPreferenceCourse(courseId)) {
      return (
        <a
          href={getCpLmsUrlForCourse(courseId)}
          className="flex justify-center text-darkHeading items-center bg-[#1CAB55] py-3 w-full mt-8 rounded-xl hover:bg-opacity-50 ease-in-out duration-150 font-semibold"
        >
          কোর্সে যান
        </a>
      );
    }
    return (
      <Link
        href={`/dashboard/${courseData.id}`}
        className="flex justify-center text-darkHeading items-center bg-[#1CAB55] py-3 w-full mt-8 rounded-xl hover:bg-opacity-50 ease-in-out duration-150 font-semibold"
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
          courseData?.chips?.thumbnails?.course_thumbnail_link_16_9 ||
          courseData?.chips?.thumbnails?.trailer_video_thumb_16_9 ||
          courseData?.chips?.course_thumbnail_link ||
          courseData?.thumbnail ||
          courseData?.image?.imageUploadedLink
        }
      />
      <Toaster />

      {/* Loading State */}
      {(loading || !courseId) && <CourseDetailsSkeleton />}

      {/* Error State */}
      {!loading && error && (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0B060D]">
          <div className="text-center">
            <p className="text-heading dark:text-darkHeading text-xl">
              {error}
            </p>
            <button
              onClick={fetchCourse}
              className="mt-4 px-6 py-2 bg-purple text-white rounded-lg hover:bg-opacity-80 transition-all"
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

          {/* Compiler Button */}
          <button
            style={{ zIndex: 999 }}
            onClick={() => setUser({ ...user, openCompiler: true })}
            className="fixed top-80 -left-2 bg-[#0B060D] bg-opacity-30 backdrop-blur-lg border border-gray-200/20 p-3 hover:bg-gray-300/20"
          >
            <svg
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 9L15.6716 9.17157C17.0049 10.5049 17.6716 11.1716 17.6716 12C17.6716 12.8284 17.0049 13.4951 15.6716 14.8284L15.5 15"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M13.2942 7.17041L12.0001 12L10.706 16.8297"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M8.49994 9L8.32837 9.17157C6.99504 10.5049 6.32837 11.1716 6.32837 12C6.32837 12.8284 6.99504 13.4951 8.32837 14.8284L8.49994 15"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Main Content Section */}
          <div className="pt-20 bg-white dark:bg-[#0B060D] overflow-x-hidden">
            <div className="w-[90%] lg:w-[90%] max-w-[1440px] mx-auto py-12 z-20">
              <div className="flex flex-col-reverse lg:flex-row gap-24 relative">
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
                      fill="#B153E0"
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
                  className="text-heading dark:text-darkHeading z-10"
                >
                  <CourseHeader
                    title={courseData.title}
                    isPrebookingMode={isPrebookingMode}
                  />

                  <div className="flex gap-8 items-center pb-6 border-b border-gray-300/80 dark:border-gray-300/10 relative"></div>

                  <p className="mt-6 text-black/70 dark:text-[#A3A3A3] text-lg">
                    {courseData.short_description}
                  </p>

                  <CourseStats sections={courseData?.chips?.sections} />

                  <CourseTabs activeTab={activeTab} onTabChange={changeTab} />

                  {activeTab.studyPlan && (
                      <StudyPlanTab
                        chapters={courseData.chapters || []}
                        courseData={courseData}
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
                      deadline={courseData?.chips?.deadline}
                    />
                  )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="w-full lg:w-[400px] flex-shrink-0">
                  <div className="text-heading dark:text-darkHeading bg-gray-400/30 dark:bg-gray-100/5 backdrop-blur-xl rounded-xl rounded-b-none">
                    {/* Course Thumbnail/Video */}
                    <div className="rounded-t-xl w-full min-h-[200px] lg:min-h-[260px] relative">
                      {courseData.intro_video ? (
                        <iframe
                          className="rounded-t-xl w-full min-h-[200px] lg:min-h-[260px]"
                          src={
                            courseData.intro_video +
                            "?rel=0&modestbranding=1&autohide=1&showinfo=0"
                          }
                          title={courseData?.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <>
                          {/* Try trailer_video_thumb_16_9 first, then course_thumbnail_link_16_9, then old course_thumbnail_link */}
                          {(() => {
                            const thumbnail =
                              courseData?.chips?.thumbnails
                                ?.trailer_video_thumb_16_9 ||
                              courseData?.chips?.thumbnails
                                ?.course_thumbnail_link_16_9 ||
                              courseData?.chips?.course_thumbnail_link ||
                              courseData?.thumbnail ||
                              courseData?.image?.imageUploadedLink;

                            // If intro_video exists but no thumbnail, try YouTube thumbnail
                            const youtubeThumbnail = courseData.intro_video
                              ? getYouTubeThumbnail(courseData.intro_video)
                              : null;

                            const finalThumbnail =
                              thumbnail || youtubeThumbnail;

                            return finalThumbnail ? (
                              <Image
                                src={finalThumbnail}
                                alt={courseData?.title || "Course thumbnail"}
                                fill
                                className="rounded-t-xl object-cover"
                              />
                            ) : null;
                          })()}
                        </>
                      )}
                    </div>

                    <div className="p-4">
                      {/* Pricing */}
                      <div className="flex flex-col lgXxl:flex-row items-center gap-4 md:gap-2 justify-between pt-2 pb-4 border-b border-gray-300/20">
                        <div>
                          <p className="font-bold text-base text-paragraph dark:text-darkParagraph text-center lgXxl:text-left">
                            কোর্স প্রাইস
                          </p>
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-3xl font-bold">
                                {courseData?.price}/-
                              </p>
                            </div>
                            <div>
                              <p className="text-[#BE2853] line-through font-semibold text-lg">
                                {courseData?.x_price}/-
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="flex items-center gap-4">
                            <div className="text-center lgXxl:text-left">
                              <p className="font-bold text-base text-paragraph dark:text-darkParagraph">
                                {isPrebookingMode
                                  ? "প্রিবুক করেছে"
                                  : "কোর্সটিতে ভর্তি হয়েছে"}
                              </p>
                              <p className="text-3xl font-bold">
                                {isPrebookingMode
                                  ? englishToBanglaNumbers(
                                      courseData?.prebooking || 0,
                                    )
                                  : englishToBanglaNumbers(
                                      courseData?.enrolled || 0,
                                    )}{" "}
                                জন
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enrollment Info */}
                      <EnrollmentInfo
                        enrollment={courseData?.chips?.enrollment}
                        isPrebookingMode={isPrebookingMode}
                      />

                      {/* Features List */}
                      <p className="text-lg mt-6 font-bold">
                        এই কোর্সে তুমি পাচ্ছো
                      </p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-y-1 gap-x-16">
                        {courseData?.you_get?.you_get
                          ?.split(",")
                          .map((item: string, idx: number) => (
                            <div className="flex gap-2 items-center" key={idx}>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="min-w-[16px] min-h-[16px]"
                              >
                                <g opacity="0.7">
                                  <path
                                    d="M8.00065 14.6663C4.31865 14.6663 1.33398 11.6817 1.33398 7.99967C1.33398 4.31767 4.31865 1.33301 8.00065 1.33301C11.6827 1.33301 14.6673 4.31767 14.6673 7.99967C14.6673 11.6817 11.6827 14.6663 8.00065 14.6663ZM8.00065 13.333C9.41512 13.333 10.7717 12.7711 11.7719 11.7709C12.7721 10.7707 13.334 9.41414 13.334 7.99967C13.334 6.58519 12.7721 5.22863 11.7719 4.22844C10.7717 3.22824 9.41512 2.66634 8.00065 2.66634C6.58616 2.66634 5.22961 3.22824 4.22942 4.22844C3.22922 5.22863 2.66732 6.58519 2.66732 7.99967C2.66732 9.41414 3.22922 10.7707 4.22942 11.7709C5.22961 12.7711 6.58616 13.333 8.00065 13.333ZM7.33598 10.6663L4.50732 7.83767L5.44998 6.89501L7.33598 8.78101L11.1067 5.00967L12.05 5.95234L7.33598 10.6663Z"
                                    fill="#B153E0"
                                  />
                                </g>
                              </svg>
                              <p>{item}</p>
                            </div>
                          ))}
                      </div>

                      {/* Course Outline Link */}
                      {courseData?.chips?.course_outline && (
                        <a
                          href={courseData.chips.course_outline}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 text-heading dark:text-darkHeading border border-purple/30 hover:border-purple/60 dark:border-purple/30 dark:hover:border-purple/60 transition-all duration-300 rounded-lg font-medium relative group overflow-hidden"
                          style={{
                            boxShadow: "0 0 10px rgba(177, 83, 224, 0.1)",
                          }}
                        >
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-purple via-[#B153E0] to-purple transition-opacity duration-300"></div>
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-purple"
                          >
                            <path
                              d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"
                              fill="currentColor"
                            />
                          </svg>
                          See Course Outline
                        </a>
                      )}

                      {/* Countdown Timer */}
                      <CountdownTimer
                        days={days}
                        hours={hours}
                        minutes={minutes}
                        seconds={seconds}
                        enrollment={courseData?.chips?.enrollment}
                        isLive={courseData?.is_live}
                      />

                      {/* Coupon Input - For entering coupon code */}
                      {isCourseLive && !courseData.isTaken && (
                        <div className="mt-6">
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

                      {/* Discount Info Display */}
                      {discountInfo && (
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Original Price:
                            </span>
                            <span className="text-sm text-green-800 dark:text-green-200 line-through">
                              ৳{discountInfo.original_price}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              Discount:
                            </span>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">
                              -৳{discountInfo.discount_amount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-green-300 dark:border-green-700">
                            <span className="text-base font-bold text-green-800 dark:text-green-200">
                              Final Price:
                            </span>
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                              ৳{discountInfo.final_price}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div id="purchase-section">
                        {courseData.isTaken ? (
                          renderGotoCourseButton()
                        ) : isPrebookingMode ? (
                          courseData.isWishList || hasPrebooked ? (
                            <div className="bg-[#B2F100]/20 border border-[#B2F100]/60 text-darkHeading py-3 px-4 w-full mt-8 rounded-xl text-center">
                              <div className="flex items-center justify-center gap-2">
                                <svg
                                  className="w-5 h-5"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-semibold">
                                  তুমি ইতোমধ্যে কোর্সটি প্রিবুক করেছ! ✅
                                </span>
                              </div>
                              <p className="text-sm mt-2 opacity-80">
                                কোর্স লাইভ হলে তোমার ফোন ও ইমেইলে বিস্তারিত
                                জানানো হবে!
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => setOpenPrebookCourse(true)}
                              className="group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 w-full mt-8 rounded-lg hover:shadow-lg hover:shadow-blue-500/30 ease-in-out duration-200 font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform"
                            >
                              <svg
                                className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                />
                              </svg>
                              প্রিবুক করো
                            </button>
                          )
                        ) : (
                          <button
                            onClick={handleBuyCourse}
                            className="bg-[#1CAB55] text-darkHeading py-3 w-full mt-8 rounded-xl hover:bg-opacity-50 ease-in-out duration-150 font-semibold"
                          >
                            কোর্সটি কিনুন
                          </button>
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

            {/* Community & Support Section */}
            <CommunitySupportSection
              socials={courseData?.chips?.socials}
              facebookCommunityThumb={
                courseData?.chips?.thumbnails?.facebook_community_thumb_16_9
              }
            />
          </div>

          <Footer />

          <WhatsAppWidget
            phoneNumber={
              courseData?.chips?.socials?.whatsapp
                ? courseData.chips.socials.whatsapp.replace(
                    "https://wa.me/",
                    "",
                  )
                : courseData?.chips?.whatsapp
                  ? courseData.chips.whatsapp.replace("https://wa.me/", "")
                  : "8801768976036"
            }
            name="CoderVai Team"
            position="Online | Replies instantly"
            welcomeMessage="আমরা এখানে একটিভ আছি! 👋 আপনাকে কিভাবে সাহায্য করতে পারি?"
            avatar="/wasup.svg"
          />

          {process.env.NODE_ENV === "development" && <AuthTest />}
        </>
      )}
    </div>
  );
}
