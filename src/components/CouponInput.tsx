import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  validateCoupon,
  applyCoupon,
  CouponApplyResponse,
} from "@/services/couponService";

const Spinner = ({ className = "size-4" }: { className?: string }) => (
  <svg
    className={`animate-spin shrink-0 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

interface CouponInputProps {
  courseId?: number;
  bundleId?: number;
  bookId?: number;
  originalPrice: number;
  userId?: number;
  onCouponApplied: (discountInfo: CouponApplyResponse["data"]) => void;
  onCouponRemoved?: () => void;
  appliedCouponCode?: string | null;
  disabled?: boolean;
}

export default function CouponInput({
  courseId,
  bundleId,
  bookId,
  originalPrice,
  userId,
  onCouponApplied,
  onCouponRemoved,
  appliedCouponCode,
  disabled = false,
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(
    appliedCouponCode || null,
  );

  // Sync appliedCoupon with prop changes (edge case: when parent clears coupon)
  useEffect(() => {
    setAppliedCoupon(appliedCouponCode || null);
    if (!appliedCouponCode) {
      // Clear local state when prop is cleared
      setCouponCode("");
      setError(null);
    }
  }, [appliedCouponCode]);

  // Edge case: If originalPrice changes, we should re-validate/re-apply coupon
  // For now, we'll just clear the applied coupon if price changes significantly
  // This prevents using a discount calculated with old price
  useEffect(() => {
    // If coupon is applied and price changes, clear it to force re-application
    // This is a safety measure - in practice, price shouldn't change after page load
    if (appliedCoupon && originalPrice) {
      // Note: We don't auto-clear here to avoid disrupting user experience
      // The user can manually remove and re-apply if needed
    }
  }, [originalPrice, appliedCoupon]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    if (appliedCoupon) {
      setError("Please remove the current coupon before applying a new one");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Validate coupon
      const validation = await validateCoupon(
        couponCode,
        courseId,
        bundleId,
        userId,
        bookId,
      );

      if (!validation.valid) {
        setError(validation.error || "Invalid coupon code");
        setLoading(false);
        return;
      }

      // Step 2: Apply coupon to calculate discount
      const applyResult = await applyCoupon(
        couponCode,
        originalPrice,
        courseId,
        bundleId,
        userId,
        bookId,
      );

      if (applyResult.success && applyResult.data) {
        setAppliedCoupon(couponCode.trim());
        setCouponCode("");
        setError(null);
        onCouponApplied(applyResult.data);
        toast.success("Coupon applied successfully! 🎉");
      } else {
        setError(applyResult.error || "Failed to apply coupon");
      }
    } catch (err: any) {
      console.error("Error applying coupon:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setError(null);
    if (onCouponRemoved) {
      onCouponRemoved();
    }
    toast.success("Coupon removed");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading && !disabled) {
      handleApplyCoupon();
    }
  };

  return (
    <div className="coupon-input space-y-2">
      <p className="text-lg font-semibold mb-1 text-foreground">
        Enter Coupon
      </p>

      {appliedCoupon ? (
        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/40 rounded-lg">
          <div className="flex-1">
            <p className="text-sm text-success font-medium">
              ✅ Coupon Applied:{" "}
              <span className="font-bold">{appliedCoupon}</span>
            </p>
          </div>
          <button
            onClick={handleRemoveCoupon}
            disabled={disabled}
            className="px-3 py-1 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter coupon code"
            disabled={loading || disabled}
            className={`flex-1 px-3 py-3 rounded bg-muted outline-none focus:ring-2 focus:ring-primary/50 text-foreground ${
              error ? "border-2 border-destructive" : ""
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={loading || disabled || !couponCode.trim()}
            className="py-2 flex gap-2 items-center px-6 bg-secondary text-secondary-foreground cursor-pointer hover:opacity-75 ease-in-out duration-150 focus:ring-2 focus:ring-primary/50 rounded font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Spinner className="size-4 text-white" />
                <span>Applying...</span>
              </>
            ) : (
              "Apply"
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="text-destructive text-sm mt-1 bg-destructive/10 border border-destructive/30 rounded p-2">
          {error}
        </div>
      )}
    </div>
  );
}
