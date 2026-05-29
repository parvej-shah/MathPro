import React from 'react';

interface DashboardHeaderProps {
  userName?: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <div className="mb-10">
      <h1 className="text-4xl font-bold text-foreground mb-2">
        My <span className="text-primary">Learning</span>
      </h1>
      <p className="text-muted-foreground">
        Welcome back! You&apos;ve learned a lot this week.
      </p>
    </div>
  );
}
