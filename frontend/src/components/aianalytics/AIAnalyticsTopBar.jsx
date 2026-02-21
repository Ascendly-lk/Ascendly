import './AIAnalyticsTopBar.css';

const AIAnalyticsTopBar = () => {
    return (
        <div className="ai-topbar">
            <h2 className="ai-topbar-title">Welcome to Analytics!</h2>

            <div className="ai-topbar-right">
                <div className="ai-topbar-search">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input type="text" placeholder="Search" />
                </div>

                <div className="ai-topbar-icons">
                    {/* Notification */}
                    <button className="ai-topbar-icon-btn" aria-label="Notifications">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>

                    {/* Settings */}
                    <button className="ai-topbar-icon-btn" aria-label="Settings">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                        </svg>
                    </button>

                    {/* Profile */}
                    <button className="ai-topbar-icon-btn" aria-label="Profile">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAnalyticsTopBar;
