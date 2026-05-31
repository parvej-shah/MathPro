"use client";

import { BACKEND_URL } from "@/api.config";
import axios from "axios";
import { Bell, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  populateFn: (notification: NotificationRecord) => void,
  notification: NotificationRecord
};

type NotificationRecord = {
  id?: string | number;
  timestamp: number;
  type?: string;
  is_read?: boolean;
  course_id?: string | number;
  courseName?: string;
  data?: {
    title?: string;
    body?: string;
    scheduled_at?: number;
    scheduledAt?: number;
    moduleData?: {
      title?: string;
      moduleTitle?: string;
      scheduled_at?: number;
      scheduledAt?: number;
      startTime?: number;
      liveId?: string | number;
      chapterId?: string | number;
      moduleId?: string | number;
    };
  };
};

const formatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);

  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

/** Format a Unix timestamp (seconds or ms) for display; returns a Bengali fallback if invalid. */
const formatScheduledDate = (value: number | undefined | null): string => {
  if (value == null || typeof value !== "number") return "সময় পরে জানানো হবে";
  const ms = value < 1e12 ? value * 1000 : value;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "সময় পরে জানানো হবে";
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

/** Get display title for notification; fixes "undefined" / "Invalid Date" for LIVE (e.g. cp2.0). */
const getNotificationDisplayTitle = (notification: NotificationRecord): string => {
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
    const titlePart = liveTitle ? `${liveTitle} লাইভ ক্লাস` : "নতুন লাইভ ক্লাস";
    const dateStr = formatScheduledDate(scheduledAt);
    return `${titlePart} শুরু হবে ${dateStr}`;
  }

  return raw ?? "নোটিফিকেশন";
};

export default function NotificationItem({ populateFn: populate, notification }: Props) {
  const router = useRouter();
  const [readOverride, setReadOverride] = useState(false);
  const isReadState = Boolean(readOverride || notification.is_read);
  const [mouseIn, setMouseIn] = useState(false);
  const readNotification = (notification: NotificationRecord): void => {
    const token = localStorage.getItem("token");

    axios
      .post(`${BACKEND_URL}/user/notification/markAsRead/${notification.id}?courseId=${notification.course_id}`,
        null, {
        headers: {
          Authorization: `bearer ${token}`
        }
      }
      )
      .then(() => {
        setReadOverride(true);
      });
  };

  return (
    <div
      className={`group flex items-start justify-between rounded-xl border backdrop-blur-md transition ${
        notification.type !== "COURSE_UPDATE" ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-xl" : ""
      } ${
        isReadState
          ? "border-border bg-card/75"
          : "border-primary/25 bg-primary/8 shadow-lg shadow-primary/5"
      }`}
      onMouseEnter={() => {
        setMouseIn(true);
      }}
      onMouseLeave={() => {
        setMouseIn(false);
      }}
    >
      <div
        className="flex min-w-0 items-start gap-4 p-4 sm:p-5"
      >
        <div
          className={`mt-1 flex size-11 shrink-0 items-center justify-center rounded-xl border ${
            isReadState
              ? "border-border bg-muted text-muted-foreground"
              : "border-accent/30 bg-accent/15 text-accent"
          }`}
        >
          <Bell className="size-5" aria-hidden="true" />
        </div>

        <div
          className="min-w-0"
          onClick={(): void => {
            // Always show modal first for details
            if (notification.type === "ADMIN_SIDE" || notification.data?.body) {
              populate(notification);
            } else if (notification.type === "LIVE") {
              // Show modal first, then redirect
              populate(notification);
              // Also redirect after a short delay
              setTimeout(() => {
                const token = localStorage.getItem("token");
                window.location.href =
                  "https://live.codervai.com/?id=" +
                  notification?.data?.moduleData?.liveId +
                  "&token=" +
                  token;
              }, 500);
            } else if (notification.type === "ASSIGNMENT") {
              // Show modal first, then navigate
              populate(notification);
              // Also navigate after a short delay
              setTimeout(() => {
                router.push(
                  `/course/${notification?.data?.moduleData?.chapterId}/${notification?.data?.moduleData?.moduleId}`,
                );
              }, 500);
            } else {
              // For other types, just show modal if available
              populate(notification);
            }

            if (notification.type !== "COURSE_UPDATE") {
              readNotification(notification);
            }
          }}
        >
          {notification.courseName && (
            <span className="mb-2 inline-flex max-w-full items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {notification.courseName}
            </span>
          )}
          <p className="text-base font-semibold leading-snug text-foreground sm:text-lg">
            {getNotificationDisplayTitle(notification)}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm font-medium text-muted-foreground">
              {formatTimestamp(notification.timestamp * 1000)}
            </p>
            {!isReadState && (
              <span className="size-2 rounded-full bg-primary" aria-label="অপঠিত" />
            )}
          </div>
        </div>
      </div>
      {mouseIn && !isReadState && (
        <button
          type="button"
          className="m-4 hidden size-10 shrink-0 items-center justify-center rounded-lg text-primary transition hover:bg-primary/10 sm:flex"
          onClick={() => {
            readNotification(notification);
          }}
          aria-label="পড়া হয়েছে হিসেবে চিহ্নিত করো"
        >
          <CheckCircle2 className="size-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
