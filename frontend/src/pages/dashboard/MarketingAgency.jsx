import { useState } from 'react';
import BookingModal from '../../components/dashboard/BookingModal';
import { getSubscriptionPlan } from '../../utils/auth';
import './MarketingAgency.css';

/* ── Marketing Agency data (from mockup) ─────────────────────────────────── */
const agencies = [
    { name: 'Viral Growth Agency', specialty: 'Social Media • Viral Content • Growth', rating: '4.8/5' },
    { name: 'Brand Catalyst',      specialty: 'Branding • Strategy • Positioning',    rating: '4.7/5' },
    { name: 'Performance Plus',    specialty: 'PPC • Analytics • ROI Optimization',   rating: '4.6/5' },
    { name: 'Content Masters',     specialty: 'SEO • Content Marketing • Copywriting', rating: null    },
    { name: 'Digital Edge Media',  specialty: 'Influencer Marketing • Partnerships',   rating: null    },
    { name: 'Email Pro Agency',    specialty: 'Email Marketing • Automation • CRM',   rating: null    },
];

/* ── Dummy booking-panel agency pool (tier-filtered) ─────────────────────── */
const BOOKING_POOL = [
    // ── Free tier (rating < 3.0) ──────────────────────────────────────────
    { id: 1, name: 'EcoStream Media', specialty: 'Organic Search Strategy', rating: 2.5, category: 'SEO' },
    { id: 2, name: 'QuickClick Ads',  specialty: 'Basic PPC Campaigning',    rating: 2.8, category: 'PPC' },
    { id: 3, name: 'Draftly Content', specialty: 'Blog Post Writing',       rating: 2.4, category: 'Content' },
    // ── Pro tier add-ons (3.0 ≤ rating < 4.0) ─────────────────────────────
    { id: 4, name: 'GrowthLabs SEO',  specialty: 'Advanced Link Building',   rating: 3.5, category: 'SEO' },
    { id: 5, name: 'PixelPerfect Brand', specialty: 'Visual Identity Design', rating: 3.2, category: 'Branding' },
    { id: 6, name: 'LeadGen Experts', specialty: 'Email Funnel Design',     rating: 3.8, category: 'Marketing' },
    // ── Premium tier add-ons (4.0 – 5.0) ──────────────────────────────────
    { id: 7, name: 'Stellar Social',  specialty: 'Enterprise Social Strategy', rating: 4.8, category: 'Social' },
    { id: 8, name: 'Peak ROI Agency', specialty: 'Multi-Channel Analytics', rating: 4.9, category: 'PPC' },
    { id: 9, name: 'Legacy Branding', specialty: 'Global Brand Strategy',    rating: 4.7, category: 'Branding' },
];

/* ── Tier helpers ─────────────────────────────────────────────────────────── */
function resolveTier() {
    const raw = (getSubscriptionPlan() || 'free').toLowerCase();
    if (raw.includes('enterprise') || raw.includes('premium')) return 'premium';
    if (raw.includes('standard') || raw.includes('pro'))       return 'pro';
    return 'free';
}

function filterByTier(tier) {
    if (tier === 'premium') return BOOKING_POOL;
    if (tier === 'pro')     return BOOKING_POOL.filter(a => a.rating < 4.0);
    return BOOKING_POOL.filter(a => a.rating < 3.0);
}

function tierBannerText(tier) {
    if (tier === 'premium') return 'Premium users can access top-rated 5-star agencies.';
    if (tier === 'pro')     return 'Pro users can book unlimited sessions, but only with agencies below 4 stars.';
    return 'Free tier users can book only 1 session.';
}

const FREE_BOOKED_KEY = 'ascendly_free_agency_booked';

/* ── Main Page ────────────────────────────────────────────────────────────── */
const MarketingAgency = () => {
    const [selectedAgency, setSelectedAgency] = useState(null);
    const [showPanel, setShowPanel] = useState(false);
    const [bookedRows, setBookedRows] = useState({});
    const [freeBookingUsed, setFreeBookingUsed] = useState(
        () => localStorage.getItem(FREE_BOOKED_KEY) === 'true'
    );

    const tier = resolveTier();
    const filteredPool = filterByTier(tier);

    function handleRequestSession() {
        setShowPanel(prev => !prev);
    }

    function handleBookRow(agency) {
        if (tier === 'free' && freeBookingUsed) return;

        setBookedRows(prev => ({ ...prev, [agency.id]: true }));

        if (tier === 'free') {
            setFreeBookingUsed(true);
            localStorage.setItem(FREE_BOOKED_KEY, 'true');
        }
    }

    return (
        <div className="ma-main">
            {/* ── Top Bar ── */}
            <div className="ma-topbar">
                <h2 className="ma-topbar-title">Marketing Agency Network</h2>
                <div className="ma-topbar-right">
                    <div className="ma-search">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Search" />
                    </div>
                    <div className="ma-topbar-icons">
                        <button className="ma-icon-btn" aria-label="Notifications">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>
                        <button className="ma-icon-btn" aria-label="Settings">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                            </svg>
                        </button>
                        <button className="ma-icon-btn" aria-label="Profile">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="ma-content">
                <p className="ma-subtitle">
                    Connect with verified marketing agencies to enhance your brand presence and reach your target audience.
                </p>

                <div className="ma-section">
                    <div className="ma-section-header">
                        <div>
                            <h3 className="ma-section-title">AI Suggested Agencies</h3>
                            <p className="ma-section-meta">Matched based on your business needs and target audience.</p>
                        </div>
                        <button
                            className={`ma-request-session-btn ${showPanel ? 'active' : ''}`}
                            onClick={handleRequestSession}
                        >
                            {showPanel ? '✕ Close Panel' : 'Request Agency Session →'}
                        </button>
                    </div>

                    {showPanel && (
                        <div className="ma-rb-panel">
                            <div className={`ma-rb-banner ma-rb-banner--${tier}`}>
                                <span className="ma-rb-tier-badge">
                                    {tier === 'free' ? 'FREE' : tier === 'pro' ? 'PRO' : 'PREMIUM'}
                                </span>
                                <span className="ma-rb-banner-text">{tierBannerText(tier)}</span>
                            </div>

                            <div className="ma-rb-list">
                                {filteredPool.map((agency) => {
                                    const isBooked = bookedRows[agency.id];
                                    const isBlocked = tier === 'free' && freeBookingUsed && !isBooked;

                                    return (
                                        <div key={agency.id} className="ma-rb-row">
                                            <div className="ma-rb-avatar">
                                                {agency.name.charAt(0)}
                                            </div>

                                            <div className="ma-rb-info">
                                                <div className="ma-rb-name">{agency.name}</div>
                                                <div className="ma-rb-specialty">{agency.specialty}</div>
                                            </div>

                                            <div className={`ma-rb-rating ${agency.rating >= 4.5 ? 'ma-rb-rating--gold' : ''}`}>
                                                ★ {agency.rating.toFixed(1)}
                                            </div>

                                            <div className="ma-rb-action">
                                                {isBooked ? (
                                                    <span className="ma-rb-success">✓ Session Requested</span>
                                                ) : isBlocked ? (
                                                    <span className="ma-rb-blocked">Free booking used</span>
                                                ) : (
                                                    <button
                                                        className="ma-rb-book-btn"
                                                        onClick={() => handleBookRow(agency)}
                                                    >
                                                        Book Session
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="ma-cards-grid">
                        {agencies.map((agency) => (
                            <div key={agency.name} className="ma-agency-card">
                                <div className="ma-agency-card-top">
                                    <div className="ma-agency-name">{agency.name}</div>
                                    <div className="ma-agency-specialty">{agency.specialty}</div>
                                </div>
                                {agency.rating && (
                                    <div className="ma-rating-badge">{agency.rating}</div>
                                )}
                                <button
                                    className="ma-request-btn"
                                    onClick={() => setSelectedAgency(agency)}
                                >
                                    Request Session
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ma-card ma-sessions-card">
                    <h3 className="ma-card-title">Upcoming Sessions</h3>
                    <div className="ma-sessions-legend">
                        Track requests:&nbsp;
                        <span className="ma-legend-pending">Pending</span>&nbsp;
                        <span className="ma-legend-accepted">Accepted*</span>&nbsp;
                        <span className="ma-legend-rejected">Rejected</span>
                    </div>
                    <ul className="ma-sessions-list">
                        <li>• Session with Brand Catalyst — Pending approval</li>
                    </ul>
                </div>
            </div>

            {selectedAgency && (
                <BookingModal
                    advisor={selectedAgency}
                    onClose={() => setSelectedAgency(null)}
                />
            )}
        </div>
    );
};

export default MarketingAgency;
