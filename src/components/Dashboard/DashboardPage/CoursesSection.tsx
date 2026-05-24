import React from 'react';
import { BsBook, BsGift, BsArrowRight } from 'react-icons/bs';
import CourseCard from '@/components/Dashboard/CourseCard';
import { EnrolledCourse } from './types';

interface CoursesSectionProps {
  filteredCourses: EnrolledCourse[];
  expandedBundleId: string | null;
  expandedBundleCourses: EnrolledCourse[];
  onShowAll: (bundleId: string) => void;
  onBackToBundles: () => void;
}

export default function CoursesSection({
  filteredCourses,
  expandedBundleId,
  expandedBundleCourses,
  onShowAll,
  onBackToBundles,
}: CoursesSectionProps) {
  const hasIndividualCourses = filteredCourses.some(c => !c.isBundle);
  const hasBundles = filteredCourses.some(c => c.isBundle);

  return (
    <div className="space-y-12">
      {/* Individual Courses Section */}
      {hasIndividualCourses && (
        <div>
          {hasBundles && (
            <h2 className="text-2xl font-bold text-heading dark:text-darkHeading mb-6 flex items-center gap-2">
              <BsBook className="text-teal" /> Individual Courses
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.filter(c => !c.isBundle).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Bundles Section */}
      {hasBundles && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-heading dark:text-darkHeading flex items-center gap-2">
              <BsGift className="text-purple" />
              {expandedBundleId ? 'Bundle Contents' : 'My Bundles'}
            </h2>
            {expandedBundleId && (
              <button
                onClick={onBackToBundles}
                className="text-sm font-semibold text-purple hover:text-purple-700 flex items-center gap-1"
              >
                <BsArrowRight className="rotate-180" /> Back to Bundles
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {expandedBundleId ? (
              // Show expanded bundle courses
              expandedBundleCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              // Show list of bundles
              filteredCourses.filter(c => c.isBundle).map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onShowAll={() => onShowAll(course.id.toString())}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
