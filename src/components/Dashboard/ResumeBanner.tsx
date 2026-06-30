"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BsPlayFill, BsArrowRight } from 'react-icons/bs';
import { EnrolledCourse } from './DashboardPage/types';
import { englishToBanglaNumbers } from '@/helpers';

function getRelativeBanglaTime(dateStr?: string): string {
    if (!dateStr) return 'সম্প্রতি';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'এইমাত্র';
    if (mins < 60) return `${englishToBanglaNumbers(mins)} মিনিট আগে`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${englishToBanglaNumbers(hours)} ঘণ্টা আগে`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'গতকাল';
    if (days < 7) return `${englishToBanglaNumbers(days)} দিন আগে`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${englishToBanglaNumbers(weeks)} সপ্তাহ আগে`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${englishToBanglaNumbers(months)} মাস আগে`;
    return `${englishToBanglaNumbers(Math.floor(months / 12))} বছর আগে`;
}

interface ResumeBannerProps {
    course?: EnrolledCourse;
    isLoading?: boolean;
}

const ResumeBanner: React.FC<ResumeBannerProps> = ({ course, isLoading }) => {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="w-full bg-linear-to-r from-primary/10 to-teal/10 dark:from-primary/20 dark:to-teal/20 rounded-3xl p-6 md:p-8 mb-10 ring-1 ring-foreground/10 shadow-xl relative overflow-hidden animate-pulse">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center relative z-10">
                    {/* Thumbnail Skeleton */}
                    <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
                        <div className="relative aspect-video rounded-xl bg-muted"></div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="grow w-full text-center md:text-left">
                        <div className="h-6 w-48 bg-muted rounded-full mb-4 mx-auto md:mx-0"></div>
                        <div className="h-8 w-3/4 bg-muted rounded mb-4 mx-auto md:mx-0"></div>

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6">
                            <div className="w-full md:w-64">
                                <div className="flex justify-between mb-2">
                                    <div className="h-4 w-20 bg-muted rounded"></div>
                                    <div className="h-4 w-10 bg-muted rounded"></div>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                    <div className="h-full bg-muted rounded-full w-full"></div>
                                </div>
                            </div>
                        </div>

                        <div className="h-12 w-40 bg-muted rounded-xl mx-auto md:mx-0"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div
            className="w-full bg-linear-to-r from-primary/10 to-teal/10 dark:from-primary/20 dark:to-teal/20 rounded-3xl p-6 md:p-8 mb-10 ring-1 ring-foreground/10 shadow-xl relative overflow-hidden"
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center relative z-10">
                {/* Thumbnail */}
                <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group">
                        <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-card/90 rounded-full flex items-center justify-center text-primary shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <BsPlayFill className="text-2xl ml-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grow text-center md:text-left">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3 uppercase tracking-wider">
                        যেখানে ছেড়েছিলে সেখান থেকে শুরু করো
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                        {course.title}
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6">
                        <div className="w-full md:w-64">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-foreground font-medium">
                                    {englishToBanglaNumbers(course.completedLessons)} / {englishToBanglaNumbers(course.totalLessons)} পাঠ
                                </span>
                                <span className="text-primary font-bold">{englishToBanglaNumbers(course.progress)}%</span>
                            </div>
                            <div className="w-full bg-muted ring-1 ring-foreground/10 rounded-full h-2">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-500"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>
                        <div className="hidden md:block h-8 w-px bg-muted"></div>
                        <div className="text-sm text-muted-foreground">
                            সর্বশেষ দেখা: <span className="font-medium text-foreground">{getRelativeBanglaTime(course.lastAccessed)}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push(`/dashboard/${course.id}`)}
                        className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/30 flex items-center gap-2 mx-auto md:mx-0 hover:-translate-y-0.5"
                    >
                        শেখা চালিয়ে যাও
                        <BsArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeBanner;
