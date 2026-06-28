import React from 'react';
import Link from 'next/link';
import { BsPlay } from 'react-icons/bs';
import { englishToBanglaNumbers } from '@/helpers';

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
    loading?: boolean;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
    currentModule,
    progress,
    courseId,
    nextLesson,
    loading = false
}) => {
    if (loading) {
        return (
            <div className="bg-card p-5 sm:p-6 rounded-2xl shadow-sm border border-border border-l-4 border-l-primary animate-pulse">
                <div className="flex justify-between items-start gap-3 mb-4 sm:mb-6">
                    <div className="flex-1">
                        <div className="h-4 w-28 sm:w-32 bg-muted rounded mb-2"></div>
                        <div className="h-7 sm:h-8 w-40 sm:w-48 bg-muted rounded"></div>
                    </div>
                    <div className="h-7 sm:h-8 w-20 sm:w-24 bg-muted rounded-full"></div>
                </div>
                <div className="w-full bg-muted rounded-full h-3 sm:h-4 mb-6 sm:mb-8"></div>
                <div className="h-14 sm:h-16 w-full bg-muted rounded-2xl"></div>
            </div>
        );
    }

    return (
        <div className="bg-card p-5 sm:p-6 rounded-2xl shadow-sm border border-border border-l-4 border-l-primary relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex justify-between items-start gap-3 mb-4 sm:mb-6">
                    <div className="flex-1 min-w-0">
                        <span className="text-primary font-bold tracking-wider uppercase text-[10px] sm:text-xs mb-1 block">
                            বর্তমান অগ্রগতি
                        </span>
                        <h3 className="text-base sm:text-2xl md:text-3xl font-bold text-foreground leading-tight">
                            তুমি এখন Module <span className="text-primary">{englishToBanglaNumbers(currentModule)}</span>-এ আছো
                        </h3>
                    </div>
                    <div className="bg-primary/10 text-primary px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-[10px] sm:text-sm whitespace-nowrap shrink-0">
                        {englishToBanglaNumbers(progress)}% সম্পন্ন
                    </div>
                </div>

                <div className="w-full bg-muted rounded-full h-3 sm:h-4 mb-5 sm:mb-8 overflow-hidden">
                    <div
                        className="bg-linear-to-r from-primary to-teal h-full rounded-full transition-all duration-1000 ease-out relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>

                <Link
                    href={
                        nextLesson?.moduleId && nextLesson?.chapterId
                            ? `/course/${courseId}/${nextLesson.chapterId}/${nextLesson.moduleId}`
                            : `/course/${courseId}`
                    }
                >
                    <button className="w-full bg-linear-to-r from-primary to-teal hover:opacity-95 text-primary-foreground text-base sm:text-xl font-bold py-3.5 sm:py-5 rounded-xl flex items-center justify-center gap-3 sm:gap-4 transition-all duration-300 shadow-xl shadow-primary/20 group transform hover:-translate-y-1">
                        <div className="bg-white/20 p-1.5 sm:p-2 rounded-full group-hover:scale-110 transition-transform">
                            <BsPlay className="text-xl sm:text-2xl" />
                        </div>
                        শেখা চালিয়ে যাও
                    </button>
                </Link>

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
