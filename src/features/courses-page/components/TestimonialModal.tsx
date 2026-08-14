"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Feedback } from "../_lib/types";

/** Explains the check badge on hover / to screen readers. */
const VERIFIED_LABEL = "কোর্সে ভর্তি হওয়া শিক্ষার্থীর যাচাইকৃত রিভিউ";

function StarRow({ rating = 5, size = "text-base" }: { rating?: number; size?: string }) {
  const rounded = Math.round(rating);
  return (
    <div className={`flex items-center gap-0.5 ${size}`} aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rounded ? "text-warning" : "text-muted-foreground/25"}>
          ★
        </span>
      ))}
    </div>
  );
}

/** Avatar with graceful fallback to an initial — mirrors TestimonialShowcase's Avatar. */
function ModalAvatar({ name, src }: { name: string; src?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="relative size-14 shrink-0 rounded-full overflow-hidden bg-primary/10 border-2 border-background ring-2 ring-primary/20 flex items-center justify-center">
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-primary font-bold text-xl">{name?.charAt(0) || "?"}</span>
      )}
    </span>
  );
}

/** Small logo with graceful fallback — hides itself rather than showing broken alt text. */
function InstitutionLogo({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <span className="relative size-6 shrink-0 rounded-full overflow-hidden bg-muted ring-1 ring-border">
      <Image src={src} alt="" fill className="object-contain" onError={() => setFailed(true)} />
    </span>
  );
}

export interface TestimonialModalProps {
  feedback: Feedback | null;
  onOpenChange: (open: boolean) => void;
}

export default function TestimonialModal({ feedback, onOpenChange }: TestimonialModalProps) {
  return (
    <Dialog open={feedback !== null} onOpenChange={onOpenChange}>
      {feedback && (
        <DialogContent
          overlayClassName="bg-black/60 backdrop-blur-sm"
          className="scrollbar-thin max-w-lg max-h-[85vh] overflow-y-auto overscroll-contain rounded-[1.75rem] border-border/60 bg-background p-0 shadow-2xl"
        >
          <DialogTitle className="sr-only">{feedback.name} testimonial</DialogTitle>

          {/* Identity header — sets the frame before the reader gets to the words */}
          <div className="relative px-7 pt-7 pb-5 md:px-9 md:pt-9">
            <div className="flex items-center gap-3.5">
              <ModalAvatar name={feedback.name} src={feedback.imageUploadedLink} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-heading text-base leading-tight">
                    {feedback.name}
                  </span>
                  <span title={VERIFIED_LABEL} className="inline-flex shrink-0">
                    <CheckCircle2
                      className="size-4 text-primary"
                      role="img"
                      aria-label={VERIFIED_LABEL}
                    />
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <InstitutionLogo src={feedback.institutionLogoUrl} />
                  <p className="text-sm text-muted-foreground truncate">{feedback.bio}</p>
                </div>
              </div>
            </div>
            <StarRow rating={feedback.rating} size="text-sm mt-4" />
            <div className="h-px bg-border mt-4" />
          </div>

          {/* Full story */}
          <div className="relative px-7 pb-8 md:px-9 md:pb-9">
            <Quote
              className="absolute -top-1 left-6 md:left-8 size-14 text-primary/[0.06] -z-0"
              aria-hidden="true"
              strokeWidth={1}
            />
            <p className="relative text-heading/90 text-[1.05rem] leading-[1.85] mt-1">
              {feedback.description}
            </p>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
