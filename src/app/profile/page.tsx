"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toBanglaError } from "@/app/auth/_components/error-bn";

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
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              width?: number;
              logo_alignment?: "left" | "center";
            },
          ) => void;
        };
      };
    };
    __mathProGoogleScriptPromise?: Promise<void>;
  }
}

type ProfileFormState = {
  name: string;
  phone: string;
  facebookId: string;
  address: string;
  schoolCollege: string;
  guardianName: string;
  guardianMobile: string;
  relationWithGuardian: string;
  gender: "" | "Male" | "Female" | "Other";
  classLevel: "" | "JSC" | "SSC" | "HSC";
  version: "" | "Bangla" | "English";
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const cardClass = "rounded-2xl border border-border bg-card p-6 sm:p-7";
const fieldClass =
  "h-12 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20";
const inputClass = fieldClass;
const selectClass = `${fieldClass} cursor-pointer`;
const textareaClass = `${fieldClass} h-24 resize-none py-3 leading-relaxed`;
const labelClass = "mb-1.5 block text-xs font-medium text-muted-foreground";

const emptyProfileForm: ProfileFormState = {
  name: "",
  phone: "",
  facebookId: "",
  address: "",
  schoolCollege: "",
  guardianName: "",
  guardianMobile: "",
  relationWithGuardian: "",
  gender: "",
  classLevel: "",
  version: "",
};

const emptyPasswordForm: PasswordFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const normalizePhone = (value: string) => value.trim().replace(/\s+/g, "");

const isBangladeshPhone = (value: string) => {
  const cleaned = normalizePhone(value).replace(/\D/g, "");
  return cleaned.length === 11 && cleaned.startsWith("01") && /^01[3-9]\d{8}$/.test(cleaned);
};

export default function ProfilePage() {
  const { profile, loading, error, refetch } = useUserProfile();
  const [profileForm, setProfileForm] = useState<ProfileFormState>(emptyProfileForm);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>(emptyPasswordForm);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [googleConnecting, setGoogleConnecting] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("");
  const [googleError, setGoogleError] = useState("");
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const [googleChangeOpen, setGoogleChangeOpen] = useState(false);
  const [phoneChangeOpen, setPhoneChangeOpen] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneChanging, setPhoneChanging] = useState(false);
  const [phoneChangeError, setPhoneChangeError] = useState("");
  const [phoneChangeMessage, setPhoneChangeMessage] = useState("");

  useEffect(() => {
    if (!profile) return;

    const frameId = window.requestAnimationFrame(() => {
      setProfileForm({
        name: profile.name || "",
        phone: profile.phone || profile.profile?.phone || "",
        facebookId: profile.profile?.facebookId || "",
        address: profile.profile?.address || "",
        schoolCollege: profile.profile?.schoolCollege || "",
        guardianName: profile.profile?.guardianName || "",
        guardianMobile: profile.profile?.guardianMobile || "",
        relationWithGuardian: profile.profile?.relationWithGuardian || "",
        gender: profile.profile?.gender || "",
        classLevel: profile.profile?.classLevel || "",
        version: profile.profile?.version || "",
      });
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [profile]);

  const submitProfile = async (e: FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage("");
    setProfileError("");

    const cleanedGuardianMobile = profileForm.guardianMobile.trim();

    if (!profileForm.name.trim()) {
      setProfileError("নাম অবশ্যই দিতে হবে।");
      setProfileSaving(false);
      return;
    }

    if (cleanedGuardianMobile && !isBangladeshPhone(cleanedGuardianMobile)) {
      setProfileError("অভিভাবকের জন্য সঠিক ফোন নম্বর দিন।");
      setProfileSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.put(
        `${BACKEND_URL}/user/profile`,
        {
          name: profileForm.name.trim(),
          facebookId: profileForm.facebookId.trim() || null,
          address: profileForm.address.trim() || null,
          schoolCollege: profileForm.schoolCollege.trim() || null,
          guardianName: profileForm.guardianName.trim() || null,
          guardianMobile: cleanedGuardianMobile || null,
          relationWithGuardian: profileForm.relationWithGuardian.trim() || null,
          gender: profileForm.gender || null,
          classLevel: profileForm.classLevel || null,
          version: profileForm.version || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setProfileMessage(response.data?.message || "প্রোফাইল আপডেট হয়েছে।");
      await refetch();
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? toBanglaError(err.response?.data?.error)
        : err instanceof Error
          ? err.message
          : undefined;
      setProfileError(message || "প্রোফাইল আপডেট করা যায়নি।");
    } finally {
      setProfileSaving(false);
    }
  };

  const submitPassword = async (e: FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage("");
    setPasswordError("");

    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordError("নতুন পাসওয়ার্ড দুটি এক হয়নি।");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.put(
        `${BACKEND_URL}/user/profile/password`,
        {
          currentPassword: passwordForm.currentPassword || undefined,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      setPasswordMessage(response.data?.message || "পাসওয়ার্ড আপডেট হয়েছে।");
      setPasswordForm(emptyPasswordForm);
      await refetch();
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? toBanglaError(err.response?.data?.error)
        : err instanceof Error
          ? err.message
          : undefined;
      setPasswordError(message || "পাসওয়ার্ড আপডেট করা যায়নি।");
    } finally {
      setPasswordSaving(false);
    }
  };

  const sendPhoneOtp = async () => {
    setPhoneChangeError("");
    setPhoneChangeMessage("");
    const cleaned = newPhone.trim();
    if (!cleaned || !isBangladeshPhone(cleaned)) {
      setPhoneChangeError("সঠিক বাংলাদেশি ফোন নম্বর দাও (০১ দিয়ে শুরু)।");
      return;
    }
    setPhoneChanging(true);
    try {
      const res = await axios.post(
        `${BACKEND_URL}/admin/auth/request-otp`,
        { contact: cleaned, purpose: "phone_change" },
      );
      setPhoneOtpSent(true);
      setPhoneChangeMessage(res.data?.message || "OTP পাঠানো হয়েছে।");
      if (res.data?.otp) setPhoneOtp(res.data.otp);
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? toBanglaError(err.response?.data?.error)
        : undefined;
      setPhoneChangeError(message || "OTP পাঠানো যায়নি।");
    } finally {
      setPhoneChanging(false);
    }
  };

  const submitPhoneChange = async () => {
    setPhoneChangeError("");
    setPhoneChangeMessage("");
    if (!phoneOtp.trim()) {
      setPhoneChangeError("OTP কোড দাও।");
      return;
    }
    setPhoneChanging(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");
      const res = await axios.put(
        `${BACKEND_URL}/user/profile/phone`,
        { newPhone: newPhone.trim(), otp: phoneOtp.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPhoneChangeMessage(toBanglaError(res.data?.message) || "ফোন নম্বর আপডেট হয়েছে।");
      setPhoneChangeOpen(false);
      setNewPhone("");
      setPhoneOtp("");
      setPhoneOtpSent(false);
      await refetch();
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? toBanglaError(err.response?.data?.error)
        : undefined;
      setPhoneChangeError(message || "ফোন নম্বর আপডেট করা যায়নি।");
      setPhoneChangeOpen(false);
      setPhoneOtpSent(false);
      setNewPhone("");
      setPhoneOtp("");
      await refetch();
    } finally {
      setPhoneChanging(false);
    }
  };

  const handleGoogleConnect = useCallback(async (credential: string) => {
    setGoogleConnecting(true);
    setGoogleMessage("");
    setGoogleError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication required");
      const res = await axios.post(
        `${BACKEND_URL}/admin/auth/connect-google`,
        { id_token: credential },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setGoogleMessage(res.data?.message || "Google অ্যাকাউন্ট কানেক্ট হয়েছে।");
      setGoogleChangeOpen(false);
      await refetch();
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? toBanglaError(err.response?.data?.error)
        : undefined;
      setGoogleError(message || "Google কানেক্ট করা যায়নি।");
      setGoogleChangeOpen(false);
      await refetch();
    } finally {
      setGoogleConnecting(false);
    }
  }, [refetch]);

  const hasGoogle = profile?.auth_providers?.includes("google");

  const cooldownDaysLeft = (changedAt?: string) => {
    if (!changedAt) return 0;
    const elapsed = (Date.now() - new Date(changedAt).getTime()) / (1000 * 60 * 60 * 24);
    return elapsed < 7 ? Math.ceil(7 - elapsed) : 0;
  };
  const phoneCooldown = cooldownDaysLeft(profile?.profile?.phone_changed_at);
  const emailCooldown = cooldownDaysLeft(profile?.profile?.email_changed_at);

  useEffect(() => {
    if (phoneCooldown > 0 && phoneChangeOpen) setPhoneChangeOpen(false);
    if (emailCooldown > 0 && googleChangeOpen) setGoogleChangeOpen(false);
  }, [phoneCooldown, emailCooldown, phoneChangeOpen, googleChangeOpen]);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current || (hasGoogle && !googleChangeOpen) || (hasGoogle && emailCooldown > 0)) return;
    let cancelled = false;

    const render = () => {
      if (cancelled || !googleButtonRef.current || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: ({ credential }) => {
          if (credential) handleGoogleConnect(credential);
        },
      });
      googleButtonRef.current.innerHTML = "";
      const w = Math.min(320, googleButtonRef.current.parentElement?.clientWidth || 320);
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: w,
        logo_alignment: "left",
      });
    };

    const load = () => {
      if (window.google?.accounts?.id) return Promise.resolve();
      if (!window.__mathProGoogleScriptPromise) {
        window.__mathProGoogleScriptPromise = new Promise<void>((resolve, reject) => {
          const existing = document.querySelector(
            'script[src="https://accounts.google.com/gsi/client"]',
          ) as HTMLScriptElement | null;
          if (existing) {
            existing.addEventListener("load", () => resolve(), { once: true });
            existing.addEventListener("error", () => reject(), { once: true });
            return;
          }
          const s = document.createElement("script");
          s.src = "https://accounts.google.com/gsi/client";
          s.async = true;
          s.defer = true;
          s.onload = () => resolve();
          s.onerror = () => reject();
          document.head.appendChild(s);
        });
      }
      return window.__mathProGoogleScriptPromise;
    };

    load().then(render).catch(() => setGoogleError("Google স্ক্রিপ্ট লোড হয়নি।"));
    return () => { cancelled = true; };
  }, [googleClientId, hasGoogle, googleChangeOpen, emailCooldown, handleGoogleConnect]);

  const requiresCurrentPassword = profile?.has_password !== false;

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-2">
      <section className="space-y-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-heading sm:text-3xl">
          ব্যক্তিগত তথ্য
        </h1>
        <p className="text-sm text-muted-foreground">
          ইমেইল আর লগইন অপরিবর্তিত থাকবে। বাকি তথ্যগুলো ভর্তি ফর্ম, পেমেন্ট আর সাপোর্টের জন্য এখানে আপডেট করো।
        </p>
      </section>

      {loading ? <p className="text-sm text-muted-foreground">প্রোফাইল লোড হচ্ছে...</p> : null}
      {!loading && (error || profileError) ? (
        <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {profileError || error}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className={`${cardClass} space-y-6`}>
          <div>
            <h2 className="text-lg font-bold text-heading">অ্যাকাউন্ট তথ্য</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              পেমেন্ট, প্রোফাইল আর ভবিষ্যৎ কাস্টমাইজেশনের জন্য এই তথ্যগুলো ব্যবহার হবে।
            </p>
          </div>

          <form className="space-y-6" onSubmit={submitProfile}>
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-heading">মৌলিক তথ্য</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="profile-name">
                    নাম
                  </label>
                  <input
                    id="profile-name"
                    className={inputClass}
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-phone">
                    ফোন নম্বর
                  </label>
                  <input
                    id="profile-phone"
                    className={`${inputClass} cursor-not-allowed bg-muted text-muted-foreground`}
                    value={profileForm.phone || "ফোন নম্বর নেই"}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="profile-gender">
                    লিঙ্গ
                  </label>
                  <select
                    id="profile-gender"
                    className={selectClass}
                    value={profileForm.gender}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        gender: e.target.value as ProfileFormState["gender"],
                      }))
                    }
                  >
                    <option value="">বেছে নাও</option>
                    <option value="Male">পুরুষ</option>
                    <option value="Female">নারী</option>
                    <option value="Other">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-email">
                    ইমেইল
                  </label>
                  <input
                    id="profile-email"
                    className={`${inputClass} cursor-not-allowed bg-muted text-muted-foreground`}
                    value={profile?.email || profile?.profile?.email || "ইমেইল পাওয়া যায়নি"}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-heading">যোগাযোগ</h3>
              <div>
                <label className={labelClass} htmlFor="profile-facebook">
                  ফেসবুক আইডি
                </label>
                <input
                  id="profile-facebook"
                  className={inputClass}
                  value={profileForm.facebookId}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, facebookId: e.target.value }))}
                  placeholder="facebook.com/..."
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="profile-address">
                  ঠিকানা
                </label>
                <textarea
                  id="profile-address"
                  className={textareaClass}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="বাড়ি, রোড, এলাকা, জেলা"
                />
              </div>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-heading">শিক্ষাগত তথ্য</h3>
              <div>
                <label className={labelClass} htmlFor="profile-school">
                  স্কুল / কলেজ
                </label>
                <input
                  id="profile-school"
                  className={inputClass}
                  value={profileForm.schoolCollege}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, schoolCollege: e.target.value }))}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="profile-class">
                    ক্লাস
                  </label>
                  <select
                    id="profile-class"
                    className={selectClass}
                    value={profileForm.classLevel}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        classLevel: e.target.value as ProfileFormState["classLevel"],
                      }))
                    }
                  >
                    <option value="">বেছে নাও</option>
                    <option value="JSC">JSC</option>
                    <option value="SSC">SSC</option>
                    <option value="HSC">HSC</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-version">
                    ভার্সন
                  </label>
                  <select
                    id="profile-version"
                    className={selectClass}
                    value={profileForm.version}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        version: e.target.value as ProfileFormState["version"],
                      }))
                    }
                  >
                    <option value="">বেছে নাও</option>
                    <option value="Bangla">Bangla</option>
                    <option value="English">English</option>
                    </select>
                  </div>
                </div>
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-semibold text-heading">অভিভাবক তথ্য</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="profile-guardian">
                    অভিভাবকের নাম
                  </label>
                  <input
                    id="profile-guardian"
                    className={inputClass}
                    value={profileForm.guardianName}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, guardianName: e.target.value }))}
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="profile-guardian-mobile">
                    অভিভাবকের মোবাইল
                  </label>
                  <input
                    id="profile-guardian-mobile"
                    className={inputClass}
                    placeholder="01XXXXXXXXX"
                    value={profileForm.guardianMobile}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, guardianMobile: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="profile-guardian-relation">
                  অভিভাবকের সাথে সম্পর্ক
                </label>
                <input
                  id="profile-guardian-relation"
                  className={inputClass}
                  value={profileForm.relationWithGuardian}
                  onChange={(e) =>
                    setProfileForm((prev) => ({ ...prev, relationWithGuardian: e.target.value }))
                  }
                  placeholder="যেমন: বাবা, মা, ভাই"
                />
              </div>
            </div>

            {profileMessage ? (
              <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                {profileMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={profileSaving || loading}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {profileSaving ? "সেভ হচ্ছে..." : "প্রোফাইল সেভ করো"}
            </button>
          </form>
        </section>

        <div className="space-y-6">
          <section className={`${cardClass} space-y-4`}>
            <div>
              <h2 className="text-lg font-bold text-heading">ফোন নম্বর</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {profileForm.phone
                  ? "ফোন নম্বর পরিবর্তন করতে নতুন নম্বরে OTP যাচাই করতে হবে।"
                  : "ফোন নম্বর যোগ করলে ফোন দিয়ে লগইন করতে পারবে।"}
              </p>
            </div>

            {profileForm.phone && (
              <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                বর্তমান নম্বর:{" "}
                <span className="font-medium text-foreground">{profileForm.phone}</span>
              </p>
            )}

            {!phoneChangeOpen ? (
              <div className="relative group">
                <button
                  type="button"
                  disabled={phoneCooldown > 0}
                  title={phoneCooldown > 0 ? `আরো ${phoneCooldown} দিন পর পরিবর্তন করা যাবে। ৭ দিনে একবার পরিবর্তন করা যায়।` : undefined}
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-sm font-semibold text-primary transition hover:bg-primary/15 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    setPhoneChangeOpen(true);
                    setPhoneChangeError("");
                    setPhoneChangeMessage("");
                    setNewPhone("");
                    setPhoneOtp("");
                    setPhoneOtpSent(false);
                  }}
                >
                  {profileForm.phone ? "পরিবর্তন করো" : "যোগ করো"}
                </button>
                {phoneCooldown > 0 && (
                  <p className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-center text-xs text-amber-700 dark:text-amber-400">
                    ৭ দিনে একবার পরিবর্তন করা যায়। আরো {phoneCooldown} দিন অপেক্ষা করো।
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={labelClass} htmlFor="new-phone">
                    নতুন ফোন নম্বর
                  </label>
                  <input
                    id="new-phone"
                    type="tel"
                    className={inputClass}
                    placeholder="01XXXXXXXXX"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    disabled={phoneOtpSent}
                  />
                </div>
                {phoneOtpSent && (
                  <div>
                    <label className={labelClass} htmlFor="phone-otp">
                      OTP কোড
                    </label>
                    <input
                      id="phone-otp"
                      type="text"
                      className={inputClass}
                      placeholder="SMS এ পাওয়া OTP"
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                    />
                  </div>
                )}

                {phoneChangeError ? (
                  <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {phoneChangeError}
                  </p>
                ) : null}
                {phoneChangeMessage ? (
                  <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                    {phoneChangeMessage}
                  </p>
                ) : null}

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={phoneChanging}
                    className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
                    onClick={phoneOtpSent ? submitPhoneChange : sendPhoneOtp}
                  >
                    {phoneChanging
                      ? "অপেক্ষা করো..."
                      : phoneOtpSent
                        ? "আপডেট করো"
                        : "OTP পাঠাও"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-12 items-center justify-center rounded-lg border border-border px-4 text-sm font-semibold text-muted-foreground transition hover:bg-muted"
                    onClick={() => {
                      setPhoneChangeOpen(false);
                      setPhoneChangeError("");
                      setPhoneChangeMessage("");
                      setNewPhone("");
                      setPhoneOtp("");
                      setPhoneOtpSent(false);
                    }}
                  >
                    বাতিল
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className={`${cardClass} space-y-4`}>
            <div>
              <h2 className="text-lg font-bold text-heading">
                {requiresCurrentPassword ? "পাসওয়ার্ড বদলাও" : "পাসওয়ার্ড সেট করো"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {requiresCurrentPassword
                  ? "আগের পাসওয়ার্ড দিলে নতুন পাসওয়ার্ড সেট করতে পারবে।"
                  : "তুমি এখন পাসওয়ার্ড ছাড়া সাইন ইন করছো। চাইলে এখান থেকে প্রথমবারের মতো পাসওয়ার্ড সেট করতে পারবে।"}
              </p>
            </div>

            <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
              Login methods:{" "}
              <span className="font-medium text-foreground">
                {profile?.auth_providers?.length ? profile.auth_providers.join(", ") : "password"}
              </span>
            </p>

            <form className="space-y-4" onSubmit={submitPassword}>
              {requiresCurrentPassword ? (
                <div>
                  <label className={labelClass} htmlFor="current-password">
                    বর্তমান পাসওয়ার্ড
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    className={inputClass}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    required
                  />
                </div>
              ) : null}

              <div>
                <label className={labelClass} htmlFor="new-password">
                  নতুন পাসওয়ার্ড
                </label>
                <input
                  id="new-password"
                  type="password"
                  className={inputClass}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className={labelClass} htmlFor="confirm-password">
                  নতুন পাসওয়ার্ড আবার লেখো
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className={inputClass}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  required
                />
              </div>

              {passwordError ? (
                <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {passwordError}
                </p>
              ) : null}
              {passwordMessage ? (
                <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                  {passwordMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={passwordSaving || loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-sm font-semibold text-primary transition hover:bg-primary/15 disabled:opacity-60"
              >
                {passwordSaving
                  ? "আপডেট হচ্ছে..."
                  : requiresCurrentPassword
                    ? "পাসওয়ার্ড বদলাও"
                    : "পাসওয়ার্ড সেট করো"}
              </button>
            </form>
          </section>

          {googleClientId ? (
            <section className={`${cardClass} space-y-4`}>
              <div>
                <h2 className="text-lg font-bold text-heading">Google অ্যাকাউন্ট</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {hasGoogle
                    ? "তোমার অ্যাকাউন্টে Google কানেক্ট করা আছে। Google দিয়েও লগইন করতে পারবে।"
                    : "Google কানেক্ট করলে Google দিয়েও লগইন করতে পারবে এবং ইমেইল যুক্ত হবে।"}
                </p>
              </div>

              {hasGoogle && (
                <p className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
                  ✓ Google কানেক্ট আছে {profile?.email ? `(${profile.email})` : ""}
                </p>
              )}

              {hasGoogle && emailCooldown > 0 ? (
                <div>
                  <button
                    type="button"
                    disabled
                    title={`আরো ${emailCooldown} দিন পর পরিবর্তন করা যাবে। ৭ দিনে একবার পরিবর্তন করা যায়।`}
                    className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-sm font-semibold text-primary opacity-50 cursor-not-allowed"
                  >
                    পরিবর্তন করো
                  </button>
                  <p className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-center text-xs text-amber-700 dark:text-amber-400">
                    ৭ দিনে একবার পরিবর্তন করা যায়। আরো {emailCooldown} দিন অপেক্ষা করো।
                  </p>
                </div>
              ) : hasGoogle && !googleChangeOpen ? (
                <button
                  type="button"
                  className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-sm font-semibold text-primary transition hover:bg-primary/15"
                  onClick={() => {
                    setGoogleChangeOpen(true);
                    setGoogleError("");
                    setGoogleMessage("");
                  }}
                >
                  পরিবর্তন করো
                </button>
              ) : (
                <div className="space-y-3">
                  <div className={googleConnecting ? "pointer-events-none opacity-70" : ""}>
                    <div ref={googleButtonRef} className="flex justify-center" />
                  </div>
                  {googleChangeOpen && (
                    <button
                      type="button"
                      className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-border text-sm font-semibold text-muted-foreground transition hover:bg-muted"
                      onClick={() => {
                        setGoogleChangeOpen(false);
                        setGoogleError("");
                        setGoogleMessage("");
                      }}
                    >
                      বাতিল
                    </button>
                  )}
                </div>
              )}

              {googleError ? (
                <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {googleError}
                </p>
              ) : null}
              {googleMessage ? (
                <p className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                  {googleMessage}
                </p>
              ) : null}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
