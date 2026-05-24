import { useContext } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { Instructor } from '@/features/course-details/_lib/types';
import { UserContext } from '@/Contexts/UserContext';

interface InstructorTabProps {
    instructors?: Instructor[];
}

export default function InstructorTab({ instructors }: InstructorTabProps) {
    const [user] = useContext<any>(UserContext);

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
                        fill="#B153E0"
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
                        className="my-8 rounded-2xl cursor-pointer border border-purple/10 hover:border-purple/30 duration-150 ease-in-out z-10 overflow-hidden"
                        key={instructor.name}
                        style={{
                            background: user.darkMode
                                ? 'linear-gradient(90deg, rgba(88, 56, 110, 0.4) 0%, rgba(45, 28, 55, 0.3) 100%)'
                                : 'linear-gradient(90deg, rgba(177, 83, 224, 0.15) 0%, rgba(177, 83, 224, 0.05) 100%)',
                        }}
                    >
                        <div className="px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                            {/* Image Container - Rounded Rectangle */}
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

                            {/* Text Content */}
                            <div className="flex-grow text-center md:text-left">
                                <h3 className="text-2xl lg:text-3xl font-semibold text-heading dark:text-white mb-3">
                                    {instructor.name}
                                </h3>
                                <div className="text-paragraph dark:text-foreground space-y-1">
                                    {instructor.credibility.split('\n').map((line, i) => (
                                        <p key={i} className="text-sm lg:text-base leading-relaxed">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {/* Arrow Icon */}
                            <div className="hidden md:block flex-shrink-0 text-purple self-center">
                                <BsChevronRight size={24} />
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8">
                    <p className="text-paragraph dark:text-darkParagraph">
                        ইন্সট্রাক্টরের তথ্য শীঘ্রই আপডেট করা হবে
                    </p>
                </div>
            )}
        </div>
    );
}
