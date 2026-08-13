"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Feedback } from "../_lib/types";

/** Explains the check badge on hover / to screen readers. */
const VERIFIED_LABEL = "কোর্সে ভর্তি হওয়া শিক্ষার্থীর যাচাইকৃত রিভিউ";

function StarRow({ rating = 5 }: { rating?: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" aria-hidden="true">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < rounded ? "text-warning" : "text-muted-foreground/30"}>
          ★
        </span>
      ))}
    </div>
  );
}

/** Small logo with graceful fallback — hides itself rather than showing broken alt text. */
function InstitutionLogo({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return (
    <span className="relative size-6 shrink-0 rounded-full overflow-hidden bg-muted">
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
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto rounded-[1.75rem] p-7 md:p-9">
          <DialogTitle className="sr-only">{feedback.name} testimonial</DialogTitle>

          <StarRow rating={feedback.rating} />
          <p className="relative text-lg text-heading leading-relaxed mt-4 mb-6">
            <Quote className="inline size-4 text-primary/70 -translate-y-1 mr-1" />
            {feedback.description}
          </p>

          <div className="h-px bg-border mb-4" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-heading">{feedback.name}</span>
            <span title={VERIFIED_LABEL} className="inline-flex shrink-0">
              <CheckCircle2 className="size-4 text-primary" role="img" aria-label={VERIFIED_LABEL} />
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <InstitutionLogo src={feedback.institutionLogoUrl} />
            <p className="text-sm text-muted-foreground">{feedback.bio}</p>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
