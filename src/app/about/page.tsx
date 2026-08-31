import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে | MathPro Academy",
  description:
    "MathPro Academic and Admission Care — বাংলাদেশের জেএসসি, এসএসসি ও এইচএসসি শিক্ষার্থীদের গণিত ভীতি দূর করে সেরা প্রস্তুতি নিশ্চিত করার অনলাইন প্ল্যাটফর্ম।",
};

export default function AboutPage() {
  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      {/* Hero Header */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-white/10 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" /> আমাদের পরিচিতি
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 font-heading">
            গণিত ভয়ের নয়, <span className="text-emerald-400">বোঝার এবং জয়ের বিষয়</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            <strong className="text-white">MathPro Academic and Admission Care</strong> বাংলাদেশের শিক্ষার্থীদের গণিতের মৌলিক ভিত্তি মজবুত করতে এবং বোর্ড ও ভর্তি পরীক্ষায় সর্বোচ্চ ফলাফল অর্জনে প্রতিশ্রুতিবদ্ধ একটি বিশ্বস্ত এডটেক প্রতিষ্ঠান।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20">

        {/* ─── Company Background & Mission ─── */}
        <section className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Building2 className="w-4 h-4" /> প্রতিষ্ঠান সম্পর্কে
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              আমাদের লক্ষ্য ও দৃষ্টিভঙ্গি
            </h2>
            <p className="text-slate-300 leading-relaxed">
              মুখস্থবিদ্যা নয়, গণিতের প্রতিটি সূত্র ও নিয়মের পেছনের যুক্তি শিক্ষার্থীদের সামনে সহজবোধ্যভাবে তুলে ধরাই আমাদের মূল লক্ষ্য। JSC, SSC ও HSC শিক্ষার্থীদের জন্য সম্পূর্ণ বাংলা ও ইংরেজি উভয় মাধ্যমে মানসম্মত ভিডিও লেকচার, লাইভ প্র্যাকটিস ক্লাস, কুইজ ও মডেল টেস্টের মাধ্যমে আমরা শিক্ষার্থীদের পূর্ণাঙ্গ প্রস্তুতি নিশ্চিত করি।
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">১১+ বছর</div>
                <div className="text-xs text-slate-400 font-semibold">অভিজ্ঞতা ও পাঠদান</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 mb-1">৫,০০০+</div>
                <div className="text-xs text-slate-400 font-semibold">সফল শিক্ষার্থী</div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950/30 border border-emerald-500/20 space-y-5">
            <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" /> আমাদের সেবাসমূহ
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span><strong>লাইভ ও রেকর্ডেড ক্লাস:</strong> প্রতিটি অধ্যায়ের মৌলিক ধারণা থেকে অ্যাডভান্সড সমস্যা সমাধান।</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span><strong>লাইভ ডাউট সলভ:</strong> শিক্ষার্থীদের যেকোনো অংকের সমস্যা সরাসরি শিক্ষকের সাথে সমাধান।</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span><strong>অধ্যায়ভিত্তিক এক্সাম ও টেস্ট পেপার সলভ:</strong> নিয়মিত পরীক্ষা ও লিডারবোর্ডের মাধ্যমে অগ্রগতি যাচাই।</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span><strong>ডিজিটাল ও মুদ্রিত ম্যাটেরিয়ালস:</strong> বিষয়ভিত্তিক হ্যান্ডনোট, ফর্মুলা শিট ও সহায়ক বই।</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ─── Management & Leadership Details ─── */}
        <section className="space-y-8 pt-8 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-2">
              <Users className="w-4 h-4" /> ব্যবস্থাপনা ও শিক্ষক মণ্ডলী
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
              ম্যানেজমেন্ট ও ফ্যাকাল্টি
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              শিক্ষা ও প্রযুক্তি ক্ষেত্রে দীর্ঘ অভিজ্ঞতাসম্পন্ন দলের পরিচালনায় পরিচালিত MathPro।
            </p>
          </div>

          <div className="max-w-3xl mx-auto rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shrink-0 border-2 border-emerald-400/40 bg-emerald-950">
              <Image
                src="/assets/proffesionalFounder.webp"
                alt="Abdul Aziz - Founder & Lead Instructor"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
                  Founder & Lead Instructor
                </span>
                <h3 className="text-2xl font-extrabold text-white">Abdul Aziz</h3>
                <p className="text-xs sm:text-sm text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                  <GraduationCap className="w-4 h-4" /> University of Dhaka
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                গত ১১ বছরেরও বেশি সময় ধরে শিক্ষকতার সাথে যুক্ত। ঢাকা বিশ্ববিদ্যালয় থেকে গণিতে উচ্চশিক্ষা সম্পন্ন করে হাজার হাজার শিক্ষার্থীকে গণিতের ভীতি কাটিয়ে বোর্ড পরীক্ষায় A+ ও বিভিন্ন প্রতিযোগিতামূলক পরীক্ষায় সফল হতে সরাসরি দিকনির্দেশনা দিয়েছেন।
              </p>
              <div className="flex flex-wrap gap-4 pt-1 justify-center sm:justify-start text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" /> ১১+ বছর অভিজ্ঞতা
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-400" /> ৫,০০০+ মেন্টরড শিক্ষার্থী
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Business & Legal Information ─── */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">
              আইনি ও প্রাতিষ্ঠানিক তথ্য (Legal & Compliance)
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">প্রতিষ্ঠানের নাম</span>
              <p className="text-base font-semibold text-white">MathPro Academic and Admission Care</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">ব্যবসার ধরন</span>
              <p className="text-base font-semibold text-white">অনলাইন শিক্ষা সেবা ও ডিজিটাল কন্টেন্ট (E-Learning LMS)</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">নিবন্ধিত অফিস ঠিকানা</span>
              <p className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ৫১/১/এ-১, নোবেল ভিলা, উত্তর মুগদা, ঢাকা-১২১৪, বাংলাদেশ
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">যোগাযোগের মাধ্যম</span>
              <p className="text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="mailto:mathprobdofficial@gmail.com" className="hover:text-emerald-400 transition-colors">
                  mathprobdofficial@gmail.com
                </a>
              </p>
              <p className="text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href="tel:+8801521323689" className="hover:text-emerald-400 transition-colors">
                  +880 1521-323689
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">ডিজিটাল কমার্স পলিসি ২০২১ কমপ্লায়েন্স</span>
              <p className="text-slate-300 leading-relaxed text-xs">
                বাণিজ্য মন্ত্রণালয়ের ডিজিটাল ই-কমার্স নির্দেশিকা ২০২১ ও প্রচলিত আইন অনুসারে পরিচালিত। পেমেন্ট প্রসেসিংয়ের জন্য অনুমোদিত গেটওয়ে SSLCommerz ব্যবহৃত হয়।
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">ডেলিভারি নীতি সংক্ষেপ</span>
              <p className="text-slate-300 leading-relaxed text-xs">
                • <strong>অনলাইন কোর্স:</strong> সফল পেমেন্টের সাথে সাথেই তাৎক্ষণিক অ্যাক্সেস।<br />
                • <strong>মুদ্রিত বই:</strong> অর্ডারের পর ৩-৫ কার্যদিবসের মধ্যে কুরিয়ার মাধ্যমে হোম ডেলিভারি।
              </p>
            </div>
          </div>
        </section>

        {/* ─── Navigation CTA ─── */}
        <div className="text-center pt-6">
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-full transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 text-sm sm:text-base"
          >
            আমাদের কোর্সসমূহ দেখুন
          </Link>
        </div>

      </div>
    </main>
  );
}
