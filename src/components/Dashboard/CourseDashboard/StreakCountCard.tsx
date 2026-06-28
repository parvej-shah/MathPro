import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BsFire } from 'react-icons/bs';
import { useCourseStreak } from '@/hooks/useStreak';
import { englishToBanglaNumbers } from '@/helpers';
import { popVariants } from '@/components/Dashboard/motion';

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
    const reduceMotion = useReducedMotion();

    // Combine loading states
    const loading = externalLoading || streakLoading;

    // Use API data if available, otherwise fall back to props
    const currentStreak = streakData?.currentStreak ?? streakCount;
    const longestStreak = streakData?.longestStreak ?? 0;
    if (loading) {
        return (
            <div className="bg-secondary p-5 sm:p-6 rounded-2xl shadow-sm border border-border animate-pulse relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-3">
                        <div className="h-4 bg-secondary-foreground/15 rounded w-24 sm:w-32" />
                        <div className="h-10 sm:h-12 bg-secondary-foreground/15 rounded w-20 sm:w-24" />
                        <div className="h-3 bg-secondary-foreground/15 rounded w-32 sm:w-40" />
                    </div>
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-secondary-foreground/15 rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-secondary p-5 sm:p-6 rounded-2xl shadow-sm border border-border relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-accent/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-accent/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <BsFire className="text-accent text-base sm:text-lg" />
                            <span className="text-secondary-foreground font-bold uppercase text-[10px] sm:text-xs tracking-wider">
                                শেখার ধারা
                            </span>
                        </div>

                        <div className="mb-2 sm:mb-3">
                            <div className="flex items-baseline gap-1.5 sm:gap-2">
                                <motion.span
                                    key={currentStreak}
                                    variants={popVariants}
                                    initial={reduceMotion ? false : "hidden"}
                                    animate="show"
                                    className="text-4xl sm:text-5xl font-black text-accent"
                                >
                                    {englishToBanglaNumbers(currentStreak)}
                                </motion.span>
                                <span className="text-lg sm:text-xl font-semibold text-accent/80">
                                    দিন
                                </span>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm text-secondary-foreground/80 font-medium">
                            প্রতিদিন শিখলে ধারা ধরে রাখতে পারবে! 🚀
                        </p>
                    </div>

                    <div className="relative">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 bg-linear-to-br from-accent to-accent/70 rounded-full flex items-center justify-center shadow-lg shadow-accent/30 group-hover:scale-110 transition-transform duration-300">
                            <BsFire className="text-2xl sm:text-4xl text-accent-foreground" />
                        </div>
                        <div className="absolute inset-0 bg-accent rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    </div>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-secondary-foreground/15">
                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                        <span className="text-secondary-foreground/80 font-medium">সর্বোচ্চ ধারা</span>
                        <span className="text-accent font-bold">{englishToBanglaNumbers(longestStreak)} দিন</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
