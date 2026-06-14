import { getEnrollmentDates, type NewChips } from "@/features/course-details/_lib/chips";

interface CountdownTimerProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  chips?: NewChips | null;
  isLive?: boolean; // is_live status from course data
}

export default function CountdownTimer({
  days,
  hours,
  minutes,
  seconds,
  chips,
  isLive,
}: CountdownTimerProps) {
  const { prebookingEnd, enrollmentEnd } = getEnrollmentDates(chips);

  // Determine which deadline is being counted based on is_live status
  let isPrebookingDeadline = false;
  let isEnrollmentDeadline = false;

  if (isLive === false) {
    isPrebookingDeadline = !!prebookingEnd;
  } else if (isLive === true) {
    isEnrollmentDeadline = !!enrollmentEnd;
  } else {
    isPrebookingDeadline = !!prebookingEnd;
    isEnrollmentDeadline = !!enrollmentEnd && !isPrebookingDeadline;
  }

  // Don't show if no deadline exists
  if (!isPrebookingDeadline && !isEnrollmentDeadline) {
    return null;
  }

  // Get label text based on mode
  const labelText = isPrebookingDeadline
    ? "প্রিবুকিং শেষ হতে বাকি"
    : isEnrollmentDeadline
      ? "এনরোলমেন্ট শেষ হতে বাকি"
      : "অবশিষ্ট সময়";

  return (
    <div className="mt-4 rounded-3xl border border-border/40 bg-linear-to-b from-background/95 to-muted/20 p-4 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-center text-lg font-bold tracking-tight text-foreground lg:text-left">
          {labelText}
        </p>
        <div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-warning/20 bg-warning/10 px-3 py-1.5 text-sm font-semibold text-warning lg:self-auto">
          <svg
            width="12"
            height="15"
            viewBox="0 0 12 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6.66536 1.5V6.16667H10.6654L5.33203 13.5V8.83333H1.33203L6.66536 1.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>তারাতারি করো</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col items-center">
          <p className="w-full rounded-2xl border border-warning/20 bg-linear-to-b from-warning/15 to-warning/5 px-3 py-4 text-center text-4xl font-extrabold tracking-tight tabular-nums text-foreground shadow-sm">
            {days.toString().padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            দিন
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="w-full rounded-2xl border border-warning/20 bg-linear-to-b from-warning/15 to-warning/5 px-3 py-4 text-center text-4xl font-extrabold tracking-tight tabular-nums text-foreground shadow-sm">
            {hours.toString().padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            ঘন্টা
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="w-full rounded-2xl border border-warning/20 bg-linear-to-b from-warning/15 to-warning/5 px-3 py-4 text-center text-4xl font-extrabold tracking-tight tabular-nums text-foreground shadow-sm">
            {minutes.toString().padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            মিনিট
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p className="w-full rounded-2xl border border-warning/20 bg-linear-to-b from-warning/15 to-warning/5 px-3 py-4 text-center text-4xl font-extrabold tracking-tight tabular-nums text-foreground shadow-sm">
            {seconds.toString().padStart(2, "0")}
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            সেকেন্ড
          </p>
        </div>
      </div>
    </div>
  );
}
