import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const CalendarGrid = ({ selectedDate, onDateSelect, events = [] }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date(2024, 11, 1)); // Default to Dec 2024 as per prompt

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const hasEvent = (day) => {
    return events.some(eventDate => isSameDay(day, eventDate));
  };

  return (
    <div className="bg-card-dark p-6 rounded-2xl border border-border-subtle">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-muted-text uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <button
              key={idx}
              onClick={() => onDateSelect(day)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-300 relative group",
                !isCurrentMonth && "opacity-20",
                isSelected ? "bg-accent text-bg-dark font-bold scale-105 shadow-[0_0_15px_rgba(0,255,239,0.4)]" : "hover:bg-white/5"
              )}
            >
              <span className="text-sm">{format(day, 'd')}</span>
              {hasEvent(day) && !isSelected && (
                <div className="absolute bottom-2 w-1 h-1 bg-accent rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
