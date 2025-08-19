"use client";

import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { formatBytes } from '@/lib/utils';

interface StorageChartProps {
  used: number;
  total: number;
}

const StorageChart = ({ used, total }: StorageChartProps) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const data = [{ name: 'Storage', value: percentage }];
  const remaining = total - used;

  return (
    <div className="p-4 rounded-none border-4 border-black shadow-neo bg-white w-full h-full flex flex-col justify-center items-center">
      <div className="w-full h-8 border-2 border-black bg-white">
        <div
          className="h-full bg-[var(--neo-primary)]"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="mt-4 text-center">
        <span className="text-2xl font-extrabold text-black">{formatBytes(remaining)}</span>
        <span className="text-lg font-bold text-black block">Left</span>
      </div>
    </div>
  );
};

export default StorageChart;
