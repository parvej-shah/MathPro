"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { isLoggedIn, createLoginRedirectUrl } from "@/helpers";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import DashboardLoadingSkeleton from "@/components/Dashboard/DashboardLoadingSkeleton";
import { usePaymentHistory, Transaction, UserInfo } from "@/hooks/usePaymentHistory";
import InvoiceDocument from "@/components/Invoice/InvoiceDocument";

// TODO(remove): hardcoded mock data for UI testing — visit /billing/invoice/mock
const MOCK_TRANSACTION: Transaction = {
  user_id: 1,
  course_id: 101,
  paid_amount: 1500,
  transaction_id: "mock",
  transaction_date: Math.floor(Date.now() / 1000),
  item_type: "course",
  title: "এসএসসি গণিত শর্ট সিলেবাস",
  purchase_type: "individual",
  original_price: 2000,
  coupon: {
    id: 1,
    code: "EID50",
    name: "ঈদ অফার",
    discount_type: "fixed",
    discount_value: 500,
    discount_amount: 500,
    original_price: 2000,
    final_price: 1500,
  },
};

const MOCK_USER_INFO: UserInfo = {
  name: "পরভেজ শাহ",
  phone: "01700000000",
  email: "test@example.com",
  profile: { email: "test@example.com", address: "ঢাকা, বাংলাদেশ" },
};

export default function InvoicePage() {
  const params = useParams<{ transactionId: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined" && !isLoggedIn()) {
      const loginUrl = createLoginRedirectUrl();
      window.location.href = loginUrl;
    }
  }, []);

  const { historyData, loading, error } = usePaymentHistory();

  const transaction =
    params.transactionId === "mock"
      ? MOCK_TRANSACTION
      : historyData?.all_transactions.find(
          (t) => t.transaction_id === params.transactionId,
        );

  useEffect(() => {
    if (!transaction) return;

    const date = new Date(transaction.transaction_date * 1000)
      .toISOString()
      .slice(0, 10);
    const originalTitle = document.title;
    document.title = `Invoice-${transaction.title}-${transaction.transaction_id}-${date}`;

    return () => {
      document.title = originalTitle;
    };
  }, [transaction]);

  if (!mounted) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardLoadingSkeleton />
      </DashboardLayout>
    );
  }

  // TODO(remove): mock data path for UI testing
  if (params.transactionId === "mock") {
    return (
      <DashboardLayout>
        <main className="pt-20 min-h-screen bg-page-bg print:pt-0 print:bg-white">
          <div className="w-[90%] lg:w-[85%] max-w-[1000px] mx-auto py-12 print:py-0 space-y-6">
            <div className="flex justify-end gap-3 print:hidden">
              <button
                onClick={() => router.push("/billing")}
                className="bg-muted text-foreground px-5 py-2.5 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                ফিরে যাও
              </button>
              <button
                onClick={() => window.print()}
                className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all"
              >
                প্রিন্ট / ডাউনলোড
              </button>
            </div>

            <InvoiceDocument transaction={MOCK_TRANSACTION} userInfo={MOCK_USER_INFO} />
          </div>
        </main>
      </DashboardLayout>
    );
  }

  if (error || !historyData || !transaction) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-page-bg">
          <div className="text-center max-w-md mx-auto p-8 rounded-2xl border border-border bg-card">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              ইনভয়েস পাওয়া যায়নি
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "এই ট্রানজেকশনের কোনো ইনভয়েস খুঁজে পাওয়া যায়নি।"}
            </p>
            <button
              onClick={() => router.push("/billing")}
              className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              পেমেন্ট হিস্টরিতে ফিরে যাও
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <main className="pt-20 min-h-screen bg-page-bg print:pt-0 print:bg-white">
        <div className="w-[90%] lg:w-[85%] max-w-[1000px] mx-auto py-12 print:py-0 space-y-6">
          <div className="flex justify-end gap-3 print:hidden">
            <button
              onClick={() => router.push("/billing")}
              className="bg-muted text-foreground px-5 py-2.5 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
            >
              ফিরে যাও
            </button>
            <button
              onClick={() => window.print()}
              className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all"
            >
              প্রিন্ট / ডাউনলোড
            </button>
          </div>

          <InvoiceDocument transaction={transaction} userInfo={historyData.user_info} />
        </div>
      </main>
    </DashboardLayout>
  );
}
