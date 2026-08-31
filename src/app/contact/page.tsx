import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock, MessageSquare, Building2, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "যোগাযোগ | MathPro Academy",
  description:
    "MathPro Academic and Admission Care — আমাদের সাথে যোগাযোগ করুন। ঠিকানা, ফোন নম্বর, ইমেইল ও সাপোর্ট সেবা।",
};

export default function ContactPage() {
  return (
    <main className="bg-slate-950 text-slate-200 min-h-screen">
      {/* Header */}
      <section className="relative py-20 lg:py-24 border-b border-white/10 bg-gradient-to-b from-emerald-950/40 via-slate-950 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-4">
            <MessageSquare className="w-3.5 h-3.5" /> যোগাযোগ ও সহায়তা
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 font-heading">
            আমাদের সাথে যোগাযোগ করুন
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            কোর্স সংক্রান্ত যেকোনো তথ্য, টেকনিক্যাল সাপোর্ট বা ভর্তি সংক্রান্ত প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করতে পারেন।
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Phone */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">ফোন ও হোয়াটসঅ্যাপ</h2>
              <p className="text-xs text-slate-400">সরাসরি কল বা হোয়াটসঅ্যাপে মেসেজ দিন</p>
            </div>
            <div className="pt-6">
              <a
                href="tel:+8801521323689"
                className="text-base font-bold text-emerald-400 hover:underline block"
              >
                +880 1521-323689
              </a>
              <span className="text-[11px] text-slate-500 block mt-1">সকাল ৯:০০ - রাত ১০:০০</span>
            </div>
          </div>

          {/* Email */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">অফিশিয়াল ইমেইল</h2>
              <p className="text-xs text-slate-400">যেকোনো প্রাতিষ্ঠানিক বা টেকনিক্যাল সহায়তায়</p>
            </div>
            <div className="pt-6">
              <a
                href="mailto:mathprobdofficial@gmail.com"
                className="text-sm font-bold text-emerald-400 hover:underline break-all block"
              >
                mathprobdofficial@gmail.com
              </a>
              <span className="text-[11px] text-slate-500 block mt-1">২৪ ঘণ্টার মধ্যে রেসপন্স</span>
            </div>
          </div>

          {/* Office Address */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="size-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white">নিবন্ধিত অফিস</h2>
              <p className="text-xs text-slate-400">MathPro Academic and Admission Care</p>
            </div>
            <div className="pt-4">
              <address className="not-italic text-xs text-slate-300 leading-relaxed">
                ৫১/১/এ-১, নোবেল ভিলা, উত্তর মুগদা, ঢাকা-১২১৪, বাংলাদেশ
              </address>
            </div>
          </div>

        </div>

        {/* Detailed Registered Company Information */}
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold text-white">প্রতিষ্ঠানের নিবন্ধন ও প্রশাসনিক তথ্য</h2>
              <p className="text-xs text-slate-400">Bangladesh Digital E-Commerce Policy 2021 & SSLCommerz Compliance</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">প্রতিষ্ঠানের নাম</span>
              <p className="font-semibold text-white">MathPro Academic and Admission Care</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">প্ল্যাটফর্ম ডোমেইন</span>
              <p className="font-semibold text-emerald-400">mathpro.academy</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">সাপোর্ট সময়সূচী</span>
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" /> সকাল ৯:০০ - রাত ১০:০০
              </p>
            </div>
            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">অফিস ঠিকানা (Registered Office Address)</span>
              <p className="text-slate-300 leading-relaxed">
                MathPro Academic and Admission Care, ৫১/১/এ-১, নোবেল ভিলা, উত্তর মুগদা, ঢাকা-১২১৪, বাংলাদেশ
              </p>
            </div>
          </div>
        </div>

        {/* FAQ or Help Prompt */}
        <div className="p-6 rounded-3xl bg-emerald-950/30 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <HelpCircle className="w-8 h-8 text-emerald-400 shrink-0 hidden sm:block" />
            <div>
              <h3 className="font-bold text-white text-base">পেমেন্ট বা কোর্স অ্যাক্সেসে সমস্যা?</h3>
              <p className="text-xs text-slate-400 mt-0.5">আমাদের রিফান্ড ও রিটার্ন নীতিমালার বিস্তারিত দেখতে পারেন</p>
            </div>
          </div>
          <a
            href="/refund"
            className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
          >
            রিফান্ড পলিসি দেখুন →
          </a>
        </div>

      </div>
    </main>
  );
}
