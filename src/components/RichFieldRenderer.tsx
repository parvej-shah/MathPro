"use client";

import { SafeHtmlRenderer } from "./SafeHtmlRenderer";

interface RichFieldRendererProps {
  /** New HTML field (e.g., question_html, body_html) */
  htmlContent?: string | null;
  /** Legacy plain field (e.g., question, body) */
  plainContent?: string | null;
  className?: string;
  fallback?: React.ReactNode;
  /** If true, truncates content to specified length */
  truncate?: number;
}

/**
 * RichFieldRenderer - Handles fields with both HTML and plain text versions
 *
 * Use this for quiz and code problem fields that have dual formats:
 * - question_html / question
 * - options_html / options
 * - body_html / body
 * - explanation_html / explanation
 * etc.
 *
 * Priority: HTML version → Plain version → Fallback
 *
 * @example
 * // Quiz question
 * <RichFieldRenderer
 *   htmlContent={question.question_html}
 *   plainContent={question.question}
 * />
 *
 * @example
 * // Quiz explanation (after decryption)
 * <RichFieldRenderer
 *   htmlContent={decryptedExplanationHtml}
 *   plainContent={decryptedExplanation}
 *   className="text-gray-300"
 * />
 *
 * @example
 * // With truncation for previews
 * <RichFieldRenderer
 *   htmlContent={question.question_html}
 *   plainContent={question.question}
 *   truncate={100}
 * />
 */
export function RichFieldRenderer({
  htmlContent,
  plainContent,
  className = "",
  fallback = null,
  truncate,
}: RichFieldRendererProps) {
  // Use HTML version if available, otherwise fall back to plain text
  const content = htmlContent || plainContent;

  return (
    <SafeHtmlRenderer
      content={content}
      className={className}
      fallback={fallback}
      truncate={truncate}
    />
  );
}

export default RichFieldRenderer;
