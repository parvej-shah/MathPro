import { IndividualCourse, BundlePurchase, BundleCourse } from '@/hooks/usePaymentHistory';

export interface EnrolledCourse {
  id: number | string;
  title: string;
  thumbnail: string;
  progress: number;
  lastAccessed?: string;
  status: 'Ongoing' | 'Completed' | 'Not Started';
  totalLessons: number;
  completedLessons: number;
  instructor: string;
  isBundle?: boolean;
  courses?: BundleCourse[];
  courseCount?: number;
  originalData?: IndividualCourse | BundlePurchase | BundleCourse;
  isLoading?: boolean;
}
