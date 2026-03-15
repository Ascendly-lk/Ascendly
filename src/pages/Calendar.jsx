import React, { useState } from 'react';
import { Plus, Video, Users, Calendar as CalendarIcon } from 'lucide-react';
import { MeetingCard } from '../components/MeetingCard';
import { CalendarGrid } from '../components/CalendarGrid';
import './Calendar.css';
import { format } from 'date-fns';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 15));

  const todayMeetings = [
    { title: 'Client Strategy Session', time: '10:00 AM - 11:30 AM', link: 'meet.google.com/abc-defg-hij' },
    { title: 'Weekly Marketing Sync', time: '02:00 PM - 03:00 PM', link: 'zoom.us/j/123456789' },
  ];

  const weekMeetings = [
    { title: 'New Project Kickoff', time: 'Dec 16, 09:00 AM', link: 'meet.google.com/xyz-qrs-tuv' },
    { title: 'Content Review', time: 'Dec 18, 11:00 AM', link: 'meet.google.com/mno-pqr-stu' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card-dark p-6 rounded-2xl border border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Today's Meetings</h3>
            <span className="text-xs text-muted-text">{format(new Date(), 'MMMM d, yyyy')}</span>
          </div>
          <div className="space-y-4">
            {todayMeetings.map((meeting, i) => (
              <MeetingCard key={i} {...meeting} />
            ))}
          </div>
        </div>

        <div className="bg-card-dark p-6 rounded-2xl border border-border-subtle">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">This Week's Meetings</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent text-bg-dark rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-[0_0_15px_rgba(0,255,239,0.3)]">
              <Plus className="w-4 h-4" />
              Create Meeting
            </button>
          </div>
          <div className="space-y-4">
            {weekMeetings.map((meeting, i) => (
              <MeetingCard key={i} {...meeting} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CalendarGrid 
            selectedDate={selectedDate} 
            onDateSelect={setSelectedDate}
            events={[new Date(2024, 11, 15), new Date(2024, 11, 16), new Date(2024, 11, 18)]}
          />
        </div>

        <div className="bg-card-dark p-6 rounded-2xl border border-border-subtle">
          <h3 className="text-lg font-semibold mb-6">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h3>
          
          <div className="bg-accent p-6 rounded-2xl text-bg-dark space-y-4 shadow-[0_0_20px_rgba(0,255,239,0.2)]">
            <div>
              <h4 className="text-xl font-bold">Client Strategy Session</h4>
              <p className="text-bg-dark/70 text-sm font-medium">10:00 AM - 11:30 AM</p>
            </div>
            
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Video className="w-4 h-4" />
              <span>Google Meet</span>
            </div>

            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img 
                  key={i}
                  src={`https://picsum.photos/seed/${i + 10}/32/32`} 
                  className="w-8 h-8 rounded-full border-2 border-accent"
                  alt="Attendee"
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="w-8 h-8 rounded-full bg-bg-dark/10 border-2 border-accent flex items-center justify-center text-[10px] font-bold">
                +2
              </div>
            </div>

            <button className="w-full py-3 bg-bg-dark text-white rounded-xl font-bold text-sm hover:bg-bg-dark/90 transition-colors">
              Join Meeting
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3 text-muted-text">
              <Users className="w-4 h-4" />
              <span className="text-sm">6 Attendees Invited</span>
            </div>
            <div className="flex items-center gap-3 text-muted-text">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-sm">Added to Google Calendar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
