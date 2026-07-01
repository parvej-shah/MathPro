export interface Course {
  id: number;
  title: string;
  x_price: number;
  price: number;
  language: string;
  enrolled: number;
  short_description: string;
  // New top-level fields (frontend-guide-user.md §2)
  slug?: string | null;
  tags?: string[] | null;
  total_seats?: number | null;
  course_outline?: string | null;
  // New chips shape (frontend-guide-user.md §4) — read via _lib/chips.ts helpers.
  chips: import("@/features/course-details/_lib/chips").NewChips;
  instructor_list: {
    instructors: Instructor[];
  };
  is_live: boolean;
  url: string;
  feedback_list?: {
    feedbacks: Feedback[];
  };
}

export interface Instructor {
  id: number;
  name: string;
  image: string | null;
  role: string | null;
  university: string | null;
  credibility: string | null;
  achievements: string[];
  social: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  assignedCourses: number[];
  isActive: boolean;
  coursesCount: number;
  totalStudents: number;
}

export interface Feedback {
  name: string;
  bio: string;
  description: string;
  imageUploadedLink?: string;
  videoUrl?: string;
}

export interface CoursesResponse {
  success: boolean;
  data: Course[];
}

// Grouped course directory (COURSE_DIRECTORY_API_SPEC.md): category -> courses.
export interface CourseCategory {
  id: number;
  slug: string;
  category_name: string;
  courses: Course[];
}

export interface BundleCourse {
  id: number;
  title: string;
  price: number;
  x_price?: number;
  url: string;
  tags?: string[] | null;
  short_description?: string | null;
}

export interface DirectoryResponse {
  success: boolean;
  data: CourseCategory[];
}

export interface StatsData {
  totalStudents: number;
  totalCourses: number;
  averageRating: number;
  totalLiveClasses: number;
  totalRecordedVideos: number;
}

export interface FilterCategory {
  id: string;
  label: string;
  count?: number;
}

export interface Bundle {
  id: number;
  title: string;
  price: number;
  url: string;
  tags?: string[] | null;
  is_live: boolean;
  is_active: boolean;
  course_count: number;
  courses?: BundleCourse[];
  short_description?: string;
  intro_video?: string;
  chips?: {
    sections?: {
      liveClass?: { label: string; value: string };
      video?: { label: string; value: string };
    };
    thumbnails?: {
      bundle_thumb_4_3?: string;
    };
  };
}

export interface BundleResponse {
  success: boolean;
  data: Bundle[];
}

export interface InstructorResponse {
  success: boolean;
  data: Instructor[];
}
