import React from 'react';
import Link from 'next/link';
import { BsBook } from 'react-icons/bs';

interface EmptyStateProps {
  hasFilters: boolean;
}

export default function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-20 bg-background rounded-2xl border border-dashed border-border">
      <BsBook className="text-6xl text-muted-foreground mx-auto mb-6" />
      <h3 className="text-2xl font-bold text-heading dark:text-darkHeading mb-4">
        No courses found
      </h3>
      <p className="text-paragraph dark:text-darkParagraph mb-8 max-w-md mx-auto">
        {hasFilters
          ? "Try adjusting your search or filters."
          : "Start your learning journey today!"}
      </p>
      {!hasFilters && (
        <Link href="/courses">
          <button className="bg-purple text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all">
            Browse Courses
          </button>
        </Link>
      )}
    </div>
  );
}
