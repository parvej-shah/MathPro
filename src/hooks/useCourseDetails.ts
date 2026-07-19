import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '@/api.config';
import { UserContext } from '@/Contexts/UserContext';
import { jwtDecode } from 'jwt-decode';
import { isLoggedIn } from '@/helpers';
import { CourseData, EnrollmentSection, Section, BookSelection } from '@/features/course-details/_lib/types';

interface PrebookingData {
    name: string;
    email: string;
    phone: string;
}

interface Bundle {
    id: number;
    title: string;
    price: number;
    course_count: number;
    purchased?: boolean;
    is_live?: boolean;
    courses: Array<{
        id: number;
        title: string;
        price: number;
        [key: string]: any;
    }>;
    chips?: {
        enrollment?: EnrollmentSection;
    };
    [key: string]: any;
}

interface UseCourseDetailsReturn {
    courseData: CourseData | null;
    loading: boolean;
    error: string | null;
    fetchCourse: () => void;
    buyCourse: (couponCode?: string | null, bookSelection?: BookSelection | null) => void;
    prebookCourse: (data: PrebookingData) => Promise<boolean>;
    purchaseFreeCourse: () => void;
    enrollFreeCourse: () => void;
    prebookButtonLoading: boolean;
    // Bundle related
    bundle: Bundle | null;
    bundleLoading: boolean;
    fetchBundle: () => void;
    hasPrebooked: boolean;
    checkPrebookStatus: () => void;
}

export const useCourseDetails = (
    courseId: string | string[] | undefined
): UseCourseDetailsReturn => {
    const [user, setUser] = useContext<any>(UserContext);
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [prebookButtonLoading, setPrebookButtonLoading] = useState(false);
    
    // Bundle state
    const [bundle, setBundle] = useState<Bundle | null>(null);
    const [bundleLoading, setBundleLoading] = useState(false);
    const [hasPrebooked, setHasPrebooked] = useState(false);

    const fetchCourse = (isRetry = false) => {
        // Don't fetch if courseId is not available yet
        if (!courseId) {
            return;
        }

        setLoading(true);
        setError(null);
        setUser({ ...user, loading: true });
        const token = localStorage.getItem('token');

        // Pretty slug URLs (e.g. /courses/discrete-mathematics) hit the slug route;
        // purely-numeric ids fall back to the legacy getfull/:id route.
        // (frontend-guide-user.md §1)
        const idStr = String(courseId);
        const isNumericId = /^\d+$/.test(idStr);
        const endpoint = isNumericId
            ? '/user/course/getfull/' + idStr
            : '/user/course/getfull/slug/' + idStr;

        axios
            .get(BACKEND_URL + endpoint, {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            })
            .then((res) => {
                setCourseData(res.data);
                setLoading(false);
                setError(null);
                setUser({ ...user, loading: false });
            })
            .catch((err) => {
                console.error('Error fetching course:', err);
                const status = err.response?.status;
                // Retry once on 500 (backend can fail for some courses when not logged in)
                if (status === 500 && !isRetry) {
                    fetchCourse(true);
                    return;
                }
                setLoading(false);
                setError(
                    status === 404
                        ? 'Course not found'
                        : status === 500
                          ? 'Server error loading this course. Try again or log in to view.'
                          : 'Failed to load course'
                );
                setUser({ ...user, loading: false });
            });
    };

    const buyCourse = (couponCode?: string | null, bookSelection?: BookSelection | null) => {
        setUser({ ...user, loading: true });
        const token = localStorage.getItem('token');

        // Prepare request body. Price is determined server-side from the course
        // record — the client must not send it.
        const requestBody: any = {};

        // Add coupon code if provided
        if (couponCode && couponCode.trim()) {
            requestBody.coupon_code = couponCode.trim();
        }

        // Optional book inclusion + shipping (BOOKS_COURSE_BUNDLE_PAYMENT_FRONTEND_SPEC.md)
        if (bookSelection?.include) {
            requestBody.include_books = true;
            requestBody.shipping = bookSelection.shipping;
        }

        // Get user_id from token if available
        let userId: number | undefined;
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                userId =
                    decodedToken.id || decodedToken.user_id || decodedToken.sub;
                if (userId) {
                    requestBody.user_id = parseInt(userId.toString());
                }
            } catch (error) {
                console.warn('Token decode error:', error);
            }
        }

        axios
            .post(
                BACKEND_URL + '/user/payment/initiate/' + courseId,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                // Show success message if coupon was applied (before redirect)
                if (res.data.coupon_applied && couponCode) {
                    toast.success(
                        `Coupon applied! Saved ৳${res.data.discount_amount || 0}`,
                        { duration: 2000 }
                    );
                }
                if (res.data.books_included) {
                    toast.success(
                        `বইসহ অর্ডার করা হচ্ছে (৳${res.data.books_total || 0})`,
                        { duration: 2000 }
                    );
                }
                // Small delay to show toast before redirect
                const hasToast = res.data.coupon_applied || res.data.books_included;
                setTimeout(() => {
                    window.location = res.data.data;
                }, hasToast ? 500 : 0);
            })
            .catch((err) => {
                setUser({ ...user, loading: false });
                const errorMessage =
                    err.response?.data?.error ||
                    err.message ||
                    'Failed to initiate payment';
                toast.error(errorMessage);
            });
    };

    const prebookCourse = async (data: PrebookingData): Promise<boolean> => {
        // Validate form data
        if (!data.name || !data.email || !data.phone) {
            toast.error('অনুগ্রহ করে সকল তথ্য পূরণ করুন');
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            toast.error('সঠিক ইমেইল ঠিকানা দিন');
            return false;
        }

        // Basic phone validation (Bangladesh format)
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(data.phone)) {
            toast.error('সঠিক ফোন নাম্বার দিন (01XXXXXXXXX)');
            return false;
        }

        setPrebookButtonLoading(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                BACKEND_URL + '/user/course/prebook/' + courseId,
                data,
                {
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                }
            );

            setUser({ ...user, loading: false });
            setPrebookButtonLoading(false);

            // Update course data to reflect prebooked status
            if (courseData) {
                setCourseData({
                    ...courseData,
                    isWishList: true,
                    prebooking: (courseData.prebooking || 0) + 1,
                });
            }

            // Update prebook status
            setHasPrebooked(true);

            // Save to localStorage
            const localStorageKey = `course_${courseId}_prebooked`;
            localStorage.setItem(localStorageKey, 'true');

            toast.success('কোর্সটি সফলভাবে প্রিবুক করা হয়েছে!');
            return true;
        } catch (err: any) {
            setUser({ ...user, loading: false });
            setPrebookButtonLoading(false);

            // Handle new error format (error.response?.data?.error as string)
            // Also support old format (error.response?.data?.message) for backward compatibility
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                'প্রিবুক করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।';
            toast.error(errorMessage);
            return false;
        }
    };

    const enrollFreeCourse = () => {
        setUser({ ...user, loading: true });
        const token = localStorage.getItem('token');

        axios
            .post(
                BACKEND_URL + '/user/course/enroll-free/' + courseId,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                setUser({ ...user, loading: false });
                window.location.href = '/post-payment/success?type=course';
            })
            .catch((err) => {
                setUser({ ...user, loading: false });
                const errorMessage =
                    err.response?.data?.error ||
                    err.message ||
                    'Failed to enroll in this course';
                toast.error(errorMessage);
            });
    };

    const purchaseFreeCourse = () => {
        const token = localStorage.getItem('token');
        axios
            .post(
                BACKEND_URL + '/user/course/applyCoupon/' + courseId,
                {
                    coupon: 'PY100',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                setUser({ ...user, loading: false });
                setPrebookButtonLoading(false);
                toast.success('You have successfully bought this course!');

                if (courseData) {
                    setCourseData({
                        ...courseData,
                        isTaken: true,
                    });
                }
            })
            .catch((err) => {
                setUser({ ...user, loading: false });
                toast.error('Wrong Coupon Code!');
                setPrebookButtonLoading(false);
            });
    };

    // Check prebook status
    const checkPrebookStatus = async () => {
        if (!courseData?.id) return;

        // Priority 1: Check if course itself was prebooked (localStorage)
        const courseLocalStorageKey = `course_${courseData.id}_prebooked`;
        const courseLocalPrebook = localStorage.getItem(courseLocalStorageKey);

        if (courseLocalPrebook === 'true') {
            setHasPrebooked(true);
            return;
        }

        // Priority 2: Check if course belongs to a bundle that was prebooked (localStorage)
        if (courseData?.chips?.bundle_id) {
            const bundleId = courseData.chips.bundle_id;
            const bundleLocalStorageKey = `bundle_${bundleId}_prebooked`;
            const bundleLocalPrebook = localStorage.getItem(bundleLocalStorageKey);

            if (bundleLocalPrebook === 'true') {
                setHasPrebooked(true);
                // Also save course prebook status for consistency
                localStorage.setItem(courseLocalStorageKey, 'true');
                return;
            }
        }

        // Priority 3: If logged in, check via API (course prebook, then bundle prebook if needed)
        if (isLoggedIn()) {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const decodedToken: any = jwtDecode(token);
                const userId =
                    decodedToken.id || decodedToken.user_id || decodedToken.sub;

                if (!userId) return;

                // Check course prebook status via API
                try {
                    const courseResponse = await axios.get(
                        `${BACKEND_URL}/user/course/${courseData.id}/check-prebook/${userId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (
                        courseResponse.data.success &&
                        courseResponse.data.data.prebooked
                    ) {
                        setHasPrebooked(true);
                        // Also save to localStorage for consistency
                        localStorage.setItem(courseLocalStorageKey, 'true');
                        return;
                    }
                } catch (courseError) {
                    console.error('Error checking course prebook status:', courseError);
                }

                // If course not prebooked, check bundle prebook status (if course belongs to bundle)
                if (courseData?.chips?.bundle_id) {
                    try {
                        const bundleId = courseData.chips.bundle_id;
                        const bundleResponse = await axios.get(
                            `${BACKEND_URL}/user/bundle/${bundleId}/check-prebook/${userId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (
                            bundleResponse.data.success &&
                            bundleResponse.data.data.prebooked
                        ) {
                            setHasPrebooked(true);
                            // Save both bundle and course prebook status
                            localStorage.setItem(
                                `bundle_${bundleId}_prebooked`,
                                'true'
                            );
                            localStorage.setItem(courseLocalStorageKey, 'true');
                        }
                    } catch (bundleError) {
                        console.error('Error checking bundle prebook status:', bundleError);
                    }
                }
            } catch (error) {
                console.error('Error checking prebook status:', error);
            }
        }
    };

    // Fetch bundle data
    const fetchBundle = () => {
        if (!courseData?.chips?.bundle_id) {
            setBundle(null);
            return;
        }

        const bundleId = courseData.chips.bundle_id;
        if (!bundleId) {
            setBundle(null);
            return;
        }

        setBundleLoading(true);

        try {
            const token = localStorage.getItem('token');

            let requestConfig: any = {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            };

            if (token) {
                try {
                    const decodedToken: any = jwtDecode(token);
                    const userId =
                        decodedToken.id ||
                        decodedToken.user_id ||
                        decodedToken.sub;

                    if (userId) {
                        requestConfig.data = { user_id: parseInt(userId.toString()) };
                    }
                } catch (error) {
                    console.warn('Token decode error:', error);
                }
            }

            axios
                .get(`${BACKEND_URL}/user/bundle/${bundleId}`, requestConfig)
                .then((response) => {
                    if (
                        response.data.success &&
                        response.data.data.length > 0
                    ) {
                        const bundleData = response.data.data[0];
                        setBundle(bundleData);
                    } else {
                        setBundle(null);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching bundle:', error);
                    setBundle(null);
                })
                .finally(() => {
                    setBundleLoading(false);
                });
        } catch (error) {
            console.error('Error fetching bundle:', error);
            setBundleLoading(false);
            setBundle(null);
        }
    };

    useEffect(() => {
        // Only run on client side when courseId is available
        if (typeof window !== 'undefined' && courseId) {
            fetchCourse();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    // Check prebook status when course data is loaded
    useEffect(() => {
        if (courseData) {
            checkPrebookStatus();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseData]);

    // Fetch bundle when bundle_id is available
    useEffect(() => {
        if (courseData?.chips?.bundle_id) {
            fetchBundle();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseData?.chips?.bundle_id]);

    return {
        courseData,
        loading,
        error,
        fetchCourse,
        buyCourse,
        prebookCourse,
        purchaseFreeCourse,
        enrollFreeCourse,
        prebookButtonLoading,
        bundle,
        bundleLoading,
        fetchBundle,
        hasPrebooked,
        checkPrebookStatus,
    };
};

export type { CourseData, PrebookingData, Section, EnrollmentSection };
