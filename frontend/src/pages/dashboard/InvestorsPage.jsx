import { useNavigate } from 'react-router-dom';
import './InvestorsPage.css';

/* ── Sidebar (Investors-active) ─────────────────────────────────────────── */
const InvestorsSidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: 'grid' },
        { name: 'Logistics', icon: 'trending' },
        { name: 'AI Analytics', icon: 'brain' },
        { name: 'Patent', icon: 'shield' },
        { name: 'Marketing Agency', icon: 'briefcase' },
        { name: 'Investors', icon: 'users', active: true },
        { name: 'Tiers', icon: 'layers' },
        { name: 'Business Advisors', icon: 'user-check' },
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
        else if (name === 'Tiers') navigate('/dashboard/tiers');
        else if (name === 'Business Advisors') navigate('/dashboard/advisors');
    };

    return (
        <div className="ip-sidebar">
            <div className="ip-sidebar-header">
                <h1 className="ip-sidebar-logo">Ascendly</h1>
                <p className="ip-sidebar-subtitle">STARTUPS DASHBOARD</p>
            </div>
            <nav className="ip-sidebar-nav">
                {menuItems.map((item) => (
                    <a key={item.name} href="#"
                        className={`ip-sidebar-nav-item${item.active ? ' active' : ''}`}
                        onClick={(e) => handleClick(e, item.name)}>
                        {icons[item.icon]}
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="ip-sidebar-footer">
                <div className="ip-sidebar-upgrade">
                    <p>Upgrade to <strong>PRO</strong> to get access to all features!</p>
                </div>
                <a href="#" className="ip-sidebar-help">
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

/* ── Main Page ───────────────────────────────────────────────────────────── */
const InvestorsPage = () => {
    const investors = [
        { name: 'BluePeak Ventures', meta: 'Verified • Last active: 2d', focus: 'SaaS, AI', stage: 'Seed', match: 96, matchClass: 'high' },
        { name: 'Crescent Capital', meta: 'Verified • Last active: 5d', focus: 'Fintech', stage: 'Pre-Seed', match: 74, matchClass: 'mid' },
        { name: 'NorthBridge Angels', meta: 'Verified • Last active: 1w', focus: 'E-commerce', stage: 'Seed', match: 89, matchClass: 'high' },
    ];

    return (
        <div className="ip-shell">
            <InvestorsSidebar />

            <div className="ip-main">
                {/* ── Top Bar ── */}
                <div className="ip-topbar">
                    <h2 className="ip-topbar-title">Investors Network</h2>
                    <div className="ip-topbar-right">
                        <div className="ip-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input type="text" placeholder="Search" />
                        </div>
                        <div className="ip-topbar-icons">
                            <button className="ip-icon-btn" aria-label="Notifications">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </button>
                            <button className="ip-icon-btn" aria-label="Settings">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                                </svg>
                            </button>
                            <button className="ip-icon-btn" aria-label="Profile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="ip-content">

                    {/* ── Stat Cards Row ── */}
                    <div className="ip-stats-row">
                        {/* Card 1 – Investor views (glow) */}
                        <div className="ip-stat-card ip-stat-card--glow">
                            <div className="ip-stat-top">
                                <span className="ip-stat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                </span>
                                <span className="ip-stat-label">Investor views</span>
                            </div>
                            <div className="ip-stat-value">520</div>
                        </div>

                        {/* Card 2 – Intrested Investors (dark) */}
                        <div className="ip-stat-card ip-stat-card--dark">
                            <div className="ip-stat-top">
                                <span className="ip-stat-label">Intrested Investors</span>
                            </div>
                            <div className="ip-stat-value">26</div>
                        </div>

                        {/* Card 3 – AI Match Score (dark) */}
                        <div className="ip-stat-card ip-stat-card--dark">
                            <div className="ip-stat-top">
                                <span className="ip-stat-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                                        <line x1="18" y1="20" x2="18" y2="10" />
                                        <line x1="12" y1="20" x2="12" y2="4" />
                                        <line x1="6" y1="20" x2="6" y2="14" />
                                    </svg>
                                </span>
                                <span className="ip-stat-label">AI Macth Score</span>
                            </div>
                            <div className="ip-stat-value">81<span className="ip-stat-denom">/100</span></div>
                        </div>

                        {/* Card 4 – Funding Probability (glow) */}
                        <div className="ip-stat-card ip-stat-card--glow">
                            <div className="ip-stat-top">
                                <span className="ip-stat-label">Funding Probablity</span>
                            </div>
                            <div className="ip-stat-value">63%</div>
                        </div>
                    </div>

                    {/* ── Main Grid ── */}
                    <div className="ip-grid">

                        {/* LEFT – Recommended Investors table */}
                        <div className="ip-card ip-investors-card">
                            <h3 className="ip-card-title">Recommended Investors</h3>
                            <p className="ip-card-subtitle">AI-ranked based on your sector, traction, and stage.</p>

                            <div className="ip-table-header">
                                <span>Investor</span>
                                <span>Focus</span>
                                <span>Stage</span>
                                <span>Match</span>
                                <span>Action</span>
                            </div>

                            <div className="ip-table-body">
                                {investors.map((inv) => (
                                    <div key={inv.name} className="ip-table-row">
                                        <div className="ip-inv-info">
                                            <div className="ip-inv-name">{inv.name}</div>
                                            <div className="ip-inv-meta">{inv.meta}</div>
                                        </div>
                                        <div className="ip-inv-focus">{inv.focus}</div>
                                        <div className="ip-inv-stage">{inv.stage}</div>
                                        <div className="ip-inv-match">
                                            <span className={`ip-match-badge ip-match-badge--${inv.matchClass}`}>{inv.match}%</span>
                                        </div>
                                        <div className="ip-inv-action">
                                            <button className="ip-request-btn">Request</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT ─ two stacked cards */}
                        <div className="ip-right-col">

                            {/* Deal Pipeline */}
                            <div className="ip-card ip-pipeline-card">
                                <h3 className="ip-card-title">Deal Pipeline</h3>
                                <ul className="ip-bullet-list">
                                    <li>Requested: 5</li>
                                    <li>NDA Signed: 2</li>
                                    <li>Meetings Scheduled: 1</li>
                                    <li>Offers: 0</li>
                                </ul>
                                <button className="ip-export-btn">Export Investor Report →</button>
                            </div>

                            {/* AI Recommendations */}
                            <div className="ip-card ip-ai-card">
                                <h3 className="ip-card-title">AI Recommendations</h3>
                                <p className="ip-card-subtitle">Next best actions based on traction.</p>
                                <ul className="ip-bullet-list">
                                    <li>Prioritize Seed investors in SaaS/AI.</li>
                                    <li>Share only high-level metrics first.</li>
                                    <li>Schedule 1:1 with top 2 matches.</li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default InvestorsPage;
