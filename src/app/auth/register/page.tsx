"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import bcrypt from "bcryptjs-react";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn, setCookieWithDomain } from "@/helpers";
import AuthShell from "../_components/AuthShell";

type RegisterState = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPass: string;
  currentInstitution: string;
  department: string;
  currentAcademicLevel: string;
  interestedTopic: string;
};

const initialState: RegisterState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPass: "",
  currentInstitution: "",
  department: "",
  currentAcademicLevel: "",
  interestedTopic: "",
};

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<RegisterState>(initialState);
  const [otp, setOtp] = useState("");
  const [otpHash, setOtpHash] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!showOtp) {
        if (form.password !== form.confirmPass) {
          setError("Passwords do not match.");
          return;
        }
        const otpRes = await axios.get(`${BACKEND_URL}/admin/auth/otp/${form.phone}`);
        setOtpHash(otpRes?.data?.data?.otp || "");
        setShowOtp(true);
        return;
      }

      const isOtpValid = bcrypt.compareSync(otp, otpHash);
      if (!isOtpValid) {
        setError("Wrong OTP.");
        return;
      }

      const res = await axios.post(`${BACKEND_URL}/admin/auth/register-user`, {
        login: form.phone,
        password: form.password,
        name: form.name,
        type: 3,
        profile: {
          email: form.email,
          currentInstitution: form.currentInstitution,
          department: form.department,
          currentAcademicLevel: form.currentAcademicLevel,
          interestedTopic: form.interestedTopic,
        },
      });

      const token = res?.data?.token;
      if (!token) {
        throw new Error("Missing token in registration response");
      }
      localStorage.setItem("token", token);
      setCookieWithDomain("token", token, ".mathpro.org");
      router.replace(redirectUrl);
    } catch (err: unknown) {
      const errorResponse = axios.isAxiosError<{ error?: string; data?: string }>(err)
        ? err.response?.data
        : undefined;
      setError(errorResponse?.error || errorResponse?.data || "রেজিস্ট্রেশন করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="শেখা শুরু করো"
      description="কয়েকটি তথ্য দিলেই তোমার কোর্স, কুইজ আর প্রগ্রেস ট্র্যাকিংয়ের জন্য অ্যাকাউন্ট প্রস্তুত হবে।"
    >
      <form className="space-y-3" onSubmit={submitForm}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="তোমার নাম"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <input
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="ফোন নম্বর"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            required
          />
        </div>
        <input
          type="email"
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
          placeholder="ইমেইল"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          required
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="password"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="পাসওয়ার্ড"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
          <input
            type="password"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="পাসওয়ার্ড আবার লেখো"
            value={form.confirmPass}
            onChange={(e) => setForm((p) => ({ ...p, confirmPass: e.target.value }))}
            required
          />
        </div>
        <input
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
          placeholder="বর্তমান শিক্ষা প্রতিষ্ঠান"
          value={form.currentInstitution}
          onChange={(e) => setForm((p) => ({ ...p, currentInstitution: e.target.value }))}
          required
        />
        <div className="grid grid-cols-1 gap-3">
          <select
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25"
            value={form.currentAcademicLevel}
            onChange={(e) => setForm((p) => ({ ...p, currentAcademicLevel: e.target.value }))}
            required
          >
            <option value="">ক্লাস/লেভেল বেছে নাও</option>
            <option value="JSC">জেএসসি</option>
            <option value="SSC">এসএসসি</option>
            <option value="HSC">এইচএসসি</option>
          </select>
        </div>

        {showOtp ? (
          <input
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="OTP কোড লেখো"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        ) : null}

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
          {loading ? "একটু অপেক্ষা করো..." : showOtp ? "ভেরিফাই করে শুরু করো" : "OTP পাঠাও"}
        </button>
      </form>

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
