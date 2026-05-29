import { BsChevronRight } from 'react-icons/bs';
import { Instructor } from '@/features/course-details/_lib/types';

interface InstructorTabProps {
    instructors?: Instructor[];
}

export default function InstructorTab({ instructors }: InstructorTabProps) {
    return (
        <div className="py-12 relative">
            <svg
                viewBox="0 0 904 1160"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -left-[200px] -top-[200px] h-full w-full"
                style={{ zIndex: '-1' }}
            >
                <g filter="url(#filter0_f_261_7930)">
                    <ellipse
                        cx="268.669"
                        cy="580.032"
                        rx="136.757"
                        ry="76.9931"
                        transform="rotate(-10.6934 268.669 580.032)"
                        fill="oklch(0.718 0.147 159.2)"
                    />
                </g>
                <defs>
                    <filter
                        id="filter0_f_261_7930"
                        x="-366.482"
                        y="0.212158"
                        width="1270.3"
                        height="1159.64"
                        filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB"
                    >
                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                        <feBlend
                            mode="normal"
                            in="SourceGraphic"
                            in2="BackgroundImageFix"
                            result="shape"
                        />
                        <feGaussianBlur
                            stdDeviation="250"
                            result="effect1_foregroundBlur_261_7930"
                        />
                    </filter>
                </defs>
            </svg>

            <h2 className="text-2xl lg:text-4xl font-semibold pb-12 relative z-10">
                কোর্স ইন্সট্রাক্টর
            </h2>
            {instructors && instructors.length > 0 ? (
                instructors.map((instructor) => (
                    <div
                        className="my-8 rounded-2xl cursor-pointer border border-primary/10 hover:border-primary/30 duration-150 ease-in-out z-10 overflow-hidden bg-primary/5 dark:bg-primary/10"
                        key={instructor.name}
                    >
                        <div className="px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                            <div className="flex-shrink-0">
                                {instructor.imageUploadedLink ? (
                                    <img
                                        src={instructor.imageUploadedLink}
                                        alt={instructor.name}
                                        className="w-52 h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 object-cover rounded-2xl shadow-lg"
                                    />
                                ) : (
                                    <img
                                        src="/Frame 1000004442.png"
                                        alt={instructor.name}
                                        className="w-52 h-64 md:w-60 md:h-80 lg:w-72 lg:h-96 object-cover rounded-2xl shadow-lg"
                                    />
                                )}
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-2xl lg:text-3xl font-semibold text-foreground mb-3">
                                    {instructor.name}
                                </h3>
                                <div className="text-muted-foreground space-y-1">
                                    {instructor.credibility.split('\n').map((line, i) => (
                                        <p key={i} className="text-sm lg:text-base leading-relaxed">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden md:block flex-shrink-0 text-primary self-center">
                                <BsChevronRight size={24} />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">
                        ইন্সট্রাক্টরের তথ্য শীঘ্রই আপডেট করা হবে
                    </p>
                </div>
            )}
        </div>
    );
}
