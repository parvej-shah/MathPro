import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { HiSparkles } from "react-icons/hi2";
import { BsSearch, BsChevronDown, BsHandThumbsUp, BsHandThumbsDown } from "react-icons/bs";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

type FAQCategory = "all" | "courses" | "enrollment" | "payment" | "support" | "certificate";

const faqData: FAQItem[] = [
  {
    id: "faq-1",
    question: "CoderVai এর কোর্সগুলো কাদের জন্য?",
    answer:
      "CoderVai এর কোর্সগুলো বাংলাদেশের যেকোনো শিক্ষার্থী বা প্রফেশনালদের জন্য যারা প্রোগ্রামিং শিখতে চান। বিশেষ করে যারা Competitive Programming, Web Development, App Development, Data Structures & Algorithms শিখতে আগ্রহী। শূন্য থেকে শুরু করতে পারবেন, আবার অ্যাডভান্স লেভেলেও যেতে পারবেন।",
    category: "courses",
  },
  {
    id: "faq-2",
    question: "কোর্সগুলো কিভাবে চলে?",
    answer:
      "আমাদের কোর্সগুলো হাইব্রিড ফরম্যাটে চলে। প্রতিটি কোর্সে থাকে রেকর্ডেড ভিডিও লেকচার, লাইভ ক্লাস, কুইজ, অ্যাসাইনমেন্ট এবং প্র্যাকটিস প্রবলেম। প্রতি সপ্তাহে লাইভ ডাউট সলভিং সেশন হয় যেখানে সরাসরি প্রশ্ন করতে পারবেন।",
    category: "courses",
  },
  {
    id: "faq-3",
    question: "কোর্সে ভর্তি হতে কি কোনো পূর্ব অভিজ্ঞতা লাগবে?",
    answer:
      "বেশিরভাগ কোর্সে কোনো পূর্ব অভিজ্ঞতা লাগে না। আমাদের SPL, Discrete Math কোর্সগুলো শূন্য থেকে শুরু হয়। তবে কিছু অ্যাডভান্স কোর্সে বেসিক প্রোগ্রামিং জ্ঞান থাকা ভালো। প্রতিটি কোর্সের পেজে প্রয়োজনীয়তা উল্লেখ করা আছে।",
    category: "enrollment",
  },
  {
    id: "faq-4",
    question: "কোর্সের পেমেন্ট কিভাবে করব?",
    answer:
      "বিকাশ, নগদ, রকেট এবং যেকোনো ব্যাংক কার্ড দিয়ে পেমেন্ট করতে পারবেন। পেমেন্ট সম্পূর্ণ সিকিউর এবং SSL এনক্রিপ্টেড। ইনস্টলমেন্ট অপশনও আছে কিছু কোর্সে।",
    category: "payment",
  },
  {
    id: "faq-5",
    question: "কোর্স কেনার পর কতদিন এক্সেস থাকবে?",
    answer:
      "বেশিরভাগ কোর্সে ১ বছর পর্যন্ত এক্সেস থাকে। এই সময়ে তুমি যেকোনো সময় ভিডিও দেখতে, প্র্যাকটিস করতে এবং রিভিশন করতে পারবে। কিছু প্রোগ্রামে লাইফটাইম এক্সেসও দেওয়া হয়।",
    category: "courses",
  },
  {
    id: "faq-6",
    question: "সমস্যায় পড়লে কিভাবে সাহায্য পাব?",
    answer:
      "প্রতিটি লেসনের নিচে ডিসকাশন সেকশন আছে যেখানে প্রশ্ন করতে পারবে। সাপ্তাহিক লাইভ সেশনে সরাসরি প্রশ্ন করা যায়। এছাড়াও আমাদের ফেসবুক কমিউনিটি এবং ডেডিকেটেড সাপোর্ট টিম সবসময় সাহায্য করতে প্রস্তুত।",
    category: "support",
  },
  {
    id: "faq-7",
    question: "কোর্স শেষে সার্টিফিকেট পাব?",
    answer:
      "হ্যাঁ, প্রতিটি কোর্স সফলভাবে শেষ করলে এবং ফাইনাল অ্যাসেসমেন্টে পাস করলে অফিসিয়াল সার্টিফিকেট পাবে। এটি তোমার রেজুমে এবং LinkedIn প্রোফাইলে যোগ করতে পারবে।",
    category: "certificate",
  },
  {
    id: "faq-8",
    question: "রিফান্ড পলিসি কি?",
    answer:
      "কোর্স শুরুর ৭ দিনের মধ্যে যদি সন্তুষ্ট না হও, ফুল রিফান্ড পাবে। তবে কোর্সের ২৫% এর বেশি কমপ্লিট করলে রিফান্ড প্রযোজ্য হবে না। বিস্তারিত আমাদের রিফান্ড পলিসি পেজে দেখতে পারবে।",
    category: "payment",
  },
  {
    id: "faq-9",
    question: "মোবাইল থেকে কোর্স করা যাবে?",
    answer:
      "হ্যাঁ, আমাদের প্ল্যাটফর্ম সম্পূর্ণ মোবাইল রেসপন্সিভ। যেকোনো ডিভাইস থেকে ভিডিও দেখা, কুইজ দেওয়া এবং অ্যাসাইনমেন্ট সাবমিট করা যায়। তবে প্রোগ্রামিং প্র্যাকটিসের জন্য ল্যাপটপ/ডেস্কটপ ভালো।",
    category: "courses",
  },
  {
    id: "faq-10",
    question: "CoderVai এর ইন্সট্রাক্টররা কারা?",
    answer:
      "আমাদের ইন্সট্রাক্টররা BUET CSE এর ছাত্র-ছাত্রী, Google/Facebook এর সফটওয়্যার ইঞ্জিনিয়ার, এবং ইন্ডাস্ট্রি এক্সপার্ট। তাদের প্রত্যেকের আছে শিক্ষকতা ও প্রফেশনাল অভিজ্ঞতা যা তোমাকে সেরা শিক্ষা দিতে সক্ষম।",
    category: "courses",
  },
];

const categories: { value: FAQCategory; label: string; icon: string }[] = [
  { value: "all", label: "সব প্রশ্ন", icon: "📋" },
  { value: "courses", label: "কোর্স", icon: "📚" },
  { value: "enrollment", label: "ভর্তি", icon: "✍️" },
  { value: "payment", label: "পেমেন্ট", icon: "💳" },
  { value: "support", label: "সাপোর্ট", icon: "🤝" },
  { value: "certificate", label: "সার্টিফিকেট", icon: "🎓" },
];

// FAQ Accordion Item Component
const FAQAccordionItem = ({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <div
        className={`relative rounded-2xl border overflow-hidden transition-all duration-300 ${
          isOpen
            ? "bg-gradient-to-br from-purple/10 to-pink-500/5 border-purple/30 shadow-lg shadow-purple/5"
            : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
        }`}
      >
        {/* Glow effect when open */}
        {isOpen && (
          <div className="absolute inset-0 bg-gradient-to-r from-purple/5 to-pink-500/5 blur-xl" />
        )}

        <button
          onClick={onToggle}
          className="relative w-full px-6 py-5 lg:px-8 lg:py-6 text-left flex items-center justify-between gap-4"
        >
          {/* Question number badge */}
          <div 
            className={`hidden sm:flex flex-shrink-0 w-10 h-10 rounded-xl items-center justify-center font-bold text-sm transition-all duration-300 ${
              isOpen 
                ? "bg-gradient-to-r from-purple to-pink-500 text-white" 
                : "bg-white/5 text-muted-foreground group-hover:bg-white/10"
            }`}
          >
            {String(index + 1).padStart(2, '0')}
          </div>

          <h3 className={`flex-1 text-base sm:text-lg lg:text-xl font-semibold transition-colors duration-300 ${
            isOpen ? "text-white" : "text-gray-200 group-hover:text-white"
          }`}>
            {faq.question}
          </h3>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isOpen 
                ? "bg-purple/20 text-purple" 
                : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-white"
            }`}
          >
            <BsChevronDown className="text-lg" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="relative px-6 pb-6 lg:px-8 lg:pb-8 sm:pl-24">
                {/* Answer */}
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>

                {/* Feedback Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-5 mt-5 border-t border-white/10">
                  <span className="text-sm text-muted-foreground">
                    এই উত্তরটি কি সহায়ক ছিল?
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeedback("helpful");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        feedback === "helpful"
                          ? "bg-green-500/20 text-success border border-green-500/30"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/10"
                      }`}
                    >
                      <BsHandThumbsUp />
                      <span>হ্যাঁ</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFeedback("not-helpful");
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        feedback === "not-helpful"
                          ? "bg-destructive/20 text-red-400 border border-red-500/30"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white border border-white/10"
                      }`}
                    >
                      <BsHandThumbsDown />
                      <span>না</span>
                    </button>
                  </div>
                  {feedback && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-purple"
                    >
                      ধন্যবাদ! 🙏
                    </motion.span>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set([faqData[0].id]));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("all");

  // Filter FAQs based on search and category
  const filteredFAQs = useMemo(() => {
    let filtered = faqData;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setOpenItems(new Set(filteredFAQs.map((faq) => faq.id)));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        {/* Gradient orbs - softer */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.08] bg-purple-400" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full blur-[150px] opacity-[0.06] bg-pink-400" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 w-[90%] lg:w-[85%] max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <HiSparkles className="text-yellow-400" />
            <span className="text-sm text-muted-foreground font-medium">সাধারণ প্রশ্নোত্তর</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            সচরাচর জিজ্ঞাসিত{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-pink-500">
              প্রশ্নাবলী
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            কোর্স, পেমেন্ট, সাপোর্ট সম্পর্কে তোমার প্রশ্নের উত্তর খুঁজে নাও
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-purple/20 to-pink-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative">
              <BsSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />
              <input
                type="text"
                placeholder="প্রশ্ন খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 lg:py-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-white placeholder-gray-500 focus:outline-none focus:border-purple/50 focus:ring-2 focus:ring-purple/20 transition-all text-base lg:text-lg"
              />
            </div>
          </div>

          {/* Category Filter & Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.value
                      ? "bg-gradient-to-r from-purple to-pink-500 text-white shadow-lg shadow-purple/25"
                      : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            {/* Expand/Collapse */}
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 transition-all"
              >
                সব খুলুন
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10 transition-all"
              >
                সব বন্ধ
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <FAQAccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openItems.has(faq.id)}
                onToggle={() => toggleItem(faq.id)}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <BsSearch className="text-3xl text-muted-foreground" />
              </div>
              <p className="text-xl text-muted-foreground mb-2">
                &ldquo;{searchQuery}&rdquo; এর জন্য কোনো ফলাফল পাওয়া যায়নি
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-purple hover:text-purple/80 font-medium underline underline-offset-4"
              >
                সব প্রশ্ন দেখুন
              </button>
            </motion.div>
          )}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-8 py-6 rounded-2xl bg-gradient-to-r from-purple/10 to-pink-500/10 border border-white/10">
            <p className="text-muted-foreground">
              তোমার প্রশ্নের উত্তর খুঁজে পাওনি?
            </p>
            <a
              href="https://www.facebook.com/groups/codervaicommunity"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple to-pink-500 text-white font-bold hover:opacity-90 transition-opacity"
            >
              আমাদের সাথে যোগাযোগ করো
            </a>
          </div>
        </motion.div>

        {/* SEO Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqData.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}

