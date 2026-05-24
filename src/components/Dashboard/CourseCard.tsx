"use client";

import React from 'react';
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

    // Determine link target
    const linkHref = isBundle ? `/dashboard/bundle/${id}` : `/dashboard/${id}`;

    return (
        <div 
            className="group bg-background rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-border overflow-hidden flex flex-col h-full"
        >
            {/* Thumbnail Section */}
            <div className="relative aspect-video overflow-hidden">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3 flex gap-2">
                    {isBundle && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-orange-500/90 text-white flex items-center gap-1">
                            <BsCollectionPlay /> Bundle
                        </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md
            ${status === 'Completed' ? 'bg-success/90 text-white' :
                            status === 'Not Started' ? 'bg-info/90 text-white' :
                                'bg-purple/90 text-white'}`}>
                        {status}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-heading dark:text-darkHeading mb-2 line-clamp-2 group-hover:text-purple transition-colors">
                    {title}
                </h3>

                {isBundle && course.courses && course.courses.length > 0 && (
                    <div className="mb-4 bg-muted/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                            Includes {courseCount} Courses:
                        </p>
                        <div className="space-y-2">
                            {course.courses.slice(0, 3).map((c, idx) => (
                                <div key={c.id || idx} className="flex items-start gap-2 text-sm">
                                    <BsPlayFill className="text-purple mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground line-clamp-1 text-xs">
                                        {c.title}
                                    </span>
                                </div>
                            ))}
                            {(courseCount || 0) > 3 && (
                                <div className="text-xs text-purple font-medium pl-6">
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
                            className="w-full bg-muted/40 hover:bg-purple text-heading dark:text-darkHeading hover:text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn font-medium text-sm border border-border hover:border-purple"
                        >
                            Show All
                            <BsArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push(linkHref)}
                            className="w-full bg-muted/40 hover:bg-purple text-heading dark:text-darkHeading hover:text-white py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn font-medium text-sm border border-border hover:border-purple"
                        >
                            Start Learning
                            <BsArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
