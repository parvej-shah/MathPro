import React, { useState } from "react";
import { BsBell, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";
import { englishToBanglaNumbers } from "@/helpers";

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_date: string;
}

interface AnnouncementsCardProps {
  announcements: Announcement[];
  loading?: boolean;
  totalCount?: number;
}

export const AnnouncementsCard: React.FC<AnnouncementsCardProps> = ({
  announcements,
  loading = false,
  totalCount = 0,
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 24) {
      return diffInHours === 0
        ? "এইমাত্র"
        : `${englishToBanglaNumbers(diffInHours)} ঘণ্টা আগে`;
    } else if (diffInDays < 7) {
      return `${englishToBanglaNumbers(diffInDays)} দিন আগে`;
    } else {
      const formatted = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      // Convert only the numeric digits, leave month name intact.
      return formatted.replace(/\d/g, (d) => englishToBanglaNumbers(d));
    }
  };

  // Helper function to check if content is long enough to need truncation
  const isContentLong = (content: string, maxLength: number = 100): boolean => {
    // Strip HTML to get actual text length for comparison
    const tmp = document.createElement("div");
    tmp.innerHTML = content;
    const textLength = (tmp.textContent || tmp.innerText || "").length;
    return textLength > maxLength;
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="w-full self-start h-auto! bg-card p-4 sm:p-6 rounded-2xl shadow-sm border border-border relative z-0">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-bold text-lg sm:text-xl text-foreground">
            ইন্সট্রাক্টর আপডেট
          </h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted"
            >
              <div className="flex gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-muted rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="w-full self-start h-auto! bg-card p-4 sm:p-6 rounded-2xl shadow-sm border border-border relative z-0">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-bold text-lg sm:text-xl text-foreground">
            ইন্সট্রাক্টর আপডেট
          </h3>
        </div>
        <div className="h-44 sm:h-55 text-center py-6 flex flex-col items-center justify-center">
          <div className="bg-muted w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <BsBell size={20} className="text-muted-foreground sm:text-2xl" />
          </div>
          <p className="text-muted-foreground text-sm">
            এখনো কোনো আপডেট নেই
          </p>
        </div>
      </div>
    );
  }

  // Always show section-style layout with featured announcement
  const featuredAnnouncement = announcements[0];
  const remainingAnnouncements = announcements.slice(1);
  const displayedRemaining = showAll
    ? remainingAnnouncements
    : remainingAnnouncements.slice(0, 2);

  const isFeaturedExpanded = expandedId === featuredAnnouncement.id;
  const featuredHasLongContent = isContentLong(
    featuredAnnouncement.content,
    120,
  );

  return (
    <div className="space-y-4">
      {/* Featured Latest Announcement */}
      <div className="bg-card p-4 sm:p-6 rounded-2xl shadow-sm border border-border border-l-4 border-l-warning">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="bg-warning/15 text-warning p-2.5 sm:p-3 rounded-xl sm:rounded-2xl shrink-0">
            <BsBell className="text-lg sm:text-xl" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-warning font-bold uppercase text-xs tracking-wider mb-1">
              সর্বশেষ আপডেট
            </h4>
            <h3 className="text-base font-bold text-foreground mb-2 line-clamp-2">
              {featuredAnnouncement.title}
            </h3>
            <div
              className={`text-sm text-muted-foreground mb-2 leading-relaxed ${
                !isFeaturedExpanded ? "line-clamp-4" : ""
              }`}
            >
              <SafeHtmlRenderer content={featuredAnnouncement.content} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-medium">
                {formatDate(featuredAnnouncement.created_date)}
              </p>
              {featuredHasLongContent && (
                <button
                  onClick={() => toggleExpand(featuredAnnouncement.id)}
                  className="text-xs text-warning hover:text-warning/80 font-semibold transition-colors"
                >
                  {isFeaturedExpanded ? "কম দেখো" : "আরও পড়ো"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Other Announcements - Only show if there are more than 1 announcement */}
      {remainingAnnouncements.length > 0 && (
        <div className="bg-card p-4 sm:p-6 rounded-2xl shadow-sm border border-border">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              আগের আপডেট
            </h3>
            <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {englishToBanglaNumbers(remainingAnnouncements.length)}
            </span>
          </div>

          <div className="space-y-3">
            {displayedRemaining.map((announcement) => {
              const isExpanded = expandedId === announcement.id;
              const hasLongContent = isContentLong(announcement.content, 80);

              return (
                <div
                  key={announcement.id}
                  className="p-3 rounded-xl border bg-muted/40 border-border hover:bg-warning/10 hover:border-warning/30 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-warning/15 text-warning p-2 rounded-lg shrink-0">
                      <BsBell className="text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">
                        {announcement.title}
                      </h4>
                      <div
                        className={`text-xs text-muted-foreground mb-2 leading-relaxed ${
                          !isExpanded ? "line-clamp-3" : ""
                        }`}
                      >
                        <SafeHtmlRenderer content={announcement.content} />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground font-medium">
                          {formatDate(announcement.created_date)}
                        </p>
                        {hasLongContent && (
                          <button
                            onClick={() => toggleExpand(announcement.id)}
                            className="text-xs text-warning hover:text-warning/80 font-medium transition-colors"
                          >
                            {isExpanded ? "কম" : "আরও"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {remainingAnnouncements.length > 2 && (
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
                  আরও {englishToBanglaNumbers(remainingAnnouncements.length - 2)}টি দেখো{" "}
                  <BsChevronDown />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
