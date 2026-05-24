import React from 'react';

interface DashboardHeaderProps {
  userName?: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-heading dark:text-darkHeading mb-2">
        My <span className="text-purple">Learning</span>
      </h1>
      <p className="text-paragraph dark:text-darkParagraph">
        Welcome back! You&apos;ve learned a lot this week.
      </p>
    </div>
  );
}
