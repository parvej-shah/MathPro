"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BsCalendarEvent, BsChevronDown, BsChevronUp, BsClock } from "react-icons/bs";
import { useMyLiveModules, LiveModule } from "@/hooks/useMyLiveModules";

const VISIBLE_COUNT = 3;

function formatScheduledAt(timestamp: number | null): string {
  if (!timestamp) return "";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("bn-BD", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const LiveClassBanner: React.FC = () => {
  const router = useRouter();
  const { liveModules, loading } = useMyLiveModules();
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 border-l-destructive mb-10 animate-pulse">
        <div className="h-16 bg-muted rounded"></div>
      </div>
    );
  }

  if (!liveModules || liveModules.length === 0) return null;

  // On the main dashboard, only surface classes that are LIVE right now.
  // Upcoming (SCHEDULED) classes are shown on each course's own dashboard page.
  const liveNow = liveModules.filter((m) => m.live_status === "LIVE");
  if (liveNow.length === 0) return null;

  const displayedLive = showAll ? liveNow : liveNow.slice(0, VISIBLE_COUNT);

  return (
    <div className="space-y-4 mb-10">
      {displayedLive.map((mod: LiveModule) => (
        <div
          key={mod.id}
          className="bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 border-l-destructive flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-destructive/15 text-destructive p-4 rounded-2xl">
              <BsCalendarEvent className="text-2xl" />
            </div>
            <div className="flex-1">
              <h4 className="text-destructive font-bold uppercase text-xs tracking-wider mb-1">
                🔴 এখন লাইভ
              </h4>
              <p className="text-lg md:text-xl font-bold text-foreground line-clamp-1">
                {mod.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                {mod.course_title}
                {mod.live_scheduled_at && (
                  <>
                    <BsClock className="text-xs" />
                    {formatScheduledAt(mod.live_scheduled_at)}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <button
              onClick={() => router.push(`/dashboard/${mod.course_id}`)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-red-500/30"
            >
              লাইভ ক্লাসে যাও
            </button>
          </div>
        </div>
      ))}

      {liveNow.length > VISIBLE_COUNT && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 bg-muted text-foreground hover:bg-muted-foreground/20 flex items-center justify-center gap-2"
        >
          {showAll ? (
            <>
              কম দেখো <BsChevronUp />
            </>
          ) : (
            <>
              আরও {liveNow.length - VISIBLE_COUNT}টি দেখো <BsChevronDown />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default LiveClassBanner;
