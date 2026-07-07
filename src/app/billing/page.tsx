"use client";

import { useEffect, useState } from "react";
import { isLoggedIn, createLoginRedirectUrl } from "@/helpers";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardLoadingSkeleton from "@/components/Dashboard/DashboardLoadingSkeleton";
import { usePaymentHistory } from "@/hooks/usePaymentHistory";
import PaymentSummary from "@/components/PaymentSummary";
import PaymentTransactions from "@/components/PaymentTransactions";
import PaymentCourses from "@/components/PaymentCourses";
import PaymentBundles from "@/components/PaymentBundles";
import PaymentBooks from "@/components/PaymentBooks";

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoggedIn()) {
      const loginUrl = createLoginRedirectUrl();
      window.location.href = loginUrl;
    }

    const frame = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const { historyData, loading, error } = usePaymentHistory();

  if (!mounted) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardLoadingSkeleton />
      </DashboardLayout>
    );
  }

  if (error || !historyData) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-page-bg">
          <div className="text-center max-w-md mx-auto p-8 rounded-2xl border border-border bg-card">
            <div className="text-destructive text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              পেমেন্ট হিস্টরি লোড করা যায়নি
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              আবার চেষ্টা করো
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="pt-20 min-h-screen bg-page-bg">
        <div className="w-full px-4 sm:w-[90%] sm:px-0 lg:w-[85%] max-w-[1440px] mx-auto py-6 sm:py-12 space-y-6 sm:space-y-8">
          <PaymentSummary
            summary={historyData.summary}
            userInfo={historyData.user_info}
          />
          <PaymentTransactions transactions={historyData.all_transactions} />
          <PaymentCourses courses={historyData.individual_courses} />
          <PaymentBundles bundles={historyData.bundle_purchases} />
          <PaymentBooks books={historyData.book_purchases} />
        </div>
      </main>
    </DashboardLayout>
  );
}
