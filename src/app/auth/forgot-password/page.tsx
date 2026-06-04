"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn } from "@/helpers";
import AuthShell from "../_components/AuthShell";

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const redirectUrl = useMemo(() => searchParams.get("redirect") || "/dashboard", [searchParams]);
  const loginHref = useMemo(
    () => `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`,
    [redirectUrl],
  );

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(redirectUrl);
    }
  }, [redirectUrl, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!showOtpForm) {
        const res = await axios.post(`${BACKEND_URL}/admin/auth/forgot-password`, {
          contact: email.trim(),
        });
        setShowOtpForm(true);
        setSuccess(res.data?.message || "OTP তোমার ইমেইলে পাঠানো হয়েছে।");
        return;
      }

      if (password !== confirmPass) {
        setError("পাসওয়ার্ড দুটি এক হয়নি।");
        return;
      }

      const res = await axios.post(`${BACKEND_URL}/admin/auth/reset-password`, {
        contact: email.trim(),
        otp: otp.trim(),
        newPassword: password,
      });
      setSuccess(res.data?.message || "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।");
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error
        : undefined;
      setError(message || "অনুরোধটি সম্পন্ন করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="পাসওয়ার্ড রিসেট করো"
      description="তোমার ইমেইলে OTP পাঠানো হবে। সেটা দিয়ে নতুন পাসওয়ার্ড সেট করতে পারবে।"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
            ইমেইল
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="তোমার ইমেইল"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {showOtpForm ? (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="otp">
                OTP
              </label>
              <input
                id="otp"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
                placeholder="ইমেইলে পাওয়া OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="password"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
                placeholder="নতুন পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
                placeholder="পাসওয়ার্ড নিশ্চিত করো"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </div>
          </>
        ) : null}

        {error ? (
          <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
            {success}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-linear-to-r from-primary to-primary/85 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 disabled:translate-y-0 disabled:opacity-70"
        >
          {loading
            ? "একটু অপেক্ষা করো..."
            : showOtpForm
              ? "নতুন পাসওয়ার্ড সেট করো"
              : "OTP পাঠাও"}
        </button>
      </form>

      <p className="mt-5 text-sm font-semibold text-muted-foreground">
        মনে পড়ে গেছে?{" "}
        <Link href={loginHref} className="text-primary transition hover:text-primary/80">
          লগইন করো
        </Link>
      </p>
    </AuthShell>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordContent />
    </Suspense>
  );
}
