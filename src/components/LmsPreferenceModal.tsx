'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { LmsPreference } from '@/constants/lmsPreference';
import type { UseLmsPreferenceReturn } from '@/hooks/useLmsPreference';

interface LmsPreferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  setLmsPreference: UseLmsPreferenceReturn['setLmsPreference'];
  error: string | null;
}

export default function LmsPreferenceModal({
  isOpen,
  onClose,
  setLmsPreference,
  error,
}: LmsPreferenceModalProps) {
  const [saving, setSaving] = useState<'locked' | 'unlocked' | null>(null);

  const handleChoose = async (value: LmsPreference) => {
    setSaving(value);
    const ok = await setLmsPreference(value);
    setSaving(null);
    if (ok) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/60 backdrop-blur-sm"
        className="w-full max-w-md rounded-2xl bg-background dark:bg-[#151019] shadow-2xl border border-border p-0"
      >
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-linear-to-br from-purple/20 to-indigo-500/20 mb-4">
              <svg className="w-7 h-7 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <DialogTitle className="text-xl font-bold text-heading dark:text-darkHeading">
              কোর্স কোন স্টাইলে দেখবেন?
            </DialogTitle>
                    <p className="mt-2 text-sm text-paragraph dark:text-darkParagraph">
                      এই কোর্সগুলো আপনি দুইভাবে দেখতে পারবেন — লকড স্টাইল অথবা আনলকড স্টাইল। আপনার পছন্দ একবার নির্বাচন করুন।
                    </p>
                  </div>
                  {error && (
                    <p className="mb-4 text-sm text-destructive text-center">{error}</p>
                  )}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleChoose('locked')}
                      disabled={saving !== null}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-purple/50 dark:hover:border-purple/50 bg-muted/40 hover:bg-purple/5 dark:hover:bg-purple/10 transition-all text-left group disabled:opacity-60"
                    >
                      <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple/20 dark:bg-purple/30 flex items-center justify-center text-purple group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-heading dark:text-darkHeading block">লকড স্টাইলে দেখুন</span>
                        <span className="text-xs text-paragraph dark:text-darkParagraph">একটার পর একটা মডিউল সিরিয়ালে শেষ করতে হবে; পরের মডিউল আনলক হতে আগেরটা সম্পন্ন করতে হবে। একবার নির্বাচন করলে সব জায়গা থেকে এই স্টাইলেই দেখতে পাবেন।</span>
                      </div>
                      {saving === 'locked' && (
                        <span className="flex-shrink-0 w-5 h-5 border-2 border-purple border-t-transparent rounded-full animate-spin" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleChoose('unlocked')}
                      disabled={saving !== null}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-indigo-500/50 dark:hover:border-indigo-500/50 bg-muted/40 hover:bg-indigo-500/5 dark:hover:bg-indigo-500/10 transition-all text-left group disabled:opacity-60"
                    >
                      <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-500/20 dark:bg-indigo-500/30 flex items-center justify-center text-indigo-500 group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-heading dark:text-darkHeading block">আনলকড স্টাইলে দেখুন</span>
                        <span className="text-xs text-paragraph dark:text-darkParagraph">যেকোনো মডিউল যেকোনো সময় দেখতে পারবেন; সিরিয়াল মানতে হবে না। একবার নির্বাচন করলে সব জায়গা থেকে এই স্টাইলেই দেখতে পাবেন।</span>
                      </div>
                      {saving === 'unlocked' && (
                        <span className="flex-shrink-0 w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      )}
                    </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
