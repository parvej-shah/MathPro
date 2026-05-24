import React from "react";

const toEmbedUrl = (videoUrl: string) => {
  try {
    const url = new URL(videoUrl);
    const videoId =
      url.searchParams.get("v") ||
      (url.hostname.includes("youtu.be") ? url.pathname.slice(1) : "");

    if (!videoId) return videoUrl;
    return `https://www.youtube.com/embed/${videoId}?rel=0`;
  } catch {
    return videoUrl;
  }
};

const ReactYoutubePlayer = ({ videoUrl }: { videoUrl: string }) => {
  const src = toEmbedUrl(videoUrl);

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ paddingTop: "56.25%" }}>
      <iframe
        src={src}
        title="YouTube video player"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};

export default ReactYoutubePlayer;
