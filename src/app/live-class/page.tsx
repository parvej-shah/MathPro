"use client";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { Toaster } from "react-hot-toast";
import { convertUnixTimestamp } from "@/helpers";
import axios from "axios";
import { UserContext } from "@/Contexts/UserContext";
import { BACKEND_URL, COURSE_ID } from "@/api.config";
import VideoPlayer from "@/components/ReactYoutubePlayer";

type LiveClassItem = {
  id: number;
  title?: string;
  description?: string;
  thumbnail?: string;
  instructor_name?: string;
  scheduled_at: number;
  duration?: string;
  interested?: boolean;
  data?: {
    recordedMeetingLink?: string;
  };
};

type EnrolledCourse = {
  id: number;
  title?: string;
};

type ZoomConfig = {
  leaveUrl: string;
  signature: string;
  sdkKey: string;
  meetingNumber: string;
  passWord: string;
  userName: string;
  userEmail: string;
  registrantToken?: string;
  zakToken?: string;
};

const getDurationInMinutes = (duration: string | number | undefined | null) => {
  if (!duration) return 60;
  if (typeof duration === "number") return duration;
  const match = String(duration).match(/(\d+(?:\.\d+)?)\s*Hour/i);
  if (match?.[1]) return parseFloat(match[1]) * 60;
  return parseInt(duration, 10) || 60;
};

const urlRegex = /(https?:\/\/[^\s<]+)/g;
const linkifyText = (text: string) =>
  text.replace(
    urlRegex,
    (url) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary underline break-all hover:opacity-80">${url}</a>`,
  );

const renderRichDescription = (content: string) =>
  content
    .split(/(<[^>]+>)/g)
    .map((part) => (part.startsWith("<") ? part : linkifyText(part)))
    .join("");

export default function LiveClass() {
  const [user, setUser] = useContext(UserContext);
  const [liveClasses, setLiveClasses] = useState<{ list?: LiveClassItem[]; serverTimeStamp?: number }>({});
  const [isMeeting, setMeeting] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(COURSE_ID);
  const [activeClassId, setActiveClassId] = useState<number | null>(null);

  const fetchEnrolledCourses = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(BACKEND_URL + "/user/course/getEnrolledCoursesByUserId", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const courses = (res?.data?.data || []).filter((course: EnrolledCourse) => course?.id);
        setEnrolledCourses(courses);
        if (courses.length > 0) {
          setSelectedCourseId(courses[0].id.toString());
        }
      })
      .catch(() => setEnrolledCourses([]));
  };

  const fetchClasses = (courseId: string) => {
    if (!courseId) return;
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + "/user/live/list/" + courseId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data || {};
        const sortedList = [...(data?.list || [])].sort((a: LiveClassItem, b: LiveClassItem) => {
          const timeDiff = (b.scheduled_at || 0) - (a.scheduled_at || 0);
          if (timeDiff !== 0) return timeDiff;
          return (b.id || 0) - (a.id || 0);
        });
        setLiveClasses({ ...data, list: sortedList });
        setUser({ ...user, loading: false });
      })
      .catch(() => setUser({ ...user, loading: false }));
  };

  const submitInterested = (id: number) => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");

    axios
      .post(BACKEND_URL + `/user/live/interest/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchClasses(selectedCourseId);
        setUser({ ...user, loading: false });
      })
      .catch(() => setUser({ ...user, loading: false }));
  };

  const initiateMeeting = async (config: ZoomConfig) => {
    const ZoomMtg = (await import("@zoomus/websdk")).ZoomMtg;

    ZoomMtg.setZoomJSLib("https://source.zoom.us/2.16.0/lib", "/av");
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();
    ZoomMtg.i18n.load("en-US");
    ZoomMtg.i18n.reload("en-US");

    const zmmtgRoot = window.document.getElementById("zmmtg-root");
    if (zmmtgRoot) zmmtgRoot.style.display = "block";

    ZoomMtg.init({
      leaveUrl: config.leaveUrl,
      success: () => {
        setUser({ ...user, loading: false });
        setMeeting(true);
        ZoomMtg.join({
          signature: config.signature,
          sdkKey: config.sdkKey,
          meetingNumber: config.meetingNumber,
          passWord: config.passWord,
          userName: config.userName,
          userEmail: config.userEmail,
          tk: config.registrantToken,
          zak: config.zakToken,
          success: () => setUser({ ...user, loading: false }),
          error: () => setUser({ ...user, loading: false }),
        });
      },
      error: () => setUser({ ...user, loading: false }),
    });
  };

  const fetchMeetingProps = (liveId: number) => {
    setUser({ ...user, loading: true });
    const token = localStorage.getItem("token");

    axios
      .get(BACKEND_URL + "/user/meeting/getMeetingProps/" + liveId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => initiateMeeting(res.data.data))
      .catch(() => setUser({ ...user, loading: false }));
  };

  useEffect(() => { fetchEnrolledCourses(); }, []);
  useEffect(() => { fetchClasses(selectedCourseId); }, [selectedCourseId]);

  const selectedCourseTitle = useMemo(() => {
    const found = enrolledCourses.find((course) => course.id.toString() === selectedCourseId);
    return found?.title || "Selected Course";
  }, [enrolledCourses, selectedCourseId]);

  const classesWithStatus = useMemo(() => {
    const now = liveClasses?.serverTimeStamp || 0;
    return (liveClasses?.list || []).map((liveClass) => {
      const durationInSeconds = getDurationInMinutes(liveClass.duration) * 60;
      const isLive = liveClass.scheduled_at <= now && liveClass.scheduled_at + durationInSeconds > now;
      const isPast = liveClass.scheduled_at + durationInSeconds <= now;
      return { ...liveClass, isLive, isPast, isUpcoming: !isLive && !isPast };
    });
  }, [liveClasses?.list, liveClasses?.serverTimeStamp]);

  useEffect(() => {
    if (classesWithStatus.length && !activeClassId) {
      setActiveClassId(classesWithStatus[0].id);
    }
  }, [classesWithStatus, activeClassId]);

  const activeClass = useMemo(
    () => classesWithStatus.find((liveClass) => liveClass.id === activeClassId) || classesWithStatus[0],
    [classesWithStatus, activeClassId],
  );

  if (isMeeting) return <div id="zmmtg-root" />;

  return (
    <div className="overflow-x-hidden bg-background text-foreground">
      <Toaster />

      {/* Decorative ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-72 w-72 rounded-full bg-teal/10 blur-3xl" />
      </div>

      <div className="pt-20 min-h-screen bg-background">
        <div className="w-[92%] lg:w-[82%] mx-auto py-12 min-h-[80vh]">

          {/* Header + course switcher */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-foreground text-3xl md:text-4xl font-bold leading-tight mb-1">
                লাইভ ক্লাস
              </h1>
              <p className="text-muted-foreground text-sm">
                দেখছ: {selectedCourseTitle}
              </p>
            </div>

            <div className="w-full md:w-90">
              <label className="mb-2 block text-sm font-medium text-foreground">
                কোর্স বদলাও
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
              >
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course) => (
                    <option key={course.id} value={course.id.toString()}>
                      {course.title || `Course ${course.id}`}
                    </option>
                  ))
                ) : (
                  <option value={COURSE_ID}>Default Course</option>
                )}
              </select>
            </div>
          </div>

          {classesWithStatus.length > 0 ? (
            <div className="grid items-start gap-6 lg:grid-cols-12">

              {/* Main detail panel */}
              <div className="lg:col-span-8 rounded-2xl border border-border bg-card/80 backdrop-blur-md p-5 md:p-6 shadow-xl">
                {activeClass?.isPast && activeClass?.data?.recordedMeetingLink && (
                  <div className="mb-5 rounded-xl overflow-hidden border border-border aspect-video">
                    <VideoPlayer videoUrl={activeClass.data.recordedMeetingLink} />
                  </div>
                )}

                <div className="mb-4 flex items-center gap-2">
                  {activeClass?.isLive ? (
                    <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-success/15 text-success border border-success/40">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      লাইভ চলছে
                    </span>
                  ) : activeClass?.isPast ? (
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-muted text-muted-foreground border border-border">
                      শেষ হয়েছে
                    </span>
                  ) : (
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-primary/15 text-primary border border-primary/40">
                      আসছে
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {convertUnixTimestamp((activeClass?.scheduled_at || 0) * 1000)} • {activeClass?.duration || "১ ঘণ্টা"}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-semibold text-foreground leading-snug">
                  {activeClass?.title || "শিরোনাম নেই"}
                </h2>

                <div
                  className="mt-3 text-muted-foreground leading-7 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_a]:text-primary [&_a]:underline [&_a:hover]:opacity-80 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
                  dangerouslySetInnerHTML={{
                    __html: renderRichDescription(activeClass?.description || "বিবরণ পাওয়া যায়নি"),
                  }}
                />

                <p className="mt-3 text-sm text-muted-foreground">
                  শিক্ষক: {activeClass?.instructor_name || "শিক্ষক"}
                </p>

                <div className="mt-6">
                  {activeClass?.isLive ? (
                    <button
                      onClick={() => fetchMeetingProps(activeClass.id)}
                      className="w-full md:w-auto rounded-xl bg-success px-6 py-3 font-semibold text-success-foreground hover:opacity-90 transition-opacity shadow-lg"
                    >
                      ক্লাসে যোগ দাও
                    </button>
                  ) : activeClass?.isUpcoming ? (
                    <button
                      onClick={() => submitInterested(activeClass.id)}
                      disabled={activeClass.interested}
                      className={`w-full md:w-auto rounded-xl px-6 py-3 font-semibold transition-opacity ${
                        activeClass.interested
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:opacity-90 shadow-lg"
                      }`}
                    >
                      {activeClass.interested ? "আগ্রহ জানিয়েছ" : "আগ্রহী"}
                    </button>
                  ) : (
                    <button
                      disabled={!activeClass?.data?.recordedMeetingLink}
                      className={`w-full md:w-auto rounded-xl px-6 py-3 font-semibold transition-opacity ${
                        activeClass?.data?.recordedMeetingLink
                          ? "bg-foreground text-background hover:opacity-90 shadow-lg"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                    >
                      {activeClass?.data?.recordedMeetingLink ? "রেকর্ডিং উপরে দেখো" : "রেকর্ডিং নেই"}
                    </button>
                  )}
                </div>
              </div>

              {/* Playlist sidebar */}
              <aside className="lg:col-span-4 rounded-2xl border border-border bg-card/80 backdrop-blur-md p-4 md:p-5 shadow-xl lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-hidden">
                <h3 className="text-xl font-semibold text-foreground">ক্লাস প্লেলিস্ট</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  একটি সেশন বেছে নাও — সময়মতো যোগ দাও বা রেকর্ডিং দেখো।
                </p>

                <div className="overflow-y-auto space-y-3 pr-1 lg:max-h-[calc(100vh-16rem)]">
                  {classesWithStatus.map((liveClass) => (
                    <button
                      key={liveClass.id}
                      onClick={() => setActiveClassId(liveClass.id)}
                      className={`w-full rounded-xl border p-3 text-left transition-all ${
                        activeClass?.id === liveClass.id
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-muted/40"
                      }`}
                    >
                      <div className="mb-2 overflow-hidden rounded-lg aspect-video">
                        <img
                          src={liveClass.thumbnail || "/Group 33514.png"}
                          alt={liveClass.title || "Live class"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        {liveClass.isLive ? (
                          <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-success/15 text-success border border-success/40">
                            <span className="h-1 w-1 rounded-full bg-success animate-pulse" />
                            লাইভ
                          </span>
                        ) : liveClass.isPast ? (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-muted text-muted-foreground border border-border">
                            শেষ
                          </span>
                        ) : (
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary border border-primary/40">
                            আসছে
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {liveClass.duration || "১ ঘণ্টা"}
                        </span>
                      </div>
                      <p className="line-clamp-2 font-semibold text-foreground text-sm">
                        {liveClass.title || "শিরোনাম নেই"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {convertUnixTimestamp(liveClass.scheduled_at * 1000)}
                      </p>
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-md py-20 text-center shadow-xl">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">এখনও কোনো লাইভ ক্লাস নেই</p>
              <p className="text-muted-foreground text-sm">এই কোর্সের জন্য শীঘ্রই লাইভ ক্লাস আসছে।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
