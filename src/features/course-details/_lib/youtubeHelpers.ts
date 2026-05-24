/**
 * YouTube Video Helper Utilities
 * Ported from bundle-details page
 */

/**
 * Extract YouTube video ID from various URL formats
 * @param url - YouTube URL
 * @returns Video ID or null
 */
export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
    /youtube\.com\/watch\?.*v=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Get YouTube thumbnail URL from video URL
 * @param url - YouTube video URL
 * @returns Thumbnail URL or null
 */
export const getYouTubeThumbnail = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;

  // Use maxresdefault for highest quality, fallback to hqdefault if not available
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};
