import React from 'react';
import { BsCollection, BsBook, BsRocket } from 'react-icons/bs';
import StatsCard from '@/components/Dashboard/StatsCard';

interface StatsSectionProps {
  totalCourses: number;
  totalBundles: number;
  totalIndividualCourses: number;
}

export default function StatsSection({
  totalCourses,
  totalBundles,
  totalIndividualCourses,
}: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <StatsCard
        title="Total Enrolled"
        value={totalCourses}
        icon={<BsRocket />}
        colorClass="text-purple"
      />
      <StatsCard
        title="Course Bundles"
        value={totalBundles}
        icon={<BsCollection />}
        colorClass="text-teal"
      />
      <StatsCard
        title="Individual Courses"
        value={totalIndividualCourses}
        icon={<BsBook />}
        colorClass="text-orange-500"
      />
    </div>
  );
}
