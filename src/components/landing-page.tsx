"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  CheckCircle2,
  PlayCircle,
  TrendingUp,
  ChevronRight,
  Star,
  MapPin,
  BookOpen,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Calculator,
  FlaskConical,
  Laptop,
  Users,
  Quote,
  ArrowUpRight,
  HelpCircle,
  MessageCircle,
  Plus,
  Minus
} from "lucide-react";

const slides = [
  {
    id: 1,
    title: "গণিতে আত্মবিশ্বাস গড়ুন",
    subtitle: "ক্লাস ৮ থেকে HSC পর্যন্ত শিক্ষার্থীদের জন্য লাইভ ক্লাস, রেকর্ডেড লেকচার, প্র্যাকটিস ও প্রগ্রেস ট্র্যাকিং।",
    cta: "কোর্সগুলো দেখুন",
    bgClass: "bg-emerald-950",
    pattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-emerald-950 to-slate-950",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Single prominent cap icon */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="relative flex items-center justify-center"
        >
          {/* Glow rings */}
          <div className="absolute size-[340px] md:size-[440px] rounded-full border border-emerald-500/10 animate-pulse"></div>
          <div className="absolute size-[260px] md:size-[340px] rounded-full border border-emerald-500/15"></div>
          <div className="absolute size-[180px] md:size-[240px] rounded-full bg-emerald-500/5 border border-emerald-400/20 shadow-[0_0_60px_rgba(16,185,129,0.2)]"></div>

          {/* Main icon */}
          <div className="relative size-40 md:size-52 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-600/10 flex items-center justify-center backdrop-blur-xl border border-emerald-400/30 shadow-[0_0_80px_rgba(16,185,129,0.25)]">
            <span className="text-[7rem] md:text-[9rem] drop-shadow-[0_0_30px_rgba(16,185,129,0.6)] select-none leading-none">🎓</span>
          </div>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-10 right-10 md:top-16 md:right-16 bg-white/5 backdrop-blur-xl px-6 py-4 rounded-[1.5rem] border border-white/10 shadow-2xl flex items-center gap-4"
        >
          <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <TrendingUp className="text-emerald-400 size-5" />
          </div>
          <div>
            <div className="text-white font-extrabold text-xl">১০০%</div>
            <div className="text-emerald-200/60 text-[11px] font-bold tracking-widest uppercase">সিলেবাস কভার</div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 md:bottom-20 md:left-16 bg-white/5 backdrop-blur-xl px-6 py-4 rounded-[1.5rem] border border-white/10 shadow-2xl flex items-center gap-4"
        >
          <div className="text-emerald-400 font-bold text-4xl font-serif leading-none mt-1">∑</div>
          <div>
            <div className="text-white font-extrabold text-lg">গণিতভীতি দূর</div>
            <div className="text-emerald-200/60 text-[11px] font-bold tracking-widest uppercase">সহজ সমাধান</div>
          </div>
        </motion.div>
      </div>
    )
  },
  {
    id: 2,
    title: "লাইভ ও রেকর্ডেড ক্লাসের দারুণ সমন্বয়",
    subtitle: "সরাসরি শিক্ষকদের কাছে প্রশ্ন করো, কিংবা মিস করা ক্লাসগুলো এইচডি রেকর্ডিংয়ে দেখে নাও যেকোনো সময়।",
    cta: "ফ্রি ক্লাসগুলো দেখুন",
    bgClass: "bg-slate-900",
    pattern: "bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/10 via-slate-900 to-slate-950",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-[90%] md:w-[85%] aspect-video bg-[#0b1120] rounded-[2rem] border border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          {/* Video Player Header */}
          <div className="h-12 bg-[#0f172a] border-b border-slate-800/50 flex items-center px-5 gap-2 relative z-10">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <div className="ml-auto px-3 py-1 bg-slate-800/50 rounded-md text-[10px] text-emerald-400 font-mono tracking-widest border border-emerald-500/20 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              LIVE
            </div>
          </div>

          {/* Video Area */}
          <div className="flex-1 bg-slate-900/50 flex items-center justify-center relative backdrop-blur-sm">
            <div className="size-20 md:size-24 rounded-full bg-emerald-500/20 flex items-center justify-center backdrop-blur-md border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500 cursor-pointer shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-emerald-400 drop-shadow-lg ml-1" />
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4">
              <span className="text-xs text-slate-400 font-mono">12:45</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer group/progress">
                <div className="w-1/3 h-full bg-emerald-500 relative group-hover/progress:bg-emerald-400 transition-colors">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2.5 bg-white rounded-full shadow-[0_0_10px_rgba(16,185,129,1)] scale-0 group-hover/progress:scale-100 transition-transform"></div>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-mono">45:00</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "প্রগ্রেস ট্র্যাকিং ও ইন্টারঅ্যাকটিভ কুইজ",
    subtitle: "অধ্যায়ভিত্তিক কুইজ ও মক টেস্ট দিয়ে নিজের ভুলগুলো শুধরে নাও এবং পরীক্ষার জন্য ১০০% প্রস্তুত হও।",
    cta: "মডেল টেস্ট দিন",
    bgClass: "bg-teal-950",
    pattern: "bg-[conic-gradient(at_center_right,_var(--tw-gradient-stops))] from-emerald-950 via-teal-950 to-slate-900",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center gap-6 flex-col md:flex-row">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`bg-white/5 backdrop-blur-xl p-7 rounded-[2rem] border w-64 md:w-72 shadow-2xl relative ${i === 2 ? 'md:-translate-y-10 border-emerald-400/40 bg-emerald-900/30 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)] z-10' : 'border-white/10 opacity-70 scale-95'}`}
          >
            {i === 2 && (
              <div className="absolute -top-4 -right-4 size-10 rounded-full bg-emerald-500 flex items-center justify-center border-[3px] border-teal-950 text-white shadow-xl rotate-12">
                <Star className="size-5 fill-white" />
              </div>
            )}

            <div className="h-5 w-1/2 bg-white/20 rounded-md mb-8"></div>
            <div className="space-y-4">
              <div className={`h-14 w-full rounded-2xl border flex items-center px-4 gap-4 transition-all ${i === 2 ? 'bg-emerald-500/20 border-emerald-500/30 translate-x-2' : 'bg-white/5 border-white/5'}`}>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center shrink-0 ${i === 2 ? 'border-emerald-400 bg-emerald-400' : 'border-white/20'}`}>
                  {i === 2 && <CheckCircle2 className="size-4 text-emerald-950" />}
                </div>
                <div className="h-2.5 w-1/2 bg-white/20 rounded-full"></div>
              </div>

              <div className="h-14 w-full bg-white/5 border border-white/5 rounded-2xl flex items-center px-4 gap-4">
                <div className="size-6 rounded-full border-2 border-white/20 shrink-0"></div>
                <div className="h-2.5 w-2/3 bg-white/10 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
];

const classCategories = [
  {
    title: "অষ্টম শ্রেণি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#dbeafe]",
    iconBgClass: "bg-[#3b82f6]",
    titleClass: "text-[#2563eb]",
    descClass: "text-[#1e3a8a]/70",
    icon: BookOpen
  },
  {
    title: "নবম শ্রেণি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#dcfce7]",
    iconBgClass: "bg-[#10b981]",
    titleClass: "text-[#059669]",
    descClass: "text-[#064e3b]/70",
    icon: Calculator
  },
  {
    title: "দশম শ্রেণি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#f3e8ff]",
    iconBgClass: "bg-[#a855f7]",
    titleClass: "text-[#7e22ce]",
    descClass: "text-[#4c1d95]/70",
    icon: GraduationCap
  },
  {
    title: "এসএসসি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#ffedd5]",
    iconBgClass: "bg-[#f97316]",
    titleClass: "text-[#ea580c]",
    descClass: "text-[#7c2d12]/70",
    icon: FlaskConical
  },
  {
    title: "এইচএসসি",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#e0e7ff]",
    iconBgClass: "bg-[#6366f1]",
    titleClass: "text-[#4f46e5]",
    descClass: "text-[#312e81]/70",
    icon: Laptop
  },
  {
    title: "এডমিশন",
    desc: "লেকচার ভিডিও, লাইভ ক্লাস, এসাইনমেন্ট",
    href: "#",
    bgClass: "bg-[#fce7f3]",
    iconBgClass: "bg-[#ec4899]",
    titleClass: "text-[#e11d48]",
    descClass: "text-[#881337]/70",
    icon: Users
  }
];

const features = [
  { icon: TrendingUp, title: "গোছানো প্রস্তুতি", desc: "আমাদের ড্যাশবোর্ডে তোমার প্রতিটি পদক্ষেপের অগ্রগতি ট্র্যাক করো।" },
  { icon: PlayCircle, title: "লাইভ এবং রেকর্ডেড", desc: "ইন্টারঅ্যাকটিভ লাইভ ক্লাসে অংশ নাও অথবা যেকোনো সময় এইচডি রেকর্ডিং দেখো।" },
  { icon: CheckCircle2, title: "নিয়মিত পরীক্ষা", desc: "সাথে সাথে নিজের প্রস্তুতি যাচাই করতে তাৎক্ষণিক MCQ কুইজ।" },
  { icon: ArrowRight, title: "সহজ বিকাশ পেমেন্ট", desc: "বিকাশ পেমেন্টের মাধ্যমে ঝামেলা ছাড়াই সাথে সাথে কোর্সে যুক্ত হও।" },
];

const groupedCourses = [
  {
    category: "অষ্টম শ্রেণি (Class 8)",
    tabs: ["সকল (Class 8)", "২০২৬"],
    items: [
      {
        title: "Class 8 | Star Batch 2026 | Academic to Junior...",
        desc: "STAR BATCH 2026 হলো অষ্টম শ্রেণির শিক্ষার্থীদের জন্য একটি পূর্নাঙ্গ গাইডলাইন।",
        tags: ["Class 8", "Star Batch", "2026"],
        price: "",
        gradient: "from-[#0f172a] via-[#1e3a8a] to-[#312e81]",
      }
    ]
  },
  {
    category: "উচ্চ মাধ্যমিক (HSC)",
    tabs: ["সকল (HSC)", "HSC 2028", "HSC 2027", "HSC 2026"],
    items: [
      {
        title: "(PCMB 1st Paper) Combo | AIMERS'28 - HSC...",
        desc: "একাডেমিক লাইফের শুরু থেকেই এডমিশনের জন্য নিজেকে একধাপ এগিয়ে রাখতে কোর্সটি অসাধারণ।",
        tags: ["1ST PAPER COMBO", "HSC 2028"],
        price: "৭৫০০/-",
        gradient: "from-[#4c1d95] via-[#581c87] to-[#701a75]",
      },
      {
        title: "(PCMB 2nd Paper) Combo | AIMERS'28 - HSC...",
        desc: "একাডেমিক লাইফের শুরু থেকেই এডমিশনের জন্য নিজেকে একধাপ এগিয়ে রাখতে কোর্সটি অসাধারণ।",
        tags: ["2ND PAPER COMBO", "HSC 2028"],
        price: "৭৬০০/-",
        gradient: "from-[#7f1d1d] via-[#991b1b] to-[#450a0a]",
      },
      {
        title: "Chemistry (1st Paper & 2nd Paper) | AIMERS...",
        desc: "একাডেমিক লাইফের শুরু থেকেই এডমিশনের জন্য নিজেকে একধাপ এগিয়ে রাখতে কোর্সটি অসাধারণ।",
        tags: ["CHEMISTRY", "HSC 2028"],
        price: "৪২০০০/-",
        gradient: "from-[#db2777] via-[#be185d] to-[#831843]",
      },
      {
        title: "Physics (1st Paper & 2nd Paper) | AIMERS...",
        desc: "একাডেমিক লাইফের শুরু থেকেই এডমিশনের জন্য নিজেকে একধাপ এগিয়ে রাখতে কোর্সটি অসাধারণ।",
        tags: ["PHYSICS", "HSC 2028"],
        price: "৪২০০০/-",
        gradient: "from-[#0369a1] via-[#1d4ed8] to-[#1e3a8a]",
      }
    ]
  },
  {
    category: "মাধ্যমিক (SSC)",
    tabs: ["সকল (SSC)", "SSC 2028", "SSC 2027", "SSC 2026"],
    items: [
      {
        title: "General Science | SSC 2027 & 2028",
        desc: "নবম-দশম শ্রেণির বিজ্ঞান বিভাগের পূর্ণাঙ্গ সিলেবাস সম্পন্ন করা হবে।",
        tags: ["Science", "SSC 2027"],
        price: "২৫০০/-",
        gradient: "from-[#1d4ed8] via-[#2563eb] to-[#3b82f6]",
      },
      {
        title: "Bangla | SSC 2027 & 2028",
        desc: "নবম-দশম শ্রেণির বাংলা বিভাগের পূর্ণাঙ্গ সিলেবাস সম্পন্ন করা হবে।",
        tags: ["Bangla", "SSC 2027"],
        price: "১৫০০/-",
        gradient: "from-[#b45309] via-[#d97706] to-[#f59e0b]",
      },
      {
        title: "ICT | SSC 2027 & 2028",
        desc: "নবম-দশম শ্রেণির আইসিটি বিভাগের পূর্ণাঙ্গ সিলেবাস সম্পন্ন করা হবে।",
        tags: ["ICT", "SSC 2027"],
        price: "১০০০/-",
        gradient: "from-[#4338ca] via-[#4f46e5] to-[#6366f1]",
      },
      {
        title: "BGS | SSC 2027 & 2028",
        desc: "নবম-দশম শ্রেণির বাংলাদেশ ও বিশ্বপরিচয় বিষয়ের পূর্ণাঙ্গ সিলেবাস।",
        tags: ["BGS", "SSC 2027"],
        price: "১২০০/-",
        gradient: "from-[#047857] via-[#059669] to-[#10b981]",
      }
    ]
  }
];

const reviews = [
  {
    name: "সাদমান সাকিব",
    school: "ঢাকা কলেজ",
    rating: 5,
    text: "MathPro-এর লাইভ ক্লাসগুলো অসাধারণ। কনসেপ্টগুলো এতো সুন্দর করে ক্লিয়ার করা হয় যে গণিত আর ভয়ের বিষয় মনে হয় না।",
  },
  {
    name: "ফারিহা রহমান",
    school: "ভিকারুননিসা নূন স্কুল এন্ড কলেজ",
    rating: 5,
    text: "রেকর্ডেড ভিডিও এবং মক টেস্টগুলো আমার প্রস্তুতিকে অনেক বেশি মজবুত করেছে। আমি এখন অনেক বেশি কনফিডেন্ট।",
  },
  {
    name: "রাফসান জনি",
    school: "নটর ডেম কলেজ",
    rating: 5,
    text: "ভাইয়াদের পড়ানোর স্টাইলটা একদম আলাদা। বোরিং টপিকগুলোও খুব সহজে মনে রাখা যায়। সেরা প্ল্যাটফর্ম!",
  },
  {
    name: "তাসনিম জেরিন",
    school: "আইডিয়াল স্কুল অ্যান্ড কলেজ",
    rating: 5,
    text: "সবচেয়ে ভালো লাগে এদের এমসিকিউ কুইজ সিস্টেমটা। নিজের ভুলগুলো সাথে সাথেই শুধরে নেওয়া যায়।",
  },
  {
    name: "আসিফ ইকবাল",
    school: "রাজউক উত্তরা মডেল কলেজ",
    rating: 5,
    text: "বিকাশ পেমেন্টের মাধ্যমে খুব দ্রুত কোর্সে যুক্ত হতে পেরেছি। এবং সাপোর্ট টিমও অনেক হেল্পফুল।"
  }
];

const faqs = [
  {
    question: "লাইভ ক্লাস মিস করলে কী হবে?",
    answer: "কোনো চিন্তা নেই! প্রতিটি লাইভ ক্লাসের এইচডি রেকর্ডিং ক্লাসের পর পরই তোমার ড্যাশবোর্ডে যুক্ত হয়ে যাবে। তুমি যেকোনো সময় যতবার খুশি দেখতে পারবে।"
  },
  {
    question: "কোর্সে কীভাবে ভর্তি হবো?",
    answer: "খুবই সহজ! 'এনরোল করো' বাটনে ক্লিক করে বিকাশ অথবা নগদের মাধ্যমে পেমেন্ট সম্পন্ন করলেই সাথে সাথে কোর্সের এক্সেস পেয়ে যাবে।"
  },
  {
    question: "অফলাইন মক টেস্ট কি সবাই দিতে পারবে?",
    answer: "হ্যাঁ, আমাদের যেকোনো অনলাইন কোর্সের শিক্ষার্থীরা নির্দিষ্ট ফি দিয়ে আমাদের মিরপুর বা উত্তরা শাখায় এসে অফলাইন মক টেস্ট দিতে পারবে।"
  },
  {
    question: "ক্লাসের নোট বা লেকচার শিট কি দেওয়া হবে?",
    answer: "অবশ্যই। প্রতিটি ক্লাসের সাথে ওই ক্লাসের পিডিএফ লেকচার শিট এবং প্র‍্যাকটিস ম্যাটেরিয়াল দেওয়া থাকে, যা তুমি ডাউনলোড করে নিতে পারবে।"
  },
  {
    question: "পেমেন্ট করার পর কোর্স চালু হতে কতক্ষণ লাগে?",
    answer: "পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই স্বয়ংক্রিয়ভাবে তোমার অ্যাকাউন্টে কোর্সটি যুক্ত হয়ে যাবে। কোনো অপেক্ষার প্রয়োজন নেই!"
  }
];

export function LandingPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
  const [reviewRef, reviewApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 }, [Autoplay({ delay: 4000, stopOnInteraction: true })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50/30 font-sans text-slate-900 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">

      {/* --- STICKY NAVBAR --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 lg:px-12 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-4" : "bg-transparent border-b border-white/10 py-6"
        }`}>
        <div className="flex items-center gap-3 group/logo cursor-pointer">
          <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20 group-hover/logo:rotate-12 transition-transform duration-300">M</div>
          <span className={`text-4xl font-black tracking-tight font-manrope transition-all duration-300 group-hover/logo:tracking-widest text-emerald-500 group-hover/logo:text-emerald-400`}>MATHPRO</span>
        </div>
        <div className={`hidden md:flex gap-10 text-lg font-bold transition-colors ${isScrolled ? "text-slate-600" : "text-white/90"}`}>
          <a href="#courses" className={`transition-colors ${isScrolled ? "hover:text-emerald-600" : "hover:text-emerald-400"}`}>কোর্সসমূহ</a>
          <a href="#features" className={`transition-colors ${isScrolled ? "hover:text-emerald-600" : "hover:text-emerald-400"}`}>বৈশিষ্ট্য</a>
          <a href="#branches" className={`transition-colors ${isScrolled ? "hover:text-emerald-600" : "hover:text-emerald-400"}`}>শাখাসমূহ</a>
        </div>
        <button className={`px-6 py-3 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl ${isScrolled ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-white text-slate-900 hover:bg-emerald-50"
          }`}>
          লগইন
        </button>
      </nav>

      {/* --- HERO CAROUSEL --- */}
      <section className="relative h-[100dvh] min-h-[700px] w-full bg-slate-950 overflow-hidden">
        {/* Carousel */}
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full">
            {slides.map((slide, index) => (
              <div key={slide.id} className="flex-[0_0_100%] min-w-0 relative h-full">
                <div className={`absolute inset-0 ${slide.bgClass} ${slide.pattern} opacity-90`}></div>
                <div className="relative h-full container mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center pt-24 md:pt-0 pb-16">

                  {/* Text Content */}
                  <div className="w-full md:w-1/2 z-10 flex flex-col items-start pt-10 md:pt-20">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, y: selectedIndex === index ? 0 : 20 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-6"
                    >
                      <Sparkles className="size-3.5" />
                      প্ল্যাটফর্ম ২.০ লাইভ
                    </motion.div>

                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, y: selectedIndex === index ? 0 : 20 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      className="font-heading text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 drop-shadow-sm"
                    >
                      {slide.title}
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, y: selectedIndex === index ? 0 : 20 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="text-xl md:text-2xl text-emerald-50/90 mb-10 max-w-lg leading-relaxed font-medium"
                    >
                      {slide.subtitle}
                    </motion.p>

                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, y: selectedIndex === index ? 0 : 20 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-500/20 text-lg"
                    >
                      {slide.cta}
                      <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>

                  {/* Visual Content */}
                  <div className="w-full md:w-1/2 h-[45vh] md:h-[60vh] relative mt-12 md:mt-16">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: selectedIndex === index ? 1 : 0, scale: selectedIndex === index ? 1 : 0.9 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="absolute inset-0"
                    >
                      {slide.visual}
                    </motion.div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Pips */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-500 ${selectedIndex === i ? 'w-12 bg-emerald-400' : 'w-3 bg-white/30 hover:bg-white/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* --- TRUST STATS BAR --- */}
      <section className="bg-emerald-900 border-y border-emerald-800 relative z-20 shadow-xl">
        <div className="container mx-auto px-6 lg:px-12 py-6 md:py-8">
          <div className="flex flex-wrap justify-center md:justify-between gap-8 md:gap-12 items-center max-w-5xl mx-auto">

            <div className="flex items-center gap-5">
              <div className="size-12 md:size-14 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 border border-emerald-700/50 shadow-inner">
                <Users className="size-6 md:size-7" />
              </div>
              <div>
                <div className="text-white font-extrabold text-2xl md:text-3xl font-heading tracking-tight">৫০,০০০+</div>
                <div className="text-emerald-300/80 font-bold tracking-widest text-[10px] md:text-xs uppercase mt-0.5">শিক্ষার্থী যুক্ত আছে</div>
              </div>
            </div>

            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-emerald-700 to-transparent"></div>

            <div className="flex items-center gap-5">
              <div className="size-12 md:size-14 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 border border-emerald-700/50 shadow-inner">
                <CheckCircle2 className="size-6 md:size-7" />
              </div>
              <div>
                <div className="text-white font-extrabold text-2xl md:text-3xl font-heading tracking-tight">১,০০০+</div>
                <div className="text-emerald-300/80 font-bold tracking-widest text-[10px] md:text-xs uppercase mt-0.5">লাইভ ও রেকর্ডেড ক্লাস</div>
              </div>
            </div>

            <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-emerald-700 to-transparent"></div>

            <div className="flex items-center gap-5">
              <div className="size-12 md:size-14 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 border border-emerald-700/50 shadow-inner">
                <Star className="size-6 md:size-7 fill-emerald-400" />
              </div>
              <div>
                <div className="text-white font-extrabold text-2xl md:text-3xl font-heading tracking-tight">৪.৮/৫</div>
                <div className="text-emerald-300/80 font-bold tracking-widest text-[10px] md:text-xs uppercase mt-0.5">গড় রেটিং</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CLASS CATEGORIES --- */}
      <section className="py-24 bg-[#f4f7fe] relative border-b border-slate-100">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#00b5cc] font-heading">
              আমাদের ক্যাটাগরিসমূহ
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              তোমার সুবিধামতো বেছে নাও যেকোনো একটি ক্যাটাগরি এবং শুরু করো তোমার শেখার যাত্রা।
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {classCategories.map((category, i) => (
              <a key={i} href={category.href} className="group outline-none">
                <div className={`p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative flex flex-col justify-between min-h-[220px] ${category.bgClass}`}>
                  <div>
                    <div className={`size-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-sm ${category.iconBgClass}`}>
                      <category.icon className="size-7" />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 font-heading ${category.titleClass}`}>{category.title}</h3>
                    <p className={`font-medium text-sm leading-relaxed ${category.descClass}`}>{category.desc}</p>
                  </div>
                  <div className="flex justify-end mt-8">
                    <span className={`text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all ${category.titleClass}`}>
                      Explore <span>&gt;</span>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* --- VALUE PROP SECTION --- */}
      <section id="features" className="py-28 bg-white relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-slate-900 font-heading">কেন MathPro বেছে নিবে?</h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">আমরা শুধু গণিত পড়াই না। আমরা এমন সিস্টেম তৈরি করি যা তোমাকে গণিতে দক্ষ করে তুলবে।</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="p-8 md:p-10 rounded-[2rem] bg-[#fbfdfc] border border-emerald-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 group flex flex-col items-start"
              >
                <div className="size-16 rounded-2xl bg-[#e6f7ef] text-[#059669] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="size-7 stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-extrabold mb-4 text-slate-900 font-heading tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium text-[15px]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURED COURSES (Grouped) --- */}
      <section id="courses" className="py-28 bg-[#f4f7fe]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20 lg:mb-24">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-slate-900 font-heading">
              আমাদের জনপ্রিয় <span className="text-[#059669]">কোর্সসমূহ</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">
              দেশের সেরা শিক্ষকদের সাথে তোমার স্বপ্ন পূরণের যাত্রা শুরু হোক এখান থেকেই।
            </p>
          </div>

          <div className="flex flex-col gap-24">
            {groupedCourses.map((group, i) => (
              <div key={i} className="flex flex-col">
                {/* Category Header & Tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-10">
                  <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-[#1e293b]">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 lg:ml-6">
                    {group.tabs.map((tab, idx) => (
                      <button
                        key={idx}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${idx === 0
                          ? 'bg-[#1e293b] text-white shadow-xl shadow-slate-900/10'
                          : 'bg-white border border-[#e2e8f0] text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'
                          }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
                  {group.items.map((course, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -8 }}
                      className="group bg-white rounded-3xl overflow-hidden border border-slate-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col"
                    >
                      {/* Fake Thumbnail Banner */}
                      <div className={`h-48 w-full bg-gradient-to-tr ${course.gradient} p-6 relative overflow-hidden flex flex-col justify-center items-center text-center`}>
                        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                        <h4 className="text-white font-extrabold text-xl lg:text-2xl z-10 leading-tight font-heading drop-shadow-md">
                          {course.title.split('|')[0].trim()}
                        </h4>
                        {course.price && (
                          <div className="mt-4 bg-[#e11d48] text-white text-[13px] font-bold px-4 py-1.5 rounded-full z-10 animate-pulse border border-[#f43f5e] shadow-lg shadow-rose-900/20">
                            {course.price}
                          </div>
                        )}

                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md size-8 flex items-center justify-center rounded-xl z-20 font-bold text-white text-xs">
                          MathPro
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-7 flex flex-col flex-1 bg-white">
                        <div className="flex flex-wrap gap-2 mb-5">
                          {course.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="px-3 py-1.5 bg-[#f1f5f9] text-[#475569] rounded-lg text-[10px] font-extrabold uppercase tracking-widest border border-slate-200/50">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <h4 className="font-extrabold text-[1.1rem] text-slate-900 leading-snug mb-3 font-heading group-hover:text-[#059669] transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-[14px] font-medium text-slate-500 mb-8 leading-relaxed line-clamp-3 flex-1">
                          {course.desc}
                        </p>

                        {/* CTA Button */}
                        <button className="w-full mt-auto bg-secondary hover:bg-secondary/90 shadow-lg hover:shadow-secondary/30 shadow-secondary/20 text-secondary-foreground font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 group/btn">
                          বিস্তারিত দেখি
                          <ArrowRight className="size-[18px] group-hover/btn:translate-x-1.5 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STUDENT REVIEWS (CAROUSEL) --- */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 text-slate-900 font-heading">
              শিক্ষার্থীদের <span className="text-[#059669]">মতামত</span>
            </h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">
              যারা MathPro-এর সাথে যুক্ত হয়েছে, তাদের অভিজ্ঞতা কেমন?
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden" ref={reviewRef}>
              <div className="flex -ml-6 py-4">
                {reviews.map((review, i) => (
                  <div key={i} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-6">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-[#f8fafc] p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 h-full flex flex-col relative overflow-hidden group"
                    >
                      <Quote className="absolute top-6 right-6 size-16 text-slate-200/50 rotate-180 group-hover:text-emerald-100/50 transition-colors" />
                      <div className="flex gap-1.5 mb-6 relative z-10">
                        {[...Array(review.rating)].map((_, j) => (
                          <Star key={j} className="size-5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-600 text-lg leading-relaxed font-medium mb-8 flex-1 relative z-10">
                        &quot;{review.text}&quot;
                      </p>
                      <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-slate-200/50">
                        <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl shadow-inner">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 font-heading text-[17px]">{review.name}</h4>
                          <p className="text-sm font-medium text-slate-500">{review.school}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => reviewApi?.scrollPrev()}
              className="absolute top-1/2 -left-4 md:-left-6 -translate-y-1/2 size-14 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 shadow-xl shadow-slate-200/50 transition-all z-10 hidden md:flex"
            >
              <ChevronRight className="size-7 rotate-180" />
            </button>
            <button
              onClick={() => reviewApi?.scrollNext()}
              className="absolute top-1/2 -right-4 md:-right-6 -translate-y-1/2 size-14 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 shadow-xl shadow-slate-200/50 transition-all z-10 hidden md:flex"
            >
              <ChevronRight className="size-7" />
            </button>
          </div>
        </div>
      </section>

      {/* --- OFFLINE BRANCHES (O2O Strategy) --- */}
      <section id="branches" className="py-32 bg-[#fbfdfc] overflow-hidden relative">
        {/* Very subtle background texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#10b981 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-20 items-center max-w-[1400px] mx-auto">

            {/* Geometric Map Visual (Left Side) */}
            <div className="relative h-[550px] w-full rounded-[3rem] bg-[#0f172a] border border-slate-800/80 flex items-center justify-center overflow-hidden shadow-2xl shadow-slate-900/20 group">
              {/* Animated Geometric Grid */}
              <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }}></div>

              {/* Radar Sweep Effect */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 origin-center"
                style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(16, 185, 129, 0.15) 360deg)', borderRadius: '50%' }}
              />

              {/* Concentric Geometry */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[250px] rounded-full border border-emerald-500/20"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[450px] rounded-full border border-emerald-500/10"></div>

              {/* SVG Connecting Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.line
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
                  viewport={{ once: true }}
                  x1="35%" y1="35%" x2="65%" y2="65%"
                  stroke="#10b981" strokeWidth="2" strokeDasharray="6 6" className="opacity-60"
                />
              </svg>

              {/* Tech UI Overlays */}
              <div className="absolute top-8 left-8 font-geist-mono text-[11px] text-emerald-400/80 tracking-[0.2em] leading-relaxed uppercase">
                LAT_ 23.8103° N <br />
                LON_ 90.4125° E <br />
                <span className="text-white mt-2 inline-block">SYS.ACTIVE</span>
              </div>
              <div className="absolute bottom-8 right-8 font-geist-mono text-[11px] text-slate-500 tracking-[0.2em] uppercase text-right">
                MATHPRO_NET_V2 <br />
                O2O_CONNECT
              </div>

              {/* Branch Pin 1 - Mirpur */}
              <a
                href="https://maps.google.com/?q=Mirpur+10+Center,+Dhaka"
                target="_blank"
                rel="noreferrer"
                className="absolute top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin cursor-pointer z-10"
              >
                <div className="bg-slate-900/90 backdrop-blur-xl px-5 py-2.5 rounded-[1.2rem] shadow-2xl text-[15px] font-extrabold text-white mb-4 border border-emerald-500/30 group-hover/pin:bg-emerald-500 group-hover/pin:border-emerald-400 group-hover/pin:shadow-emerald-500/30 transition-all duration-300 transform group-hover/pin:-translate-y-2 group-hover/pin:scale-105 tracking-wide">
                  মিরপুর শাখা
                </div>
                <div className="size-6 bg-emerald-500 rounded-full border-[3px] border-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.5)] relative flex items-center justify-center group-hover/pin:scale-[1.4] transition-transform duration-300">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
                  <div className="size-1.5 bg-white rounded-full"></div>
                </div>
              </a>

              {/* Branch Pin 2 - Uttara */}
              <a
                href="https://maps.google.com/?q=Uttara+Sector+7,+Dhaka"
                target="_blank"
                rel="noreferrer"
                className="absolute top-[65%] left-[65%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/pin cursor-pointer z-10"
              >
                <div className="bg-slate-900/90 backdrop-blur-xl px-5 py-2.5 rounded-[1.2rem] shadow-2xl text-[15px] font-extrabold text-white mb-4 border border-emerald-500/30 group-hover/pin:bg-emerald-500 group-hover/pin:border-emerald-400 group-hover/pin:shadow-emerald-500/30 transition-all duration-300 transform group-hover/pin:-translate-y-2 group-hover/pin:scale-105 tracking-wide">
                  উত্তরা শাখা
                </div>
                <div className="size-6 bg-emerald-500 rounded-full border-[3px] border-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.5)] relative flex items-center justify-center group-hover/pin:scale-[1.4] transition-transform duration-300">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-60"></div>
                  <div className="size-1.5 bg-white rounded-full"></div>
                </div>
              </a>
            </div>

            {/* Content (Right Side) */}
            <div className="flex flex-col items-start lg:pl-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0fdf4] text-[#059669] border border-[#d1fae5] text-xs font-bold uppercase tracking-widest mb-6">
                <MapPin className="size-3.5 stroke-[2.5]" />
                আমাদের শাখাসমূহ
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6 leading-[1.15] text-slate-900 font-heading">
                অনলাইনে শেখো।<br />অফলাইনে যুক্ত হও।
              </h2>
              <p className="text-slate-500 text-[1.15rem] mb-12 leading-relaxed font-medium">
                অনলাইনে সেরা অভিজ্ঞতার পাশাপাশি, ঢাকায় MathPro-এর অফলাইন শাখাও রয়েছে। মক এক্সাম দিতে, প্রিন্টেড শিট নিতে বা শিক্ষকদের সাথে সরাসরি কথা বলতে চলে এসো আমাদের শাখায়।
              </p>

              <div className="space-y-5 w-full">
                {[
                  { name: "মিরপুর ১০ সেন্টার", address: "বাড়ি ১২, রোড ৪, ব্লক সি, মিরপুর, ঢাকা", mapUrl: "https://maps.google.com/?q=Mirpur+10+Center,+Dhaka" },
                  { name: "উত্তরা সেক্টর ৭", address: "সেক্টর ৭, সোনারগাঁও জনপথ রোড, ঢাকা", mapUrl: "https://maps.google.com/?q=Uttara+Sector+7,+Dhaka" }
                ].map((branch, i) => (
                  <a key={i} href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 md:p-8 rounded-[1.5rem] border border-slate-200 hover:border-emerald-300 transition-all duration-300 bg-white hover:bg-[#fbfdfc] group cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1">
                    <div>
                      <h4 className="font-extrabold text-[22px] text-slate-900 mb-1.5 font-heading tracking-tight group-hover:text-emerald-600 transition-colors">{branch.name}</h4>
                      <p className="text-slate-500 font-medium text-[15px] flex items-center gap-2">
                        <MapPin className="size-4 text-emerald-500" />
                        {branch.address}
                      </p>
                    </div>
                    <div className="size-12 rounded-full bg-[#f1f5f9] text-slate-400 group-hover:text-white group-hover:bg-[#059669] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:rotate-45 group-hover:scale-110">
                      <ArrowUpRight className="size-6 stroke-[2.5]" />
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section className="py-28 bg-[#f4f7fe] relative">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

            {/* FAQ Intro & Support Box (Left Column) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                <HelpCircle className="size-4" />
                সচরাচর জিজ্ঞাসা
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 text-slate-900 font-heading">
                তোমার সব<br /><span className="text-[#059669]">প্রশ্নের উত্তর</span>
              </h2>
              <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium pr-4">
                কোর্স, পেমেন্ট বা অন্যান্য বিষয় নিয়ে কোনো কনফিউশন আছে? নিচের তালিকা থেকে তোমার উত্তরটি জেনে নাও।
              </p>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="size-14 rounded-2xl bg-[#e6f7ef] text-[#059669] flex items-center justify-center mb-6 relative z-10">
                  <MessageCircle className="size-7" />
                </div>
                <h4 className="font-extrabold text-xl text-slate-900 mb-2 font-heading relative z-10">আরও কিছু জানার আছে?</h4>
                <p className="text-slate-500 font-medium text-[15px] mb-8 relative z-10">আমাদের সাপোর্ট টিম সবসময় তোমার পাশে আছে। যেকোনো প্রয়োজনে মেসেজ দাও।</p>
                <button className="w-full py-4 bg-slate-900 hover:bg-[#059669] text-white font-bold rounded-2xl transition-colors shadow-lg hover:shadow-emerald-900/20 relative z-10">
                  সাপোর্টে মেসেজ দাও
                </button>
              </div>
            </div>

            {/* Accordion List (Right Column) */}
            <div className="lg:col-span-7 lg:pl-10 flex flex-col gap-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`bg-white rounded-[1.5rem] border transition-all duration-300 overflow-hidden ${openFaq === idx ? 'border-emerald-500 shadow-xl shadow-emerald-900/5' : 'border-slate-200 hover:border-emerald-300'}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-transparent outline-none group"
                  >
                    <h4 className={`font-extrabold text-[1.1rem] md:text-xl font-heading pr-8 transition-colors ${openFaq === idx ? 'text-[#059669]' : 'text-slate-900 group-hover:text-[#059669]'}`}>
                      {faq.question}
                    </h4>
                    <div className={`shrink-0 size-12 rounded-full flex items-center justify-center transition-colors ${openFaq === idx ? 'bg-emerald-100 text-[#059669]' : 'bg-[#f1f5f9] text-slate-400 group-hover:bg-[#e6f7ef] group-hover:text-[#059669]'}`}>
                      {openFaq === idx ? <Minus className="size-6" /> : <Plus className="size-6" />}
                    </div>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 md:px-8 pb-8 pt-0 text-slate-500 font-medium leading-relaxed text-[15px]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="bg-emerald-950 py-24 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-800 rounded-full mix-blend-multiply filter blur-[100px] opacity-50"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight font-heading">গণিত জয় করতে প্রস্তুত?</h2>
          <p className="text-emerald-100 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">MathPro-এর সাহায্যে নিজেদের রেজাল্ট এবং আত্মবিশ্বাস বদলে ফেলা হাজারো শিক্ষার্থীর সাথে যুক্ত হও।</p>
          <button className="px-12 py-5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold rounded-full text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/50">
            ফ্রি অ্যাকাউন্ট তৈরি করো
          </button>
        </div>
      </section>

      <Footer />

    </div>
  );
}
