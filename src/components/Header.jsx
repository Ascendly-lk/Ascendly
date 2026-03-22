
import React, { useContext } from 'react';
import { Search, Bell } from 'lucide-react';
import { AppContext } from '../App.jsx';
import './Header.css';

const Header = ({ title }) => {
  const { searchQuery, setSearchQuery } = useContext(AppContext);

  return (
    <header className="header-wrapper">
      <div className="header-title-area">
        <h2 className="header-title">{title}</h2>
      </div>

      <div className="header-actions">
        <div className="header-search-container group">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="header-user-area">
          <button className="notification-btn group">
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button>
          
          <div className="user-profile">
            <div className="user-info hidden lg:block">
              <p className="user-name">Abdullah</p>
              <p className="user-role">Sr. Campaign Manager</p>
            </div>
            <div className="user-avatar">
              <img src="https://picsum.photos/seed/user123/100/100" alt="Avatar" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
