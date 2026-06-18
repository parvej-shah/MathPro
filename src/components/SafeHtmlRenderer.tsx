"use client";

import DOMPurify from "dompurify";
import { useMemo } from "react";

interface SafeHtmlRendererProps {
  content: string | null | undefined;
  className?: string;
  fallback?: React.ReactNode;
  /** If true, truncates content to specified length and strips HTML for preview */
  truncate?: number;
}

/**
 * SafeHtmlRenderer - Universal Content Renderer
 *
 * This component is CRITICAL for the Lexical editor migration.
 * It automatically detects and handles BOTH:
 *   1. Legacy plain text (pre-December 2025 data)
 *   2. New HTML content (post-Lexical integration)
 *
 * IMPORTANT: The database contains MIXED content:
 *   - Old records: Plain text like "Hello world"
 *   - New/edited records: HTML like "<p class="mb-2">Hello world</p>"
 *
 * This component ensures ZERO breaking changes for existing content.
 *
 * @example
 * // Basic usage
 * <SafeHtmlRenderer content={liveClass.description} />
 *
 * @example
 * // With styling
 * <SafeHtmlRenderer content={announcement.content} className="prose dark:prose-invert" />
 *
 * @example
 * // With fallback
 * <SafeHtmlRenderer content={module.description} fallback={<p>No description</p>} />
 *
 * @example
 * // Truncated preview
 * <SafeHtmlRenderer content={announcement.content} truncate={100} />
 */
export function SafeHtmlRenderer({
  content,
  className = "",
  fallback = null,
  truncate,
}: SafeHtmlRendererProps) {
  const processedContent = useMemo(() => {
    // Handle null/undefined/empty content
    if (!content || content.trim() === "") return null;

    // Transform markdown images first (before linkify mangles URLs inside ![](…))
    const workingContent = linkifyUrls(transformMarkdownImages(content));

    // If truncating, strip HTML and return plain text
    if (truncate && truncate > 0) {
      const plainText = stripHtml(workingContent);
      if (plainText.length <= truncate) {
        return { type: "text" as const, value: plainText };
      }
      return {
        type: "text" as const,
        value: plainText.substring(0, truncate) + "...",
      };
    }

    // AUTOMATIC FORMAT DETECTION
    // Check if content contains HTML tags (new Lexical format)
    // Plain text from old records won't have any HTML tags
    const isHtml = /<[^>]+>/.test(workingContent);

    if (isHtml) {
      // NEW FORMAT: HTML content from Lexical editor
      // Sanitize to prevent XSS attacks while preserving formatting
      const sanitized = DOMPurify.sanitize(workingContent, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "b",
          "em",
          "i",
          "u",
          "s",
          "del",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "ol",
          "li",
          "blockquote",
          "pre",
          "code",
          "a",
          "span",
          "div",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "img",
          "sub",
          "sup",
        ],
        ALLOWED_ATTR: [
          "href",
          "target",
          "rel",
          "class",
          "style",
          "id",
          "src",
          "alt",
          "width",
          "height",
        ],
        ALLOW_DATA_ATTR: false,
      });
      return { type: "html" as const, value: sanitized };
    }

    // LEGACY FORMAT: Plain text from old database records
    // Convert to HTML for consistent rendering:
    //   - Wrap in <p> tag for proper spacing
    //   - Convert \n newlines to <br> tags
    // linkifyUrls may have added <a> tags, so workingContent might already be HTML
    const htmlified = `<p>${escapeHtml(workingContent).replace(/\n/g, "<br>")}</p>`;
    return { type: "html" as const, value: htmlified };
  }, [content, truncate]);

  if (!processedContent) {
    return <>{fallback}</>;
  }

  // For truncated text content, render as plain text
  if (processedContent.type === "text") {
    return <span className={className}>{processedContent.value}</span>;
  }

  // For HTML content, render with dangerouslySetInnerHTML (already sanitized)
  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent.value }}
    />
  );
}

/**
 * Strips HTML tags from content and returns plain text
 */
function stripHtml(html: string): string {
  // Use DOMPurify to safely strip tags
  const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  // Decode HTML entities
  const txt = document.createElement("textarea");
  txt.innerHTML = clean;
  return txt.value;
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Converts plain http/https URLs in text into clickable <a> tags.
 * Only allows http and https protocols for security.
 */
function linkifyUrls(text: string): string {
  const urlRegex = /(["'=]?)(https?:\/\/[^\s<>\[\]"']+)/g;
  return text.replace(urlRegex, (match, prefix: string, rawUrl: string) => {
    if (prefix === '"' || prefix === "'" || prefix === "=") return match;
    const url = rawUrl.replace(/[.,;:!?)\]]+$/, "");
    if (!/^https?:\/\//i.test(url)) return escapeHtml(match);
    const safe = escapeHtml(url);
    return `<a href="${safe}" target="_blank" rel="noopener noreferrer" class="text-purple hover:underline break-all">${safe}</a>`;
  });
}

function transformMarkdownImages(text: string): string {
  const markdownImageRegex = /!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  return text.replace(markdownImageRegex, (_match, altText, imageUrl) => {
    const safeAlt = escapeHtml(altText || "Image");
    const safeSrc = escapeHtml(imageUrl);
    return `<img src="${safeSrc}" alt="${safeAlt}" class="max-w-full h-64 object-contain rounded-md my-3" />`;
  });
}

export default SafeHtmlRenderer;
