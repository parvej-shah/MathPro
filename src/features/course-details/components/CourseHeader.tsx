interface CourseHeaderProps {
    title: string;
    isPrebookingMode: boolean;
    enrolled?: number;
}

export default function CourseHeader({
    title,
    isPrebookingMode,
    enrolled,
}: CourseHeaderProps) {
    return (
        <div className="mb-6">
            {/* Top meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {isPrebookingMode ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warning bg-warning/15 border border-warning/40 px-3 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        প্রিবুকিং চলছে
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success bg-success/15 border border-success/40 px-3 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse inline-block" />
                        ভর্তি চলছে
                    </span>
                )}
                {enrolled && enrolled > 0 && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 border border-border px-3 py-1 rounded-full">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {enrolled.toLocaleString()}+ জন শিক্ষার্থী
                    </span>
                )}
            </div>

            {/* Main title */}
            <h1 className="text-3xl lg:text-[2.6rem] xl:text-5xl font-bold leading-tight tracking-tight text-foreground">
                {title}
            </h1>
        </div>
    );
}
