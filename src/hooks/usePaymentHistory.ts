import { useQuery } from '@tanstack/react-query';
import { BACKEND_URL } from '../api.config';
import { isLoggedIn } from '../helpers';

interface UserInfo {
  name: string;
  phone: string | null; // ✅ Allow NULL
  email?: string; // ✅ NEW: Top-level email
  login_type?: "email" | "phone"; // ✅ NEW: Login type
  profile: {
    email: string | null; // ✅ Allow NULL
    address: string;
  };
}

interface Summary {
  total_spent: number;
  total_individual_spent: number;
  total_bundle_spent: number;
  total_courses_enrolled: number;
  total_bundles_purchased: number;
  total_transactions: number;
}

interface Coupon {
  id: number;
  code: string;
  name: string;
  discount_type: string;
  discount_value: number;
  discount_amount: number | null;
  original_price: number | null;
  final_price: number | null;
}

interface IndividualCourse {
  user_id: number;
  course_id: number;
  paid_amount: number;
  transaction_id: string;
  enrollment_date: number;
  id: number;
  title: string;
  original_price: number;
  course_url: string;
  short_description: string;
  instructor_list: {
    instructors: Array<{
      name: string;
      credibility?: string;
    }>;
  } | string[] | string | null;
  purchase_type: 'individual';
  coupon?: Coupon | null;
}

interface BundleCourse {
  id: number;
  title: string;
  url: string;
  price: number;
  enrollment_date: number;
}

interface BundlePurchase {
  user_id: number;
  bundle_id: number;
  paid_amount: number;
  transaction_id: string;
  purchase_date: number;
  id: number;
  title: string;
  original_price: number;
  bundle_url: string;
  purchase_type: 'bundle';
  courses: BundleCourse[];
  coupon?: Coupon | null;
  chips?: {
    thumbnails?: {
      bundle_thumb_16_9?: string;
      bundle_thumb_4_3?: string;
    };
    image_slider?: {
      image_1_16_9?: string;
      image_1_4_3?: string;
      image_2_16_9?: string;
      image_2_4_3?: string;
      image_3_16_9?: string;
      image_3_4_3?: string;
      image_4_16_9?: string;
      image_4_4_3?: string;
    };
  };
}

interface Transaction {
  user_id: number;
  course_id?: number;
  bundle_id?: number;
  paid_amount: number;
  transaction_id: string;
  enrollment_date?: number;
  purchase_date?: number;
  transaction_date: number;
  item_type: 'course' | 'bundle';
  title: string;
  purchase_type: 'individual' | 'bundle';
  original_price: number;
  course_url?: string;
  bundle_url?: string;
  courses?: BundleCourse[];
  coupon?: Coupon | null;
}

interface PaymentHistoryData {
  user_info: UserInfo;
  summary: Summary;
  individual_courses: IndividualCourse[];
  bundle_purchases: BundlePurchase[];
  all_transactions: Transaction[];
}

interface PaymentHistoryResponse {
  success: boolean;
  data?: PaymentHistoryData;
  error?: string;
}

export const usePaymentHistory = () => {
  const fetchPaymentHistory = async (): Promise<PaymentHistoryData> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in to view your payment history.');
    }

    const response = await fetch(`${BACKEND_URL}/user/payment/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Authentication failed. Please log in again.');
      } else if (response.status === 403) {
        throw new Error('Access denied. You do not have permission to view payment history.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    }

    const result: PaymentHistoryResponse = await response.json();

    if (result.success && result.data) {
      
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to fetch payment history');
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['paymentHistory'],
    queryFn: fetchPaymentHistory,
    enabled: typeof window !== 'undefined' && isLoggedIn(),
    staleTime: 5 * 60 * 1000, // 5 minutes - fresh payment data
    retry: 1,
    retryDelay: 1000,
  });

  return {
    historyData: data || null,
    loading: isLoading,
    error: error instanceof Error ? error.message : (error ? String(error) : null),
    refetch,
  };
};

export type {
  PaymentHistoryData,
  UserInfo,
  Summary,
  IndividualCourse,
  BundlePurchase,
  Transaction,
  BundleCourse,
  Coupon,
};
