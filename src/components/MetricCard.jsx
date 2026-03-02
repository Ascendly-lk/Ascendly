import React from 'react';
import { cn } from '../lib/utils';


export const MetricCard = ({ label, value, icon: Icon, trend, trendColor = 'success' }) => {
  const trendColors = { success: 'text-green-500', danger: 'text-red-500', warning: 'text-yellow-500' };
  return (
    <div className="bg-card-dark p-6 rounded-2xl border border-border-subtle">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-accent/10 rounded-lg"><Icon className="w-5 h-5 text-accent" /></div>
        {trend && <span className={cn("text-xs font-medium", trendColors[trendColor])}>{trend}</span>}
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-muted-text text-sm font-medium">{label}</p>
    </div>
  );
};