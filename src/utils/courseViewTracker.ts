/**
 * Course View Tracker
 * Tracks when users view courses to determine the most recently viewed course
 */

const STORAGE_KEY = 'codervai_last_viewed_course';
const MAX_HISTORY = 10; // Keep track of last 10 viewed courses

export interface CourseView {
  courseId: number;
  timestamp: number;
  progress?: number;
}

/**
 * Record that a course was viewed
 */
export function recordCourseView(courseId: number, progress?: number): void {
  if (typeof window === 'undefined') return;

  try {
    const view: CourseView = {
      courseId,
      timestamp: Date.now(),
      progress,
    };

    // Get existing history
    const history = getCourseViewHistory();

    // Remove any existing entry for this course
    const filtered = history.filter((v) => v.courseId !== courseId);

    // Add new view at the beginning
    const updated = [view, ...filtered].slice(0, MAX_HISTORY);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error recording course view:', error);
  }
}

/**
 * Get the full course view history
 */
export function getCourseViewHistory(): CourseView[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const history = JSON.parse(stored);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Error reading course view history:', error);
    return [];
  }
}

/**
 * Get the most recently viewed course ID
 */
export function getLastViewedCourseId(): number | null {
  const history = getCourseViewHistory();
  return history.length > 0 ? history[0].courseId : null;
}

/**
 * Get the most recently viewed course from a list of courses
 */
export function getMostRecentlyViewedCourse<T extends { id: number | string }>(
  courses: T[]
): T | null {
  if (courses.length === 0) return null;

  const history = getCourseViewHistory();
  if (history.length === 0) return null;

  // Find the first course in history that exists in the provided courses list
  for (const view of history) {
    const course = courses.find((c) => {
      const courseIdNum = typeof c.id === 'string' ? parseInt(c.id) : c.id;
      return courseIdNum === view.courseId;
    });
    if (course) {
      return course;
    }
  }

  return null;
}

/**
 * Clear course view history
 */
export function clearCourseViewHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing course view history:', error);
  }
}

/**
 * Get view count for a specific course
 */
export function getCourseViewCount(courseId: number): number {
  const history = getCourseViewHistory();
  return history.filter((v) => v.courseId === courseId).length;
}

/**
 * Check if a course was viewed recently (within last N minutes)
 */
export function wasViewedRecently(
  courseId: number,
  minutesAgo: number = 30
): boolean {
  const history = getCourseViewHistory();
  const view = history.find((v) => v.courseId === courseId);

  if (!view) return false;

  const ageInMinutes = (Date.now() - view.timestamp) / (1000 * 60);
  return ageInMinutes <= minutesAgo;
}
