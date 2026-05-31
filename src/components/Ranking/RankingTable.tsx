"use client";

import React from "react";
import { motion } from "framer-motion";
import { RankingUser } from "@/hooks/useRanking";

interface RankingTableProps {
  rankings: RankingUser[];
  currentUserId?: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

function toBanglaNumber(value: number | string) {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return value.toString().replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}

const RankingTable: React.FC<RankingTableProps> = ({
  rankings,
  currentUserId,
  currentPage,
  itemsPerPage,
  onPageChange,
  loading = false
}) => {
  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      const colors = {
        1: 'text-warning',
        2: 'text-muted-foreground',
        3: 'text-accent'
      };
      return (
        <motion.svg 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={`w-5 h-5 ${colors[rank as keyof typeof colors]}`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </motion.svg>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-card/85 backdrop-blur-lg border border-border rounded-2xl overflow-hidden shadow-2xl shadow-foreground/10">
        {/* Table Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-linear-to-r from-primary/15 to-accent/10 backdrop-blur-lg border-b border-border px-6 py-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="bg-primary/15 p-2 rounded-lg"
            >
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </motion.div>
            <h2 className="text-xl font-bold text-foreground">লিডারবোর্ড</h2>
          </div>
        </motion.div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/60 border-b border-border">
              <tr>
                {['র‍্যাঙ্ক', 'নাম', 'স্কোর', 'Codeforces অ্যাকাউন্ট'].map((header, index) => (
                  <motion.th
                    key={header}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`px-6 py-4 text-left text-sm font-semibold text-foreground ${
                      header === 'Codeforces অ্যাকাউন্ট' ? 'hidden sm:table-cell' : ''
                    }`}
                  >
                    {header}
                  </motion.th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {rankings.map((user, index) => {
                const isCurrentUser = currentUserId && user.id === currentUserId;
                const rankNum = parseInt(user.rank);
                
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    whileHover={{ scale: 1.005 }}
                    className={`transition-all duration-200 ${
                      isCurrentUser ? 'bg-primary/10 border-l-4 border-primary shadow-lg shadow-primary/5' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(rankNum)}
                        <span className={`font-bold ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                          {toBanglaNumber(user.rank)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${isCurrentUser ? 'text-primary font-bold' : 'text-foreground'}`}>
                          {user.name}
                        </span>
                        {isCurrentUser && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full font-semibold"
                          >
                            তুমি
                          </motion.span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <motion.span
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className={`font-bold text-lg ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}
                      >
                        {toBanglaNumber(user.score)}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {user.cf_handle ? (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          href={`https://codeforces.com/profile/${user.cf_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-info hover:text-info/80 hover:underline transition-colors font-medium"
                        >
                          {user.cf_handle}
                        </motion.a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {rankings.length >= itemsPerPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-muted/60 border-t border-border px-6 py-4 flex items-center justify-between"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary/15 border border-primary/30 text-primary rounded-lg hover:bg-primary/25 disabled:bg-muted/50 disabled:border-border disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">আগের পেজ</span>
            </motion.button>
            
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">
                পেজ {toBanglaNumber(currentPage + 1)}
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={rankings.length < itemsPerPage}
              className="flex items-center gap-2 px-4 py-2 bg-primary/15 border border-primary/30 text-primary rounded-lg hover:bg-primary/25 disabled:bg-muted/50 disabled:border-border disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="hidden sm:inline">পরের পেজ</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {rankings.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="bg-muted/70 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              কোনো র‍্যাঙ্কিং পাওয়া যায়নি
            </h3>
            <p className="text-muted-foreground">
              আগে মডিউল শেষ করো, তারপর লিডারবোর্ডে তোমার নাম দেখাও।
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RankingTable;
