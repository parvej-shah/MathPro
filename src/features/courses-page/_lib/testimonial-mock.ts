/**
 * TEMPORARY dev-only sample data for previewing the testimonial showcase
 * (specifically the video row) before real backend testimonials carry photos
 * and video URLs. Delete this file and its import in TestimonialShowcase.tsx
 * once the backend/admin photo + video work lands.
 */
import { Feedback } from "./types";

export const MOCK_TESTIMONIALS: Feedback[] = [
  {
    name: "আব্দুল্লাহ আল নোমান",
    bio: "নটর ডেম কলেজ • HSC 2025",
    description:
      "MathPro আমার গণিত নিয়ে ভাবনার ধরনটাই বদলে দিয়েছে। স্যারের পড়ানোর স্টাইল, সমস্যা সমাধানের কৌশল আর অনুপ্রেরণা আমাকে আত্মবিশ্বাস দিয়েছে।",
    rating: 5,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    name: "নুসরাত জাহান অর্ণি",
    bio: "ভিকারুননিসা নূন স্কুল • HSC 2025",
    description:
      "কনসেপ্ট ক্লিয়ারেন্স আর পরীক্ষার কৌশল এখানে যা শিখেছি, সেটা আমার রেজাল্টে বিশাল পার্থক্য এনে দিয়েছে।",
    rating: 5,
    videoUrl: "https://www.youtube.com/shorts/aqz-KE-bpKQ",
  },
  {
    name: "মোঃ রাকিব হাসান",
    bio: "ঢাকা রেসিডেনসিয়াল মডেল কলেজ • SSC 2026",
    description:
      "MathPro-তে যোগ দেওয়ার আগে গণিতকে ভয় পেতাম। এখন কঠিন অঙ্কও আত্মবিশ্বাসের সাথে সমাধান করি।",
    rating: 5,
    videoUrl: "https://youtu.be/9bZkp7q19f0",
  },
  {
    name: "ফাহিম আহমেদ",
    bio: "সরকারি বিজ্ঞান কলেজ • HSC 2025",
    description:
      "স্যার এত সহজভাবে সবকিছু বুঝিয়ে দেন যে কঠিন টপিকগুলোও সহজ আর মজার হয়ে যায়।",
    rating: 5,
    videoUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
  },
  {
    name: "জান্নাতুল ফেরদৌস",
    bio: "কুমিল্লা সরকারি কলেজ • ভর্তি 2025",
    description:
      "MathPro-র প্র্যাকটিস শিট আর মডেল টেস্টগুলো আমার ভর্তি প্রস্তুতির জন্য গেম চেঞ্জার ছিল।",
    rating: 5,
    videoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
  },
  {
    name: "সামিউল ইসলাম",
    bio: "ঢাকা কলেজ • HSC 2025",
    description:
      "লাইভ ক্লাসে সরাসরি প্রশ্ন করার সুযোগটা সবচেয়ে বেশি কাজে দিয়েছে। কোনো কনফিউশন জমে থাকে না।",
    rating: 5,
    videoUrl: "https://www.youtube.com/shorts/2Vv-BfVoq4g",
  },
  {
    name: "তানজিলা রহমান",
    bio: "হলি ক্রস কলেজ • SSC 2026",
    description:
      "জ্যামিতি আগে সবচেয়ে কঠিন লাগত। এখন এটাই আমার প্রিয় অধ্যায় হয়ে গেছে।",
    rating: 5,
    videoUrl: "https://youtu.be/RgKAFK5djSk",
  },
  {
    name: "সাকিব আল হাসান",
    bio: "রাজশাহী কলেজ • ভর্তি 2025",
    description:
      "রেকর্ডেড ক্লাসগুলো বারবার দেখে নিজের গতিতে শিখতে পেরেছি, এটাই সবচেয়ে বড় সুবিধা।",
    rating: 5,
    videoUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
  },
  {
    name: "মেহেদী হাসান",
    bio: "চট্টগ্রাম কলেজ • HSC 2026",
    description:
      "প্রতিটি টপিকের শেষে কুইজ থাকায় নিজের দুর্বলতা সাথে সাথেই ধরতে পারি।",
    rating: 5,
    videoUrl: "https://www.youtube.com/shorts/fJ9rUzIMcZQ",
  },
  {
    name: "সাদিয়া আক্তার",
    bio: "সিলেট সরকারি মহিলা কলেজ • SSC 2026",
    description:
      "বাংলায় এত পরিষ্কার ব্যাখ্যা আর কোথাও পাইনি। ত্রিকোণমিতি এখন সহজ মনে হয়।",
    rating: 5,
    videoUrl: "https://youtu.be/CevxZvSJLk8",
  },
];
