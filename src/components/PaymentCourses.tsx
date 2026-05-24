import React from 'react';
import { IndividualCourse } from '../hooks/usePaymentHistory';
import { useLmsPreference } from '@/hooks/useLmsPreference';
import { isLmsPreferenceCourse, getCpLmsUrlForCourse } from '@/constants/lmsPreference';

interface PaymentCoursesProps {
  courses: IndividualCourse[];
}

const PaymentCourses: React.FC<PaymentCoursesProps> = ({ courses }) => {
  const { lmsPreference } = useLmsPreference();
  const getCourseUrl = (courseId: number) =>
    lmsPreference === 'locked' && isLmsPreferenceCourse(String(courseId))
      ? getCpLmsUrlForCourse(String(courseId))
      : `/course/${courseId}`;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatInstructorList = (instructorList: any): string => {
    if (!instructorList) return 'N/A';
    
    // Debug log to understand the structure
    if (process.env.NODE_ENV === 'development') {
      console.log('Instructor list structure:', instructorList, typeof instructorList);
    }
    
    // Handle object structure with instructors array
    if (instructorList && typeof instructorList === 'object' && instructorList.instructors) {
      if (Array.isArray(instructorList.instructors)) {
        const names = instructorList.instructors
          .map((instructor: any) => instructor.name || instructor)
          .filter(Boolean);
        return names.length > 0 ? names.join(', ') : 'N/A';
      }
    }
    
    // Handle direct array
    if (Array.isArray(instructorList)) {
      return instructorList.length > 0 ? instructorList.join(', ') : 'N/A';
    }
    
    // Handle string
    if (typeof instructorList === 'string') {
      return instructorList.trim() || 'N/A';
    }
    
    return 'N/A';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-background rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-2xl font-bold text-white mb-1">Individual Course Purchases</h2>
        <p className="text-info-foreground">
          {courses.length} course{courses.length !== 1 ? 's' : ''} purchased individually
        </p>
      </div>

      <div className="p-6">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No Individual Courses</h3>
            <p className="text-muted-foreground">You haven&apos;t purchased any courses individually.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-3">
                      {course.short_description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-success">
                      {formatCurrency(course.paid_amount)}
                    </div>
                    {course.original_price !== course.paid_amount && (
                      <div className="text-sm text-destructive line-through">
                        {formatCurrency(course.original_price)}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Enrollment Date:</span>
                    <span className="font-medium text-foreground">
                      {formatDate(course.enrollment_date)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-foreground text-xs">
                      {course.transaction_id}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Instructors:</span>
                    <span className="font-medium text-foreground">
                      {formatInstructorList(course.instructor_list)}
                    </span>
                  </div>
                </div>

                {/* Course URL */}
                <div className="mb-4">
                  <span className="text-muted-foreground text-sm">Course URL:</span>
                  <p className="font-mono text-info text-xs bg-info/10 p-2 rounded mt-1">
                    /course/{course.course_url}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <a
                    href={getCourseUrl(course.course_id)}
                    className="bg-info hover:bg-info/90 text-white text-sm font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    View Course
                  </a>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(course.transaction_id);
                        // You could add a toast notification here
                      }}
                      className="bg-muted-foreground hover:bg-muted-foreground/90 text-white text-sm font-medium py-2 px-3 rounded-lg transition duration-200"
                    >
                      Copy ID
                    </button>
                    <a
                      href={getCourseUrl(course.course_id)}
                      className="bg-success hover:bg-success/90 text-white text-sm font-medium py-2 px-3 rounded-lg transition duration-200"
                    >
                      Start Learning
                    </a>
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
