import React from 'react';
import { BsSearch } from 'react-icons/bs';
import { EnrolledCourse } from './types';

interface SearchAndFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  filterStatus: 'All' | 'Ongoing' | 'Completed' | 'Not Started';
  setFilterStatus: (value: 'All' | 'Ongoing' | 'Completed' | 'Not Started') => void;
  sortBy: 'Recent' | 'Progress' | 'Alphabetical';
  setSortBy: (value: 'Recent' | 'Progress' | 'Alphabetical') => void;
  availableBundles: EnrolledCourse[];
}

export default function SearchAndFilters({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  availableBundles,
}: SearchAndFiltersProps) {
  return (
    <div className="flex flex-col gap-3 mb-8 bg-card p-3 sm:p-4 rounded-xl shadow-sm border border-border">
      {/* Search */}
      <div className="relative w-full">
        <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search your courses..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted text-foreground border border-input focus:ring-2 focus:ring-ring text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters & Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 w-full">
        <select
          className="bg-muted border border-input rounded-lg py-2.5 px-3 text-foreground focus:ring-2 focus:ring-ring cursor-pointer text-sm w-full"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Individual">Individual Courses</option>
          {availableBundles.length > 0 && (
            <optgroup label="My Bundles">
              {availableBundles.map(bundle => (
                <option key={bundle.id} value={bundle.title}>
                  {bundle.title}
                </option>
              ))}
            </optgroup>
          )}
        </select>

        <select
          className="bg-muted border border-input rounded-lg py-2.5 px-3 text-foreground focus:ring-2 focus:ring-ring cursor-pointer text-sm w-full"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
        >
          <option value="All">All Status</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
          <option value="Not Started">Not Started</option>
        </select>

        <select
          className="bg-muted border border-input rounded-lg py-2.5 px-3 text-foreground focus:ring-2 focus:ring-ring cursor-pointer text-sm w-full"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="Recent">Recently Accessed</option>
          <option value="Progress">Progress (High to Low)</option>
          <option value="Alphabetical">Alphabetical (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
