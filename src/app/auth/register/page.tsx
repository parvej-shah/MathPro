"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import bcrypt from "bcryptjs-react";
import { BACKEND_URL } from "@/api.config";
import { isLoggedIn, setCookieWithDomain } from "@/helpers";

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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterState>(initialState);
  const [otp, setOtp] = useState("");
  const [otpHash, setOtpHash] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/dashboard");

  useEffect(() => {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    setRedirectUrl(redirect || "/dashboard");
  }, []);
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
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.response?.data?.data || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-page-bg text-foreground flex items-center justify-center px-4 py-14">
      <section className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-5">Register</h1>
        <form className="space-y-3" onSubmit={submitForm}>
          <input className="w-full rounded-lg border border-input bg-background px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <input className="w-full rounded-lg border border-input bg-background px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
          <input type="email" className="w-full rounded-lg border border-input bg-background px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <input type="password" className="w-full rounded-lg border border-input bg-background px-3 py-2" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          <input type="password" className="w-full rounded-lg border border-input bg-background px-3 py-2" placeholder="Confirm password" value={form.confirmPass} onChange={(e) => setForm((p) => ({ ...p, confirmPass: e.target.value }))} required />
          <input className="w-full rounded-lg border border-input bg-background px-3 py-2" placeholder="Current Institution" value={form.currentInstitution} onChange={(e) => setForm((p) => ({ ...p, currentInstitution: e.target.value }))} required />
          <input className="w-full rounded-lg border border-input bg-background px-3 py-2" placeholder="Department (optional)" value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} />
          <select className="w-full rounded-lg border border-input bg-background px-3 py-2" value={form.currentAcademicLevel} onChange={(e) => setForm((p) => ({ ...p, currentAcademicLevel: e.target.value }))} required>
            <option value="">Current Academic Level</option>
            <option value="SSC">SSC</option>
            <option value="HSC">HSC</option>
            <option value="UNIVERSITY">University</option>
            <option value="OTHERS">Others</option>
          </select>
          <select className="w-full rounded-lg border border-input bg-background px-3 py-2" value={form.interestedTopic} onChange={(e) => setForm((p) => ({ ...p, interestedTopic: e.target.value }))}>
            <option value="">Interested Topic (optional)</option>
            <option value="WEB">Web</option>
            <option value="Android">Android</option>
            <option value="COMPETITIVEPROGRAMMING">Competitive Programming</option>
          </select>

          {showOtp ? (
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          ) : null}

          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-emerald-600 text-white py-2.5 font-semibold disabled:opacity-70">
            {loading ? "Please wait..." : showOtp ? "Verify & Register" : "Send OTP"}
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link href={loginHref} className="text-emerald-600 hover:underline">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
