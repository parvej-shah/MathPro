import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface BuyCourseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBuy: () => void;
  conditionsChecked: boolean;
  setConditionsChecked: (checked: boolean) => void;
}

export default function BuyCourseDialog({
  isOpen,
  onClose,
  onBuy,
  conditionsChecked,
  setConditionsChecked,
}: BuyCourseDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] lg:w-[40vw] max-w-none text-foreground rounded-2xl bg-background/60 dark:bg-background/30 backdrop-blur-lg border border-border/20 p-6"
      >
        <DialogTitle
          render={<div />}
          className="text-lg font-medium leading-6"
        >
          <div>Buy Course</div>
        </DialogTitle>
        <div className="flex flex-col-reverse md:flex-row justify-between gap-8">
          <div className="pt-4" style={{ flex: 3 }}>
            <div className="flex gap-2">
              <input
                type="checkbox"
                checked={conditionsChecked}
                onChange={(e) => setConditionsChecked(e.target.checked)}
              />
              <div>
                I HAVE READ AND AGREE TO THE WEBSITE{"'"}S{" "}
                <a
                  target="_blank"
                  className="text-info font-bold"
                  href="https://www.codervai.com/terms-and-conditions"
                >
                  TERMS AND CONDITIONS
                </a>{" "}
                ,
                <a
                  target="_blank"
                  className="text-info font-bold"
                  href="https://www.codervai.com/privacy-policy"
                >
                  PRIVACY POLICY
                </a>
                , AND{" "}
                <a
                  target="_blank"
                  className="text-info font-bold"
                  href="https://www.codervai.com/refund-policy"
                >
                  REFUND POLICY
                </a>
                <span className="text-destructive">*</span>
              </div>
            </div>
            <button
              onClick={onBuy}
              className={`${
                conditionsChecked
                  ? "bg-success hover:opacity-75 ease-in-out duration-150"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              } text-success-foreground py-3 w-full mt-8 rounded-xl`}
            >
              কোর্সটি কিনুন
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
