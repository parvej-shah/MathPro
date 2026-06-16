import React, { useState, useEffect } from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { BiEdit, BiTrash } from 'react-icons/bi';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BACKEND_URL } from '@/api.config';
import { getUserIdFromToken, getAuthToken } from '@/helpers';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface FeedbackCardProps {
    courseId: string | string[];
    loading?: boolean;
    onFeedbackClick?: () => void;
}

interface ExistingFeedback {
    id: string;
    rating: number;
    comment: string;
    category: string;
    createdAt: string;
}

const CATEGORIES = [
    { value: 'content', label: 'কন্টেন্টের মান' },
    { value: 'instructor', label: 'ইন্সট্রাক্টর' },
    { value: 'platform', label: 'প্ল্যাটফর্ম অভিজ্ঞতা' },
    { value: 'course', label: 'সামগ্রিক কোর্স' },
    { value: 'other', label: 'অন্যান্য' }
];

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
    courseId,
    loading = false,
    onFeedbackClick
}) => {
    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    const [comment, setComment] = useState('');
    const [category, setCategory] = useState('content');
    const [existingFeedback, setExistingFeedback] = useState<ExistingFeedback | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [checkingFeedback, setCheckingFeedback] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Check if user has already submitted feedback
    useEffect(() => {
        const checkExistingFeedback = async () => {
            // Early return conditions with proper cleanup
            if (!courseId || Array.isArray(courseId)) {
                setCheckingFeedback(false);
                setHasSubmitted(false);
                setExistingFeedback(null);
                return;
            }

            try {
                setCheckingFeedback(true);
                const token = getAuthToken();
                
                if (!token) {
                    setCheckingFeedback(false);
                    setHasSubmitted(false);
                    setExistingFeedback(null);
                    return;
                }

                // Get user ID from token using helper function
                const userId = getUserIdFromToken();
                
                if (!userId) {
                    setCheckingFeedback(false);
                    setHasSubmitted(false);
                    setExistingFeedback(null);
                    return;
                }
                
                const response = await axios.get(
                    `${BACKEND_URL}/user/feedback/check/${userId}/${courseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 5000 // 5 second timeout
                    }
                );

                // Handle user API response format
                if (response.data.success && response.data.hasSubmitted && response.data.feedback) {
                    // User has submitted feedback
                    setExistingFeedback(response.data.feedback);
                    setHasSubmitted(true);
                    // Pre-fill form with existing data for editing
                    setSelectedRating(response.data.feedback.rating);
                    setComment(response.data.feedback.comment || '');
                    setCategory(response.data.feedback.category || 'content');
                } else if (response.data.success && !response.data.hasSubmitted) {
                    // User has not submitted feedback
                    setHasSubmitted(false);
                    setExistingFeedback(null);
                } else {
                    // Unexpected response format
                    console.warn('FeedbackCard: Unexpected API response format', response.data);
                    setHasSubmitted(false);
                    setExistingFeedback(null);
                }
            } catch (error: any) {
                console.error('FeedbackCard: Error checking feedback:', error);
                console.error('FeedbackCard: Error details', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message
                });
                
                // If API fails, assume no feedback exists and show form
                
                // If API fails, assume no feedback exists and show form
                setHasSubmitted(false);
                setExistingFeedback(null);
            } finally {
                setCheckingFeedback(false);
            }
        };

        // Check feedback immediately
        checkExistingFeedback();
    }, [courseId]);

    // Submit new feedback
    const handleSubmitFeedback = async () => {
        if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
            toast.error('Please select a rating between 1-5 stars');
            return;
        }

        if (comment.length > 500) {
            toast.error('Comment must be 500 characters or less');
            return;
        }

        try {
            setSubmitting(true);
            const token = getAuthToken();

            const response = await axios.post(
                `${BACKEND_URL}/user/feedback`,
                {
                    courseId: courseId as string,
                    rating: selectedRating,
                    comment: comment.trim(),
                    category
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Feedback submitted successfully!');
                // Refresh feedback status
                setHasSubmitted(true);
                setExistingFeedback({
                    id: response.data.feedbackId,
                    rating: selectedRating,
                    comment: comment.trim(),
                    category,
                    createdAt: new Date().toISOString()
                });
                onFeedbackClick?.();
            }
        } catch (error: any) {
            console.error('Error submitting feedback:', error);
            const errorMessage = error.response?.data?.error || 'Failed to submit feedback';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Update existing feedback
    const handleUpdateFeedback = async () => {
        if (!existingFeedback?.id) return;

        if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
            toast.error('Please select a rating between 1-5 stars');
            return;
        }

        if (comment.length > 500) {
            toast.error('Comment must be 500 characters or less');
            return;
        }

        try {
            setSubmitting(true);
            const token = getAuthToken();

            const response = await axios.put(
                `${BACKEND_URL}/user/feedback/${existingFeedback.id}`,
                {
                    rating: selectedRating,
                    comment: comment.trim(),
                    category
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Feedback updated successfully!');
                // Update local state
                setExistingFeedback({
                    ...existingFeedback,
                    rating: selectedRating,
                    comment: comment.trim(),
                    category
                });
                setIsEditing(false);
                onFeedbackClick?.();
            }
        } catch (error: any) {
            console.error('Error updating feedback:', error);
            const errorMessage = error.response?.data?.error || 'Failed to update feedback';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete feedback
    const handleDeleteFeedback = async () => {
        if (!existingFeedback?.id) return;

        try {
            setSubmitting(true);
            setShowDeleteConfirm(false);
            const token = getAuthToken();

            const response = await axios.delete(
                `${BACKEND_URL}/user/feedback/${existingFeedback.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Feedback deleted successfully!');
                // Reset state
                setHasSubmitted(false);
                setExistingFeedback(null);
                setIsEditing(false);
                setSelectedRating(0);
                setComment('');
                setCategory('content');
                onFeedbackClick?.();
            }
        } catch (error: any) {
            console.error('Error deleting feedback:', error);
            const errorMessage = error.response?.data?.error || 'Failed to delete feedback';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getCategoryLabel = (categoryValue: string) => {
        return CATEGORIES.find(cat => cat.value === categoryValue)?.label || categoryValue;
    };

    if (loading || checkingFeedback) {
        return (
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border animate-pulse relative overflow-hidden">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent" />
                <div className="space-y-4">
                    <div className="h-5 bg-muted rounded w-40" />
                    <div className="h-4 bg-muted rounded w-full" />
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="w-8 h-8 bg-muted rounded" />
                        ))}
                    </div>
                    <div className="h-24 bg-muted rounded" />
                    <div className="h-10 bg-muted rounded" />
                </div>
            </div>
        );
    }



    // Show existing feedback if user has already submitted
    if (hasSubmitted && existingFeedback && !isEditing) {
        return (
            <>
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-border relative overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                {/* Decorative gradient background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-primary/5 to-primary/10 rounded-full blur-3xl"></div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

                <div className="relative z-10">
                    {/* Header with actions */}
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">
                                তোমার মতামত
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                জমা দেওয়া হয়েছে {formatDate(existingFeedback.createdAt)}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                title="Edit feedback"
                            >
                                <BiEdit className="text-lg" />
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={submitting}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete feedback"
                            >
                                <BiTrash className="text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Rating Display */}
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-foreground mb-2">
                            তোমার রেটিং
                        </p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div key={star}>
                                    {star <= existingFeedback.rating ? (
                                        <BsStarFill className="text-3xl text-warning" />
                                    ) : (
                                        <BsStar className="text-3xl text-muted-foreground" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Display */}
                    <div className="mb-4">
                        <p className="text-sm font-semibold text-foreground mb-2">
                            বিভাগ
                        </p>
                        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                            {getCategoryLabel(existingFeedback.category)}
                        </span>
                    </div>

                    {/* Comment Display */}
                    {existingFeedback.comment && (
                        <div className="mb-4">
                            <p className="text-sm font-semibold text-foreground mb-2">
                                তোমার মন্তব্য
                            </p>
                            <div className="bg-muted/40 rounded-xl p-4 border border-border">
                                <p className="text-foreground leading-relaxed">
                                    {existingFeedback.comment}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Thank you message */}
                    <div className="bg-success/10 border border-success/30 rounded-xl p-4">
                        <p className="text-success text-sm font-medium text-center">
                            ✅ মতামত দেওয়ার জন্য ধন্যবাদ! এটি কোর্স উন্নত করতে সাহায্য করে।
                        </p>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog - Outside main container */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteFeedback}
                title="Delete Feedback"
                message="Are you sure you want to delete your feedback? This action cannot be undone and you will lose all your comments and rating."
                confirmText="Delete Feedback"
                cancelText="Keep Feedback"
                confirmButtonClass="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
                isLoading={submitting}
                icon="delete"
            />
            </>
        );
    }

    // Show feedback form (new submission or editing)
    return (
        <>
        <div className="bg-card p-6 rounded-3xl shadow-sm border border-border relative overflow-hidden hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-linear-to-br from-primary/5 to-primary/10 rounded-full blur-3xl"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                            {isEditing ? 'মতামত সম্পাদনা করো' : 'তোমার মতামত দাও'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {isEditing ? 'কোর্সের মতামত আপডেট করো' : 'এই কোর্সটি সবার জন্য উন্নত করতে সাহায্য করো'}
                        </p>
                    </div>
                    {isEditing && (
                        <button
                            onClick={() => {
                                setIsEditing(false);
                                // Reset to existing values
                                setSelectedRating(existingFeedback?.rating || 0);
                                setComment(existingFeedback?.comment || '');
                                setCategory(existingFeedback?.category || 'content');
                            }}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Cancel
                        </button>
                    )}
                </div>

                {/* Star Rating */}
                <div className="mb-6">
                    <p className="text-sm font-semibold text-foreground mb-3">
                        কোর্সটি রেট করো *
                    </p>
                    <div className="flex gap-2 justify-center sm:justify-start">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                disabled={submitting}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                onClick={() => setSelectedRating(star)}
                                className="transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed p-1 rounded-lg hover:bg-warning/10"
                            >
                                {star <= (hoveredStar || selectedRating) ? (
                                    <BsStarFill className="text-3xl text-warning drop-shadow-sm" />
                                ) : (
                                    <BsStar className="text-3xl text-muted-foreground hover:text-warning transition-colors" />
                                )}
                            </button>
                        ))}
                    </div>
                    {selectedRating > 0 && (
                        <p className="text-xs text-muted-foreground mt-2 text-center sm:text-left">
                            {selectedRating === 1 && "খুব খারাপ"}
                            {selectedRating === 2 && "মোটামুটি"}
                            {selectedRating === 3 && "ভালো"}
                            {selectedRating === 4 && "খুব ভালো"}
                            {selectedRating === 5 && "অসাধারণ"}
                        </p>
                    )}
                </div>

                {/* Category Selection */}
                <div className="mb-6">
                    <p className="text-sm font-semibold text-foreground mb-2">
                        মতামতের বিভাগ
                    </p>
                    <div className="relative">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            disabled={submitting}
                            className="w-full px-4 py-3 pr-10 rounded-xl border border-border bg-background dark:bg-muted/40 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer hover:border-primary/30 dark:hover:border-primary/30"
                        >
                            {CATEGORIES.map((cat) => (
                                <option 
                                    key={cat.value} 
                                    value={cat.value}
                                    className="bg-background text-foreground py-2"
                                >
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg 
                                className="w-5 h-5 text-muted-foreground" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M19 9l-7 7-7-7" 
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Comment Box */}
                <div className="mb-6">
                    <p className="text-sm font-semibold text-foreground mb-2">
                        তোমার ভাবনা (ঐচ্ছিক)
                    </p>
                    <div className="relative">
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={submitting}
                            placeholder="এই কোর্স সম্পর্কে তোমার অভিজ্ঞতা শেয়ার করো..."
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background dark:bg-muted/40 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary/30 dark:hover:border-primary/30"
                            rows={4}
                            maxLength={500}
                        />
                        {/* Character count with color coding */}
                        <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-muted-foreground">
                                কী ভালো লেগেছে বা কী উন্নত করা যায় জানাও
                            </p>
                            <p className={`text-xs font-medium ${
                                comment.length > 450 
                                    ? 'text-destructive' 
                                    : comment.length > 400 
                                        ? 'text-warning' 
                                        : 'text-muted-foreground'
                            }`}>
                                {comment.length}/500
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={isEditing ? handleUpdateFeedback : handleSubmitFeedback}
                    disabled={submitting || selectedRating === 0}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] group"
                >
                    {submitting ? (
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>{isEditing ? 'আপডেট হচ্ছে...' : 'জমা হচ্ছে...'}</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <span>{isEditing ? 'মতামত আপডেট করো' : 'মতামত জমা দাও'}</span>
                            <svg 
                                className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                                />
                            </svg>
                        </div>
                    )}
                </button>
                
                {/* Validation message */}
                {selectedRating === 0 && (
                    <p className="text-xs text-destructive mt-2 text-center">
                        মতামত জমা দিতে একটি রেটিং বেছে নাও
                    </p>
                )}

                {/* Helper text */}
                <p className="text-xs text-center text-muted-foreground mt-3">
                    তোমার মতামত আরও ভালো শেখার অভিজ্ঞতা তৈরি করতে সাহায্য করে
                </p>
            </div>
        </div>

        {/* Delete Confirmation Dialog - Outside main container */}
        <ConfirmDialog
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDeleteFeedback}
            title="Delete Feedback"
            message="Are you sure you want to delete your feedback? This action cannot be undone and you will lose all your comments and rating."
            confirmText="Delete Feedback"
            cancelText="Keep Feedback"
            confirmButtonClass="bg-destructive hover:bg-destructive/90 focus:ring-destructive"
            isLoading={submitting}
            icon="delete"
        />
        </>
    );
};
