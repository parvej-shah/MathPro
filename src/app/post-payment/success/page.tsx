"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SEO from "@/components/SEO";
import { PostPaymentSuccessSkeleton } from "@/components/Skeletons";
import { isLoggedIn, createLoginRedirectUrl } from "@/helpers";
import SuccessHeader from "@/components/PostPayment/Success/SuccessHeader";
import NextSteps from "@/components/PostPayment/Success/NextSteps";

function CentralizedSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const type = searchParams.get("type") === "bundle" ? "bundle" : "course";
  const title =
    type === "bundle"
      ? "তোমার কেনা কম্বো এখন ড্যাশবোর্ডে প্রস্তুত"
      : "তোমার কেনা কোর্স এখন ড্যাশবোর্ডে প্রস্তুত";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace(createLoginRedirectUrl());
    }
  }, [router]);

  if (!mounted) {
    return <PostPaymentSuccessSkeleton />;
  }

  return (
    <>
      <SEO
        title="পেমেন্ট সফল"
        description="তোমার কেনা কোর্স বা কম্বো এখন ড্যাশবোর্ডে প্রস্তুত।"
      />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-primary/10 blur-3xl animate-motif-float"
          style={{ animationDuration: "8s" }}
        />
        <div
          className="absolute top-20 right-10 w-48 h-48 rounded-full bg-teal/10 blur-3xl animate-motif-float"
          style={{ animationDuration: "10s", animationDelay: "1s" }}
        />
      </div>

      <main className="relative z-10 pt-10 lg:pt-20 bg-background min-h-screen overflow-hidden">
        <div className="w-[90%] lg:w-[85%] max-w-[1000px] mx-auto py-12 space-y-16 lg:space-y-20">
          <SuccessHeader title={title} type={type} />
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
