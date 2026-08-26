"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import founderPhoto from "../../../public/assets/proffesionalFounder.webp";
import {
  Sparkles,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  Star,
  ChevronRight,
  Award,
  BookOpen,
  Zap,
} from "lucide-react";

export default function HeroVariantsPage() {
  const [activeVariant, setActiveVariant] = useState<number>(1);
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");

  const founder = {
    name: "Abdul Aziz",
    role: "ফাউন্ডার ও প্রধান মেন্টর",
    university: "Dhaka University",
  };

  const variants = [
    {
      id: 1,
      name: "The Kinetic Orbital",
      tagline: "Linear & Apple Keynote inspired with orbit rings & hand badge",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[450px] pt-10 sm:pt-14 flex flex-col items-center">
          {/* Ambient Glow */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[360px] sm:w-[440px] h-[360px] sm:h-[440px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(52, 211, 153, 0.28) 0%, rgba(16, 185, 129, 0.12) 40%, rgba(6, 78, 59, 0.05) 65%, transparent 80%)",
            }}
          />
          {/* Orbit Rings */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[340px] sm:w-[420px] h-[340px] sm:h-[420px] rounded-full border border-emerald-400/15 pointer-events-none" />
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[270px] sm:w-[330px] h-[270px] sm:h-[330px] rounded-full border border-dashed border-emerald-400/15 pointer-events-none" />

          {/* Top-Left Badge */}
          <div className="absolute -left-2 sm:-left-6 top-16 sm:top-20 z-20 bg-emerald-950/85 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-emerald-400/25 shadow-[0_12px_28px_rgba(0,0,0,0.65)] flex items-center gap-2.5">
            <div className="size-7 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300">
              <Sparkles className="size-3.5" />
            </div>
            <span className="text-white text-xs font-bold tracking-tight">A+ স্পেশালিস্ট</span>
          </div>

          {/* Hand Position Credential Badge */}
          <div className="absolute -right-1 sm:-right-4 lg:-right-6 bottom-20 sm:bottom-24 z-20 bg-emerald-950/95 backdrop-blur-xl px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-emerald-400/30 shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-3">
            <div className="size-8 sm:size-9 rounded-xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
              <TrendingUp className="text-emerald-400 size-4" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm sm:text-base leading-none mb-0.5">১১+ বছর</div>
              <div className="text-emerald-200/80 text-[10px] sm:text-[11px] font-semibold tracking-wide">৫,০০০+ মেন্টরড</div>
            </div>
          </div>

          {/* Instructor Image */}
          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-6 sm:pb-8">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[96%] sm:w-[92%] h-auto object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] drop-shadow-[0_0_35px_rgba(52,211,153,0.3)] brightness-[1.08] contrast-[1.04] saturate-[1.08]"
              sizes="440px"
            />
          </div>

          {/* Bottom Name Card */}
          <div className="absolute left-2 right-2 sm:left-4 sm:right-4 bottom-0 z-20 bg-emerald-950/90 backdrop-blur-xl px-5 py-3 sm:py-3.5 rounded-2xl border border-emerald-400/30 shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-extrabold text-lg sm:text-xl font-heading leading-tight tracking-tight">
                    {founder.name}
                  </span>
                  <span className="inline-flex items-center justify-center size-4 rounded-full bg-emerald-400/20 text-emerald-400">
                    <CheckCircle2 className="size-3.5 text-emerald-400" />
                  </span>
                </div>
                <div className="text-emerald-300/80 text-xs sm:text-sm font-medium mt-0.5">
                  {founder.role}
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-400/20 text-emerald-200 text-xs font-medium shrink-0">
                <GraduationCap className="size-3.5 shrink-0 text-emerald-400" />
                <span>{founder.university}</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      name: "The Theatrical Spotlight",
      tagline: "MasterClass style minimalist luxury with warm emerald backlight",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[440px] pt-8 flex flex-col items-center">
          {/* Deep Theatrical Glow */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(52, 211, 153, 0.35) 0%, rgba(16, 185, 129, 0.15) 35%, transparent 70%)",
            }}
          />

          {/* Minimalist Single Hand Badge */}
          <div className="absolute -right-2 sm:-right-6 bottom-24 z-20 bg-slate-950/90 backdrop-blur-xl px-4 py-3 rounded-2xl border border-emerald-400/40 shadow-[0_20px_40px_rgba(0,0,0,0.85)] flex items-center gap-3">
            <div className="size-10 rounded-xl bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Award className="size-5" />
            </div>
            <div>
              <div className="text-white font-extrabold text-base leading-tight">১১+ বছর মেন্টরিং</div>
              <div className="text-emerald-300 text-xs font-medium">৫,০০০+ সফল শিক্ষার্থী</div>
            </div>
          </div>

          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-6">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[94%] h-auto object-contain object-bottom drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)] brightness-[1.08] contrast-[1.05]"
              sizes="440px"
            />
          </div>

          {/* Minimal Pill Nameplate */}
          <div className="absolute left-6 right-6 bottom-0 z-20 bg-slate-950/90 backdrop-blur-2xl px-5 py-3 rounded-full border border-white/15 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-base">{founder.name}</span>
              <CheckCircle2 className="size-4 text-emerald-400" />
            </div>
            <span className="text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/20">
              DU Math
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      name: "The Math Matrix & Particles",
      tagline: "Brilliant.org style with floating KaTeX formulas & grid depth",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[450px] pt-10 flex flex-col items-center">
          {/* Subtle Math Formulas Floating in 3D */}
          <div className="absolute top-8 left-0 text-emerald-400/25 font-serif text-3xl select-none pointer-events-none -rotate-12 animate-pulse">
            f(x) = x²
          </div>
          <div className="absolute top-20 right-2 text-teal-300/25 font-serif text-4xl select-none pointer-events-none rotate-12">
            ∫ eˣ dx
          </div>
          <div className="absolute bottom-32 left-2 text-emerald-400/20 font-serif text-5xl select-none pointer-events-none">
            ∑
          </div>

          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 70%)",
            }}
          />

          {/* Hand Credential */}
          <div className="absolute -right-2 sm:-right-4 bottom-22 z-20 bg-emerald-950/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-emerald-400/30 shadow-2xl flex items-center gap-2.5">
            <Zap className="size-4 text-emerald-400" />
            <div>
              <div className="text-white font-bold text-sm leading-none">১১+ বছর অভিজ্ঞতা</div>
              <div className="text-emerald-300/80 text-[11px]">৫,০০০+ শিক্ষার্থী</div>
            </div>
          </div>

          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-6">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[92%] h-auto object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] brightness-[1.07]"
              sizes="440px"
            />
          </div>

          <div className="absolute left-4 right-4 bottom-0 z-20 bg-emerald-950/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-emerald-400/30 shadow-xl flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-base">{founder.name}</div>
              <div className="text-emerald-300 text-xs">ম্যাথ স্পেশালিস্ট • DU</div>
            </div>
            <div className="size-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300">
              <BookOpen className="size-4" />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      name: "Dual Hologram Cards",
      tagline: "Stripe & Framer style with balanced asymmetrical floating glass cards",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[450px] pt-10 flex flex-col items-center">
          {/* Ambient light */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[360px] h-[360px] rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

          {/* Top-Left Card: DU Alma Mater */}
          <div className="absolute -left-2 sm:-left-6 top-16 z-20 bg-emerald-950/85 backdrop-blur-xl px-3.5 py-2.5 rounded-2xl border border-emerald-400/25 shadow-xl flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-emerald-400/15 flex items-center justify-center text-emerald-400">
              <GraduationCap className="size-4" />
            </div>
            <div>
              <div className="text-white text-xs font-extrabold leading-tight">ঢাকা বিশ্ববিদ্যালয়</div>
              <div className="text-emerald-300/70 text-[10px]">অনার্স ও মাস্টার্স</div>
            </div>
          </div>

          {/* Hand-Level Card: Mentorship */}
          <div className="absolute -right-2 sm:-right-6 bottom-20 z-20 bg-emerald-950/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-emerald-400/30 shadow-2xl flex items-center gap-3">
            <div className="size-9 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm leading-tight">১১+ বছর</div>
              <div className="text-emerald-200/80 text-[11px] font-semibold">৫,০০০+ মেন্টরড</div>
            </div>
          </div>

          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-6">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[94%] h-auto object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] brightness-[1.07]"
              sizes="440px"
            />
          </div>

          <div className="absolute left-3 right-3 bottom-0 z-20 bg-emerald-950/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-emerald-400/30 shadow-2xl flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-lg leading-tight flex items-center gap-1.5">
                {founder.name}
                <CheckCircle2 className="size-4 text-emerald-400" />
              </div>
              <div className="text-emerald-300 text-xs">{founder.role}</div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-emerald-900/80 text-emerald-200 text-xs font-semibold">
              Lead Mentor
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      name: "The Frosted Arch Podium",
      tagline: "Reforge / Maven style with low-profile frosted arch stage",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[440px] pt-12 flex flex-col items-center">
          {/* Frosted Arch Stage */}
          <div className="absolute top-24 inset-x-2 bottom-2 rounded-t-[3.5rem] rounded-b-[2rem] bg-linear-to-b from-emerald-500/10 via-emerald-950/40 to-slate-950/90 border border-emerald-400/20 backdrop-blur-xs shadow-2xl" />

          {/* Hand Credential */}
          <div className="absolute -right-2 sm:-right-4 bottom-22 z-20 bg-emerald-950/95 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-emerald-400/30 shadow-xl flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-400/20 flex items-center justify-center text-emerald-300">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-none">১১+ বছর</div>
              <div className="text-emerald-300/80 text-[10px]">৫,০০০+ শিক্ষার্থী</div>
            </div>
          </div>

          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-6">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[92%] h-auto object-contain object-bottom drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)] brightness-[1.08]"
              sizes="440px"
            />
          </div>

          <div className="absolute left-4 right-4 bottom-0 z-20 bg-emerald-950/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-emerald-400/30 shadow-2xl flex items-center justify-between">
            <div>
              <div className="text-white font-extrabold text-base flex items-center gap-1">
                {founder.name}
                <CheckCircle2 className="size-3.5 text-emerald-400" />
              </div>
              <div className="text-emerald-300/80 text-xs">ফাউন্ডার, MathPro</div>
            </div>
            <div className="flex items-center gap-1 text-emerald-200 text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-900/60 border border-emerald-500/20">
              <GraduationCap className="size-3 text-emerald-400" />
              <span>DU</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      name: "Social Proof Orbit",
      tagline: "Shikho / 10MS top tier with star rating badge & verified tag",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[440px] pt-10 flex flex-col items-center">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[360px] h-[360px] rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

          {/* Top-Left Star Rating Badge */}
          <div className="absolute -left-2 sm:-left-6 top-16 z-20 bg-emerald-950/90 backdrop-blur-xl px-3.5 py-2 rounded-2xl border border-amber-400/30 shadow-xl flex items-center gap-2">
            <div className="size-7 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400">
              <Star className="size-4 fill-amber-400" />
            </div>
            <div>
              <div className="text-white text-xs font-extrabold leading-tight">৪.৯/৫ রেটিং</div>
              <div className="text-amber-300/70 text-[10px]">১,০০০+ রিভিউ</div>
            </div>
          </div>

          {/* Hand Credential */}
          <div className="absolute -right-2 sm:-right-4 bottom-22 z-20 bg-emerald-950/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-emerald-400/30 shadow-2xl flex items-center gap-3">
            <div className="size-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="size-4" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm leading-none mb-0.5">১১+ বছর</div>
              <div className="text-emerald-200/80 text-[11px] font-semibold">৫,০০০+ মেন্টরড</div>
            </div>
          </div>

          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-6">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[94%] h-auto object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] brightness-[1.08]"
              sizes="440px"
            />
          </div>

          <div className="absolute left-3 right-3 bottom-0 z-20 bg-emerald-950/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-emerald-400/30 shadow-2xl flex items-center justify-between">
            <div>
              <div className="text-white font-extrabold text-lg leading-tight flex items-center gap-1.5">
                {founder.name}
                <CheckCircle2 className="size-4 text-emerald-400" />
              </div>
              <div className="text-emerald-300 text-xs">{founder.role}</div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-400/20 text-emerald-200 text-xs font-medium">
              <GraduationCap className="size-3.5 text-emerald-400" />
              <span>{founder.university}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      name: "The Unified Floating Capsule",
      tagline: "Vercel / Next.js minimalist with zero top clutter and single base capsule",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[440px] pt-4 flex flex-col items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-emerald-400/18 blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-6">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[94%] h-auto object-contain object-bottom drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] brightness-[1.07]"
              sizes="440px"
            />
          </div>

          {/* Unified All-in-one Capsule */}
          <div className="absolute left-1 right-1 sm:left-2 sm:right-2 bottom-0 z-20 bg-slate-950/85 backdrop-blur-2xl px-5 py-3 rounded-full border border-white/15 shadow-[0_20px_40px_rgba(0,0,0,0.9)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <span className="text-white font-extrabold text-sm sm:text-base">{founder.name}</span>
                <span className="text-emerald-300/80 text-xs ml-2">DU Math</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              ১১+ বছর • ৫k+ মেন্টরড
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      name: "Neon Rim Glow & Sparkline",
      tagline: "High-energy tech style with emerald neon rim aura and live pulse indicator",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[440px] pt-10 flex flex-col items-center">
          {/* Neon Halo */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[360px] h-[360px] rounded-full bg-emerald-400/30 blur-2xl pointer-events-none" />

          {/* Top-Right Glowing Chip */}
          <div className="absolute -right-2 sm:-right-4 top-18 z-20 bg-emerald-950/90 backdrop-blur-xl px-3 py-1.5 rounded-full border border-emerald-400/40 shadow-lg flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-300 text-xs font-bold">Live Mentor</span>
          </div>

          {/* Hand Credential */}
          <div className="absolute -right-2 sm:-right-4 bottom-22 z-20 bg-slate-950/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-emerald-400/40 shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center gap-3">
            <div className="size-8 rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950">
              <TrendingUp className="size-4 stroke-[3]" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm leading-none">১১+ বছর</div>
              <div className="text-emerald-300 text-[11px] font-bold">৫,০০০+ শিক্ষার্থী</div>
            </div>
          </div>

          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-6">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[94%] h-auto object-contain object-bottom drop-shadow-[0_0_30px_rgba(52,211,153,0.4)] drop-shadow-[0_25px_40px_rgba(0,0,0,0.85)] brightness-[1.09] contrast-[1.06]"
              sizes="440px"
            />
          </div>

          <div className="absolute left-3 right-3 bottom-0 z-20 bg-emerald-950/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-emerald-400/35 shadow-2xl flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-lg leading-tight flex items-center gap-1.5">
                {founder.name}
                <CheckCircle2 className="size-4 text-emerald-400" />
              </div>
              <div className="text-emerald-300 text-xs">{founder.role}</div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-900/70 border border-emerald-400/30 text-emerald-200 text-xs font-medium">
              <GraduationCap className="size-3.5 text-emerald-400" />
              <span>{founder.university}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      name: "Asymmetric Split Depth",
      tagline: "Raycast style diagonal balance with crisp typography & frosted cards",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[440px] pt-10 flex flex-col items-center">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[380px] h-[380px] rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />

          {/* Top-Right Pill */}
          <div className="absolute -right-2 sm:-right-4 top-14 z-20 bg-emerald-950/90 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-emerald-400/30 shadow-lg flex items-center gap-2">
            <Sparkles className="size-3.5 text-emerald-400" />
            <span className="text-white text-xs font-bold">A+ স্পেশালিস্ট</span>
          </div>

          {/* Lower Hand Pill */}
          <div className="absolute -right-2 sm:-right-4 bottom-22 z-20 bg-emerald-950/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-emerald-400/30 shadow-2xl flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-400">
              <Award className="size-4" />
            </div>
            <div>
              <div className="text-white font-extrabold text-sm leading-none">১১+ বছর</div>
              <div className="text-emerald-200/80 text-[10px]">৫,০০০+ মেন্টরড</div>
            </div>
          </div>

          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-6">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[94%] h-auto object-contain object-bottom drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] brightness-[1.07]"
              sizes="440px"
            />
          </div>

          <div className="absolute left-2 right-2 bottom-0 z-20 bg-emerald-950/90 backdrop-blur-xl px-5 py-3 rounded-2xl border border-emerald-400/30 shadow-2xl flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-lg flex items-center gap-1.5">
                {founder.name}
                <CheckCircle2 className="size-4 text-emerald-400" />
              </div>
              <div className="text-emerald-300 text-xs">{founder.role}</div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-400/20 text-emerald-200 text-xs font-medium flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-emerald-400" />
              <span>{founder.university}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      name: "Executive 3-Pillar Glass Bar",
      tagline: "Harvard / Coursera Plus style with wide 3-column institutional footer",
      render: () => (
        <div className="relative w-[320px] sm:w-[380px] lg:w-[460px] pt-6 flex flex-col items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-400/22 blur-3xl pointer-events-none" />

          <div className="relative z-10 w-full flex items-end justify-center select-none pointer-events-none pb-8">
            <Image
              src={founderPhoto}
              alt="Abdul Aziz"
              priority
              className="w-[94%] h-auto object-contain object-bottom drop-shadow-[0_30px_50px_rgba(0,0,0,0.9)] brightness-[1.08]"
              sizes="460px"
            />
          </div>

          {/* 3-Pillar Symmetrical Footer Bar */}
          <div className="absolute left-0 right-0 bottom-0 z-20 bg-slate-950/90 backdrop-blur-2xl px-4 py-3 rounded-2xl border border-white/15 shadow-2xl grid grid-cols-3 divide-x divide-white/10 items-center text-center">
            <div className="px-2">
              <div className="text-white font-extrabold text-sm truncate flex items-center justify-center gap-1">
                {founder.name}
                <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
              </div>
              <div className="text-emerald-300 text-[10px] truncate">ফাউন্ডার & মেন্টর</div>
            </div>
            <div className="px-2">
              <div className="text-white font-extrabold text-sm truncate">Dhaka Univ.</div>
              <div className="text-emerald-300/80 text-[10px] truncate">গণিত বিভাগ</div>
            </div>
            <div className="px-2">
              <div className="text-white font-extrabold text-sm truncate">১১+ বছর</div>
              <div className="text-emerald-300/80 text-[10px] truncate">৫,০০০+ মেন্টরড</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = variants.find((v) => v.id === activeVariant) || variants[0];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navbar */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-emerald-400 font-bold hover:underline flex items-center gap-1 text-sm"
            >
              ← Back to Home
            </Link>
            <span className="text-white/30">•</span>
            <span className="text-white font-bold text-lg">
              Hero Founder 3D Variants Showroom
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50">Preview Mode:</span>
            <button
              onClick={() => setDeviceView("desktop")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                deviceView === "desktop"
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setDeviceView("mobile")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                deviceView === "mobile"
                  ? "bg-emerald-400 text-slate-950"
                  : "bg-white/10 text-white/70 hover:bg-white/15"
              }`}
            >
              Mobile (390px)
            </button>
          </div>
        </div>
      </div>

      {/* Variant Selector Tabs */}
      <div className="bg-slate-900/50 border-b border-white/10 px-6 py-3 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto flex gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVariant(v.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                activeVariant === v.id
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                  : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="size-5 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px]">
                {v.id}
              </span>
              <span>{v.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero Canvas Area */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>Variant {current.id}:</span>
              <span className="text-emerald-400">{current.name}</span>
            </h1>
            <p className="text-white/60 text-sm mt-0.5">{current.tagline}</p>
          </div>
          <div className="text-xs text-emerald-300/80 bg-emerald-950/80 border border-emerald-500/20 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
            Live Interactive Preview
          </div>
        </div>

        {/* Realistic Hero Canvas */}
        <div
          className={`mx-auto rounded-3xl bg-emerald-950 border border-emerald-800/60 overflow-hidden relative shadow-2xl transition-all duration-300 ${
            deviceView === "mobile" ? "max-w-[420px]" : "w-full"
          }`}
        >
          <div className="absolute inset-0 bg-linear-to-br from-emerald-900 via-emerald-950 to-slate-950" />
          <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 px-6 py-12 lg:px-12 lg:py-16">
            <div
              className={`grid ${
                deviceView === "mobile"
                  ? "grid-cols-1 gap-10"
                  : "lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center max-w-6xl mx-auto"
              }`}
            >
              {/* Left Hero Text Column */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-300 text-xs font-semibold mb-6">
                  <Sparkles className="size-3.5 text-emerald-400" />
                  <span>English Version ও Bangla Medium | JSC, SSC ও HSC</span>
                </div>

                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-6">
                  গণিত ভয়ের নয়,
                  <br />
                  <span className="text-emerald-400">বোঝার এবং জয়ের বিষয়</span>
                </h2>

                <p className="text-base lg:text-lg text-emerald-50/75 mb-8 max-w-lg leading-relaxed">
                  ক্লাস ৮ থেকে HSC — মুখস্থ নয়, প্রতিটি কনসেপ্ট গোড়া থেকে বুঝে শেখো।
                  লাইভ ডাউট সলভ, রেগুলার এক্সাম ও টেস্ট পেপার সলভিংয়ে বোর্ড পরীক্ষায় গণিতে নিশ্চিত করো A+।
                </p>

                <div className="flex items-center gap-4">
                  <span className="px-8 py-3.5 bg-emerald-400 text-emerald-950 font-bold rounded-full text-base flex items-center gap-2">
                    তোমার কোর্স বেছে নাও
                    <ChevronRight className="size-4" />
                  </span>
                </div>
              </div>

              {/* Right Teacher Column - Render Current Variant */}
              <div className="flex justify-center items-end">
                {current.render()}
              </div>
            </div>
          </div>
        </div>

        {/* All 10 Variants Grid at the Bottom for Quick Visual Comparison */}
        <div className="mt-20 border-t border-white/10 pt-12">
          <h2 className="text-2xl font-extrabold text-white mb-2">
            All 10 Variants Overview (Click to Select)
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Click any variant card below to inspect it live in the hero preview above.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setActiveVariant(v.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  activeVariant === v.id
                    ? "bg-emerald-950/80 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-[1.02]"
                    : "bg-slate-900/60 border-white/10 hover:border-emerald-400/40 hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="size-6 rounded-full bg-emerald-400/20 text-emerald-300 font-extrabold text-xs flex items-center justify-center">
                    {v.id}
                  </span>
                  {activeVariant === v.id && (
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                      Active
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{v.name}</h3>
                <p className="text-white/50 text-xs line-clamp-2">{v.tagline}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
