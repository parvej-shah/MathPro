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
  const unmuteOnFirstPlay = useRef(true);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [hasPlayedOnce, setHasPlayedOnce] = useState(false);
  const [posterVisible, setPosterVisible] = useState(true);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"main" | "quality" | "speed">("main");
  const [qualities, setQualities] = useState<string[]>([]);
  const [quality, setQuality] = useState("auto");
  const [speed, setSpeed] = useState(1);
  const [availableSpeeds, setAvailableSpeeds] = useState<number[]>([0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]);
  const [controlsVisible, setControlsVisible] = useState(true);

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
            setVolume(e.target.getVolume() || 100);
            setMuted(true);
            const rates = e.target.getAvailablePlaybackRates?.() || [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
            setAvailableSpeeds(rates);
            e.target.playVideo();
          },
          onStateChange: (e: any) => {
            const YT = window.YT;
            if (e.data === YT.PlayerState.PLAYING) {
              setPlaying(true);
              setEnded(false);
              setHasPlayedOnce(true);
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
      unmuteOnFirstPlay.current = true;
      setReady(false);
      setPlaying(false);
      setEnded(false);
      setHasPlayedOnce(false);
      setPosterVisible(true);
      setCurrent(0);
      setDuration(0);
      setMuted(true);
    };
  }, [videoId]);

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

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 4500);
    }
  }, [playing]);

  useEffect(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (playing) {
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 4500);
    }
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [playing]);

  const showControls = !playing || controlsVisible;

  const dismissPoster = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    setPosterVisible(false);
    if (unmuteOnFirstPlay.current) {
      unmuteOnFirstPlay.current = false;
      p.unMute();
      p.setVolume(100);
      setMuted(false);
      setVolume(100);
    }
    p.playVideo();
  }, []);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (posterVisible) {
      dismissPoster();
      return;
    }
    if (ended) {
      p.seekTo(0, true);
      p.playVideo();
      return;
    }
    if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing, ended, posterVisible, dismissPoster]);

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
    setSettingsTab("main");
  }, []);

  const pickSpeed = useCallback((rate: number) => {
    const p = playerRef.current;
    if (!p) return;
    p.setPlaybackRate(rate);
    setSpeed(rate);
    setSettingsTab("main");
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

  const thumbUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

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
      onTouchStart={revealControls}
      className="group relative aspect-video w-full overflow-hidden rounded-lg bg-black [&:fullscreen]:h-screen [&:fullscreen]:aspect-auto"
    >
      {/* YT iframe — pointer-events off so our shield catches everything */}
      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />

      {/* Poster overlay — opaque thumbnail covering the iframe until user taps play.
          Hides YouTube's native red play button, title bar, and all chrome on every
          device including mobile where autoplay may silently fail. */}
      {posterVisible && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="ভিডিও চালাও"
          className="absolute inset-0 z-40 flex cursor-pointer items-center justify-center bg-black"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="relative flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-transform hover:scale-110 active:scale-95">
            <BsPlayFill className="ml-1 text-3xl sm:text-5xl" />
          </div>
        </button>
      )}

      {/* Mask bars — cover YouTube's top title bar and bottom share/logo strip.
          Always rendered (not just on hover) so YouTube chrome never peeks through. */}
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

      {/* Full-surface shield — swallows clicks on YouTube chrome */}
      <button
        type="button"
        aria-label="play-pause"
        onClick={togglePlay}
        className="absolute inset-0 z-20 h-full w-full cursor-pointer bg-transparent"
      />

      {/* Center play indicator — only after user has played at least once then paused */}
      {ready && !posterVisible && hasPlayedOnce && !playing && !ended && (
        <div className="pointer-events-none absolute inset-0 z-25 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/60 text-white">
            <BsPlayFill className="ml-1 text-3xl" />
          </div>
        </div>
      )}

      {/* Replay overlay */}
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

      {/* Custom control bar */}
      {!posterVisible && (
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

          <div className="mt-1 flex items-center gap-2 sm:gap-3 text-white">
            <button type="button" onClick={() => skipBy(-10)} aria-label="skip back 10s" className="flex shrink-0 items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[22px] sm:h-[22px]">
                <path d="M1 4v6h6" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                <text x="12" y="15.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="700" fontFamily="sans-serif">10</text>
              </svg>
            </button>

            <button type="button" onClick={togglePlay} aria-label="play-pause" className="flex shrink-0 items-center justify-center">
              {playing ? (
                <BsPauseFill className="text-xl sm:text-2xl" />
              ) : (
                <BsPlayFill className="text-xl sm:text-2xl" />
              )}
            </button>

            <button type="button" onClick={() => skipBy(10)} aria-label="skip forward 10s" className="flex shrink-0 items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[22px] sm:h-[22px]">
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
                <text x="12" y="15.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="8" fontWeight="700" fontFamily="sans-serif">10</text>
              </svg>
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
              <button type="button" onClick={toggleMute} aria-label="mute" className="shrink-0">
                {muted || volume === 0 ? (
                  <BsVolumeMuteFill className="text-lg sm:text-xl" />
                ) : (
                  <BsVolumeUpFill className="text-lg sm:text-xl" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="h-1 w-12 sm:w-16 cursor-pointer appearance-none rounded-full bg-white/30 accent-white"
              />
            </div>

            <span className="flex-1 text-[10px] sm:text-xs tabular-nums text-right sm:text-left">
              {formatTime(current)} / {formatTime(duration)}
            </span>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setShowSettings((s) => !s); setSettingsTab("main"); }}
                  aria-label="settings"
                  className="flex items-center justify-center"
                >
                  <BsGear className="text-base sm:text-lg" />
                </button>
                {showSettings && (
                  <div className="absolute bottom-8 right-0 min-w-36 max-h-[40vw] sm:max-h-72 overflow-y-auto overscroll-contain rounded-lg bg-black/90 p-1 text-sm shadow-lg">
                    {settingsTab === "main" && (
                      <>
                        <button
                          type="button"
                          onClick={() => setSettingsTab("speed")}
                          className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-white hover:bg-white/15"
                        >
                          <span>গতি</span>
                          <span className="text-xs text-white/60">{speed === 1 ? "স্বাভাবিক" : `${speed}x`}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSettingsTab("quality")}
                          className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-white hover:bg-white/15"
                        >
                          <span>কোয়ালিটি</span>
                          <span className="text-xs text-white/60">{QUALITY_LABELS[quality] || quality}</span>
                        </button>
                      </>
                    )}
                    {settingsTab === "quality" && (
                      <>
                        <button type="button" onClick={() => setSettingsTab("main")} className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-xs text-white/60 hover:bg-white/15">
                          ← কোয়ালিটি
                        </button>
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
                      </>
                    )}
                    {settingsTab === "speed" && (
                      <>
                        <button type="button" onClick={() => setSettingsTab("main")} className="flex w-full items-center gap-1 rounded px-2 py-1 text-left text-xs text-white/60 hover:bg-white/15">
                          ← গতি
                        </button>
                        {availableSpeeds.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => pickSpeed(r)}
                            className={`block w-full rounded px-2 py-1 text-left hover:bg-white/15 ${
                              speed === r ? "text-destructive" : "text-white"
                            }`}
                          >
                            {r === 1 ? "স্বাভাবিক" : `${r}x`}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              <button type="button" onClick={goFullscreen} aria-label="fullscreen" className="flex shrink-0 items-center justify-center">
                <BsArrowsFullscreen className="text-sm sm:text-base" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactYoutubePlayer;
