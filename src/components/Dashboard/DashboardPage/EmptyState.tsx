import React from 'react';
import Link from 'next/link';
import { BsBook } from 'react-icons/bs';

interface EmptyStateProps {
  hasFilters: boolean;
}

export default function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-20 px-6 bg-card rounded-2xl border border-dashed border-border">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
        <BsBook className="text-3xl text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-bold text-heading mb-3">
        কোনো কোর্স পাওয়া যায়নি
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {hasFilters
          ? "তোমার অনুসন্ধান বা ফিল্টার পরিবর্তন করে দেখো।"
          : "আজই তোমার শেখার যাত্রা শুরু করো!"}
      </p>
      {!hasFilters && (
        <Link href="/courses">
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5">
            কোর্স দেখো
          </button>
        </Link>
      )}
    </div>
  );
}
