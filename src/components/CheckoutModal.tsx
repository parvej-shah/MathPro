import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import toast from "react-hot-toast";
import { useUserProfile, type UserProfile } from "@/hooks/useUserProfile";
import { AttachedBook, BookSelection } from "@/features/course-details/_lib/types";

const Spinner = ({ className = "size-5" }: { className?: string }) => (
  <svg
    className={`animate-spin shrink-0 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

export interface CheckoutFormData {
  name: string;
  phone: string;
  schoolCollege: string;
  classLevel: "" | "JSC" | "SSC" | "HSC";
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (bookSelection: BookSelection | null) => void;
  type: "bundle" | "course" | "book";
  title: string;
  price: number;
  originalPrice?: number;
  courseCount?: number;
  savings?: number;
  discountPercentage?: string;
  ownedCoursesCount?: number;
  youGet?: string[];
  attachedBooks?: AttachedBook[];
  booksTotal?: number;
}

interface ShippingFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
}

const getProfileFormDefaults = (profile: UserProfile | null): CheckoutFormData => ({
  name: profile?.name || "",
  phone: profile?.phone || profile?.profile?.phone || "",
  schoolCollege: profile?.profile?.schoolCollege || "",
  classLevel: profile?.profile?.classLevel || "",
});

const getShippingDefaults = (profile: UserProfile | null): ShippingFormData => ({
  name: profile?.name || "",
  phone: profile?.phone || profile?.profile?.phone || "",
  address: profile?.profile?.address || "",
  city: "",
  postcode: "",
});

const FIELD_CLASS = (hasError: boolean, disabled = false) =>
  `h-12 w-full px-4 rounded-xl bg-background border text-foreground text-sm outline-none transition-all
  focus:ring-2 focus:ring-primary/40 focus:border-primary/60
  ${hasError ? "border-destructive" : "border-border/60"}
  ${disabled ? "opacity-60 cursor-not-allowed bg-muted" : ""}`;

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
  attachedBooks,
  booksTotal,
}: CheckoutModalProps) {
  const { profile, loading: profileLoading, error: profileError, refetch } = useUserProfile();
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    phone: "",
    schoolCollege: "",
    classLevel: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [includeBooks, setIncludeBooks] = useState(false);
  const [shipping, setShipping] = useState<ShippingFormData>({
    name: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<"name" | "phone" | "address", string>>>({});

  const isBookCheckout = type === "book";
  const hasAttachedBooks = !!attachedBooks?.length;
  const showShippingForm = isBookCheckout || includeBooks;

  useEffect(() => {
    if (profile) {
      const frameId = window.requestAnimationFrame(() => {
        setFormData(getProfileFormDefaults(profile));
      });

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }
  }, [profile]);

  useEffect(() => {
    if (isOpen && !profileLoading) {
      const frameId = window.requestAnimationFrame(() => {
        setFormData(getProfileFormDefaults(profile));
        setErrors({});
        setAgreedToTerms(false);
        setIncludeBooks(false);
        setShipping(getShippingDefaults(profile));
        setShippingErrors({});
      });

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }
  }, [isOpen, profile, profileLoading]);

  useEffect(() => {
    if (!showShippingForm) return;

    const defaults = getShippingDefaults(profile);
    setShipping((current) => ({
      name: current.name || defaults.name,
      phone: current.phone || defaults.phone,
      address: current.address || defaults.address,
      city: current.city,
      postcode: current.postcode,
    }));
  }, [showShippingForm, profile]);

  const isPhoneDisabled = (): boolean => {
    if (!profile) return false;
    if (profile.login_type === "phone") return true;
    if (profile.phone || profile.profile?.phone) return true;
    return false;
  };

  const validatePhone = (phone: string): boolean => {
    const d = phone.trim().replace(/\D/g, "");
    return d.length === 11 && d.startsWith("01") && /^01[3-9]\d{8}$/.test(d);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "নাম প্রয়োজন";
    if (!isPhoneDisabled()) {
      if (!formData.phone.trim()) newErrors.phone = "ফোন নম্বর প্রয়োজন";
      else if (!validatePhone(formData.phone.trim())) newErrors.phone = "১১ সংখ্যার ফোন নম্বর দিন (01XXXXXXXXX)";
    } else if (!formData.phone.trim()) {
      newErrors.phone = "ফোন নম্বর প্রয়োজন";
    }
    // A standalone book purchase has no course/class context to collect.
    if (!isBookCheckout) {
      if (!formData.schoolCollege.trim()) newErrors.schoolCollege = "স্কুল / কলেজ প্রয়োজন";
      if (!formData.classLevel) newErrors.classLevel = "ক্লাস বেছে নিন";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateShipping = (): boolean => {
    if (!showShippingForm) return true;
    const newErrors: Partial<Record<"name" | "phone" | "address", string>> = {};
    if (!shipping.name.trim()) newErrors.name = "নাম প্রয়োজন";
    if (!shipping.phone.trim()) newErrors.phone = "ফোন নম্বর প্রয়োজন";
    else if (!validatePhone(shipping.phone.trim())) newErrors.phone = "১১ সংখ্যার ফোন নম্বর দিন (01XXXXXXXXX)";
    if (!shipping.address.trim()) newErrors.address = "ঠিকানা প্রয়োজন";
    setShippingErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleShippingChange = (field: keyof ShippingFormData, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (shippingErrors[field as "name" | "phone" | "address"]) {
      setShippingErrors((prev) => { const n = { ...prev }; delete n[field as "name" | "phone" | "address"]; return n; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) { toast.error("অনুগ্রহ করে শর্তাবলী সম্মত হন"); return; }
    if (!validateForm()) { toast.error("অনুগ্রহ করে সকল তথ্য সঠিকভাবে পূরণ করুন"); return; }
    if (!validateShipping()) { toast.error("বই পাঠানোর জন্য সঠিক ঠিকানা দিন"); return; }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Authentication required"); setIsSubmitting(false); return; }
      const updateData: Record<string, string | null | undefined> = {
        name: formData.name.trim(),
        phone: isPhoneDisabled() ? undefined : formData.phone.trim(),
        ...(!isBookCheckout && {
          schoolCollege: formData.schoolCollege.trim(),
          classLevel: formData.classLevel,
        }),
      };
      if (!isPhoneDisabled() && formData.phone.trim()) updateData.phone = formData.phone.trim();
      const response = await axios.put(`${BACKEND_URL}/user/profile`, updateData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (response.data.success) {
        await refetch();
        onClose();
        const bookSelection: BookSelection | null = showShippingForm
          ? {
              include: true,
              shipping: {
                name: shipping.name.trim(),
                phone: shipping.phone.trim(),
                address: shipping.address.trim(),
                ...(shipping.city.trim() && { city: shipping.city.trim() }),
                ...(shipping.postcode.trim() && { postcode: shipping.postcode.trim() }),
              },
            }
          : null;
        onProceed(bookSelection);
      } else {
        throw new Error(response.data.error || "Failed to update profile");
      }
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError<{ error?: string; message?: string }>(error)
        ? error.response?.data?.error || error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : "Failed to update profile.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", minimumFractionDigits: 0 })
      .format(p)
      .replace("BDT", "৳");

  const canSubmit = agreedToTerms && !isSubmitting && !profileLoading;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        showCloseButton={false}
        className="w-[98vw] sm:w-[96vw] max-w-4xl max-h-[95vh] sm:max-h-[92vh] overflow-hidden p-0 rounded-xl sm:rounded-2xl border border-border/30 bg-background shadow-2xl"
        overlayClassName="backdrop-blur-sm"
      >
        <DialogTitle render={<div />} className="sr-only">
          {type === "book" ? "বই ক্রয় নিশ্চিত করো" : type === "bundle" ? "Combo ক্রয় নিশ্চিত করো" : "কোর্স ক্রয় নিশ্চিত করো"}
        </DialogTitle>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col lg:flex-row h-full max-h-[95vh] sm:max-h-[92vh]">

          {/* ─── LEFT PANEL — Order Summary ─── */}
          <div className="lg:w-[42%] flex-shrink-0 bg-[oklch(0.18_0.04_170)] text-white flex flex-col rounded-t-xl sm:rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none overflow-hidden max-h-[35vh] lg:max-h-none">

            {/* Header */}
            <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 lg:pt-8 pb-4 sm:pb-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold leading-tight">
                    {type === "book" ? "বই ক্রয় নিশ্চিত করো" : type === "bundle" ? "Combo ক্রয় নিশ্চিত করো" : "কোর্স ক্রয় নিশ্চিত করো"}
                  </p>
                  <p className="text-white/50 text-xs hidden sm:block">অনুগ্রহ করে আপনার তথ্য যাচাই করুন</p>
                </div>
              </div>
            </div>

            {/* Course/Bundle info */}
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 overflow-y-auto space-y-4 sm:space-y-6">
              {/* Item card */}
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                <p className="font-semibold text-white/90 text-sm leading-snug">{title}</p>
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{type === "bundle" && courseCount ? `${courseCount}টি কোর্স` : type === "book" ? "বই" : "কোর্স"}</span>
                  {originalPrice && (
                    <span className="line-through">{formatPrice(originalPrice)}</span>
                  )}
                </div>
                <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                  <span className="text-sm text-white/60 font-medium">মূল্য</span>
                  <span className="text-2xl font-black text-primary">{formatPrice(price)}</span>
                </div>
                {savings !== undefined && savings > 0 && (
                  <div className="bg-success/15 border border-success/30 rounded-lg px-3 py-2 flex items-center justify-between">
                    <span className="text-success text-xs font-semibold">সাশ্রয়</span>
                    <span className="text-success font-bold text-sm">
                      {formatPrice(savings)}{discountPercentage && ` (${discountPercentage})`}
                    </span>
                  </div>
                )}
                {includeBooks && !!booksTotal && (
                  <>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>বইয়ের মূল্য</span>
                      <span>{formatPrice(booksTotal)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                      <span className="text-sm text-white/60 font-medium">সর্বমোট</span>
                      <span className="text-2xl font-black text-primary">{formatPrice(price + booksTotal)}</span>
                    </div>
                  </>
                )}
              </div>

              {/* What you get */}
              {youGet && youGet.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">তুমি পাচ্ছো</p>
                  <ul className="space-y-2">
                    {youGet.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Owned course warning */}
              {ownedCoursesCount !== undefined && ownedCoursesCount > 0 && (
                <div className="bg-warning/10 border border-warning/30 rounded-xl p-3 flex items-start gap-2">
                  <svg className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-warning text-xs">সতর্কতা: তোমার কাছে ইতিমধ্যে {ownedCoursesCount}টি কোর্স আছে</p>
                </div>
              )}

              {/* Trust badges */}
              <div className="hidden sm:grid grid-cols-2 gap-2 pt-2">
                {[
                  { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", label: "নিরাপদ পেমেন্ট" },
                  { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "যাচাইকৃত কোর্স" },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.icon} />
                    </svg>
                    <span className="text-white/60 text-xs">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT PANEL — Form ─── */}
          <div className="flex-1 flex flex-col overflow-hidden rounded-b-xl sm:rounded-b-2xl lg:rounded-r-2xl lg:rounded-bl-none">

            {/* Form header */}
            <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-3 sm:pb-4 border-b border-border/20 flex-shrink-0">
              <p className="font-bold text-foreground text-sm sm:text-base">আপনার তথ্য পূরণ করুন</p>
              <p className="text-muted-foreground text-xs mt-0.5 hidden sm:block">পেমেন্টের আগে তথ্য যাচাই করা জরুরি</p>
            </div>

            {/* Scrollable form body */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit}>
                <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 space-y-3 sm:space-y-4">

                  {/* Status banners */}
                  {profileLoading && (
                    <div className="bg-info/10 border border-info/20 rounded-xl p-3 flex items-center gap-2">
                      <Spinner className="size-4 text-info" />
                      <p className="text-sm text-info">প্রোফাইল লোড হচ্ছে...</p>
                    </div>
                  )}
                  {!profileLoading && profileError && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3">
                      <p className="text-sm text-destructive">⚠️ প্রোফাইল লোড করতে সমস্যা হয়েছে।</p>
                    </div>
                  )}
                  <div className="bg-warning/10 border border-warning/20 rounded-xl p-3">
                    <p className="text-xs text-warning">⚠️ ফোন নম্বর ও ইমেইল ঠিকানা সম্পূর্ণ সঠিক কিনা নিশ্চিত করুন</p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-card/50 p-3 sm:p-4 space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">প্রোফাইল তথ্য</p>
                      <p className="text-xs text-muted-foreground">
                        অর্ডার সম্পন্ন করার জন্য প্রয়োজনীয় তথ্যগুলো দাও।
                      </p>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          নাম <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="আপনার পুরো নাম"
                          className={FIELD_CLASS(!!errors.name)}
                          required
                        />
                        {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          ফোন নম্বর <span className="text-destructive">*</span>
                          {isPhoneDisabled() && <span className="text-muted-foreground font-normal ml-1">(আপডেট করা যাবে না)</span>}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="01XXXXXXXXX"
                          disabled={isPhoneDisabled()}
                          className={FIELD_CLASS(!!errors.phone, isPhoneDisabled())}
                          required
                        />
                        {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {!isBookCheckout && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            স্কুল / কলেজ <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.schoolCollege}
                            onChange={(e) => handleInputChange("schoolCollege", e.target.value)}
                            placeholder="আপনার প্রতিষ্ঠান"
                            className={FIELD_CLASS(!!errors.schoolCollege)}
                            required
                          />
                          {errors.schoolCollege && <p className="text-destructive text-xs mt-1">{errors.schoolCollege}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            ক্লাস <span className="text-destructive">*</span>
                          </label>
                          <select
                            value={formData.classLevel}
                            onChange={(e) => handleInputChange("classLevel", e.target.value)}
                            className={FIELD_CLASS(!!errors.classLevel)}
                            required
                          >
                            <option value="">বেছে নিন</option>
                            <option value="JSC">JSC</option>
                            <option value="SSC">SSC</option>
                            <option value="HSC">HSC</option>
                          </select>
                          {errors.classLevel && <p className="text-destructive text-xs mt-1">{errors.classLevel}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Standalone book purchase: shipping is mandatory, no checkbox needed */}
                  {isBookCheckout && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 sm:p-4 space-y-3">
                      <p className="text-sm font-semibold text-foreground">বই পাঠানোর তথ্য</p>
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            নাম <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="text"
                            value={shipping.name}
                            onChange={(e) => handleShippingChange("name", e.target.value)}
                            placeholder="প্রাপকের নাম"
                            className={FIELD_CLASS(!!shippingErrors.name)}
                          />
                          {shippingErrors.name && <p className="text-destructive text-xs mt-1">{shippingErrors.name}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">
                            ফোন নম্বর <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="tel"
                            value={shipping.phone}
                            onChange={(e) => handleShippingChange("phone", e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className={FIELD_CLASS(!!shippingErrors.phone)}
                          />
                          {shippingErrors.phone && <p className="text-destructive text-xs mt-1">{shippingErrors.phone}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1.5">
                          ঠিকানা <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={shipping.address}
                          onChange={(e) => handleShippingChange("address", e.target.value)}
                          placeholder="বাড়ি/রোড/এলাকা"
                          className={FIELD_CLASS(!!shippingErrors.address)}
                        />
                        {shippingErrors.address && <p className="text-destructive text-xs mt-1">{shippingErrors.address}</p>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">শহর</label>
                          <input
                            type="text"
                            value={shipping.city}
                            onChange={(e) => handleShippingChange("city", e.target.value)}
                            placeholder="শহর"
                            className={FIELD_CLASS(false)}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-foreground mb-1.5">পোস্ট কোড</label>
                          <input
                            type="text"
                            value={shipping.postcode}
                            onChange={(e) => handleShippingChange("postcode", e.target.value)}
                            placeholder="পোস্ট কোড"
                            className={FIELD_CLASS(false)}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Books inclusion (course/bundle addon flow only) */}
                  {!isBookCheckout && hasAttachedBooks && (
                    <div
                      className={`rounded-xl border p-3 sm:p-4 space-y-3 transition-all ${
                        includeBooks
                          ? "border-primary/40 bg-primary/8 shadow-[0_12px_30px_rgba(16,185,129,0.10)]"
                          : "border-primary/20 bg-primary/5"
                      }`}
                    >
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            checked={includeBooks}
                            onChange={(e) => setIncludeBooks(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 rounded border-2 border-border peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                            {includeBooks && (
                              <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          বইসহ অর্ডার করতে চাও?
                          {typeof booksTotal === "number" && (
                            <span className="ml-1 text-xs font-medium text-muted-foreground">
                              (বইয়ের মূল্য {formatPrice(booksTotal)})
                            </span>
                          )}
                        </span>
                      </label>
                      <ul className="ml-8 space-y-1">
                        {attachedBooks!.map((book) => (
                          <li key={book.id} className="text-xs text-muted-foreground">
                            • {book.title}{typeof book.price === "number" && ` — ${formatPrice(book.price)}`}
                          </li>
                        ))}
                      </ul>

                      {includeBooks && (
                        <div className="space-y-3 pt-3 border-t border-primary/15 rounded-xl bg-background/60 px-3 py-3">
                          <p className="text-xs font-semibold text-foreground">বই পাঠানোর তথ্য</p>
                          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1.5">
                                নাম <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="text"
                                value={shipping.name}
                                onChange={(e) => handleShippingChange("name", e.target.value)}
                                placeholder="প্রাপকের নাম"
                                className={FIELD_CLASS(!!shippingErrors.name)}
                              />
                              {shippingErrors.name && <p className="text-destructive text-xs mt-1">{shippingErrors.name}</p>}
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1.5">
                                ফোন নম্বর <span className="text-destructive">*</span>
                              </label>
                              <input
                                type="tel"
                                value={shipping.phone}
                                onChange={(e) => handleShippingChange("phone", e.target.value)}
                                placeholder="01XXXXXXXXX"
                                className={FIELD_CLASS(!!shippingErrors.phone)}
                              />
                              {shippingErrors.phone && <p className="text-destructive text-xs mt-1">{shippingErrors.phone}</p>}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-foreground mb-1.5">
                              ঠিকানা <span className="text-destructive">*</span>
                            </label>
                            <input
                              type="text"
                              value={shipping.address}
                              onChange={(e) => handleShippingChange("address", e.target.value)}
                              placeholder="বাড়ি/রোড/এলাকা"
                              className={FIELD_CLASS(!!shippingErrors.address)}
                            />
                            {shippingErrors.address && <p className="text-destructive text-xs mt-1">{shippingErrors.address}</p>}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1.5">শহর</label>
                              <input
                                type="text"
                                value={shipping.city}
                                onChange={(e) => handleShippingChange("city", e.target.value)}
                                placeholder="শহর"
                                className={FIELD_CLASS(false)}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-foreground mb-1.5">পোস্ট কোড</label>
                              <input
                                type="text"
                                value={shipping.postcode}
                                onChange={(e) => handleShippingChange("postcode", e.target.value)}
                                placeholder="পোস্ট কোড"
                                className={FIELD_CLASS(false)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer group pt-1">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded border-2 border-border peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                        {agreedToTerms && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                      আমি{" "}
                      <a href="https://www.mathpro.org/terms-and-conditions" target="_blank" rel="noopener noreferrer"
                        className="text-primary hover:underline font-semibold" onClick={(e) => e.stopPropagation()}>
                        শর্তাবলী
                      </a>{" "}
                      এবং{" "}
                      <a href="https://www.mathpro.org/privacy-policy" target="_blank" rel="noopener noreferrer"
                        className="text-primary hover:underline font-semibold" onClick={(e) => e.stopPropagation()}>
                        গোপনীয়তা নীতি
                      </a>{" "}
                      সম্মত এবং বুঝতে পেরেছি যে {isBookCheckout ? "ক্রয়ের পর রিফান্ড করা যাবে না।" : "এটি একটি ডিজিটাল পণ্য এবং ক্রয়ের পর রিফান্ড করা যাবে না।"}
                    </span>
                  </label>
                </div>

                {/* Sticky action bar */}
                <div className="sticky bottom-0 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 border-t border-border/20 bg-background flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition-colors font-medium text-sm"
                  >
                    বাতিল করো
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      canSubmit
                        ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Spinner className="size-4" />
                        প্রসেস হচ্ছে...
                      </span>
                    ) : (
                      "পেমেন্ট করো →"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
