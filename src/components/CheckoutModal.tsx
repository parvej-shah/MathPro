import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import toast from "react-hot-toast";
import { useUserProfile, UserProfile } from "@/hooks/useUserProfile";

const Spinner = ({ className = "size-5" }: { className?: string }) => (
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

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  currentInstitution: string;
  department: string;
  currentAcademicLevel: "SSC" | "HSC" | "UNIVERSITY" | "OTHERS";
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void; // Called after successful profile update, before payment
  type: "bundle" | "course";
  title: string;
  price: number;
  originalPrice?: number;
  courseCount?: number;
  savings?: number;
  discountPercentage?: string;
  ownedCoursesCount?: number;
  youGet?: string[];
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onProceed,
  type,
  title,
  price,
  originalPrice,
  courseCount,
  savings,
  discountPercentage,
  ownedCoursesCount,
  youGet,
}: CheckoutModalProps) {
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    refetch,
  } = useUserProfile();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    currentInstitution: "",
    department: "",
    currentAcademicLevel: "UNIVERSITY",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Initialize form data when profile loads - Auto-fill from user profile
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || profile.profile?.email || "",
        phone: profile.phone || profile.profile?.phone || "",
        currentInstitution: profile.profile?.currentInstitution || "",
        department: profile.profile?.department || "",
        currentAcademicLevel:
          profile.profile?.currentAcademicLevel || "UNIVERSITY",
      });
    }
  }, [profile]);

  // Reset form when modal opens if profile is already loaded
  useEffect(() => {
    if (isOpen && profile && !profileLoading) {
      setFormData({
        name: profile.name || "",
        email: profile.email || profile.profile?.email || "",
        phone: profile.phone || profile.profile?.phone || "",
        currentInstitution: profile.profile?.currentInstitution || "",
        department: profile.profile?.department || "",
        currentAcademicLevel:
          profile.profile?.currentAcademicLevel || "UNIVERSITY",
      });
      // Clear errors when modal opens
      setErrors({});
      setAgreedToTerms(false);
    }
  }, [isOpen, profile, profileLoading]);

  // Determine which fields should be disabled
  const isEmailDisabled = (): boolean => {
    if (!profile) return false;
    // If user registered with email, email is disabled
    if (profile.login_type === "email") return true;
    // If email already exists, it's disabled
    if (profile.email || profile.profile?.email) return true;
    return false;
  };

  const isPhoneDisabled = (): boolean => {
    if (!profile) return false;
    // If user registered with phone, phone is disabled
    if (profile.login_type === "phone") return true;
    // If phone already exists, it's disabled
    if (profile.phone || profile.profile?.phone) return true;
    return false;
  };

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneDigits = phone.trim().replace(/\D/g, "");
    if (phoneDigits.length !== 11) return false;
    if (!phoneDigits.startsWith("01")) return false;
    return /^01[3-9]\d{8}$/.test(phoneDigits);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    // Email validation
    if (!isEmailDisabled()) {
      if (!formData.email.trim()) {
        newErrors.email = "Please enter your email";
      } else if (!validateEmail(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    } else if (!formData.email.trim()) {
      // Even if disabled, we need email for validation
      newErrors.email = "Email is required";
    }

    // Phone validation
    if (!isPhoneDisabled()) {
      if (!formData.phone.trim()) {
        newErrors.phone = "Please enter your phone number";
      } else if (!validatePhone(formData.phone.trim())) {
        newErrors.phone = "Phone number must be 11 digits (e.g., 01XXXXXXXXX)";
      }
    } else if (!formData.phone.trim()) {
      // Even if disabled, we need phone for validation
      newErrors.phone = "Phone number is required";
    }

    // Institute validation
    if (!formData.currentInstitution.trim()) {
      newErrors.currentInstitution = "Please enter your institute";
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = "Please enter your department/group";
    }

    // Academic level validation
    if (!formData.currentAcademicLevel) {
      newErrors.currentAcademicLevel = "Please select your academic level";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error("অনুগ্রহ করে শর্তাবলী সম্মত হন");
      return;
    }

    if (!validateForm()) {
      toast.error("অনুগ্রহ করে সকল তথ্য সঠিকভাবে পূরণ করুন");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        setIsSubmitting(false);
        return;
      }

      // Prepare update data - only include fields that can be updated
      // Backend endpoint: PUT /user/profile (user_id extracted from JWT token automatically)
      const updateData: any = {
        name: formData.name.trim(),
        currentInstitution: formData.currentInstitution.trim(),
        department: formData.department.trim(),
        currentAcademicLevel: formData.currentAcademicLevel,
      };

      // Only add email if it's not disabled (user can add it)
      if (!isEmailDisabled() && formData.email.trim()) {
        updateData.email = formData.email.trim();
      }

      // Only add phone if it's not disabled (user can add it)
      if (!isPhoneDisabled() && formData.phone.trim()) {
        updateData.phone = formData.phone.trim();
      }

      // Update profile using backend endpoint
      const response = await axios.put(
        `${BACKEND_URL}/user/profile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Backend response structure: { success: true, data: {...}, message: "..." }
      if (response.data.success) {
        // Refresh profile to get updated data
        await refetch();
        // Close modal and proceed to payment
        onClose();
        onProceed();
      } else {
        throw new Error(response.data.error || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      // Backend error response: { success: false, error: "..." }
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CheckoutFormData,
    value: string | "SSC" | "HSC" | "UNIVERSITY" | "OTHERS",
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
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
        className="w-full max-w-lg text-darkHeading rounded-2xl bg-background/90 backdrop-blur-lg border border-purple/30 p-0 max-h-[90vh] overflow-y-auto"
        overlayClassName="backdrop-blur-sm"
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
          className="text-lg font-medium leading-6 p-6 pb-4 border-b border-border/20"
        >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-purple/20 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-heading dark:text-darkHeading text-xl font-bold">
                        {type === "bundle"
                          ? "Bundle ক্রয় নিশ্চিত করো"
                          : "কোর্স ক্রয় নিশ্চিত করো"}
                      </p>
                      <p className="text-paragraph dark:text-darkParagraph text-sm mt-1">
                        অনুগ্রহ করে আপনার তথ্য যাচাই করুন
                      </p>
                    </div>
          </div>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-4">
                    {/* Summary Section - Compact - Always show */}
                    <div className="bg-muted rounded-xl p-4">
                      <h3 className="font-semibold text-heading dark:text-darkHeading mb-2 text-sm">
                        {title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-paragraph dark:text-darkParagraph text-xs">
                          {type === "bundle" && courseCount
                            ? `${courseCount}টি কোর্স`
                            : "কোর্স"}
                        </span>
                        {originalPrice && (
                          <span className="text-paragraph dark:text-darkParagraph text-xs line-through">
                            {formatPrice(originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-heading dark:text-darkHeading text-sm">
                          মূল্য
                        </span>
                        <span className="text-xl font-bold text-purple">
                          {formatPrice(price)}
                        </span>
                      </div>
                      {savings !== undefined && savings > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/20">
                          <div className="flex items-center justify-between">
                            <span className="text-success font-semibold text-xs">
                              সাশ্রয়
                            </span>
                            <span className="text-success font-bold text-sm">
                              {formatPrice(savings)}
                              {discountPercentage && ` (${discountPercentage})`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Loading State - Show above form */}
                    {profileLoading && (
                      <div className="bg-info/10 border border-info/30 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Spinner className="size-5 text-info" />
                          <p className="text-sm text-info">
                            আপনার প্রোফাইল লোড হচ্ছে...
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Error State */}
                    {!profileLoading && profileError && (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                        <p className="text-sm text-destructive">
                          ⚠️ প্রোফাইল লোড করতে সমস্যা হয়েছে: {profileError}
                        </p>
                        <p className="text-xs text-destructive mt-2">
                          আপনি এখনও ফর্ম পূরণ করতে পারবেন, তবে কিছু তথ্য
                          স্বয়ংক্রিয়ভাবে পূরণ হবে না।
                        </p>
                      </div>
                    )}

                    {/* Warning Message */}
                    <div className="bg-info/10 border border-info/30 rounded-lg p-3">
                      <p className="text-xs text-info">
                        ⚠️ অনুগ্রহ করে নিশ্চিত করুন যে এই ফোন নম্বর এবং ইমেইল
                        ঠিকানা সম্পূর্ণ সঠিক
                      </p>
                    </div>

                    {/* Form Fields - Always render */}
                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-heading dark:text-darkHeading mb-1">
                          নাম <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="আপনার নাম"
                          className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                            errors.name
                              ? "border-destructive"
                              : "border-border"
                          } outline-none focus:ring-2 focus:ring-purple/50 text-heading dark:text-darkHeading`}
                          required
                        />
                        {errors.name && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-heading dark:text-darkHeading mb-1">
                          ইমেইল <span className="text-destructive">*</span>
                          {isEmailDisabled() && (
                            <span className="text-xs text-muted-foreground ml-2">
                              (আপডেট করা যাবে না)
                            </span>
                          )}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="support@codervai.com"
                          disabled={isEmailDisabled()}
                          className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                            errors.email
                              ? "border-destructive"
                              : "border-border"
                          } outline-none focus:ring-2 focus:ring-purple/50 text-heading dark:text-darkHeading ${
                            isEmailDisabled()
                              ? "bg-muted cursor-not-allowed opacity-70"
                              : ""
                          }`}
                          required
                        />
                        {errors.email && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-heading dark:text-darkHeading mb-1">
                          ফোন নম্বর <span className="text-destructive">*</span>
                          {isPhoneDisabled() && (
                            <span className="text-xs text-muted-foreground ml-2">
                              (আপডেট করা যাবে না)
                            </span>
                          )}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          placeholder="01xxxxxxxxx"
                          disabled={isPhoneDisabled()}
                          className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                            errors.phone
                              ? "border-destructive"
                              : "border-border"
                          } outline-none focus:ring-2 focus:ring-purple/50 text-heading dark:text-darkHeading ${
                            isPhoneDisabled()
                              ? "bg-muted cursor-not-allowed opacity-70"
                              : ""
                          }`}
                          required
                        />
                        {errors.phone && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Institute */}
                      <div>
                        <label className="block text-sm font-medium text-heading dark:text-darkHeading mb-1">
                          ইনস্টিটিউট <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.currentInstitution}
                          onChange={(e) =>
                            handleInputChange(
                              "currentInstitution",
                              e.target.value,
                            )
                          }
                          placeholder="আপনার ইনস্টিটিউট"
                          className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                            errors.currentInstitution
                              ? "border-destructive"
                              : "border-border"
                          } outline-none focus:ring-2 focus:ring-purple/50 text-heading dark:text-darkHeading`}
                          required
                        />
                        {errors.currentInstitution && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.currentInstitution}
                          </p>
                        )}
                      </div>

                      {/* Academic Level */}
                      <div>
                        <label className="block text-sm font-medium text-heading dark:text-darkHeading mb-1">
                          একাডেমিক লেভেল <span className="text-destructive">*</span>
                        </label>
                        <select
                          value={formData.currentAcademicLevel}
                          onChange={(e) =>
                            handleInputChange(
                              "currentAcademicLevel",
                              e.target.value as
                                | "SSC"
                                | "HSC"
                                | "UNIVERSITY"
                                | "OTHERS",
                            )
                          }
                          className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                            errors.currentAcademicLevel
                              ? "border-destructive"
                              : "border-border"
                          } outline-none focus:ring-2 focus:ring-purple/50 text-heading dark:text-darkHeading`}
                          required
                        >
                          <option value="SSC">SSC</option>
                          <option value="HSC">HSC</option>
                          <option value="UNIVERSITY">University</option>
                          <option value="OTHERS">Others</option>
                        </select>
                        {errors.currentAcademicLevel && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.currentAcademicLevel}
                          </p>
                        )}
                      </div>

                      {/* Department */}
                      <div>
                        <label className="block text-sm font-medium text-heading dark:text-darkHeading mb-1">
                          ডিপার্টমেন্ট/গ্রুপ{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                          placeholder="আপনার ডিপার্টমেন্ট/গ্রুপ"
                          className={`w-full px-4 py-2 rounded-lg bg-background/50 border ${
                            errors.department
                              ? "border-destructive"
                              : "border-border"
                          } outline-none focus:ring-2 focus:ring-purple/50 text-heading dark:text-darkHeading`}
                          required
                        />
                        {errors.department && (
                          <p className="text-destructive text-xs mt-1">
                            {errors.department}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Duplicate Course Warning */}
                    {ownedCoursesCount !== undefined &&
                      ownedCoursesCount > 0 && (
                        <div className="bg-warning/10 border border-warning/30 rounded-xl p-3">
                          <div className="flex items-start gap-2">
                            <svg
                              className="w-4 h-4 text-warning flex-shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div className="flex-1">
                              <p className="text-warning text-xs">
                                সতর্কতা: তোমার কাছে ইতিমধ্যে {ownedCoursesCount}
                                টি কোর্স আছে
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Terms and Conditions */}
                    <div>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="mt-1 w-5 h-5 rounded border-border text-purple focus:ring-purple focus:ring-offset-0 cursor-pointer"
                        />
                        <span className="text-xs text-paragraph dark:text-darkParagraph group-hover:text-heading dark:group-hover:text-darkHeading transition-colors">
                          আমি{" "}
                          <a
                            href="https://www.codervai.com/terms-and-conditions"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            শর্তাবলী
                          </a>{" "}
                          এবং{" "}
                          <a
                            href="https://www.codervai.com/privacy-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple hover:underline font-medium"
                            onClick={(e) => e.stopPropagation()}
                          >
                            গোপনীয়তা নীতি
                          </a>{" "}
                          সম্মত এবং বুঝতে পেরেছি যে এটি একটি ডিজিটাল পণ্য এবং
                          ক্রয়ের পর রিফান্ড করা যাবে না।
                        </span>
                      </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-border text-heading dark:text-darkHeading hover:bg-muted transition-colors font-medium"
                      >
                        বাতিল করো
                      </button>
                      <button
                        type="submit"
                        disabled={
                          !agreedToTerms || isSubmitting || profileLoading
                        }
                        className={`flex-1 px-4 py-3 rounded-xl font-bold text-white transition-all ${
                          agreedToTerms && !isSubmitting && !profileLoading
                            ? "bg-gradient-to-r from-purple to-teal hover:shadow-lg hover:scale-105"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <Spinner className="size-5 text-white" />
                            <span>প্রসেস হচ্ছে...</span>
                          </div>
                        ) : (
                          "পেমেন্ট করো"
                        )}
                      </button>
                    </div>
                  </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
