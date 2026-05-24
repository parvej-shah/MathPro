import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { BsStarFill, BsChatQuoteFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import { Feedback } from "../_lib/types";
import gsap from "gsap";

interface TestimonialMarqueeProps {
  feedbacks: Feedback[];
}

// Static testimonials as fallback
const staticTestimonials: Feedback[] = [
  {
    name: "Tahmid Mahmud",
    bio: "CP101 Student",
    description: "The course was a whole itself, though I'm new to CP, I still managed to get a decent knowledge about the problems, processes of thinking a way, making the solution efficient and much more. And to say, I got more than I thought from this course.",
    imageUploadedLink: "",
  },
  {
    name: "Israt Tamanna",
    bio: "CP101 Student",
    description: "Best Course in Bangladesh till now. The instructors are incredibly supportive and the content is top-notch.",
    imageUploadedLink: "",
  },
  {
    name: "Salman Farsi",
    bio: "CP101 Student",
    description: "Learnt some tricks, got familiar with some resources & could figure out my weaknesses. Highly recommended!",
    imageUploadedLink: "",
  },
  {
    name: "Minara Munmun",
    bio: "CP101 Student",
    description: "The course was a whole itself, though I'm new to CP, I still managed to get a decent knowledge about the problems, processes of thinking a way, making the solution efficient and much more.",
    imageUploadedLink: "",
  },
  {
    name: "Tohidur Mujahid",
    bio: "CP101 Student",
    description: "Your course design was the best. Everything was well structured and easy to follow.",
    imageUploadedLink: "",
  },
  {
    name: "Ahmed Hossain",
    bio: "CP101 Student",
    description: "The instructors were very knowledgeable and always ready to help. I learned so much in such a short time!",
    imageUploadedLink: "",
  },
  {
    name: "Fariha Khan",
    bio: "CP101 Student",
    description: "This course helped me understand competitive programming concepts that I struggled with for years.",
    imageUploadedLink: "",
  },
  {
    name: "Rafiq Islam",
    bio: "CP101 Student",
    description: "The course structure was well organized and easy to follow. I highly recommend it to anyone wanting to improve their programming skills.",
    imageUploadedLink: "",
  },
  {
    name: "Sadia Rahman",
    bio: "CP101 Student",
    description: "Amazing experience! The practice problems were challenging but helped me grow as a programmer.",
    imageUploadedLink: "",
  },
  {
    name: "Kamal Hasan",
    bio: "CP101 Student",
    description: "The mentorship from BUET CSE and Google engineers was invaluable. Their insights and feedback made a huge difference.",
    imageUploadedLink: "",
  },
  {
    name: "Nusrat Jahan",
    bio: "CP101 Student",
    description: "I feel much more confident in my programming abilities after completing this course. Thank you CoderVai!",
    imageUploadedLink: "",
  },
  {
    name: "Fahim Ahmed",
    bio: "CP101 Student",
    description: "The live sessions were particularly helpful. Being able to ask questions in real-time made learning much easier.",
    imageUploadedLink: "",
  },
  {
    name: "Nadia Akter",
    bio: "Web Development Student",
    description: "Best investment I made for my career. The live classes and community support are exceptional!",
    imageUploadedLink: "",
  },
  {
    name: "Tanvir Ahmed",
    bio: "CP101 Student",
    description: "From zero to hero in competitive programming. This course changed my approach to problem-solving completely.",
    imageUploadedLink: "",
  },
  {
    name: "Fahmida Khatun",
    bio: "App Development Student",
    description: "The structured approach and real-world projects helped me land my dream internship. Forever grateful!",
    imageUploadedLink: "",
  },
  {
    name: "Rakib Hassan",
    bio: "CP101 Student",
    description: "The problem-solving techniques taught here are world-class. I've improved my Codeforces rating significantly!",
    imageUploadedLink: "",
  },
  {
    name: "Sumaiya Akter",
    bio: "CP101 Student",
    description: "Finally found a course that explains complex algorithms in Bengali. Made learning so much easier for me.",
    imageUploadedLink: "",
  },
  {
    name: "Mehedi Hasan",
    bio: "CP101 Student",
    description: "The contest practice sessions were amazing. I feel prepared for ICPC now!",
    imageUploadedLink: "",
  },
];

// Gradient colors for cards
const cardGradients = [
  { from: "#667eea", to: "#764ba2" },
  { from: "#f093fb", to: "#f5576c" },
  { from: "#4facfe", to: "#00f2fe" },
  { from: "#43e97b", to: "#38f9d7" },
  { from: "#fa709a", to: "#fee140" },
  { from: "#a18cd1", to: "#fbc2eb" },
];

const TestimonialCard = ({
  feedback,
  index,
}: {
  feedback: Feedback;
  index: number;
}) => {
  const gradient = cardGradients[index % cardGradients.length];
  
  return (
    <div className="group relative flex-shrink-0 w-[300px] md:w-[360px]">
      {/* Hover glow */}
      <div 
        className="absolute -inset-1 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
      />
      
      {/* Card */}
      <div className="relative h-full p-5 md:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.06]">
        {/* Quote icon */}
        <div 
          className="absolute -top-3 left-6 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
          style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
        >
          <BsChatQuoteFill className="text-white text-sm" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3 pt-1">
          {[...Array(5)].map((_, i) => (
            <BsStarFill key={i} className="text-yellow-400 text-xs" />
          ))}
          <span className="text-muted-foreground text-xs ml-2">5.0</span>
        </div>

        {/* Quote text */}
        <p className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-3">
          &ldquo;{feedback.description}&rdquo;
        </p>

        {/* Divider */}
        <div 
          className="w-12 h-0.5 rounded-full mb-4"
          style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }}
        />

        {/* Author */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full p-0.5"
            style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
          >
            <div className="w-full h-full rounded-full overflow-hidden bg-background flex items-center justify-center">
              {feedback.imageUploadedLink ? (
                <Image
                  src={feedback.imageUploadedLink}
                  alt={feedback.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {feedback.name?.charAt(0) || "?"}
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-white font-medium text-sm">{feedback.name}</p>
            <p className="text-muted-foreground text-xs">{feedback.bio}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialMarquee({ feedbacks }: TestimonialMarqueeProps) {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  // Check if API feedbacks have proper names (not mostly "Anonymous")
  const hasProperNames = feedbacks.filter(f => 
    f.name && !f.name.toLowerCase().includes('anonymous')
  ).length > feedbacks.length / 2;

  // Use static testimonials if API has mostly anonymous names or no feedbacks
  const allFeedbacks = (feedbacks.length > 0 && hasProperNames) ? feedbacks : staticTestimonials;
  
  // Split feedbacks into two rows
  const row1Feedbacks = allFeedbacks.filter((_, i) => i % 2 === 0);
  const row2Feedbacks = allFeedbacks.filter((_, i) => i % 2 === 1);
  
  // Duplicate for seamless loop
  const row1Items = [...row1Feedbacks, ...row1Feedbacks, ...row1Feedbacks];
  const row2Items = [...row2Feedbacks, ...row2Feedbacks, ...row2Feedbacks];

  useEffect(() => {
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    
    if (!row1 || !row2) return;

    // Calculate widths
    const row1Width = row1.scrollWidth / 3;
    const row2Width = row2.scrollWidth / 3;

    // Row 1: Scroll left
    const anim1 = gsap.to(row1, {
      x: -row1Width,
      duration: 50,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % row1Width),
      },
    });

    // Row 2: Scroll right (starts offset)
    gsap.set(row2, { x: -row2Width });
    const anim2 = gsap.to(row2, {
      x: 0,
      duration: 45,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const val = parseFloat(x);
          return val >= 0 ? val - row2Width : val;
        }),
      },
    });

    animationsRef.current = [anim1, anim2];

    return () => {
      anim1.kill();
      anim2.kill();
    };
  }, []);

  // Pause/Resume on hover
  useEffect(() => {
    animationsRef.current.forEach((anim) => {
      if (isPaused) {
        gsap.to(anim, { timeScale: 0, duration: 0.5 });
      } else {
        gsap.to(anim, { timeScale: 1, duration: 0.5 });
      }
    });
  }, [isPaused]);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background">
        {/* Soft gradient orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.08] bg-purple-400" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px] opacity-[0.06] bg-pink-400" />
        
        {/* Subtle grid */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-[1440px] mx-auto px-6 mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <HiSparkles className="text-yellow-400" />
            <span className="text-sm text-muted-foreground font-medium">Student Success Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            শিক্ষার্থীদের মতামত
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            হাজারো শিক্ষার্থীর সাফল্যের গল্প। তাদের অভিজ্ঞতা আপনার অনুপ্রেরণা।
          </p>
        </div>

        {/* Two-Row Marquee with Tilt */}
        <div 
          className="relative pt-6 pb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            transform: 'rotate(-2deg) scale(1.03)',
            transformOrigin: 'center center',
          }}
        >
          {/* Gradient overlays - extended for tilted view */}
          <div className="absolute -left-20 top-0 bottom-0 w-48 md:w-72 bg-gradient-to-r from-[#0B060D] via-[#0B060D]/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute -right-20 top-0 bottom-0 w-48 md:w-72 bg-gradient-to-l from-[#0B060D] via-[#0B060D]/80 to-transparent z-20 pointer-events-none" />

          {/* Row 1 - Scrolls Left */}
          <div className="overflow-hidden mb-5 pt-4">
            <div ref={row1Ref} className="flex gap-5" style={{ width: 'max-content' }}>
              {row1Items.map((feedback, index) => (
                <TestimonialCard
                  key={`row1-${feedback.name}-${index}`}
                  feedback={feedback}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Row 2 - Scrolls Right */}
          <div className="overflow-hidden pt-4">
            <div ref={row2Ref} className="flex gap-5" style={{ width: 'max-content' }}>
              {row2Items.map((feedback, index) => (
                <TestimonialCard
                  key={`row2-${feedback.name}-${index}`}
                  feedback={feedback}
                  index={index + row1Feedbacks.length}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
