"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { SyncLoader } from "react-spinners";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";

interface NotificationModuleData {
  liveId?: string | number;
  chapterId?: string | number;
  moduleId?: string | number;
  title?: string;
  moduleTitle?: string;
  scheduled_at?: number;
  scheduledAt?: number;
  startTime?: number;
}

interface NotificationData {
  title?: string;
  body?: string;
  scheduled_at?: number;
  scheduledAt?: number;
  moduleData?: NotificationModuleData;
}

interface Notification {
  id: string | number;
  type: string;
  course_id?: string | number;
  is_read: boolean;
  timestamp: number;
  data: NotificationData;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | string[] | undefined;
  onNotificationClick?: (notification: Notification) => void;
  onCountUpdate?: () => void;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = MONTH_NAMES[date.getMonth()];
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day} ${month} ${year}, ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${ampm}`;
};

const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
};

/** Format scheduled date (Unix s or ms); return "Time TBA" if invalid. */
const formatScheduledDate = (value: number | undefined | null): string => {
  if (value == null || typeof value !== "number") return "Time TBA";
  const ms = value < 1e12 ? value * 1000 : value;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Time TBA";
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

/** Get display title; fixes "undefined" / "Invalid Date" for LIVE (e.g. cp2.0). */
const getNotificationDisplayTitle = (notification: Notification): string => {
  const raw = notification?.data?.title;
  const type = notification?.type;
  const moduleData = notification?.data?.moduleData ?? {};
  const liveTitle = moduleData?.title ?? moduleData?.moduleTitle ?? "";
  const scheduledAt =
    moduleData?.scheduled_at ??
    moduleData?.scheduledAt ??
    moduleData?.startTime ??
    notification?.data?.scheduled_at ??
    notification?.data?.scheduledAt;
  const isBadTitle =
    raw == null ||
    (typeof raw === "string" && (raw === "" || raw.includes("undefined") || raw.includes("Invalid Date")));
  if (type === "LIVE" && isBadTitle) {
    const titlePart = liveTitle ? `titled ${liveTitle}` : "a live session";
    const dateStr = formatScheduledDate(scheduledAt);
    return `A new live is scheduled ${titlePart}, it will be started at ${dateStr}`;
  }
  return raw ?? "Notification";
};

export default function NotificationModal({
  isOpen,
  onClose,
  courseId,
  onNotificationClick,
  onCountUpdate,
}: Props) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const notificationPerPage = 10;

  const fetchNotifications = async (page: number = 0, append: boolean = false) => {
    if (!courseId || !isOpen) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/user/notification/list?offset=${page * notificationPerPage}&limit=${notificationPerPage}&courseId=${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newNotifications = response.data.data || [];
      
      if (append) {
        setNotifications((prev) => [...prev, ...newNotifications]);
      } else {
        setNotifications(newNotifications);
      }

      if (newNotifications.length < notificationPerPage) {
        setHasMore(false);
      }
    } catch (error) {
      console.warn("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && courseId) {
      setCurrentPage(0);
      setHasMore(true);
      setExpandedId(null);
      setSelectedNotification(null);
      fetchNotifications(0, false);
    }
  }, [isOpen, courseId]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchNotifications(nextPage, true);
    }
  };

  const markAsRead = async (notification: Notification) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `${BACKEND_URL}/user/notification/markAsRead/${notification.id}?courseId=${notification.course_id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
      if (onCountUpdate) {
        onCountUpdate();
      }
    } catch (error) {
      console.warn("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    if (!token || !courseId) return;

    try {
      await axios.post(
        `${BACKEND_URL}/user/notification/markAllAsRead?courseId=${courseId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      if (onCountUpdate) {
        onCountUpdate();
      }
    } catch (error) {
      console.warn("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === "ADMIN_SIDE") {
      setSelectedNotification(notification);
      setExpandedId(String(notification.id));
      if (!notification.is_read) {
        markAsRead(notification);
      }
    } else if (notification.type === "LIVE") {
      const token = localStorage.getItem("token");
      window.location.href =
        "https://live.codervai.com/?id=" +
        notification?.data?.moduleData?.liveId +
        "&token=" +
        token;
      if (!notification.is_read) {
        markAsRead(notification);
      }
    } else if (notification.type === "ASSIGNMENT") {
      router.push(
        `/course/${notification?.data?.moduleData?.chapterId}/${notification?.data?.moduleData?.moduleId}`
      );
      if (!notification.is_read) {
        markAsRead(notification);
      }
    }

    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/40 backdrop-blur-sm"
        className="w-full max-w-2xl rounded-2xl bg-white/95 dark:bg-[#0B060D]/95 backdrop-blur-xl border border-border/30 p-0"
      >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/30 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <svg
                          className="w-6 h-6 text-heading dark:text-darkHeading"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 1.25C7.71983 1.25 4.25004 4.71979 4.25004 9V9.7041C4.25004 10.401 4.04375 11.0824 3.65717 11.6622L2.50856 13.3851C1.17547 15.3848 2.19318 18.1028 4.51177 18.7351C5.26738 18.9412 6.02937 19.1155 6.79578 19.2581L6.79768 19.2632C7.56667 21.3151 9.62198 22.75 12 22.75C14.378 22.75 16.4333 21.3151 17.2023 19.2632L17.2042 19.2581C17.9706 19.1155 18.7327 18.9412 19.4883 18.7351C21.8069 18.1028 22.8246 15.3848 21.4915 13.3851L20.3429 11.6622C19.9563 11.0824 19.75 10.401 19.75 9.7041V9C19.75 4.71979 16.2802 1.25 12 1.25ZM15.3764 19.537C13.1335 19.805 10.8664 19.8049 8.62349 19.5369C9.33444 20.5585 10.571 21.25 12 21.25C13.4289 21.25 14.6655 20.5585 15.3764 19.537ZM5.75004 9C5.75004 5.54822 8.54826 2.75 12 2.75C15.4518 2.75 18.25 5.54822 18.25 9V9.7041C18.25 10.6972 18.544 11.668 19.0948 12.4943L20.2434 14.2172C21.0086 15.3649 20.4245 16.925 19.0936 17.288C14.4494 18.5546 9.5507 18.5546 4.90644 17.288C3.57561 16.925 2.99147 15.3649 3.75664 14.2172L4.90524 12.4943C5.45609 11.668 5.75004 10.6972 5.75004 9.7041V9Z"
                            className="fill-heading dark:fill-darkHeading"
                          />
                        </svg>
                        {unreadCount > 0 && (
                          <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-[11px] font-semibold text-white shadow-lg">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-bold text-heading dark:text-darkHeading">
                          Notifications
                        </DialogTitle>
                        {unreadCount > 0 && (
                          <p className="text-xs text-paragraph dark:text-darkParagraph">
                            {unreadCount} unread
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="px-3 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <svg
                          className="w-5 h-5 text-heading dark:text-darkHeading"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notifications List */}
                <div id="scrollableDiv" className="max-h-[70vh] overflow-y-auto customScrollbar darkCustomScrollbar">
                  {notifications.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-16 px-6">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-muted-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                      <p className="text-heading dark:text-darkHeading font-medium">
                        No notifications
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph text-sm mt-1">
                        You&apos;re all caught up!
                      </p>
                    </div>
                  ) : (
                    <InfiniteScroll
                      dataLength={notifications.length}
                      next={loadMore}
                      hasMore={hasMore}
                      loader={
                        <div className="flex justify-center py-4">
                          <SyncLoader
                            color="#B153E0"
                            loading={true}
                            size={6}
                          />
                        </div>
                      }
                      scrollableTarget="scrollableDiv"
                    >
                      <div className="px-4 py-2">
                        {notifications.map((notification) => {
                          const isExpanded = String(expandedId) === String(notification.id);
                          const isRead = notification.is_read;

                          return (
                            <div
                              key={notification.id}
                              className={`group relative mb-2 rounded-xl transition-all duration-200 ${
                                isRead
                                  ? "bg-muted/40"
                                  : "bg-gradient-to-r from-purple-50/50 to-purple-100/30 dark:from-purple-900/20 dark:to-purple-800/10 border-l-4 border-purple-500"
                              } ${
                                notification.type !== "COURSE_UPDATE"
                                  ? "cursor-pointer hover:shadow-md"
                                  : ""
                              }`}
                              onClick={(e) => {
                                // Don't trigger if clicking on expand button or its children
                                const target = e.target as HTMLElement;
                                if (
                                  target.closest(".expand-button") ||
                                  target.classList.contains("expand-button") ||
                                  target.closest("button")
                                ) {
                                  return;
                                }
                                if (notification.type !== "COURSE_UPDATE") {
                                  if (notification.type === "ADMIN_SIDE") {
                                    // For ADMIN_SIDE, toggle expand on click
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (isExpanded) {
                                      setExpandedId(null);
                                      setSelectedNotification(null);
                                    } else {
                                      setExpandedId(String(notification.id));
                                      setSelectedNotification(notification);
                                      if (!notification.is_read) {
                                        markAsRead(notification);
                                      }
                                    }
                                  } else {
                                    handleNotificationClick(notification);
                                  }
                                }
                              }}
                            >
                              <div className="p-4">
                                <div className="flex items-start gap-3">
                                  {/* Notification Icon */}
                                  <div className="flex-shrink-0 mt-1">
                                    <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        isRead
                                          ? "bg-muted"
                                          : "bg-gradient-to-br from-purple-500 to-purple-600"
                                      }`}
                                    >
                                      <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 23"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M13.4673 19.5024C13.2242 21.1987 11.7652 22.5025 10.0016 22.5025C8.23812 22.5025 6.77911 21.1987 6.536 19.5024H13.4673ZM10.0016 0.5C14.6114 0.5 18.3642 4.16899 18.4991 8.74605V9.00124H18.5029L18.5026 13.113L19.9167 16.7573C19.9548 16.8557 19.9806 16.9583 19.9936 17.0627L20.0033 17.2203C20.0033 17.883 19.4996 18.4281 18.8542 18.4937L18.7233 18.5003H1.27644C1.11773 18.5003 0.960407 18.4708 0.812492 18.4133C0.194816 18.173 -0.130655 17.506 0.0422008 16.8807L0.0834777 16.7563L1.49965 13.112L1.50041 9.00124C1.50041 4.30614 5.30654 0.5 10.0016 0.5Z"
                                          fill={isRead ? "#9CA3AF" : "#FFFFFF"}
                                        />
                                      </svg>
                                    </div>
                                  </div>

                                  {/* Notification Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1">
                                        <p
                                          className={`text-base font-semibold ${
                                            isRead
                                              ? "text-paragraph dark:text-darkParagraph"
                                              : "text-heading dark:text-darkHeading"
                                          }`}
                                        >
                                          {getNotificationDisplayTitle(notification)}
                                        </p>
                                        <p className="text-xs text-paragraph dark:text-darkParagraph mt-1">
                                          {formatTimeAgo(notification.timestamp * 1000)}
                                        </p>
                                      </div>
                                      {!isRead && (
                                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-2" />
                                      )}
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded &&
                                      notification.type === "ADMIN_SIDE" && (
                                        <div className="mt-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
                                          <div className="space-y-3">
                                            <p className="text-xs font-medium text-paragraph dark:text-darkParagraph">
                                              {formatTimestamp(
                                                notification.timestamp * 1000
                                              )}
                                            </p>
                                            <div className="text-sm text-paragraph dark:text-darkParagraph leading-relaxed">
                                              <SafeHtmlRenderer
                                                content={
                                                  notification.data.body || ""
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    
                                    {/* Expand/Collapse Indicator for ADMIN_SIDE */}
                                    {notification.type === "ADMIN_SIDE" && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          if (isExpanded) {
                                            setExpandedId(null);
                                            setSelectedNotification(null);
                                          } else {
                                            setExpandedId(String(notification.id));
                                            setSelectedNotification(notification);
                                            if (!notification.is_read) {
                                              markAsRead(notification);
                                            }
                                          }
                                        }}
                                        className="expand-button mt-2 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                                      >
                                        <span>{isExpanded ? "Show less" : "Show details"}</span>
                                        <svg
                                          className={`w-4 h-4 transition-transform duration-200 ${
                                            isExpanded ? "rotate-180" : ""
                                          }`}
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                          />
                                        </svg>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </InfiniteScroll>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="sticky bottom-0 bg-background/80 backdrop-blur-xl border-t border-border/30 px-6 py-3">
                    <button
                      onClick={() => {
                        router.push(`/notifications/${courseId}`);
                        onClose();
                      }}
                      className="w-full py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
      </DialogContent>
    </Dialog>
  );
}
