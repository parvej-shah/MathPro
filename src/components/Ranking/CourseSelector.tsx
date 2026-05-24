import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Course {
  id: number;
  title: string;
}

interface CourseSelectorProps {
  courses: Course[];
  selectedCourse: Course | undefined;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (courseId: number) => void;
  loading?: boolean;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({
  courses,
  selectedCourse,
  isOpen,
  onToggle,
  onSelect,
  loading = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 max-w-2xl mx-auto"
    >
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className="w-full bg-gray-800/40 dark:bg-gray-800/40 backdrop-blur-lg border border-gray-200/20 dark:border-gray-700/50 rounded-xl px-6 py-4 flex items-center justify-between hover:bg-gray-800/60 transition-all duration-200 shadow-lg"
        >
          <div className="flex items-center gap-3 flex-1 text-left">
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="bg-purple/20 p-2 rounded-lg"
            >
              <svg className="w-5 h-5 text-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </motion.div>
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xs text-paragraph dark:text-darkParagraph/60 font-medium mb-1"
              >
                Selected Course
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-heading dark:text-darkHeading font-semibold truncate"
              >
                {selectedCourse?.title || 'Select a course'}
              </motion.div>
            </div>
          </div>
          <motion.svg 
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5 text-purple ml-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-gray-800/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/50 rounded-xl shadow-2xl max-h-96 overflow-y-auto customScrollbar"
            >
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 py-8 text-center"
                >
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple mx-auto"></div>
                  <p className="text-darkParagraph mt-2">Loading courses...</p>
                </motion.div>
              ) : courses.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-6 py-8 text-center text-darkParagraph"
                >
                  <svg className="w-12 h-12 text-foreground mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  No courses available
                </motion.div>
              ) : (
                courses.map((course, index) => (
                  <motion.button
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(107, 114, 128, 0.3)' }}
                    onClick={() => onSelect(course.id)}
                    className={`w-full px-6 py-4 text-left transition-all duration-150 border-b border-gray-700/30 last:border-b-0 ${
                      selectedCourse?.id === course.id ? 'bg-purple/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className={`font-semibold transition-colors ${
                          selectedCourse?.id === course.id ? 'text-purple' : 'text-heading dark:text-darkHeading'
                        }`}>
                          {course.title}
                        </div>
                      </div>
                      {selectedCourse?.id === course.id && (
                        <motion.svg 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="w-5 h-5 text-purple" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </div>
                  </motion.button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CourseSelector;