import { useState, useMemo } from 'react';
import { EnrolledCourse } from './types';
import { getMostRecentlyViewedCourse } from '@/utils/courseViewTracker';

export function useDashboardFilters(courses: EnrolledCourse[], allIndividualCourses: EnrolledCourse[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Ongoing' | 'Completed' | 'Not Started'>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'Recent' | 'Progress' | 'Alphabetical'>('Recent');

  // Get available bundles for the filter dropdown
  const availableBundles = useMemo(() => {
    return courses.filter(c => c.isBundle);
  }, [courses]);

  // Filter and Sort Logic
  const filteredCourses = useMemo(() => {
    let result: EnrolledCourse[] = [];

    // 1. Handle Type Filtering
    if (filterType === 'All') {
      result = [...courses];
    } else if (filterType === 'Individual') {
      result = courses.filter(c => !c.isBundle);
    } else {
      // filterType is a specific bundle name - show only that bundle
      result = courses.filter(c => {
        const matches = c.isBundle && c.title === filterType;
        return matches;
      });
    }

    // 2. Search
    if (searchTerm) {
      result = result.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // 3. Filter by Status
    if (filterStatus !== 'All') {
      result = result.filter(c => c.status === filterStatus);
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === 'Alphabetical') return a.title.localeCompare(b.title);
      if (sortBy === 'Progress') return b.progress - a.progress;
      return new Date(b.lastAccessed || 0).getTime() - new Date(a.lastAccessed || 0).getTime();
    });

    return result;
  }, [courses, searchTerm, filterStatus, filterType, sortBy]);

  // Find most recent course for banner using localStorage tracking
  // IMPORTANT: Only show individual courses, never bundles (bundles can't be accessed via course dashboard)
  // This includes courses from bundles and standalone individual courses
  // Note: Only the most recent course has progress data loaded for performance
  const mostRecentCourse = useMemo(() => {
    if (allIndividualCourses.length === 0) return null;
    
    // Filter to only courses that are not completed and not loading
    // Show courses with any progress (0% to 99%)
    const coursesInProgress = allIndividualCourses.filter(
      c => c.progress < 100 && !c.isLoading
    );
    
    if (coursesInProgress.length === 0) return null;
    
    // Try to get the most recently viewed course from localStorage
    const recentlyViewed = getMostRecentlyViewedCourse(coursesInProgress);
    
    if (recentlyViewed) {
      return recentlyViewed;
    }
    
    // Fallback: Use the course with the most recent lastAccessed date
    const fallback = [...coursesInProgress].sort((a, b) =>
      new Date(b.lastAccessed || 0).getTime() - new Date(a.lastAccessed || 0).getTime()
    )[0];
    
    return fallback;
  }, [allIndividualCourses]);

  // Calculate simple stats that don't require progress calculation
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const totalBundles = courses.filter(c => c.isBundle).length;
    const totalIndividualCourses = courses.filter(c => !c.isBundle).length;

    return {
      totalCourses,
      totalBundles,
      totalIndividualCourses
    };
  }, [courses]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterType,
    setFilterType,
    sortBy,
    setSortBy,
    availableBundles,
    filteredCourses,
    mostRecentCourse,
    stats
  };
}
