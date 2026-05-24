import React from 'react';
import { motion } from 'framer-motion';
import { RankingUser } from '@/hooks/useRanking';

interface MyRankBannerProps {
  myData: RankingUser;
}

const MyRankBanner: React.FC<MyRankBannerProps> = ({ myData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="max-w-5xl mx-auto mb-8"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-gradient-to-r from-purple/20 via-purple/15 to-pink-500/20 backdrop-blur-lg border border-purple/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple/5 to-pink-500/5 rounded-2xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="bg-purple/20 p-3 rounded-full border border-purple/30 shadow-lg"
            >
              <motion.svg 
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 text-purple" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            </motion.div>
            <div className="text-center sm:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-darkParagraph font-semibold text-sm mb-1"
              >
                Your Current Rank
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                className="text-darkHeading text-3xl font-bold flex items-center gap-2"
              >
                <span className="text-purple">#{myData.rank}</span>
                {parseInt(myData.rank) <= 3 && (
                  <motion.svg 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                    className={`w-6 h-6 ${
                      parseInt(myData.rank) === 1 ? 'text-yellow-400' : 
                      parseInt(myData.rank) === 2 ? 'text-gray-400' : 'text-orange-400'
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </motion.svg>
                )}
              </motion.div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <div className="text-darkParagraph text-sm mb-1">Your Score</div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                className="text-darkHeading text-2xl font-bold text-purple"
              >
                {myData.score}
              </motion.div>
            </motion.div>
            
            {myData.cf_handle && (
              <motion.a
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={`https://codeforces.com/profile/${myData.cf_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple/20 border border-purple/30 text-purple px-4 py-2 rounded-lg hover:bg-purple/30 transition-all duration-200 font-medium shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                @{myData.cf_handle}
              </motion.a>
            )}
          </div>
        </div>
        
        {/* Progress indicator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple to-pink-500 rounded-full"
          style={{ width: '100%' }}
        />
      </motion.div>
    </motion.div>
  );
};

export default MyRankBanner;