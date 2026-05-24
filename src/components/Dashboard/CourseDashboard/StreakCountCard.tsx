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
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-3xl shadow-lg border border-orange-200 dark:border-orange-800 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-orange-200 dark:bg-orange-700 rounded w-32" />
                        <div className="h-12 bg-orange-200 dark:bg-orange-700 rounded w-24" />
                        <div className="h-3 bg-orange-200 dark:bg-orange-700 rounded w-40" />
                    </div>
                    <div className="w-20 h-20 bg-orange-200 dark:bg-orange-700 rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 p-6 rounded-3xl shadow-lg border border-orange-200 dark:border-orange-800 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-400/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">


                <div className="flex items-center justify-between">
                    {/* Left side - Streak info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <BsFire className="text-orange-500 text-lg" />
                            <span className="text-orange-600 dark:text-orange-400 font-bold uppercase text-xs tracking-wider">
                                Learning Streak
                            </span>
                        </div>

                        <div className="mb-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-orange-600 dark:text-orange-400">
                                    {currentStreak}
                                </span>
                                <span className="text-xl font-semibold text-orange-500 dark:text-orange-500">
                                    days
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground font-medium">
                            Keep learning daily to build your streak! 🚀
                        </p>
                    </div>

                    {/* Right side - Fire icon */}
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                            <BsFire className="text-4xl text-white" />
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">Longest Streak</span>
                        <span className="text-orange-600 dark:text-orange-400 font-bold">{longestStreak} days</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
