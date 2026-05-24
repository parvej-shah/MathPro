import React from 'react';
import { BsCalendarEvent, BsPlayCircle } from 'react-icons/bs';

interface LiveClass {
    id: number;
    title: string;
    description: string;
    thumbnail: string;
    can_join: boolean;
    scheduled_at: number;
    duration: string;
    data: {
        recordedMeetingLink?: string;
    };
    interested: boolean;
}

interface LiveClassCardProps {
    liveClasses: LiveClass[];
    serverTime: number;
    loading?: boolean;
}

export const LiveClassCard: React.FC<LiveClassCardProps> = ({
    liveClasses,
    serverTime,
    loading = false
}) => {
    // Find the next upcoming or current live class
    const getNextLiveClass = () => {
        if (!liveClasses || liveClasses.length === 0) return null;
        
        // Sort by scheduled time
        const sorted = [...liveClasses].sort((a, b) => a.scheduled_at - b.scheduled_at);
        
        // Find first class that hasn't ended (scheduled_at + 2 hours buffer)
        const nextClass = sorted.find(cls => {
            const classEndTime = cls.scheduled_at + (2 * 60 * 60); // 2 hours buffer
            return classEndTime >= serverTime;
        });
        
        return nextClass || sorted[sorted.length - 1]; // Return last class if all ended
    };

    const nextClass = getNextLiveClass();

    // Format date from Unix timestamp
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Check if class is currently live (within 15 min before to 2 hours after)
    const isClassLive = (scheduledAt: number) => {
        const startBuffer = 15 * 60; // 15 minutes before
        const endBuffer = 2 * 60 * 60; // 2 hours after
        return serverTime >= (scheduledAt - startBuffer) && serverTime <= (scheduledAt + endBuffer);
    };

    if (loading) {
        return (
            <div className="bg-background p-6 rounded-3xl shadow-lg border-l-4 border-red-500 animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
            </div>
        );
    }

    if (!nextClass) {
        return (
            <div className="bg-background p-6 rounded-3xl shadow-lg border-l-4 border-border">
                <div className="flex items-center gap-4">
                    <div className="bg-muted p-4 rounded-2xl text-muted-foreground">
                        <BsCalendarEvent className="text-2xl" />
                    </div>
                    <div>
                        <h4 className="text-muted-foreground font-bold uppercase text-xs tracking-wider mb-1">
                            Live Classes
                        </h4>
                        <p className="text-lg font-semibold text-foreground">
                            No upcoming classes scheduled
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const isLive = nextClass.can_join && isClassLive(nextClass.scheduled_at);
    const hasRecording = !!nextClass.data.recordedMeetingLink;
    const isPast = serverTime > nextClass.scheduled_at + (2 * 60 * 60);

    return (
        <div className={`bg-background p-6 rounded-3xl shadow-lg border-l-4 ${
            isLive ? 'border-red-500' : 'border-purple'
        } flex flex-col sm:flex-row items-center justify-between gap-6`}>
            <div className="flex items-center gap-4 flex-1">
                <div className={`${
                    isLive ? 'bg-destructive/15 text-destructive' : 'bg-purple/10 text-purple'
                } p-4 rounded-2xl`}>
                    {isLive ? (
                        <BsCalendarEvent className="text-2xl" />
                    ) : (
                        <BsPlayCircle className="text-2xl" />
                    )}
                </div>
                <div className="flex-1">
                    <h4 className={`${
                        isLive ? 'text-destructive' : 'text-purple'
                    } font-bold uppercase text-xs tracking-wider mb-1`}>
                        {isLive ? '🔴 Live Now' : isPast ? 'Recent Class' : 'Upcoming Live Class'}
                    </h4>
                    <p className="text-lg md:text-xl font-bold text-heading dark:text-darkHeading line-clamp-1">
                        {nextClass.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        {formatDate(nextClass.scheduled_at)} • {nextClass.duration}
                    </p>
                </div>
            </div>

            <div className="w-full sm:w-auto">
                {isLive && nextClass.can_join ? (
                    <button
                        onClick={() => window.open('#', '_blank')}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-red-500/30"
                    >
                        Join Live Class
                    </button>
                ) : hasRecording ? (
                    <button
                        onClick={() => window.open(nextClass.data.recordedMeetingLink, '_blank')}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-purple text-white hover:bg-purple/90 shadow-lg shadow-purple/30"
                    >
                        Watch Recording
                    </button>
                ) : (
                    <button
                        disabled
                        className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-muted text-muted-foreground cursor-not-allowed"
                    >
                        {isPast ? 'Recording Coming Soon' : 'Not Started Yet'}
                    </button>
                )}
            </div>
        </div>
    );
};
