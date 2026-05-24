import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BsPeople, BsChat, BsArrowRight } from "react-icons/bs";

interface CommunityBentoBoxProps {
  facebookCommunityUrl?: string;
  facebookCommunityThumb?: string;
}

export default function CommunityBentoBox({
  facebookCommunityUrl = "https://www.facebook.com/groups/codervaibd",
  facebookCommunityThumb,
}: CommunityBentoBoxProps) {
  return (
    <div className="py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-heading dark:text-darkHeading mb-2">
            Join the <span className="text-purple">Tribe</span>
          </h2>
          <p className="text-paragraph dark:text-darkParagraph max-w-2xl mx-auto">
            হাজারো প্রোগ্রামারদের সাথে যুক্ত হও, শেয়ার করো তোমার জ্ঞান, এবং একসাথে বেড়ে উঠো
          </p>
        </div>

        {/* Bento Grid - Redesigned */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Community Preview Card - Left */}
          <div className="lg:col-span-7 group">
            <div className="h-full bg-gradient-to-br from-blue-500/10 to-purple/10 dark:from-blue-900/20 dark:to-purple/20 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-border/30 overflow-hidden hover:border-purple/50 transition-all duration-300 flex flex-col">
              {/* Community Image Container */}
              <div className="relative flex-1 min-h-[300px] md:min-h-[400px]">
                {facebookCommunityThumb ? (
                  <Image
                    src={facebookCommunityThumb}
                    alt="CoderVai Community"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <Image
                    src="/codervai_community_crop.png"
                    alt="CoderVai Community"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                {/* Gradient overlay - stronger at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              
              {/* Text Content - Outside image, at card bottom */}
              <div className="relative z-10 p-6 md:p-8 bg-gradient-to-t from-black to-black/90 -mt-24">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  CODER VAI Community
                </h3>
                <p className="text-white/80 text-sm md:text-base max-w-lg">
                  তুমি হতে পারো কোডার, গবেষক, কিংবা একজন লিডার - দিনশেষে আমরা সবাই প্রবলেম সলভার!
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - CTA + Stats */}
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
            {/* PROMINENT JOIN CTA CARD */}
            <div className="group relative overflow-hidden">
              <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 md:p-8 border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                {/* Animated background glow */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white/80 text-xs uppercase tracking-wider font-medium">
                        Facebook Private Group
                      </p>
                      <p className="text-white font-bold text-lg">
                        ফ্রি-তে জয়েন করো!
                      </p>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-6">
                    প্রতিদিন নতুন প্রবলেম, ডিসকাশন, এবং এক্সপার্টদের সাথে সরাসরি কানেক্ট করার সুযোগ
                  </p>

                  <Link href={facebookCommunityUrl} target="_blank" className="block">
                    <button className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-muted text-info rounded-xl font-bold text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl group/btn transform hover:scale-[1.02]">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      গ্রুপে জয়েন করো
                      <BsArrowRight className="transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {/* Stats Card - Members */}
              <div className="group">
                <div className="h-full bg-white/70 dark:bg-muted/50 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-border/30 p-5 hover:border-purple/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-purple/10 dark:bg-purple/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BsPeople className="text-xl text-purple" />
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-heading dark:text-darkHeading mb-1">
                    5,000+
                  </h4>
                  <p className="text-paragraph dark:text-darkParagraph text-xs md:text-sm">
                    অ্যাক্টিভ মেম্বার
                  </p>
                </div>
              </div>

              {/* Stats Card - Discussions */}
              <div className="group">
                <div className="h-full bg-white/70 dark:bg-muted/50 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-border/30 p-5 hover:border-teal/50 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 dark:bg-teal/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <BsChat className="text-xl text-teal" />
                  </div>
                  <h4 className="text-2xl md:text-3xl font-bold text-heading dark:text-darkHeading mb-1">
                    1,000+
                  </h4>
                  <p className="text-paragraph dark:text-darkParagraph text-xs md:text-sm">
                    সাপ্তাহিক আলোচনা
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
