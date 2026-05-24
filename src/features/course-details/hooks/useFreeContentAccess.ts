import { useState, useEffect } from 'react';
import { isLoggedIn, getAuthToken } from '@/helpers';
import { BACKEND_URL } from '@/api.config';
import { jwtDecode } from 'jwt-decode';

const STORAGE_KEY_PREFIX = 'codervai_free_video_access';
const ACCESS_UPDATED_EVENT = 'codervai_free_access_updated';
const RETRY_DELAY = 1 * 60 * 1000; // 1 minute in milliseconds

interface UseFreeContentAccessReturn {
    hasAccess: boolean;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    handleFormSubmit: (data: { name: string; phone: string; email: string; apiSubmitted: boolean }) => void;
    retryApiSubmission: (userData: { name: string; phone: string; email: string }, timestamp: number) => Promise<void>;
    isLoggedInUser: boolean;
}

/**
 * Custom hook to manage access control for free content (videos/PDFs)
 * Handles localStorage, logged-in user detection, and prebook API submission
 */
export function useFreeContentAccess(courseId: string): UseFreeContentAccessReturn {
    const [hasAccess, setHasAccess] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoggedInUser, setIsLoggedInUser] = useState(false);

    // Check localStorage immediately on mount for initial state
    useEffect(() => {
        // Check login status
        const loggedIn = isLoggedIn();
        setIsLoggedInUser(loggedIn);

        if (loggedIn) {
            setHasAccess(true); // Optimistically grant access for logged in users
        }

        const checkStorage = () => {
            if (typeof window !== 'undefined' && courseId) {
                // Priority 1: Check course prebook status (includes bundle prebook check)
                const coursePrebookKey = `course_${courseId}_prebooked`;
                const coursePrebooked = localStorage.getItem(coursePrebookKey);
                
                if (coursePrebooked === 'true') {
                    setHasAccess(true);
                    return;
                }

                // Priority 2: Check free video access storage
                const storageKey = `${STORAGE_KEY_PREFIX}_${courseId}`;
                const storedData = localStorage.getItem(storageKey);

                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        if (parsedData.email && parsedData.name && parsedData.phone) {
                            setHasAccess(true);
                        }
                    } catch (e) {
                        // Invalid data
                    }
                }
            }
        };

        checkStorage();

        // Listen for access updates from other components
        const handleAccessUpdate = (event: any) => {
            if (event.detail?.courseId === courseId) {
                checkStorage();
            }
        };

        window.addEventListener(ACCESS_UPDATED_EVENT, handleAccessUpdate);
        return () => window.removeEventListener(ACCESS_UPDATED_EVENT, handleAccessUpdate);
    }, [courseId]);

    useEffect(() => {
        const checkAccess = async () => {
            if (typeof window !== 'undefined' && courseId) {
                // Priority 1: Check course prebook status (includes bundle prebook check)
                const coursePrebookKey = `course_${courseId}_prebooked`;
                const coursePrebooked = localStorage.getItem(coursePrebookKey);
                
                if (coursePrebooked === 'true') {
                    setHasAccess(true);
                    return;
                }

                // Priority 2: Check free video access storage
                const storageKey = `${STORAGE_KEY_PREFIX}_${courseId}`;
                const storedData = localStorage.getItem(storageKey);

                // First check localStorage
                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);

                        // Check if data is valid
                        if (parsedData.email && parsedData.name && parsedData.phone) {
                            // Grant permanent access once details are provided
                            setHasAccess(true);
                            return;
                        } else {
                            // Invalid data structure
                            localStorage.removeItem(storageKey);
                        }
                    } catch (e) {
                        // Invalid JSON, clear it
                        localStorage.removeItem(storageKey);
                    }
                }

                // If user is logged in, automatically grant access and submit prebook
                if (isLoggedIn()) {
                    setIsLoggedInUser(true);
                    setHasAccess(true); // Ensure access is granted

                    try {
                        const token = getAuthToken();
                        if (token) {
                            const decoded: any = jwtDecode(token);

                            // Extract user data from token
                            const userData = {
                                name: decoded.name || 'User',
                                email: decoded.email || '',
                                phone: decoded.phone || '',
                            };

                            // Only proceed if we have valid data
                            if ((userData.email || userData.phone) && userData.name) {
                                // Submit prebook in background
                                try {
                                    const response = await fetch(`${BACKEND_URL}/user/course/prebook/${courseId}`, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                            name: userData.name,
                                            phone: userData.phone,
                                            email: userData.email,
                                            utm: 'organic_demoVideo',
                                        }),
                                    });
                                    const responseData = await response.json();
                                } catch (err) {
                                    console.error('Prebook API failed:', err);
                                    // Silently fail - still grant access
                                }

                                // Store in localStorage for future reference
                                const storageData = {
                                    name: userData.name,
                                    phone: userData.phone,
                                    email: userData.email,
                                    apiSubmitted: true,
                                    timestamp: Date.now(),
                                };
                                localStorage.setItem(storageKey, JSON.stringify(storageData));

                                return;
                            }
                        }
                    } catch (error) {
                        // Token decode failed but user is logged in, so access remains true
                    }
                }

                setHasAccess(false);
            }
        };

        checkAccess();
    }, [courseId]);

    const retryApiSubmission = async (
        userData: { name: string; phone: string; email: string },
        timestamp: number
    ) => {
        if (!courseId) return;

        try {
            const response = await fetch(`${BACKEND_URL}/user/course/prebook/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    utm: 'organic_demoVideo',
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update localStorage to mark as submitted
                const storageKey = `${STORAGE_KEY_PREFIX}_${courseId}`;
                const currentData = localStorage.getItem(storageKey);
                if (currentData) {
                    const parsed = JSON.parse(currentData);
                    if (parsed.timestamp === timestamp) {
                        parsed.apiSubmitted = true;
                        localStorage.setItem(storageKey, JSON.stringify(parsed));
                    }
                }
            }
        } catch (err) {
            // Silently fail
        }
    };

    const handleFormSubmit = (data: { name: string; phone: string; email: string; apiSubmitted: boolean }) => {
        // Store user data in localStorage with timestamp and API status (client-side only)
        if (typeof window !== 'undefined' && courseId) {
            const storageKey = `${STORAGE_KEY_PREFIX}_${courseId}`;
            const storageData = {
                name: data.name,
                phone: data.phone,
                email: data.email,
                apiSubmitted: data.apiSubmitted,
                timestamp: Date.now(),
            };
            localStorage.setItem(storageKey, JSON.stringify(storageData));

            // Notify other components (like PdfItem/VideoItem) that access has been granted
            window.dispatchEvent(new CustomEvent(ACCESS_UPDATED_EVENT, { detail: { courseId } }));

            // If API submission failed, retry after 1 minute
            if (!data.apiSubmitted) {
                setTimeout(() => {
                    retryApiSubmission(
                        { name: data.name, phone: data.phone, email: data.email },
                        storageData.timestamp
                    );
                }, RETRY_DELAY);
            }
        }

        // Update state immediately - grant permanent access
        setHasAccess(true);
        setShowModal(false);
    };

    return {
        hasAccess,
        showModal,
        setShowModal,
        handleFormSubmit,
        retryApiSubmission,
        isLoggedInUser
    };
}
