"use client";

import { useState } from "react";

interface PdfAttachmentProps {
  url: string;
}

export default function PdfAttachment({ url }: PdfAttachmentProps) {
  const [expanded, setExpanded] = useState(false);

  if (!url) return null;

  const isGoogleDrive = url.includes("drive.google.com");
  const viewerUrl = isGoogleDrive
    ? url
    : `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className="mt-8">
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="flex items-center gap-3 w-full text-left px-5 py-4 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-primary"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
        <span className="flex-1 font-semibold text-foreground">সংযুক্ত PDF</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="mt-3 rounded-xl overflow-hidden border border-border/40">
          <iframe
            src={viewerUrl}
            className="w-full h-[70vh]"
            title="PDF Attachment"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
