export interface PublicTestimonial {
  feedback_id: string;
  sort_order: number;
  is_active: boolean;
  video_url?: string | null;
  course_id: string;
  user_id: string;
  rating: number;
  comment: string;
  category?: string | null;
  user_name: string;
  user_email?: string;
  course_name?: string;
}
