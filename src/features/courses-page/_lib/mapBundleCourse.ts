import type { Course } from "./types";

export interface BundleCourseSource {
  id: number;
  title: string;
  price: number;
  x_price?: number;
  language?: string;
  enrolled?: number;
  short_description?: string;
  url?: string;
  is_live?: boolean;
  chips?: {
    course_thumbnail_link?: string;
    thumbnails?: {
      course_thumbnail_16_9?: string;
      course_thumbnail_link_16_9?: string;
      trailer_video_thumb_16_9?: string;
      facebook_community_thumb_16_9?: string;
    };
    sections?: {
      chapter?: { label: string; value: string };
      video?: { label: string; value: string };
      contest?: { label: string; value: string };
      liveClass?: { label: string; value: string };
      codingProblem?: { label: string; value: string };
      archiveClass?: { label: string; value: string };
    };
  };
  instructor_list?: Course["instructor_list"];
  feedback_list?: Course["feedback_list"];
}

export function mapBundleCourseToCourse(course: BundleCourseSource): Course {
  return {
    id: course.id,
    title: course.title,
    x_price: course.x_price || course.price,
    price: course.price,
    language: course.language || "bn",
    enrolled: course.enrolled || 0,
    short_description: course.short_description || "",
    chips: {
      thumbnails: {
        course_thumbnail_16_9:
          course.chips?.thumbnails?.course_thumbnail_16_9 ||
          course.chips?.thumbnails?.course_thumbnail_link_16_9 ||
          course.chips?.course_thumbnail_link ||
          "",
        trailer_video_thumb_16_9: course.chips?.thumbnails?.trailer_video_thumb_16_9,
        facebook_community_thumb_16_9: course.chips?.thumbnails?.facebook_community_thumb_16_9,
      },
      sections: Object.values(course.chips?.sections || {}).filter(
        (s): s is { label: string; value: string } => Boolean(s),
      ),
    },
    instructor_list: course.instructor_list || { instructors: [] },
    is_live: Boolean(course.is_live || course.chips?.sections?.liveClass),
    url: course.url || String(course.id),
    feedback_list: course.feedback_list,
  };
}
