import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopBar.css';
import { useAuth } from '../../context/AuthContext';

const TopBar = ({ title }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const profileBtnRef = useRef(null);
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                profileBtnRef.current &&
                !profileBtnRef.current.contains(e.target)
            ) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close on ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setProfileOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleMenuItem = async (action) => {
        setProfileOpen(false);
        if (action === 'logout') {
            await logoutUser();
            navigate('/login');
        } else if (action === 'account') {
            navigate('/edit-profile');
        } else if (action === 'support') {
            console.log('Support & Feedback clicked');
        }
    };

    return (
        <div className="top-bar">
            {title ? (
                <h2 className="top-bar-welcome">{title}</h2>
            ) : (
                <h2 className="top-bar-welcome">
                    Welcome, <span>Sanavi</span> !
                </h2>
            )}

            <div className="top-bar-right">
                <div className="top-bar-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="Search" />
                </div>

                <div className="top-bar-icons">
                    {/* Notification */}
                    <button 
                        className="top-bar-icon" 
                        aria-label="Notifications"
                        onClick={() => navigate('/notifications')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>

                    {/* Settings */}
                    <button 
                        className="top-bar-icon" 
                        aria-label="Settings"
                        onClick={() => navigate('/settings')}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </button>

                    {/* Profile Button + Dropdown */}
                    <div className="top-bar-profile-wrapper">
                        <button
                            ref={profileBtnRef}
                            className={`top-bar-icon${profileOpen ? ' active' : ''}`}
                            aria-label="Profile menu"
                            aria-haspopup="menu"
                            aria-expanded={profileOpen}
                            onClick={() => setProfileOpen((prev) => !prev)}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>

                        {profileOpen && (
                            <div
                                ref={dropdownRef}
                                className="profile-dropdown"
                                role="menu"
                                aria-label="Profile options"
                            >
                                <button
                                    className="profile-dropdown-item"
                                    role="menuitem"
                                    onClick={() => handleMenuItem('account')}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Manage Account
                                </button>

                                <div className="profile-dropdown-divider" />

                                <button
                                    className="profile-dropdown-item profile-dropdown-item--logout"
                                    role="menuitem"
                                    onClick={() => handleMenuItem('logout')}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                        <polyline points="16 17 21 12 16 7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;

