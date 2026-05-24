import React, { useEffect, useState, useRef } from "react";
import { BsPeople, BsBook, BsStarFill, BsPlayCircleFill, BsCameraVideoFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import { StatsData } from "../_lib/types";

interface HeroStatsStripProps {
  stats: StatsData;
}

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  suffix = "",
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = easeOutQuart * end;
      setCount(decimals > 0 ? currentValue : Math.floor(currentValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible, decimals]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + "k";
    }
    return num.toLocaleString();
  };

  return (
    <span ref={ref} className="tabular-nums">
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

// Stat card configuration
const statConfig = [
  {
    key: "students",
    icon: BsPeople,
    gradient: { from: "#a855f7", to: "#ec4899" },
    bgGlow: "purple",
  },
  {
    key: "courses",
    icon: BsBook,
    gradient: { from: "#14b8a6", to: "#06b6d4" },
    bgGlow: "teal",
  },
  {
    key: "rating",
    icon: BsStarFill,
    gradient: { from: "#f59e0b", to: "#f97316" },
    bgGlow: "yellow",
  },
  {
    key: "liveClasses",
    icon: BsPlayCircleFill,
    gradient: { from: "#ef4444", to: "#ec4899" },
    bgGlow: "red",
  },
  {
    key: "videos",
    icon: BsCameraVideoFill,
    gradient: { from: "#3b82f6", to: "#8b5cf6" },
    bgGlow: "blue",
  },
];

export default function HeroStatsStrip({ stats }: HeroStatsStripProps) {
  const statsData = [
    { value: Math.max(stats.totalStudents, 5500), label: "শিক্ষার্থী", suffix: "+", decimals: 0 },
    { value: stats.totalCourses, label: "কোর্স", suffix: "+", decimals: 0 },
    { value: stats.averageRating, label: "রেটিং", suffix: "/5", decimals: 1 },
    { value: stats.totalLiveClasses, label: "লাইভ ক্লাস", suffix: "+", decimals: 0 },
    { value: stats.totalRecordedVideos, label: "রেকর্ডেড ভিডিও", suffix: "+", decimals: 0 },
  ];

  return (
    <div className="w-full py-8 md:py-12">
      {/* Stats Container */}
      <div className="relative">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple/5 via-teal/5 to-purple/5 rounded-3xl blur-xl" />
        
        {/* Main card */}
        <div className="relative bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-10 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-teal/10 rounded-full blur-3xl" />
          
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          {/* Stats Grid */}
          <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
            {statsData.map((stat, index) => {
              const config = statConfig[index];
              const Icon = config.icon;
              
              return (
                <div 
                  key={config.key}
                  className="group relative"
                >
                  {/* Hover glow */}
                  <div 
                    className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
                    style={{ background: `linear-gradient(135deg, ${config.gradient.from}20, ${config.gradient.to}20)` }}
                  />
                  
                  {/* Content */}
                  <div className="relative flex items-center gap-4">
                    {/* Icon */}
                    <div 
                      className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: `linear-gradient(135deg, ${config.gradient.from}20, ${config.gradient.to}20)` }}
                    >
                      <Icon 
                        className="text-2xl"
                        style={{ color: config.gradient.from }}
                      />
                      {/* Sparkle always visible */}
                      <HiSparkles 
                        className="absolute -top-1 -right-1 text-sm animate-pulse"
                        style={{ color: config.gradient.from }}
                      />
                    </div>
                    
                    {/* Text */}
                    <div>
                      <p 
                        className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent"
                        style={{ 
                          backgroundImage: `linear-gradient(135deg, ${config.gradient.from}, ${config.gradient.to})`,
                        }}
                      >
                        <AnimatedCounter 
                          end={stat.value} 
                          suffix={stat.suffix} 
                          decimals={stat.decimals}
                        />
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
