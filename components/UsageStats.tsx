"use client";

import React from 'react';
import { getUsageSummary, formatBytes } from '@/lib/utils';
import Image from 'next/image';

interface UsageStatsProps {
  totalSpace: any; 
}

const UsageStats = ({ totalSpace }: UsageStatsProps) => {
  const usageSummary = getUsageSummary(totalSpace);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
      {usageSummary.map((item) => (
        <div key={item.title} className="p-3 lg:p-4 rounded-none border-2 lg:border-4 border-black shadow-neo bg-card text-card-foreground">
          <div className="flex items-center mb-2 gap-2">
            <Image 
              src={item.icon} 
              alt={item.title} 
              width={20} 
              height={20} 
              className="flex-shrink-0 w-5 h-5 lg:w-6 lg:h-6" 
            />
            <h3 className="font-bold text-black text-xs lg:text-sm truncate">{item.title}</h3>
          </div>
          <p className="text-2xl lg:text-4xl font-extrabold text-[var(--neo-primary)] break-words leading-tight">
            {formatBytes(item.size)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default UsageStats;
