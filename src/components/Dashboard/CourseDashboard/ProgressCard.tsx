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
            <div className="bg-card p-8 rounded-3xl shadow-sm border border-border animate-pulse">
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
        <div className="bg-card p-8 rounded-3xl shadow-sm border border-border relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
            <div className="relative z-10">
                <div className="flex justify-between items-start gap-3 mb-6">
                    <div className="flex-1 min-w-0">
                        <span className="text-primary font-bold tracking-wider uppercase text-xs sm:text-sm mb-1 block">
                            বর্তমান অগ্রগতি
                        </span>
                        <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                            তুমি এখন Module <span className="text-primary">{currentModule}</span>-এ আছো
                        </h3>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-[10px] sm:text-sm whitespace-nowrap shrink-0">
                        {progress}% সম্পন্ন
                    </div>
                </div>

                <div className="w-full bg-muted rounded-full h-4 mb-8 overflow-hidden">
                    <div
                        className="bg-linear-to-r from-primary to-teal h-full rounded-full transition-all duration-1000 ease-out relative"
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
                        className="w-full flex items-center justify-center gap-4 bg-linear-to-r from-primary to-teal hover:opacity-95 text-primary-foreground text-xl font-bold py-5 rounded-2xl transition-all duration-300 shadow-xl shadow-primary/20 group transform hover:-translate-y-1"
                    >
                        <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                            <BsPlay className="text-2xl" />
                        </div>
                        শেখা চালিয়ে যাও
                    </a>
                ) : (
                    <Link
                        href={
                            nextLesson?.moduleId && nextLesson?.chapterId
                                ? `/course/${courseId}/${nextLesson.chapterId}/${nextLesson.moduleId}`
                                : `/course/${courseId}`
                        }
                    >
                        <button className="w-full bg-linear-to-r from-primary to-teal hover:opacity-95 text-primary-foreground text-xl font-bold py-5 rounded-2xl flex items-center justify-center gap-4 transition-all duration-300 shadow-xl shadow-primary/20 group transform hover:-translate-y-1">
                            <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                                <BsPlay className="text-2xl" />
                            </div>
                            শেখা চালিয়ে যাও
                        </button>
                    </Link>
                )}

                {nextLesson ? (
                    <p className="text-center mt-4 text-muted-foreground text-sm">
                        পরের পাঠ: <span className="font-semibold text-foreground">{nextLesson.title}</span>
                    </p>
                ) : progress === 100 ? (
                    <p className="text-center mt-4 text-primary font-medium text-sm">
                        🎉 অভিনন্দন! তুমি এই কোর্সটি শেষ করেছো!
                    </p>
                ) : (
                    <p className="text-center mt-4 text-muted-foreground text-sm italic">
                        প্রতিটি বিশেষজ্ঞই একসময় শিক্ষার্থী ছিল। এগিয়ে যাও! 💪
                    </p>
                )}
            </div>
        </div>
    );
};
