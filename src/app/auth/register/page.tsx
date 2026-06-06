"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn, persistAuthToken } from "@/helpers";
import AuthShell from "../_components/AuthShell";

type RegisterState = {
  email: string;
  password: string;
  confirmPass: string;
};

const initialState: RegisterState = {
  email: "",
  password: "",
  confirmPass: "",
};

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<RegisterState>(initialState);
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
      if (form.password !== form.confirmPass) {
        setError("পাসওয়ার্ড দুটি এক হয়নি।");
        return;
      }

      const res = await axios.post(`${BACKEND_URL}/admin/auth/register`, {
        login: form.email.trim(),
        password: form.password,
      });

      const token = res?.data?.token;
      if (!token) {
        throw new Error("Missing token in registration response");
      }

      persistAuthToken(token);
      router.replace(redirectUrl);
    } catch (err: unknown) {
      const errorResponse = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data
        : undefined;
      setError(errorResponse?.error || "রেজিস্ট্রেশন করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="অ্যাকাউন্ট খুলো"
      description="ইমেইল আর পাসওয়ার্ড দিলেই তোমার MathPro অ্যাকাউন্ট প্রস্তুত। পরে প্রোফাইল থেকে বাকি তথ্য আপডেট করতে পারবে।"
    >
      <form className="space-y-4" onSubmit={submitForm}>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="email">
            ইমেইল
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="তোমার ইমেইল"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">
              পাসওয়ার্ড
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
              placeholder="কমপক্ষে ৬ অক্ষর"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="confirm-password">
              পাসওয়ার্ড আবার লেখো
            </label>
            <input
              id="confirm-password"
              type="password"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
              placeholder="পাসওয়ার্ড নিশ্চিত করো"
              value={form.confirmPass}
              onChange={(e) => setForm((p) => ({ ...p, confirmPass: e.target.value }))}
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
