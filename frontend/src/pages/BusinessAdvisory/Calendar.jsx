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
  "2026-03-07": [
    {
      title: "Morning Standup",
      time: "09:00 AM - 10:00 AM",
      location: "Zoom",
      attendees: 4,
      type: "meeting",
    },
    {
      title: "Client Strategy Session",
      time: "01:00 PM - 02:00 PM",
      location: "Zoom",
      attendees: 5,
      type: "session",
    },
  ],
  "2026-03-12": [
    {
      title: "Marketing Review",
      time: "11:00 AM - 12:00 PM",
      location: "Meet",
      attendees: 3,
      type: "review",
    },
  ],
  "2026-03-20": [
    {
      title: "Product Planning",
      time: "03:00 PM - 04:00 PM",
      location: "Zoom",
      attendees: 6,
      type: "planning",
    },
  ],
  "2026-03-28": [
    {
      title: "Investor Check-in",
      time: "04:00 PM - 05:00 PM",
      location: "Board Room",
      attendees: 5,
      type: "meeting",
    },
  ],
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
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState(today);

  const monthLabel = useMemo(
    () =>
      viewDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [viewDate],
  );

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
    if (list.length === 0) {
      return <p className="agenda-empty">No meetings scheduled.</p>;
    }

    return list.map((meeting, index) => (
      <div key={`${meeting.title}-${index}`} className="meeting-item">
        <div>
          <h3>{meeting.title}</h3>
          <p>{meeting.time}</p>
          <small>{meeting.location}</small>
        </div>
      </div>
    ));
  };

  return (
    <div className="calendar-page">
      <Sidebar />

      <main className="calendar-main">
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
              <h2>{monthLabel.replace(" ", "\n")}</h2>

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
                const hasMeetings = Boolean(meetingSeed[key]);
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
                    {hasMeetings && <i className="dot cyan"></i>}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="agenda-panel">
            <h2>{selectedDateLabel}</h2>

            {selectedMeetings.length === 0 ? (
              <p className="agenda-empty">No meeting details for this day.</p>
            ) : (
              selectedMeetings.map((meeting, index) => (
                <div key={`${meeting.title}-${index}`} className="agenda-card">
                  <div className="agenda-head">
                    <h3>{meeting.title}</h3>
                    <span>{meeting.type}</span>
                  </div>

                  <p>
                    <Clock3 />
                    {meeting.time}
                  </p>
                  <p>
                    <MapPin />
                    {meeting.location}
                  </p>
                  <p>
                    <Users />
                    {meeting.attendees} attendees
                  </p>
                </div>
              ))
            )}
          </article>
        </section>
      </main>
    </div>
  );
}
