"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import SEO from "@/components/SEO";
import { PostPaymentSuccessSkeleton } from "@/components/Skeletons";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn, createLoginRedirectUrl, getAuthToken } from "@/helpers";
import { jwtDecode } from "jwt-decode";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
// Import new modular components
import SuccessHeader from "@/components/PostPayment/Success/SuccessHeader";
import ImportantMessages from "@/components/PostPayment/Success/ImportantMessages";
import OrderSummary from "@/components/PostPayment/Success/OrderSummary";
import WhatYouGet from "@/components/PostPayment/Success/WhatYouGet";
import YourCourses from "@/components/PostPayment/Success/YourCourses";
import NextSteps from "@/components/PostPayment/Success/NextSteps";
import {
  PurchaseData,
  PurchasedBundle,
  PurchasedCourse,
  AfterPurchaseMessage,
  Course,
} from "@/components/PostPayment/Success/types";

function CentralizedSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const bundleid = searchParams.get("bundleid");
  const bundleId = searchParams.get("bundleId");
  const courseid = searchParams.get("courseid");
  const courseId = searchParams.get("courseId");

  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchaseType, setPurchaseType] = useState<"bundle" | "course" | null>(
    null,
  );
  const [afterMessages, setAfterMessages] = useState<string[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Payment history for access verification
  const { historyData, loading: historyLoading } = usePaymentHistory();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    if (!isLoggedIn()) {
      const loginUrl = createLoginRedirectUrl();
      router.replace(loginUrl);
    }
  }, [router]);

  // Verify user has access to this purchase
  const verifyPurchaseAccess = (itemType: "course" | "bundle", itemId: string): boolean => {
    if (!historyData) return false;

    if (itemType === "course") {
      // Check individual course purchases
      const courseAccess = historyData.individual_courses?.find(
        (course) => course.course_id.toString() === itemId,
      );
      
      // Check bundle purchases (courses included in bundles)
      const bundleAccess = historyData.bundle_purchases?.find((bundle) =>
        bundle.courses?.some((course) => course.id.toString() === itemId),
      );

      return !!(courseAccess || bundleAccess);
    } else if (itemType === "bundle") {
      // Check bundle purchases
      const bundleAccess = historyData.bundle_purchases?.find(
        (bundle) => bundle.id.toString() === itemId,
      );
      return !!bundleAccess;
    }

    return false;
  };

  useEffect(() => {
    if (dataFetched) return;
    if (!historyData) return;

    const normalizedBundleId = bundleid || bundleId;
    const normalizedCourseId = courseid || courseId;

    if (!type || (!normalizedBundleId && !normalizedCourseId)) {
      return;
    }

    if (!isLoggedIn()) {
      const loginUrl = createLoginRedirectUrl();
      router.replace(loginUrl);
      return;
    }

    let hasAccess = false;
    if (type === "bundle" && normalizedBundleId) {
      hasAccess = verifyPurchaseAccess("bundle", normalizedBundleId);
    } else if (type === "course" && normalizedCourseId) {
      hasAccess = verifyPurchaseAccess("course", normalizedCourseId);
    }

    if (!hasAccess) {
      if (type === "course" && normalizedCourseId) {
        router.replace(`/course-details/${normalizedCourseId}`);
      } else if (type === "bundle" && normalizedBundleId) {
        router.replace(`/bundle/${normalizedBundleId}`);
      } else {
        router.replace("/courses");
      }
      return;
    }

    setDataFetched(true);

    if (type === "bundle" && normalizedBundleId) {
      setPurchaseType("bundle");
      fetchPurchasedBundle(normalizedBundleId);
      fetchAfterMessages("bundle", normalizedBundleId);
    } else if (type === "course" && normalizedCourseId) {
      setPurchaseType("course");
      fetchPurchasedCourse(normalizedCourseId);
      fetchAfterMessages("course", normalizedCourseId);
    } else {
      setError("Invalid purchase type or missing ID");
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, bundleid, bundleId, courseid, courseId, historyData]);

  const fetchAfterMessages = async (
    itemType: "course" | "bundle",
    itemId: string,
  ) => {
    try {
      setMessagesLoading(true);
      const token = getAuthToken();

      if (!token) {
        setAfterMessages([]);
        return;
      }

      const response = await axios.get(
        `${BACKEND_URL}/user/aftermessage/${itemType}/${itemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success && response.data.data.length > 0) {
        const allMessages = response.data.data.flatMap(
          (item: AfterPurchaseMessage) => item.messages,
        );
        setAfterMessages(allMessages);
      } else {
        setAfterMessages([
          "Thank you for your purchase!",
          "We hope you enjoy the course.",
        ]);
      }
    } catch (error: any) {
      setAfterMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchPurchasedBundle = async (id: string) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required. Please log in again.");
        const loginUrl = createLoginRedirectUrl();
        router.replace(loginUrl);
        return;
      }

      const decodedToken: any = jwtDecode(token);
      const userId =
        decodedToken.id || decodedToken.user_id || decodedToken.sub;

      if (!userId) {
        setError("User authentication invalid");
        return;
      }

      const userIdInt = parseInt(userId.toString());

      // First, get the purchased bundle from my-bundles
      const response = await axios.get(
        `${BACKEND_URL}/user/bundle/my-bundles/${userIdInt}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      let purchasedBundle: PurchasedBundle | null = null;

      if (response.data.success) {
        purchasedBundle = response.data.data.find(
          (b: PurchasedBundle) => b.id.toString() === id,
        );
      }

      // If not found, try legacy endpoint
      if (!purchasedBundle) {
        try {
          const legacyResponse = await axios.get(
            `${BACKEND_URL}/user/bundle/my-bundles`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (legacyResponse.data.success) {
            purchasedBundle = legacyResponse.data.data.find(
              (b: PurchasedBundle) => b.id.toString() === id,
            );
          }
        } catch (legacyError) {
          // Continue to fetch full bundle details
        }
      }

      // Fetch full bundle details to get chips and you_get data (same API as bundle-details page)
      try {
        let requestConfig: any = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        // Add user_id to request config (same pattern as bundle-details page)
        requestConfig.data = { user_id: userIdInt };

        const fullBundleResponse = await axios.get(
          `${BACKEND_URL}/user/bundle/${id}`,
          requestConfig,
        );

        if (
          fullBundleResponse.data.success &&
          fullBundleResponse.data.data.length > 0
        ) {
          const fullBundleData = fullBundleResponse.data.data[0];

          // Merge purchase data with full bundle data
          // Use fullBundleData.chips (from API) as it contains complete chips.socials.facebook_private_group
          // Same API endpoint as bundle-details page: /user/bundle/{id}
          if (purchasedBundle) {
            setPurchaseData({
              ...purchasedBundle,
              you_get: fullBundleData.you_get,
              // Use full bundle chips from API (contains complete socials data)
              chips: fullBundleData.chips || purchasedBundle.chips,
            });
          } else {
            // If we couldn't get purchase data, use full bundle data
            setPurchaseData({
              id: fullBundleData.id,
              title: fullBundleData.title,
              price: fullBundleData.price,
              url: fullBundleData.url,
              amount: fullBundleData.price,
              transaction_id: "",
              purchase_date: Date.now(),
              courses: fullBundleData.courses || [],
              course_count: fullBundleData.course_count || 0,
              you_get: fullBundleData.you_get,
              chips: fullBundleData.chips,
            });
          }
          setError(null);
          return;
        }
      } catch (fullBundleError) {
        // If full bundle fetch fails, use purchased bundle data as fallback
        if (purchasedBundle) {
          setPurchaseData(purchasedBundle);
          setError(null);
          return;
        }
      }

      if (!purchasedBundle) {
        throw new Error("Bundle not found");
      }
    } catch (error) {
      setError("Failed to fetch bundle details");
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchasedCourse = async (id: string) => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setError("Authentication required. Please log in again.");
        const loginUrl = createLoginRedirectUrl();
        router.replace(loginUrl);
        return;
      }

      // Fetch course details
      const response = await axios.get(
        `${BACKEND_URL}/user/course/getfull/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      let courseData = null;
      if (response.data.success && response.data.data) {
        courseData = response.data.data;
      } else if (response.data.id || response.data.title) {
        courseData = response.data;
      }

      if (courseData) {
        // Fill in transaction_id from already-fetched payment history if not present
        if (!courseData.transaction_id) {
          const purchasedCourse = historyData?.individual_courses?.find(
            (c) => c.course_id.toString() === id,
          );

          if (purchasedCourse && purchasedCourse.transaction_id) {
            courseData.transaction_id = purchasedCourse.transaction_id;
            courseData.purchase_date = purchasedCourse.enrollment_date;
            courseData.amount = purchasedCourse.paid_amount;
          }
        }

        setPurchaseData(courseData);
        setError(null);
      } else {
        setError("Course data not available");
      }
    } catch (error: any) {
      setError(
        `Failed to fetch course details: ${error.response?.data?.message || error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to extract data for components
  const getPurchaseTitle = () => {
    if (!purchaseData) return "";
    return purchaseData.title;
  };

  const getCourses = (): Course[] => {
    if (!purchaseData) return [];
    if (purchaseType === "bundle") {
      const courses = (purchaseData as PurchasedBundle).courses || [];
      return courses.map((c) => ({
        ...c,
        url: `/course/${c.id}`,
      }));
    } else {
      const course = purchaseData as PurchasedCourse;
      return [
        {
          id: course.id,
          title: course.title,
          url: `/course/${course.id}`,
          short_description: course.short_description,
          chips: course.chips,
        },
      ];
    }
  };

  const getYouGetItems = (): string[] => {
    if (!purchaseData) return [];

    let youGetString: string | undefined;

    if (purchaseType === "bundle") {
      const bundle = purchaseData as PurchasedBundle;
      youGetString = bundle.you_get?.you_get;
    } else {
      const course = purchaseData as PurchasedCourse;
      youGetString = course.you_get?.you_get;
    }

    if (!youGetString) return [];

    // Split by comma and filter out empty strings
    return youGetString
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const showInitialLoading =
    !mounted ||
    (loading && !purchaseData) ||
    (historyLoading && !historyData);

  // Render Logic
  if (showInitialLoading) {
    return <PostPaymentSuccessSkeleton />;
  }

  if (error && !purchaseData) {
    const isAccessDenied = error.includes("Access denied");

    return (
      <>
        <SEO title={isAccessDenied ? "Access Denied" : "Purchase Not Found"} description="Purchase verification failed" />
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-md space-y-6">
            <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${
              isAccessDenied ? "bg-warning/10" : "bg-destructive/10"
            }`}>
              <svg
                className={`h-8 w-8 ${isAccessDenied ? "text-warning" : "text-destructive"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isAccessDenied ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                )}
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              {isAccessDenied ? "Access Denied" : "Purchase Not Found"}
            </h2>
            <p className="text-muted-foreground">
              {isAccessDenied
                ? "তুমি এই পেমেন্ট পেজ দেখতে পারবে না। শুধুমাত্র যারা কিনেছে তারাই দেখতে পাবে।"
                : error}
            </p>
            <div className="space-y-3">
              <Link href="/my-courses" className="block">
                <button className="w-full bg-linear-to-r from-primary to-teal text-white px-6 py-3 rounded-xl hover:opacity-90 transition-opacity font-semibold">
                  আমার কোর্সসমূহ
                </button>
              </Link>
              <Link href="/courses" className="block">
                <button className="w-full bg-muted text-foreground px-6 py-3 rounded-xl hover:bg-muted/80 transition-colors font-semibold">
                  সকল কোর্স দেখো
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!purchaseData) return null;

  const courses = getCourses();
  const title = getPurchaseTitle();
  const youGetItems = getYouGetItems();

  return (
    <>
      <SEO
        title={`Purchase Successful - ${title}`}
        description={`Successfully purchased ${title}`}
      />
      <Toaster />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-motif-float"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute top-20 right-10 w-48 h-48 rounded-full bg-teal/10 blur-3xl animate-motif-float"
          style={{ animationDuration: "10s", animationDelay: "1s" }}
        ></div>
      </div>

      <main className="relative z-10 pt-10 lg:pt-20 bg-background min-h-screen overflow-hidden">
        <div className="w-[90%] lg:w-[85%] max-w-[1000px] mx-auto py-12 space-y-16 lg:space-y-20">
          <SuccessHeader title={title} type={purchaseType || "course"} />

          {afterMessages.length > 0 && (
            <ImportantMessages messages={afterMessages} />
          )}

          <OrderSummary data={purchaseData} />

          <WhatYouGet youGetItems={youGetItems} />

          {courses.length > 0 && <YourCourses courses={courses} />}

          <NextSteps />
        </div>
      </main>
    </>
  );
}

export default function CentralizedSuccessPage() {
  return (
    <Suspense fallback={<PostPaymentSuccessSkeleton />}>
      <CentralizedSuccessPageContent />
    </Suspense>
  );
}
