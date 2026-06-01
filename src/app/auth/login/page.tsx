"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn, setCookieWithDomain } from "@/helpers";
import AuthShell from "../_components/AuthShell";

type LoginState = {
  login: string;
  password: string;
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<LoginState>({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const redirectUrl = useMemo(() => searchParams.get("redirect") || "/dashboard", [searchParams]);
  const registerHref = useMemo(
    () => `/auth/register?redirect=${encodeURIComponent(redirectUrl)}`,
    [redirectUrl],
  );

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(redirectUrl);
    }
  }, [redirectUrl, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BACKEND_URL}/admin/auth/login`, {
        login: form.login,
        password: form.password,
      });
      const token = res?.data?.token;
      if (!token) {
        throw new Error("Missing token in login response");
      }
      localStorage.setItem("token", token);
      setCookieWithDomain("token", token, ".mathpro.org");
      router.replace(redirectUrl);
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error
        : undefined;
      setError(message || "লগইন করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="আবার শুরু করো"
      description="তোমার লাইভ ক্লাস, রেকর্ডেড লেকচার আর প্র্যাকটিস সব এক জায়গায় ফিরে পাবে।"
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="login">
            ফোন বা ইমেইল
          </label>
          <input
            id="login"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="তোমার ফোন বা ইমেইল"
            value={form.login}
            onChange={(e) => setForm((p) => ({ ...p, login: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="password">
            পাসওয়ার্ড
          </label>
          <input
            id="password"
            type="password"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="তোমার পাসওয়ার্ড"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
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
          {loading ? "লগইন হচ্ছে..." : "লগইন করো"}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm font-semibold">
        <Link className="text-muted-foreground transition hover:text-primary" href="/auth/forgot-password">
          পাসওয়ার্ড ভুলে গেছো?
        </Link>
        <Link className="text-primary transition hover:text-primary/80" href={registerHref}>
          নতুন অ্যাকাউন্ট খুলো
        </Link>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
