import React from 'react';
import { Video } from 'lucide-react';

export const MeetingCard = ({ title, time, link }) => {
  return (
    <div className="flex items-center p-4 bg-card-dark rounded-xl border border-border-subtle hover:border-accent/30 transition-all duration-300 group">
      <div className="w-1 h-10 bg-accent rounded-full mr-4" />
      <div className="flex-1">
        <h4 className="font-medium text-white group-hover:text-accent transition-colors">{title}</h4>
        <p className="text-accent text-sm font-semibold">{time}</p>
        {link && (
          <div className="flex items-center mt-1 text-muted-text text-xs">
            <Video className="w-3 h-3 mr-1" />
            <span>{link}</span>
          </div>
        )}
      </div>
    </div>
  );
};
