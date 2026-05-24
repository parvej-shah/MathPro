"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { BsPlayFill, BsArrowRight } from 'react-icons/bs';
import { EnrolledCourse } from './DashboardPage/types';

interface ResumeBannerProps {
    course?: EnrolledCourse;
    isLoading?: boolean;
}

const ResumeBanner: React.FC<ResumeBannerProps> = ({ course, isLoading }) => {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="w-full bg-gradient-to-r from-purple/10 to-teal/10 dark:from-purple/20 dark:to-teal/20 rounded-3xl p-6 md:p-8 mb-10 border border-purple/10 dark:border-purple/20 relative overflow-hidden animate-pulse">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center relative z-10">
                    {/* Thumbnail Skeleton */}
                    <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                        <div className="relative aspect-video rounded-xl bg-muted"></div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="flex-grow w-full text-center md:text-left">
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
            className="w-full bg-gradient-to-r from-purple/10 to-teal/10 dark:from-purple/20 dark:to-teal/20 rounded-3xl p-6 md:p-8 mb-10 border border-purple/10 dark:border-purple/20 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center relative z-10">
                {/* Thumbnail */}
                <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group">
                        <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-purple shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                <BsPlayFill className="text-2xl ml-1" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow text-center md:text-left">
                    <div className="inline-block px-3 py-1 rounded-full bg-purple/10 text-purple text-xs font-bold mb-3 uppercase tracking-wider">
                        Pick up where you left off
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-heading dark:text-darkHeading mb-3">
                        {course.title}
                    </h2>

                    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 mb-6">
                        <div className="w-full md:w-64">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-foreground font-medium">
                                    {course.completedLessons} / {course.totalLessons} Lessons
                                </span>
                                <span className="text-purple font-bold">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div
                                    className="h-full bg-purple rounded-full transition-all duration-500"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>
                        <div className="hidden md:block h-8 w-px bg-muted"></div>
                        <div className="text-sm text-muted-foreground">
                            Last accessed: <span className="font-medium text-heading dark:text-darkHeading">Recently</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push(`/dashboard/${course.id}`)}
                        className="bg-purple text-white px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all shadow-lg shadow-purple/30 flex items-center gap-2 mx-auto md:mx-0 hover:-translate-y-0.5"
                    >
                        Resume Learning
                        <BsArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeBanner;
