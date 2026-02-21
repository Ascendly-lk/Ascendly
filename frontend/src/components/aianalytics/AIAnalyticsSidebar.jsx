import { useNavigate, useLocation } from 'react-router-dom';
import './AIAnalyticsSidebar.css';

const AIAnalyticsSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', icon: 'grid', path: '/dashboard/ai-analytics' },
        { name: 'Upload Files', icon: 'upload', path: '/dashboard/ai-analytics/upload' },
        { name: 'AI Assistant', icon: 'bot', path: '/dashboard/ai-analytics/assistant' },
    ];

    const getIcon = (iconName) => {
        const icons = {
            grid: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                </svg>
            ),
            upload: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            ),
            bot: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <line x1="12" y1="7" x2="12" y2="11" />
                    <line x1="8" y1="15" x2="8" y2="17" />
                    <line x1="16" y1="15" x2="16" y2="17" />
                </svg>
            ),
            settings: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                </svg>
            ),
            help: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            ),
        };
        return icons[iconName] || icons.grid;
    };

    return (
        <div className="ai-sidebar">
            <div className="ai-sidebar-header">
                <h1 className="ai-sidebar-logo">Ascendly</h1>
                <p className="ai-sidebar-subtitle">AI ANALYTICS DASHBOARD</p>
            </div>

            <nav className="ai-sidebar-nav">
                {menuItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={index}
                            className={`ai-sidebar-nav-item ${isActive ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            {getIcon(item.icon)}
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="ai-sidebar-footer">
                <button className="ai-sidebar-footer-item">
                    {getIcon('settings')}
                    <span>Settings</span>
                </button>
                <button className="ai-sidebar-footer-item">
                    {getIcon('help')}
                    <span>Help</span>
                </button>
            </div>
        </div>
    );
};

export default AIAnalyticsSidebar;
