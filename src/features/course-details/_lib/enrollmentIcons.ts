import type { LucideIcon } from "lucide-react";
import {
  AlarmClock,
  BookOpenCheck,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckCircle,
  Clock,
  DoorClosed,
  DoorOpen,
  Flag,
  GraduationCap,
  Lock,
  Milestone,
  PlayCircle,
  Rocket,
  Sparkles,
  StopCircle,
  Timer,
  Trophy,
  Unlock,
} from "lucide-react";

export const ENROLLMENT_ICON_IDS = [
  "calendar-days",
  "calendar-range",
  "calendar-clock",
  "calendar-check",
  "clock",
  "alarm",
  "timer",
  "play-circle",
  "stop-circle",
  "flag",
  "check-circle",
  "rocket",
  "sparkles",
  "milestone",
  "unlock",
  "lock",
  "door-open",
  "door-closed",
  "graduation-cap",
  "book-open-check",
  "trophy",
] as const;

export type EnrollmentIconId = (typeof ENROLLMENT_ICON_IDS)[number];

export const ENROLLMENT_ICON_LABELS: Record<EnrollmentIconId, string> = {
  "calendar-days": "Calendar days",
  "calendar-range": "Calendar range",
  "calendar-clock": "Calendar clock",
  "calendar-check": "Calendar check",
  clock: "Clock",
  alarm: "Alarm",
  timer: "Timer",
  "play-circle": "Play",
  "stop-circle": "Stop",
  flag: "Flag",
  "check-circle": "Check",
  rocket: "Rocket",
  sparkles: "Sparkles",
  milestone: "Milestone",
  unlock: "Unlock",
  lock: "Lock",
  "door-open": "Door open",
  "door-closed": "Door closed",
  "graduation-cap": "Graduation cap",
  "book-open-check": "Book open check",
  trophy: "Trophy",
};

export const ENROLLMENT_ICON_COMPONENTS: Record<EnrollmentIconId, LucideIcon> = {
  "calendar-days": CalendarDays,
  "calendar-range": CalendarRange,
  "calendar-clock": CalendarClock,
  "calendar-check": CalendarCheck,
  clock: Clock,
  alarm: AlarmClock,
  timer: Timer,
  "play-circle": PlayCircle,
  "stop-circle": StopCircle,
  flag: Flag,
  "check-circle": CheckCircle,
  rocket: Rocket,
  sparkles: Sparkles,
  milestone: Milestone,
  unlock: Unlock,
  lock: Lock,
  "door-open": DoorOpen,
  "door-closed": DoorClosed,
  "graduation-cap": GraduationCap,
  "book-open-check": BookOpenCheck,
  trophy: Trophy,
};

const ENROLLMENT_ICON_ID_SET = new Set<string>(ENROLLMENT_ICON_IDS);

export const FALLBACK_ENROLLMENT_ICON_ID: EnrollmentIconId = "calendar-days";

export const isEnrollmentIconId = (
  value: string | null | undefined,
): value is EnrollmentIconId => {
  if (!value) return false;
  return ENROLLMENT_ICON_ID_SET.has(value);
};
