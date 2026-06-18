"use client";

import { FormEvent, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn, handlePostLoginRedirect } from "@/helpers";
import AuthShell from "../_components/AuthShell";

type Step = "phone" | "otp" | "details";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = useMemo(() => searchParams.get("redirect") || "/dashboard", [searchParams]);
  const loginHref = useMemo(
    () => `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`,
    [redirectUrl],
  );

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(redirectUrl);
    }
  }, [redirectUrl, router]);

  useEffect(() => {
    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, []);

  const startCooldown = useCallback((seconds: number) => {
    setCooldown(seconds);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownRef.current) clearInterval(cooldownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const sendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/admin/auth/request-otp`, {
        contact: phone.trim(),
      });
      if (res.data?.success) {
        setStep("otp");
        startCooldown(60);
      } else {
        setError(res.data?.error || "OTP পাঠানো যায়নি।");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error
        : undefined;
      setError(message || "OTP পাঠানো যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/admin/auth/verify-otp`, {
        contact: phone.trim(),
        otp: otp.trim(),
      });
      if (res.data?.success) {
        setStep("details");
      } else {
        setError(res.data?.error || "OTP সঠিক নয়।");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error
        : undefined;
      setError(message || "OTP যাচাই করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPass) {
      setError("পাসওয়ার্ড দুটি এক হয়নি।");
      return;
    }
    if (password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/admin/auth/register`, {
        login: phone.trim(),
        password,
        otp: otp.trim(),
        name: name.trim() || undefined,
      });

      const token = res?.data?.token;
      if (!token) throw new Error("Missing token");

      handlePostLoginRedirect(token, redirectUrl, router);
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error
        : undefined;
      setError(message || "রেজিস্ট্রেশন করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25";

  return (
    <AuthShell
      title="অ্যাকাউন্ট খুলো"
      description="ফোন নম্বর দিয়ে OTP যাচাই করো, তারপর পাসওয়ার্ড সেট করো। তোমার MathPro অ্যাকাউন্ট প্রস্তুত!"
    >
      {step === "phone" && (
        <form className="space-y-4" onSubmit={sendOtp}>
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="phone">
              ফোন নম্বর
            </label>
            <input
              id="phone"
              type="tel"
              className={inputClass}
              placeholder="01XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-linear-to-r from-primary to-primary/85 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 disabled:translate-y-0 disabled:opacity-70"
          >
            {loading ? "পাঠানো হচ্ছে..." : "OTP পাঠাও"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form className="space-y-4" onSubmit={verifyOtp}>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{phone}</span> নম্বরে একটি OTP পাঠানো হয়েছে।{" "}
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
            >
              নম্বর বদলাও
            </button>
          </p>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="otp">
              OTP কোড
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              className={inputClass}
              placeholder="৬ সংখ্যার কোড"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>

          {error ? (
            <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-linear-to-r from-primary to-primary/85 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 disabled:translate-y-0 disabled:opacity-70"
          >
            {loading ? "যাচাই হচ্ছে..." : "যাচাই করো"}
          </button>

          <button
            type="button"
            disabled={cooldown > 0 || loading}
            onClick={() => { sendOtp({ preventDefault() {} } as FormEvent); }}
            className="w-full text-sm font-medium text-primary transition hover:underline disabled:text-muted-foreground disabled:no-underline"
          >
            {cooldown > 0 ? `আবার পাঠাও (${cooldown}s)` : "আবার OTP পাঠাও"}
          </button>
        </form>
      )}

      {step === "details" && (
        <form className="space-y-4" onSubmit={submitRegister}>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{phone}</span> যাচাই সম্পন্ন ✓
          </p>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="name">
              তোমার নাম
            </label>
            <input
              id="name"
              type="text"
              className={inputClass}
              placeholder="নাম (ঐচ্ছিক)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                type="password"
                className={inputClass}
                placeholder="কমপক্ষে ৬ অক্ষর"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="confirm-password">
                পাসওয়ার্ড আবার লেখো
              </label>
              <input
                id="confirm-password"
                type="password"
                className={inputClass}
                placeholder="পাসওয়ার্ড নিশ্চিত করো"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-linear-to-r from-primary to-primary/85 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 disabled:translate-y-0 disabled:opacity-70"
          >
            {loading ? "একটু অপেক্ষা করো..." : "অ্যাকাউন্ট খুলো"}
          </button>
        </form>
      )}

      <p className="mt-5 text-sm font-semibold text-muted-foreground">
        আগে থেকেই অ্যাকাউন্ট আছে?{" "}
        <Link href={loginHref} className="text-primary transition hover:text-primary/80">
          লগইন করো
        </Link>
      </p>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterPageContent />
    </Suspense>
  );
}
