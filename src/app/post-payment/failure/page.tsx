"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BsExclamationTriangle, BsArrowLeft } from "react-icons/bs";

type ItemType = "course" | "bundle" | "book";

function resolveItemType(searchParams: URLSearchParams): { itemType: ItemType | null; itemId: string | null } {
  const typeParam = searchParams.get("type");
  if (typeParam === "bundle" || typeParam === "book" || typeParam === "course") {
    return { itemType: typeParam, itemId: searchParams.get("itemId") };
  }

  // Backward compat with the old param shape (no `type`, item-specific id keys).
  const bundleId = searchParams.get("bundle_id") ?? searchParams.get("bundleId");
  if (bundleId) return { itemType: "bundle", itemId: bundleId };

  const courseId = searchParams.get("course_id") ?? searchParams.get("courseId");
  if (courseId) return { itemType: "course", itemId: courseId };

  return { itemType: null, itemId: null };
}

function FailurePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const { itemType, itemId } = resolveItemType(searchParams);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      if (itemType === "bundle" && itemId) {
        router.push(`/combos/${itemId}`);
      } else if (itemType === "book" && itemId) {
        router.push(`/books/${itemId}`);
      } else if (itemType === "course" && itemId) {
        router.push(`/course-details/${itemId}`);
      } else {
        router.push("/courses");
      }
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router, itemType, itemId]);

  const itemLabel = itemType === "bundle" ? "Combo টি" : itemType === "book" ? "বইটি" : "কোর্সটি";

  return (
    <div className="overflow-x-hidden">
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto py-16 space-y-6">
          {/* Icon */}
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <BsExclamationTriangle className="text-destructive text-3xl" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-foreground">
            Payment Failed
          </h1>

          {/* Sub-heading */}
          <p className="text-xl font-semibold text-foreground">
            {itemLabel} কেনা হয়নি
          </p>

          {/* Body */}
          <p className="text-muted-foreground">
            তোমার payment সফল হয়নি। আবার চেষ্টা করো অথবা আমাদের সাপোর্ট
            টিমের সাথে যোগাযোগ করো।
          </p>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            {itemType === "bundle" && itemId ? (
              <Link href={`/combos/${itemId}`} className="block">
                <button className="w-full bg-linear-to-r from-primary to-teal text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <BsArrowLeft />
                  Combo তে ফিরে যাও
                </button>
              </Link>
            ) : itemType === "book" && itemId ? (
              <Link href={`/books/${itemId}`} className="block">
                <button className="w-full bg-linear-to-r from-primary to-teal text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <BsArrowLeft />
                  বইয়ের পাতায় ফিরে যাও
                </button>
              </Link>
            ) : itemId ? (
              <Link href={`/course-details/${itemId}`} className="block">
                <button className="w-full bg-linear-to-r from-primary to-teal text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <BsArrowLeft />
                  কোর্সে ফিরে যাও
                </button>
              </Link>
            ) : null}

            <Link href={itemType === "book" ? "/books" : "/courses"} className="block">
              <button className="w-full border-2 border-border text-foreground hover:bg-muted transition-colors py-3 px-6 rounded-xl font-semibold">
                {itemType === "book" ? "সকল বই দেখো" : "সকল কোর্স দেখো"}
              </button>
            </Link>
          </div>

          {/* Countdown */}
          <p className="text-sm text-muted-foreground">
            Automatically redirecting in{" "}
            <span className="font-semibold text-teal">{countdown}</span> seconds...
          </p>

          {/* Support */}
          <div className="pt-2 border-t border-border space-y-1 text-sm">
            <p className="text-muted-foreground">সাহায্যের জন্য যোগাযোগ করো:</p>
            <p className="text-teal font-medium">
              📞 +8801768976036 &nbsp;|&nbsp; ✉️ support@codervai.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={null}>
      <FailurePageContent />
    </Suspense>
  );
}
