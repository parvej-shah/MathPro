import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { BACKEND_URL } from '@/api.config';
import { BookSelection } from '@/features/course-details/_lib/types';

interface UseBundlePaymentReturn {
    buyBundle: (
        bundleId: number,
        couponCode?: string | null,
        bookSelection?: BookSelection | null
    ) => void;
    loading: boolean;
}

export const useBundlePayment = (): UseBundlePaymentReturn => {
    const [loading, setLoading] = useState(false);

    const buyBundle = (
        bundleId: number,
        couponCode?: string | null,
        bookSelection?: BookSelection | null
    ) => {
        setLoading(true);
        const token = localStorage.getItem('token');

        const requestBody: any = {};

        if (couponCode && couponCode.trim()) {
            requestBody.coupon_code = couponCode.trim();
        }

        // Optional book inclusion + shipping (BOOKS_COURSE_BUNDLE_PAYMENT_FRONTEND_SPEC.md)
        if (bookSelection?.include) {
            requestBody.include_books = true;
            requestBody.shipping = bookSelection.shipping;
        }

        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                const userId =
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
                BACKEND_URL + '/user/payment/initiate-for-bundle/' + bundleId,
                requestBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
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
                const hasToast = res.data.coupon_applied || res.data.books_included;
                setTimeout(() => {
                    window.location = res.data.data;
                }, hasToast ? 500 : 0);
            })
            .catch((err) => {
                setLoading(false);
                const errorMessage =
                    err.response?.data?.error ||
                    err.message ||
                    'Failed to initiate payment';
                toast.error(errorMessage);
            });
    };

    return { buyBundle, loading };
};
