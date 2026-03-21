import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Plus,
  Users,
} from "lucide-react";
import Sidebar from "./Sidebar";
import TopHeader from "../../components/TopHeader";
import "./Calendar.css";

const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const meetingSeed = {
  "2024-12-05": [
    {
      title: "Client Strategy Meeting",
      time: "10:00 AM - 11:30 AM",
      location: "Zoom",
      attendees: 5,
      type: "meeting",
    },
  ],
  "2024-12-12": [{ color: "orange" }],
  "2024-12-16": [
    {
      title: "Morning Standup",
      time: "09:00 AM - 10:00 AM",
      location: "https://meet.google.com/xyz",
      color: "purple",
    },
    {
      title: "Client Strategy Session",
      time: "01:00 PM - 02:00 PM",
      location: "https://zoom.us/j/123456",
    },
  ],
  "2024-12-20": [{ color: "green" }],
  "2024-12-28": [{ color: "cyan" }],
};

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarPage() {
  const todayDateObj = new Date(2024, 11, 16);
  const today = useMemo(() => todayDateObj, []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(() => new Date(2024, 11, 5));

  const monthLabel = useMemo(
    () =>
      viewDate.toLocaleDateString("en-US", {
        month: "long",
      }),
    [viewDate],
  );
  const yearLabel = useMemo(() => viewDate.getFullYear(), [viewDate]);

  const monthCells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const mondayStartOffset = (firstOfMonth.getDay() + 6) % 7;
    const totalCells = 42;
    const cells = [];

    for (let i = 0; i < mondayStartOffset; i += 1) {
      cells.push({ type: "blank", key: `blank-start-${i}` });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(year, month, day);
      cells.push({ type: "day", day, date, key: getDateKey(date) });
    }

    while (cells.length < totalCells) {
      cells.push({ type: "blank", key: `blank-end-${cells.length}` });
    }

    return cells;
  }, [viewDate]);

  const selectedDateKey = useMemo(
    () => getDateKey(selectedDate),
    [selectedDate],
  );
  const selectedMeetings = meetingSeed[selectedDateKey] || [];

  const todaysMeetings = useMemo(() => {
    const key = getDateKey(today);
    return meetingSeed[key] || [];
  }, [today]);

  const thisWeekMeetings = useMemo(() => {
    const meetings = [];
    for (let i = 0; i < 7; i += 1) {
      const key = getDateKey(addDays(today, i));
      if (meetingSeed[key]) {
        meetings.push(...meetingSeed[key]);
      }
    }
    return meetings;
  }, [today]);
  
  const validSelectedMeetings = selectedMeetings.filter((m) => m.title);

  const selectedDateLabel = useMemo(
    () =>
      selectedDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    [selectedDate],
  );

  const handleMonthChange = (direction) => {
    const nextMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + direction,
      1,
    );

    setViewDate(nextMonth);

    if (
      selectedDate.getFullYear() !== nextMonth.getFullYear() ||
      selectedDate.getMonth() !== nextMonth.getMonth()
    ) {
      setSelectedDate(
        new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1),
      );
    }
  };

  const renderMeetingList = (list) => {
    const validList = list.filter((m) => m.title);
    if (validList.length === 0) {
      return <p className="agenda-empty">No meetings scheduled.</p>;
    }

    return validList.map((meeting, index) => (
      <div key={`${meeting.title}-${index}`} className="meeting-item">
        <div className="meeting-item-content">
          <h3>{meeting.title}</h3>
          <p>{meeting.time}</p>
          <a href="#" className="meeting-link-text">{meeting.location}</a>
        </div>
      </div>
    ));
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="calendar-main" style={{ marginLeft: '260px', flexGrow: 1, minWidth: 0, padding: '28px 40px' }}>
        <TopHeader showWelcome={false} />

        <header className="calendar-header">
          <h1>Calendar</h1>
        </header>

        <section className="calendar-cards-row">
          <article className="meeting-card">
            <h2>Today&apos;s Meetings</h2>
            {renderMeetingList(todaysMeetings)}
          </article>

          <article className="meeting-card">
            <div className="meeting-card-head">
              <h2>This Week&apos;s Meetings</h2>
              <button type="button" className="create-meeting-btn">
                <Plus />
                Create Meeting
              </button>
            </div>
            {renderMeetingList(thisWeekMeetings)}
          </article>
        </section>

        <section className="calendar-content-row">
          <article className="month-panel">
            <div className="month-panel-head">
              <div className="month-heading">
                <span className="month-part">{monthLabel}</span>
                <span className="year-part">{yearLabel}</span>
              </div>

              <div className="month-nav">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => handleMonthChange(-1)}
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => handleMonthChange(1)}
                >
                  <ChevronRight />
                </button>
              </div>
            </div>

            <div className="month-day-heads">
              {dayHeaders.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="month-grid">
              {monthCells.map((cell) => {
                if (cell.type === "blank") {
                  return (
                    <span key={cell.key} className="day-cell blank"></span>
                  );
                }

                const key = getDateKey(cell.date);
                const dayMeetings = meetingSeed[key] || [];
                const colors = dayMeetings.map((m) => m.color).filter(Boolean);
                const isToday = isSameDay(cell.date, today);
                const isActive = isSameDay(cell.date, selectedDate);

                return (
                  <button
                    key={cell.key}
                    type="button"
                    className={`day-cell ${isActive ? "active" : ""} ${
                      isToday && !isActive ? "outlined" : ""
                    }`}
                    onClick={() => setSelectedDate(cell.date)}
                  >
                    <span>{cell.day}</span>
                    {colors.length > 0 && (
                      <div className="dots-container">
                        {colors.map((color, i) => (
                          <i key={i} className={`dot ${color}`}></i>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="agenda-panel">
            <h2>{selectedDateLabel}</h2>

            {validSelectedMeetings.length === 0 ? (
              <p className="agenda-empty">No meeting details for this day.</p>
            ) : (
              validSelectedMeetings.map((meeting, index) => (
                <div key={`${meeting.title}-${index}`} className="agenda-card">
                  <div className="agenda-head">
                    <h3>{meeting.title}</h3>
                    {meeting.type && <span>{meeting.type}</span>}
                  </div>

                  {meeting.time && (
                    <p>
                      <Clock3 />
                      {meeting.time}
                    </p>
                  )}
                  {meeting.location && (
                    <p>
                      <MapPin />
                      {meeting.location}
                    </p>
                  )}
                  {meeting.attendees && (
                    <p>
                      <Users />
                      {meeting.attendees} attendees
                    </p>
                  )}
                </div>
              ))
            )}
          </article>
        </section>
      </main>
    </div>
  );
}
