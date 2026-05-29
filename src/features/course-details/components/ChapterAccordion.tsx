import { Chapter } from '@/features/course-details/_lib/types';
import { countAssignmentsAndVideos } from '@/helpers';
import VideoItem from './VideoItem';
import PdfItem from './PdfItem';
import { useState } from 'react';

interface ChapterAccordionProps {
    chapter: Chapter;
    index: number;
    isOpen: boolean;
    onToggle: (index: number) => void;
    courseId: string;
}

export default function ChapterAccordion({
    chapter,
    index,
    isOpen,
    onToggle,
    courseId,
}: ChapterAccordionProps) {
    const stats = countAssignmentsAndVideos(chapter.modules);
    const [expandedVideoId, setExpandedVideoId] = useState<number | null>(null);
    const [expandedPdfId, setExpandedPdfId] = useState<number | null>(null);

    const handleVideoToggle = (moduleId: number, shouldExpand: boolean) => {
        if (shouldExpand) {
            setExpandedVideoId(moduleId);
        } else {
            setExpandedVideoId(null);
        }
    };

    const handlePdfToggle = (moduleId: number, shouldExpand: boolean) => {
        if (shouldExpand) {
            setExpandedPdfId(moduleId);
        } else {
            setExpandedPdfId(null);
        }
    };

    return (
        <div className="dark:bg-gray-200/5 bg-gray-400/20 border-gray-400/50 backdrop-blur-lg border dark:border-gray-200/20 mb-6 rounded-lg overflow-hidden">
            <div className="p-5 cursor-pointer" onClick={() => onToggle(index)}>
                <div className="flex justify-between">
                    <div
                        className="flex gap-4 flex-col lg:flex-row justify-start"
                        style={{ flex: 3 }}
                    >
                        {chapter.is_free ? (
                            <div>
                                <div className="px-2 py-2 rounded-full bg-primary/[.14] inline-block">
                                    <p className="px-4 py-1 rounded-full bg-primary/[.32] font-bold text-xl inline-block">
                                        {index + 1}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="px-2 py-2 rounded-full bg-[#FFFFFF]/[.14] inline-block">
                                    <p className="px-4 py-1 rounded-full bg-[#FFFFFF]/[.32] font-bold text-xl inline-block">
                                        {index + 1}
                                    </p>
                                </div>
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <p className={`text-2xl ${!chapter.is_free && 'text-muted-foreground'}`}>
                                    {chapter.title}
                                </p>
                                {!chapter.is_free && chapter.modules.some(m => (m?.data?.category === 'VIDEO' || m?.data?.category === 'PDF') && (m?.data?.is_free === true || (m as any)?.is_free === true)) && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-full text-xs font-semibold text-primary">
                                        <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 20C15.523 20 20 15.523 20 10C20 4.477 15.523 0 10 0C4.477 0 0 4.477 0 10C0 15.523 4.477 20 10 20Z" fill="currentColor" />
                                            <path d="M14.2164 10.8862C14.7194 10.4382 14.7194 9.5622 14.2164 9.11419C12.7337 7.78108 11.0347 6.71042 9.19235 5.94819L8.86235 5.81319C8.22935 5.55319 7.56235 6.04719 7.47635 6.80019C7.23705 8.92681 7.23705 11.0736 7.47635 13.2002C7.56135 13.9532 8.22935 14.4462 8.86235 14.1872L9.19235 14.0522C11.0347 13.2899 12.7337 12.2193 14.2164 10.8862Z" fill="white" />
                                        </svg>
                                        Free Preview Available
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-3 lg:items-center mt-3 text-sm font-medium">
                                {stats.videoCount > 0 && (
                                    <div className="flex items-center gap-3">
                                        <svg
                                            width="13"
                                            height="12"
                                            viewBox="0 0 13 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
                                                fill={chapter.is_free ? 'oklch(0.718 0.147 159.2)' : 'currentColor'}
                                            />
                                        </svg>
                                        <p className={!chapter.is_free ? 'text-muted-foreground' : ''}>
                                            {stats.videoCount} টি ভিডিও
                                        </p>
                                    </div>
                                )}
                                {stats.quizCount > 0 && (
                                    <div className="flex items-center gap-3">
                                        <svg
                                            width="13"
                                            height="12"
                                            viewBox="0 0 13 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
                                                fill={chapter.is_free ? 'oklch(0.718 0.147 159.2)' : 'currentColor'}
                                            />
                                        </svg>
                                        <p className={!chapter.is_free ? 'text-muted-foreground' : ''}>
                                            {stats.quizCount} টি কুইজ
                                        </p>
                                    </div>
                                )}
                                {stats.codeCount > 0 && (
                                    <div className="flex items-center gap-3">
                                        <svg
                                            width="13"
                                            height="12"
                                            viewBox="0 0 13 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
                                                fill={chapter.is_free ? 'oklch(0.718 0.147 159.2)' : 'currentColor'}
                                            />
                                        </svg>
                                        <p className={!chapter.is_free ? 'text-muted-foreground' : ''}>
                                            {stats.codeCount} টি কোডিং চ্যালেঞ্জ
                                        </p>
                                    </div>
                                )}
                                {stats.pdfCount > 0 && (
                                    <div className="flex items-center gap-3">
                                        <svg
                                            width="13"
                                            height="12"
                                            viewBox="0 0 13 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M9.37 1H10.87C11.0026 1 11.1298 1.05268 11.2236 1.14645C11.3173 1.24021 11.37 1.36739 11.37 1.5V10.5C11.37 10.6326 11.3173 10.7598 11.2236 10.8536C11.1298 10.9473 11.0026 11 10.87 11H2.87C2.73739 11 2.61021 10.9473 2.51645 10.8536C2.42268 10.7598 2.37 10.6326 2.37 10.5V1.5C2.37 1.36739 2.42268 1.24021 2.51645 1.14645C2.61021 1.05268 2.73739 1 2.87 1H4.37V0H5.37V1H8.37V0H9.37V1ZM9.37 2V3H8.37V2H5.37V3H4.37V2H3.37V10H10.37V2H9.37ZM4.37 4H9.37V5H4.37V4ZM4.37 6H9.37V7H4.37V6Z"
                                                fill={chapter.is_free ? 'oklch(0.718 0.147 159.2)' : 'currentColor'}
                                            />
                                        </svg>
                                        <p className={!chapter.is_free ? 'text-muted-foreground' : ''}>
                                            {stats.pdfCount} টি পিডিএফ
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {chapter.is_free ? (
                            <p
                                className="px-4 py-1 text-success bg-success/10 rounded-full text-sm"
                                style={{ flex: 1 }}
                            >
                                ফ্রি দেখুন
                            </p>
                        ) : (
                            <svg
                                width="18"
                                height="21"
                                viewBox="0 0 18 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M9 13.5V15.5M3 19.5H15C16.1046 19.5 17 18.6046 17 17.5V11.5C17 10.3954 16.1046 9.5 15 9.5H3C1.89543 9.5 1 10.3954 1 11.5V17.5C1 18.6046 1.89543 19.5 3 19.5ZM13 9.5V5.5C13 3.29086 11.2091 1.5 9 1.5C6.79086 1.5 5 3.29086 5 5.5V9.5H13Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        )}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition-transform duration-500 ease-in-out transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                        >
                            <path d="M8 12L2 6H14L8 12Z" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>
            <div
                className={`transition-all duration-500 ease-in-out px-6 overflow-hidden ${isOpen
                    ? 'max-h-[2000px] opacity-100 transform translate-y-0'
                    : 'max-h-0 opacity-0 transform -translate-y-4'
                    }`}
            >
                <div className="pt-6"></div>
                {chapter.modules && chapter.modules.length > 0 ? (
                    chapter.modules.map((module: any) =>
                        module?.data?.category === 'VIDEO' ? (
                            <VideoItem
                                key={module.id}
                                module={module}
                                isFreeChapter={chapter.is_free}
                                isExpanded={expandedVideoId === module.id}
                                onToggle={handleVideoToggle}
                                courseId={courseId}
                            />
                        ) : module?.data?.category === 'PDF' ? (
                            <PdfItem
                                key={module.id}
                                module={module}
                                isFreeChapter={chapter.is_free}
                                isExpanded={expandedPdfId === module.id}
                                onToggle={handlePdfToggle}
                                courseId={courseId}
                            />
                        ) : (
                            <div className="flex gap-4 items-center mb-4 p-3" key={module.id}>
                                {module?.data?.category === 'ASSIGNMENT' && (
                                    <svg
                                        width="20"
                                        height="21"
                                        viewBox="0 0 20 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
                                            fill={chapter.is_free ? 'oklch(0.718 0.147 159.2)' : 'currentColor'}
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M7.85422 5.5H12.0442C13.5892 5.5 14.4492 6.39 14.4492 7.915V13.08C14.4492 14.63 13.5892 15.5 12.0452 15.5H7.85422C6.33422 15.5 5.44922 14.63 5.44922 13.08V7.915C5.44922 6.39 6.33422 5.5 7.85422 5.5ZM7.98922 7.83V7.825H9.48322C9.58732 7.825 9.68715 7.86635 9.76076 7.93996C9.83437 8.01357 9.87572 8.1134 9.87572 8.2175C9.87572 8.3216 9.83437 8.42143 9.76076 8.49504C9.68715 8.56865 9.58732 8.61 9.48322 8.61H7.98922C7.88578 8.61 7.78659 8.56891 7.71345 8.49577C7.64031 8.42263 7.59922 8.32343 7.59922 8.22C7.59922 8.11657 7.64031 8.01737 7.71345 7.94423C7.78659 7.87109 7.88578 7.83 7.98922 7.83ZM7.98922 10.87H11.9092C12.0127 10.87 12.1119 10.8289 12.185 10.7558C12.2581 10.6826 12.2992 10.5834 12.2992 10.48C12.2992 10.3766 12.2581 10.2774 12.185 10.2042C12.1119 10.1311 12.0127 10.09 11.9092 10.09H7.98922C7.88578 10.09 7.78659 10.1311 7.71345 10.2042C7.64031 10.2774 7.59922 10.3766 7.59922 10.48C7.59922 10.5834 7.64031 10.6826 7.71345 10.7558C7.78659 10.8289 7.88578 10.87 7.98922 10.87ZM7.98922 13.155H11.9092C12.1092 13.135 12.2592 12.965 12.2592 12.765C12.2605 12.6674 12.2254 12.5728 12.1606 12.4998C12.0959 12.4267 12.0063 12.3804 11.9092 12.37H7.98922C7.91552 12.3629 7.84131 12.3766 7.77497 12.4095C7.70864 12.4423 7.65281 12.4931 7.61381 12.556C7.5748 12.619 7.55417 12.6915 7.55424 12.7656C7.55431 12.8396 7.57509 12.9121 7.61422 12.975C7.69422 13.1 7.83922 13.175 7.98922 13.155Z"
                                            fill="white"
                                        />
                                    </svg>
                                )}
                                {module?.data?.category === 'QUIZ' && (
                                    <svg
                                        width="20"
                                        height="21"
                                        viewBox="0 0 20 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
                                            fill={chapter.is_free ? 'oklch(0.718 0.147 159.2)' : 'currentColor'}
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M7.85422 5.5H12.0442C13.5892 5.5 14.4492 6.39 14.4492 7.915V13.08C14.4492 14.63 13.5892 15.5 12.0452 15.5H7.85422C6.33422 15.5 5.44922 14.63 5.44922 13.08V7.915C5.44922 6.39 6.33422 5.5 7.85422 5.5ZM7.98922 7.83V7.825H9.48322C9.58732 7.825 9.68715 7.86635 9.76076 7.93996C9.83437 8.01357 9.87572 8.1134 9.87572 8.2175C9.87572 8.3216 9.83437 8.42143 9.76076 8.49504C9.68715 8.56865 9.58732 8.61 9.48322 8.61H7.98922C7.88578 8.61 7.78659 8.56891 7.71345 8.49577C7.64031 8.42263 7.59922 8.32343 7.59922 8.22C7.59922 8.11657 7.64031 8.01737 7.71345 7.94423C7.78659 7.87109 7.88578 7.83 7.98922 7.83ZM7.98922 10.87H11.9092C12.0127 10.87 12.1119 10.8289 12.185 10.7558C12.2581 10.6826 12.2992 10.5834 12.2992 10.48C12.2992 10.3766 12.2581 10.2774 12.185 10.2042C12.1119 10.1311 12.0127 10.09 11.9092 10.09H7.98922C7.88578 10.09 7.78659 10.1311 7.71345 10.2042C7.64031 10.2774 7.59922 10.3766 7.59922 10.48C7.59922 10.5834 7.64031 10.6826 7.71345 10.7558C7.78659 10.8289 7.88578 10.87 7.98922 10.87ZM7.98922 13.155H11.9092C12.1092 13.135 12.2592 12.965 12.2592 12.765C12.2605 12.6674 12.2254 12.5728 12.1606 12.4998C12.0959 12.4267 12.0063 12.3804 11.9092 12.37H7.98922C7.91552 12.3629 7.84131 12.3766 7.77497 12.4095C7.70864 12.4423 7.65281 12.4931 7.61381 12.556C7.5748 12.619 7.55417 12.6915 7.55424 12.7656C7.55431 12.8396 7.57509 12.9121 7.61422 12.975C7.69422 13.1 7.83922 13.175 7.98922 13.155Z"
                                            fill="white"
                                        />
                                    </svg>
                                )}
                                {module?.data?.category === 'CODE' && (
                                    <svg
                                        width="20"
                                        height="21"
                                        viewBox="0 0 20 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M10 20.5C15.5228 20.5 20 16.0228 20 10.5C20 4.97715 15.5228 0.5 10 0.5C4.47715 0.5 0 4.97715 0 10.5C0 16.0228 4.47715 20.5 10 20.5Z"
                                            fill={chapter.is_free ? 'oklch(0.718 0.147 159.2)' : 'currentColor'}
                                        />
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M7.85422 5.5H12.0442C13.5892 5.5 14.4492 6.39 14.4492 7.915V13.08C14.4492 14.63 13.5892 15.5 12.0452 15.5H7.85422C6.33422 15.5 5.44922 14.63 5.44922 13.08V7.915C5.44922 6.39 6.33422 5.5 7.85422 5.5ZM7.98922 7.83V7.825H9.48322C9.58732 7.825 9.68715 7.86635 9.76076 7.93996C9.83437 8.01357 9.87572 8.1134 9.87572 8.2175C9.87572 8.3216 9.83437 8.42143 9.76076 8.49504C9.68715 8.56865 9.58732 8.61 9.48322 8.61H7.98922C7.88578 8.61 7.78659 8.56891 7.71345 8.49577C7.64031 8.42263 7.59922 8.32343 7.59922 8.22C7.59922 8.11657 7.64031 8.01737 7.71345 7.94423C7.78659 7.87109 7.88578 7.83 7.98922 7.83ZM7.98922 10.87H11.9092C12.0127 10.87 12.1119 10.8289 12.185 10.7558C12.2581 10.6826 12.2992 10.5834 12.2992 10.48C12.2992 10.3766 12.2581 10.2774 12.185 10.2042C12.1119 10.1311 12.0127 10.09 11.9092 10.09H7.98922C7.88578 10.09 7.78659 10.1311 7.71345 10.2042C7.64031 10.2774 7.59922 10.3766 7.59922 10.48C7.59922 10.5834 7.64031 10.6826 7.71345 10.7558C7.78659 10.8289 7.88578 10.87 7.98922 10.87ZM7.98922 13.155H11.9092C12.1092 13.135 12.2592 12.965 12.2592 12.765C12.2605 12.6674 12.2254 12.5728 12.1606 12.4998C12.0959 12.4267 12.0063 12.3804 11.9092 12.37H7.98922C7.91552 12.3629 7.84131 12.3766 7.77497 12.4095C7.70864 12.4423 7.65281 12.4931 7.61381 12.556C7.5748 12.619 7.55417 12.6915 7.55424 12.7656C7.55431 12.8396 7.57509 12.9121 7.61422 12.975C7.69422 13.1 7.83922 13.175 7.98922 13.155Z"
                                            fill="white"
                                        />
                                    </svg>
                                )}
                                <p className="text-foreground/80 text-base">
                                    {module?.data?.category === 'ASSIGNMENT' && 'Assignment: '}
                                    {module?.data?.category === 'CODE' && 'Code: '}
                                    {module?.data?.category === 'QUIZ' && 'Quiz: '}
                                    {module.title}
                                </p>
                            </div>
                        )
                    )
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground text-lg">
                            মডিউল শীঘ্রই আপডেট করা হবে
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
