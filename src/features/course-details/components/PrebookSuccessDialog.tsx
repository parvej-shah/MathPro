import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrebookSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
}

export default function PrebookSuccessDialog({
  isOpen,
  onClose,
  courseTitle,
}: PrebookSuccessDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="lgXl:w-[40vw] text-darkHeading rounded-2xl bg-[#B2F100]/5 dark:bg-[#B2F100]/5 backdrop-blur-lg border border-[#B2F100]/60 p-0"
      >
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
            </div>
          </div>
        </DialogTitle>
        <div className="border-b border-t border-border/20 py-8 px-6">
          <p className="text-heading dark:text-darkHeading text-xl font-semibold">
            Congratulations! তুমি প্রিবুক করেছ।{" "}
          </p>
          <p className="text-heading dark:text-darkHeading text-xl mt-4 font-semibold">
            আমাদের কোর্সে তোমার আগ্রহ দেখে আমরা অত্যন্ত খুশী! 🔥
            <br />
            তোমার জন্য গুরুত্বপূর্ণ তথ্য -
            <br />
            ১। প্রি-বুকিং এর মেয়াদ শেষ হলে তোমার ফোন নাম্বার ও ইমেইলে আমরা
            বিস্তারিত জানিয়ে দেব! অবশ্যই তোমার টেক্সট মেসেজ এবং ইমেইলে লক্ষ্য
            রাখবে।
            <br />
            ২। প্রি-বুকিং শেষ হওয়ার পরেই তুমি আমাদের কোর্সে এনরোল করতে পারবে!
            💪
            <br />
            ৩। টেক্সট মেসেজ এবং ইমেইলে কুপন কোড ও থাকতে পারে! তাই পারচেজ করার
            সময় কুপন কোড এপ্লাই করতে ভুলো নাহ! 😉{" "}
          </p>

          <p className="text-heading dark:text-darkHeading text-xl font-semibold mt-4">
            ধন্যবাদ।
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
