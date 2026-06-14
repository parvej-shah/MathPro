import { Chapter } from '@/features/course-details/_lib/types';
import ChapterAccordion from './ChapterAccordion';
import { useState } from 'react';

interface StudyPlanTabProps {
    chapters: Chapter[];
    courseId: string;
}

export default function StudyPlanTab({ chapters, courseId }: StudyPlanTabProps) {
    const [openChapterItems, setOpenChapterItems] = useState<{ [key: number]: boolean }>({ 0: true });
    const hasChapters = Array.isArray(chapters) && chapters.length > 0;

    const toggleChapterItem = (index: number) => {
        setOpenChapterItems((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <section className="py-12">
            <div className="mb-6 flex flex-col gap-2">
                <p className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                    সিলেবাস
                </p>
                <p className="text-sm text-muted-foreground">
                    কোর্সে কী কী অধ্যায় ও কনটেন্ট থাকবে, এখানে দেখে নাও।
                </p>
            </div>

            {hasChapters ? (
                <div>
                {chapters.map((chapter, index) => (
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
            ) : (
                <div className="rounded-2xl border border-border/60 bg-card/70 px-4 py-8 text-center">
                    <p className="text-muted-foreground">
                        সিলেবাসের তথ্য শীঘ্রই আপডেট করা হবে
                    </p>
                </div>
            )}
        </section>
    );
}
