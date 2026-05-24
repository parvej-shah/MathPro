interface CourseHeaderProps {
    title: string;
    isPrebookingMode: boolean;
}

export default function CourseHeader({
    title,
    isPrebookingMode,
}: CourseHeaderProps) {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
            <h2 className="text-2xl lg:text-4xl font-semibold">{title}</h2>

            {/* Prebooking Status Badge */}
            {isPrebookingMode && (
                <div className="inline-flex items-center gap-2 bg-[#B2F100]/20 border border-[#B2F100]/60 px-4 py-2 rounded-full">
                    <svg
                        className="w-4 h-4 text-[#B2F100]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm font-semibold">প্রিবুকিং চলছে</span>
                </div>
            )}
        </div>
    );
}
