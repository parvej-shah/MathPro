import React from 'react';
import Link from 'next/link';
import { IndividualCourse } from '../hooks/usePaymentHistory';
import { englishToBanglaNumbers } from '@/helpers';

interface PaymentCoursesProps {
  courses: IndividualCourse[];
}

const PaymentCourses: React.FC<PaymentCoursesProps> = ({ courses }) => {
  const formatCurrency = (amount: number) => {
    return `৳${englishToBanglaNumbers(Math.round(amount))}`;
  };

  const formatInstructorList = (instructorList: IndividualCourse['instructor_list']): string => {
    if (!instructorList) return 'N/A';

    if (instructorList && typeof instructorList === 'object' && !Array.isArray(instructorList) && instructorList.instructors) {
      if (Array.isArray(instructorList.instructors)) {
        const names = instructorList.instructors
          .map((instructor) => instructor.name)
          .filter(Boolean);
        return names.length > 0 ? names.join(', ') : 'N/A';
      }
    }

    if (Array.isArray(instructorList)) {
      return instructorList.length > 0 ? instructorList.join(', ') : 'N/A';
    }

    if (typeof instructorList === 'string') {
      return instructorList.trim() || 'N/A';
    }

    return 'N/A';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="bg-linear-to-r from-primary to-primary/85 px-4 py-5 sm:px-6 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-1">ইন্ডিভিজুয়াল কোর্স</h2>
        <p className="text-sm sm:text-base text-primary-foreground/85 break-words">
          {englishToBanglaNumbers(courses.length)} টি কোর্স আলাদাভাবে কেনা হয়েছে
        </p>
      </div>

      <div className="p-4 sm:p-6">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground mb-2">কোনো ইন্ডিভিজুয়াল কোর্স নেই</h3>
            <p className="text-muted-foreground">তুমি এখনো আলাদাভাবে কোনো কোর্স কেনো নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="border border-border rounded-xl p-4 sm:p-6 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 break-words">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3 break-words">
                      {course.short_description}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-lg sm:text-xl font-bold text-primary">
                      {formatCurrency(course.paid_amount)}
                    </div>
                    {course.original_price !== course.paid_amount && (
                      <div className="text-sm text-destructive line-through">
                        {formatCurrency(course.original_price)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-4 text-sm">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-muted-foreground">এনরোলমেন্টের তারিখ:</span>
                    <span className="font-medium text-foreground break-words">
                      {formatDate(course.enrollment_date)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-muted-foreground">ট্রানজেকশন আইডি:</span>
                    <span className="font-mono text-foreground text-xs break-all">
                      {course.transaction_id}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                    <span className="text-muted-foreground">শিক্ষক:</span>
                    <span className="font-medium text-foreground break-words">
                      {formatInstructorList(course.instructor_list)}
                    </span>
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-1 gap-2 pt-4 border-t border-border md:flex md:flex-wrap md:items-center md:justify-between">
                  <Link
                    href={`/courses/${course.course_url || course.course_id}`}
                    className="inline-flex items-center justify-center w-full md:w-auto min-h-11 bg-info hover:bg-info/90 text-white text-sm font-medium py-3 px-4 rounded-lg transition duration-200"
                  >
                    বিস্তারিত দেখো
                  </Link>
                  <div className="grid grid-cols-1 gap-2 md:flex">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(course.transaction_id);
                      }}
                      className="inline-flex items-center justify-center w-full md:w-auto min-h-11 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium py-3 px-3 rounded-lg border border-border transition duration-200"
                    >
                      আইডি কপি করো
                    </button>
                    <Link
                      href={`/dashboard/${course.course_id}`}
                      className="inline-flex items-center justify-center w-full md:w-auto min-h-11 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-3 px-3 rounded-lg transition duration-200"
                    >
                      শেখা চালিয়ে যাও
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCourses;
