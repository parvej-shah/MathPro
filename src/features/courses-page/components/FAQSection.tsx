"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import {
  Search,
  ChevronDown,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BookOpen,
  Pencil,
  CreditCard,
  Headphones,
  GraduationCap,
  FileQuestion,
} from "lucide-react";
import { SafeHtmlRenderer } from "@/components/SafeHtmlRenderer";
import { usePublicFaqs } from "@/hooks/usePublicFaqs";
import { PublicFAQ } from "@/types/faq";

type FAQCategory = "all" | "courses" | "enrollment" | "payment" | "support" | "certificate";

const categories: { value: FAQCategory; label: string; Icon: React.ElementType }[] = [
  { value: "all", label: "সব প্রশ্ন", Icon: FileQuestion },
  { value: "courses", label: "কোর্স", Icon: BookOpen },
  { value: "enrollment", label: "ভর্তি", Icon: Pencil },
  { value: "payment", label: "পেমেন্ট", Icon: CreditCard },
  { value: "support", label: "সাপোর্ট", Icon: Headphones },
  { value: "certificate", label: "সার্টিফিকেট", Icon: GraduationCap },
];

function FAQAccordionItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: PublicFAQ;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const [feedback, setFeedback] = useState<"helpful" | "not-helpful" | null>(null);

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isOpen
          ? "bg-card border-primary/30 shadow-lg shadow-primary/8 dark:border-emerald-400/35 dark:shadow-emerald-400/10"
          : "bg-card border-border hover:border-primary/20 dark:hover:border-emerald-500/25"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full px-5 py-5 lg:px-7 lg:py-6 text-left flex items-center justify-between gap-4"
      >
        <div
          className={`hidden sm:flex shrink-0 w-10 h-10 rounded-xl items-center justify-center font-extrabold text-sm transition-all duration-300 ${
            isOpen ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <h3
          className={`flex-1 text-base sm:text-lg font-bold transition-colors duration-300 ${
            isOpen ? "text-primary" : "text-heading"
          }`}
        >
          {faq.question}
        </h3>

        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isOpen ? "bg-primary/10 text-primary rotate-180" : "bg-muted text-muted-foreground"
          }`}
        >
          <ChevronDown className="size-5" />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-6 lg:px-7 lg:pb-7 sm:pl-22">
            <SafeHtmlRenderer
              content={faq.answer}
              className="text-base text-paragraph leading-relaxed"
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-5 mt-5 border-t border-border">
              <span className="text-sm text-muted-foreground">
                এই উত্তরটি কি সহায়ক ছিল?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFeedback("helpful");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    feedback === "helpful"
                      ? "bg-success/15 text-success border border-success/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/70 border border-border"
                  }`}
                >
                  <ThumbsUp className="size-4" />
                  <span>হ্যাঁ</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFeedback("not-helpful");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    feedback === "not-helpful"
                      ? "bg-destructive/15 text-destructive border border-destructive/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/70 border border-border"
                  }`}
                >
                  <ThumbsDown className="size-4" />
                  <span>না</span>
                </button>
              </div>
              {feedback && <span className="text-sm font-semibold text-primary">ধন্যবাদ!</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const { faqs: faqData, loading } = usePublicFaqs();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("all");

  useEffect(() => {
    if (faqData.length > 0 && openItems.size === 0) {
      setOpenItems(new Set([String(faqData[0].id)]));
    }
  }, [faqData, openItems.size]);

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
          faq.answer.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [faqData, searchQuery, selectedCategory]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setOpenItems(new Set(filteredFAQs.map((faq) => String(faq.id))));
  const collapseAll = () => setOpenItems(new Set());

  return (
    <section className="relative py-20 md:py-24 bg-section-b overflow-hidden">
      <div
        aria-hidden
        className="absolute top-4 -left-10 md:-left-6 text-[10rem] md:text-[18rem] text-primary/10 font-serif font-black select-none pointer-events-none leading-none z-0 animate-motif-float"
        style={{ ["--motif-rot" as string]: "12deg", ["--motif-tx" as string]: "10px", ["--motif-ty" as string]: "-12px", ["--motif-dr" as string]: "2deg", animationDuration: "15s" }}
      >
        ?
      </div>
      <div
        aria-hidden
        className="absolute -bottom-16 -right-10 md:-right-6 text-[10rem] md:text-[18rem] text-primary/10 font-serif font-black select-none pointer-events-none leading-none z-0 animate-motif-float"
        style={{ ["--motif-rot" as string]: "-12deg", ["--motif-tx" as string]: "-12px", ["--motif-ty" as string]: "10px", ["--motif-dr" as string]: "-2deg", animationDelay: "-7s", animationDuration: "17s" }}
      >
        Ω
      </div>

      <div className="relative z-10 w-[90%] lg:w-[85%] max-w-[1440px] mx-auto">
        <div className="text-center mb-12 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-bold uppercase tracking-widest text-primary">
              সাধারণ প্রশ্নোত্তর
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-heading leading-tight mb-4">
            সচরাচর জিজ্ঞাসিত প্রশ্নাবলী
          </h2>

          <p className="text-base text-paragraph max-w-xl mx-auto">
            কোর্স, পেমেন্ট ও সাপোর্ট সম্পর্কে তোমার প্রশ্নের উত্তর এখানেই খুঁজে নাও।
          </p>
        </div>

        <div className="mb-10 space-y-5">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="প্রশ্ন খুঁজো..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-card border border-border text-heading placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/15 dark:focus:border-emerald-500/60 transition-all text-base"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {categories.map(({ value, label, Icon }) => {
                const active = selectedCategory === value;
                return (
                  <button
                    key={value}
                    onClick={() => setSelectedCategory(value)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 dark:shadow-primary/25"
                        : "bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-primary dark:hover:border-emerald-500/40 dark:hover:shadow-sm dark:hover:shadow-emerald-500/10"
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-primary dark:hover:border-emerald-500/40 transition-all"
              >
                সব খুলো
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-card text-muted-foreground border border-border hover:border-primary/30 hover:text-primary dark:hover:border-emerald-500/40 transition-all"
              >
                সব বন্ধ করো
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3 max-w-4xl mx-auto">
          {loading ? (
            [0, 1, 2].map((item) => (
              <div key={item} className="rounded-2xl border border-border bg-card p-6 animate-pulse">
                <div className="h-6 w-2/3 bg-muted rounded mb-4" />
                <div className="h-4 w-full bg-muted rounded mb-2" />
                <div className="h-4 w-5/6 bg-muted rounded" />
              </div>
            ))
          ) : filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <FAQAccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openItems.has(String(faq.id))}
                onToggle={() => toggleItem(String(faq.id))}
                index={index}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <p className="text-lg text-paragraph mb-2">
                &ldquo;{searchQuery}&rdquo; এর জন্য কোনো ফলাফল পাওয়া যায়নি
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-primary font-semibold hover:underline underline-offset-4"
              >
                সব প্রশ্ন দেখো
              </button>
            </div>
          )}
        </div>

        <Script
          id="mathpro-faq-schema"
          type="application/ld+json"
          strategy="afterInteractive"
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
