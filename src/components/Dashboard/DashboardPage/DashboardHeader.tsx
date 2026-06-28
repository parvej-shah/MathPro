'use client';

import React from 'react';

interface DashboardHeaderProps {
  userName?: string;
}

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'শুভ সকাল';
    if (hour < 17) return 'শুভ দুপুর';
    if (hour < 20) return 'শুভ বিকেল';
    return 'শুভ সন্ধ্যা';
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const greeting = getGreeting();
  return (
    <div className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-heading mb-2">
        আমার <span className="text-primary">কোর্সসমূহ</span>
      </h1>
      <p className="text-paragraph">
        {greeting}{userName ? `, ${userName}` : ''}! আজকের সেশন শুরু করো।
      </p>
    </div>
  );
}
