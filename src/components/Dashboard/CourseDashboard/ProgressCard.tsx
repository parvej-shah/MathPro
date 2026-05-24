import React from 'react';
import Link from 'next/link';
import { BsPlay } from 'react-icons/bs';

interface ProgressCardProps {
    currentModule: number;
    progress: number;
    courseId: string | string[];
    nextLesson?: {
        title: string;
        chapterTitle: string;
        moduleId?: number;
        chapterId?: number;
    } | null;
    /** When set, "Continue Learning" links to this URL (e.g. external LMS) instead of in-app course route */
    continueLearningUrl?: string;
    loading?: boolean;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
    currentModule,
    progress,
    courseId,
    nextLesson,
    continueLearningUrl,
    loading = false
}) => {
    if (loading) {
        return (
            <div className="bg-background p-8 rounded-3xl shadow-lg border border-border animate-pulse">
                <div className="flex justify-between items-start gap-3 mb-6">
                    <div className="flex-1">
                        <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                        <div className="h-8 w-48 bg-muted rounded"></div>
                    </div>
                    <div className="h-8 w-24 bg-muted rounded-full"></div>
                </div>
                <div className="w-full bg-muted rounded-full h-4 mb-8"></div>
                <div className="h-16 w-full bg-muted rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="bg-background p-8 rounded-3xl shadow-lg border border-border relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start gap-3 mb-6">
                    <div className="flex-1 min-w-0">
                        <span className="text-purple font-bold tracking-wider uppercase text-xs sm:text-sm mb-1 block">
                            Current Progress
                        </span>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-heading dark:text-darkHeading leading-tight">
                            You are on Module <span className="text-purple">{currentModule}</span>
                        </h3>
                    </div>
                    <div className="bg-purple/10 text-purple px-2 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-[10px] sm:text-sm whitespace-nowrap flex-shrink-0">
                        {progress}% Complete
                    </div>
                </div>

                <div className="w-full bg-muted rounded-full h-4 mb-8 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-purple to-pink-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>

                {continueLearningUrl ? (
                    <a
                        href={continueLearningUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-purple to-indigo-600 hover:from-purple/90 hover:to-indigo-700 text-white text-xl font-bold py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-purple/20 group transform hover:-translate-y-1"
                    >
                        <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                            <BsPlay className="text-2xl" />
                        </div>
                        Continue Learning
                    </a>
                ) : (
                    <Link
                        href={
                            nextLesson?.moduleId && nextLesson?.chapterId
                                ? `/course/${courseId}/${nextLesson.chapterId}/${nextLesson.moduleId}`
                                : `/course/${courseId}`
                        }
                    >
                        <button className="w-full bg-gradient-to-r from-purple to-indigo-600 hover:from-purple/90 hover:to-indigo-700 text-white text-xl font-bold py-5 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 shadow-xl shadow-purple/20 group transform hover:-translate-y-1">
                            <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                                <BsPlay className="text-2xl" />
                            </div>
                            Continue Learning
                        </button>
                    </Link>
                )}

                {nextLesson ? (
                    <p className="text-center mt-4 text-muted-foreground text-sm">
                        Next up: <span className="font-semibold text-heading dark:text-darkHeading">{nextLesson.title}</span>
                    </p>
                ) : progress === 100 ? (
                    <p className="text-center mt-4 text-purple font-medium text-sm">
                        🎉 Congratulations! You&apos;ve completed this course!
                    </p>
                ) : (
                    <p className="text-center mt-4 text-muted-foreground text-sm italic">
                        Every expert was once a beginner. Keep going! 💪
                    </p>
                )}
            </div>
        </div>
    );
};
