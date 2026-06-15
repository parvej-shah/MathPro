import React, { useState } from 'react';
import { BsCalendarEvent, BsChevronDown, BsChevronUp, BsClock } from 'react-icons/bs';
import { LiveModule } from '@/hooks/useMyLiveModules';

interface LiveClassesSectionProps {
    liveModules: LiveModule[];
    loading?: boolean;
}

export const LiveClassesSection: React.FC<LiveClassesSectionProps> = ({
    liveModules,
    loading = false
}) => {
    const [showAll, setShowAll] = useState(false);

    const formatScheduledAt = (timestamp: number | null) => {
        if (!timestamp) return '';
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('bn-BD', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 border-l-destructive animate-pulse">
                <div className="h-24 bg-muted rounded"></div>
            </div>
        );
    }

    if (!liveModules || liveModules.length === 0) {
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

    const featured = liveModules[0];
    const remaining = liveModules.slice(1);
    const displayedRemaining = showAll ? remaining : remaining.slice(0, 2);
    const isFeaturedLive = featured.live_status === 'LIVE';

    return (
        <div className="space-y-4">
            {/* Featured Live/Upcoming Class - Large Prominent Card */}
            <div className={`bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 ${
                isFeaturedLive ? 'border-l-destructive' : 'border-l-primary'
            } flex flex-col sm:flex-row items-center justify-between gap-6`}>
                <div className="flex items-center gap-4 flex-1">
                    <div className={`${
                        isFeaturedLive ? 'bg-destructive/15 text-destructive' : 'bg-primary/10 text-primary'
                    } p-4 rounded-2xl`}>
                        <BsCalendarEvent className="text-2xl" />
                    </div>
                    <div className="flex-1">
                        <h4 className={`${
                            isFeaturedLive ? 'text-destructive' : 'text-primary'
                        } font-bold uppercase text-xs tracking-wider mb-1`}>
                            {isFeaturedLive ? '🔴 এখন লাইভ' : 'আসন্ন লাইভ ক্লাস'}
                        </h4>
                        <p className="text-lg md:text-xl font-bold text-foreground line-clamp-1">
                            {featured.title}
                        </p>
                        {featured.live_scheduled_at && (
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                <BsClock className="text-xs" />
                                {formatScheduledAt(featured.live_scheduled_at)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="w-full sm:w-auto">
                    {isFeaturedLive ? (
                        <button
                            onClick={() => window.open(`https://zoom.us/j/${featured.live_meeting_id}`, '_blank')}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-red-500/30"
                        >
                            লাইভ ক্লাসে যোগ দাও
                        </button>
                    ) : (
                        <button
                            disabled
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-muted text-muted-foreground cursor-not-allowed"
                        >
                            এখনো শুরু হয়নি
                        </button>
                    )}
                </div>
            </div>

            {/* Other Live/Upcoming Classes - Compact List */}
            {remaining.length > 0 && (
                <div className="bg-card p-6 rounded-3xl shadow-sm border border-border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-foreground">
                            অন্যান্য লাইভ ক্লাস
                        </h3>
                        <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                            {remaining.length}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {displayedRemaining.map((mod) => {
                            const isLive = mod.live_status === 'LIVE';

                            return (
                                <div
                                    key={mod.id}
                                    className={`p-4 rounded-xl border ${
                                        isLive
                                            ? 'bg-destructive/10 border-destructive/30'
                                            : 'bg-muted/40 border-border'
                                    } hover:shadow-md transition-all duration-200`}
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div className={`${
                                                isLive ? 'bg-destructive/15 text-destructive' : 'bg-primary/10 text-primary'
                                            } p-2.5 rounded-lg shrink-0`}>
                                                <BsCalendarEvent className="text-base" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {isLive && (
                                                    <span className="inline-block px-2 py-0.5 text-xs font-bold text-destructive bg-destructive/20 rounded mb-1">
                                                        🔴 LIVE
                                                    </span>
                                                )}
                                                <h4 className="font-semibold text-foreground line-clamp-1 text-sm">
                                                    {mod.title}
                                                </h4>
                                                {mod.live_scheduled_at && (
                                                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                                                        <BsClock className="text-xs" />
                                                        {formatScheduledAt(mod.live_scheduled_at)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-auto shrink-0">
                                            {isLive ? (
                                                <button
                                                    onClick={() => window.open(`https://zoom.us/j/${mod.live_meeting_id}`, '_blank')}
                                                    className="w-full sm:w-auto px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-300 bg-destructive text-white hover:bg-destructive/90 shadow-md"
                                                >
                                                    যোগ দাও
                                                </button>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="w-full sm:w-auto px-5 py-2 rounded-lg font-semibold text-sm bg-muted text-muted-foreground cursor-not-allowed"
                                                >
                                                    আসন্ন
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {remaining.length > 2 && (
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
                                    আরও {remaining.length - 2}টি দেখো <BsChevronDown />
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
