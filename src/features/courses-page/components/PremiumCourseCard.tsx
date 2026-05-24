import React from "react";
import LandingStyleCourseCard from "./LandingStyleCourseCard";
import { Course } from "../_lib/types";

interface PremiumCourseCardProps {
  course: Course;
}

export default function PremiumCourseCard({ course }: PremiumCourseCardProps) {
  const thumbnail =
    course.chips?.thumbnails?.course_thumbnail_link_16_9 ||
    course.chips?.course_thumbnail_link ||
    null;

  const tags: string[] = [];
  if (course.chips?.sections?.liveClass) tags.push("লাইভ ক্লাস");
  if (course.chips?.sections?.video) tags.push("রেকর্ডেড");
  if (course.chips?.sections?.contest) tags.push("কুইজ");

  return (
    <LandingStyleCourseCard
      id={course.id}
      title={course.title}
      description={course.short_description}
      thumbnail={thumbnail}
      href={`/course-details/${course.id}`}
      price={course.price}
      originalPrice={course.x_price > course.price ? course.x_price : undefined}
      tags={tags}
      isLive={course.is_live}
      hasRecorded={!!course.chips?.sections?.video}
      hasExam={!!course.chips?.sections?.contest}
    />
  );
}
