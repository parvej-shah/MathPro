import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRanking } from '@/hooks/useRanking';
import { getUserIdFromToken } from '@/helpers';

interface RankingCardProps {
  courseId: string;
  loading?: boolean;
}

const RankingCard: React.FC<RankingCardProps> = ({ courseId, loading = false }) => {
  const userId = getUserIdFromToken();
  const [showMinLoading, setShowMinLoading] = React.useState(true);
  
  const { myData, top3, loading: rankingLoading, error } = useRanking({
    courseId: parseInt(courseId),
    offset: 0,
    limit: 10,
    userId: userId ? parseInt(userId) : undefined,
  });

  // Ensure skeleton shows for at least 500ms for better UX
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowMinLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = loading || rankingLoading || showMinLoading;

  // Show skeleton while loading
  if (isLoading) {
    return (
      <div 
        style={{
          background: 'linear-gradient(to right, #9333ea, #a855f7, #ec4899)',
        }}
        className="rounded-xl p-4 backdrop-blur-lg shadow-lg"
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div>
                <div className="h-3 bg-white/30 rounded w-24 mb-2"></div>
                <div className="h-8 bg-white/30 rounded w-12"></div>
              </div>
            </div>
            <div className="text-center">
              <div className="h-3 bg-white/30 rounded w-16 mb-2"></div>
              <div className="h-8 bg-white/30 rounded w-8 mx-auto"></div>
            </div>
            <div className="h-6 bg-white/20 rounded-full w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-background dark:bg-muted/40 backdrop-blur-lg border border-border/30 rounded-xl p-4">
        <div className="flex items-center justify-center text-muted-foreground">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Ranking unavailable</span>
        </div>
      </div>
    );
  }

  // Show no data state
  if (!myData && (!top3 || top3.length === 0)) {
    return (
      <div className="bg-background dark:bg-muted/40 backdrop-blur-lg border border-border/30 rounded-xl p-4">
        <div className="flex items-center justify-center text-muted-foreground">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm">Complete modules to see ranking</span>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/ranking?course=${courseId}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(to right, #9333ea, #a855f7, #ec4899)',
        }}
        className="rounded-xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300 group shadow-lg backdrop-blur-lg"
      >
        <div className="flex items-center justify-between text-white">
          {/* Left side - Star icon and Rank */}
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div>
              <div className="text-white/80 text-sm font-medium">
                Your Current Rank
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  #{myData?.rank || '--'}
                </span>
                {myData && parseInt(myData.rank) <= 3 && (
                  <svg className={`w-6 h-6 ${
                    parseInt(myData.rank) === 1 ? 'text-yellow-300' : 
                    parseInt(myData.rank) === 2 ? 'text-muted-foreground' : 'text-orange-300'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Center - Score */}
          <div className="text-center">
            <div className="text-white/80 text-sm font-medium">
              Your Score
            </div>
            <div className="text-3xl font-bold">
              {myData?.score || '0'}
            </div>
          </div>

          {/* Right side - Codeforces Handle */}
          {myData?.cf_handle && (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
              </svg>
              <span className="text-white/90 text-sm font-medium">
                @{myData.cf_handle}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export default RankingCard;