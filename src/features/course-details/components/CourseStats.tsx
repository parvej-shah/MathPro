import { getStatSections, type NewChips } from "@/features/course-details/_lib/chips";

interface CourseStatsProps {
  chips?: NewChips | null;
}

// Accent colors cycled across stat chips (the old design used a different color per stat type;
// the new backend sends a flat array with no type key, so we cycle by index).
const ACCENT_COLORS = ["#D95344", "#B2F100", "#FFA500", "#EE4878", "#B153E0", "#36A2EB"];

export default function CourseStats({ chips }: CourseStatsProps) {
  const sections = getStatSections(chips);
  if (sections.length === 0) return null;

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-3">
      {sections.map((section, i) => (
        <div
          key={`${section.label}-${i}`}
          className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 dark:bg-white/5"
        >
          <span
            className="inline-block h-6 w-6 shrink-0 rounded-md"
            style={{ backgroundColor: ACCENT_COLORS[i % ACCENT_COLORS.length] }}
            aria-hidden
          />
          <div>
            <p className="text-muted-foreground text-xl">{section.label}</p>
            <p className="text-foreground font-bold text-2xl mt-1">{section.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
