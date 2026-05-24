import { TabState } from '@/features/course-details/_lib/types';

interface CourseTabsProps {
    activeTab: TabState;
    onTabChange: (tabName: keyof TabState) => void;
}

export default function CourseTabs({ activeTab, onTabChange }: CourseTabsProps) {
    const getTabClass = (isActive: boolean) => {
        return `${
            isActive
                ? '!text-[#F1BA41] border-2 !border-[#F1BA41] bg-gradient-to-r from-[#F1BA41]/10 to-[#F1BA41]/5 font-semibold shadow-lg shadow-[#F1BA41]/20'
                : 'text-muted-foreground border border-transparent hover:!text-[#F1BA41] hover:!border-[#F1BA41]/30 hover:bg-[#F1BA41]/5'
        } px-6 py-3 rounded-full transition-all duration-300 text-sm lg:text-base cursor-pointer backdrop-blur-sm`;
    };

    return (
        <div className="flex flex-wrap items-center gap-3 mt-8 pb-6 border-b border-border/20 dark:border-border/30">
            <button
                onClick={() => onTabChange('studyPlan')}
                className={getTabClass(activeTab.studyPlan)}
            >
                স্টাডি প্ল্যান
            </button>
            <button
                onClick={() => onTabChange('instructor')}
                className={getTabClass(activeTab.instructor)}
            >
                ইন্সট্রাক্টর
            </button>
            <button
                onClick={() => onTabChange('courseComplete')}
                className={getTabClass(activeTab.courseComplete)}
            >
                কোর্স সম্পর্কে বিস্তারিত
            </button>
        </div>
    );
}
