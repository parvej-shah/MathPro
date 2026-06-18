"use client";

import { FormEvent, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn, handlePostLoginRedirect, clearAuthToken } from "@/helpers";
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
    __mathProGoogleAuthInitializedFor?: string;
    __mathProGoogleScriptPromise?: Promise<void>;
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
  const redirectUrlRef = useRef(redirectUrl);
  const routerRef = useRef(router);
  // Once a force_logout has been honored, stay on the form for the rest of this
  // navigation. Prevents a re-adopted token (shared cookie / SSO re-mirror) from
  // silently bouncing the user back to the app they just logged out of.
  const forcedLogoutRef = useRef(false);
  const registerHref = useMemo(
    () => `/auth/register?redirect=${encodeURIComponent(redirectUrl)}`,
    [redirectUrl],
  );

  useEffect(() => {
    redirectUrlRef.current = redirectUrl;
    routerRef.current = router;
  }, [redirectUrl, router]);

  useEffect(() => {
    // Read force_logout from the live URL, not useSearchParams(): during
    // hydration the hook can return empty params on the first effect run, losing
    // the race to the isLoggedIn() branch below — which would fire
    // handlePostLoginRedirect and bounce a still-logged-in admin straight back
    // to the admin app, defeating the logout. window.location.search is always
    // populated synchronously.
    const liveForceLogout =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("force_logout") === "1";
    if (liveForceLogout || forcedLogoutRef.current) {
      forcedLogoutRef.current = true;
      clearAuthToken();
      const url = new URL(window.location.href);
      url.searchParams.delete("force_logout");
      window.history.replaceState({}, "", url.pathname + url.search);
      return;
    }
    if (isLoggedIn()) {
      const existing =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (existing) {
        handlePostLoginRedirect(existing, redirectUrl, router);
      }
    }
  }, [redirectUrl, router, searchParams]);

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
      handlePostLoginRedirect(token, redirectUrl, router);
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

    const handleGoogleCredential = async ({ credential }: { credential?: string }) => {
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
        handlePostLoginRedirect(token, redirectUrlRef.current, routerRef.current);
      } catch (err: unknown) {
        const message = axios.isAxiosError<{ error?: string }>(err)
          ? err.response?.data?.error
          : undefined;
        setError(message || "Google লগইন করা যায়নি। আবার চেষ্টা করো।");
      } finally {
        setGoogleLoading(false);
      }
    };

    const renderGoogleButton = () => {
      if (
        cancelled ||
        !googleButtonRef.current ||
        !window.google?.accounts?.id
      ) {
        return;
      }

      if (window.__mathProGoogleAuthInitializedFor !== googleClientId) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
        });
        window.__mathProGoogleAuthInitializedFor = googleClientId;
      }

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

    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        return Promise.resolve();
      }

      if (!window.__mathProGoogleScriptPromise) {
        window.__mathProGoogleScriptPromise = new Promise<void>((resolve, reject) => {
          const existingScript = document.querySelector(
            'script[src="https://accounts.google.com/gsi/client"]',
          ) as HTMLScriptElement | null;

          if (existingScript) {
            existingScript.addEventListener("load", () => resolve(), { once: true });
            existingScript.addEventListener(
              "error",
              () => reject(new Error("Failed to load Google Sign-In script")),
              { once: true },
            );
            return;
          }

          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load Google Sign-In script"));
          document.head.appendChild(script);
        });
      }

      return window.__mathProGoogleScriptPromise;
    };

    loadGoogleScript()
      .then(() => {
        renderGoogleButton();
      })
      .catch(() => {
        setError("Google লগইন লোড করা যায়নি। পরে আবার চেষ্টা করো।");
      });

    return () => {
      cancelled = true;
    };
  }, [googleClientId]);

  return (
    <AuthShell
      title="আবার শুরু করো"
      description="তোমার লাইভ ক্লাস, রেকর্ডেড লেকচার আর প্র্যাকটিস সব এক জায়গায় ফিরে পাবে।"
    >
      {googleClientId ? (
        <div className="space-y-3">
          <div className="flex justify-center">
            <div
              className={[
                "mx-auto",
                googleLoading ? "pointer-events-none opacity-70" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              ref={googleButtonRef}
            />
          </div>
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
          className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "লগইন হচ্ছে..." : "লগইন করো"}
        </button>
      </form>

      <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <Link className="font-medium text-primary hover:underline" href={`/auth/forgot-password?redirect=${encodeURIComponent(redirectUrl)}`}>
          পাসওয়ার্ড ভুলে গেছ?
        </Link>
        <Link className="font-medium text-primary hover:underline" href={registerHref}>
          নতুন অ্যাকাউন্ট খুলো
        </Link>
      </div>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageContent />
    </Suspense>
  );
}
