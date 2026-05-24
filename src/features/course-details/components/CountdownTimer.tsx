import { EnrollmentSection } from "@/features/course-details/_lib/types";

interface CountdownTimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  enrollment?: EnrollmentSection;
  isLive?: boolean; // is_live status from course data
}

export default function CountdownTimer({
  days,
  hours,
  minutes,
  seconds,
  enrollment,
  isLive,
}: CountdownTimerProps) {
  // Determine which deadline is being counted based on is_live status
  let isPrebookingDeadline = false;
  let isEnrollmentDeadline = false;

  if (isLive === false) {
    // Prebook mode: Check for prebooking_end
    isPrebookingDeadline = !!enrollment?.prebooking_end?.value;
  } else if (isLive === true) {
    // Enrollment mode: Check for enrollment_end
    isEnrollmentDeadline = !!enrollment?.enrollment_end?.value;
  } else {
    // is_live is undefined: Fallback to old logic
    isPrebookingDeadline = !!enrollment?.prebooking_end?.value;
    isEnrollmentDeadline =
      !!enrollment?.enrollment_end?.value && !isPrebookingDeadline;
  }

  // Don't show if no deadline exists
  if (
    !isPrebookingDeadline &&
    !isEnrollmentDeadline &&
    !enrollment?.end?.value
  ) {
    return null;
  }

  // Get label text based on mode
  const labelText = isPrebookingDeadline
    ? "প্রিবুকিং শেষ হতে বাকি"
    : isEnrollmentDeadline
      ? "এনরোলমেন্ট শেষ হতে বাকি"
      : "অবশিষ্ট সময়";

  return (
    <div className="mt-4 border-t py-4 border-b border-gray-300/30">
      <div>
        <div className="flex text-sm justify-center">
          <p className="text-heading dark:text-darkHeading mr-16 font-bold text-lg">
            {labelText}
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
    </div>
  );
}
