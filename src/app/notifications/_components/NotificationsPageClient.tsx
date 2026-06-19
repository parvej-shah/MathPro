"use client";

import {
  Fragment,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Dialog, Transition } from "@headlessui/react";
import { Bell, CheckCheck, Loader2, X } from "lucide-react";
import { BACKEND_URL } from "@/api.config";
import { UserContext } from "@/Contexts/UserContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotificationItem from "@/components/NotificationItem";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";

const NOTIFICATION_UPDATED_EVENT = "notificationUpdated";

type CourseSummary = {
  id: string | number;
  title?: string;
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
    html?: string;
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

type NotificationsPageClientProps = {
  courseId?: string;
};

type UserState = {
  loading?: boolean;
  [key: string]: unknown;
};

const NOTIFICATIONS_PER_PAGE = 10;

const formatTimestamp = (timestamp: number) =>
  new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));

const getScheduledDate = (value?: number) => {
  if (typeof value !== "number") return "সময় পরে জানানো হবে";
  const ms = value < 1e12 ? value * 1000 : value;
  const date = new Date(ms);

  if (Number.isNaN(date.getTime())) return "সময় পরে জানানো হবে";

  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getNotificationDisplayTitle = (notification: NotificationRecord): string => {
  const raw = notification?.data?.title;
  const moduleData = notification?.data?.moduleData ?? {};
  const scheduledAt =
    moduleData?.scheduled_at ??
    moduleData?.scheduledAt ??
    moduleData?.startTime ??
    notification?.data?.scheduled_at ??
    notification?.data?.scheduledAt;
  const liveTitle = moduleData?.title ?? moduleData?.moduleTitle ?? "";
  const isBadTitle =
    raw == null ||
    (typeof raw === "string" &&
      (raw === "" || raw.includes("undefined") || raw.includes("Invalid Date")));

  if (notification.type === "LIVE" && isBadTitle) {
    return liveTitle
      ? `${liveTitle} লাইভ ক্লাস শুরু হবে ${getScheduledDate(scheduledAt)}`
      : `নতুন লাইভ ক্লাস শুরু হবে ${getScheduledDate(scheduledAt)}`;
  }

  return raw ?? "নোটিফিকেশন";
};

const getNotificationBody = (notification: NotificationRecord) => {
  if (notification.data?.html) return notification.data.html;
  if (notification.data?.body) return notification.data.body;
  if (notification.type === "LIVE") return "লাইভ ক্লাসে যোগ দিতে নোটিফিকেশনটি খুলে দেখো।";
  if (notification.type === "ASSIGNMENT") return "নতুন অ্যাসাইনমেন্ট দেওয়া হয়েছে। এখনই দেখে নাও।";

  return "এই নোটিফিকেশনের জন্য অতিরিক্ত বিস্তারিত নেই।";
};

const getUserIdFromToken = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]))?.id;
  } catch {
    return null;
  }
};

const uniqueById = (items: NotificationRecord[]) =>
  items.filter((notification, index, self) => {
    const id = notification.id ?? `${notification.timestamp}-${notification.type}`;
    return (
      index ===
      self.findIndex((candidate) => (candidate.id ?? `${candidate.timestamp}-${candidate.type}`) === id)
    );
  });

export default function NotificationsPageClient({ courseId }: NotificationsPageClientProps) {
  const [, setUser] = useContext(UserContext);
  const [token] = useState(() =>
    typeof window === "undefined" ? "" : localStorage.getItem("token") || "",
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [firstLoadComplete, setFirstLoadComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseSummary[]>([]);
  const [activeNotification, setActiveNotification] = useState<NotificationRecord | null>(null);

  const pageTitle = courseId ? "কোর্স নোটিফিকেশন" : "সাম্প্রতিক আপডেট";
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.is_read).length,
    [notifications],
  );

  const fetchEnrolledCourses = useCallback(async (): Promise<CourseSummary[]> => {
    if (!token || courseId) return [];

    const userId = getUserIdFromToken(token);
    if (!userId) return [];

    try {
      const response = await axios.get(`${BACKEND_URL}/user/bundle/all-courses/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const courses = (response.data.data || [])
        .filter((course: CourseSummary) => course.id)
        .map((course: CourseSummary) => ({
          id: course.id,
          title: course.title,
        }));

      setEnrolledCourses(courses);
      return courses;
    } catch (error) {
      console.warn("Error fetching enrolled courses:", error);
      return [];
    }
  }, [courseId, token]);

  const fetchNotificationsForCourses = useCallback(
    async (page: number, courses: CourseSummary[]) => {
      if (!token) return [];

      const targetCourses: CourseSummary[] = courseId ? [{ id: courseId }] : courses;
      if (targetCourses.length === 0) return [];

      const responses = await Promise.all(
        targetCourses.map((course) =>
          axios
            .get(
              `${BACKEND_URL}/user/notification/list?offset=${
                page * NOTIFICATIONS_PER_PAGE
              }&limit=${NOTIFICATIONS_PER_PAGE}&courseId=${course.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            )
            .catch(() => ({ data: { data: [] } })),
        ),
      );

      const allNotifications = responses.flatMap((response, index) => {
        const courseName = targetCourses[index]?.title;
        return (response.data.data || []).map((notification: NotificationRecord) => ({
          ...notification,
          courseName,
        }));
      });

      return uniqueById(allNotifications).sort((a, b) => b.timestamp - a.timestamp);
    },
    [courseId, token],
  );

  const fetchInitialNotifications = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setUser((currentUser) => ({ ...currentUser, loading: true }));

    try {
      const courses = courseId ? [] : await fetchEnrolledCourses();
      const nextNotifications = await fetchNotificationsForCourses(0, courses);

      setNotifications(nextNotifications.slice(0, NOTIFICATIONS_PER_PAGE));
      setHasMoreNotifications(nextNotifications.length >= NOTIFICATIONS_PER_PAGE);
      setCurrentPage(0);
      setFirstLoadComplete(true);
    } catch (error) {
      console.warn("Error fetching notifications:", error);
      setNotifications([]);
      setHasMoreNotifications(false);
    } finally {
      setLoading(false);
      setUser((currentUser) => ({ ...currentUser, loading: false }));
    }
  }, [
    courseId,
    fetchEnrolledCourses,
    fetchNotificationsForCourses,
    setUser,
    token,
  ]);

  const fetchMoreNotifications = useCallback(async () => {
    if (!token || !firstLoadComplete || !hasMoreNotifications) return;

    const nextPage = currentPage + 1;
    const nextNotifications = await fetchNotificationsForCourses(nextPage, enrolledCourses);
    const mergedNotifications = uniqueById([...notifications, ...nextNotifications]).sort(
      (a, b) => b.timestamp - a.timestamp,
    );

    setNotifications(mergedNotifications);
    setCurrentPage(nextPage);

    if (nextNotifications.length < NOTIFICATIONS_PER_PAGE) {
      setHasMoreNotifications(false);
    }
  }, [
    currentPage,
    enrolledCourses,
    fetchNotificationsForCourses,
    firstLoadComplete,
    hasMoreNotifications,
    notifications,
    token,
  ]);

  const markAllAsRead = async () => {
    if (!token) return;

    const coursesToMark = courseId ? [{ id: courseId }] : enrolledCourses;
    if (coursesToMark.length === 0) return;

    await Promise.all(
      coursesToMark.map((course) =>
        axios
          .post(
            `${BACKEND_URL}/user/notification/markAllAsRead?courseId=${course.id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .catch(() => null),
      ),
    );

    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({ ...notification, is_read: true })),
    );
    window.dispatchEvent(new Event(NOTIFICATION_UPDATED_EVENT));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchInitialNotifications();
    });
  }, [fetchInitialNotifications]);

  return (
    <ProtectedRoute>
      <main className="relative min-h-screen overflow-hidden bg-background pt-20 text-foreground">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute right-0 top-36 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
          <div className="absolute bottom-24 left-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </div>

        <section className="relative">
          <div className="mx-auto w-[90%] max-w-5xl py-10 md:py-14">
            <div className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-xl backdrop-blur-md">
              <div className="flex flex-col gap-6 border-b border-border/70 bg-section-a p-4 md:flex-row md:items-center md:justify-between md:p-7">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Bell className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary">MathPro Announcements</p>
                    <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground sm:max-w-none sm:text-3xl md:text-[2.6rem]">
                      {pageTitle}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="bg-section-b p-5 md:p-7">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/15 disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground"
                  >
                    <CheckCheck className="size-4" aria-hidden="true" />
                    সব পড়া হয়েছে
                  </button>
                </div>

                {loading ? (
                  <div className="flex min-h-64 items-center justify-center rounded-2xl border border-border bg-card/75 backdrop-blur-md">
                    <Loader2 className="size-8 animate-spin text-primary" aria-label="লোড হচ্ছে" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-card/75 p-10 text-center backdrop-blur-md">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Bell className="size-7" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">এখনো কোনো নোটিফিকেশন নেই</h3>
                    <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                      লাইভ ক্লাস, অ্যাসাইনমেন্ট বা কোর্স আপডেট এলে এখানে দেখা যাবে।
                    </p>
                  </div>
                ) : (
                  <InfiniteScroll
                    dataLength={notifications.length}
                    next={fetchMoreNotifications}
                    hasMore={hasMoreNotifications}
                    loader={
                      <div className="flex justify-center py-8">
                        <Loader2 className="size-6 animate-spin text-primary" aria-label="আরও লোড হচ্ছে" />
                      </div>
                    }
                  >
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <NotificationItem
                          key={notification.id ?? `${notification.timestamp}-${notification.type}`}
                          populateFn={setActiveNotification}
                          notification={notification}
                        />
                      ))}
                    </div>
                  </InfiniteScroll>
                )}
              </div>
            </div>
          </div>
        </section>

        <Transition appear show={activeNotification !== null} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setActiveNotification(null)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto p-4">
              <div className="flex min-h-full items-center justify-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card/95 text-left shadow-2xl backdrop-blur-md transition-all">
                    <div className="flex items-center justify-between border-b border-border p-5">
                      <Dialog.Title className="pr-4 text-xl font-bold leading-snug text-foreground">
                        {activeNotification ? getNotificationDisplayTitle(activeNotification) : ""}
                      </Dialog.Title>
                      <button
                        type="button"
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        onClick={() => setActiveNotification(null)}
                        aria-label="বন্ধ করো"
                      >
                        <X className="size-5" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="p-5">
                      <p className="mb-4 text-sm font-medium text-muted-foreground">
                        {activeNotification ? formatTimestamp(activeNotification.timestamp * 1000) : ""}
                      </p>
                      <SafeHtmlRenderer
                        content={activeNotification ? getNotificationBody(activeNotification) : ""}
                        className="prose prose-sm max-w-none text-foreground dark:prose-invert"
                      />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </main>
    </ProtectedRoute>
  );
}
