import { useMemo } from "react";
import LandingStyleCourseCard from "./LandingStyleCourseCard";
import type { Bundle } from "../_lib/types";

interface ComboCardProps {
  combo: Bundle;
}

function getComboOriginalPrice(combo: Bundle) {
  return (combo.courses || []).reduce((total, course) => {
    const original = course.x_price ?? course.price ?? 0;
    return total + Number(original || 0);
  }, 0);
}

function getComboThumbnail(combo: Bundle) {
  return combo.chips?.thumbnails?.bundle_thumb_4_3 || null;
}

export default function ComboCard({ combo }: ComboCardProps) {
  const thumbnail = useMemo(() => getComboThumbnail(combo), [combo]);
  const originalPrice = useMemo(() => getComboOriginalPrice(combo), [combo]);
  const tags = combo.tags?.slice(0, 3) || [];

  return (
    <LandingStyleCourseCard
      id={combo.id}
      title={combo.title}
      description={combo.short_description || undefined}
      thumbnail={thumbnail}
      href={`/combos/${combo.url || combo.id}`}
      price={combo.price}
      originalPrice={originalPrice > combo.price ? originalPrice : undefined}
      tags={tags}
      isLive={combo.is_live}
    />
  );
}
