export interface PublicTestimonial {
  feedback_id: string;
  sort_order: number;
  is_active: boolean;
  course_id: string;
  user_id: string;
  rating: number;
  comment: string;
  category?: string | null;
  user_name: string;
  user_email?: string;
  course_name?: string;
}
