import { useNavigate } from 'react-router-dom';
import './PatentPage.css';

/* ── Inline SVG helpers ───────────────────────────────────────────────────── */
const Icon = ({ d, viewBox = '0 0 24 24', size = 20 }) => (
    <svg width={size} height={size} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2">
        <path d={d} />
    </svg>
);

/* ── Sidebar (Patent-active) ─────────────────────────────────────────────── */
const PatentSidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: 'grid' },
        { name: 'Logistics', icon: 'trending' },
        { name: 'AI Analytics', icon: 'brain' },
        { name: 'Patent', icon: 'shield', active: true },
        { name: 'Marketing Agency', icon: 'briefcase' },
        { name: 'Investors', icon: 'users' },
        { name: 'Tiers', icon: 'layers' },
        { name: 'Business Advisors', icon: 'user-check' },
    ];

    const icons = {
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
    };

    const handleClick = (e, item) => {
        e.preventDefault();
        if (item.name === 'Dashboard') navigate('/dashboard/startup');
        else if (item.name === 'Logistics') navigate('/dashboard/logistics');
        else if (item.name === 'AI Analytics') navigate('/dashboard/ai-analytics');
        else if (item.name === 'Investors') navigate('/dashboard/investors');
        else if (item.name === 'Tiers') navigate('/dashboard/tiers');
        else if (item.name === 'Business Advisors') navigate('/dashboard/advisors');
    };

    return (
        <div className="pp-sidebar">
            <div className="pp-sidebar-header">
                <h1 className="pp-sidebar-logo">Ascendly</h1>
                <p className="pp-sidebar-subtitle">STARTUPS DASHBOARD</p>
            </div>

            <nav className="pp-sidebar-nav">
                {menuItems.map((item) => (
                    <a
                        key={item.name}
                        href="#"
                        className={`pp-sidebar-nav-item${item.active ? ' active' : ''}`}
                        onClick={(e) => handleClick(e, item)}
                    >
                        {icons[item.icon]}
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>

            <div className="pp-sidebar-footer">
                <div className="pp-sidebar-upgrade">
                    <p>Upgrade to <strong>PRO</strong> to get access to all features!</p>
                </div>
                <a href="#" className="pp-sidebar-help">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
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

/* ── Filing Activity Bar Chart (pure SVG/CSS) ────────────────────────────── */
const FilingChart = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const values = [22, 35, 42, 55, 60, 50, 78];
    const max = Math.max(...values);
    const cx = 480;
    const ch = 160;
    const barW = 36;
    const gap = (cx - months.length * barW) / (months.length + 1);

    // Line path
    const pts = values.map((v, i) => {
        const x = gap + i * (barW + gap) + barW / 2;
        const y = ch - (v / max) * ch * 0.9;
        return `${x},${y}`;
    });
    const linePath = 'M ' + pts.join(' L ');

    return (
        <svg viewBox={`0 0 ${cx} ${ch + 30}`} className="pp-chart-svg" preserveAspectRatio="xMidYMid meet">
            <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FFEF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00FFEF" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00FFEF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#00FFEF" stopOpacity="1" />
                </linearGradient>
            </defs>

            {/* Bars */}
            {values.map((v, i) => {
                const x = gap + i * (barW + gap);
                const barH = (v / max) * ch * 0.9;
                const y = ch - barH;
                return (
                    <rect key={i} x={x} y={y} width={barW} height={barH}
                        rx="5" fill="url(#barGrad)" />
                );
            })}

            {/* Trend line */}
            <path d={linePath} stroke="url(#lineGrad)" strokeWidth="2.5" fill="none" strokeLinejoin="round" />

            {/* Dots on line */}
            {pts.map((pt, i) => {
                const [x, y] = pt.split(',').map(Number);
                return <circle key={i} cx={x} cy={y} r="4" fill="#00FFEF" stroke="#0c1424" strokeWidth="2" />;
            })}

            {/* X-axis labels */}
            {months.map((m, i) => {
                const x = gap + i * (barW + gap) + barW / 2;
                return (
                    <text key={i} x={x} y={ch + 20} textAnchor="middle"
                        fontSize="11" fill="#64748B" fontFamily="Inter, sans-serif">{m}</text>
                );
            })}
        </svg>
    );
};

/* ── Main Patent Page ────────────────────────────────────────────────────── */
const PatentPage = () => {
    const statCards = [
        {
            label: 'TOTAL PATENTS',
            value: '142',
            badge: '+12%',
            badgeUp: true,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
            ),
            variant: 'dark',
        },
        {
            label: 'GRANTED',
            value: '89',
            badge: 'Active',
            badgeUp: null,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" />
                    <path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    <path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z" />
                    <path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z" />
                    <path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z" />
                    <path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z" />
                    <path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z" />
                    <path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z" />
                </svg>
            ),
            variant: 'dark',
        },
        {
            label: 'PENDING APPROVAL',
            value: '24',
            badge: null,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
            ),
            variant: 'glow',
        },
        {
            label: 'RENEWALS DUE',
            value: '5',
            badge: 'Action Req',
            badgeUp: false,
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 .49-4.73" />
                </svg>
            ),
            variant: 'dark',
        },
    ];

    const renewals = [
        { id: 'US-2023-004', label: 'Expires in 2 days', urgency: 'high' },
        { id: 'EP-9941-X', label: 'Expires in 14 days', urgency: 'mid' },
        { id: 'JP-102-AI', label: 'Expires in 30 days', urgency: 'low' },
    ];

    const filings = [
        { name: 'Quantum Encryption Algo', id: 'US-2024-8832', jurisdiction: '🇺🇸 USA', date: 'Oct 24, 2023', status: 'Granted', statusClass: 'granted' },
        { name: 'Neural Net Processor', id: 'EP-1229-B1', jurisdiction: '🇪🇺 Europe', date: 'Sep 12, 2023', status: 'Under Review', statusClass: 'review' },
        { name: 'Synthetic Bio-Fuel', id: 'JP-2023-009', jurisdiction: '🇯🇵 Japan', date: 'Aug 05, 2023', status: 'Pending', statusClass: 'pending' },
    ];

    return (
        <div className="pp-shell">
            <PatentSidebar />

            <div className="pp-main">
                {/* ── Top Bar ── */}
                <div className="pp-topbar">
                    <h2 className="pp-topbar-title">Patent Management</h2>
                    <div className="pp-topbar-right">
                        <div className="pp-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input type="text" placeholder="Search patents..." />
                        </div>
                        <div className="pp-topbar-icons">
                            <button className="pp-icon-btn" aria-label="Notifications">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </button>
                            <button className="pp-icon-btn" aria-label="Settings">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                                </svg>
                            </button>
                            <button className="pp-icon-btn" aria-label="Profile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="pp-content">

                    {/* ── Stat Cards ── */}
                    <div className="pp-stats-row">
                        {statCards.map((card) => (
                            <div key={card.label} className={`pp-stat-card pp-stat-card--${card.variant}`}>
                                <div className="pp-stat-top">
                                    <span className="pp-stat-icon">{card.icon}</span>
                                    {card.badge && (
                                        <span className={`pp-stat-badge pp-stat-badge--${card.badgeUp === true ? 'up' : card.badgeUp === false ? 'warn' : 'neutral'}`}>
                                            {card.badgeUp === true && (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="11" height="11">
                                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                                    <polyline points="17 6 23 6 23 12" />
                                                </svg>
                                            )}
                                            {card.badge}
                                        </span>
                                    )}
                                </div>
                                <div className="pp-stat-value">{card.value}</div>
                                <div className="pp-stat-label">{card.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* ── Middle Row: Chart + Renewals ── */}
                    <div className="pp-mid-row">
                        {/* Filing Activity Forecast */}
                        <div className="pp-card pp-chart-card">
                            <div className="pp-chart-header">
                                <h3 className="pp-card-title">Filing Activity Forecast</h3>
                                <span className="pp-period-badge">Last 6 Months</span>
                            </div>
                            <div className="pp-chart-area">
                                <FilingChart />
                            </div>
                        </div>

                        {/* Upcoming Renewals */}
                        <div className="pp-card pp-renewals-card">
                            <h3 className="pp-card-title">Upcoming Renewals</h3>
                            <div className="pp-renewal-list">
                                {renewals.map((r) => (
                                    <div key={r.id} className="pp-renewal-item">
                                        <span className={`pp-renewal-icon pp-renewal-icon--${r.urgency}`}>
                                            {r.urgency === 'high' && (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                    <line x1="12" y1="9" x2="12" y2="13" />
                                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                                </svg>
                                            )}
                                            {r.urgency === 'mid' && (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <polyline points="12 6 12 12 16 14" />
                                                </svg>
                                            )}
                                            {r.urgency === 'low' && (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                            )}
                                        </span>
                                        <div className="pp-renewal-info">
                                            <div className="pp-renewal-id">{r.id}</div>
                                            <div className={`pp-renewal-label pp-renewal-label--${r.urgency}`}>{r.label}</div>
                                        </div>
                                        <button className="pp-renewal-btn" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Recent Patent Filings ── */}
                    <div className="pp-card pp-filings-card">
                        <div className="pp-filings-header">
                            <h3 className="pp-card-title">Recent Patent Filings</h3>
                            <div className="pp-filings-actions">
                                <button className="pp-filter-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                                    </svg>
                                    Filter
                                </button>
                                <button className="pp-new-filing-btn">+ New Filing</button>
                            </div>
                        </div>

                        <table className="pp-table">
                            <thead>
                                <tr>
                                    <th>PATENT NAME / ID</th>
                                    <th>JURISDICTION</th>
                                    <th>FILING DATE</th>
                                    <th>STATUS</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filings.map((f) => (
                                    <tr key={f.id}>
                                        <td>
                                            <div className="pp-filing-name-row">
                                                <span className="pp-filing-icon-dot">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                                    </svg>
                                                </span>
                                                <div>
                                                    <div className="pp-filing-name">{f.name}</div>
                                                    <div className="pp-filing-id">{f.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="pp-jurisdiction">{f.jurisdiction}</td>
                                        <td className="pp-date">{f.date}</td>
                                        <td>
                                            <span className={`pp-status-tag pp-status-tag--${f.statusClass}`}>{f.status}</span>
                                        </td>
                                        <td>
                                            <button className="pp-action-btn" aria-label="More options">•••</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PatentPage;
