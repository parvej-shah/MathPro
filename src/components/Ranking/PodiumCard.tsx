"use client";

import React from "react";
import { motion } from "framer-motion";
import { RankingUser } from "@/hooks/useRanking";

interface PodiumCardProps {
  user: RankingUser;
  position: 1 | 2 | 3;
  delay?: number;
}

function toBanglaNumber(value: number | string) {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return value.toString().replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}

const PodiumCard: React.FC<PodiumCardProps> = ({ user, position, delay = 0 }) => {
  const getPositionStyles = () => {
    switch (position) {
      case 1:
        return {
          gradient: "from-primary/35 via-card/90 to-accent/20",
          border: "border-primary/60",
          shadow: "shadow-2xl shadow-primary/20",
          avatarGradient: "from-primary/80 to-accent/80",
          avatarSize: 'w-36 h-36',
          badgeSize: 'w-16 h-16',
          badgeText: 'text-3xl',
          badgeBg: 'bg-primary text-primary-foreground',
          nameSize: 'text-2xl',
          scoreSize: 'text-5xl',
          showCrown: true,
          order: 'order-1 md:order-2',
          marginTop: '',
        };
      case 2:
        return {
          gradient: 'from-card/90 to-muted/80',
          border: 'border-border',
          shadow: 'shadow-2xl shadow-foreground/10',
          avatarGradient: 'from-muted to-card',
          avatarSize: 'w-32 h-32',
          badgeSize: 'w-12 h-12',
          badgeText: 'text-xl',
          badgeBg: 'bg-muted text-foreground',
          nameSize: 'text-xl',
          scoreSize: 'text-4xl',
          showCrown: false,
          order: 'order-2 md:order-1',
          marginTop: 'md:mt-16',
        };
      case 3:
        return {
          gradient: 'from-accent/25 to-card/90',
          border: 'border-accent/50',
          shadow: 'shadow-2xl shadow-accent/10',
          avatarGradient: 'from-accent/80 to-secondary',
          avatarSize: 'w-32 h-32',
          badgeSize: 'w-12 h-12',
          badgeText: 'text-xl',
          badgeBg: 'bg-accent text-accent-foreground',
          nameSize: 'text-xl',
          scoreSize: 'text-4xl',
          showCrown: false,
          order: 'order-3 md:order-3',
          marginTop: 'md:mt-16',
        };
    }
  };

  const styles = getPositionStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className={`${styles.order} ${styles.marginTop}`}
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative bg-linear-to-br ${styles.gradient} backdrop-blur-xl border-2 ${styles.border} rounded-3xl p-8 ${styles.shadow} group cursor-pointer`}
      >
        {/* Crown for 1st place */}
        {styles.showCrown && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3, type: "spring", stiffness: 200 }}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/50 rounded-full blur-xl"></div>
              <motion.svg 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-16 h-16 text-primary drop-shadow-2xl" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            </div>
          </motion.div>
        )}
        
        {/* Rank Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1 }}
          className={`absolute -top-4 -right-4 ${styles.badgeBg} ${styles.badgeSize} rounded-full flex items-center justify-center font-bold ${styles.badgeText} shadow-xl border-4 border-background/40 group-hover:scale-110 transition-transform ${position === 1 ? 'drop-shadow-lg' : ''}`}
        >
          {toBanglaNumber(position)}
        </motion.div>
        
        <div className={`flex flex-col items-center ${styles.showCrown ? 'pt-6' : ''}`}>
          {/* Avatar Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.1, type: "spring", stiffness: 150 }}
            className="relative mb-6"
          >
            <div className={`absolute inset-0 ${position === 1 ? 'bg-primary/45 animate-pulse blur-2xl' : position === 2 ? 'bg-muted-foreground/20 blur-xl' : 'bg-accent/35 blur-xl'} rounded-full`}></div>
            <div className={`relative ${styles.avatarSize} rounded-full bg-linear-to-br ${styles.avatarGradient} flex items-center justify-center shadow-2xl border-4 ${position === 1 ? 'border-primary/50 ring-4 ring-primary/20' : 'border-background/40'}`}>
              <motion.svg 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`${position === 1 ? 'w-20 h-20 text-primary-foreground' : 'w-16 h-16'} ${position === 2 ? 'text-muted-foreground' : position === 3 ? 'text-accent-foreground' : ''}`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            </div>
          </motion.div>
          
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.4 }}
            className={`font-bold ${styles.nameSize} text-foreground drop-shadow-sm text-center mb-2 line-clamp-2 ${position === 1 ? 'min-h-[3rem]' : 'min-h-[2.5rem]'}`}
          >
            {user.name}
          </motion.h3>
          
          {user.cf_handle && (
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.5 }}
              href={`https://codeforces.com/profile/${user.cf_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-info hover:text-info/80 text-sm mb-4 hover:underline transition-colors font-medium transform hover:scale-105"
            >
              @{user.cf_handle}
            </motion.a>
          )}
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.6, type: "spring", stiffness: 200 }}
            className={`${styles.scoreSize} font-bold text-foreground drop-shadow-sm mb-1`}
          >
            {toBanglaNumber(user.score)}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.7 }}
            className={`text-sm font-semibold ${position === 1 ? 'text-primary' : position === 2 ? 'text-muted-foreground' : 'text-accent'}`}
          >
            পয়েন্ট
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PodiumCard;
