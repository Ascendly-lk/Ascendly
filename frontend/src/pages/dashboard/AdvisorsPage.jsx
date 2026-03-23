import { useState } from 'react';
import BookingModal from '../../components/dashboard/BookingModal';
import { getSubscriptionPlan } from '../../utils/auth';
import TopBar from '../../components/dashboard/TopBar';
import './AdvisorsPage.css';

/* ── Existing "AI Suggested" advisor data (unchanged) ─────────────────────── */
const advisors = [
    { name: 'Ajith de Costa',   specialty: 'Scaling • Operational • KPI review',         rating: '4.8/5' },
    { name: 'Gayani de Alwis',  specialty: 'Marketing • Positioning • Growth',            rating: '4.2/5' },
    { name: 'John Keels PLC',   specialty: 'Enterprise Marketing • Partnerships',         rating: '4.9/5' },
    { name: 'Nuwan Perera',     specialty: 'Finance • Pricing • Unit economics',          rating: null    },
    { name: 'Shalini Fernando', specialty: 'Product • Roadmaps • UX strategy',            rating: null    },
    { name: 'Maya Senanayake',  specialty: 'Legal • IP • Compliance',                     rating: null    },
];

/* ── Dummy booking-panel advisor pool (tier-filtered) ─────────────────────── */
const BOOKING_POOL = [
    // ── Free tier (rating < 3.0) ──────────────────────────────────────────
    { id: 1, name: 'Rajan Mehta',      specialty: 'Venture Strategy',  rating: 2.4, category: 'Venture' },
    { id: 2, name: 'Priya Nair',       specialty: 'Marketing Growth',  rating: 2.8, category: 'Marketing' },
    { id: 3, name: 'Dilan Gunasekara', specialty: 'Product Roadmap',   rating: 2.6, category: 'Product' },
    // ── Pro tier add-ons (3.0 ≤ rating < 4.0) ─────────────────────────────
    { id: 4, name: 'Shehan Wickrama',  specialty: 'Fundraising',       rating: 3.5, category: 'Finance' },
    { id: 5, name: 'Kavya Reddy',      specialty: 'IP & Legal',        rating: 3.8, category: 'Legal' },
    { id: 6, name: 'Tharindu Silva',   specialty: 'Marketing Growth',  rating: 3.2, category: 'Marketing' },
    // ── Premium tier add-ons (4.0 – 5.0) ──────────────────────────────────
    { id: 7, name: 'Amara Patel',      specialty: 'Venture Strategy',  rating: 4.6, category: 'Venture' },
    { id: 8, name: 'Lucas Ferreira',   specialty: 'Fundraising',       rating: 5.0, category: 'Finance' },
    { id: 9, name: 'Haruto Tanaka',    specialty: 'Product Roadmap',   rating: 4.9, category: 'Product' },
];

/* ── Tier helpers ─────────────────────────────────────────────────────────── */
function resolveTier() {
    const raw = (getSubscriptionPlan() || 'free').toLowerCase();
    if (raw.includes('enterprise') || raw.includes('premium')) return 'premium';
    if (raw.includes('standard') || raw.includes('pro'))       return 'pro';
    return 'free';               // 'basic', 'starter' or anything else → free
}

function filterByTier(tier) {
    if (tier === 'premium') return BOOKING_POOL;                        // all, including 5-star
    if (tier === 'pro')     return BOOKING_POOL.filter(a => a.rating < 4.0);
    return BOOKING_POOL.filter(a => a.rating < 3.0);                   // free
}

function tierBannerText(tier) {
    if (tier === 'premium') return 'Premium users can access top-rated 5-star advisors.';
    if (tier === 'pro')     return 'Pro users can book unlimited sessions, but only with advisors below 4 stars.';
    return 'Free tier users can book only 1 session.';
}

const FREE_BOOKED_KEY = 'ascendly_free_advisor_booked';

/* ── Main Page ────────────────────────────────────────────────────────────── */
const AdvisorsPage = () => {
    /* — Existing state — */
    const [selectedAdvisor, setSelectedAdvisor] = useState(null);

    /* — New: booking panel state — */
    const [showPanel,      setShowPanel]      = useState(false);
    const [bookedRows,     setBookedRows]     = useState({});          // { [id]: true }
    const [freeBookingUsed, setFreeBookingUsed] = useState(
        () => localStorage.getItem(FREE_BOOKED_KEY) === 'true'
    );

    const tier         = resolveTier();
    const filteredPool = filterByTier(tier);

    /* ── Toggle the panel ──────────────────────────────────────────────── */
    function handleRequestSession() {
        setShowPanel(prev => !prev);
    }

    /* ── Book a session row ──────────────────────────────────────────── */
    function handleBookRow(advisor) {
        if (tier === 'free' && freeBookingUsed) return;   // already blocked

        setBookedRows(prev => ({ ...prev, [advisor.id]: true }));

        if (tier === 'free') {
            setFreeBookingUsed(true);
            localStorage.setItem(FREE_BOOKED_KEY, 'true');
        }
    }

    return (
        <div className="ap-main">
        {/* ── Top Bar ── */}
        {/* ── Top Bar ── */}
        <TopBar title="Advisor Network" />

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
                    <button
                        className={`ap-request-session-btn ${showPanel ? 'active' : ''}`}
                        onClick={handleRequestSession}
                    >
                        {showPanel ? '✕ Close Panel' : 'Request Advisor Session →'}
                    </button>
                </div>

                {/* ── Tier-based Booking Panel ─────────────────────────────── */}
                {showPanel && (
                    <div className="ap-rb-panel">
                        {/* Tier banner */}
                        <div className={`ap-rb-banner ap-rb-banner--${tier}`}>
                            <span className="ap-rb-tier-badge">
                                {tier === 'free' ? 'FREE' : tier === 'pro' ? 'PRO' : 'PREMIUM'}
                            </span>
                            <span className="ap-rb-banner-text">{tierBannerText(tier)}</span>
                        </div>

                        {/* Advisor rows */}
                        <div className="ap-rb-list">
                            {filteredPool.map((advisor) => {
                                const isBooked  = bookedRows[advisor.id];
                                const isBlocked = tier === 'free' && freeBookingUsed && !isBooked;

                                return (
                                    <div key={advisor.id} className="ap-rb-row">
                                        {/* Avatar placeholder */}
                                        <div className="ap-rb-avatar">
                                            {advisor.name.charAt(0)}
                                        </div>

                                        {/* Info */}
                                        <div className="ap-rb-info">
                                            <div className="ap-rb-name">{advisor.name}</div>
                                            <div className="ap-rb-specialty">{advisor.specialty}</div>
                                        </div>

                                        {/* Rating badge */}
                                        <div className={`ap-rb-rating ${advisor.rating >= 4.5 ? 'ap-rb-rating--gold' : ''}`}>
                                            ★ {advisor.rating.toFixed(1)}
                                        </div>

                                        {/* Action */}
                                        <div className="ap-rb-action">
                                            {isBooked ? (
                                                <span className="ap-rb-success">✓ Session Requested</span>
                                            ) : isBlocked ? (
                                                <span className="ap-rb-blocked">Free booking used</span>
                                            ) : (
                                                <button
                                                    className="ap-rb-book-btn"
                                                    onClick={() => handleBookRow(advisor)}
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

                {/* ── Existing advisor cards grid (UNCHANGED) ── */}
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
