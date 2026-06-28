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
    <div className="flex flex-col gap-3 mb-8 bg-card p-4 sm:p-5 rounded-2xl shadow-sm border border-border">
      {/* Search */}
      <div className="relative w-full">
        <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="তোমার কোর্স খুঁজো..."
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
          <option value="All">সব ধরন</option>
          <option value="Individual">একক কোর্স</option>
          {availableBundles.length > 0 && (
            <optgroup label="আমার Combo">
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
          <option value="All">সব অবস্থা</option>
          <option value="Ongoing">চলছে</option>
          <option value="Completed">শেষ করেছো</option>
          <option value="Not Started">শুরু করোনি</option>
        </select>

        <select
          className="bg-muted border border-input rounded-lg py-2.5 px-3 text-foreground focus:ring-2 focus:ring-ring cursor-pointer text-sm w-full"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="Recent">সম্প্রতি দেখা</option>
          <option value="Progress">অগ্রগতি (বেশি থেকে কম)</option>
          <option value="Alphabetical">বর্ণক্রম অনুযায়ী</option>
        </select>
      </div>
    </div>
  );
}
