import { useState } from 'react';
import FreeVideoModal from './FreeVideoModal';
import { useFreeContentAccess } from '../hooks/useFreeContentAccess';
import axios from 'axios';
import { getAuthToken } from '@/helpers';
import { BACKEND_URL } from '@/api.config';

interface PdfItemProps {
    module: any;
    isFreeChapter: boolean;
    isExpanded?: boolean;
    onToggle?: (moduleId: number, shouldExpand: boolean) => void;
    courseId: string;
}

export default function PdfItem({
    module,
    isFreeChapter,
    isExpanded: externalIsExpanded,
    onToggle,
    courseId
}: PdfItemProps) {
    const [internalIsExpanded, setInternalIsExpanded] = useState(false);

    // Use the shared access hook
    const { hasAccess, showModal, setShowModal, handleFormSubmit, isLoggedInUser } = useFreeContentAccess(courseId);

    // Use external control if provided, otherwise use internal state
    const isExpanded = externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;

    // Backend may put is_free on module root when stripping data for unauthenticated users
    const isFreePdf =
        module.data?.is_free === true ||
        (module as any).is_free === true ||
        isFreeChapter;
    // Try multiple possible property names for the PDF URL
    const initialPdfUrl = module.data?.pdf_link || module.data?.pdfLink || module.data?.url || module.data?.link;

    // Use fetched URL if available, otherwise use initial URL
    const pdfUrl = initialPdfUrl;
    const finalPdfUrl = pdfUrl;

    const handlePdfClick = () => {
        if (!isFreePdf) {
            return;
        }

        // If user is not logged in, do not allow expanding functionality at all
        // User requested: "for nonlogged in user just disable the pdf module make it non clickable"
        if (!isLoggedInUser) {
            return;
        }

        if (hasAccess || isLoggedInUser) {
            // User already has access (or is logged in), toggle PDF
            const newExpandedState = !isExpanded;

            if (onToggle) {
                onToggle(module.id, newExpandedState);
            } else {
                setInternalIsExpanded(newExpandedState);
            }
        } else {
            // Show email modal
            setShowModal(true);
        }
    };

    const onFormSubmit = (data: { name: string; phone: string; email: string; apiSubmitted: boolean }) => {
        handleFormSubmit(data);

        // Auto-expand PDF with a slight delay for smooth transition
        setTimeout(() => {
            if (onToggle) {
                onToggle(module.id, true);
            } else {
                setInternalIsExpanded(true);
            }
        }, 200);
    };

    // Determine lock state visual:
    // If it's NOT free -> Locked
    // If it IS free but NOT logged in -> Locked (as per request)
    // If it IS free AND logged in -> Unlocked (Free Preview)
    const isLocked = !isFreePdf || (isFreePdf && !isLoggedInUser);

    return (
        <>
            <div
                className={`mb-4 rounded-lg overflow-hidden transition-all duration-300 ${!isLocked
                    ? 'hover:bg-muted/30 cursor-pointer'
                    : 'opacity-70 cursor-not-allowed'
                    }`}
            >
                {/* PDF Title Row */}
                <div
                    className={`flex gap-4 items-center p-3 ${!isLocked ? 'cursor-pointer' : 'cursor-not-allowed'
                        }`}
                    onClick={handlePdfClick}
                >
                    {/* PDF Icon */}
                    <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-shrink-0"
                    >
                        <path
                            d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
                            fill={!isLocked ? '#B153E0' : '#565656'}
                        />
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M7.85422 5.5H12.0442C13.5892 5.5 14.4492 6.39 14.4492 7.915V13.08C14.4492 14.63 13.5892 15.5 12.0452 15.5H7.85422C6.33422 15.5 5.44922 14.63 5.44922 13.08V7.915C5.44922 6.39 6.33422 5.5 7.85422 5.5ZM7.98922 7.83V7.825H9.48322C9.58732 7.825 9.68715 7.86635 9.76076 7.93996C9.83437 8.01357 9.87572 8.11340 9.87572 8.2175C9.87572 8.32160 9.83437 8.42143 9.76076 8.49504C9.68715 8.56865 9.58732 8.61 9.48322 8.61H7.98922C7.88578 8.61 7.78659 8.56891 7.71345 8.49577C7.64031 8.42263 7.59922 8.32343 7.59922 8.22C7.59922 8.11657 7.64031 8.01737 7.71345 7.94423C7.78659 7.87109 7.88578 7.83 7.98922 7.83ZM7.98922 10.87H11.9092C12.0127 10.87 12.1119 10.8289 12.185 10.7558C12.2581 10.6826 12.2992 10.5834 12.2992 10.48C12.2992 10.3766 12.2581 10.2774 12.185 10.2042C12.1119 10.1311 12.0127 10.09 11.9092 10.09H7.98922C7.88578 10.09 7.78659 10.1311 7.71345 10.2042C7.64031 10.2774 7.59922 10.3766 7.59922 10.48C7.59922 10.5834 7.64031 10.6826 7.71345 10.7558C7.78659 10.8289 7.88578 10.87 7.98922 10.87ZM7.98922 13.155H11.9092C12.1092 13.135 12.2592 12.965 12.2592 12.765C12.2605 12.6674 12.2254 12.5728 12.1606 12.4998C12.0959 12.4267 12.0063 12.3804 11.9092 12.37H7.98922C7.91552 12.3629 7.84131 12.3766 7.77497 12.4095C7.70864 12.4423 7.65281 12.4931 7.61381 12.556C7.57480 12.619 7.55417 12.6915 7.55424 12.7656C7.55431 12.8396 7.57509 12.9121 7.61422 12.975C7.69422 13.1 7.83922 13.175 7.98922 13.155Z"
                            fill="white"
                        />
                    </svg>

                    {/* Title */}
                    <p className="text-black dark:text-[#737373] text-base flex-1">
                        PDF: {module.title}
                    </p>

                    {/* Badge or Lock */}
                    {!isLocked ? (
                        <span className="px-3 py-1 bg-purple/20 text-purple text-xs font-semibold rounded-full border border-purple/30 flex-shrink-0">
                            FREE PREVIEW
                        </span>
                    ) : (
                        <svg
                            width="16"
                            height="18"
                            viewBox="0 0 18 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-shrink-0"
                        >
                            <path
                                d="M9 13.5V15.5M3 19.5H15C16.1046 19.5 17 18.6046 17 17.5V11.5C17 10.3954 16.1046 9.5 15 9.5H3C1.89543 9.5 1 10.3954 1 11.5V17.5C1 18.6046 1.89543 19.5 3 19.5ZM13 9.5V5.5C13 3.29086 11.2091 1.5 9 1.5C6.79086 1.5 5 3.29086 5 5.5V9.5H13Z"
                                stroke="#565656"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    )}
                </div>

                {isExpanded && isFreePdf && (
                    <div
                        className="px-4 pb-4 transition-all duration-300 ease-in-out"
                        style={{
                            animation: 'slideDown 0.3s ease-in-out',
                        }}
                    >
                        {/* PDF Viewer */}
                        {finalPdfUrl && (
                            <iframe
                                src={`https://docs.google.com/viewer?url=${finalPdfUrl}&embedded=true`}
                                className="w-full h-[70vh] rounded-lg border border-border"
                                title={module.title}
                                loading="lazy"
                            ></iframe>
                        )}
                    </div>
                )}
            </div>

            {/* Free PDF Access Modal */}
            <FreeVideoModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={onFormSubmit}
                videoTitle={module.title}
                courseId={courseId}
            />

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
}
