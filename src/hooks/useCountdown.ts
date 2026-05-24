import { useState, useEffect } from 'react';

interface UseCountdownReturn {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

interface EnrollmentDeadlines {
    prebooking_end?: string;
    enrollment_end?: string;
    deadline?: string; // Old structure (backward compatible)
}

/**
 * Smart countdown hook that supports multiple deadline types
 * Logic:
 * - If is_live === false: Use prebooking_end (if exists), else fallback to deadline
 * - If is_live === true: Use enrollment_end (if exists), else fallback to deadline
 */
export const useCountdown = (
    deadline: string | undefined,
    enrollment?: EnrollmentDeadlines,
    isLive?: boolean
): UseCountdownReturn => {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const calculateTimeLeft = () => {
        const now: any = new Date();
        let targetDate: any = null;

        // Smart logic based on is_live status
        if (isLive === false) {
            // Prebook mode: Use prebooking_end if exists
            if (enrollment?.prebooking_end) {
                targetDate = new Date(enrollment.prebooking_end);
            } else if (deadline) {
                // Fallback to old deadline structure
                targetDate = new Date(deadline);
            }
        } else if (isLive === true) {
            // Enrollment mode: Use enrollment_end if exists
            if (enrollment?.enrollment_end) {
                targetDate = new Date(enrollment.enrollment_end);
            } else if (deadline) {
                // Fallback to old deadline structure
                targetDate = new Date(deadline);
            }
        } else {
            // is_live is undefined: Fallback to old priority logic for backward compatibility
            if (enrollment?.prebooking_end) {
                targetDate = new Date(enrollment.prebooking_end);
            } else if (enrollment?.enrollment_end) {
                targetDate = new Date(enrollment.enrollment_end);
            } else if (deadline) {
                targetDate = new Date(deadline);
            }
        }

        if (!targetDate) {
            setDays(0);
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            return;
        }

        const difference: any = targetDate - now;

        // Handle negative difference (target date in the past)
        if (difference <= 0) {
            setDays(0);
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            return;
        }

        const remainingDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        const remainingHours = Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const remainingMinutes = Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const remainingSeconds = Math.floor((difference % (1000 * 60)) / 1000);

        setDays(remainingDays);
        setHours(remainingHours);
        setMinutes(remainingMinutes);
        setSeconds(remainingSeconds);
    };

    useEffect(() => {
        // Initial calculation
        calculateTimeLeft();

        // Update every second
        const intervalId = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deadline, enrollment?.prebooking_end, enrollment?.enrollment_end, isLive]);

    return { days, hours, minutes, seconds };
};
