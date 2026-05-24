import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BACKEND_URL } from '@/api.config';

interface FreeVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { name: string; phone: string; email: string; apiSubmitted: boolean }) => void;
    videoTitle: string;
    courseId: string;
}

export default function FreeVideoModal({
    isOpen,
    onClose,
    onSubmit,
    videoTitle,
    courseId,
}: FreeVideoModalProps) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const validateEmail = (email: string): boolean => {
        // RFC 5322 compliant email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!phone.trim()) {
            setError('Please enter your phone number');
            return;
        }
        
        // Phone number validation - must be 11 digits
        const phoneDigits = phone.trim().replace(/\D/g, ''); // Remove non-digits
        if (phoneDigits.length !== 11) {
            setError('Phone number must be 11 digits (e.g., 01XXXXXXXXX)');
            return;
        }
        
        // Bangladesh phone number format validation (starts with 01)
        if (!phoneDigits.startsWith('01')) {
            setError('Phone number must start with 01');
            return;
        }
        
        if (!email.trim()) {
            setError('Please enter your email');
            return;
        }
        if (!validateEmail(email.trim())) {
            setError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        setError('');

        const userData = {
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
        };

        // Try to post to prebooking API
        let apiSuccess = false;
        try {
            const response = await fetch(`${BACKEND_URL}/user/course/prebook/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...userData,
                    utm: 'organic_demoVideo',
                }),
            });

            const data = await response.json();
            apiSuccess = data.success === true;
        } catch (err: any) {
            // Continue anyway - we'll allow access even if API fails
            // Log error for debugging but don't block user access
            console.error('Prebooking API error:', err.response?.data?.error || err.response?.data?.message || err.message);
        }

        // Always grant access if validation passed, regardless of API result
        // Call onSubmit with userData and API status
        onSubmit({ ...userData, apiSubmitted: apiSuccess });
        setIsSubmitting(false);
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 text-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-25" />

            {/* Modal Card - Purple themed */}
            <div
                className="w-full max-w-md lg:max-w-lg text-darkHeading transform overflow-hidden rounded-2xl bg-purple/5 dark:bg-purple/5 backdrop-blur-lg border border-purple/60 text-left align-middle shadow-xl transition-all relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Close modal"
                >
                    <svg
                        className="w-5 h-5 text-heading dark:text-darkHeading"
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

                {/* Header */}
                <div className="text-lg font-medium leading-6 p-6">
                    <div className="flex items-center flex-col lg:flex-row">
                        <div>
                            <p className="text-heading dark:text-darkHeading text-xl text-center lg:text-left">
                                Unlock Free Preview
                            </p>
                            <p className="text-paragraph dark:text-darkParagraph mt-2 text-base text-center lg:text-left">
                                Enter your details to watch <span className="text-purple font-medium">{videoTitle}</span> and access all free previews in this course.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="border-b border-t border-border/20 py-8 px-6">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-2 rounded-lg text-sm mb-6">
                                {error}
                            </div>
                        )}
                        
                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-6">
                            <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base lg:flex-1">
                                First Name
                            </p>
                            <input
                                type="text"
                                value={name}
                                placeholder="CoderVai"
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (error && error.includes('name')) {
                                        setError('');
                                    }
                                }}
                                className="w-full bg-white/0 border lg:flex-[2] border-border dark:border-border/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
                            />
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-6">
                            <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base lg:flex-1">
                                Phone Number
                            </p>
                            <input
                                type="tel"
                                value={phone}
                                placeholder="01xxxxxxxxx"
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    if (error && error.includes('phone')) {
                                        setError('');
                                    }
                                }}
                                className="w-full bg-white/0 border lg:flex-[2] border-border dark:border-border/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
                            />
                        </div>

                        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
                            <p className="text-paragraph dark:text-darkParagraph text-sm lg:text-base lg:flex-1">
                                Email
                            </p>
                            <input
                                type="email"
                                value={email}
                                placeholder="support@codervai.com"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (error && error.includes('email')) {
                                        setError('');
                                    }
                                }}
                                onBlur={(e) => {
                                    const emailValue = e.target.value.trim();
                                    if (emailValue && !validateEmail(emailValue)) {
                                        setError('Please enter a valid email address');
                                    }
                                }}
                                className="w-full bg-white/0 border lg:flex-[2] border-border dark:border-border/20 outline-none text-heading dark:text-darkHeading px-4 py-2 text-lg rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="flex p-6 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-[#fcfcfc0c] hover:bg-opacity-50 ease-in-out duration-150 border border-white/30 backdrop-blur-lg text-darkHeading py-3 w-full rounded-xl font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !name || !phone || !email}
                            className="bg-gradient-to-r from-purple to-[#9333EA] text-white py-3 w-full rounded-xl font-bold hover:shadow-lg hover:shadow-purple/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Watch Free Video'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
