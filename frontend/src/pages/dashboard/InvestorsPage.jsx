import './InvestorsPage.css';

/* ── Main Page ───────────────────────────────────────────────────────────── */
const InvestorsPage = () => {
    const investors = [
        { name: 'BluePeak Ventures', meta: 'Verified • Last active: 2d', focus: 'SaaS, AI', stage: 'Seed', match: 96, matchClass: 'high' },
        { name: 'Crescent Capital', meta: 'Verified • Last active: 5d', focus: 'Fintech', stage: 'Pre-Seed', match: 74, matchClass: 'mid' },
        { name: 'NorthBridge Angels', meta: 'Verified • Last active: 1w', focus: 'E-commerce', stage: 'Seed', match: 89, matchClass: 'high' },
    ];

    return (
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
                    {/* Card 1 – Investor views (dark) */}
                    <div className="ip-stat-card ip-stat-card--dark">
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
                            <span className="ip-stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </span>
                            <span className="ip-stat-label">Interested Investors</span>
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
                            <span className="ip-stat-label">AI Match Score</span>
                        </div>
                        <div className="ip-stat-value">81<span className="ip-stat-denom">/100</span></div>
                    </div>

                    {/* Card 4 – Funding Probability (glow) */}
                    <div className="ip-stat-card ip-stat-card--glow">
                        <div className="ip-stat-top">
                            <span className="ip-stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                                    <line x1="18" y1="20" x2="18" y2="10" />
                                    <line x1="12" y1="20" x2="12" y2="4" />
                                    <line x1="6" y1="20" x2="6" y2="14" />
                                </svg>
                            </span>
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
    );
};

export default InvestorsPage;
