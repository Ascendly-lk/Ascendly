import { useState } from 'react';
import BookingModal from '../../components/dashboard/BookingModal';
import './AdvisorsPage.css';


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
const AdvisorsPage = () => {
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    return (
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
                            <button 
                                className="ap-request-btn"
                                onClick={() => setSelectedAdvisor(adv)}
                            >
                                Request Session
                            </button>
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

            {selectedAdvisor && (
                <BookingModal 
                    advisor={selectedAdvisor} 
                    onClose={() => setSelectedAdvisor(null)} 
                />
            )}
        </div>
    );
};

export default AdvisorsPage;
