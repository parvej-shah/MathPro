import React from 'react';
import { TabState } from '@/features/course-details/_lib/types';

interface CourseTabsProps {
    activeTab: TabState;
    onTabChange: (tabName: keyof TabState) => void;
}

const TABS: { key: keyof TabState; label: string; icon: React.ReactNode }[] = [
    {
        key: 'studyPlan',
        label: 'স্টাডি প্ল্যান',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        key: 'instructor',
        label: 'ইন্সট্রাক্টর',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
    },
    {
        key: 'courseComplete',
        label: 'কোর্স সম্পর্কে',
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    },
];

export default function CourseTabs({ activeTab, onTabChange }: CourseTabsProps) {
    return (
        <div className="sticky top-17 z-30 -mx-2 px-2 mt-8 bg-background/90 backdrop-blur-md">
            <div className="flex items-center gap-1">
                {TABS.map(({ key, label, icon }) => {
                    const isActive = activeTab[key];
                    return (
                        <button
                            key={key}
                            onClick={() => onTabChange(key)}
                            className={`relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium cursor-pointer whitespace-nowrap shrink-0 transition-all duration-200 rounded-t-lg group
                                ${isActive
                                    ? 'text-primary bg-primary/8 border-b-2 border-primary'
                                    : 'text-muted-foreground border-b-2 border-transparent hover:text-foreground hover:bg-muted/40'
                                }`}
                        >
                            <span className={`transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                {icon}
                            </span>
                            {label}
                            {isActive && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary translate-y-1/2" />
                            )}
                        </button>
                    );
                })}
            </div>
            <div className="h-px bg-border/40" />
        </div>
    );
}
