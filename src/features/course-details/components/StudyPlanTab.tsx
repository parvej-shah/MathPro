import { Chapter, CourseData } from '@/features/course-details/_lib/types';
import { englishToBanglaNumbers, countModulesAssignmentsVideos } from '@/helpers';
import ChapterAccordion from './ChapterAccordion';
import { useState } from 'react';

interface StudyPlanTabProps {
    chapters: Chapter[];
    courseData: CourseData;
    courseId: string;
}

export default function StudyPlanTab({ chapters, courseData, courseId }: StudyPlanTabProps) {
    const [openChapterItems, setOpenChapterItems] = useState<{ [key: number]: boolean }>({ 0: true });

    const toggleChapterItem = (index: number) => {
        setOpenChapterItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const stats = countModulesAssignmentsVideos(courseData);

    return (
        <div>
            <div className="my-8 flex lg:items-center gap-8 flex-col lg:flex-row">
                <p className="text-2xl lg:text-3xl font-semibold">স্টাডি প্ল্যান</p>
                <div className="flex items-center px-4 py-2 text-lg border border-[#B153E0]/50 bg-[#B153E0]/5 gap-4 rounded flex-wrap">
                    <p>{englishToBanglaNumbers(stats.totalModules)} টি মডিউল</p>
                    <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="0.829956"
                            y="0.5"
                            width="4"
                            height="4"
                            rx="2"
                            fill="#FFA500"
                        />
                    </svg>
                    <p>{englishToBanglaNumbers(stats.totalVideos)} টি ভিডিও</p>
                    <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="0.829956"
                            y="0.5"
                            width="4"
                            height="4"
                            rx="2"
                            fill="#FFA500"
                        />
                    </svg>
                    <p>{englishToBanglaNumbers(stats.totalQuiz)} টি কুইজ</p>
                    <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="0.829956"
                            y="0.5"
                            width="4"
                            height="4"
                            rx="2"
                            fill="#FFA500"
                        />
                    </svg>
                    <p>{englishToBanglaNumbers(stats.totalCodes)} টি কোডিং চ্যালেঞ্জ</p>
                    <svg
                        width="5"
                        height="5"
                        viewBox="0 0 5 5"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect
                            x="0.829956"
                            y="0.5"
                            width="4"
                            height="4"
                            rx="2"
                            fill="#FFA500"
                        />
                    </svg>
                    <p>{englishToBanglaNumbers(stats.totalPDF)} টি পিডিএফ</p>
                </div>
            </div>
            <div>
                {chapters && chapters.length > 0 && chapters.map((chapter, index) => (
                    <ChapterAccordion
                        key={chapter.id}
                        chapter={chapter}
                        index={index}
                        isOpen={!!openChapterItems[index]}
                        onToggle={toggleChapterItem}
                        courseId={courseId}
                    />
                ))}
            </div>
        </div>
    );
}
