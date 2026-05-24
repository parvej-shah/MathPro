export interface Course {
  id: number;
  title: string;
  x_price: number;
  price: number;
  language: string;
  enrolled: number;
  short_description: string;
  chips: {
    deadline?: string;
    total_seats?: string;
    sections?: {
      chapter?: { label: string; value: string };
      video?: { label: string; value: string };
      contest?: { label: string; value: string };
      liveClass?: { label: string; value: string };
      codingProblem?: { label: string; value: string };
      archiveClass?: { label: string; value: string };
    };
    enrollment?: {
      start?: { label: string; value: string; icon?: string };
      end?: { label: string; value: string; icon?: string };
      classStart?: { label: string; value: string; icon?: string };
      classTime?: { label: string; value: string; icon?: string };
    };
    course_thumbnail_link?: string;
    thumbnails?: {
      course_thumbnail_link_16_9?: string;
      trailer_video_thumb_16_9?: string;
      facebook_community_thumb_16_9?: string;
    };
  };
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
  bio: string | null;
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
}

export interface CoursesResponse {
  success: boolean;
  data: Course[];
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
  is_live: boolean;
  is_active: boolean;
  course_count: number;
  short_description?: string;
  intro_video?: string;
  chips?: {
    sections?: {
      liveClass?: { label: string; value: string };
      video?: { label: string; value: string };
    };
    thumbnails?: {
      bundle_thumb_16_9?: string;
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


