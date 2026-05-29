"use client";

import Nav from "@/components/Nav";
import { HindSiliguri, englishToBanglaNumbers } from "@/helpers";
import SEO from "@/components/SEO";
import Footer from "@/components/footer";
import { useContext, useEffect, useState, Fragment } from "react";
import { UserContext } from "@/Contexts/UserContext";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import { siteConfig } from "@/config/site.config";
import {
  BsBook,
  BsPlay,
  BsCheckCircle,
  BsBoxArrowUpRight,
  BsChevronDown,
  BsChevronUp,
} from "react-icons/bs";
import { MdOndemandVideo } from "react-icons/md";
import GradientButton from "@/components/GradientButton";
import { isLoggedIn } from "@/helpers";
import { jwtDecode } from "jwt-decode";
import { Dialog, Transition } from "@headlessui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  PriceBillboard,
  CommunitySupportSection,
} from "@/features/course-details/components";
import { useCountdown } from "@/hooks/useCountdown";
import CheckoutModal from "@/components/CheckoutModal";
import CouponInput from "@/components/CouponInput";
import type { CouponApplyResponse } from "@/services/couponService";

interface BundleCourse {
  id: number;
  title: string;
  price: number;
  url: string;
  short_description?: string;
  chips?: {
    sections?: {
      chapter?: { label: string; value: string };
      video?: { label: string; value: string };
    };
    course_thumbnail_link?: string; // Old field (backward compatibility)
    thumbnails?: {
      course_thumbnail_link_16_9?: string;
      trailer_video_thumb_16_9?: string;
      facebook_community_thumb_16_9?: string;
    };
    course_outline?: string;
  };
}

const settings = {
  dots: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  infinite: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 700,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

interface Bundle {
  id: number;
  title: string;
  price: number;
  url: string;
  short_description?: string;
  purchased?: boolean;
  purchase_date?: number;
  transaction_id?: string;
  courses: BundleCourse[];
  course_count: number;
  owned_courses?: number[];
  is_live?: boolean;
  prebooking?: number;
  enrolled?: number;
  intro_video?: string;
  you_get?: {
    you_get?: string;
  };
  chips?: {
    slider_images?: string[];
    sections?: {
      chapter?: { label: string; value: string };
      video?: { label: string; value: string };
      liveClass?: { label: string; value: string };
      codingProblem?: { label: string; value: string };
    };
    enrollment?: {
      prebooking_start?: { label: string; value: string };
      prebooking_end?: { label: string; value: string };
      enrollment_start?: { label: string; value: string };
      enrollment_end?: { label: string; value: string };
      classStart?: { label: string; value: string };
      classTime?: { label: string; value: string };
    };
    thumbnails?: {
      bundle_thumb_16_9?: string;
      bundle_thumb_4_3?: string;
      trailer_video_thumb_16_9?: string;
      trailer_video_thumb_4_3?: string;
      facebook_community_thumb_16_9?: string;
    };
    image_slider?: {
      image_1_16_9?: string;
      image_1_4_3?: string;
      image_2_16_9?: string;
      image_2_4_3?: string;
      image_3_16_9?: string;
      image_3_4_3?: string;
      image_4_16_9?: string;
      image_4_4_3?: string;
    };
    socials?: {
      facebook_community?: string;
      facebook_page?: string;
      whatsapp?: string;
      messenger?: string;
      phone?: string;
      email?: string;
    };
  };
  feedback_list?: {
    feedbacks?: Array<{
      description: string;
      name: string;
      bio: string;
      imageUploadedLink?: string;
    }>;
  };
  faq_list?: {
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
  };
  socials?: {
    whatsapp?: string;
  };
}

export default function BundleDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const bundleid = params?.id;
  const [user, setUser] = useContext<any>(UserContext);
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Smart countdown using hook (replaces old manual countdown logic)
  const { days, hours, minutes, seconds } = useCountdown(
    undefined, // No old deadline structure for bundles
    {
      prebooking_end:
        typeof bundle?.chips?.enrollment?.prebooking_end?.value === "string"
          ? bundle.chips.enrollment.prebooking_end.value
          : undefined,
      enrollment_end:
        typeof bundle?.chips?.enrollment?.enrollment_end?.value === "string"
          ? bundle.chips.enrollment.enrollment_end.value
          : undefined,
    },
    bundle?.is_live, // Pass is_live status to determine which deadline to use
  );

  // Coupon state
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(
    null,
  );
  const [discountInfo, setDiscountInfo] = useState<
    CouponApplyResponse["data"] | null
  >(null);
  const [userId, setUserId] = useState<number | undefined>(undefined);

  // Get user ID from token
  useEffect(() => {
    if (isLoggedIn()) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          const id =
            decodedToken.id || decodedToken.user_id || decodedToken.sub;
          if (id) {
            setUserId(parseInt(id.toString()));
          }
        } catch {
          // Token decode failed, userId remains unset
        }
      }
    }
  }, []);

  // Clear coupon state when bundle changes (edge case fix)
  useEffect(() => {
    if (bundleid) {
      setAppliedCouponCode(null);
      setDiscountInfo(null);
    }
  }, [bundleid]);

  // Edge case: Clear coupon if bundle price changes (safety measure)
  useEffect(() => {
    if (bundle?.price && discountInfo) {
      // If the bundle price changed from what we calculated discount for, clear coupon
      // This ensures discount is always calculated with current price
      if (Math.abs(discountInfo.original_price - bundle.price) > 0.01) {
        setAppliedCouponCode(null);
        setDiscountInfo(null);
      }
    }
  }, [bundle?.price, discountInfo]);

  // Auto-apply coupon from URL parameter (Ambassador Program)
  useEffect(() => {
    const couponFromUrl = searchParams.get("coupon") || undefined;
    
    if (
      couponFromUrl &&
      !appliedCouponCode &&
      bundle?.id &&
      bundle?.price &&
      !bundle.purchased &&
      bundle.is_live === true
    ) {
      // Auto-apply the coupon
      const autoApplyCoupon = async () => {
        try {
          // Import the coupon service functions
          const { validateCoupon, applyCoupon } = await import('@/services/couponService');

          // Validate coupon
          const validation = await validateCoupon(
            couponFromUrl,
            undefined,
            bundle.id,
            userId
          );

          if (!validation.valid) {
            toast.error(validation.error || 'Invalid coupon code');
            return;
          }

          // Apply coupon
          const applyResult = await applyCoupon(
            couponFromUrl,
            bundle.price,
            undefined,
            bundle.id,
            userId
          );

          if (applyResult.success && applyResult.data) {
            setAppliedCouponCode(couponFromUrl.toUpperCase());
            setDiscountInfo(applyResult.data);
            toast.success(`Coupon ${couponFromUrl.toUpperCase()} applied successfully! 🎉`);
          } else {
            toast.error(applyResult.error || 'Failed to apply coupon');
          }
        } catch (error: any) {
          console.error('Error auto-applying coupon:', error);
          toast.error('Failed to apply coupon automatically');
        }
      };

      autoApplyCoupon();
    }
  }, [
    searchParams,
    appliedCouponCode,
    bundle?.id,
    bundle?.price,
    bundle?.purchased,
    bundle?.is_live,
    userId,
  ]);

  // Purchase confirmation modal states
  const [openPurchaseConfirmModal, setOpenPurchaseConfirmModal] =
    useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [openCheckoutModal, setOpenCheckoutModal] = useState(false);

  // Prebook modal states for purchase button
  const [openPrebookPurchaseModal, setOpenPrebookPurchaseModal] =
    useState(false);
  const [openPrebookSuccessModal, setOpenPrebookSuccessModal] = useState(false);
  const [prebookPurchaseData, setPrebookPurchaseData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [prebookPurchaseLoading, setPrebookPurchaseLoading] = useState(false);

  // Helper function to convert English numbers to Bengali
  const toBengaliNumber = (num: number): string => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((digit) => bengaliDigits[parseInt(digit)] || digit)
      .join("");
  };

  // Helper function to convert date to Bengali format (e.g., "২৫ নভেম্বর")
  const formatDateToBengali = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const monthNames = [
        "জানুয়ারি",
        "ফেব্রুয়ারি",
        "মার্চ",
        "এপ্রিল",
        "মে",
        "জুন",
        "জুলাই",
        "আগস্ট",
        "সেপ্টেম্বর",
        "অক্টোবর",
        "নভেম্বর",
        "ডিসেম্বর",
      ];
      const month = monthNames[date.getMonth()];
      return `${toBengaliNumber(day)} ${month}`;
    } catch (error) {
      return dateString;
    }
  };

  // Helper function to convert time to Bengali format (e.g., "রাত ৯:১৫")
  const formatTimeToBengali = (timeString: string): string => {
    try {
      // Handle time format like "T21:15:00" or "21:15:00"
      let timeOnly = timeString;
      if (timeString.startsWith("T")) {
        timeOnly = timeString.substring(1);
      }

      const [hours, minutes] = timeOnly
        .split(":")
        .map((part) => parseInt(part));

      // Convert to 12-hour format
      let hour12 = hours % 12;
      if (hour12 === 0) hour12 = 12;

      // Determine period (সকাল for AM, রাত for PM)
      const period = hours < 12 ? "সকাল" : "রাত";

      // Format with Bengali numbers
      const bengaliHour = toBengaliNumber(hour12);
      const bengaliMinutes = toBengaliNumber(minutes);

      return `${period} ${bengaliHour}:${bengaliMinutes}`;
    } catch (error) {
      return timeString;
    }
  };

  // Prebook states
  const [openPrebookModal, setOpenPrebookModal] = useState(false);
  const [prebookButtonLoading, setPrebookButtonLoading] = useState(false);
  const [hasPrebooked, setHasPrebooked] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [prebookingData, setPrebookingData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Course description expanded state
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(
    new Set(),
  );

  // Slider states
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
      /youtube\.com\/watch\?.*v=([^&]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Helper function to get YouTube thumbnail URL
  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;

    // Use maxresdefault for highest quality, fallback to hqdefault if not available
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  useEffect(() => {
    if (bundleid) {
      fetchBundle();
      checkPrebookStatus();
    }
  }, [bundleid]);

  // Check prebook status on mount
  const checkPrebookStatus = async () => {
    if (!bundleid) return;

    // Check localStorage first (for guest users)
    const localStorageKey = `bundle_${bundleid}_prebooked`;
    const localPrebook = localStorage.getItem(localStorageKey);

    if (localPrebook === "true") {
      setHasPrebooked(true);
      return;
    }

    // If logged in, check via API
    if (isLoggedIn()) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decodedToken: any = jwtDecode(token);
        const userId =
          decodedToken.id || decodedToken.user_id || decodedToken.sub;

        if (!userId) return;

        const response = await axios.get(
          `${BACKEND_URL}/user/bundle/${bundleid}/check-prebook/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data.success && response.data.data.prebooked) {
          setHasPrebooked(true);
          // Also save to localStorage for consistency
          localStorage.setItem(localStorageKey, "true");
        }
      } catch (error) {
        console.error("Error checking prebook status:", error);
      }
    }
  };

  // Countdown timer is now handled by useCountdown hook above

  // Autoplay slider
  useEffect(() => {
    if (!bundle || isDragging) return;

    const slides: any[] = [];

    // Count video first
    if (bundle.intro_video) {
      slides.push("video");
    }

    // Then count slider images from image_slider object
    if (bundle.chips?.image_slider) {
      const imageSlider = bundle.chips.image_slider;
      if (imageSlider.image_1_16_9 || imageSlider.image_1_4_3) slides.push(1);
      if (imageSlider.image_2_16_9 || imageSlider.image_2_4_3) slides.push(2);
      if (imageSlider.image_3_16_9 || imageSlider.image_3_4_3) slides.push(3);
      if (imageSlider.image_4_16_9 || imageSlider.image_4_4_3) slides.push(4);
    }

    if (slides.length <= 1 || isVideoPlaying) return;

    const autoplayInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(autoplayInterval);
  }, [bundle, currentSlide, isVideoPlaying, isDragging]);

  const fetchBundle = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let requestConfig: any = {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };

      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          const userId =
            decodedToken.id || decodedToken.user_id || decodedToken.sub;

          if (userId) {
            requestConfig.data = { user_id: parseInt(userId.toString()) };
          }
        } catch {
          // Token decode failed, request proceeds without user_id
        }
      }

      const response = await axios.get(
        `${BACKEND_URL}/user/bundle/${bundleid}`,
        requestConfig,
      );

      if (response.data.success && response.data.data.length > 0) {
        const bundleData = response.data.data[0];
        setBundle(bundleData);
      } else {
        setError("Bundle not found");
        toast.error("Bundle not found");
      }
    } catch (error: any) {
      console.error("Error fetching bundle:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch bundle details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = () => {
    if (!isLoggedIn()) {
      const currentDomain = window.location.href;
      window.location.href = `https://www.codervai.com/auth/login?redirect=${encodeURIComponent(currentDomain)}`;
      return;
    }

    // Open checkout modal (replaces old purchase confirmation modal)
    setOpenCheckoutModal(true);
  };

  const handlePurchase = async () => {
    try {
      setPurchaseLoading(true);
      const token = localStorage.getItem("token");

      if (!token || !bundle) {
        toast.error("Authentication required");
        return;
      }

      const decodedToken: any = jwtDecode(token);
      const userId =
        decodedToken.id || decodedToken.user_id || decodedToken.sub;

      // Prepare request body
      const requestBody: any = {
        eventId: bundle.price * 6251,
        user_id: parseInt(userId.toString()),
      };

      // Add coupon code if applied
      if (appliedCouponCode && appliedCouponCode.trim()) {
        requestBody.coupon_code = appliedCouponCode.trim();
      }

      // Ensure bundleid is a number (edge case fix)
      let bundleIdNum: number;
      if (Array.isArray(bundleid)) {
        bundleIdNum = parseInt(bundleid[0] || "0");
      } else if (typeof bundleid === "string") {
        bundleIdNum = parseInt(bundleid);
      } else {
        bundleIdNum = bundleid || 0;
      }

      if (!bundleIdNum || isNaN(bundleIdNum) || bundleIdNum <= 0) {
        toast.error("Invalid bundle ID");
        setPurchaseLoading(false);
        return;
      }

      const response = await axios.post(
        `${BACKEND_URL}/user/payment/initiate-for-bundle/${bundleIdNum}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        // Show success message if coupon was applied (before redirect)
        if (response.data.coupon_applied && appliedCouponCode) {
          toast.success(
            `Coupon applied! Saved ৳${response.data.discount_amount || 0}`,
            { duration: 2000 },
          );
        }
        // Small delay to show toast before redirect
        setTimeout(
          () => {
            window.location.href = response.data.data;
          },
          response.data.coupon_applied ? 500 : 0,
        );
      } else {
        const errorMessage =
          response.data.error || "Failed to initiate payment";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error initiating payment:", error);
      toast.error(error.response?.data?.error || "Failed to initiate payment");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handleCouponApplied = (discountData: CouponApplyResponse["data"]) => {
    setDiscountInfo(discountData);
    if (discountData?.coupon?.code) {
      setAppliedCouponCode(discountData.coupon.code);
    }
  };

  const handleCouponRemoved = () => {
    setAppliedCouponCode(null);
    setDiscountInfo(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("BDT", "৳");
  };

  const calculateTotalOriginalPrice = () => {
    return (
      bundle?.courses.reduce((total, course) => total + course.price, 0) || 0
    );
  };

  const calculateSavings = () => {
    const originalTotal = calculateTotalOriginalPrice();
    return originalTotal - (bundle?.price || 0);
  };

  const calculateDiscountPercentage = () => {
    const originalTotal = calculateTotalOriginalPrice();
    const savings = calculateSavings();
    return Math.round((savings / originalTotal) * 100);
  };

  // Prebook bundle function for purchase button
  const prebookBundlePurchase = async () => {
    // Validate form data
    if (
      !prebookPurchaseData.name ||
      !prebookPurchaseData.email ||
      !prebookPurchaseData.phone
    ) {
      toast.error("অনুগ্রহ করে সকল তথ্য পূরণ করুন");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(prebookPurchaseData.email)) {
      toast.error("সঠিক ইমেইল ঠিকানা দিন");
      return;
    }

    // Basic phone validation (Bangladesh format)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(prebookPurchaseData.phone)) {
      toast.error("সঠিক ফোন নাম্বার দিন (01XXXXXXXXX)");
      return;
    }

    setPrebookPurchaseLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/user/course/prebookBundle/${bundleid}`,
        {
          ...prebookPurchaseData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      if (response.data.success) {
        // Close prebook modal
        setOpenPrebookPurchaseModal(false);

        // Show success modal
        setOpenPrebookSuccessModal(true);

        // Update prebook status
        setHasPrebooked(true);

        // Save to localStorage
        const localStorageKey = `bundle_${bundleid}_prebooked`;
        localStorage.setItem(localStorageKey, "true");

        // Clear form data
        setPrebookPurchaseData({
          name: "",
          email: "",
          phone: "",
        });
      }
    } catch (error: any) {
      console.error("Error prebooking bundle:", error);
      // Handle new error format (error.response?.data?.error as string)
      // Also support old format (error.response?.data?.message) for backward compatibility
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "প্রিবুক করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      toast.error(errorMessage);
    } finally {
      setPrebookPurchaseLoading(false);
    }
  };

  // Prebook bundle function
  const prebookBundle = async () => {
    // Validate form data
    if (
      !prebookingData.name ||
      !prebookingData.email ||
      !prebookingData.phone
    ) {
      toast.error("অনুগ্রহ করে সকল তথ্য পূরণ করুন");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(prebookingData.email)) {
      toast.error("সঠিক ইমেইল ঠিকানা দিন");
      return;
    }

    // Basic phone validation (Bangladesh format)
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(prebookingData.phone)) {
      toast.error("সঠিক ফোন নাম্বার দিন (01XXXXXXXXX)");
      return;
    }

    setPrebookButtonLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URL}/user/course/prebookBundle/${bundleid}`,
        {
          ...prebookingData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        },
      );

      if (response.data.success) {
        // Close modal
        setOpenPrebookModal(false);

        // Show success toast
        toast.success("Bundle সফলভাবে প্রিবুক করা হয়েছে!");

        // Update prebook status
        setHasPrebooked(true);

        // Save to localStorage
        const localStorageKey = `bundle_${bundleid}_prebooked`;
        localStorage.setItem(localStorageKey, "true");

        // Clear form data
        setPrebookingData({
          name: "",
          email: "",
          phone: "",
        });
      }
    } catch (error: any) {
      console.error("Error prebooking bundle:", error);
      // Handle new error format (error.response?.data?.error as string)
      // Also support old format (error.response?.data?.message) for backward compatibility
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "প্রিবুক করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
      toast.error(errorMessage);
    } finally {
      setPrebookButtonLoading(false);
    }
  };

  // Helper function to render text with clickable links
  const renderInstructionWithLinks = (text: string) => {
    // Regex to match URLs (http, https, or www) - improved to handle URLs at end of line
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const parts: string[] = [];
    let lastIndex = 0;
    let match;

    // Use exec to properly handle global regex
    while ((match = urlRegex.exec(text)) !== null) {
      // Add text before the URL
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Add the URL
      parts.push(match[0]);
      lastIndex = urlRegex.lastIndex;
    }
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // If no URLs found, return original text
    if (parts.length === 0) {
      return <span>{text}</span>;
    }

    return parts.map((part, index) => {
      // Check if this part is a URL
      const isUrl = /^(https?:\/\/|www\.)/.test(part);

      if (isUrl) {
        // Normalize URL (add https if missing)
        const url = part.startsWith("http") ? part : `https://${part}`;
        // Check if it's an internal link (course-details)
        const isInternal = url.includes("courses.codervai.com/course-details/");

        if (isInternal) {
          // Extract course ID from URL
          const courseIdMatch = url.match(/course-details\/(\d+)/);
          const courseId = courseIdMatch ? courseIdMatch[1] : null;

          if (courseId) {
            return (
              <Link
                key={index}
                href={`/course-details/${courseId}`}
                className="text-teal hover:text-teal/80 underline font-semibold"
              >
                {part}
              </Link>
            );
          }
        }

        // External link
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:text-teal/80 underline font-semibold"
          >
            {part}
          </a>
        );
      }

      // Regular text
      return <span key={index}>{part}</span>;
    });
  };

  // Hardcoded instructions (will be from DB later)
  const instructions = [
    "আমাদের Bundle এ তোমার আগ্রহ দেখে আমরা অত্যন্ত খুশী! 🔥",
    "আমাদের বান্ডেলের কোর্স ফ্রিতে দেখতে হলে তোমাকে প্রতি কোর্সের ডিটেইলস পেইজে যাও:",
    "Strucutured Programming Language (SPL): https://courses.codervai.com/course-details/11",
    "Discrete Mathematics (DM): https://courses.codervai.com/course-details/10",
    "Data Structure and Algorithm I (DSA I): https://courses.codervai.com/course-details/13",
    "Object Oriented Programming (OOP): https://courses.codervai.com/course-details/12",
    "কোর্সের স্টাডি প্ল্যান এর নিচে তুমি নির্দিষ্ট চ্যাপ্টারের Free Preview এ ক্লিক করলে ফ্রি তে মডিউল টি দেখতে পারবে!",
    "যেকোনো সমস্যার জন্য আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করো।",
  ];

  if (loading) {
    return (
      <div className={`${HindSiliguri.variable} font-hind overflow-x-hidden`}>
        <SEO
          title="Bundle Details - CoderVai"
          description="Explore course bundles at CoderVai"
          path={`/bundle/${bundleid}`}
        />
        <Nav />
        <div className="min-h-screen bg-white dark:bg-[#0B060D] flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="mt-4 text-paragraph dark:text-darkParagraph">
              Bundle লোড হচ্ছে...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className={`${HindSiliguri.variable} font-hind overflow-x-hidden`}>
        <SEO
          title="Bundle Not Found - CoderVai"
          description="The requested bundle could not be found. Explore other course bundles at CoderVai."
          path={`/bundle/${bundleid}`}
        />
        <Nav />
        <div className="min-h-screen bg-white dark:bg-[#0B060D] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Link href="/courses">
              <button className="bg-purple text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                কোর্সে ফিরে যান
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`${HindSiliguri.variable} font-hind overflow-x-hidden`}>
      <SEO
        title={bundle?.title || (error ? "Bundle Not Found" : "Bundle Details")}
        description={
          bundle?.short_description ||
          (error
            ? "The requested bundle could not be found. Explore other course bundles at CoderVai."
            : `Get access to ${bundle?.course_count || "multiple"} courses in this comprehensive bundle at CoderVai.`)
        }
        path={`/bundle/${bundleid}`}
        image={
          bundle?.chips?.thumbnails?.bundle_thumb_16_9 ||
          bundle?.chips?.thumbnails?.bundle_thumb_4_3
        }
      />
      <Nav />
      <Toaster />

      {/* Prebook Modal */}
      <Transition appear show={openPrebookModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          style={{ zIndex: 99999 }}
          onClose={() => setOpenPrebookModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md lg:max-w-lg text-darkHeading transform overflow-hidden rounded-2xl bg-[#B2F100]/5 dark:bg-[#B2F100]/5 backdrop-blur-lg border border-[#B2F100]/60 text-left align-middle shadow-xl transition-all">
                  {/* Close Button */}
                  <button
                    onClick={() => setOpenPrebookModal(false)}
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

                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 p-6"
                  >
                    <div className="flex items-center flex-col lg:flex-row">
                      <div>
                        <p className="text-heading dark:text-darkHeading text-xl text-center lg:text-left">
                          {bundle?.title}
                        </p>
                        <p className="text-paragraph dark:text-darkParagraph mt-2 text-base text-center lg:text-left">
                          খুব শীঘ্রই আসছে আমাদের এই Bundle! Bundle সম্বন্ধে আগাম
                          জেনে রাখার জন্য এখনি নিচে দেওয়া ফর্ম ফিল আপ করো!
                        </p>
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="border-b border-t border-black/20 dark:border-gray-300/20 py-8 px-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-6">
                      <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base lg:flex-1">
                        First Name
                      </p>
                      <input
                        value={prebookingData.name}
                        placeholder="CoderVai"
                        onChange={(e) => {
                          setPrebookingData({
                            ...prebookingData,
                            name: e.target.value,
                          });
                        }}
                        className="w-full bg-white/0 border lg:flex-[2] border-gray-500 dark:border-gray-200/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
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
                        onChange={(e) => {
                          setPrebookingData({
                            ...prebookingData,
                            phone: e.target.value,
                          });
                        }}
                        className="w-full bg-white/0 border lg:flex-[2] border-gray-500 dark:border-gray-200/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
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
                        onChange={(e) => {
                          setPrebookingData({
                            ...prebookingData,
                            email: e.target.value,
                          });
                        }}
                        className="w-full bg-white/0 border lg:flex-[2] border-gray-500 dark:border-gray-200/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex p-6 gap-4">
                    <button
                      onClick={() => setOpenPrebookModal(false)}
                      className="bg-[#fcfcfc0c] hover:bg-opacity-50 ease-in-out duration-150 border border-white/30 backdrop-blur-lg text-darkHeading py-3 w-full rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                    <GradientButton
                      loading={prebookButtonLoading}
                      gradientStyle="linear-gradient(91deg, #4B6404 0%, #7BA502 50.98%, #A9E400 100%)"
                      label="Prebook"
                      type="button"
                      callBackFunction={prebookBundle}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Prebook Modal for Purchase Button */}
      <Transition appear show={openPrebookPurchaseModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          style={{ zIndex: 99999 }}
          onClose={() => setOpenPrebookPurchaseModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md lg:max-w-lg text-darkHeading transform overflow-hidden rounded-2xl bg-[#B2F100]/5 dark:bg-[#B2F100]/5 backdrop-blur-lg border border-[#B2F100]/60 text-left align-middle shadow-xl transition-all">
                  {/* Close Button */}
                  <button
                    onClick={() => setOpenPrebookPurchaseModal(false)}
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

                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 p-6"
                  >
                    <div className="flex items-center flex-col lg:flex-row">
                      <div>
                        <p className="text-heading dark:text-darkHeading text-xl text-center lg:text-left">
                          {bundle?.title}
                        </p>
                        <p className="text-paragraph dark:text-darkParagraph mt-2 text-base text-center lg:text-left">
                          খুব শীঘ্রই আসছে আমাদের এই Bundle! Bundle সম্বন্ধে আগাম
                          জেনে রাখার জন্য এখনি নিচে দেওয়া ফর্ম ফিল আপ করো!
                        </p>
                      </div>
                    </div>
                  </Dialog.Title>
                  <div className="border-b border-t border-black/20 dark:border-gray-300/20 py-8 px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-2 mb-6">
                      <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base font-xl flex-1">
                        First Name
                      </p>
                      <input
                        value={prebookPurchaseData.name}
                        placeholder="CoderVai"
                        onChange={(e) => {
                          setPrebookPurchaseData({
                            ...prebookPurchaseData,
                            name: e.target.value,
                          });
                        }}
                        className="w-full bg-white/0 border flex-[2] border-gray-500 dark:border-gray-200/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-2 mb-6">
                      <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base font-xl flex-1">
                        Phone Number
                      </p>
                      <input
                        type="number"
                        value={prebookPurchaseData.phone}
                        placeholder="01xxxxxxxxx"
                        onChange={(e) => {
                          setPrebookPurchaseData({
                            ...prebookPurchaseData,
                            phone: e.target.value,
                          });
                        }}
                        className="w-full bg-white/0 border flex-[2] border-gray-500 dark:border-gray-200/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-2">
                      <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base font-xl flex-1">
                        Email
                      </p>
                      <input
                        type="email"
                        value={prebookPurchaseData.email}
                        placeholder="support@codervai.com"
                        onChange={(e) => {
                          setPrebookPurchaseData({
                            ...prebookPurchaseData,
                            email: e.target.value,
                          });
                        }}
                        className="w-full bg-white/0 border flex-[2] border-gray-500 dark:border-gray-200/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex p-6 gap-4">
                    <button
                      onClick={() => {
                        setOpenPrebookPurchaseModal(false);
                      }}
                      className="bg-[#fcfcfc0c] hover:bg-opacity-50 ease-in-out duration-150 border border-white/30 backdrop-blur-lg text-darkHeading py-3 w-full rounded-xl font-bold"
                    >
                      Cancel
                    </button>
                    <GradientButton
                      loading={prebookPurchaseLoading}
                      gradientStyle="linear-gradient(91deg, #4B6404 0%, #7BA502 50.98%, #A9E400 100%)"
                      label="Prebook"
                      type="button"
                      callBackFunction={prebookBundlePurchase}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Prebook Success Modal - Compact Version */}
      <Transition appear show={openPrebookSuccessModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative"
          style={{ zIndex: 99999 }}
          onClose={() => setOpenPrebookSuccessModal(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md text-darkHeading transform overflow-hidden rounded-2xl bg-[#B2F100]/5 dark:bg-[#B2F100]/5 backdrop-blur-lg border border-[#B2F100]/60 text-left align-middle shadow-xl transition-all">
                  {/* Close Button */}
                  <button
                    onClick={() => setOpenPrebookSuccessModal(false)}
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

                  <Dialog.Title
                    as="div"
                    className="text-lg font-medium leading-6 p-6 pb-4"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-heading dark:text-darkHeading text-lg font-bold">
                          Congratulations! 🎉
                        </p>
                        <p className="text-paragraph dark:text-darkParagraph text-sm">
                          তোমার প্রিবুক সফল হয়েছে
                        </p>
                      </div>
                    </div>
                  </Dialog.Title>

                  <div className="px-6 pb-6">
                    <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-[#B2F100]/20">
                      <ul className="space-y-2">
                        {instructions.map((instruction, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-paragraph dark:text-darkParagraph text-sm"
                          >
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#B2F100]/30 flex items-center justify-center text-xs font-bold text-[#4B6404] dark:text-[#B2F100]">
                              {index + 1}
                            </span>
                            <p className="flex-1 leading-relaxed">
                              {renderInstructionWithLinks(instruction)}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Checkout Modal - Replaces old purchase confirmation modal */}
      {bundle && (
        <CheckoutModal
          isOpen={openCheckoutModal}
          onClose={() => {
            // Don't clear coupon when modal is closed - user might reopen
            setOpenCheckoutModal(false);
          }}
          onProceed={handlePurchase}
          type="bundle"
          title={bundle.title}
          price={discountInfo?.final_price ?? bundle.price}
          originalPrice={calculateTotalOriginalPrice()}
          courseCount={bundle.course_count}
          savings={
            discountInfo
              ? discountInfo.original_price - discountInfo.final_price
              : calculateSavings()
          }
          discountPercentage={
            discountInfo
              ? `${Math.round(
                  (discountInfo.discount_amount / discountInfo.original_price) *
                    100,
                )}%`
              : `${calculateDiscountPercentage()}%`
          }
          ownedCoursesCount={bundle.owned_courses?.length}
          youGet={bundle.you_get?.you_get
            ?.split(",")
            .map((item) => item.trim())}
        />
      )}

      {/* Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <svg
          viewBox="0 0 980 892"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -top-[200px] -left-[200px] w-full h-full opacity-20"
        >
          <g filter="url(#filter0_f_261_7530)">
            <ellipse
              cx="314.306"
              cy="293.812"
              rx="167.107"
              ry="94.0796"
              transform="rotate(-10.6934 314.306 293.812)"
              fill="#B153E0"
            />
          </g>
          <defs>
            <filter
              id="filter0_f_261_7530"
              x="0.158203"
              y="0.158203"
              width="628.295"
              height="587.308"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feGaussianBlur
                stdDeviation="75"
                result="effect1_foregroundBlur_261_7530"
              />
            </filter>
          </defs>
        </svg>
      </div>

      <main className="relative z-10 pt-20 bg-white dark:bg-[#0B060D] min-h-screen overflow-x-hidden">
        <div className="w-[90%] lg:w-[90%] max-w-[1440px] mx-auto py-12">
          {/* Image/Video Slider - Shows at top on all devices */}
          <div className="mb-8">
            {(() => {
              const slides: Array<{
                type: "image" | "video";
                src: string;
                srcMobile?: string;
                thumbnail?: string;
              }> = [];

              // Add intro video FIRST if it exists
              if (bundle.intro_video) {
                const youtubeThumbnail = getYouTubeThumbnail(
                  bundle.intro_video,
                );
                slides.push({
                  type: "video",
                  src:
                    bundle.intro_video +
                    "?rel=0&modestbranding=1&showinfo=0&autoplay=1&controls=1&playsinline=1",
                  thumbnail: youtubeThumbnail || undefined,
                });
              }

              // Add bundle thumbnail as SECOND slide (16:9 for web, 4:3 for mobile)
              if (
                bundle.chips?.thumbnails?.bundle_thumb_16_9 ||
                bundle.chips?.thumbnails?.bundle_thumb_4_3
              ) {
                slides.push({
                  type: "image",
                  src:
                    bundle.chips.thumbnails.bundle_thumb_16_9 ||
                    bundle.chips.thumbnails.bundle_thumb_4_3 ||
                    "",
                  srcMobile:
                    bundle.chips.thumbnails.bundle_thumb_4_3 ||
                    bundle.chips.thumbnails.bundle_thumb_16_9 ||
                    "",
                });
              }

              // Then add slider images from image_slider object
              if (bundle.chips?.image_slider) {
                const imageSlider = bundle.chips.image_slider;
                // 16:9 for web (src), 4:3 for mobile (srcMobile)
                if (imageSlider.image_1_16_9 || imageSlider.image_1_4_3) {
                  slides.push({
                    type: "image",
                    src:
                      imageSlider.image_1_16_9 || imageSlider.image_1_4_3 || "",
                    srcMobile:
                      imageSlider.image_1_4_3 || imageSlider.image_1_16_9 || "",
                  });
                }
                if (imageSlider.image_2_16_9 || imageSlider.image_2_4_3) {
                  slides.push({
                    type: "image",
                    src:
                      imageSlider.image_2_16_9 || imageSlider.image_2_4_3 || "",
                    srcMobile:
                      imageSlider.image_2_4_3 || imageSlider.image_2_16_9 || "",
                  });
                }
                if (imageSlider.image_3_16_9 || imageSlider.image_3_4_3) {
                  slides.push({
                    type: "image",
                    src:
                      imageSlider.image_3_16_9 || imageSlider.image_3_4_3 || "",
                    srcMobile:
                      imageSlider.image_3_4_3 || imageSlider.image_3_16_9 || "",
                  });
                }
                if (imageSlider.image_4_16_9 || imageSlider.image_4_4_3) {
                  slides.push({
                    type: "image",
                    src:
                      imageSlider.image_4_16_9 || imageSlider.image_4_4_3 || "",
                    srcMobile:
                      imageSlider.image_4_4_3 || imageSlider.image_4_16_9 || "",
                  });
                }
              }

              // Fallback: If no slides yet, show bundle thumbnail as the only slide
              if (
                slides.length === 0 &&
                (bundle.chips?.thumbnails?.bundle_thumb_16_9 ||
                  bundle.chips?.thumbnails?.bundle_thumb_4_3)
              ) {
                slides.push({
                  type: "image",
                  src:
                    bundle.chips.thumbnails.bundle_thumb_16_9 ||
                    bundle.chips.thumbnails.bundle_thumb_4_3 ||
                    "",
                  srcMobile:
                    bundle.chips.thumbnails.bundle_thumb_4_3 ||
                    bundle.chips.thumbnails.bundle_thumb_16_9 ||
                    "",
                });
              }

              if (slides.length === 0) return null;

              const handleDragStart = (clientX: number) => {
                setIsDragging(true);
                setStartX(clientX);
              };

              const handleDragMove = (clientX: number) => {
                if (!isDragging) return;
                const diff = clientX - startX;
                setTranslateX(diff);
              };

              const handleDragEnd = () => {
                if (!isDragging) return;
                setIsDragging(false);

                // If dragged more than 50px, change slide
                if (translateX > 50 && currentSlide > 0) {
                  setIsVideoPlaying(false);
                  setCurrentSlide(currentSlide - 1);
                } else if (
                  translateX < -50 &&
                  currentSlide < slides.length - 1
                ) {
                  setIsVideoPlaying(false);
                  setCurrentSlide(currentSlide + 1);
                }

                setTranslateX(0);
              };

              const currentSlideData = slides[currentSlide];

              return (
                <div className="relative h-[50vh] rounded-xl overflow-hidden bg-gray-900 select-none">
                  {/* Slider Content */}
                  <div
                    className="relative w-full h-full cursor-grab active:cursor-grabbing"
                    onMouseDown={(e) => handleDragStart(e.clientX)}
                    onMouseMove={(e) => handleDragMove(e.clientX)}
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleDragEnd}
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                    onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                    onTouchEnd={handleDragEnd}
                  >
                    {/* Slides Container with smooth transition */}
                    <div
                      className="relative w-full h-full transition-transform duration-500 ease-out"
                      style={{
                        transform: `translateX(${translateX}px)`,
                      }}
                    >
                      {/* Current Slide */}
                      {currentSlideData?.type === "image" && (
                        <>
                          {/* Desktop Image (16:9) */}
                          <Image
                            src={currentSlideData.src}
                            alt="Bundle slide"
                            fill
                            className="hidden lg:block object-cover transition-opacity duration-500"
                            draggable={false}
                          />
                          {/* Mobile Image (4:3 if available, otherwise 16:9) */}
                          <Image
                            src={
                              currentSlideData.srcMobile || currentSlideData.src
                            }
                            alt="Bundle slide"
                            fill
                            className="block lg:hidden object-cover transition-opacity duration-500"
                            draggable={false}
                          />
                        </>
                      )}

                      {currentSlideData?.type === "video" && (
                        <div className="relative w-full h-full">
                          {!isVideoPlaying ? (
                            <>
                              {/* Video Thumbnail with Play Button */}
                              {currentSlideData.thumbnail ? (
                                <Image
                                  src={currentSlideData.thumbnail}
                                  alt="Video thumbnail"
                                  fill
                                  className="object-cover transition-opacity duration-500"
                                  draggable={false}
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple to-teal" />
                              )}

                              {/* YouTube-Style Play Button Overlay */}
                              <button
                                onClick={() => setIsVideoPlaying(true)}
                                className="absolute inset-0 flex items-center justify-center group"
                              >
                                {/* Large YouTube Play Button */}
                                <div className="relative">
                                  {/* Red YouTube Button Background */}
                                  <div className="w-24 h-16 lg:w-32 lg:h-20 rounded-2xl bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-all duration-300 shadow-2xl">
                                    {/* White Play Triangle */}
                                    <svg
                                      className="w-10 h-10 lg:w-12 lg:h-12 text-white ml-1"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                </div>
                              </button>
                            </>
                          ) : (
                            /* Video Player */
                            <iframe
                              src={currentSlideData.src}
                              className="w-full h-full"
                              title="Bundle intro video"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          )}
                        </div>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    {slides.length > 1 && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={() => {
                            setIsVideoPlaying(false);
                            setCurrentSlide((prev) =>
                              prev === 0 ? slides.length - 1 : prev - 1,
                            );
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10"
                        >
                          <svg
                            className="w-6 h-6 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => {
                            setIsVideoPlaying(false);
                            setCurrentSlide((prev) =>
                              prev === slides.length - 1 ? 0 : prev + 1,
                            );
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors z-10"
                        >
                          <svg
                            className="w-6 h-6 text-gray-900"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>

                        {/* Slide Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                          {slides.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setIsVideoPlaying(false);
                                setCurrentSlide(index);
                              }}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                  ? "bg-white w-8"
                                  : "bg-white/50 hover:bg-white/75"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Main Content: Sidebar first on mobile, Left section first on desktop */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* LEFT SECTION - Bundle Info & Courses */}
            <div className="flex-[2] order-2 lg:order-1">
              {/* Bundle Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-heading dark:text-darkHeading mb-4">
                {bundle.title}
              </h1>

              {/* Bundle Short Description */}
              {bundle.short_description && (
                <div className="pt-6 border-t border-gray-300/10 mb-8">
                  <p className="text-lg text-paragraph dark:text-darkParagraph leading-relaxed">
                    {bundle.short_description}
                  </p>
                </div>
              )}

              {/* Bundle Stats - Only 4 specific ones */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-3 lg:w-[80%] mb-12">
                {/* grid grid-cols-1 lg:grid-cols-2 */}
                {bundle.chips?.sections?.chapter && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 0.5C1.95507 0.5 0.5 1.95508 0.5 3.75V14.25C0.5 16.0449 1.95507 17.5 3.75 17.5H13.25C15.0449 17.5 16.5 16.0449 16.5 14.25V3.75C16.5 1.95507 15.0449 0.5 13.25 0.5H3.75ZM21.6232 15.6431L18 12.0935V5.99889L21.6121 2.3706C22.3988 1.58044 23.748 2.13753 23.748 3.25251V14.7502C23.748 15.8577 22.4143 16.4181 21.6232 15.6431Z"
                        fill="#D95344"
                      />
                    </svg>
                    <div>
                      <p className="text-paragraph dark:text-darkParagraph text-xl">
                        {bundle.chips.sections.chapter.label}
                      </p>
                      <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                        {bundle.chips.sections.chapter.value}
                      </p>
                    </div>
                  </div>
                )}

                {bundle.chips?.sections?.video && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                    <svg
                      width="24"
                      height="18"
                      viewBox="0 0 24 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 0.5C1.95507 0.5 0.5 1.95508 0.5 3.75V14.25C0.5 16.0449 1.95507 17.5 3.75 17.5H13.25C15.0449 17.5 16.5 16.0449 16.5 14.25V3.75C16.5 1.95507 15.0449 0.5 13.25 0.5H3.75ZM21.6232 15.6431L18 12.0935V5.99889L21.6121 2.3706C22.3988 1.58044 23.748 2.13753 23.748 3.25251V14.7502C23.748 15.8577 22.4143 16.4181 21.6232 15.6431Z"
                        fill="#B2F100"
                      />
                    </svg>
                    <div>
                      <p className="text-paragraph dark:text-darkParagraph text-xl">
                        {bundle.chips.sections.video.label}
                      </p>
                      <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                        {bundle.chips.sections.video.value}
                      </p>
                    </div>
                  </div>
                )}

                {bundle.chips?.sections?.liveClass && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                    <svg
                      width="25"
                      height="18"
                      viewBox="0 0 25 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.89992 0.761631C6.35553 1.21724 6.35553 1.95593 5.89992 2.41155C2.25385 6.05761 2.25385 11.9691 5.89992 15.6151C6.35553 16.0707 6.35553 16.8094 5.89992 17.265C5.4443 17.7207 4.70561 17.7207 4.25 17.265C-0.307292 12.7078 -0.307292 5.31892 4.25 0.761631C4.70561 0.306019 5.4443 0.306019 5.89992 0.761631ZM20.7534 0.761631C25.3107 5.31892 25.3107 12.7078 20.7534 17.265C20.2978 17.7207 19.5591 17.7207 19.1035 17.265C18.6479 16.8094 18.6479 16.0707 19.1035 15.6151C22.7496 11.9691 22.7496 6.05761 19.1035 2.41155C18.6479 1.95593 18.6479 1.21724 19.1035 0.761631C19.5591 0.306019 20.2978 0.306019 20.7534 0.761631ZM9.36101 4.1139C9.81662 4.56951 9.81662 5.30821 9.36101 5.76382C7.57488 7.54994 7.57488 10.4458 9.36101 12.2319C9.81662 12.6876 9.81662 13.4262 9.36101 13.8819C8.9054 14.3375 8.1667 14.3375 7.71109 13.8819C5.01374 11.1845 5.01374 6.81125 7.71109 4.1139C8.1667 3.65829 8.9054 3.65829 9.36101 4.1139ZM17.479 4.1139C20.1764 6.81125 20.1764 11.1845 17.479 13.8819C17.0234 14.3375 16.2847 14.3375 15.8291 13.8819C15.3735 13.4262 15.3735 12.6876 15.8291 12.2319C17.6153 10.4458 17.6153 7.54994 15.8291 5.76382C15.3735 5.30821 15.3735 4.56951 15.8291 4.1139C16.2847 3.65829 17.0234 3.65829 17.479 4.1139ZM12.5951 7.3449C13.5616 7.3449 14.3451 8.1284 14.3451 9.0949C14.3451 10.0614 13.5616 10.8449 12.5951 10.8449C11.6286 10.8449 10.8451 10.0614 10.8451 9.0949C10.8451 8.1284 11.6286 7.3449 12.5951 7.3449Z"
                        fill="#EE4878"
                      />
                    </svg>
                    <div>
                      <p className="text-paragraph dark:text-darkParagraph text-xl">
                        {bundle.chips.sections.liveClass.label}
                      </p>
                      <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                        {bundle.chips.sections.liveClass.value}
                      </p>
                    </div>
                  </div>
                )}

                {bundle.chips?.sections?.codingProblem && (
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
                        fill="#FFA500"
                      />
                    </svg>
                    <div>
                      <p className="text-paragraph dark:text-darkParagraph text-xl">
                        {bundle.chips.sections.codingProblem.label}
                      </p>
                      <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                        {bundle.chips.sections.codingProblem.value}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Horizontal Course Cards */}
              <div className="space-y-6 pt-8 border-t border-gray-300/10">
                <h2 className="text-xl lg:text-3xl font-bold text-heading dark:text-darkHeading mb-6">
                  এই <span className="text-[#EE4878]">বান্ডেলে</span> রয়েছে (
                  {bundle.course_count}টি কোর্স)
                </h2>

                {bundle.courses.map((course) => {
                  const isOwned = bundle.owned_courses?.includes(course.id);
                  const isExpanded = expandedCourses.has(course.id);

                  const toggleExpanded = () => {
                    setExpandedCourses((prev) => {
                      const newSet = new Set(prev);
                      if (newSet.has(course.id)) {
                        newSet.delete(course.id);
                      } else {
                        newSet.add(course.id);
                      }
                      return newSet;
                    });
                  };

                  return (
                    <div
                      key={course.id}
                      className={`flex flex-col md:flex-row gap-0 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg border overflow-hidden ${
                        isOwned
                          ? "border-green-300/50 dark:border-green-700/50"
                          : "border-gray-200/50 dark:border-gray-700/50"
                      } hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out`}
                    >
                      {/* Left: Course Thumbnail - Full Height */}
                      <div className="md:w-80 flex-shrink-0 relative">
                        <div className="relative w-full h-full min-h-[200px] md:min-h-full">
                          {course.chips?.thumbnails
                            ?.course_thumbnail_link_16_9 ||
                          course.chips?.course_thumbnail_link ? (
                            <Image
                              src={
                                (course.chips?.thumbnails
                                  ?.course_thumbnail_link_16_9 ||
                                  course.chips?.course_thumbnail_link) as string
                              }
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple to-teal flex items-center justify-center">
                              <BsBook className="text-white text-3xl" />
                            </div>
                          )}
                          {isOwned && (
                            <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <BsCheckCircle />
                              Enrolled
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Course Info */}
                      <div className="flex-1 flex flex-col justify-between p-4">
                        <div>
                          <h3 className="text-2xl font-semibold text-heading dark:text-darkHeading mb-3 line-clamp-2">
                            {course.title}
                          </h3>

                          {course.short_description && (
                            <div className="mb-3">
                              <p
                                className={`text-sm text-paragraph dark:text-darkParagraph ${
                                  isExpanded ? "" : "line-clamp-2"
                                }`}
                              >
                                {course.short_description}
                              </p>
                              {course.short_description.length > 100 && (
                                <button
                                  onClick={toggleExpanded}
                                  className="text-sm text-teal hover:text-teal/80 font-medium mt-1 transition-colors"
                                >
                                  {isExpanded ? "কম দেখো" : "আরও পড়ো"}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Course Stats */}
                          <div className="flex flex-wrap gap-4 mb-3 text-sm">
                            {course.chips?.sections?.chapter && (
                              <div className="flex items-center gap-1">
                                <BsBook className="text-teal" />
                                <span className="text-paragraph dark:text-darkParagraph">
                                  {course.chips.sections.chapter.value}{" "}
                                  চ্যাপ্টার
                                </span>
                              </div>
                            )}

                            {course.chips?.sections?.video && (
                              <div className="flex items-center gap-1">
                                <MdOndemandVideo className="text-purple" />
                                <span className="text-paragraph dark:text-darkParagraph">
                                  {course.chips.sections.video.value} ভিডিও
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price and Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                          <span className="text-xl font-bold text-purple">
                            {formatPrice(course.price)}
                          </span>

                          <div className="flex gap-2">
                            <Link
                              href={`/course-details/${course.id}`}
                              target="_blank"
                            >
                              <button className="flex items-center gap-1 px-4 py-2 bg-purple text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm">
                                <BsBoxArrowUpRight className="text-xs" />
                                কোর্স দেখো
                              </button>
                            </Link>

                            {course.chips?.course_outline && (
                              <Link
                                href={course.chips.course_outline}
                                target="_blank"
                              >
                                <button className="flex items-center gap-1 px-4 py-2 bg-teal text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm">
                                  <BsBoxArrowUpRight className="text-xs" />
                                  আউটলাইন দেখো
                                </button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Prebook Card - Lead Generation */}
              <div className="mt-12 bg-gradient-to-br from-[#B2F100]/10 to-[#7BA502]/10 dark:from-[#B2F100]/5 dark:to-[#7BA502]/5 backdrop-blur-lg border-2 border-[#B2F100]/40 rounded-2xl p-6 lg:p-8">
                {/* Main Heading - Always visible */}
                <h2 className="text-2xl lg:text-3xl font-bold text-heading dark:text-darkHeading text-center mb-3">
                  <span className="text-[#EE4878]">ক্লাসের ডেমো</span> দেখতে
                  চাও?
                </h2>

                {/* Subheading - Changes after prebook */}
                {!hasPrebooked ? (
                  <p className="text-lg text-paragraph dark:text-darkParagraph text-center mb-6">
                    তোমার ইনফরমেশন দাও এবং জেনে নাও কিভাবে ডেমো দেখবে!
                  </p>
                ) : (
                  <p className="text-lg text-paragraph dark:text-darkParagraph text-center mb-6">
                    Hello {prebookingData.name || "Student"}, এখানে তোমার
                    ইন্সট্রাকশন দেখো
                  </p>
                )}

                {/* Prebook Button - Hidden after prebook */}
                {!hasPrebooked && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => setOpenPrebookModal(true)}
                      className="px-8 py-3 text-lg font-bold text-white rounded-xl hover:opacity-90 transition-opacity"
                      style={{
                        background:
                          "linear-gradient(91deg, #4B6404 0%, #7BA502 50.98%, #A9E400 100%)",
                      }}
                    >
                      Prebook
                    </button>
                  </div>
                )}

                {/* Instructions Dropdown - Visible after prebook */}
                {hasPrebooked && (
                  <div className="mt-4">
                    <button
                      onClick={() => setShowInstructions(!showInstructions)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-[#B2F100]/30 hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors"
                    >
                      <span className="text-lg font-semibold text-heading dark:text-darkHeading">
                        Instructions
                      </span>
                      {showInstructions ? (
                        <BsChevronUp className="text-xl text-[#7BA502]" />
                      ) : (
                        <BsChevronDown className="text-xl text-[#7BA502]" />
                      )}
                    </button>

                    {/* Instructions Content - Collapsible */}
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        showInstructions
                          ? "max-h-[1000px] opacity-100 mt-4"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-6 border border-[#B2F100]/20">
                        <ul className="space-y-3">
                          {instructions.map((instruction, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 text-paragraph dark:text-darkParagraph"
                            >
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#B2F100]/30 flex items-center justify-center text-sm font-bold text-[#4B6404] dark:text-[#B2F100]">
                                {index + 1}
                              </span>
                              <p className="flex-1 leading-relaxed">
                                {instruction}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Student Feedback Section */}
              {bundle?.feedback_list?.feedbacks &&
                bundle.feedback_list.feedbacks.length > 0 && (
                  <div className=" pt-8 border-t border-gray-300/10 pb-8">
                    <p className="text-xl lg:text-3xl pb-8 font-semibold text-heading dark:text-darkHeading">
                      শিক্ষার্থীরা যা বলছে
                    </p>

                    <div className="max-w-[80vw] lg:max-w-[40vw] lgXl:max-w-[50vw] mx-auto">
                      <Slider {...settings}>
                        {bundle?.feedback_list?.feedbacks?.map(
                          (feedback: any) => (
                            <div
                              className="bg-gray-400/20 dark:bg-gray-300/10 backdrop-blur-lg rounded-lg p-6 "
                              key={Math.random()}
                            >
                              <svg
                                width="34"
                                height="23"
                                viewBox="0 0 34 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clipPath="url(#clip0_25_7047)">
                                  <path
                                    d="M8.01195 8.3856C8.75922 7.05093 10.1173 5.6158 12.4273 4.24813C13.0727 3.88147 13.4804 3.21413 13.4804 2.51307C13.4804 1.07793 11.9859 0.076932 10.6277 0.677532C6.72055 2.37887 0.166016 6.61753 0.166016 15.3926C0.166016 19.3299 3.39268 22.5001 7.36662 22.5001C11.3405 22.5001 14.6009 19.3299 14.6009 15.3926C14.6009 11.7223 11.7138 8.71927 8.01195 8.3856Z"
                                    fill="#F1BA41"
                                  />
                                </g>
                                <g clipPath="url(#clip1_25_7047)">
                                  <path
                                    d="M27.0119 8.3856C27.7592 7.05093 29.1173 5.6158 31.4273 4.24813C32.0727 3.88147 32.4804 3.21413 32.4804 2.51307C32.4804 1.07793 30.9859 0.076932 29.6277 0.677532C25.7205 2.37887 19.166 6.61753 19.166 15.3926C19.166 19.3299 22.3927 22.5001 26.3666 22.5001C30.3405 22.5001 33.6009 19.3299 33.6009 15.3926C33.6009 11.7223 30.7138 8.71927 27.0119 8.3856Z"
                                    fill="#F1BA41"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_25_7047">
                                    <rect
                                      width="15"
                                      height="22"
                                      fill="white"
                                      transform="translate(0 0.5)"
                                    />
                                  </clipPath>
                                  <clipPath id="clip1_25_7047">
                                    <rect
                                      width="15"
                                      height="22"
                                      fill="white"
                                      transform="translate(19 0.5)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>

                              <p className="py-8 text-xl text-paragraph dark:text-darkParagraph">
                                {feedback.description}
                              </p>
                              <div className="flex gap-4">
                                <img
                                  src={feedback.imageUploadedLink}
                                  alt=""
                                  className="rounded-full max-w-[50px]"
                                />
                                <div>
                                  <p className="text-xl">{feedback.name}</p>
                                  <p className="text-paragraph dark:text-darkParagraph">
                                    {feedback.bio}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </Slider>
                    </div>
                  </div>
                )}

              {/* FAQ Section */}
              {bundle?.faq_list?.faqs && bundle.faq_list.faqs.length > 0 && (
                <div className="pt-8 border-t border-gray-300/10 relative">
                  <p className="text-xl lg:text-3xl mb-8 font-semibold text-heading dark:text-darkHeading">
                    সচরাচর জানতে চাওয়া প্রশ্নের উত্তর
                  </p>
                  {bundle?.faq_list?.faqs?.map((faq: any, index: number) => (
                    <div
                      className="collapse collapse-plus dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mb-4"
                      key={index}
                    >
                      <input
                        type="radio"
                        name="bundle-faq-accordion"
                        defaultChecked={index === 0}
                      />
                      <div className="collapse-title text-xl font-medium text-heading dark:text-darkHeading">
                        {faq.question}
                      </div>
                      <div className="collapse-content">
                        <p className="text-paragraph dark:text-darkParagraph">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SECTION - Purchase Card */}
            <div className="w-full lg:w-[400px] flex-shrink-0 order-1 lg:order-2">
              <div className="sticky top-24 text-heading dark:text-darkHeading bg-gray-400/30 dark:bg-gray-100/5 backdrop-blur-xl rounded-xl">
                {/* Pricing Section */}
                <div className="p-4">
                  <div className="flex flex-col lgXxl:flex-row items-center gap-4 md:gap-2 justify-between pt-2 pb-4 border-b border-gray-300/20">
                    <div>
                      <p className="font-bold text-base text-paragraph dark:text-darkParagraph text-center lgXxl:text-left">
                        বান্ডেল প্রাইস
                      </p>
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-3xl font-bold">{bundle.price}/-</p>
                        </div>
                        <div>
                          <p className="text-[#BE2853] line-through font-semibold text-lg">
                            {calculateTotalOriginalPrice()}/-
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex items-center gap-4">
                        <div className="text-center lgXxl:text-left">
                          <p className="font-bold text-base text-paragraph dark:text-darkParagraph">
                            {bundle.is_live === false
                              ? "প্রিবুক করেছে"
                              : "বান্ডেলে ভর্তি হয়েছে"}
                          </p>
                          <p className="text-3xl font-bold">
                            {englishToBanglaNumbers(
                              bundle.is_live === false
                                ? bundle.prebooking || 0
                                : bundle.enrolled || 0,
                            )}{" "}
                            জন
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment Dates Section */}
                  {bundle?.chips?.enrollment && (
                    <div className="mt-4 pb-8 border-b border-gray-300/30">
                      <p className="text-sm text-paragraph dark:text-darkParagraph mb-4 text-center font-semibold">
                        {bundle.is_live === false
                          ? "প্রিবুকিং চলছে"
                          : "এনরোলমেন্ট চলছে"}
                      </p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-3 gap-x-3">
                        {/* Prebooking Start */}
                        {bundle.chips.enrollment.prebooking_start?.value && (
                          <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                            <div>
                              <p className="text-paragraph dark:text-darkParagraph text-xl">
                                {bundle.chips.enrollment.prebooking_start.label}
                              </p>
                              <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                                {formatDateToBengali(
                                  bundle.chips.enrollment.prebooking_start
                                    .value,
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Prebooking End */}
                        {bundle.chips.enrollment.prebooking_end?.value && (
                          <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                            <div>
                              <p className="text-paragraph dark:text-darkParagraph text-xl">
                                {bundle.chips.enrollment.prebooking_end.label}
                              </p>
                              <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                                {formatDateToBengali(
                                  bundle.chips.enrollment.prebooking_end.value,
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Enrollment Start */}
                        {bundle.chips.enrollment.enrollment_start?.value && (
                          <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                            <div>
                              <p className="text-paragraph dark:text-darkParagraph text-xl">
                                {bundle.chips.enrollment.enrollment_start.label}
                              </p>
                              <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                                {formatDateToBengali(
                                  bundle.chips.enrollment.enrollment_start
                                    .value,
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Enrollment End */}
                        {bundle.chips.enrollment.enrollment_end?.value && (
                          <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                            <div>
                              <p className="text-paragraph dark:text-darkParagraph text-xl">
                                {bundle.chips.enrollment.enrollment_end.label}
                              </p>
                              <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                                {formatDateToBengali(
                                  bundle.chips.enrollment.enrollment_end.value,
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Class Start Date */}
                        {bundle.chips.enrollment.classStart?.value && (
                          <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                            <div>
                              <p className="text-paragraph dark:text-darkParagraph text-xl">
                                {bundle.chips.enrollment.classStart.label}
                              </p>
                              <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                                {formatDateToBengali(
                                  bundle.chips.enrollment.classStart.value,
                                )}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Class Time */}
                        {bundle.chips.enrollment.classTime?.value && (
                          <div className="flex items-center gap-8 p-4 rounded-xl bg-black/20 dark:bg-white/5">
                            <div>
                              <p className="text-paragraph dark:text-darkParagraph text-xl">
                                {bundle.chips.enrollment.classTime.label}
                              </p>
                              <p className="text-heading dark:text-darkHeading font-bold text-2xl mt-1">
                                {formatTimeToBengali(
                                  bundle.chips.enrollment.classTime.value,
                                )}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* You Get Section */}
                  <p className="text-lg mt-6 font-bold">
                    এই Bundle-এ তুমি পাচ্ছো
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 mt-3 gap-y-1 gap-x-16">
                    {bundle.you_get?.you_get
                      ?.split(",")
                      .map((item: any, index: number) => (
                        <div className="flex gap-2 items-center" key={index}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="min-w-[16px] min-h-[16px]"
                          >
                            <g opacity="0.7">
                              <path
                                d="M8.00065 14.6663C4.31865 14.6663 1.33398 11.6817 1.33398 7.99967C1.33398 4.31767 4.31865 1.33301 8.00065 1.33301C11.6827 1.33301 14.6673 4.31767 14.6673 7.99967C14.6673 11.6817 11.6827 14.6663 8.00065 14.6663ZM8.00065 13.333C9.41512 13.333 10.7717 12.7711 11.7719 11.7709C12.7721 10.7707 13.334 9.41414 13.334 7.99967C13.334 6.58519 12.7721 5.22863 11.7719 4.22844C10.7717 3.22824 9.41512 2.66634 8.00065 2.66634C6.58616 2.66634 5.22961 3.22824 4.22942 4.22844C3.22922 5.22863 2.66732 6.58519 2.66732 7.99967C2.66732 9.41414 3.22922 10.7707 4.22942 11.7709C5.22961 12.7711 6.58616 13.333 8.00065 13.333ZM7.33598 10.6663L4.50732 7.83767L5.44998 6.89501L7.33598 8.78101L11.1067 5.00967L12.05 5.95234L7.33598 10.6663Z"
                                fill="#B153E0"
                              />
                            </g>
                          </svg>
                          <p>{item}</p>
                        </div>
                      ))}
                  </div>

                  {/* Coupon Input - For entering coupon code */}
                  {!bundle.purchased && bundle.is_live === true && (
                    <div className="mt-6">
                      <CouponInput
                        bundleId={bundle.id}
                        originalPrice={bundle.price}
                        userId={userId}
                        onCouponApplied={handleCouponApplied}
                        onCouponRemoved={handleCouponRemoved}
                        appliedCouponCode={appliedCouponCode}
                        disabled={purchaseLoading}
                      />
                    </div>
                  )}

                  {/* Discount Info Display */}
                  {discountInfo && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Original Price:
                        </span>
                        <span className="text-sm text-green-800 dark:text-green-200 line-through">
                          ৳{discountInfo.original_price}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Discount:
                        </span>
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">
                          -৳{discountInfo.discount_amount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-green-300 dark:border-green-700">
                        <span className="text-base font-bold text-green-800 dark:text-green-200">
                          Final Price:
                        </span>
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">
                          ৳{discountInfo.final_price}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Duplicate Course Warning */}
                  {bundle.owned_courses && bundle.owned_courses.length > 0 && (
                    <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                      <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                        ⚠️ সতর্কতা
                      </p>
                      <p className="text-sm text-paragraph dark:text-darkParagraph">
                        তুমি ইতোমধ্যে {bundle.owned_courses.length} টি কোর্স
                        কিনেছ যা এই বান্ডেলে রয়েছে।
                      </p>
                    </div>
                  )}

                  {/* Purchase/Prebook Button */}
                  <div id="purchase-section">
                    {bundle.purchased ? (
                      <div className="mt-6 space-y-4">
                        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg text-center">
                          <BsCheckCircle className="inline mr-2" />
                          <span className="font-semibold">
                            Bundle ক্রয় সম্পন্ন
                          </span>
                        </div>
                        {bundle.transaction_id && (
                          <div className="bg-purple/10 rounded-lg p-3 text-center">
                            <p className="text-xs text-paragraph dark:text-darkParagraph mb-1">
                              Access Code
                            </p>
                            <p className="font-mono font-bold text-purple">
                              {bundle.transaction_id}
                            </p>
                          </div>
                        )}
                        <Link
                          href="/dashboard"
                          className="flex justify-center text-darkHeading items-center bg-[#1CAB55] py-3 w-full rounded-xl hover:bg-opacity-50 ease-in-out duration-150 font-semibold"
                        >
                          ড্যাশবোর্ডে চলুন
                        </Link>
                      </div>
                    ) : bundle.is_live === false ? (
                      // Prebook Mode
                      hasPrebooked ? (
                        <div className="mt-6 bg-[#B2F100]/20 border border-[#B2F100]/60 text-darkHeading py-3 px-4 w-full rounded-xl text-center">
                          <div className="flex items-center justify-center gap-2">
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="font-semibold">
                              তুমি ইতোমধ্যে Bundle টি প্রিবুক করেছ! ✅
                            </span>
                          </div>
                          <p className="text-sm mt-2 opacity-80">
                            Bundle লাইভ হলে তোমার ফোন ও ইমেইলে বিস্তারিত জানানো
                            হবে!
                          </p>
                          <button
                            onClick={() => setOpenPrebookSuccessModal(true)}
                            className="text-sm mt-2 underline hover:opacity-70 transition-opacity"
                          >
                            এখন করনীয়
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setOpenPrebookPurchaseModal(true)}
                          className="mt-6 group relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 w-full rounded-lg hover:shadow-lg hover:shadow-blue-500/30 ease-in-out duration-200 font-semibold flex items-center justify-center gap-3 active:scale-95 transition-transform"
                        >
                          <svg
                            className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                            />
                          </svg>
                          Bundle প্রিবুক করো
                        </button>
                      )
                    ) : (
                      // Purchase Mode (enrollment is active)
                      <button
                        onClick={handlePurchaseClick}
                        disabled={purchaseLoading}
                        className="w-full bg-gradient-to-r from-purple to-[#B153E0] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                      >
                        {purchaseLoading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5"
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
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Bundle কিনুন"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Billboard Component */}
          <PriceBillboard
            bundle={bundle}
            bundleLoading={loading}
            purchaseSectionId="purchase-section"
            isLive={bundle?.is_live}
          />

          {/* Community & Support Section Component */}
          <CommunitySupportSection
            socials={bundle?.chips?.socials}
            facebookCommunityThumb={
              bundle?.chips?.thumbnails?.facebook_community_thumb_16_9
            }
          />
        </div>
      </main>

      <Footer />

      <WhatsAppWidget
        phoneNumber={
          bundle?.chips?.socials?.whatsapp
            ? bundle.chips.socials.whatsapp.replace("https://wa.me/", "")
            : "8801768976036"
        }
        name="CoderVai Team"
        position="Online | Replies instantly"
        welcomeMessage="আমরা এখানে একটিভ আছি! 👋 আপনাকে কিভাবে সাহায্য করতে পারি?"
        avatar="/wasup.svg"
      />
    </div>
  );
}
