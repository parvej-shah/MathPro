"use client";

import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn, setCookieWithDomain } from "@/helpers";
import AuthShell from "../_components/AuthShell";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?:
                | "signin_with"
                | "signup_with"
                | "continue_with"
                | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
              logo_alignment?: "left" | "center";
            },
          ) => void;
        };
      };
    };
  }
}

type LoginState = {
  login: string;
  password: string;
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState<LoginState>({ login: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
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

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;

    let cancelled = false;
    let createdScript: HTMLScriptElement | null = null;
    let existingScriptLoadHandler: (() => void) | null = null;
    let existingScriptErrorHandler: (() => void) | null = null;

    const renderGoogleButton = () => {
      if (
        cancelled ||
        !googleButtonRef.current ||
        !window.google?.accounts?.id
      ) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async ({ credential }) => {
          if (!credential) {
            setError("Google লগইন টোকেন পাওয়া যায়নি। আবার চেষ্টা করো।");
            return;
          }

          setGoogleLoading(true);
          setError("");

          try {
            const res = await axios.post(`${BACKEND_URL}/admin/auth/google`, {
              id_token: credential,
            });
            const token = res?.data?.token;
            if (!token) {
              throw new Error("Missing token in Google login response");
            }
            localStorage.setItem("token", token);
            setCookieWithDomain("token", token, ".mathpro.org");
            router.replace(redirectUrl);
          } catch (err: unknown) {
            const message = axios.isAxiosError<{ error?: string }>(err)
              ? err.response?.data?.error
              : undefined;
            setError(message || "Google লগইন করা যায়নি। আবার চেষ্টা করো।");
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      googleButtonRef.current.innerHTML = "";
      const buttonWidth = Math.min(
        360,
        googleButtonRef.current.parentElement?.clientWidth || 360,
      );
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: buttonWidth,
        logo_alignment: "left",
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScriptLoadHandler = () => renderGoogleButton();
      existingScriptErrorHandler = () => {
        setError("Google লগইন লোড করা যায়নি। পরে আবার চেষ্টা করো।");
      };
      existingScript.addEventListener("load", existingScriptLoadHandler);
      existingScript.addEventListener("error", existingScriptErrorHandler);
    } else {
      createdScript = document.createElement("script");
      createdScript.src = "https://accounts.google.com/gsi/client";
      createdScript.async = true;
      createdScript.defer = true;
      createdScript.onload = renderGoogleButton;
      createdScript.onerror = () => {
        setError("Google লগইন লোড করা যায়নি। পরে আবার চেষ্টা করো।");
      };
      document.head.appendChild(createdScript);
    }

    return () => {
      cancelled = true;
      if (existingScript && existingScriptLoadHandler) {
        existingScript.removeEventListener("load", existingScriptLoadHandler);
      }
      if (existingScript && existingScriptErrorHandler) {
        existingScript.removeEventListener("error", existingScriptErrorHandler);
      }
      if (createdScript) {
        createdScript.onload = null;
        createdScript.onerror = null;
      }
    };
  }, [googleClientId, redirectUrl, router]);

  return (
    <AuthShell
      title="আবার শুরু করো"
      description="তোমার লাইভ ক্লাস, রেকর্ডেড লেকচার আর প্র্যাকটিস সব এক জায়গায় ফিরে পাবে।"
    >
      {googleClientId ? (
        <div className="space-y-3">
          <div
            className={googleLoading ? "pointer-events-none opacity-70" : ""}
            ref={googleButtonRef}
          />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              অথবা
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-1.5 block text-sm font-semibold" htmlFor="login">
            ইমেইল
          </label>
          <input
            id="login"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25"
            placeholder="তোমার ইমেইল"
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
