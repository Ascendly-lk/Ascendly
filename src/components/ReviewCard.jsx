import React from 'react';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) { return twMerge(clsx(inputs)); }

export const ReviewCard = ({ company, date, rating, text, category, isPositive = true }) => {
  return (
    <div className="bg-card-dark p-6 rounded-2xl border border-border-subtle">
      <div className="flex justify-between items-start mb-4">
        <div><h4 className="font-semibold text-lg">{company}</h4><p className="text-muted-text text-xs">{date}</p></div>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={cn("w-4 h-4", i < rating ? "text-accent fill-accent" : "text-white/10")} />
          ))}
        </div>
      </div>
      <p className="text-muted-text text-sm leading-relaxed mb-4">"{text}"</p>
      <div className="inline-block px-3 py-1 border border-accent/30 rounded-full text-accent text-[10px] font-semibold uppercase">{category}</div>
    </div>
  );
};