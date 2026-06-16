"use client";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { useUserProfile } from "@/hooks/useUserProfile";

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

    const cleanedPhone = profileForm.phone.trim();
    const cleanedGuardianMobile = profileForm.guardianMobile.trim();

    if (!profileForm.name.trim()) {
      setProfileError("নাম অবশ্যই দিতে হবে।");
      setProfileSaving(false);
      return;
    }

    if (cleanedPhone && !isBangladeshPhone(cleanedPhone)) {
      setProfileError("সঠিক বাংলাদেশি ফোন নম্বর দিন।");
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
          phone: cleanedPhone || null,
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
        ? err.response?.data?.error
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
        ? err.response?.data?.error
        : err instanceof Error
          ? err.message
          : undefined;
      setPasswordError(message || "পাসওয়ার্ড আপডেট করা যায়নি।");
    } finally {
      setPasswordSaving(false);
    }
  };

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
                    className={inputClass}
                    placeholder="01XXXXXXXXX"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
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
                    value={profile?.email || profile?.profile?.email || ""}
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
        </div>
      </div>
    </div>
  );
}
