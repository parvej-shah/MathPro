export type LmsPreference = "locked" | "unlocked";

const CP_LMS_COURSE_IDS = new Set<string>([
  "1",
  "2",
  "3",
  "4",
  "5",
]);

export function isLmsPreferenceCourse(courseId: string): boolean {
  return CP_LMS_COURSE_IDS.has(String(courseId));
}

export function getCpLmsUrlForCourse(courseId: string): string {
  return `https://cp.mathpro.com/course/${courseId}`;
}

