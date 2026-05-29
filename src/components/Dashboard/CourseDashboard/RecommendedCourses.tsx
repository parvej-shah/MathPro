import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Course {
  id: number;
  title: string;
  short_description?: string;
  description?: string;
  price: number | string;
  x_price?: number;
  instructor_list?: {
    instructors?: Array<{ name: string }>;
  };
  chips?: {
    course_thumbnail_link?: string; // Old field (backward compatibility)
    thumbnails?: {
      course_thumbnail_link_16_9?: string;
      trailer_video_thumb_16_9?: string;
      facebook_community_thumb_16_9?: string;
    };
  };
  thumbnail?: string;
  instructor?: string;
  rating?: string | number;
  students?: number;
}

interface RecommendedCoursesProps {
  courses: Course[];
  isMockData?: boolean;
}

export const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({
  courses,
  isMockData = false,
}) => {
  return (
    <div className="mt-12 md:mt-16 border-t border-border pt-8 md:pt-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
            Recommended for You
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
            Based on your current progress, here are the next steps for your
            career.
          </p>
        </div>
        <Link
          href="/courses"
          className="text-primary font-semibold hover:underline hidden sm:block text-sm md:text-base whitespace-nowrap"
        >
          Explore All Courses
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {courses.map((course) => {
          if (isMockData) {
            return (
              <div
                key={course.id}
                className="bg-background rounded-xl md:rounded-2xl overflow-hidden shadow-lg border border-border hover:shadow-xl transition-all duration-300 group flex flex-col sm:flex-row h-full"
              >
                <div className="w-full sm:w-2/5 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 md:px-3 rounded-full">
                    {course.rating} ★
                  </div>
                </div>
                <div className="p-4 md:p-6 flex flex-col justify-between w-full">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-heading dark:text-darkHeading mb-2 group-hover:text-purple transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3 md:mb-4">
                      {course.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={`https://ui-avatars.com/api/?name=${course.instructor}&background=random`}
                          alt={course.instructor}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground truncate max-w-[80px] sm:max-w-[100px]">
                        {course.instructor}
                      </span>
                    </div>
                    <div className="text-purple font-bold text-base md:text-lg">
                      {course.price}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          const instructorName =
            course.instructor_list?.instructors?.[0]?.name || "Instructor";
          const coursePrice =
            typeof course.price === "number" ? course.price : 0;
          const courseXPrice = course.x_price || 0;
          const discount =
            courseXPrice > coursePrice
              ? Math.round(((courseXPrice - coursePrice) / courseXPrice) * 100)
              : 0;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.35 }}
            >
            <Link href={`/course-details/${course.id}`}>
              <div className="bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group flex flex-col sm:flex-row h-full cursor-pointer">
                <div className="w-full sm:w-2/5 h-48 sm:h-auto relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent z-10" />
                  <img
                    src={
                      course.chips?.thumbnails?.course_thumbnail_link_16_9 ||
                      course.chips?.course_thumbnail_link ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {discount > 0 && (
                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-destructive text-white text-xs font-bold px-2 py-1 md:px-3 rounded-full">
                      {discount}% OFF
                    </div>
                  )}
                </div>

                <div className="p-4 md:p-6 flex flex-col justify-between w-full">
                  <div>
                    <h3 className="font-bold text-base md:text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3 md:mb-4">
                      {course.short_description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-3 md:pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-muted overflow-hidden flex-shrink-0">
                        <img
                          src={`https://ui-avatars.com/api/?name=${instructorName}&background=random`}
                          alt={instructorName}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground truncate max-w-[80px] sm:max-w-[100px]">
                        {instructorName}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      {discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                          ৳{courseXPrice}
                        </span>
                      )}
                      <div className="text-primary font-bold text-base md:text-lg">
                        ৳{coursePrice}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 md:mt-8 text-center sm:hidden">
        <Link
          href="/courses"
          className="text-primary font-semibold hover:underline text-sm"
        >
          Explore All Courses
        </Link>
      </div>
    </div>
  );
};
