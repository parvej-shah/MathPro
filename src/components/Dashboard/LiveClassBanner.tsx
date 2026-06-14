"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BsCalendarEvent, BsClock } from "react-icons/bs";
import { useMyLiveModules, LiveModule } from "@/hooks/useMyLiveModules";

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

  if (loading) {
    return (
      <div className="bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 border-l-destructive mb-10 animate-pulse">
        <div className="h-16 bg-muted rounded"></div>
      </div>
    );
  }

  if (!liveModules || liveModules.length === 0) return null;

  const featured: LiveModule = liveModules[0];
  const isLive = featured.live_status === "LIVE";

  return (
    <div
      className={`bg-card p-6 rounded-3xl shadow-sm border border-border border-l-4 mb-10 ${
        isLive ? "border-l-destructive" : "border-l-primary"
      } flex flex-col sm:flex-row items-center justify-between gap-6`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`${
            isLive
              ? "bg-destructive/15 text-destructive"
              : "bg-primary/10 text-primary"
          } p-4 rounded-2xl`}
        >
          <BsCalendarEvent className="text-2xl" />
        </div>
        <div className="flex-1">
          <h4
            className={`${
              isLive ? "text-destructive" : "text-primary"
            } font-bold uppercase text-xs tracking-wider mb-1`}
          >
            {isLive ? "🔴 এখন লাইভ" : "আসন্ন লাইভ ক্লাস"}
          </h4>
          <p className="text-lg md:text-xl font-bold text-foreground line-clamp-1">
            {featured.title}
          </p>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            {featured.course_title}
            {featured.live_scheduled_at && (
              <>
                <BsClock className="text-xs" />
                {formatScheduledAt(featured.live_scheduled_at)}
              </>
            )}
          </p>
        </div>
      </div>

      <div className="w-full sm:w-auto">
        <button
          onClick={() => router.push(`/dashboard/${featured.course_id}`)}
          className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            isLive
              ? "bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-red-500/30"
              : "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/30"
          }`}
        >
          {isLive ? "লাইভ ক্লাসে যাও" : "বিস্তারিত দেখো"}
        </button>
      </div>
    </div>
  );
};

export default LiveClassBanner;
