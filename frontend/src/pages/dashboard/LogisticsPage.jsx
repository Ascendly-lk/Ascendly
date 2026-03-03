import './LogisticsPage.css';

/* ── Main Logistics Page (sidebar removed — provided by DashboardLayout) ─── */
const LogisticsPage = () => {
    return (
        <div className="lp-main">
            {/* ── Top Bar ── */}
            <div className="lp-topbar">
                <h2 className="lp-topbar-title">Logistics Network</h2>
                <div className="lp-topbar-right">
                    <div className="lp-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="lp-topbar-icons">
                        <button className="lp-icon-btn" aria-label="Notifications">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>
                        <button className="lp-icon-btn" aria-label="Settings">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                            </svg>
                        </button>
                        <button className="lp-icon-btn" aria-label="Profile">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="lp-content">

                {/* ── Metric Cards Row ── */}
                <div className="lp-metrics-row">
                    {/* Card 1 – Active Requests (teal gradient) */}
                    <div className="lp-metric-card lp-metric-card--glow">
                        <div className="lp-metric-card-header">
                            <span className="lp-metric-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </span>
                            <span className="lp-metric-label">Active Requests</span>
                        </div>
                        <div className="lp-metric-value">56</div>
                        <div className="lp-metric-footer">
                            <span className="lp-badge lp-badge--up">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                    <polyline points="17 6 23 6 23 12" />
                                </svg>
                                +5.60%
                            </span>
                            <span className="lp-metric-sub">vs last month</span>
                        </div>
                    </div>

                    {/* Card 2 – Logistics Rating (dark surface) */}
                    <div className="lp-metric-card lp-metric-card--dark">
                        <div className="lp-metric-card-header">
                            <span className="lp-metric-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                            </span>
                            <span className="lp-metric-label">Logistics Rating</span>
                        </div>
                        <div className="lp-metric-value lp-metric-value--rating">
                            4.8 <span className="lp-rating-denom">/ 5.0</span>
                        </div>
                        <div className="lp-stars">
                            {'★★★★☆'.split('').map((s, i) => (
                                <span key={i} className={s === '★' ? 'lp-star lp-star--filled' : 'lp-star lp-star--empty'}>{s}</span>
                            ))}
                        </div>
                        <div className="lp-metric-footer">
                            <span className="lp-badge lp-badge--up">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12">
                                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                                    <polyline points="17 6 23 6 23 12" />
                                </svg>
                                +0.3 pts
                            </span>
                        </div>
                        <div className="lp-metric-sub lp-metric-sub--standalone">Based on 127 reviews</div>
                    </div>

                    {/* Card 3 – Next Delivery ETA (teal gradient) */}
                    <div className="lp-metric-card lp-metric-card--glow">
                        <div className="lp-metric-card-header">
                            <span className="lp-metric-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="13" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </span>
                            <span className="lp-metric-label">Next delivery ETA</span>
                        </div>
                        <div className="lp-metric-value">2 days</div>
                    </div>
                </div>

                {/* ── Main 2-column Grid ── */}
                <div className="lp-grid">

                    {/* LEFT: Request Logistics Support */}
                    <div className="lp-card lp-form-card">
                        <h3 className="lp-card-title">Request Logistics Support</h3>
                        <p className="lp-card-subtitle">Fill the form and send to a verified provider.</p>

                        <div className="lp-form">
                            <div className="lp-field">
                                <label className="lp-label">Service Type (Delivery / Warehouse / Distribution)</label>
                                <input className="lp-input" type="text" placeholder="" />
                            </div>
                            <div className="lp-field">
                                <label className="lp-label">Pickup Location</label>
                                <input className="lp-input" type="text" placeholder="" />
                            </div>
                            <div className="lp-field">
                                <label className="lp-label">Delivery Location</label>
                                <input className="lp-input" type="text" placeholder="" />
                            </div>
                            <div className="lp-field">
                                <label className="lp-label">Notes (Weight, timing, special handling)</label>
                                <textarea className="lp-textarea" rows="4" placeholder=""></textarea>
                            </div>
                            <button className="lp-send-btn">Send Request</button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lp-right-col">

                        {/* Verified Providers */}
                        <div className="lp-card lp-providers-card">
                            <h3 className="lp-card-title">Verified Providers</h3>
                            <p className="lp-card-subtitle">Choose a provider and track approval.</p>

                            <div className="lp-provider-list">
                                <div className="lp-provider-item">
                                    <div className="lp-provider-info">
                                        <div className="lp-provider-name">SwiftShip Logistics</div>
                                        <div className="lp-provider-meta">Delivery • eCommerce • Verified</div>
                                    </div>
                                    <button className="lp-select-btn">Select</button>
                                </div>

                                <div className="lp-provider-item">
                                    <div className="lp-provider-info">
                                        <div className="lp-provider-name">OceanStore Warehousing</div>
                                        <div className="lp-provider-meta">Warehouse • Trinco • Verified</div>
                                    </div>
                                    <button className="lp-select-btn">Select</button>
                                </div>
                            </div>
                        </div>

                        {/* Request Status */}
                        <div className="lp-card lp-status-card">
                            <h3 className="lp-card-title">Request Status</h3>

                            <div className="lp-status-list">
                                <div className="lp-status-item">
                                    <span className="lp-status-id">• Request #L_1023</span>
                                    <span className="lp-status-label lp-status--pending">Pending approval</span>
                                </div>
                                <div className="lp-status-separator"></div>
                                <div className="lp-status-item">
                                    <span className="lp-status-id">• Request #L_1019</span>
                                    <span className="lp-status-label lp-status--approved">Approved (ETA 2 days)</span>
                                </div>
                                <div className="lp-status-separator"></div>
                                <div className="lp-status-item">
                                    <span className="lp-status-id">• Request #L_1012</span>
                                    <span className="lp-status-label lp-status--rejected">Rejected (update details)</span>
                                </div>
                                <div className="lp-status-separator"></div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogisticsPage;
