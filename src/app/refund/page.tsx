import type { Metadata } from "next";
import Link from "next/link";
import { RotateCcw, Clock, ShieldCheck, Mail, Phone, AlertCircle, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "রিফান্ড ও রিটার্ন নীতি | MathPro Academy",
  description:
    "MathPro Academic and Admission Care-এর রিফান্ড ও রিটার্ন পলিসি — ডিজিটাল কোর্স এবং মুদ্রিত বই ক্রয়ের ক্ষেত্রে শর্তাবলী ও রিফান্ড প্রক্রিয়া।",
};

const refundSections = [
  {
    title: "১. ডিজিটাল কোর্স রিফান্ড নীতিমালা",
    points: [
      "MathPro প্ল্যাটফর্মের সকল কোর্স এবং কম্বো ডিজিটাল শিক্ষা উপকরণ (ভিডিও লেকচার, লাইভ ক্লাস অ্যাক্সেস, কুইজ ও প্র্যাকটিস ম্যাটেরিয়াল)। সফল পেমেন্টের সাথে সাথেই অ্যাকাউন্টে কোর্সের তাৎক্ষণিক ডিজিটাল অ্যাক্সেস চালু হয়ে যায়।",
      "ডিজিটাল কন্টেন্ট একবার ডেলিভারি বা ব্যবহার শুরু হওয়ার পর সাধারণ কারণে রিফান্ড প্রযোজ্য নয়।",
      "তবে নিম্নোক্ত কারিগরি বা অনিচ্ছাকৃত সমস্যার ক্ষেত্রে শিক্ষার্থী রিফান্ডের জন্য আবেদন করতে পারবেন:",
      "• একই কোর্সের জন্য অসাবধানতাবশত একাধিকবার (ডুপ্লিকেট) পেমেন্ট সম্পন্ন হলে।",
      "• কারিগরি ত্রুটির কারণে পেমেন্ট সফল হওয়ার পরও অ্যাকাউন্টে কোর্স অ্যাক্সেস চালু না হলে এবং সাপোর্ট টিম যুক্তিসঙ্গত সময়ে তা সমাধান করতে ব্যর্থ হলে।",
      "• ভুল কোর্সে পেমেন্ট করা হলে ২৪ ঘণ্টার মধ্যে সাপোর্ট টিমে যোগাযোগ সাপেক্ষে সঠিক কোর্সে স্থানান্তর বা রিফান্ড সমন্বয় করা যাবে।",
    ],
  },
  {
    title: "২. মুদ্রিত বই (Physical Books) রিটার্ন ও রিপ্লেসমেন্ট",
    points: [
      "মুদ্রিত বইয়ের ক্ষেত্রে কোনো ডেলিভারিকৃত বইয়ে মিসপ্রিন্ট, ছেঁড়া পাতা, বা ডেলিভারির সময় ক্ষতিগ্রস্ত হলে ডেলিভারি পাওয়ার ৭ (সাত) দিনের মধ্যে ছবিসহ আমাদের সাপোর্ট টিমে জানাতে হবে।",
      "যাচাই সাপেক্ষে ৩-৫ কার্যদিবসের মধ্যে কোনো অতিরিক্ত চার্জ ছাড়াই সম্পূর্ণ নতুন কপি রিপ্লেসমেন্ট (ডেলিভারি) দেওয়া হবে।",
      "বই ব্যবহারের পর কোনো পৃষ্ঠা নষ্ট করা হলে বা ব্যক্তিগত পছন্দ পরিবর্তনের কারণে বই রিটার্ন বা রিফান্ড গ্রহণ করা হবে না।",
    ],
  },
  {
    title: "৩. রিফান্ড প্রক্রিয়াকরণ সময়সীমা (Turnaround Time)",
    points: [
      "যেকোনো রিফান্ড আবেদনের ক্ষেত্রে আমাদের সাপোর্ট টিম সর্বোচ্চ ৩ কার্যদিবসের মধ্যে আবেদনটি যাচাই করবে।",
      "রিফান্ড অনুমোদিত হলে বাংলাদেশের ডিজিটাল কমার্স নীতিমালা ২০২১ এবং পেমেন্ট গেটওয়ে (SSLCommerz) নিয়মাবলী অনুসারে ৭ থেকে ১৪ কার্যদিবসের (7-14 Business Days) মধ্যে গ্রাহকের মূল পেমেন্ট মাধ্যমে (বিকাশ / নগদ / রকেট / ব্যাংক কার্ড) রিফান্ড সম্পন্ন করা হবে।",
      "পেমেন্ট গেটওয়ের সার্ভিস চার্জ বা ব্যাংকিং চার্জ প্রযোজ্য ক্ষেত্রে কর্তন সাপেক্ষে রিফান্ড করা হতে পারে।",
    ],
  },
  {
    title: "৪. কীভাবে রিফান্ডের আবেদন করবেন",
    points: [
      "রিফান্ড আবেদনের জন্য নিচের তথ্যসহ আমাদের অফিশিয়াল ইমেইল বা হেল্পলাইনে যোগাযোগ করতে হবে:",
      "• শিক্ষার্থীর নিবন্ধিত নাম ও মোবাইল নম্বর",
      "• পেমেন্ট ট্রানজেকশন আইডি (TrxID) ও পেমেন্ট মাধ্যম",
      "• ক্রয়কৃত কোর্স / বইয়ের নাম",
      "• রিফান্ড চাওয়ার সুনির্দিষ্ট কারণ ও প্রমাণ (প্রযোজ্য ক্ষেত্রে স্ক্রিনশট)",
    ],
  },
];

export default function RefundPage() {
  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      {/* Header */}
      <section className="relative py-20 lg:py-24 border-b border-white/10 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
            <RotateCcw className="w-3.5 h-3.5" /> রিটার্ন ও রিফান্ড নীতি
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 font-heading">
            রিফান্ড পলিসি
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            সর্বশেষ সংস্করণ: সেপ্টেম্বর ২০২৬ | ডিজিটাল ই-কমার্স নির্দেশিকা ২০২১ ও SSLCommerz কমপ্লায়েন্স অনুসারে প্রণীত
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-12">

        {/* Highlights Banner */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">৭-১৪ কার্যদিবস</div>
              <div className="text-xs text-slate-400 mt-0.5">অনুমোদিত রিফান্ড প্রসেসিং সময়</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">সরাসরি মূল মাধ্যমে</div>
              <div className="text-xs text-slate-400 mt-0.5">বিকাশ/নগদ/কার্ডে রিফান্ড প্রদান</div>
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">৭ দিনের রিপ্লেসমেন্ট</div>
              <div className="text-xs text-slate-400 mt-0.5">ক্ষতিগ্রস্ত বইয়ের ক্ষেত্রে</div>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10">
          {refundSections.map((section, idx) => (
            <section key={idx} className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-emerald-400">
                {section.title}
              </h2>
              <div className="space-y-2.5 text-sm text-slate-300 leading-relaxed">
                {section.points.map((pt, pIdx) => (
                  <p key={pIdx} className={pt.startsWith("•") ? "pl-4 text-slate-300" : ""}>
                    {pt}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact for Refund Support */}
        <section className="p-6 sm:p-8 rounded-3xl bg-emerald-950/40 border border-emerald-500/20 text-center space-y-4">
          <HelpCircle className="w-8 h-8 text-emerald-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">রিফান্ড সংক্রান্ত যেকোনো প্রয়োজনে</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            আপনার কোনো পেমেন্ট সমস্যা বা রিফান্ড সংক্রান্ত প্রশ্ন থাকলে আমাদের সাপোর্ট টিমের সাথে সরাসরি যোগাযোগ করুন:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-sm">
            <a
              href="mailto:mathprobdofficial@gmail.com"
              className="inline-flex items-center gap-2 text-emerald-400 hover:underline font-semibold"
            >
              <Mail className="w-4 h-4" /> mathprobdofficial@gmail.com
            </a>
            <a
              href="tel:+8801521323689"
              className="inline-flex items-center gap-2 text-emerald-400 hover:underline font-semibold"
            >
              <Phone className="w-4 h-4" /> +880 1521-323689
            </a>
          </div>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              যোগাযোগ পেজে যান →
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
