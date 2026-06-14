import { getEnrollmentDates, type NewChips } from "@/features/course-details/_lib/chips";
import { formatDateToBengali } from "@/features/course-details/_lib/bengaliFormatter";
import { ENROLLMENT_ICON_COMPONENTS } from "@/features/course-details/_lib/enrollmentIcons";

interface EnrollmentInfoProps {
  chips?: NewChips | null;
}

export default function EnrollmentInfo({
  chips,
}: EnrollmentInfoProps) {
  const { prebookingEnd, enrollmentEnd, courseStart } = getEnrollmentDates(chips);

  // Display order; each row hidden when its date is null (frontend-guide-user.md §4).
  const rows = [
    { key: "prebooking_end", icon: "calendar-clock" as const, label: "প্রিবুকিং শেষ", date: prebookingEnd },
    { key: "enrollment_end", icon: "calendar-check" as const, label: "এনরোলমেন্ট শেষ", date: enrollmentEnd },
    { key: "classStart", icon: "rocket" as const, label: "ক্লাস শুরু", date: courseStart },
  ].filter((r) => r.date !== null);

  if (rows.length === 0) return null;

  const now = new Date();
  let statusLabel: string | null = null;
  if (prebookingEnd && now <= prebookingEnd) statusLabel = "প্রিবুকিং চলছে";
  else if (enrollmentEnd && now <= enrollmentEnd) statusLabel = "এনরোলমেন্ট চলছে";

  return (
    <div className="mt-4 pb-6 border-b border-black/10 dark:border-white/10">
      {statusLabel && (
        <div className="mb-4 flex items-center justify-center">
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-500">
            {statusLabel}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {rows.map(({ key, icon, label, date }, index) => {
          const Icon = ENROLLMENT_ICON_COMPONENTS[icon];
          const isLastSingleCard = rows.length % 2 === 1 && index === rows.length - 1;
          return (
            <div
              key={key}
              className={`flex items-center gap-4 rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm transition-shadow duration-200 hover:shadow-md dark:border-white/10 dark:bg-white/[0.04] ${isLastSingleCard ? "lg:col-span-2" : ""}`}
            >
              {Icon && (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Icon className="h-[18px] w-[18px]" />
                </div>
              )}
              <div className="min-w-0">
                <p className="whitespace-nowrap text-sm font-medium text-muted-foreground/80">
                  {label}
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  {formatDateToBengali((date as Date).toISOString())}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
