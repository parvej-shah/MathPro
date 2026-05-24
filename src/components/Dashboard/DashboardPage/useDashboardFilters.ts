import { useState, useMemo } from 'react';
import { EnrolledCourse } from './types';
import { getMostRecentlyViewedCourse } from '@/utils/courseViewTracker';

const isDev = process.env.NODE_ENV === 'development';

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
    if (isDev) {
      console.log('🔍 Filter Debug - filterType:', filterType);
      console.log('🔍 Filter Debug - All courses:', courses.map(c => ({ title: c.title, isBundle: c.isBundle })));
    }
    
    let result: EnrolledCourse[] = [];

    // 1. Handle Type Filtering
    if (filterType === 'All') {
      result = [...courses];
    } else if (filterType === 'Individual') {
      result = courses.filter(c => !c.isBundle);
    } else {
      // filterType is a specific bundle name - show only that bundle
      if (isDev) {
        console.log('🔍 Looking for bundle with title:', filterType);
        console.log('🔍 Available bundles:', courses.filter(c => c.isBundle).map(c => ({ title: c.title, id: c.id })));
      }
      
      result = courses.filter(c => {
        const matches = c.isBundle && c.title === filterType;
        if (isDev) console.log(`🔍 Checking course "${c.title}" (isBundle: ${c.isBundle}): ${matches}`);
        return matches;
      });
      if (isDev) console.log('🔍 Filter Debug - Selected bundle result:', result.map(c => c.title));
    }

    if (isDev) console.log('🔍 Filter Debug - After type filter:', result.length, 'courses');

    // 2. Search
    if (searchTerm) {
      result = result.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
      if (isDev) console.log('🔍 Filter Debug - After search filter:', result.length, 'courses');
    }

    // 3. Filter by Status
    if (filterStatus !== 'All') {
      result = result.filter(c => c.status === filterStatus);
      if (isDev) console.log('🔍 Filter Debug - After status filter:', result.length, 'courses');
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === 'Alphabetical') return a.title.localeCompare(b.title);
      if (sortBy === 'Progress') return b.progress - a.progress;
      return new Date(b.lastAccessed || 0).getTime() - new Date(a.lastAccessed || 0).getTime();
    });

    if (isDev) console.log('🔍 Filter Debug - Final result:', result.length, 'courses');
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
