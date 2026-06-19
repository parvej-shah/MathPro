import React from 'react';
import { BsFire } from 'react-icons/bs';
import { useCourseStreak } from '@/hooks/useStreak';

interface StreakCountCardProps {
    courseId: string | string[];
    loading?: boolean;
    streakCount?: number;
}

export const StreakCountCard: React.FC<StreakCountCardProps> = ({
    courseId,
    loading: externalLoading = false,
    streakCount = 0
}) => {
    // Fetch streak data from API
    const { streakData, loading: streakLoading } = useCourseStreak(courseId);

    // Combine loading states
    const loading = externalLoading || streakLoading;

    // Use API data if available, otherwise fall back to props
    const currentStreak = streakData?.currentStreak ?? streakCount;
    const longestStreak = streakData?.longestStreak ?? 0;
    if (loading) {
        return (
            <div className="bg-linear-to-br from-orange-500/10 to-red-500/10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-orange-500/30 animate-pulse relative overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orange-400/90 to-transparent" />
                <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-orange-400/25 rounded w-24 sm:w-32" />
                        <div className="h-10 sm:h-12 bg-orange-400/25 rounded w-20 sm:w-24" />
                        <div className="h-3 bg-orange-400/25 rounded w-32 sm:w-40" />
                    </div>
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-orange-400/25 rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-linear-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-orange-200 dark:border-orange-800 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-orange-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-red-400/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <BsFire className="text-orange-500 text-base sm:text-lg" />
                            <span className="text-orange-600 dark:text-orange-400 font-bold uppercase text-[10px] sm:text-xs tracking-wider">
                                শেখার ধারা
                            </span>
                        </div>

                        <div className="mb-2 sm:mb-3">
                            <div className="flex items-baseline gap-1.5 sm:gap-2">
                                <span className="text-4xl sm:text-5xl font-black text-orange-600 dark:text-orange-400">
                                    {currentStreak}
                                </span>
                                <span className="text-lg sm:text-xl font-semibold text-orange-500 dark:text-orange-500">
                                    দিন
                                </span>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                            প্রতিদিন শিখলে ধারা ধরে রাখতে পারবে! 🚀
                        </p>
                    </div>

                    <div className="relative">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-linear-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                            <BsFire className="text-2xl sm:text-4xl text-white" />
                        </div>
                        <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                        <span className="text-muted-foreground font-medium">সর্বোচ্চ ধারা</span>
                        <span className="text-orange-600 dark:text-orange-400 font-bold">{longestStreak} দিন</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
