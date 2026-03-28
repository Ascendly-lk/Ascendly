import React from 'react';
import './Calendar.css';

const Calendar = () => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDay = 2; // Starting on Tuesday for June 2025

  const upcomingSessions = [
    {
      id: 1,
      client: "Adam Hooper",
      topic: "Fundraising Strategy",
      time: "10:00 AM",
      date: "June 25, 2025",
      type: "Virtual"
    },
    {
      id: 2,
      client: "James Bond",
      topic: "Market Expansion",
      time: "12:00 PM",
      date: "July 21, 2025",
      type: "In-Person"
    }
  ];

  return (
    <div className="calendar-page">
      <h1 className="page-title">Calendar</h1>
      
      <div className="calendar-layout">
        <div className="calendar-main">
          <div className="calendar-card">
            <div className="calendar-header">
              <h2>June 2025</h2>
              <div className="calendar-controls">
                <button className="ctrl-btn"><i className="fi fi-rr-angle-left"></i></button>
                <button className="ctrl-btn"><i className="fi fi-rr-angle-right"></i></button>
              </div>
            </div>
            
            <div className="calendar-grid">
              {days.map(day => (
                <div key={day} className="day-name">{day}</div>
              ))}
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day empty"></div>
              ))}
              {dates.map(date => (
                <div key={date} className={`calendar-day ${date === 25 ? 'has-event' : ''} ${date === 12 ? 'today' : ''}`}>
                  <span>{date}</span>
                  {date === 25 && <div className="event-dot"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="calendar-sidebar">
          <div className="sidebar-box">
            <h3>Upcoming Sessions</h3>
            <div className="session-list">
              {upcomingSessions.map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-header">
                    <span className="session-time">{session.time}</span>
                    <span className="session-type">{session.type}</span>
                  </div>
                  <h4 className="session-client">{session.client}</h4>
                  <p className="session-topic">{session.topic}</p>
                  <div className="session-footer">
                    <i className="fi fi-rr-calendar"></i> {session.date}
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-add-session">
              <i className="fi fi-rr-plus"></i> Schedule New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
