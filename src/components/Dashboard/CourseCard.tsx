"use client";

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BsPlayFill, BsArrowRight, BsCollectionPlay } from 'react-icons/bs';
import { EnrolledCourse } from './DashboardPage/types';
import { englishToBanglaNumbers } from '@/helpers';

interface CourseCardProps {
    course: EnrolledCourse;
    onShowAll?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onShowAll }) => {
    const router = useRouter();
    const { title, thumbnail, progress, id, status, isBundle, courseCount } = course;
    const [imageFailed, setImageFailed] = useState(false);

    const linkHref = isBundle ? `/dashboard/bundle/${id}` : `/dashboard/${id}`;
    const clampedProgress = Math.max(0, Math.min(100, progress || 0));
    const initials = useMemo(
        () => title.split(" ").filter(Boolean).slice(0, 2).map((word) => word[0]).join("").toUpperCase(),
        [title]
    );
    const isImageUsable = Boolean(thumbnail) && !imageFailed;

    return (
        <article
            className="group relative rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/15 overflow-hidden flex h-full flex-col"
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />

            {/* Thumbnail Section */}
            <div className="relative aspect-video overflow-hidden bg-linear-to-br from-muted via-background to-muted">
                {isImageUsable ? (
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 via-muted to-teal/20">
                        <span className="rounded-2xl border border-border bg-card/70 px-4 py-2 text-2xl font-bold tracking-widest text-foreground/90">
                            {initials || "MP"}
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {isBundle && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-accent/90 text-accent-foreground border border-white/20 flex items-center gap-1">
                            <BsCollectionPlay /> Combo
                        </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/20
            ${status === 'Completed' ? 'bg-success/90 text-success-foreground' :
                            status === 'Not Started' ? 'bg-info/90 text-info-foreground' :
                                'bg-primary/90 text-primary-foreground'}`}>
                        {status === 'Completed' ? 'শেষ করেছো' : status === 'Not Started' ? 'শুরু করোনি' : 'চলছে'}
                    </span>
                </div>

                <div className="absolute left-4 right-4 bottom-4">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-white/85">
                        <span>কোর্স অগ্রগতি</span>
                        <span>{englishToBanglaNumbers(clampedProgress)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/20 backdrop-blur">
                        <div
                            className="h-full rounded-full bg-linear-to-r from-primary via-teal to-primary transition-all duration-700"
                            style={{ width: `${clampedProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col grow">
                <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {isBundle && course.courses && course.courses.length > 0 && (
                    <div className="mb-4 bg-muted/50 border border-border rounded-xl p-3">
                        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                            এই Combo-তে {englishToBanglaNumbers(courseCount ?? 0)}টি কোর্স আছে:
                        </p>
                        <div className="space-y-2">
                            {course.courses.slice(0, 3).map((c, idx) => (
                                <div key={c.id || idx} className="flex items-start gap-2 text-sm">
                                    <BsPlayFill className="text-primary mt-0.5 shrink-0" />
                                    <span className="text-foreground line-clamp-1 text-xs">
                                        {c.title}
                                    </span>
                                </div>
                            ))}
                            {(courseCount || 0) > 3 && (
                                <div className="text-xs text-primary font-medium pl-6">
                                    + আরও {englishToBanglaNumbers((courseCount || 0) - 3)}টি কোর্স
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-auto">
                    {isBundle && onShowAll ? (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onShowAll();
                            }}
                            className="w-full bg-muted hover:bg-primary text-foreground hover:text-primary-foreground py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn font-semibold text-sm border border-border hover:border-primary"
                        >
                            সব দেখো
                            <BsArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push(linkHref)}
                            className="w-full bg-linear-to-r from-primary to-teal text-primary-foreground py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn font-semibold text-sm border border-transparent hover:brightness-110"
                        >
                            {clampedProgress > 0 ? 'শেখা চালিয়ে যাও' : 'শেখা শুরু করো'}
                            <BsArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

export default CourseCard;
