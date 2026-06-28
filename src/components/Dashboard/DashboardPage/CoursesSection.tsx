import React from 'react';
import { BsBook, BsGift, BsArrowRight } from 'react-icons/bs';
import { motion } from "framer-motion";
import CourseCard from '@/components/Dashboard/CourseCard';
import { containerVariants, itemVariants } from '@/components/Dashboard/motion';
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
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BsBook className="text-teal" /> একক কোর্স
            </h2>
          )}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {filteredCourses.filter(c => !c.isBundle).map((course) => (
              <motion.div key={course.id} variants={itemVariants}>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Bundles Section */}
      {hasBundles && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BsGift className="text-primary" />
              {expandedBundleId ? 'Combo-র কোর্সসমূহ' : 'আমার Combo'}
            </h2>
            {expandedBundleId && (
              <button
                onClick={onBackToBundles}
                className="text-sm font-semibold text-primary hover:opacity-80 flex items-center gap-1"
              >
                <BsArrowRight className="rotate-180" /> Combo-তে ফিরে যাও
              </button>
            )}
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {expandedBundleId ? (
              // Show expanded bundle courses
              expandedBundleCourses.map((course) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <CourseCard course={course} />
                </motion.div>
              ))
            ) : (
              // Show list of bundles
              filteredCourses.filter(c => c.isBundle).map((course) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <CourseCard
                    course={course}
                    onShowAll={() => onShowAll(course.id.toString())}
                  />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
