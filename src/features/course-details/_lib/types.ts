export interface Section {
    label?: string;
    value?: string | number;
    icon?: string;
}

export interface EnrollmentSection {
    // Old structure (backward compatible)
    start?: Section;
    end?: Section;
    // New structure (bundle-style)
    prebooking_start?: Section;
    prebooking_end?: Section;
    enrollment_start?: Section;
    enrollment_end?: Section;
    // Common fields
    classStart?: Section;
    classTime?: Section;
}

// Books attached to a course (frontend-guide-user.md §2).
export interface AttachedBook {
    id: number;
    title: string;
    image_url?: string | null;
    price?: number;
    class_levels?: string[];
    tags?: string[];
    description?: string | null;
    [key: string]: any;
}

// Optional book inclusion selected at checkout (BOOKS_COURSE_BUNDLE_PAYMENT_FRONTEND_SPEC.md §9).
export interface BookSelection {
    include: true;
    shipping: {
        name: string;
        phone: string;
        address: string;
        city?: string;
        postcode?: string;
    };
}

export interface CourseData {
    id: number;
    title: string;
    description: string;
    short_description: string;
    price: number;
    x_price: number;
    enrolled: number;
    prebooking?: number;
    is_live?: boolean;
    isTaken?: boolean;
    isWishList?: boolean;
    intro_video?: string;
    thumbnail?: string;
    chapters?: Chapter[];
    // New top-level fields (frontend-guide-user.md §2)
    slug?: string | null;
    tags?: string[] | null;
    total_seats?: number | null;
    course_outline?: string | null;
    attached_books?: AttachedBook[];
    books_total?: number;
    instructor_list?: {
        instructors?: Instructor[];
    };
    feedback_list?: {
        feedbacks?: Feedback[];
    };
    faq_list?: {
        faqs?: FAQ[];
    };
    you_get?: {
        you_get: string;
    };
    // New chips shape (frontend-guide-user.md §4) — see _lib/chips.ts for readers.
    chips?: import('./chips').NewChips;
    image?: {
        imageUploadedLink?: string;
    };
    [key: string]: any;
}

export interface Chapter {
    id: number;
    title: string;
    is_free: boolean;
    modules: Module[];
    [key: string]: any;
}

export interface Module {
    id: number;
    title: string;
    data: {
        category: 'VIDEO' | 'PDF' | 'QUIZ';
        is_free?: boolean;
        videoUrl?: string;
        video_link?: string;
        videoLink?: string;
        videoHost?: 'Youtube' | 'BunnyCDN';
        [key: string]: any;
    };
    [key: string]: any;
}

export interface Instructor {
    name: string;
    credibility: string;
    imageUploadedLink?: string;
    [key: string]: any;
}

export interface Feedback {
    name: string;
    bio: string;
    description: string;
    imageUploadedLink: string;
    [key: string]: any;
}

export interface FAQ {
    question: string;
    answer: string;
    [key: string]: any;
}

export interface PrebookingData {
    name: string;
    email: string;
    phone: string;
}

export interface TabState {
    studyPlan: boolean;
    instructor: boolean;
    courseComplete: boolean;
}
