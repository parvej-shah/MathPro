export type PublicFAQCategory =
  | "courses"
  | "enrollment"
  | "payment"
  | "support"
  | "certificate";

export interface PublicFAQ {
  id: number;
  question: string;
  answer: string;
  category?: PublicFAQCategory | null;
  sort_order?: number;
}
