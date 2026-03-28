import { Link } from "react-router-dom";
import { Bell, Search, Settings, UserRound } from "lucide-react";
import "./TopHeader.css";

export default function TopHeader({ showWelcome = true, title }) {
  return (
    <header className={`top-header ${!showWelcome && !title ? "no-title" : ""}`}>
      {showWelcome ? (
        <h1>
          Welcome, <span>Abdullah !</span>
        </h1>
      ) : title ? (
        <h1 className="page-title">{title}</h1>
      ) : null}

      <div className="top-header-actions">
        <label className="top-header-search" aria-label="Search">
          <Search size={16} />
          <input type="text" placeholder="Search" />
        </label>

        <div className="top-header-icon-group">
          <Link
            to="/business-advisory/notifications"
            className="top-header-circle-btn"
            aria-label="Open notifications"
          >
            <Bell size={15} />
          </Link>

          <Link
            to="/business-advisory/settings"
            className="top-header-circle-btn"
            aria-label="Open settings"
          >
            <Settings size={15} />
          </Link>

          <Link
            to="/business-advisory/edit-profile"
            className="top-header-circle-btn"
            aria-label="Open profile"
          >
            <UserRound size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
