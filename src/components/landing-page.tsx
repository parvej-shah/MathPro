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
  Map,
  Sparkles,
  GraduationCap,
  Calculator,
  FlaskConical,
  Laptop,
  Users,
  Quote
} from "lucide-react";

const slides = [
  {
    id: 1,
    title: "গণিত শেখো। পরীক্ষায় বিজয়ী হও।",
    subtitle: "ঢাকায় ৮ম থেকে ১২শ শ্রেণির শিক্ষার্থীদের জন্য সেরা অনলাইন গণিত কোচিং।",
    cta: "কোর্সগুলো দেখুন",
    bgClass: "bg-emerald-900",
    pattern: "bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-emerald-900 to-emerald-950",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Placeholder for victorious student */}
        <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full bg-emerald-500/20 flex items-center justify-center backdrop-blur-3xl border border-emerald-400/30 overflow-hidden shadow-2xl shadow-emerald-500/20">
           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400 to-teal-300 opacity-20 animate-pulse"></div>
           <span className="text-8xl md:text-9xl drop-shadow-2xl">🎓</span>
        </div>
        
        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, -15, 0] }} 
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-10 right-10 md:top-20 md:right-20 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-emerald-300 font-bold text-2xl shadow-xl"
        >
          100%
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 20, 0] }} 
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 md:bottom-20 md:left-20 bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-emerald-300 font-bold text-4xl font-serif shadow-xl"
        >
          ∑
        </motion.div>
      </div>
    )
  },
  {
    id: 2,
    title: "লাইভ ক্লাস করো। যেকোনো সময় রিভিশন দাও।",
    subtitle: "কোনো কনসেপ্ট মিস হবে না। লাইভ ক্লাসের পরপরই এইচডি রেকর্ডিং পেয়ে যাও।",
    cta: "রুটিন দেখুন",
    bgClass: "bg-slate-900",
    pattern: "bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-teal-500/20 via-slate-900 to-slate-950",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-[90%] md:w-[80%] aspect-video bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
          <div className="h-8 bg-slate-900 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-1 bg-slate-800 flex items-center justify-center relative">
            <PlayCircle className="w-20 h-20 text-emerald-400 opacity-90 drop-shadow-lg" />
            <div className="absolute bottom-4 left-4 right-4 h-2 bg-slate-700 rounded-full overflow-hidden">
               <div className="w-1/3 h-full bg-emerald-500"></div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "নিজের প্রস্তুতি যাচাই করো।",
    subtitle: "প্রতিটি মডিউলের পর ইন্টারঅ্যাকটিভ MCQ কুইজ, যা তোমার অগ্রগতি নিশ্চিত করবে।",
    cta: "কুইজ দিয়ে দেখুন",
    bgClass: "bg-teal-950",
    pattern: "bg-[conic-gradient(at_center_right,_var(--tw-gradient-stops))] from-emerald-900 via-teal-950 to-slate-900",
    visual: (
      <div className="relative w-full h-full flex items-center justify-center gap-4 flex-col md:flex-row">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            className={`bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-56 shadow-2xl ${i === 2 ? 'md:-translate-y-8 border-emerald-400/50 bg-emerald-900/40' : ''}`}
          >
            <div className="h-4 w-3/4 bg-white/20 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-white/10 rounded"></div>
              <div className="h-4 w-full bg-white/10 rounded"></div>
              <div className="h-4 w-full bg-emerald-500/50 rounded flex items-center px-2 py-3"><CheckCircle2 className="w-4 h-4 text-emerald-200" /></div>
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

export function LandingPage() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 40 }, [Autoplay({ delay: 6000, stopOnInteraction: false })]);
  const [reviewRef, reviewApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 }, [Autoplay({ delay: 4000, stopOnInteraction: true })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

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
      <nav className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 lg:px-12 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm py-4" : "bg-transparent border-b border-white/10 py-6"
      }`}>
        <div className="flex items-center gap-3 group/logo cursor-pointer">
          <div className="size-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20 group-hover/logo:rotate-12 transition-transform duration-300">M</div>
          <span className={`text-2xl font-black tracking-tight font-manrope transition-all duration-300 group-hover/logo:tracking-widest text-emerald-500 group-hover/logo:text-emerald-400`}>MATHPRO</span>
        </div>
        <div className={`hidden md:flex gap-10 text-sm font-bold transition-colors ${isScrolled ? "text-slate-600" : "text-white/90"}`}>
          <a href="#courses" className={`transition-colors ${isScrolled ? "hover:text-emerald-600" : "hover:text-emerald-400"}`}>কোর্সসমূহ</a>
          <a href="#features" className={`transition-colors ${isScrolled ? "hover:text-emerald-600" : "hover:text-emerald-400"}`}>বৈশিষ্ট্য</a>
          <a href="#branches" className={`transition-colors ${isScrolled ? "hover:text-emerald-600" : "hover:text-emerald-400"}`}>শাখাসমূহ</a>
        </div>
        <button className={`px-6 py-3 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-xl ${
          isScrolled ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-white text-slate-900 hover:bg-emerald-50"
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
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                          idx === 0 
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
              যারা MathPro-এর সাথে যুক্ত হয়েছে, তাদের অভিজ্ঞতা কেমন?
            </p>
          </div>

          <div className="relative max-w-7xl mx-auto">
            {/* Carousel Viewport */}
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
                        "{review.text}"
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
            
            {/* Navigation Buttons */}
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
      <section id="branches" className="py-24 bg-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Map Visual */}
            <div className="relative h-[500px] w-full rounded-[2.5rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center overflow-hidden">
              <Map className="absolute size-[500px] text-emerald-100/50 -rotate-12 scale-150" />
              
              {/* Branch Pin 1 */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="absolute top-1/4 left-1/4 flex flex-col items-center"
              >
                <div className="bg-white px-4 py-2 rounded-xl shadow-xl text-sm font-bold text-slate-900 mb-3 border border-slate-100">মিরপুর শাখা</div>
                <div className="size-5 bg-emerald-500 rounded-full border-4 border-white shadow-lg relative">
                   <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </motion.div>

              {/* Branch Pin 2 */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-1/3 right-1/4 flex flex-col items-center"
              >
                <div className="bg-white px-4 py-2 rounded-xl shadow-xl text-sm font-bold text-slate-900 mb-3 border border-slate-100">উত্তরা শাখা</div>
                <div className="size-5 bg-emerald-500 rounded-full border-4 border-white shadow-lg relative">
                   <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
              </motion.div>
            </div>

            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
                <MapPin className="size-4" />
                আমাদের শাখাসমূহ
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-slate-900 font-heading">অনলাইনে শেখো।<br/>অফলাইনে যুক্ত হও।</h2>
              <p className="text-slate-500 text-xl mb-10 leading-relaxed font-medium">
                অনলাইনে সেরা অভিজ্ঞতার পাশাপাশি, ঢাকায় MathPro-এর অফলাইন শাখাও রয়েছে। মক এক্সাম দিতে, প্রিন্টেড শিট নিতে বা শিক্ষকদের সাথে সরাসরি কথা বলতে চলে এসো আমাদের শাখায়।
              </p>
              
              <div className="space-y-4">
                {[
                  { name: "মিরপুর ১০ সেন্টার", address: "বাড়ি ১২, রোড ৪, ব্লক সি, মিরপুর, ঢাকা" },
                  { name: "উত্তরা সেক্টর ৭", address: "সেক্টর ৭, সোনারগাঁও জনপথ রোড, ঢাকা" }
                ].map((branch, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl border-2 border-emerald-50 hover:border-emerald-400 transition-colors bg-white group cursor-pointer shadow-sm hover:shadow-md">
                    <div>
                      <h4 className="font-bold text-xl text-slate-900 mb-1 font-heading">{branch.name}</h4>
                      <p className="text-slate-500 font-medium">{branch.address}</p>
                    </div>
                    <div className="size-12 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <ChevronRight className="size-6" />
                    </div>
                  </div>
                ))}
              </div>
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
