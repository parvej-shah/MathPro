import React, { useMemo } from "react";
import LandingStyleCourseCard from "./LandingStyleCourseCard";
import { Bundle } from "../_lib/types";
import { getYouTubeThumbnail } from "@/features/course-details/_lib/youtubeHelpers";

interface PremiumBundleCardProps {
  bundle: Bundle;
}

export default function PremiumBundleCard({ bundle }: PremiumBundleCardProps) {
  const thumbnail = useMemo(() => {
    if (bundle.intro_video) {
      const yt = getYouTubeThumbnail(bundle.intro_video);
      if (yt) return yt;
    }
    return (
      bundle.chips?.thumbnails?.bundle_thumb_16_9 ||
      bundle.chips?.thumbnails?.bundle_thumb_4_3 ||
      null
    );
  }, [bundle.intro_video, bundle.chips?.thumbnails]);

  const tags: string[] = [];
  if (bundle.course_count) tags.push(`${bundle.course_count}টি কোর্স`);
  if (bundle.chips?.sections?.liveClass) tags.push("লাইভ ক্লাস");
  if (bundle.chips?.sections?.video) tags.push("রেকর্ডেড");

  return (
    <LandingStyleCourseCard
      id={bundle.id}
      title={bundle.title}
      description={bundle.short_description}
      thumbnail={thumbnail}
      href={bundle.url || `/bundle/${bundle.id}`}
      price={bundle.price}
      tags={tags}
      isLive={bundle.is_live}
      hasRecorded={!!bundle.chips?.sections?.video}
      hasExam={false}
    />
  );
}
