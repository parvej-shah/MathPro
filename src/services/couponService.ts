import axios from "axios";
import { BACKEND_URL } from "@/api.config";

export interface Coupon {
  id: number;
  name: string;
  code?: string;
  description?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  usage_limit?: number | null;
  usage_count?: number;
  start_time?: number;
  end_time?: number;
  status?: string;
  potential_savings?: number;
}

export interface CouponValidationResponse {
  valid: boolean;
  coupon?: Coupon;
  error?: string;
}

export interface CouponApplyResponse {
  success: boolean;
  data?: {
    coupon: Coupon;
    original_price: number;
    discount_amount: number;
    final_price: number;
  };
  error?: string;
}

export interface ActiveCouponsResponse {
  success: boolean;
  data?: Coupon[];
  error?: string;
}

const getCouponErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
};

/**
 * Validate a coupon code for a course, bundle, or book
 */
export const validateCoupon = async (
  couponCode: string,
  courseId?: number,
  bundleId?: number,
  userId?: number,
  bookId?: number
): Promise<CouponValidationResponse> => {
  try {
    if (!couponCode.trim()) {
      return {
        valid: false,
        error: "Coupon code is required",
      };
    }

    const providedCount = [courseId, bundleId, bookId].filter(Boolean).length;

    if (providedCount === 0) {
      return {
        valid: false,
        error: "Course ID, Bundle ID or Book ID is required",
      };
    }

    if (providedCount > 1) {
      return {
        valid: false,
        error: "Provide only one of course_id, bundle_id or book_id",
      };
    }

    const requestBody: {
      coupon_code: string;
      course_id?: number;
      bundle_id?: number;
      book_id?: number;
      user_id?: number;
    } = {
      coupon_code: couponCode.trim(),
    };

    if (courseId) {
      requestBody.course_id = courseId;
    }

    if (bundleId) {
      requestBody.bundle_id = bundleId;
    }

    if (bookId) {
      requestBody.book_id = bookId;
    }

    if (userId) {
      requestBody.user_id = userId;
    }

    const response = await axios.post(
      `${BACKEND_URL}/user/coupon/validate`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Error validating coupon:", error);
    return {
      valid: false,
      error: getCouponErrorMessage(
        error,
        "Failed to validate coupon. Please try again.",
      ),
    };
  }
};

/**
 * Apply a coupon and calculate discount
 */
export const applyCoupon = async (
  couponCode: string,
  originalPrice: number,
  courseId?: number,
  bundleId?: number,
  userId?: number,
  bookId?: number
): Promise<CouponApplyResponse> => {
  try {
    if (!couponCode.trim()) {
      return {
        success: false,
        error: "Coupon code is required",
      };
    }

    if (!originalPrice || originalPrice <= 0) {
      return {
        success: false,
        error: "Valid price is required",
      };
    }

    const providedCount = [courseId, bundleId, bookId].filter(Boolean).length;

    if (providedCount === 0) {
      return {
        success: false,
        error: "Course ID, Bundle ID or Book ID is required",
      };
    }

    if (providedCount > 1) {
      return {
        success: false,
        error: "Provide only one of course_id, bundle_id or book_id",
      };
    }

    const requestBody: {
      coupon_code: string;
      course_id?: number;
      bundle_id?: number;
      book_id?: number;
      user_id?: number;
    } = {
      coupon_code: couponCode.trim(),
    };

    if (courseId) {
      requestBody.course_id = courseId;
    }

    if (bundleId) {
      requestBody.bundle_id = bundleId;
    }

    if (bookId) {
      requestBody.book_id = bookId;
    }

    if (userId) {
      requestBody.user_id = userId;
    }

    const response = await axios.post(
      `${BACKEND_URL}/user/coupon/apply`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Error applying coupon:", error);
    return {
      success: false,
      error: getCouponErrorMessage(
        error,
        "Failed to apply coupon. Please try again.",
      ),
    };
  }
};

/**
 * Get active coupons for a course
 */
export const getActiveCouponsForCourse = async (
  courseId: number
): Promise<ActiveCouponsResponse> => {
  try {
    if (!courseId) {
      return {
        success: false,
        error: "Course ID is required",
      };
    }

    const response = await axios.get(
      `${BACKEND_URL}/user/coupon/course/${courseId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching active coupons:", error);
    return {
      success: false,
      error: getCouponErrorMessage(
        error,
        "Failed to fetch coupons. Please try again.",
      ),
    };
  }
};

/**
 * Get active coupons for a bundle
 * Note: The backend may return coupons in bundle details response
 * This is a helper function if a separate endpoint exists
 */
export const getActiveCouponsForBundle = async (
  bundleId: number
): Promise<ActiveCouponsResponse> => {
  try {
    if (!bundleId) {
      return {
        success: false,
        error: "Bundle ID is required",
      };
    }

    // Note: Check if backend has a specific endpoint for bundle coupons
    // For now, coupons should come from bundle details API response
    // This function is a placeholder for future use
    return {
      success: false,
      error: "Bundle coupons are included in bundle details response",
    };
  } catch (error: unknown) {
    console.error("Error fetching bundle coupons:", error);
    return {
      success: false,
      error: getCouponErrorMessage(
        error,
        "Failed to fetch coupons. Please try again.",
      ),
    };
  }
};
