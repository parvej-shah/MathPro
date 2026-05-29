import { useState } from "react";
import FreeVideoModal from "./FreeVideoModal";
import { useFreeContentAccess } from "../hooks/useFreeContentAccess";

interface VideoItemProps {
  module: any;
  isFreeChapter: boolean;
  isExpanded?: boolean;
  onToggle?: (moduleId: number, shouldExpand: boolean) => void;
  courseId: string;
}

export default function VideoItem({
  module,
  isFreeChapter,
  isExpanded: externalIsExpanded,
  onToggle,
  courseId,
}: VideoItemProps) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(false);

  // Use the shared access hook
  const {
    hasAccess,
    showModal,
    setShowModal,
    handleFormSubmit,
    isLoggedInUser,
  } = useFreeContentAccess(courseId);

  // Use external control if provided, otherwise use internal state
  const isExpanded =
    externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;

  // Backend may put is_free on module root when stripping data for unauthenticated users
  const isFreeVideo =
    module.data?.is_free === true ||
    (module as any).is_free === true ||
    isFreeChapter;
  const videoUrl =
    module.data?.videoUrl || module.data?.video_link || module.data?.videoLink;

  const handleVideoClick = () => {
    if (!isFreeVideo) return;

    if (hasAccess || isLoggedInUser) {
      // User already has access (or is logged in), toggle video
      const newExpandedState = !isExpanded;

      if (onToggle) {
        onToggle(module.id, newExpandedState);
      } else {
        setInternalIsExpanded(newExpandedState);
      }
    } else {
      // Show email modal
      setShowModal(true);
    }
  };

  const onFormSubmit = (data: {
    name: string;
    phone: string;
    email: string;
    apiSubmitted: boolean;
  }) => {
    handleFormSubmit(data);

    // Auto-expand video with a slight delay for smooth transition
    setTimeout(() => {
      if (onToggle) {
        onToggle(module.id, true);
      } else {
        setInternalIsExpanded(true);
      }
    }, 200);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return "";

    // Extract video ID from various YouTube URL formats
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (videoId) {
      // Return embed URL without timestamp to prevent re-rendering
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }

    return url;
  };

  return (
    <>
      <div
        className={`mb-4 rounded-lg overflow-hidden transition-all duration-300 ${
          isFreeVideo
            ? "hover:bg-gray-700/30 dark:hover:bg-gray-800/30 cursor-pointer"
            : ""
        }`}
      >
        {/* Video Title Row */}
        <div
          className={`flex gap-4 items-center p-3 ${
            isFreeVideo ? "cursor-pointer" : ""
          }`}
          onClick={handleVideoClick}
        >
          {/* Play Icon */}
          <svg
            width="20"
            height="21"
            viewBox="0 0 20 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path
              d="M10 20.5C15.523 20.5 20 16.023 20 10.5C20 4.977 15.523 0.5 10 0.5C4.477 0.5 0 4.977 0 10.5C0 16.023 4.477 20.5 10 20.5Z"
              fill={isFreeVideo ? "oklch(0.718 0.147 159.2)" : "currentColor"}
            />
            <path
              d="M14.2164 11.3862C14.7194 10.9382 14.7194 10.0622 14.2164 9.61419C12.7337 8.28108 11.0347 7.21042 9.19235 6.44819L8.86235 6.31319C8.22935 6.05319 7.56235 6.54719 7.47635 7.30019C7.23705 9.42681 7.23705 11.5736 7.47635 13.7002C7.56135 14.4532 8.22935 14.9462 8.86235 14.6872L9.19235 14.5522C11.0347 13.7899 12.7337 12.7193 14.2164 11.3862Z"
              fill="white"
            />
          </svg>

          {/* Title */}
          <p className="text-foreground/80 text-base flex-1">
            {module.title}
          </p>

          {/* Badge or Lock */}
          {isFreeVideo ? (
            <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full border border-primary/30 flex-shrink-0">
              FREE PREVIEW
            </span>
          ) : (
            <svg
              width="16"
              height="18"
              viewBox="0 0 18 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M9 13.5V15.5M3 19.5H15C16.1046 19.5 17 18.6046 17 17.5V11.5C17 10.3954 16.1046 9.5 15 9.5H3C1.89543 9.5 1 10.3954 1 11.5V17.5C1 18.6046 1.89543 19.5 3 19.5ZM13 9.5V5.5C13 3.29086 11.2091 1.5 9 1.5C6.79086 1.5 5 3.29086 5 5.5V9.5H13Z"
                stroke="#565656"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        {/* Expanded Video Player */}
        {isExpanded && isFreeVideo && videoUrl && (
          <div
            className="px-4 pb-4 transition-all duration-300 ease-in-out"
            style={{
              animation: "slideDown 0.3s ease-in-out",
            }}
          >
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                key={`video-${module.id}`}
                src={getYouTubeEmbedUrl(videoUrl)}
                title={module.title}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>

      {/* Free Video Access Modal */}
      <FreeVideoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={onFormSubmit}
        videoTitle={module.title}
        courseId={courseId}
      />

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
