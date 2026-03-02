import { useNavigate } from 'react-router-dom';
import './AdvisorsPage.css';

/* ── Sidebar (Business Advisors-active) ─────────────────────────────────── */
const AdvisorsSidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: 'grid' },
        { name: 'Logistics', icon: 'trending' },
        { name: 'AI Analytics', icon: 'brain' },
        { name: 'Patent', icon: 'shield' },
        { name: 'Marketing Agency', icon: 'briefcase' },
        { name: 'Investors', icon: 'users' },
        { name: 'Tiers', icon: 'layers' },
        { name: 'Business Advisors', icon: 'user-check', active: true },
    ];

    const icons = {
        grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
        trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
        brain: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3 3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z" /><path d="M12 12a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0v-4a3 3 0 0 0-3-3z" /></svg>,
        shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
        briefcase: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
        users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
        layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
        'user-check': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>,
    };

    const handleClick = (e, name) => {
        e.preventDefault();
        if (name === 'Dashboard') navigate('/dashboard/startup');
        else if (name === 'Logistics') navigate('/dashboard/logistics');
        else if (name === 'AI Analytics') navigate('/dashboard/ai-analytics');
        else if (name === 'Patent') navigate('/dashboard/patent');
        else if (name === 'Investors') navigate('/dashboard/investors');
        else if (name === 'Tiers') navigate('/dashboard/tiers');
    };

    return (
        <div className="ap-sidebar">
            <div className="ap-sidebar-header">
                <h1 className="ap-sidebar-logo">Ascendly</h1>
                <p className="ap-sidebar-subtitle">STARTUPS DASHBOARD</p>
            </div>
            <nav className="ap-sidebar-nav">
                {menuItems.map((item) => (
                    <a key={item.name} href="#"
                        className={`ap-sidebar-nav-item${item.active ? ' active' : ''}`}
                        onClick={(e) => handleClick(e, item.name)}>
                        {icons[item.icon]}
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="ap-sidebar-footer">
                <div className="ap-sidebar-upgrade">
                    <p>Upgrade to <strong>PRO</strong> to get access to all features!</p>
                </div>
                <a href="#" className="ap-sidebar-help">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                        <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>Help</span>
                </a>
            </div>
        </div>
    );
};

/* ── Data ────────────────────────────────────────────────────────────────── */
const advisors = [
    { name: 'Ajith de Costa', specialty: 'Scaling • Operational • KPI review', rating: '4.8/5' },
    { name: 'Gayani de Alwis', specialty: 'Marketing • Positioning • Growth', rating: '4.2/5' },
    { name: 'John Keels PLC', specialty: 'Enterprise Marketing • Partnerships', rating: '4.9/5' },
    { name: 'Nuwan Perera', specialty: 'Finance • Pricing • Unit economics', rating: null },
    { name: 'Shalini Fernando', specialty: 'Product • Roadmaps • UX strategy', rating: null },
    { name: 'Maya Senanayake', specialty: 'Legal • IP • Compliance', rating: null },
];

/* ── Main Page ───────────────────────────────────────────────────────────── */
const AdvisorsPage = () => (
    <div className="ap-shell">
        <AdvisorsSidebar />

        <div className="ap-main">
            {/* ── Top Bar ── */}
            <div className="ap-topbar">
                <h2 className="ap-topbar-title">Advisor Network</h2>
                <div className="ap-topbar-right">
                    <div className="ap-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="ap-topbar-icons">
                        <button className="ap-icon-btn" aria-label="Notifications">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>
                        <button className="ap-icon-btn" aria-label="Settings">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                            </svg>
                        </button>
                        <button className="ap-icon-btn" aria-label="Profile">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="ap-content">

                {/* Page subtitle */}
                <p className="ap-subtitle">
                    Connect with verified experts to maintain your patent, intellectual property<br />
                    and venture investments.
                </p>

                {/* ── AI Suggested Advisors section ── */}
                <div className="ap-section">
                    <div className="ap-section-header">
                        <div>
                            <h3 className="ap-section-title">AI Suggested Advisors</h3>
                            <p className="ap-section-meta">Matched based on your growth stage and KPIs.</p>
                        </div>
                        <button className="ap-request-session-btn">Request Advisor Session →</button>
                    </div>

                    {/* ── Advisor cards grid (THE STAT CARDS THE USER MENTIONED) ── */}
                    <div className="ap-cards-grid">
                        {advisors.map((adv) => (
                            <div key={adv.name} className="ap-advisor-card">
                                <div className="ap-advisor-card-top">
                                    <div className="ap-advisor-name">{adv.name}</div>
                                    <div className="ap-advisor-specialty">{adv.specialty}</div>
                                </div>
                                {adv.rating && (
                                    <div className="ap-rating-badge">{adv.rating}</div>
                                )}
                                <button className="ap-request-btn">Request Session</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Upcoming Sessions ── */}
                <div className="ap-card ap-sessions-card">
                    <h3 className="ap-card-title">Upcoming Sessions</h3>
                    <div className="ap-sessions-legend">
                        Track requests:&nbsp;
                        <span className="ap-legend-pending">Pending</span>&nbsp;
                        <span className="ap-legend-accepted">Accepted*</span>&nbsp;
                        <span className="ap-legend-rejected">Rejected</span>
                    </div>
                    <ul className="ap-sessions-list">
                        <li>• Session with Gayani — Pending approval</li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
);

export default AdvisorsPage;
