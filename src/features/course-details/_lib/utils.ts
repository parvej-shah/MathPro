import { Section, EnrollmentSection } from '../_lib/types';

// Slider settings for react-slick
export const settings = {
    dots: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    infinite: true,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 700,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

// Check if a section has valid data
export const isSectionValid = (
    section: Section | EnrollmentSection | undefined
): boolean => {
    if (!section) return false;
    if ('start' in section || 'end' in section) {
        return Object.values(section).some((s) => s?.label && s?.value);
    }
    return (
        'label' in section &&
        'value' in section &&
        Boolean(section.label && section.value)
    );
};

// Get icon for section type
export const getSectionIcon = (sectionKey: string): string => {
    const iconMap: { [key: string]: string } = {
        chapter: '/icons/chapter.svg',
        video: '/icons/video.svg',
        contest: '/icons/trophy.svg',
        liveClass: '/icons/live.svg',
        codingProblem: '/icons/code.svg',
        archiveClass: '/icons/archive.svg',
    };
    return iconMap[sectionKey] || '/icons/default.svg';
};

// Get suffix for section value
export const getValueSuffix = (sectionKey: string): string => {
    const suffixMap: { [key: string]: string } = {
        video: 'ঘন্টা',
        chapter: 'টি',
        contest: 'টি',
        liveClass: 'টি',
        codingProblem: 'টি',
        archiveClass: 'টি',
    };
    return suffixMap[sectionKey] || '';
};
