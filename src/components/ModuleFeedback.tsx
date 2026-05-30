import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import {
  useModuleFeedback,
  FEEDBACK_REASONS,
  FeedbackReason,
  ReactionType,
} from "@/hooks/useModuleFeedback";

interface ModuleFeedbackProps {
  moduleId: number;
  moduleTitle?: string;
}

// Animated number component for smooth count transitions
const AnimatedNumber: React.FC<{ value: number; className?: string }> = ({
  value,
  className,
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (value !== prevValue.current) {
      const timeout = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      prevValue.current = value;
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <motion.span
      key={displayValue}
      initial={{ y: value > prevValue.current ? 10 : -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: value > prevValue.current ? -10 : 10, opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={className}
    >
      {displayValue}
    </motion.span>
  );
};

// Particle explosion effect for celebrations
const ParticleExplosion: React.FC<{ color: string; trigger: boolean }> = ({
  color,
  trigger,
}) => {
  if (!trigger) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: color,
            left: "50%",
            top: "50%",
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0.5],
            x: Math.cos((i * 30 * Math.PI) / 180) * 40,
            y: Math.sin((i * 30 * Math.PI) / 180) * 40,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
    </div>
  );
};

const ModuleFeedback: React.FC<ModuleFeedbackProps> = ({
  moduleId,
  moduleTitle,
}) => {
  const {
    stats,
    isLoading,
    isSubmitting,
    fetchStats,
    submitFeedback,
    toggleReaction,
  } = useModuleFeedback();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState<FeedbackReason | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [showLikeParticles, setShowLikeParticles] = useState(false);
  const [showDislikeParticles, setShowDislikeParticles] = useState(false);
  const [justReacted, setJustReacted] = useState<ReactionType | null>(null);

  const MAX_COMMENT_LENGTH = 500;

  useEffect(() => {
    if (moduleId) {
      fetchStats(moduleId);
    }
  }, [moduleId, fetchStats]);

  const handleLikeClick = async () => {
    if (isSubmitting) return;

    const wasLiked = stats?.user_reaction === "like";
    const success = await toggleReaction(moduleId, "like");

    if (success && !wasLiked) {
      setShowLikeParticles(true);
      setJustReacted("like");
      setTimeout(() => {
        setShowLikeParticles(false);
        setJustReacted(null);
      }, 600);
      toast.success("Thanks for your feedback! 🎉", {
        duration: 2000,
        style: {
          background: "#1a1a2e",
          color: "#fff",
          border: "1px solid rgba(16, 185, 129, 0.3)",
        },
      });
    }
  };

  const handleDislikeClick = async () => {
    if (isSubmitting) return;

    const wasDisliked = stats?.user_reaction === "dislike";

    if (wasDisliked) {
      // Toggle off
      await toggleReaction(moduleId, "dislike");
    } else {
      // Show modal for feedback
      setIsModalOpen(true);
    }
  };

  const handleSubmitDislike = async (skipDetails: boolean = false) => {
    const payload = {
      moduleId,
      reaction: "dislike" as ReactionType,
      ...(skipDetails
        ? {}
        : {
            reason: selectedReason || undefined,
            comment: comment.trim() || undefined,
          }),
    };

    // Close modal immediately for better UX
    setIsModalOpen(false);
    
    const success = await submitFeedback(payload);

    if (success) {
      setShowDislikeParticles(true);
      setJustReacted("dislike");
      setTimeout(() => {
        setShowDislikeParticles(false);
        setJustReacted(null);
      }, 600);

      if (!skipDetails && (selectedReason || comment.trim())) {
        toast.success("Thanks for helping us improve! 🙏", {
          duration: 3000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid rgba(177, 83, 224, 0.3)",
          },
        });
      } else {
        toast("Your feedback was recorded", {
          duration: 2000,
          icon: "📝",
          style: {
            background: "#1a1a2e",
            color: "#fff",
          },
        });
      }
    } else {
      toast.error("Failed to submit feedback. Please try again.", {
        duration: 3000,
      });
    }

    setSelectedReason(null);
    setComment("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReason(null);
    setComment("");
  };

  if (isLoading && !stats) {
    return (
      <div className="flex items-center gap-4 py-4 animate-pulse">
        <div className="h-10 w-24 bg-gray-700/50 rounded-full"></div>
        <div className="h-10 w-24 bg-gray-700/50 rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      {/* Main Feedback Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Glass morphism container */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/90 via-gray-800/70 to-gray-900/90 backdrop-blur-xl border border-[#B153E0]/20 px-4 py-4 md:px-6 md:py-5 shadow-2xl">
          {/* Animated gradient background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-[#B153E0]/30 via-transparent to-[#532e62]/30 animate-gradient-shift"></div>
          </div>

          {/* Content - Single row on desktop, stacked on mobile */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#B153E0]/20 to-[#532e62]/20 border border-[#B153E0]/30 flex-shrink-0">
                <svg
                  className="w-5 h-5 text-[#B153E0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-white">
                  Rate this module
                </h3>
                <p className="text-xs md:text-sm text-gray-400">
                  Your feedback helps us improve
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLikeClick}
                disabled={isSubmitting}
                className={`
                  relative group flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-2.5 rounded-xl font-medium
                  transition-all duration-300 ease-out
                  ${
                    stats?.user_reaction === "like"
                      ? "bg-gradient-to-r from-[#10B981] to-[#059669] border-2 border-emerald-400 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gray-700/50 border border-gray-500/40 text-gray-300 hover:border-emerald-400/60 hover:text-emerald-300 hover:bg-gray-700/70"
                  }
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {/* Particle explosion */}
                <ParticleExplosion color="#10B981" trigger={showLikeParticles} />

                {/* Thumb icon */}
                <motion.div
                  animate={
                    justReacted === "like"
                      ? { scale: [1, 1.3, 1], rotate: [0, -15, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  <svg
                    className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 ${
                      stats?.user_reaction === "like"
                        ? "fill-white stroke-white"
                        : "fill-transparent stroke-current group-hover:stroke-emerald-400"
                    }`}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </motion.div>

                {/* Count */}
                <span className="min-w-[16px] text-center font-semibold text-sm md:text-base">
                  <AnimatePresence mode="wait">
                    <AnimatedNumber value={stats?.likes || 0} />
                  </AnimatePresence>
                </span>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl -z-10"></div>
              </motion.button>

              {/* Dislike Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDislikeClick}
                disabled={isSubmitting}
                className={`
                  relative group flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-2.5 rounded-xl font-medium
                  transition-all duration-300 ease-out
                  ${
                    stats?.user_reaction === "dislike"
                      ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] border-2 border-red-400 text-white shadow-lg shadow-red-500/30"
                      : "bg-gray-700/50 border border-gray-500/40 text-gray-300 hover:border-red-400/60 hover:text-red-300 hover:bg-gray-700/70"
                  }
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {/* Particle explosion */}
                <ParticleExplosion color="#EF4444" trigger={showDislikeParticles} />

                {/* Thumb icon */}
                <motion.div
                  animate={
                    justReacted === "dislike"
                      ? { scale: [1, 1.3, 1], rotate: [0, 15, 0] }
                      : {}
                  }
                  transition={{ duration: 0.4 }}
                >
                  <svg
                    className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-300 rotate-180 ${
                      stats?.user_reaction === "dislike"
                        ? "fill-white stroke-white"
                        : "fill-transparent stroke-current group-hover:stroke-red-400"
                    }`}
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </motion.div>

                {/* Count */}
                <span className="min-w-[16px] text-center font-semibold text-sm md:text-base">
                  <AnimatePresence mode="wait">
                    <AnimatedNumber value={stats?.dislikes || 0} />
                  </AnimatePresence>
                </span>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-red-500/10 to-rose-500/10 blur-xl -z-10"></div>
              </motion.button>

              {/* Success indicator - only show checkmark on mobile, hidden on larger screens for cleaner look */}
              <AnimatePresence>
                {stats?.user_reaction && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center sm:hidden"
                  >
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dislike Feedback Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) handleCloseModal();
        }}
      >
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/70 backdrop-blur-sm"
          className="w-full max-w-lg rounded-2xl bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 border border-white/10 p-6"
        >
                  {/* Modal Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-[#B153E0]/20 to-[#532e62]/30 border border-[#B153E0]/30">
                        <svg
                          className="w-6 h-6 text-[#B153E0]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-semibold text-white">
                          Help us improve
                        </DialogTitle>
                        <p className="text-sm text-gray-400 mt-1">
                          What could be better? (Optional)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Reason Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Select a reason
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {FEEDBACK_REASONS.map((reason) => (
                        <motion.button
                          key={reason.value}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            setSelectedReason(
                              selectedReason === reason.value
                                ? null
                                : reason.value
                            )
                          }
                          className={`
                            flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium
                            transition-all duration-300 shadow-sm
                            ${
                              selectedReason === reason.value
                                ? "bg-gradient-to-r from-[#B153E0]/30 to-[#532e62]/40 border-2 border-[#B153E0]/60 text-white shadow-lg shadow-[#B153E0]/20"
                                : "bg-gray-800/80 border border-gray-600/40 text-gray-200 hover:border-[#B153E0]/40 hover:bg-gray-700/60 hover:text-white"
                            }
                          `}
                        >
                          <span className="text-xl">{reason.emoji}</span>
                          <span>{reason.label}</span>
                          {selectedReason === reason.value && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto"
                            >
                              <svg className="w-4 h-4 text-[#B153E0]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </motion.span>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Box */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Additional comments
                    </label>
                    <div className="relative">
                      <textarea
                        value={comment}
                        onChange={(e) =>
                          setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))
                        }
                        placeholder="Tell us more about what we can improve..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-600/40 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-[#B153E0]/50 focus:border-[#B153E0]/50 transition-all"
                      />
                      <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                        {comment.length}/{MAX_COMMENT_LENGTH}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-4">
                    <button
                      onClick={() => handleSubmitDislike(true)}
                      disabled={isSubmitting}
                      className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors font-medium disabled:opacity-50"
                    >
                      Skip
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubmitDislike(false)}
                      disabled={isSubmitting}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-[#B153E0] to-[#532e62] text-white font-semibold shadow-lg shadow-[#B153E0]/25 hover:shadow-[#B153E0]/40 hover:from-[#c76be8] hover:to-[#6b3d7d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        "Submit Feedback"
                      )}
                    </motion.button>
                  </div>

                  {/* Appreciation message */}
                  <div className="mt-6 pt-4 border-t border-gray-700/50">
                    <p className="text-center text-sm text-gray-500">
                      💜 Your feedback helps us create better learning
                      experiences
                    </p>
                  </div>
        </DialogContent>
      </Dialog>

      {/* Add custom CSS for gradient animation */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </>
  );
};

export default React.memo(ModuleFeedback);
