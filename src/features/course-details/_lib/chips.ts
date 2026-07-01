/**
 * Chips normalization for the NEW backend course/chips shape.
 *
 * Backend now sends (see Math_Pro_backend/docs/frontend-guide-user.md §4):
 *   chips = {
 *     bundle_id,
 *     thumbnails: { course_thumbnail_16_9, trailer_video_thumb_16_9, facebook_community_thumb_16_9 },
 *     socials: { facebook_community, facebook_page, facebook_private_group, telegram_group,
 *                whatsapp, messenger, phone, email },
 *     sections: [{ label, value }, ...],            // FLAT ARRAY (was an object map before)
 *     enrollment_details: { prebooking_end_date, enrollment_end_date, course_start_date } // unix seconds
 *   }
 *
 * These helpers read that shape directly so components don't have to. There is no
 * old-shape fallback — the running backend emits the new shape for all courses.
 */

export interface NewChips {
  bundle_id?: string | number | null;
  thumbnails?: {
    course_thumbnail_16_9?: string;
    course_thumbnail_card_4_3?: string;
    trailer_video_thumb_16_9?: string;
    facebook_community_thumb_16_9?: string;
  };
  socials?: {
    facebook_community?: string;
    facebook_page?: string;
    facebook_private_group?: string;
    telegram_group?: string;
    whatsapp?: string;
    messenger?: string;
    phone?: string;
    email?: string;
  };
  sections?: Array<{ label?: string; value?: string | number }>;
  enrollment_details?: {
    prebooking_end_date?: number | null;
    enrollment_end_date?: number | null;
    course_start_date?: number | null;
  };
}

export interface StatSection {
  label: string;
  value: string | number;
}

/** Main course thumbnail (16:9). New key is `course_thumbnail_16_9` (no `_link`). */
export const getCourseThumbnail = (chips?: NewChips | null): string | null =>
  chips?.thumbnails?.course_thumbnail_16_9 || null;

/** Card thumbnail (4:3). Falls back to the 16:9 banner until a dedicated card image is set. */
export const getCourseCardThumbnail = (chips?: NewChips | null): string | null =>
  chips?.thumbnails?.course_thumbnail_card_4_3 ||
  chips?.thumbnails?.course_thumbnail_16_9 ||
  null;

/** Flat array of {label, value} stat chips. Filters out empty entries. */
export const getStatSections = (chips?: NewChips | null): StatSection[] => {
  const sections = Array.isArray(chips?.sections) ? chips!.sections : [];
  return sections
    .filter((s) => s && s.label && s.value !== undefined && s.value !== null && s.value !== "")
    .map((s) => ({ label: String(s.label), value: s.value as string | number }));
};

/** Heuristic flags for card badges, derived from the flat sections' labels. */
export const deriveSectionFlags = (chips?: NewChips | null) => {
  const labels = getStatSections(chips).map((s) => s.label.toLowerCase());
  const has = (...needles: string[]) =>
    labels.some((l) => needles.some((n) => l.includes(n)));
  return {
    hasLive: has("লাইভ", "live"),
    hasRecorded: has("ভিডিও", "রেকর্ড", "video", "recorded"),
    hasExam: has("কুইজ", "পরীক্ষা", "কন্টেস্ট", "quiz", "exam", "contest", "প্র্যাক্টিস", "practice"),
  };
};

/** Unix-seconds enrollment dates as JS Dates (or null). */
export const getEnrollmentDates = (chips?: NewChips | null) => {
  const d = chips?.enrollment_details;
  const toDate = (sec?: number | null) =>
    typeof sec === "number" && sec > 0 ? new Date(sec * 1000) : null;
  return {
    prebookingEnd: toDate(d?.prebooking_end_date),
    enrollmentEnd: toDate(d?.enrollment_end_date),
    courseStart: toDate(d?.course_start_date),
  };
};
