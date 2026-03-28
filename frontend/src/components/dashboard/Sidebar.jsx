import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

/* ── Route map ───────────────────────────────────────────────────────────── */
const STARTUP_MENU_ITEMS = [
    { name: 'Dashboard', icon: 'grid', route: '/dashboard/startup' },
    { name: 'AI Analytics', icon: 'brain', route: '/dashboard/ai-analytics' },
    { name: 'Patent', icon: 'shield', route: '/dashboard/patent' },
    { name: 'Marketing Agency', icon: 'briefcase', route: '/dashboard/marketing-agency' },
    { name: 'Investors', icon: 'users', route: '/dashboard/investors' },
    { name: 'Tiers', icon: 'layers', route: '/dashboard/tiers' },
    { name: 'Business Advisors', icon: 'user-check', route: '/dashboard/advisors' },
];

const PATENT_FIRM_MENU_ITEMS = [
    { name: 'Dashboard', icon: 'grid', route: '/dashboard/patent-firm/dashboard' },
    { name: 'Clients', icon: 'users', route: '/dashboard/patent-firm/clients' },
    { name: 'Applications', icon: 'fileText', route: '/dashboard/patent-firm/applications' },
    { name: 'Document review', icon: 'search', route: '/dashboard/patent-firm/document-review' },
    { name: 'Payments', icon: 'dollarSign', route: '/dashboard/patent-firm/payments' },
];

const AI_ANALYTICS_MENU_ITEMS = [
    { name: 'Dashboard', icon: 'grid', route: '/dashboard/ai-analytics' },
    { name: 'Upload Files', icon: 'upload', route: '/dashboard/ai-analytics/upload' },
    { name: 'AI Assistant', icon: 'bot', route: '/dashboard/ai-analytics/assistant' },
];

/* ── SVG icons ───────────────────────────────────────────────────────────── */
const ICONS = {
    grid: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    trending: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    ),
    brain: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3 3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z" />
            <path d="M12 12a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0v-4a3 3 0 0 0-3-3z" />
        </svg>
    ),
    shield: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    briefcase: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    ),
    users: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    layers: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
        </svg>
    ),
    'user-check': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
        </svg>
    ),
    fileText: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    search: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    dollarSign: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
};

/* ── Component ───────────────────────────────────────────────────────────── */
const Sidebar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user } = useAuth();

    // Derive active item: match exact route or prefix (for sub-routes like /ai-analytics/upload)
    const isActive = (route) => {
        // Use exact match for index-like routes to avoid parent highlighting when on a sub-route
        if (route === '/dashboard/ai-analytics' || route === '/dashboard/startup' || route === '/dashboard/patent-firm/dashboard') {
            return pathname === route;
        }
        return pathname === route || pathname.startsWith(route + '/');
    };

    // Determine which menu items to use based on path
    const isPatentFirm = pathname.startsWith('/dashboard/patent-firm');
    const isAIAnalytics = pathname.startsWith('/dashboard/ai-analytics');

    let menuItems = STARTUP_MENU_ITEMS;
    let dashboardTitle = "STARTUPS DASHBOARD";

    if (isPatentFirm) {
        menuItems = PATENT_FIRM_MENU_ITEMS;
        dashboardTitle = "PATENT FIRM APP";
    } else if (isAIAnalytics) {
        menuItems = AI_ANALYTICS_MENU_ITEMS;
        dashboardTitle = "AI ANALYTICS DASHBOARD";
    }

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1 
                    className="sidebar-logo" 
                    onClick={() => navigate('/dashboard/startup')}
                    style={{ cursor: 'pointer' }}
                >
                    Ascendly
                </h1>
                <p className="sidebar-subtitle">{dashboardTitle}</p>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <a
                        key={item.name}
                        href="#"
                        className={`sidebar-nav-item${isActive(item.route) ? ' active' : ''}`}
                        onClick={(e) => { e.preventDefault(); navigate(item.route); }}
                    >
                        {ICONS[item.icon]}
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>

            <div className="sidebar-footer">
                {!isPatentFirm && !(user?.plan === 'Standard' || user?.plan === 'Enterprise' || user?.plan === 'Pro' || user?.plan === 'Premium') && (
                    <button 
                        className="sidebar-upgrade" 
                        onClick={() => navigate('/dashboard/tiers')}
                    >
                        <p>Upgrade to PRO to get access to all features!</p>
                    </button>
                )}
                <a href="/dashboard/help" className="sidebar-help">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>Help</span>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
