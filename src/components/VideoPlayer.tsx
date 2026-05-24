import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, className = "" }) => {
  // Check if the URL is a YouTube embed URL
  const isYouTubeUrl = videoUrl.includes('youtube.com/embed') || videoUrl.includes('youtu.be');
  
  // Check if the URL is a BunnyCDN URL
  const isBunnyUrl = videoUrl.includes('iframe.mediadelivery.net');

  if (!videoUrl) {
    return null;
  }

  if (isYouTubeUrl) {
    return (
      <iframe
        className={`rounded-xl w-full min-h-[260px] md:min-h-[400px] lg:min-h-[500px] ${className}`}
        src={videoUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (isBunnyUrl) {
    return (
      <iframe
        className={`rounded-xl w-full min-h-[260px] md:min-h-[400px] lg:min-h-[500px] ${className}`}
        src={videoUrl}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return null;
};

export default VideoPlayer; 