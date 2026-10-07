import { useState, useMemo } from "react";
import MacWindow from "./MacWindow";
import "./calendar.scss";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MINI_DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];

// Sample events for portfolio showcase
const EVENTS = [
  { date: "2026-10-08", title: "Team Standup", time: "10:00 AM", color: "#ff453a" },
  { date: "2026-10-08", title: "Code Review Session", time: "2:00 PM", color: "#30d158" },
  { date: "2026-10-10", title: "Portfolio Review", time: "11:00 AM", color: "#0a84ff" },
  { date: "2026-10-12", title: "DSA Practice", time: "9:00 AM", color: "#ff9f0a" },
  { date: "2026-10-14", title: "Project Deadline", time: "6:00 PM", color: "#ff453a" },
  { date: "2026-10-15", title: "Meeting with Mentor", time: "3:00 PM", color: "#bf5af2" },
  { date: "2026-10-18", title: "Hackathon Prep", time: "10:00 AM", color: "#64d2ff" },
  { date: "2026-10-20", title: "AI Workshop", time: "1:00 PM", color: "#30d158" },
  { date: "2026-10-22", title: "Database Design", time: "11:30 AM", color: "#0a84ff" },
  { date: "2026-10-25", title: "Sprint Review", time: "4:00 PM", color: "#ff9f0a" },
  { date: "2026-10-28", title: "Open Source Contrib", time: "9:00 AM", color: "#bf5af2" },
  { date: "2026-10-30", title: "Monthly Retro", time: "5:00 PM", color: "#ff453a" },
  { date: "2026-11-02", title: "React Deep Dive", time: "10:00 AM", color: "#64d2ff" },
  { date: "2026-11-05", title: "Backend Architecture", time: "2:00 PM", color: "#30d158" },
  { date: "2026-11-10", title: "API Design Review", time: "11:00 AM", color: "#0a84ff" },
  { date: "2026-09-15", title: "IIT Bombay Presentation", time: "10:00 AM", color: "#ff9f0a" },
  { date: "2026-09-20", title: "Research Paper Draft", time: "1:00 PM", color: "#bf5af2" },
];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const formatDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

// --- Mini Month View for Sidebar ---
const MiniMonth = ({ year, month, selectedDate, onSelectDate, today }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);
  const cells = [];

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, current: false });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  // Next month leading days
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  const isToday = (day) =>
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day;

  const isSelected = (day) =>
    selectedDate.year === year &&
    selectedDate.month === month &&
    selectedDate.day === day;

  return (
    <div className="cal-mini-month">
      <div className="cal-mini-header">
        <span className="cal-mini-title">
          {MONTH_NAMES[month]} {year}
        </span>
      </div>
      <div className="cal-mini-grid">
        {MINI_DAY_NAMES.map((d, i) => (
          <span key={i} className="cal-mini-day-name">
            {d}
          </span>
        ))}
        {cells.map((cell, i) => (
          <button
            key={i}
            className={`cal-mini-cell ${!cell.current ? "faded" : ""} ${
              cell.current && isToday(cell.day) ? "today" : ""
            } ${cell.current && isSelected(cell.day) ? "selected" : ""}`}
            onClick={() =>
              cell.current &&
              onSelectDate({ year, month, day: cell.day })
            }
          >
            {cell.day}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main Calendar Component ---
const Calendar = ({ windowName, setWindowsState }) => {
  const today = useMemo(() => new Date(), []);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
    day: today.getDate(),
  });
  const [viewMode, setViewMode] = useState("month"); // month | week

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDate({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
    });
  };

  const getEventsForDate = (day) => {
    const key = formatDateKey(currentYear, currentMonth, day);
    return EVENTS.filter((e) => e.date === key);
  };

  const isToday = (day) =>
    today.getFullYear() === currentYear &&
    today.getMonth() === currentMonth &&
    today.getDate() === day;

  // Build calendar grid
  const prevMonthDays = getDaysInMonth(
    currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  );
  const calendarCells = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push({ day: prevMonthDays - i, current: false, events: [] });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, current: true, events: getEventsForDate(d) });
  }
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) {
    calendarCells.push({ day: d, current: false, events: [] });
  }

  // Selected date events
  const selectedDateKey = formatDateKey(
    selectedDate.year,
    selectedDate.month,
    selectedDate.day
  );
  const selectedEvents = EVENTS.filter((e) => e.date === selectedDateKey);

  // Next mini month
  const nextMiniMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextMiniYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  return (
    <MacWindow
      width="70vw"
      height="72vh"
      windowName={windowName}
      setWindowsState={setWindowsState}
      title={`Calendar — ${MONTH_NAMES[currentMonth]} ${currentYear}`}
    >
      <div className="cal-window">
        {/* Sidebar */}
        <aside className="cal-sidebar">
          <MiniMonth
            year={currentYear}
            month={currentMonth}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            today={today}
          />
          <MiniMonth
            year={nextMiniYear}
            month={nextMiniMonth}
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setCurrentMonth(d.month);
              setCurrentYear(d.year);
            }}
            today={today}
          />

          {/* Upcoming Events */}
          <div className="cal-upcoming">
            <h3>Upcoming</h3>
            <div className="cal-upcoming-list">
              {EVENTS.filter((e) => new Date(e.date) >= today)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((event, i) => (
                  <div key={i} className="cal-upcoming-item">
                    <div
                      className="cal-upcoming-dot"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="cal-upcoming-info">
                      <span className="cal-upcoming-title">{event.title}</span>
                      <span className="cal-upcoming-date">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · {event.time}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </aside>

        {/* Main Calendar */}
        <div className="cal-main">
          {/* Toolbar */}
          <div className="cal-toolbar">
            <div className="cal-toolbar-left">
              <button className="cal-nav-btn" onClick={goToPrevMonth}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
                  />
                </svg>
              </button>
              <button className="cal-nav-btn" onClick={goToNextMonth}>
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
                  />
                </svg>
              </button>
              <button className="cal-today-btn" onClick={goToToday}>
                Today
              </button>
              <h1 className="cal-month-title">
                {MONTH_NAMES[currentMonth]} {currentYear}
              </h1>
            </div>
            <div className="cal-toolbar-right">
              <div className="cal-view-toggle">
                <button
                  className={viewMode === "month" ? "active" : ""}
                  onClick={() => setViewMode("month")}
                >
                  Month
                </button>
                <button
                  className={viewMode === "week" ? "active" : ""}
                  onClick={() => setViewMode("week")}
                >
                  Week
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="cal-grid-wrapper">
            {/* Day names header */}
            <div className="cal-day-names">
              {DAY_NAMES.map((d) => (
                <span key={d} className="cal-day-name">
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="cal-grid">
              {calendarCells.map((cell, i) => (
                <div
                  key={i}
                  className={`cal-cell ${!cell.current ? "faded" : ""} ${
                    cell.current && isToday(cell.day) ? "today" : ""
                  } ${
                    cell.current &&
                    selectedDate.year === currentYear &&
                    selectedDate.month === currentMonth &&
                    selectedDate.day === cell.day
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    cell.current &&
                    setSelectedDate({
                      year: currentYear,
                      month: currentMonth,
                      day: cell.day,
                    })
                  }
                >
                  <span
                    className={`cal-cell-day ${
                      cell.current && isToday(cell.day) ? "today-number" : ""
                    }`}
                  >
                    {cell.day}
                  </span>
                  <div className="cal-cell-events">
                    {cell.events.slice(0, 3).map((event, ei) => (
                      <div
                        key={ei}
                        className="cal-cell-event"
                        style={{
                          backgroundColor: event.color + "22",
                          borderLeft: `3px solid ${event.color}`,
                        }}
                      >
                        <span className="cal-cell-event-title">
                          {event.title}
                        </span>
                      </div>
                    ))}
                    {cell.events.length > 3 && (
                      <span className="cal-cell-more">
                        +{cell.events.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Day Detail */}
          {selectedEvents.length > 0 && (
            <div className="cal-detail-bar">
              <h3>
                {MONTH_NAMES[selectedDate.month]} {selectedDate.day},{" "}
                {selectedDate.year}
              </h3>
              <div className="cal-detail-events">
                {selectedEvents.map((event, i) => (
                  <div key={i} className="cal-detail-event">
                    <div
                      className="cal-detail-dot"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="cal-detail-info">
                      <span className="cal-detail-title">{event.title}</span>
                      <span className="cal-detail-time">{event.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MacWindow>
  );
};

export default Calendar;
