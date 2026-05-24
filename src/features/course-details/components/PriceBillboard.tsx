import { BsBook, BsCheckCircle } from "react-icons/bs";
import Link from "next/link";
import { useCountdown } from "@/hooks/useCountdown";
import { EnrollmentSection } from "@/features/course-details/_lib/types";

interface BundleCourse {
  id: number;
  title: string;
  price: number;
  [key: string]: any;
}

interface Bundle {
  id: number;
  title: string;
  price: number;
  course_count: number;
  purchased?: boolean;
  is_live?: boolean;
  courses: BundleCourse[];
  chips?: {
    enrollment?: EnrollmentSection;
  };
}

interface PriceBillboardProps {
  bundle: Bundle | null;
  bundleLoading?: boolean;
  onScrollToPurchase?: () => void;
  purchaseSectionId?: string; // ID of purchase section to scroll to
  isLive?: boolean; // is_live status from bundle (for countdown logic)
  isCourseDetailsContext?: boolean; // If true, component is used in course-details page
}

/**
 * Format price to BDT currency
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace("BDT", "৳");
};

/**
 * Calculate total original price of all courses
 */
const calculateTotalOriginalPrice = (courses: BundleCourse[]): number => {
  return courses.reduce((total, course) => total + course.price, 0);
};

/**
 * Calculate savings amount
 */
const calculateSavings = (
  totalOriginal: number,
  bundlePrice: number,
): number => {
  return totalOriginal - bundlePrice;
};

/**
 * Calculate discount percentage
 */
const calculateDiscountPercentage = (
  totalOriginal: number,
  savings: number,
): number => {
  if (totalOriginal === 0) return 0;
  return Math.round((savings / totalOriginal) * 100);
};

export default function PriceBillboard({
  bundle,
  bundleLoading = false,
  onScrollToPurchase,
  purchaseSectionId = "purchase-section",
  isLive,
  isCourseDetailsContext = false,
}: PriceBillboardProps) {
  // Countdown timer - MUST be called unconditionally (React Hooks rule)
  // Call hook before any early returns
  const enrollment = bundle?.chips?.enrollment;
  const { days, hours, minutes, seconds } = useCountdown(
    undefined,
    {
      prebooking_end:
        typeof enrollment?.prebooking_end?.value === "string"
          ? enrollment.prebooking_end.value
          : undefined,
      enrollment_end:
        typeof enrollment?.enrollment_end?.value === "string"
          ? enrollment.enrollment_end.value
          : undefined,
    },
    isLive, // Pass is_live status to determine which deadline to use
  );

  // Don't render if no bundle data
  if (!bundle && !bundleLoading) return null;

  // Loading state
  if (bundleLoading || !bundle) {
    return (
      <div className="pt-12 border-t border-border/20 mt-12">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted dark:bg-muted rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-muted dark:bg-muted rounded w-96 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate values
  const totalOriginal = calculateTotalOriginalPrice(bundle.courses || []);
  const savings = calculateSavings(totalOriginal, bundle.price);
  const discountPercentage = calculateDiscountPercentage(
    totalOriginal,
    savings,
  );

  // Determine which deadline is active based on is_live status
  let hasDeadline = false;
  let isPrebookingDeadline = false;

  if (isLive === false) {
    // Prebook mode: Check for prebooking_end
    hasDeadline = !!enrollment?.prebooking_end?.value;
    isPrebookingDeadline = hasDeadline;
  } else if (isLive === true) {
    // Enrollment mode: Check for enrollment_end
    hasDeadline = !!enrollment?.enrollment_end?.value;
    isPrebookingDeadline = false;
  } else {
    // is_live is undefined: Fallback to old logic
    hasDeadline =
      !!enrollment?.prebooking_end?.value ||
      !!enrollment?.enrollment_end?.value;
    isPrebookingDeadline = !!enrollment?.prebooking_end?.value;
  }

  // Handle scroll to purchase
  const handleScrollToPurchase = () => {
    if (onScrollToPurchase) {
      onScrollToPurchase();
      return;
    }

    const purchaseSection = document.getElementById(purchaseSectionId);
    if (purchaseSection) {
      purchaseSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Determine heading text based on context
  const headingText = isCourseDetailsContext
    ? "কেন তুমি বান্ডেলটি বেছে নিবে?"
    : "কেন বান্ডেলটি কিনবে?";

  return (
    <div className="pt-12 border-t border-border/20 mt-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-heading dark:text-darkHeading mb-3">
          {isCourseDetailsContext ? (
            <>
              কেন তুমি <span className="text-[#EE4878]">বান্ডেলটি</span> বেছে
              নিবে?
            </>
          ) : (
            <>
              কেন <span className="text-[#EE4878]">বান্ডেলটি</span> কিনবে?
            </>
          )}
        </h2>
        <p className="text-lg text-paragraph dark:text-darkParagraph">
          ভ্যালু প্যাকড লার্নিং, প্র্যাকটিক্যাল স্কিল এবং সেভিংস - সব একসাথে!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-12 mb-8 w-full">
        {/* LEFT SIDE - Individual Courses Stack */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <p className="text-center text-sm font-semibold text-paragraph dark:text-darkParagraph mb-4 uppercase tracking-wide">
            আলাদা আলাদা কিনলে
          </p>
          <div className="space-y-3">
            {bundle.courses && bundle.courses.length > 0 ? (
              bundle.courses.map((course, index) => (
                <div
                  key={course.id || index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-300/20 dark:bg-muted/20 border border-border/30 opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground line-clamp-1">
                      {course.title || "Course"}
                    </p>
                  </div>
                  <span className="text-base font-bold text-muted-foreground flex-shrink-0">
                    {formatPrice(course.price || 0)}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-paragraph dark:text-darkParagraph">
                No courses available
              </div>
            )}

            {/* Total with Strikethrough */}
            {totalOriginal > 0 && (
              <div className="mt-4 p-4 rounded-lg bg-destructive/10 border-2 border-destructive/30">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-destructive">
                    মোট:
                  </span>
                  <span className="text-2xl font-bold text-destructive line-through decoration-4">
                    {formatPrice(totalOriginal)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER - VS Arrow */}
        <div className="flex items-center justify-center flex-shrink-0">
          <div className="relative">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gray-800/50 dark:bg-muted/50 flex items-center justify-center border-4 border-teal/40">
              <span className="text-2xl lg:text-3xl font-black text-teal">
                VS
              </span>
            </div>
            {/* Arrow pointing right (hidden on mobile) */}
            <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                className="text-teal"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Bundle Box */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <p className="text-center text-sm font-semibold text-paragraph dark:text-darkParagraph mb-4 uppercase tracking-wide">
            বান্ডেল কিনলে
          </p>
          <div className="relative">
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="bg-teal text-white px-6 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Best Value
                </span>
              </div>
            </div>

            {/* Bundle Card - Dark with minimal teal accent */}
            <div className="relative overflow-hidden rounded-2xl p-8 bg-background dark:bg-muted shadow-2xl border-2 border-teal/30">
              {/* Subtle teal glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-teal/5"></div>

              {/* Teal accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal to-transparent"></div>

              <div className="relative z-10 text-center">
                <p className="text-white/90 text-lg font-semibold mb-2">
                  {bundle.title || "Bundle"}
                </p>

                {/* Huge Price */}
                <div className="mb-4">
                  <p className="text-white/60 text-sm mb-1">মাত্র</p>
                  <p className="text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
                    {formatPrice(bundle.price || 0)}
                  </p>
                </div>

                {/* Savings Badge - Minimal green */}
                {savings > 0 && (
                  <div className="bg-success/90 text-white px-6 py-4 rounded-xl shadow-xl">
                    <p className="text-sm font-semibold mb-1">
                      তুমি মোট সেভ করছো
                    </p>
                    <p className="text-3xl font-black">
                      {formatPrice(savings)}
                    </p>
                    <p className="text-lg font-bold mt-1">
                      ({discountPercentage}% ছাড়!)
                    </p>
                  </div>
                )}

                {/* Course Count */}
                <div className="mt-4 flex items-center justify-center gap-2 text-white/80">
                  <BsBook className="text-xl text-teal" />
                  <span className="font-semibold">
                    {bundle.course_count || 0}টি কোর্স অন্তর্ভুক্ত
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Countdown Timer - FOMO */}
      {hasDeadline && (
        <div className="mt-6">
          <div className="flex text-sm justify-center">
            <p className="text-heading dark:text-darkHeading mr-16 font-bold text-lg">
              {isPrebookingDeadline
                ? "প্রিবুকিং শেষ হতে বাকি"
                : "এনরোলমেন্ট শেষ হতে বাকি"}
            </p>
            <div className="flex gap-2 items-center">
              <svg
                width="12"
                height="15"
                viewBox="0 0 12 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.66536 1.5V6.16667H10.6654L5.33203 13.5V8.83333H1.33203L6.66536 1.5Z"
                  stroke="url(#paint0_linear_4530_4930)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_4530_4930"
                    x1="5.9987"
                    y1="1.5"
                    x2="5.9987"
                    y2="13.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#CF8E16" />
                    <stop offset="1" stopColor="#FFE49C" />
                  </linearGradient>
                </defs>
              </svg>

              <p className="text-[#FDAF22] text-lg">তারাতারি করো</p>
            </div>
          </div>
          <div className="flex gap-4 justify-center mt-4">
            <div className="flex flex-col items-center">
              <p className="text-heading dark:text-darkHeading bg-amber-500/20 dark:bg-amber-400/10 py-3 rounded-lg font-bold text-4xl w-[80px] text-center border-2 border-amber-500/40 dark:border-amber-400/30">
                {days.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 text-lg font-bold text-paragraph dark:text-darkParagraph">
                দিন
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-heading dark:text-darkHeading bg-amber-500/20 dark:bg-amber-400/10 py-3 rounded-lg font-bold text-4xl w-[80px] text-center border-2 border-amber-500/40 dark:border-amber-400/30">
                {hours.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 text-lg font-bold text-paragraph dark:text-darkParagraph">
                ঘন্টা
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-heading dark:text-darkHeading bg-amber-500/20 dark:bg-amber-400/10 py-3 rounded-lg font-bold text-4xl w-[80px] text-center border-2 border-amber-500/40 dark:border-amber-400/30">
                {minutes.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 text-lg font-bold text-paragraph dark:text-darkParagraph">
                মিনিট
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-heading dark:text-darkHeading bg-amber-500/20 dark:bg-amber-400/10 py-3 rounded-lg font-bold text-4xl w-[80px] text-center border-2 border-amber-500/40 dark:border-amber-400/30">
                {seconds.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 text-lg font-bold text-paragraph dark:text-darkParagraph">
                সেকেন্ড
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="text-center mt-8">
        {bundle.purchased ? (
          <div className="inline-flex items-center gap-2 bg-success/15 text-success px-8 py-4 rounded-xl font-bold text-lg">
            <BsCheckCircle className="text-2xl" />
            Bundle ক্রয় সম্পন্ন হয়েছে
          </div>
        ) : isCourseDetailsContext ? (
          // In course-details context, link to bundle page
          <Link href={`/bundle/${bundle.id}`}>
            <button className="px-12 py-4 text-xl font-bold text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all bg-teal hover:bg-teal/90">
              বান্ডেল কিনুন
            </button>
          </Link>
        ) : (
          // In bundle-details context, scroll to purchase section
          <button
            onClick={handleScrollToPurchase}
            className="px-12 py-4 text-xl font-bold text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all bg-teal hover:bg-teal/90"
          >
            {bundle.is_live === false ? "ফ্রিতে প্রিবুক করো" : "এনরোল করো"}
          </button>
        )}
      </div>
    </div>
  );
}
