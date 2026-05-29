"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsPlayFill, BsArrowRight, BsCollectionPlay } from 'react-icons/bs';
import { EnrolledCourse } from './DashboardPage/types';

interface CourseCardProps {
    course: EnrolledCourse;
    onShowAll?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onShowAll }) => {
    const router = useRouter();
    const { title, thumbnail, progress, id, status, isBundle, courseCount } = course;
    const [imageFailed, setImageFailed] = useState(false);

    // Determine link target
    const linkHref = isBundle ? `/dashboard/bundle/${id}` : `/dashboard/${id}`;
    const clampedProgress = Math.max(0, Math.min(100, progress || 0));
    const initials = useMemo(
        () => title.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase(),
        [title]
    );
    const isImageUsable = Boolean(thumbnail) && !imageFailed;

    return (
        <article
            className="group relative rounded-3xl border border-border/80 bg-card/95 shadow-[0_12px_28px_-20px_rgba(16,123,97,0.6)] transition-all duration-400 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_20px_36px_-20px_rgba(16,123,97,0.85)] overflow-hidden flex h-full flex-col backdrop-blur-sm"
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

            {/* Thumbnail Section */}
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted via-background to-muted">
                {isImageUsable ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_18%_20%,oklch(0.718_0.147_159.2_/_22%),transparent_38%),radial-gradient(circle_at_80%_75%,oklch(0.65_0.15_185_/_18%),transparent_42%),linear-gradient(165deg,oklch(0.20_0.015_240),oklch(0.15_0.008_238))]">
                        <span className="rounded-2xl border border-white/20 bg-black/20 px-4 py-2 text-2xl font-bold tracking-widest text-white/90">
                            {initials || "MP"}
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {isBundle && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-accent/90 text-accent-foreground border border-white/20 flex items-center gap-1">
                            <BsCollectionPlay /> Bundle
                        </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/20
            ${status === 'Completed' ? 'bg-success/90 text-success-foreground' :
                            status === 'Not Started' ? 'bg-info/90 text-info-foreground' :
                                'bg-primary/90 text-primary-foreground'}`}>
                        {status}
                    </span>
                </div>

                <div className="absolute left-4 right-4 bottom-4">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-white/85">
                        <span>Course Progress</span>
                        <span>{clampedProgress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/20 backdrop-blur">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-primary via-teal to-primary transition-all duration-700"
                            style={{ width: `${clampedProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {isBundle && course.courses && course.courses.length > 0 && (
                    <div className="mb-4 bg-muted/35 border border-border/80 rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                            Includes {courseCount} Courses:
                        </p>
                        <div className="space-y-2">
                            {course.courses.slice(0, 3).map((c, idx) => (
                                <div key={c.id || idx} className="flex items-start gap-2 text-sm">
                                    <BsPlayFill className="text-primary mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground line-clamp-1 text-xs">
                                        {c.title}
                                    </span>
                                </div>
                            ))}
                            {(courseCount || 0) > 3 && (
                                <div className="text-xs text-primary font-medium pl-6">
                                    + {(courseCount || 0) - 3} more courses
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-auto">
                    {/* Action Button */}
                    {isBundle && onShowAll ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onShowAll();
                            }}
                            className="w-full bg-muted/40 hover:bg-primary text-foreground hover:text-primary-foreground py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn font-semibold text-sm border border-border hover:border-primary"
                        >
                            Show All
                            <BsArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push(linkHref)}
                            className="w-full bg-gradient-to-r from-primary to-teal text-primary-foreground py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn font-semibold text-sm border border-transparent hover:brightness-110"
                        >
                            Start Learning
                            <BsArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

export default CourseCard;
