import React, { useState, useRef, useEffect } from "react";
import { SyncLoader } from "react-spinners";

interface SubDiscussion {
  id: number;
  user_name: string;
  content: string;
  created_at: number;
  type: number;
  discussion_id: number;
}

interface Discussion {
  id: number;
  name?: string;
  user_name?: string; // API might return user_name instead of name
  content: string;
  timestamp: number;
  university?: string;
  user_type?: number;
  type?: number; // User type: 1,2 = Teacher, 3 = Student
}

interface DiscussionSectionProps {
  discussions: Discussion[];
  discussionLoading: boolean;
  newDiscussion: string;
  setNewDiscussion: (value: string) => void;
  submitNewDiscussion: () => void;
  activeThreads: Record<number, boolean>;
  setActiveThreads: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  subdiscussionTexts: Record<number, string>;
  setSubdiscussionTexts: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  subdiscussionComments: Record<number, SubDiscussion[]>;
  fetchSubdiscussions: (id: number) => void;
  postSubdiscussion: (id: number) => void;
  setDeleteOption: (option: string) => void;
  setOpenDicussionDeleteDialogue: (open: boolean) => void;
  setActiveCommentDeletionData: (data: SubDiscussion) => void;
  currentUserId?: number;
}

// Helper function to format time
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", { 
    month: "short", 
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
  });
};

// Get initials from name
const getInitials = (name: string): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Generate consistent color from name
const getAvatarGradient = (name: string): string => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  ];
  const index = (name || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[index % gradients.length];
};

// Avatar Component
const Avatar: React.FC<{ name: string; size?: "sm" | "md" | "lg"; isTeacher?: boolean }> = ({ 
  name, 
  size = "md",
  isTeacher = false 
}) => {
  const sizeClasses = {
    sm: { container: "w-8 h-8", text: "text-xs", badge: "w-3.5 h-3.5" },
    md: { container: "w-10 h-10", text: "text-sm", badge: "w-4 h-4" },
    lg: { container: "w-12 h-12", text: "text-base", badge: "w-5 h-5" },
  };

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeClasses[size].container} ${sizeClasses[size].text} rounded-full flex items-center justify-center font-semibold text-white shadow-lg`}
        style={{ background: getAvatarGradient(name) }}
      >
        {getInitials(name)}
      </div>
      {isTeacher && (
        <div 
          className={`absolute -bottom-0.5 -right-0.5 ${sizeClasses[size].badge} bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md`}
        >
          <svg className="w-2 h-2 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
    </div>
  );
};

// User Badge Component
const UserBadge: React.FC<{ type: number }> = ({ type }) => {
  const isTeacher = type === 1 || type === 2;
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
        isTeacher
          ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-300 border border-yellow-500/30"
          : "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
      }`}
    >
      {isTeacher ? (
        <>
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
          </svg>
          Instructor
        </>
      ) : (
        <>
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Student
        </>
      )}
    </span>
  );
};


// Reply Component
const ReplyCard: React.FC<{
  reply: SubDiscussion;
  onDelete: () => void;
  canDelete?: boolean;
}> = ({ reply, onDelete, canDelete = true }) => {
  const isTeacher = reply.type === 1 || reply.type === 2;

  return (
    <div className="relative pl-4 border-l-2 border-purple-500/40 ml-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-[#1a1625]/80 to-[#0f0a14]/80 rounded-xl p-4 backdrop-blur-sm border border-border hover:border-purple-500/40 transition-all duration-300">
        <div className="flex items-start gap-3">
          <Avatar name={reply.user_name} size="sm" isTeacher={isTeacher} />
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-semibold text-white text-sm">{reply.user_name}</span>
              <UserBadge type={reply.type} />
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-muted-foreground text-xs">{formatTimeAgo(reply.created_at)}</span>
            </div>
            
            <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
            
            {canDelete && (
              <button
                onClick={onDelete}
                className="mt-3 text-xs text-muted-foreground hover:text-destructive transition-all duration-200 flex items-center gap-1.5 group"
              >
                <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Discussion Card Component
const DiscussionCard: React.FC<{
  discussion: Discussion;
  isExpanded: boolean;
  onToggleReplies: () => void;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: () => void;
  replies: SubDiscussion[];
  onDeleteReply: (reply: SubDiscussion) => void;
}> = ({
  discussion,
  isExpanded,
  onToggleReplies,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  replies,
  onDeleteReply,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Get display name - check both name and user_name fields
  const displayName = discussion.name || discussion.user_name || "Anonymous";
  // Check both user_type and type fields for teacher status
  const userType = discussion.user_type ?? discussion.type ?? 3; // Default to student (3)
  const isTeacher = userType === 1 || userType === 2;

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onReplyTextChange(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  return (
    <div className="group animate-fadeIn">
      <div className="bg-gradient-to-br from-[#1e1a2e]/90 to-[#13101a]/90 rounded-2xl p-5 backdrop-blur-sm border border-border hover:border-purple-500/40 transition-all duration-300 shadow-xl hover:shadow-purple-500/5">
        {/* Main Discussion */}
        <div className="flex items-start gap-4">
          <Avatar name={displayName} size="md" isTeacher={isTeacher} />
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-semibold text-white">{displayName}</span>
              <UserBadge type={userType} />
              {discussion.university && (
                <>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
                    </svg>
                    {discussion.university}
                  </span>
                </>
              )}
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground text-sm">{formatTimeAgo(discussion.timestamp)}</span>
            </div>
            
            <p className="text-foreground leading-relaxed mb-4 whitespace-pre-wrap">{discussion.content}</p>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleReplies}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isExpanded
                    ? "bg-purple-500/25 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/10"
                    : "bg-[#2a2438]/80 text-foreground hover:bg-purple-500/20 hover:text-purple-300 border border-border hover:border-purple-500/50"
                }`}
              >
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                {isExpanded ? "Hide Replies" : "Reply"}
                {replies.length > 0 && (
                  <span className="bg-purple-500/40 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {replies.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[2000px] opacity-100 mt-5" : "max-h-0 opacity-0"
          }`}
        >
          {/* Reply Input */}
          <div className="bg-[#1a1625]/60 rounded-xl p-4 border border-border mb-4">
            <div className="flex gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
                style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={replyText}
                  onChange={handleTextareaChange}
                  placeholder="Write a thoughtful reply..."
                  className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-sm min-h-[50px] leading-relaxed"
                  rows={2}
                />
                <div className="flex justify-end mt-3 pt-3 border-t border-border">
                  <button
                    onClick={onSubmitReply}
                    disabled={!replyText.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#532e62] to-[#6b3a7d] hover:from-[#633872] hover:to-[#7b4a8d] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed disabled:text-muted-foreground text-white rounded-xl text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Replies List */}
          {replies.length > 0 && (
            <div className="space-y-3">
              {replies.map((reply) => (
                <ReplyCard
                  key={reply.id}
                  reply={reply}
                  onDelete={() => onDeleteReply(reply)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// Empty State Component
const EmptyState: React.FC = () => (
  <div className="text-center py-16 animate-fadeIn">
    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/20">
      <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-white mb-3">Start the conversation</h3>
    <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
      Be the first to share your thoughts! Ask questions, share insights, or help fellow learners on their journey.
    </p>
  </div>
);

// Main Discussion Section Component
const DiscussionSection: React.FC<DiscussionSectionProps> = ({
  discussions,
  discussionLoading,
  newDiscussion,
  setNewDiscussion,
  submitNewDiscussion,
  activeThreads,
  setActiveThreads,
  subdiscussionTexts,
  setSubdiscussionTexts,
  subdiscussionComments,
  fetchSubdiscussions,
  postSubdiscussion,
  setDeleteOption,
  setOpenDicussionDeleteDialogue,
  setActiveCommentDeletionData,
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (newDiscussion.trim()) {
      submitNewDiscussion();
      setIsComposing(false);
    }
  };

  const handleToggleReplies = (discussionId: number) => {
    const isCurrentlyExpanded = activeThreads[discussionId];
    
    if (!isCurrentlyExpanded) {
      fetchSubdiscussions(discussionId);
    }
    
    setActiveThreads((prev) => ({
      ...prev,
      [discussionId]: !prev[discussionId],
    }));
  };

  const handleReplyTextChange = (discussionId: number, text: string) => {
    setSubdiscussionTexts((prev) => ({
      ...prev,
      [discussionId]: text,
    }));
  };

  const handleDeleteReply = (reply: SubDiscussion) => {
    setDeleteOption("subdiscussion");
    setOpenDicussionDeleteDialogue(true);
    setActiveCommentDeletionData(reply);
  };

  // Auto-resize main textarea
  const handleMainTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewDiscussion(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#532e62] to-[#7b4a8d] flex items-center justify-center shadow-xl shadow-purple-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Discussion</h2>
            <p className="text-muted-foreground text-sm mt-0.5">
              {discussions.length} {discussions.length === 1 ? "comment" : "comments"} • Join the conversation
            </p>
          </div>
        </div>
        
        {!isComposing && (
          <button
            onClick={() => {
              setIsComposing(true);
              setTimeout(() => textareaRef.current?.focus(), 100);
            }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#532e62] to-[#7b4a8d] hover:from-[#633872] hover:to-[#8b5a9d] text-white rounded-xl font-medium transition-all duration-300 shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Discussion
          </button>
        )}
      </div>

      {/* Compose Box */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isComposing ? "max-h-[500px] opacity-100 mb-8" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gradient-to-br from-[#1e1a2e]/95 to-[#13101a]/95 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/30 shadow-2xl shadow-purple-500/10">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={newDiscussion}
                onChange={handleMainTextareaChange}
                placeholder="Share your thoughts, questions, or insights..."
                className="w-full bg-transparent text-white placeholder-gray-400 resize-none outline-none text-base min-h-[100px] leading-relaxed"
                rows={3}
              />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Be respectful and constructive</span>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setIsComposing(false);
                      setNewDiscussion("");
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 text-muted-foreground hover:text-white hover:bg-muted rounded-xl transition-all duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!newDiscussion.trim()}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#532e62] to-[#7b4a8d] hover:from-[#633872] hover:to-[#8b5a9d] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed disabled:text-muted-foreground text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Post Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {discussionLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-4">
            <SyncLoader color="#B153E0" size={12} />
            <p className="text-muted-foreground text-sm">Loading discussions...</p>
          </div>
        </div>
      )}

      {/* Discussions List */}
      {!discussionLoading && (
        <div className="space-y-5">
          {discussions.length === 0 ? (
            <EmptyState />
          ) : (
            discussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                isExpanded={activeThreads[discussion.id] || false}
                onToggleReplies={() => handleToggleReplies(discussion.id)}
                replyText={subdiscussionTexts[discussion.id] || ""}
                onReplyTextChange={(text) => handleReplyTextChange(discussion.id, text)}
                onSubmitReply={() => postSubdiscussion(discussion.id)}
                replies={subdiscussionComments[discussion.id] || []}
                onDeleteReply={handleDeleteReply}
              />
            ))
          )}
        </div>
      )}

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default React.memo(DiscussionSection);
