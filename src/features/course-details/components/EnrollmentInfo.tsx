import { EnrollmentSection, Section } from "@/features/course-details/_lib/types";
import { isSectionValid } from "@/features/course-details/_lib/utils";
import {
  formatDateToBengali,
  formatTimeToBengali,
} from "@/features/course-details/_lib/bengaliFormatter";
import {
  ENROLLMENT_ICON_COMPONENTS,
  isEnrollmentIconId,
} from "@/features/course-details/_lib/enrollmentIcons";

interface EnrollmentInfoProps {
  enrollment?: EnrollmentSection;
  isPrebookingMode?: boolean; // Determines if course is in prebooking mode (is_live === false)
}

export default function EnrollmentInfo({
  enrollment,
  isPrebookingMode = false,
}: EnrollmentInfoProps) {
  const enrollmentEntries = Object.entries(enrollment ?? {})
    .map(([key, section]) => ({
      key,
      section: section as Section | undefined,
    }))
    .filter(({ section }) => isSectionValid(section))
    .sort((a, b) => {
      const order = [
        "prebooking_start",
        "prebooking_end",
        "enrollment_start",
        "enrollment_end",
        "classStart",
        "classTime",
        "start",
        "end",
      ];
      const indexA = order.indexOf(a.key);
      const indexB = order.indexOf(b.key);
      const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
      const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
      return safeIndexA - safeIndexB;
    });

  if (enrollmentEntries.length === 0) return null;

  // Check if we have new structure (prebooking_start/end or enrollment_start/end)
  const hasNewStructure =
    enrollment?.prebooking_start?.value ||
    enrollment?.prebooking_end?.value ||
    enrollment?.enrollment_start?.value ||
    enrollment?.enrollment_end?.value;

  const formatEnrollmentValue = (
    key: string,
    value: Section["value"],
  ): string | number => {
    if (value === undefined || value === null) return "";
    if (typeof value !== "string") return value;

    if (
      key === "prebooking_start" ||
      key === "prebooking_end" ||
      key === "enrollment_start" ||
      key === "enrollment_end"
    ) {
      return formatDateToBengali(value);
    }

    if (key === "classStart") {
      return value.includes("T") || value.includes("-")
        ? formatDateToBengali(value)
        : value;
    }

    if (key === "classTime") {
      return value.startsWith("T") || value.includes(":")
        ? formatTimeToBengali(value)
        : value;
    }

    return value;
  };

  const parseDate = (value: Section["value"]): Date | null => {
    if (typeof value !== "string") return null;
    if (value.startsWith("T")) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const prebookingStart = parseDate(enrollment?.prebooking_start?.value);
  const prebookingEnd = parseDate(enrollment?.prebooking_end?.value);
  const enrollmentStart =
    parseDate(enrollment?.enrollment_start?.value) ||
    parseDate(enrollment?.start?.value);
  const enrollmentEnd =
    parseDate(enrollment?.enrollment_end?.value) ||
    parseDate(enrollment?.end?.value);

  const now = new Date();

  let statusLabel: string | null = null;

  if (prebookingStart && prebookingEnd && now <= prebookingEnd) {
    statusLabel = "প্রিবুকিং চলছে";
  } else if (enrollmentStart && (!enrollmentEnd || now <= enrollmentEnd)) {
    statusLabel = "এনরোলমেন্ট চলছে";
  }

  return (
    <div className="mt-4 pb-6 border-b border-black/10 dark:border-white/10">
      {/* Status Badge - Only show if we have new structure */}
      {hasNewStructure && statusLabel && (
        <div className="mb-4 flex items-center justify-center">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-500">
            {statusLabel}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {enrollmentEntries.map(({ key, section }) => {
          if (!section) return null;
          const displayValue = formatEnrollmentValue(key, section.value);
          const iconId = isEnrollmentIconId(section.icon)
            ? section.icon
            : undefined;
          const Icon = iconId ? ENROLLMENT_ICON_COMPONENTS[iconId] : null;

          return (
            <div
              key={key}
              className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
            >
              {Icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-muted-foreground/80 dark:text-muted-foreground/80">
                  {section.label}
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  {displayValue}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
