"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import bcrypt from "bcryptjs-react";
import { BACKEND_URL } from "@/api.config";

export default function ForgotPasswordPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpHash, setOtpHash] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");

  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    setRedirectUrl(redirect || "/dashboard");
  }, []);
  const loginHref = useMemo(
    () => `/auth/login?redirect=${encodeURIComponent(redirectUrl)}`,
    [redirectUrl],
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!showOtp) {
        const res = await axios.get(`${BACKEND_URL}/admin/auth/otp-forgot/${phone}`);
        setOtpHash(res?.data?.data?.otp || "");
        setShowOtp(true);
        setSuccess("OTP sent to your phone.");
        return;
      }

      if (!isPhoneVerified) {
        const ok = bcrypt.compareSync(otp, otpHash);
        if (!ok) {
          setError("Wrong OTP.");
          return;
        }
        setIsPhoneVerified(true);
        setSuccess("OTP verified. Set your new password.");
        return;
      }

      if (password !== confirmPass) {
        setError("Passwords do not match.");
        return;
      }

      await axios.put(`${BACKEND_URL}/admin/auth/change-password`, {
        phone,
        password,
      });
      setSuccess("Password changed successfully.");
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.data || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-page-bg text-foreground flex items-center justify-center px-4 py-14">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-5">Forgot Password</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <input
            className="w-full rounded-lg border border-input bg-background px-3 py-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {showOtp ? (
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          ) : null}
          {isPhoneVerified ? (
            <>
              <input
                type="password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2"
                placeholder="Confirm password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                required
              />
            </>
          ) : null}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-600 text-white py-2.5 font-semibold disabled:opacity-70">
            {loading
              ? "Please wait..."
              : !showOtp
                ? "Send OTP"
                : !isPhoneVerified
                  ? "Verify OTP"
                  : "Change Password"}
          </button>
        </form>
        <p className="mt-4 text-sm">
          <Link href={loginHref} className="text-emerald-600 hover:underline">
            Return to login
          </Link>
        </p>
      </section>
    </main>
  );
}
