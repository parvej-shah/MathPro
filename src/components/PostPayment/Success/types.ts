export interface Course {
    id: number;
    title: string;
    url: string;
    short_description?: string;
    chips?: {
        course_thumbnail_link?: string; // Old field (backward compatibility)
        thumbnails?: {
            course_thumbnail_link_16_9?: string;
            trailer_video_thumb_16_9?: string;
            facebook_community_thumb_16_9?: string;
        };
        sections?: {
            chapter?: { label: string; value: string };
            video?: { label: string; value: string };
        };
        socials?: {
            facebook_private_group?: string;
            facebook_community?: string;
            facebook_page?: string;
            whatsapp?: string;
            messenger?: string;
            phone?: string;
            email?: string;
        };
    };
}

export interface PurchasedBundle {
    id: number;
    title: string;
    price: number;
    url: string;
    amount: number;
    transaction_id: string;
    purchase_date: number;
    courses: Course[];
    course_count: number;
    you_get?: {
        you_get?: string;
    };
    chips?: {
        socials?: {
            facebook_private_group?: string;
            facebook_community?: string;
            facebook_page?: string;
            whatsapp?: string;
            messenger?: string;
            phone?: string;
            email?: string;
        };
    };
}

export interface PurchasedCourse {
    id: number;
    title: string;
    price: number;
    amount: number;
    transaction_id: string;
    purchase_date: number;
    short_description?: string;
    you_get?: {
        you_get?: string;
    };
    chips?: {
        course_thumbnail_link?: string; // Old field (backward compatibility)
        thumbnails?: {
            course_thumbnail_link_16_9?: string;
            trailer_video_thumb_16_9?: string;
            facebook_community_thumb_16_9?: string;
        };
        sections?: {
            chapter?: { label: string; value: string };
            video?: { label: string; value: string };
        };
        socials?: {
            facebook_private_group?: string;
            facebook_community?: string;
            facebook_page?: string;
            whatsapp?: string;
            messenger?: string;
            phone?: string;
            email?: string;
        };
    };
}

export type PurchaseData = PurchasedBundle | PurchasedCourse;

export interface AfterPurchaseMessage {
    id: number;
    type: string;
    course_ids: string | null;
    bundle_ids: string | null;
    messages: string[];
    created_at: string;
    updated_at: string;
}
