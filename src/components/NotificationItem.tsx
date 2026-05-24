"use client";

import { BACKEND_URL } from "@/api.config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  populateFn: (notification: any) => void,
  notification: any
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

  return `${day
    .toString()
    .padStart(2, "")
    } ${month} ${year},  ${hours
      .toString()
      .padStart(2, "0")
    }:${minutes
      .toString()
      .padStart(2, "0")
    }${ampm}`;
};

/** Format a Unix timestamp (seconds or ms) for display; returns "Time TBA" if invalid. */
const formatScheduledDate = (value: number | undefined | null): string => {
  if (value == null || typeof value !== "number") return "Time TBA";
  const ms = value < 1e12 ? value * 1000 : value;
  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) return "Time TBA";
  const day = date.getDate();
  const year = date.getFullYear();
  const month = MONTH_NAMES[date.getMonth()];
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${month} ${day}, ${year} at ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}${ampm}`;
};

/** Get display title for notification; fixes "undefined" / "Invalid Date" for LIVE (e.g. cp2.0). */
const getNotificationDisplayTitle = (notification: any): string => {
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

export default function NotificationItem({ populateFn: populate, notification }: Props) {
  const router = useRouter();
  const [isReadState, setIsReadState] = useState(notification.is_read);
  const [mouseIn, setMouseIn] = useState(false);
  const readNotification = (notification: any): void => {
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
        setIsReadState(true);  // on success update state without loading whole page
      });
  };

  useEffect(() => {
    setIsReadState(notification.is_read)
  }, [notification]);

  return (
    <div
      className={`flex items-start justify-between ${notification.type !== "COURSE_UPDATE" && "hover:opacity-70"} ${notification.type != "COURSE_UPDATE" && "cursor-pointer"} ${isReadState ? "bg-muted/40" : "bg-muted"} ease-in-out duration-150 backdrop-blur-lg rounded-lg my-4`}
      onMouseEnter={() => {
        setMouseIn(true);
      }}
      onMouseLeave={() => {
        setMouseIn(false);
      }}
    >
      <div
        className={`flex items-center gap-8 p-8`}
      >
        <svg
          width="20"
          height="23"
          viewBox="0 0 20 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.4673 19.5024C13.2242 21.1987 11.7652 22.5025 10.0016 22.5025C8.23812 22.5025 6.77911 21.1987 6.536 19.5024H13.4673ZM10.0016 0.5C14.6114 0.5 18.3642 4.16899 18.4991 8.74605V9.00124H18.5029L18.5026 13.113L19.9167 16.7573C19.9548 16.8557 19.9806 16.9583 19.9936 17.0627L20.0033 17.2203C20.0033 17.883 19.4996 18.4281 18.8542 18.4937L18.7233 18.5003H1.27644C1.11773 18.5003 0.960407 18.4708 0.812492 18.4133C0.194816 18.173 -0.130655 17.506 0.0422008 16.8807L0.0834777 16.7563L1.49965 13.112L1.50041 9.00124C1.50041 4.30614 5.30654 0.5 10.0016 0.5Z"
            fill={isReadState ? "#B1ACA9" : "#EE6800"}
          />
        </svg>

        <div
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
            <span className="inline-block px-2 py-0.5 mb-2 text-xs font-semibold text-purple bg-purple/10 rounded-full border border-purple/20">
              {notification.courseName}
            </span>
          )}
          <p className="text-heading dark:text-darkHeading text-xl">
            {getNotificationDisplayTitle(notification)}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-paragraph dark:text-darkParagraph">
              {formatTimestamp(notification.timestamp * 1000)}
            </p>
          </div>
        </div>
      </div>
      {mouseIn && !isReadState && (
        <button
          className="hover:opacity-70 m-8"
          onClick={() => {
            readNotification(notification);
          }}
        >
          <svg className="w-6 h-6 text-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z" clip-rule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}
