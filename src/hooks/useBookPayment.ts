import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import { BACKEND_URL } from '@/api.config';

interface BookShipping {
    name: string;
    phone: string;
    address: string;
    city?: string;
    postcode?: string;
}

interface UseBookPaymentReturn {
    buyBook: (
        bookId: number,
        shipping: BookShipping,
        couponCode?: string | null
    ) => void;
    loading: boolean;
}

export const useBookPayment = (): UseBookPaymentReturn => {
    const [loading, setLoading] = useState(false);

    const buyBook = (
        bookId: number,
        shipping: BookShipping,
        couponCode?: string | null
    ) => {
        setLoading(true);
        const token = localStorage.getItem('token');

        const requestBody: { shipping: BookShipping; coupon_code?: string; user_id?: number } = { shipping };

        if (couponCode && couponCode.trim()) {
            requestBody.coupon_code = couponCode.trim();
        }

        if (token) {
            try {
                const decodedToken: { id?: string | number; user_id?: string | number; sub?: string | number } = jwtDecode(token);
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
                BACKEND_URL + '/user/payment/initiate-for-book/' + bookId,
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
                setTimeout(() => {
                    window.location = res.data.data;
                }, res.data.coupon_applied ? 500 : 0);
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

    return { buyBook, loading };
};
