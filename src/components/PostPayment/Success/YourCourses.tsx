import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaPlayCircle, FaBookOpen } from "react-icons/fa";
import { Course } from "./types";

interface YourCoursesProps {
  courses: Course[];
}

const YourCourses: React.FC<YourCoursesProps> = ({ courses }) => {
  if (!courses || courses.length === 0) return null;

  return (
    <div className="animate-slideUp stagger-4">
      <h2 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-12">
        তোমার কোর্সসমূহ
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link
            href={`/dashboard/${course.id}`}
            key={course.id}
            className="group block h-full"
          >
            <div className="bg-background rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
              {/* Thumbnail */}
              <div className="relative h-48 bg-muted overflow-hidden">
                {course.chips?.thumbnails?.course_thumbnail_link_16_9 ||
                course.chips?.course_thumbnail_link ? (
                  <Image
                    src={
                      (course.chips?.thumbnails?.course_thumbnail_link_16_9 ||
                        course.chips?.course_thumbnail_link) as string
                    }
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <FaPlayCircle className="text-4xl text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col grow">
                <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2 grow">
                  {course.short_description || "No description available"}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-4 mt-auto">
                  <div className="flex items-center gap-2">
                    <FaBookOpen className="text-primary" />
                    <span>
                      {course.chips?.sections?.chapter?.value || "0"} Chapters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaPlayCircle className="text-teal" />
                    <span>
                      {course.chips?.sections?.video?.value || "0"} Videos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default YourCourses;
