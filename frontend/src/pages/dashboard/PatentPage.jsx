import { useState } from 'react';
import './PatentPage.css';

/* ── Filing Activity Datasets ────────────────────────────────────────────────────── */
const FILING_DATASETS = {
    Monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [22, 35, 42, 55, 60, 50, 78, 65, 72, 80, 85, 90],
    },
    Quarterly: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [33, 55, 72, 88],
    },
    Yearly: {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        values: [28, 42, 58, 70, 90],
    },
};

/* ── Inline SVG helpers ───────────────────────────────────────────────────── */
const Icon = ({ d, viewBox = '0 0 24 24', size = 20 }) => (
    <svg width={size} height={size} viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="2">
        <path d={d} />
    </svg>
);

/* ── Chart constants ─────────────────────────────────────────────────────────────────── */
const VB_W = 600;
const VB_H = 200;
const CHART_TOP = 12;
const CHART_BOTTOM = 30;
const CHART_LEFT = 40;
const CHART_RIGHT = 10;
const CHART_W = VB_W - CHART_LEFT - CHART_RIGHT;
const CHART_H = VB_H - CHART_TOP - CHART_BOTTOM;

function mapPoints(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    return values.map((v, i) => ([
        CHART_LEFT + (i / (values.length - 1)) * CHART_W,
        CHART_TOP + CHART_H - ((v - min) / range) * CHART_H,
    ]));
}

function buildSmoothPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const cpX = (prev[0] + curr[0]) / 2;
        d += ` C ${cpX},${prev[1]} ${cpX},${curr[1]} ${curr[0]},${curr[1]}`;
    }
    return d;
}

function yTicks(values) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return Array.from({ length: 5 }, (_, i) => {
        const frac = i / 4;
        const val = Math.round(min + frac * (max - min));
        const y = CHART_TOP + CHART_H - frac * CHART_H;
        return { val, y };
    });
}

/* ── Filing Activity Chart ────────────────────────────────────────────────────── */
const FilingChart = ({ period }) => {
    const ds = FILING_DATASETS[period];
    const pts = mapPoints(ds.values);
    const linePath = buildSmoothPath(pts);
    const lastPt = pts[pts.length - 1];
    const areaPath = `${linePath} L ${lastPt[0]},${CHART_TOP + CHART_H} L ${CHART_LEFT},${CHART_TOP + CHART_H} Z`;

    return (
        <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="pp-chart-svg"
            preserveAspectRatio="none"
            overflow="visible"
        >
            <defs>
                <filter id="pp-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="pp-dot-glow" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <linearGradient id="pp-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00FFEF" stopOpacity="0.28" />
                    <stop offset="75%" stopColor="#00FFEF" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#00FFEF" stopOpacity="0" />
                </linearGradient>
                <pattern id="pp-grid" x="0" y="0" width="60" height="36" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2={VB_H} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                    <line x1="0" y1="0" x2={VB_W} y2="0" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
            </defs>

            {/* Grid */}
            <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#pp-grid)" />

            {/* Y-axis ticks */}
            {yTicks(ds.values).map(({ val, y }, i) => (
                <g key={i}>
                    <line x1={CHART_LEFT - 4} y1={y} x2={CHART_LEFT} y2={y}
                        stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <text x={CHART_LEFT - 6} y={y + 3} textAnchor="end"
                        fontSize="9" fill="rgba(255,255,255,0.35)" fontFamily="inherit">
                        {val}
                    </text>
                </g>
            ))}

            {/* Y-axis label */}
            <text x={8} y={CHART_TOP + CHART_H / 2} textAnchor="middle"
                fontSize="9" fill="rgba(255,255,255,0.3)" fontFamily="inherit"
                transform={`rotate(-90, 8, ${CHART_TOP + CHART_H / 2})`}>
                Filings
            </text>

            {/* Area fill */}
            <path d={areaPath} fill="url(#pp-area-grad)" />

            {/* Glow stroke */}
            <path d={linePath} stroke="rgba(0,255,239,0.4)" strokeWidth="10"
                fill="none" filter="url(#pp-glow)" />

            {/* Main line */}
            <path d={linePath} stroke="#00FFEF" strokeWidth="2.5" fill="none"
                strokeLinecap="round" strokeLinejoin="round" />

            {/* X-axis labels */}
            {pts.map((pt, i) => (
                <text key={i} x={pt[0]} y={VB_H - 6} textAnchor="middle"
                    fontSize="9" fill="rgba(255,255,255,0.35)" fontFamily="inherit">
                    {ds.labels[i]}
                </text>
            ))}

            {/* Terminal dot */}
            <circle cx={lastPt[0]} cy={lastPt[1]} r="10"
                fill="rgba(0,255,239,0.15)" filter="url(#pp-dot-glow)" />
            <circle cx={lastPt[0]} cy={lastPt[1]} r="5"
                fill="#00FFEF" stroke="#0f172a" strokeWidth="2" />
        </svg>
    );
};


/* ── Main Patent Page (sidebar removed — provided by DashboardLayout) ────── */
const PatentPage = () => {
    const [chartPeriod, setChartPeriod] = useState('Monthly');

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
                            <div className="pp-chart-dropdown">
                                <select
                                    value={chartPeriod}
                                    onChange={(e) => setChartPeriod(e.target.value)}
                                >
                                    <option>Monthly</option>
                                    <option>Quarterly</option>
                                    <option>Yearly</option>
                                </select>
                                <svg className="pp-chart-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </div>
                        <div className="pp-chart-area">
                            <FilingChart period={chartPeriod} />
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
                                    <button className="pp-renewal-btn">View</button>
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
    );
};

export default PatentPage;
