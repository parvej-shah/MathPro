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
    chips?: {
        // Bundle ID (for price billboard)
        bundle_id?: string | number | null;
        
        // Thumbnails (new structure)
        thumbnails?: {
            course_thumbnail_link_16_9?: string;
            trailer_video_thumb_16_9?: string;
            facebook_community_thumb_16_9?: string;
        };
        
        // Social links (new structure)
        socials?: {
            facebook_community?: string;
            facebook_private_group?: string;
            facebook_page?: string;
            whatsapp?: string;
            messenger?: string;
            phone?: string;
            email?: string;
        };
        
        // Old fields (backward compatible)
        course_thumbnail_link?: string;
        deadline?: string;
        total_seats?: string;
        whatsapp?: string;
        facebookPage?: string;
        course_outline?: string;
        
        sections?: {
            chapter?: Section;
            video?: Section;
            contest?: Section;
            liveClass?: Section;
            archiveClass?: Section;
            codingProblem?: Section;
        };
        enrollment?: EnrollmentSection;
    };
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
        category: 'VIDEO' | 'ASSIGNMENT' | 'PDF' | 'QUIZ' | 'CODE';
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
