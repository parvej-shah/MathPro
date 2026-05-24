import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/api.config";

// Feedback reason types based on API documentation
export type FeedbackReason =
  | "too_fast"
  | "too_slow"
  | "unclear"
  | "outdated"
  | "audio_issue"
  | "video_issue"
  | "missing_content"
  | "too_difficult"
  | "too_easy"
  | "other";

export type ReactionType = "like" | "dislike";

export interface FeedbackStats {
  likes: number;
  dislikes: number;
  user_reaction: ReactionType | null;
}

export interface UserFeedback {
  id: number;
  module_id: number;
  user_id: number;
  course_id: number;
  chapter_id: number;
  reaction: ReactionType;
  reason: FeedbackReason | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface FeedbackPayload {
  moduleId: number;
  reaction: ReactionType;
  reason?: FeedbackReason;
  comment?: string;
}

interface UseModuleFeedbackReturn {
  stats: FeedbackStats | null;
  userFeedback: UserFeedback | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  fetchStats: (moduleId: number) => Promise<void>;
  submitFeedback: (payload: FeedbackPayload) => Promise<boolean>;
  removeFeedback: (moduleId: number) => Promise<boolean>;
  toggleReaction: (moduleId: number, reaction: ReactionType) => Promise<boolean>;
}

export const FEEDBACK_REASONS: { value: FeedbackReason; label: string; emoji: string }[] = [
  { value: "too_fast", label: "Too fast", emoji: "⏩" },
  { value: "too_slow", label: "Too slow", emoji: "🐌" },
  { value: "unclear", label: "Unclear explanation", emoji: "😕" },
  { value: "outdated", label: "Outdated content", emoji: "📅" },
  { value: "audio_issue", label: "Audio issues", emoji: "🔊" },
  { value: "video_issue", label: "Video issues", emoji: "📹" },
  { value: "missing_content", label: "Missing content", emoji: "❓" },
  { value: "too_difficult", label: "Too difficult", emoji: "🏔️" },
  { value: "too_easy", label: "Too easy", emoji: "🎯" },
  { value: "other", label: "Other", emoji: "💭" },
];

export function useModuleFeedback(): UseModuleFeedbackReturn {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [userFeedback, setUserFeedback] = useState<UserFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch module stats including user's reaction
  const fetchStats = useCallback(async (moduleId: number) => {
    if (!moduleId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${BACKEND_URL}/user/module-feedback/${moduleId}/stats`,
        getAuthHeader()
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err: any) {
      // Don't show error for 401 (user not logged in) or 404 (no feedback yet)
      if (err.response?.status !== 401 && err.response?.status !== 404) {
        console.error("Error fetching feedback stats:", err);
        setError("Failed to load feedback");
      }
      // Set default stats if fetch fails
      setStats({ likes: 0, dislikes: 0, user_reaction: null });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit or update feedback
  const submitFeedback = useCallback(async (payload: FeedbackPayload): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/module-feedback`,
        payload,
        getAuthHeader()
      );

      if (response.data.success) {
        setUserFeedback(response.data.data);
        // Refetch stats to get updated counts
        await fetchStats(payload.moduleId);
        return true;
      }
      return false;
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      setError(err.response?.data?.message || "Failed to submit feedback");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchStats]);

  // Remove feedback
  const removeFeedback = useCallback(async (moduleId: number): Promise<boolean> => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.delete(
        `${BACKEND_URL}/user/module-feedback/${moduleId}`,
        getAuthHeader()
      );

      if (response.data.success) {
        setUserFeedback(null);
        // Refetch stats to get updated counts
        await fetchStats(moduleId);
        return true;
      }
      return false;
    } catch (err: any) {
      // 404 means feedback was already removed, which is fine
      if (err.response?.status === 404) {
        setUserFeedback(null);
        await fetchStats(moduleId);
        return true;
      }
      console.error("Error removing feedback:", err);
      setError(err.response?.data?.message || "Failed to remove feedback");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchStats]);

  // Toggle reaction - if same reaction exists, remove it; otherwise submit new reaction
  const toggleReaction = useCallback(async (moduleId: number, reaction: ReactionType): Promise<boolean> => {
    // Optimistic update
    const previousStats = stats;
    
    if (stats?.user_reaction === reaction) {
      // Remove the reaction (toggle off)
      setStats(prev => prev ? {
        ...prev,
        user_reaction: null,
        [reaction === 'like' ? 'likes' : 'dislikes']: Math.max(0, prev[reaction === 'like' ? 'likes' : 'dislikes'] - 1)
      } : null);
      
      const success = await removeFeedback(moduleId);
      if (!success && previousStats) {
        // Rollback on failure
        setStats(previousStats);
      }
      return success;
    } else {
      // Submit new reaction
      setStats(prev => {
        if (!prev) return { likes: reaction === 'like' ? 1 : 0, dislikes: reaction === 'dislike' ? 1 : 0, user_reaction: reaction };
        
        const newStats = { ...prev, user_reaction: reaction };
        
        // If changing from one reaction to another
        if (prev.user_reaction) {
          if (prev.user_reaction === 'like') {
            newStats.likes = Math.max(0, prev.likes - 1);
          } else {
            newStats.dislikes = Math.max(0, prev.dislikes - 1);
          }
        }
        
        // Add the new reaction
        if (reaction === 'like') {
          newStats.likes = prev.likes + 1;
        } else {
          newStats.dislikes = prev.dislikes + 1;
        }
        
        return newStats;
      });

      // For dislikes, we'll return true and let the caller handle showing the modal
      // For likes, submit immediately
      if (reaction === 'like') {
        const success = await submitFeedback({ moduleId, reaction });
        if (!success && previousStats) {
          setStats(previousStats);
        }
        return success;
      }
      
      return true;
    }
  }, [stats, removeFeedback, submitFeedback]);

  return {
    stats,
    userFeedback,
    isLoading,
    isSubmitting,
    error,
    fetchStats,
    submitFeedback,
    removeFeedback,
    toggleReaction,
  };
}

export default useModuleFeedback;
