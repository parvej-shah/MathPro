import Image from "next/image";
import { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi2";
import { FaFacebook, FaUsers, FaArrowRight } from "react-icons/fa";

interface FacebookCommunityCTASectionProps {
  className?: string;
}

export default function FacebookCommunityCTASection({
  className = "",
}: FacebookCommunityCTASectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check if device supports touch
    setIsTouchDevice(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0,
    );
  }, []);

  // Handle click to open Facebook group
  const handleJoinClick = () => {
    const groupUrl = "https://www.facebook.com/groups/codervaicommunity";

    if (typeof window === "undefined") return;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const fbAppUrl = `fb://group/codervaicommunity`;
      const link = document.createElement("a");
      link.href = fbAppUrl;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.open(groupUrl, "_blank", "noopener,noreferrer");
      }, 500);
    } else {
      window.open(groupUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      className={`relative w-full overflow-hidden py-16 md:py-20 lg:py-24 ${className}`}
    >
      {/* Dark Background with gradient */}
      <div className="absolute inset-0 bg-background">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] opacity-20 bg-purple-600" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 bg-pink-500" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-[90%] lg:w-[85%] max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left Side: Text Content */}
          <div className="flex-1 w-full lg:w-auto text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
              <FaFacebook className="text-[#1877F2]" />
              <span className="text-sm text-muted-foreground font-medium">
                ফেসবুক গ্রুপ
              </span>
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              আমাদের{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-pink-500">
                কমিউনিটিতে
              </span>{" "}
              যোগ দাও
            </h2>

            {/* Description */}
            <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              তুমি হতে পারো কোডার, গবেষক, কিংবা একজন লিডার - দিনশেষে আমরা সবাই
              প্রবলেম সলভার! কানেক্ট করো যারা গতানুগতিকতার বাইরে ভাবে, শেয়ার
              করো তোমার ভিশন, প্রজেক্ট বা রিসার্চ। চলো একসাথে ইমপ্যাক্টফুল কিছু
              তৈরি করি!
            </p>

            {/* CTA Button & Member Count */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <button
                onClick={handleJoinClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative px-8 py-4 text-base font-bold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 w-full sm:w-auto flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #B153E0 0%, #EE4878 100%)",
                  boxShadow: "0 20px 40px -10px rgba(177, 83, 224, 0.4)",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <FaFacebook className="text-lg" />
                  <span>কমিউনিটিতে জয়েন করো</span>
                  <FaArrowRight
                    className={`text-sm transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                  />
                </span>
              </button>

              {/* Member Count */}
              <div className="flex items-center justify-center gap-3 px-5 py-3 rounded-full bg-white/5 border border-white/10 w-full sm:w-auto">
                <FaUsers className="text-purple text-lg" />
                <span className="text-muted-foreground">
                  <span className="font-bold text-white">7000+</span> সদস্য
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Facebook Group Card */}
          <div className="flex-shrink-0 w-full lg:w-[45%] max-w-lg lg:max-w-none">
            <div
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#12101A] shadow-2xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                boxShadow: "0 25px 50px -12px rgba(177, 83, 224, 0.25)",
              }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple/20 to-pink-500/20 blur-xl opacity-50" />

              {/* Card content */}
              <div className="relative">
                {/* Cover Image */}
                <div
                  className={`relative w-full aspect-[16/9] overflow-hidden transition-transform duration-500 ${
                    !isTouchDevice && isHovered ? "scale-105" : ""
                  }`}
                >
                  <Image
                    src="https://image.codervai.com/cselp/codervai_community_crop.png"
                    alt="CODER VAI Community"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12101A] via-transparent to-transparent" />
                </div>

                {/* Group Info */}
                <div className="p-5 bg-[#12101A]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple to-pink-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        &lt;/&gt;
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        CODER VAI Community
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FaUsers className="text-xs" />
                        <span>7k+ সদস্য</span>
                        <span className="text-foreground">•</span>
                        <span className="text-purple">Public group</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-2">
                    {["প্রবলেম সলভিং", "নেটওয়ার্কিং", "ক্যারিয়ার গাইড"].map(
                      (tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-xs font-medium text-muted-foreground rounded-full bg-white/5 border border-white/10"
                        >
                          {tag}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
