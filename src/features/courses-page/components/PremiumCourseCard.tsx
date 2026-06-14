import React from "react";
import LandingStyleCourseCard from "./LandingStyleCourseCard";
import { Course } from "../_lib/types";
import { getCourseThumbnail, deriveSectionFlags } from "@/features/course-details/_lib/chips";

interface PremiumCourseCardProps {
  course: Course;
}

export default function PremiumCourseCard({ course }: PremiumCourseCardProps) {
  const thumbnail = getCourseThumbnail(course.chips);
  const flags = deriveSectionFlags(course.chips);

  // Prefer the course's own tags for chips; fall back to derived section flags.
  const tags: string[] =
    course.tags && course.tags.length > 0
      ? course.tags.slice(0, 3)
      : [
          ...(flags.hasLive ? ["লাইভ ক্লাস"] : []),
          ...(flags.hasRecorded ? ["রেকর্ডেড"] : []),
          ...(flags.hasExam ? ["কুইজ"] : []),
        ];

  return (
    <LandingStyleCourseCard
      id={course.id}
      title={course.title}
      description={course.short_description}
      thumbnail={thumbnail}
      href={`/courses/${course.slug || course.url || course.id}`}
      price={course.price}
      originalPrice={course.x_price > course.price ? course.x_price : undefined}
      tags={tags}
      isLive={course.is_live}
      hasRecorded={flags.hasRecorded}
      hasExam={flags.hasExam}
    />
  );
}
