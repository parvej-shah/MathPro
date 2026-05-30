import React, { useState } from 'react';
import { BsCalendarEvent, BsPlayCircle, BsChevronDown, BsChevronUp, BsClock } from 'react-icons/bs';

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

interface LiveClassesSectionProps {
    liveClasses: LiveClass[];
    serverTime: number;
    loading?: boolean;
}

export const LiveClassesSection: React.FC<LiveClassesSectionProps> = ({
    liveClasses,
    serverTime,
    loading = false
}) => {
    const [showAll, setShowAll] = useState(false);

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

    // Check if class is currently live
    const isClassLive = (scheduledAt: number) => {
        const startBuffer = 15 * 60;
        const endBuffer = 2 * 60 * 60;
        return serverTime >= (scheduledAt - startBuffer) && serverTime <= (scheduledAt + endBuffer);
    };

    // Find the next upcoming or current live class
    const getNextLiveClass = () => {
        if (!liveClasses || liveClasses.length === 0) return null;
        
        const sorted = [...liveClasses].sort((a, b) => a.scheduled_at - b.scheduled_at);
        const nextClass = sorted.find(cls => {
            const classEndTime = cls.scheduled_at + (2 * 60 * 60);
            return classEndTime >= serverTime;
        });
        
        return nextClass || sorted[sorted.length - 1];
    };

    const nextClass = getNextLiveClass();
    
    // Get remaining classes (excluding the featured one)
    const remainingClasses = liveClasses
        .filter(cls => cls.id !== nextClass?.id)
        .sort((a, b) => b.scheduled_at - a.scheduled_at);
    
    const displayedRemainingClasses = showAll ? remainingClasses : remainingClasses.slice(0, 2);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 border-l-destructive animate-pulse">
                    <div className="h-24 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    if (!liveClasses || liveClasses.length === 0) {
        return (
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 border-l-border">
                <div className="flex items-center gap-4">
                    <div className="bg-muted p-4 rounded-2xl text-muted-foreground">
                        <BsCalendarEvent className="text-2xl" />
                    </div>
                    <div>
                        <h4 className="text-muted-foreground font-bold uppercase text-xs tracking-wider mb-1">
                            লাইভ ক্লাস
                        </h4>
                        <p className="text-lg font-semibold text-foreground">
                            এখনো কোনো লাইভ ক্লাস নির্ধারিত নেই
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!nextClass) {
        return (
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 border-l-border">
                <div className="flex items-center gap-4">
                    <div className="bg-muted p-4 rounded-2xl text-muted-foreground">
                        <BsCalendarEvent className="text-2xl" />
                    </div>
                    <div>
                        <h4 className="text-muted-foreground font-bold uppercase text-xs tracking-wider mb-1">
                            লাইভ ক্লাস
                        </h4>
                        <p className="text-lg font-semibold text-foreground">
                            এখনো কোনো লাইভ ক্লাস নির্ধারিত নেই
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const isLive = nextClass.can_join && isClassLive(nextClass.scheduled_at);
    const hasRecording = !!nextClass.data?.recordedMeetingLink;
    const isPast = serverTime > nextClass.scheduled_at + (2 * 60 * 60);

    return (
        <div className="space-y-4">
            {/* Featured Next/Current Live Class - Large Prominent Card */}
            <div className={`bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 ${
                isLive ? 'border-l-destructive' : 'border-l-primary'
            } flex flex-col sm:flex-row items-center justify-between gap-6`}>
                <div className="flex items-center gap-4 flex-1">
                    <div className={`${
                        isLive ? 'bg-destructive/15 text-destructive' : 'bg-primary/10 text-primary'
                    } p-4 rounded-2xl`}>
                        {isLive ? (
                            <BsCalendarEvent className="text-2xl" />
                        ) : (
                            <BsPlayCircle className="text-2xl" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h4 className={`${
                            isLive ? 'text-destructive' : 'text-primary'
                        } font-bold uppercase text-xs tracking-wider mb-1`}>
                            {isLive ? '🔴 এখন লাইভ' : isPast ? 'সাম্প্রতিক লাইভ ক্লাস' : 'আসন্ন লাইভ ক্লাস'}
                        </h4>
                        <p className="text-lg md:text-xl font-bold text-foreground line-clamp-1">
                            {nextClass.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <BsClock className="text-xs" />
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
                            লাইভ ক্লাসে যোগ দাও
                        </button>
                    ) : hasRecording ? (
                        <button
                            onClick={() => window.open(nextClass.data?.recordedMeetingLink ?? '#', '_blank')}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/30"
                        >
                            রেকর্ডিং দেখো
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-muted text-muted-foreground cursor-not-allowed"
                        >
                            {isPast ? 'রেকর্ডিং আসছে' : 'এখনো শুরু হয়নি'}
                        </button>
                    )}
                </div>
            </div>

            {/* Other Live Classes - Compact List */}
            {remainingClasses.length > 0 && (
                <div className="bg-card p-6 rounded-3xl shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">
                            অন্যান্য লাইভ ক্লাস
                        </h3>
                        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            {remainingClasses.length}
                        </span>
                    </div>
                    
                    <div className="space-y-3">
                        {displayedRemainingClasses.map((liveClass) => {
                            const isLiveClass = liveClass.can_join && isClassLive(liveClass.scheduled_at);
                            const hasRecordingClass = !!liveClass.data?.recordedMeetingLink;
                            const isPastClass = serverTime > liveClass.scheduled_at + (2 * 60 * 60);

                            return (
                                <div
                                    key={liveClass.id}
                                    className={`p-4 rounded-xl border ${
                                        isLiveClass
                                            ? 'bg-destructive/10 border-destructive/30'
                                            : 'bg-muted/40 border-border'
                                    } hover:shadow-md transition-all duration-200`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className={`${
                                                isLiveClass ? 'bg-destructive/15 text-destructive' : 'bg-primary/10 text-primary'
                                            } p-2.5 rounded-lg shrink-0`}>
                                                {isLiveClass ? (
                                                    <BsCalendarEvent className="text-base" />
                                                ) : (
                                                    <BsPlayCircle className="text-base" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {isLiveClass && (
                                                    <span className="inline-block px-2 py-0.5 text-xs font-bold text-destructive bg-destructive/20 rounded mb-1">
                                                        🔴 LIVE
                                                    </span>
                                                )}
                                                <h4 className="font-semibold text-foreground line-clamp-1 text-sm">
                                                    {liveClass.title}
                                                </h4>
                                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                                                    <BsClock className="text-xs" />
                                                    {formatDate(liveClass.scheduled_at)} • {liveClass.duration}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto shrink-0">
                                            {isLiveClass && liveClass.can_join ? (
                                                <button
                                                    onClick={() => window.open('#', '_blank')}
                                                    className="w-full sm:w-auto px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 bg-destructive text-white hover:bg-destructive/90 shadow-md"
                                                >
                                                    যোগ দাও
                                                </button>
                                            ) : hasRecordingClass ? (
                                                <button
                                                    onClick={() => window.open(liveClass.data?.recordedMeetingLink ?? '#', '_blank')}
                                                    className="w-full sm:w-auto px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 bg-primary text-primary-foreground hover:opacity-90"
                                                >
                                                    দেখো
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full sm:w-auto px-5 py-2 rounded-lg font-semibold text-sm bg-muted text-muted-foreground cursor-not-allowed"
                                                >
                                                    {isPastClass ? 'আসছে' : 'আসন্ন'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {remainingClasses.length > 2 && (
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="w-full mt-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-muted text-foreground hover:bg-muted-foreground/20 flex items-center justify-center gap-2"
                        >
                            {showAll ? (
                                <>
                                    কম দেখো <BsChevronUp />
                                </>
                            ) : (
                                <>
                                    আরও {remainingClasses.length - 2}টি দেখো <BsChevronDown />
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
