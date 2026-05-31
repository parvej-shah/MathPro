"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn, setCookieWithDomain } from "@/helpers";

type LoginState = {
  login: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginState>({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerHref, setRegisterHref] = useState("/auth/register");
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");

  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    setRedirectUrl(redirect || "/dashboard");
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace(redirectUrl);
    }
  }, [redirectUrl, router]);

  useEffect(() => {
    setRegisterHref(`/auth/register?redirect=${encodeURIComponent(redirectUrl)}`);
  }, [redirectUrl]);

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
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-page-bg text-foreground flex items-center justify-center px-4 py-14">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-5">Login</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm mb-1" htmlFor="login">
              Phone or Email
            </label>
            <input
              id="login"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.login}
              onChange={(e) => setForm((p) => ({ ...p, login: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 text-white py-2.5 font-semibold disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link className="text-emerald-600 hover:underline" href="/auth/forgot-password">
            Forgot password?
          </Link>
          <a className="text-emerald-600 hover:underline" href={registerHref}>
            Register
          </a>
        </div>
      </section>
    </main>
  );
}
