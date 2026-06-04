"use client";

import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";
import { useUserProfile } from "@/hooks/useUserProfile";

type ProfileFormState = {
  name: string;
  email: string;
  phone: string;
  currentInstitution: string;
  department: string;
  currentAcademicLevel: "" | "SSC" | "HSC" | "UNIVERSITY" | "OTHERS";
};

type PasswordFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const profileCardClass =
  "rounded-3xl border border-border/70 bg-card/88 p-5 shadow-xl shadow-primary/10 backdrop-blur-xl sm:p-7";
const inputClass =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/25";

export default function MyProfilePage() {
  const { profile, loading, error, refetch } = useUserProfile();
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    name: "",
    email: "",
    phone: "",
    currentInstitution: "",
    department: "",
    currentAcademicLevel: "",
  });
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
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
        email: profile.email || profile.profile?.email || profile.login || "",
        phone: profile.phone || profile.profile?.phone || "",
        currentInstitution: profile.profile?.currentInstitution || "",
        department: profile.profile?.department || "",
        currentAcademicLevel: profile.profile?.currentAcademicLevel || "",
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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios.put(
        `${BACKEND_URL}/user/profile`,
        {
          name: profileForm.name.trim(),
          email: profileForm.email.trim(),
          phone: profileForm.phone.trim() || null,
          currentInstitution: profileForm.currentInstitution.trim() || null,
          department: profileForm.department.trim() || null,
          currentAcademicLevel: profileForm.currentAcademicLevel || null,
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
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      await refetch();
    } catch (err: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(err)
        ? err.response?.data?.error
        : undefined;
      setPasswordError(message || "পাসওয়ার্ড আপডেট করা যায়নি।");
    } finally {
      setPasswordSaving(false);
    }
  };

  const requiresCurrentPassword = profile?.has_password !== false;

  return (
    <div className="space-y-6">
      <section className={profileCardClass}>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          My Profile
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-heading">প্রোফাইল সেটিংস</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          এখানে তোমার বেসিক তথ্য আপডেট করতে পারবে। Google দিয়ে ঢুকলেও এখান থেকে চাইলে পাসওয়ার্ড সেট করতে পারবে।
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className={profileCardClass}>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-heading">অ্যাকাউন্ট তথ্য</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              checkout, dashboard আর future personalization এর জন্য এই তথ্যগুলো কাজে লাগবে।
            </p>
          </div>

          {loading ? <p className="text-sm text-muted-foreground">প্রোফাইল লোড হচ্ছে...</p> : null}
          {!loading && (error || profileError) ? (
            <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {profileError || error}
            </p>
          ) : null}

          <form className="space-y-4" onSubmit={submitProfile}>
            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-name">
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-email">
                  ইমেইল
                </label>
                <input id="profile-email" className={`${inputClass} opacity-80`} value={profileForm.email} readOnly />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-phone">
                  ফোন
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

            <div>
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-institution">
                শিক্ষা প্রতিষ্ঠান
              </label>
              <input
                id="profile-institution"
                className={inputClass}
                value={profileForm.currentInstitution}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, currentInstitution: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-department">
                  ডিপার্টমেন্ট
                </label>
                <input
                  id="profile-department"
                  className={inputClass}
                  value={profileForm.department}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, department: e.target.value }))}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="profile-level">
                  একাডেমিক লেভেল
                </label>
                <select
                  id="profile-level"
                  className={inputClass}
                  value={profileForm.currentAcademicLevel}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      currentAcademicLevel: e.target.value as ProfileFormState["currentAcademicLevel"],
                    }))
                  }
                >
                  <option value="">বেছে নাও</option>
                  <option value="SSC">SSC</option>
                  <option value="HSC">HSC</option>
                  <option value="UNIVERSITY">University</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>
            </div>

            {profileMessage ? (
              <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
                {profileMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={profileSaving || loading}
              className="rounded-xl bg-linear-to-r from-primary to-primary/85 px-5 py-3 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 disabled:translate-y-0 disabled:opacity-70"
            >
              {profileSaving ? "সেভ হচ্ছে..." : "প্রোফাইল সেভ করো"}
            </button>
          </form>
        </section>

        <section className={profileCardClass}>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-heading">
              {requiresCurrentPassword ? "পাসওয়ার্ড বদলাও" : "পাসওয়ার্ড সেট করো"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {requiresCurrentPassword
                ? "আগের পাসওয়ার্ড দিলে নতুন পাসওয়ার্ড সেট করতে পারবে।"
                : "তুমি এখন Google দিয়ে সাইন ইন করছো। চাইলে এখান থেকে প্রথমবারের মতো পাসওয়ার্ড সেট করতে পারবে।"}
            </p>
          </div>

          <div className="mb-4 rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground">
            <p>
              Login methods:{" "}
              <span className="font-semibold text-foreground">
                {profile?.auth_providers?.length
                  ? profile.auth_providers.join(", ")
                  : "password"}
              </span>
            </p>
          </div>

          <form className="space-y-4" onSubmit={submitPassword}>
            {requiresCurrentPassword ? (
              <div>
                <label className="mb-1.5 block text-sm font-semibold" htmlFor="current-password">
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
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="new-password">
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
              <label className="mb-1.5 block text-sm font-semibold" htmlFor="confirm-password">
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
              <p className="rounded-lg border border-destructive/25 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {passwordError}
              </p>
            ) : null}
            {passwordMessage ? (
              <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700">
                {passwordMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={passwordSaving || loading}
              className="w-full rounded-xl border border-primary/20 bg-primary/10 px-5 py-3 font-bold text-primary transition hover:bg-primary/15 disabled:opacity-70"
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
  );
}
