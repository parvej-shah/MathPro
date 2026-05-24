import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import GradientButton from "@/components/GradientButton";
import { PrebookingData } from "@/features/course-details/_lib/types";
import toast from "react-hot-toast";

interface PrebookCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPrebook: (data: PrebookingData) => Promise<boolean>;
  courseTitle: string;
  loading: boolean;
}

export default function PrebookCourseDialog({
  isOpen,
  onClose,
  onPrebook,
  courseTitle,
  loading,
}: PrebookCourseDialogProps) {
  const [prebookingData, setPrebookingData] = useState<PrebookingData>({
    name: "",
    email: "",
    phone: "",
  });

  const handlePrebook = async () => {
    if (
      !prebookingData.name ||
      !prebookingData.email ||
      !prebookingData.phone
    ) {
      toast.error("অনুগ্রহ করে সকল তথ্য পূরণ করুন");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(prebookingData.email)) {
      toast.error("সঠিক ইমেইল ঠিকানা দিন");
      return;
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(prebookingData.phone)) {
      toast.error("সঠিক ফোন নাম্বার দিন (01XXXXXXXXX)");
      return;
    }

    const success = await onPrebook(prebookingData);
    if (success) {
      setPrebookingData({ name: "", email: "", phone: "" });
      onClose();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-full max-w-md lg:max-w-lg text-darkHeading rounded-2xl bg-[#B2F100]/5 dark:bg-[#B2F100]/5 backdrop-blur-lg border border-[#B2F100]/60 p-0"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-5 h-5 text-heading dark:text-darkHeading"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <DialogTitle
          render={<div />}
          className="text-lg font-medium leading-6 p-6"
        >
          <div className="flex items-center flex-col lg:flex-row">
            <img src="/logo.png" alt="" className="py-6 lg:p-6" />
            <div>
              <p className="text-heading dark:text-darkHeading text-xl text-center lg:text-left">
                {courseTitle}
              </p>
              <p className="text-paragraph dark:text-darkParagraph mt-2 text-base text-center lg:text-left">
                খুব শীঘ্রই আসছে আমাদের এই কোর্স! কোর্স সম্বন্ধে আগাম জেনে রাখার
                জন্য এখনি নিচে দেওয়া ফর্ম ফিল আপ করো!
              </p>
            </div>
          </div>
        </DialogTitle>
        <div className="border-b border-t border-border/20 py-8 px-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-6">
            <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base lg:flex-1">
              First Name
            </p>
            <input
              value={prebookingData.name}
              placeholder="CoderVai"
              onChange={(e) =>
                setPrebookingData({
                  ...prebookingData,
                  name: e.target.value,
                })
              }
              className="w-full bg-white/0 border lg:flex-[2] border-border outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-6">
            <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base lg:flex-1">
              Phone Number
            </p>
            <input
              type="tel"
              value={prebookingData.phone}
              placeholder="01xxxxxxxxx"
              onChange={(e) =>
                setPrebookingData({
                  ...prebookingData,
                  phone: e.target.value,
                })
              }
              className="w-full bg-white/0 border lg:flex-[2] border-border outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
            />
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center gap-2">
            <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base lg:flex-1">
              Email
            </p>
            <input
              type="email"
              value={prebookingData.email}
              placeholder="support@codervai.com"
              onChange={(e) =>
                setPrebookingData({
                  ...prebookingData,
                  email: e.target.value,
                })
              }
              className="w-full bg-white/0 border lg:flex-[2] border-border outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
            />
          </div>
        </div>
        <div className="flex p-6 gap-4">
          <button
            onClick={onClose}
            className="bg-muted/10 hover:bg-muted/20 ease-in-out duration-150 border border-border/30 backdrop-blur-lg text-darkHeading py-3 w-full rounded-xl font-bold"
          >
            Cancel
          </button>
          <GradientButton
            loading={loading}
            gradientStyle="linear-gradient(91deg, #4B6404 0%, #7BA502 50.98%, #A9E400 100%)"
            label="Prebook"
            callBackFunction={handlePrebook}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
