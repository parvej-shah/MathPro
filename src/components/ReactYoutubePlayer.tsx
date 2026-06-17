"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BsPlayFill,
  BsPauseFill,
  BsVolumeUpFill,
  BsVolumeMuteFill,
  BsArrowsFullscreen,
  BsGear,
  BsArrowClockwise,
} from "react-icons/bs";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const API_SRC = "https://www.youtube.com/iframe_api";

// Singleton loader for the YouTube IFrame API so multiple players share one script.
let apiPromise: Promise<void> | null = null;
function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.querySelector(`script[src="${API_SRC}"]`)) {
      const tag = document.createElement("script");
      tag.src = API_SRC;
      document.head.appendChild(tag);
    }
  });
  return apiPromise;
}

const extractVideoId = (videoUrl: string): string => {
  try {
    const url = new URL(videoUrl);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    if (url.pathname.startsWith("/embed/")) return url.pathname.split("/embed/")[1];
    return url.searchParams.get("v") || "";
  } catch {
    return "";
  }
};

const formatTime = (sec: number): string => {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const QUALITY_LABELS: Record<string, string> = {
  hd2160: "2160p",
  hd1440: "1440p",
  hd1080: "1080p",
  hd720: "720p",
  large: "480p",
  medium: "360p",
  small: "240p",
  tiny: "144p",
  auto: "অটো",
  default: "অটো",
};

const ReactYoutubePlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoId = extractVideoId(videoUrl);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [qualities, setQualities] = useState<string[]>([]);
  const [quality, setQuality] = useState("auto");
  const [controlsVisible, setControlsVisible] = useState(true);

  // Create / recreate the player whenever the video changes.
  useEffect(() => {
    let cancelled = false;
    if (!videoId) return;

    loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 0,
          fs: 0,
          playsinline: 1,
          autoplay: 1,
          mute: 1,
          origin: typeof window !== "undefined" ? window.location.origin : undefined,
        },
        events: {
          onReady: (e: any) => {
            if (cancelled) return;
            setReady(true);
            setDuration(e.target.getDuration());
            setVolume(e.target.getVolume());
            setMuted(e.target.isMuted());
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            const YT = window.YT;
            if (e.data === YT.PlayerState.PLAYING) {
              setPlaying(true);
              setEnded(false);
              setDuration(e.target.getDuration());
              const avail = e.target.getAvailableQualityLevels?.() || [];
              setQualities(avail);
              setQuality(e.target.getPlaybackQuality?.() || "auto");
            } else if (e.data === YT.PlayerState.PAUSED) {
              setPlaying(false);
            } else if (e.data === YT.PlayerState.ENDED) {
              setPlaying(false);
              setEnded(true);
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* noop */
      }
      playerRef.current = null;
      setReady(false);
      setPlaying(false);
      setEnded(false);
      setCurrent(0);
      setDuration(0);
    };
  }, [videoId]);

  // Drive the progress bar while playing.
  useEffect(() => {
    const tick = () => {
      const p = playerRef.current;
      if (p?.getCurrentTime) {
        setCurrent(p.getCurrentTime());
        if (!duration && p.getDuration) setDuration(p.getDuration());
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (playing) rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, duration]);

  // Show controls on activity, then hide them after a timeout (only while playing).
  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 4500);
    }
  }, [playing]);

  // While playing, arm the auto-hide timer. (When paused, controls are pinned
  // visible via `showControls` below — no state write needed here.)
  useEffect(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 4500);
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [playing]);

  // Controls/masks are always shown when paused; while playing they follow the
  // activity-driven `controlsVisible` flag (auto-hides after the timeout).
  const showControls = !playing || controlsVisible;

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (ended) {
      p.seekTo(0, true);
      p.playVideo();
      return;
    }
    if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing, ended]);

  const skipBy = useCallback((seconds: number) => {
    const p = playerRef.current;
    if (!p?.getCurrentTime) return;
    const t = Math.max(0, Math.min(p.getCurrentTime() + seconds, duration));
    setCurrent(t);
    p.seekTo(t, true);
  }, [duration]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const p = playerRef.current;
    if (!p) return;
    const t = Number(e.target.value);
    setCurrent(t);
    p.seekTo(t, true);
  }, []);

  const toggleMute = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  }, []);

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const p = playerRef.current;
    if (!p) return;
    const v = Number(e.target.value);
    p.setVolume(v);
    setVolume(v);
    if (v === 0) {
      p.mute();
      setMuted(true);
    } else if (p.isMuted()) {
      p.unMute();
      setMuted(false);
    }
  }, []);

  const pickQuality = useCallback((q: string) => {
    const p = playerRef.current;
    if (!p) return;
    p.setPlaybackQuality(q);
    setQuality(q);
    setShowSettings(false);
  }, []);

  const goFullscreen = useCallback(() => {
    const el = wrapperRef.current as any;
    if (!el) return;
    if (document.fullscreenElement) {
      (document.exitFullscreen || (document as any).webkitExitFullscreen)?.call(document);
    } else {
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    }
  }, []);

  if (!videoId) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ paddingTop: "56.25%" }}
      />
    );
  }

  return (
    <div
      ref={wrapperRef}
      onMouseMove={revealControls}
      onMouseLeave={revealControls}
      className="group relative aspect-video w-full overflow-hidden rounded-lg bg-black [&:fullscreen]:h-screen [&:fullscreen]:aspect-auto"
    >
      {/* The YT iframe is mounted into this node by the IFrame API. It fits the
          frame exactly — full width, no crop. The full video is visible while
          playing; YouTube's chrome only appears on hover/pause, and the mask bars
          below cover it exactly when it would show. */}
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Mask bars over YouTube's top title bar and bottom share/logo/"More videos"
          strip. YouTube's chrome is a fixed pixel height regardless of player size,
          so these use fixed heights (not %) to cover it exactly while hiding as
          little video as possible. Kept always-on with a gradient so there's no
          flicker from YouTube fading its chrome on a delay after play starts.
          z-10 guarantees they paint above the YT iframe layer. */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-10 h-13 bg-black transition-opacity duration-500 ease-in-out ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 h-13 bg-black transition-opacity duration-500 ease-in-out ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Full-surface shield: swallows every click on YouTube chrome (title, share,
          watch-on-YouTube, end-screen suggestion cards). Clicking toggles play. */}
      <button
        type="button"
        aria-label="play-pause"
        onClick={togglePlay}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer bg-transparent"
      />

      {/* Center play indicator when paused/not started. */}
      {ready && !playing && !ended && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white">
            <BsPlayFill className="ml-1 text-3xl" />
          </div>
        </div>
      )}

      {/* Replay overlay — covers YouTube's end-screen suggested videos. */}
      {ended && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-black/80 text-white"
        >
          <BsArrowClockwise className="text-4xl" />
          <span className="text-sm font-semibold">আবার দেখুন</span>
        </button>
      )}

      {/* Custom control bar — appears on hover (always visible when paused). */}
      <div
        className={`absolute inset-x-0 bottom-0 z-30 bg-linear-to-t from-black/80 to-transparent px-3 pb-2 pt-6 transition-opacity duration-500 ease-in-out ${
          showControls ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Seek bar */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step="any"
          value={current}
          onChange={handleSeek}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 accent-destructive"
        />

        <div className="mt-1 flex items-center gap-3 text-white">
          <button type="button" onClick={() => skipBy(-10)} aria-label="skip back 10s" className="flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              <text x="12" y="15.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="700" fontFamily="sans-serif">10</text>
            </svg>
          </button>

          <button type="button" onClick={togglePlay} aria-label="play-pause" className="flex items-center justify-center">
            {playing ? (
              <BsPauseFill className="text-2xl" />
            ) : (
              <BsPlayFill className="text-2xl" />
            )}
          </button>

          <button type="button" onClick={() => skipBy(10)} aria-label="skip forward 10s" className="flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
              <text x="12" y="15.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="700" fontFamily="sans-serif">10</text>
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleMute} aria-label="mute">
              {muted || volume === 0 ? (
                <BsVolumeMuteFill className="text-xl" />
              ) : (
                <BsVolumeUpFill className="text-xl" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-white/30 accent-white"
            />
          </div>

          <span className="flex-1 text-xs tabular-nums">
            {formatTime(current)} / {formatTime(duration)}
          </span>

          <div className="flex items-center gap-3">
            {/* Quality / settings */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettings((s) => !s)}
                aria-label="settings"
                className="flex items-center justify-center"
              >
                <BsGear className="text-lg" />
              </button>
              {showSettings && (
                <div className="absolute bottom-8 right-0 min-w-28 rounded-lg bg-black/90 p-1 text-sm shadow-lg">
                  <div className="px-2 py-1 text-xs text-white/60">কোয়ালিটি</div>
                  {(qualities.length ? qualities : ["auto"]).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => pickQuality(q)}
                      className={`block w-full rounded px-2 py-1 text-left hover:bg-white/15 ${
                        quality === q ? "text-destructive" : "text-white"
                      }`}
                    >
                      {QUALITY_LABELS[q] || q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button type="button" onClick={goFullscreen} aria-label="fullscreen" className="flex items-center justify-center">
              <BsArrowsFullscreen className="text-base" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactYoutubePlayer;
