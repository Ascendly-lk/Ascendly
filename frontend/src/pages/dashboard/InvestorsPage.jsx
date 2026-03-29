<<<<<<< HEAD
import { useState } from 'react';
import { getSubscriptionPlan } from '../../utils/auth';
import BookingModal from '../../components/dashboard/BookingModal';
import './InvestorsPage.css';

/* ── Dummy Data ──────────────────────────────────────────────────────────── */
// The existing recommended ones (keep at top)
const recommendedInvestors = [
    { id: 'rec-1', name: 'BluePeak Ventures',  meta: 'Verified • Last active: 2d', focus: 'SaaS, AI',   stage: 'Seed',     match: 96, matchClass: 'high', rating: 4.8 },
    { id: 'rec-2', name: 'Crescent Capital',   meta: 'Verified • Last active: 5d', focus: 'Fintech',    stage: 'Pre-Seed', match: 74, matchClass: 'mid',  rating: 3.5 },
    { id: 'rec-3', name: 'NorthBridge Angels', meta: 'Verified • Last active: 1w', focus: 'E-commerce', stage: 'Seed',     match: 89, matchClass: 'high', rating: 4.2 },
];

// The extended tier-based dummy list
const DUMMY_INVESTORS = [
    // ── Free tier (rating < 3.0) ──────────────────────────────────────────
    { id: 1, name: 'Apex Growth Capital', meta: 'Verified • Last active: 1d', focus: 'SaaS, DevOps', stage: 'Seed', match: 72, matchClass: 'mid', rating: 2.8, bio: 'Early stage fund backing technical founders.', experience: '5+ years in dev tools.' },
    { id: 2, name: 'Orion Equity',        meta: 'Verified • Last active: 2w', focus: 'EdTech',       stage: 'Series A', match: 65, matchClass: 'mid', rating: 2.5, bio: 'Focused on the future of learning and work.', experience: '12+ investments in EdTech.' },
    { id: 3, name: 'Nexus Seed Fund',     meta: 'Verified • Last active: 4d', focus: 'Marketplaces', stage: 'Pre-Seed', match: 68, matchClass: 'mid', rating: 2.9, bio: 'Pre-seed checks for bold marketplace ideas.', experience: 'Former marketplace operators.' },
    { id: 4, name: 'Vanguard Angels',     meta: 'Verified • Last active: 6d', focus: 'Logistics',    stage: 'Seed', match: 60, matchClass: 'mid', rating: 2.2, bio: 'Supply chain and logistics innovation.', experience: 'Partners with 20+ years in shipping.' },
    // ── Pro tier add-ons (3.0 ≤ rating < 4.0) ─────────────────────────────
    { id: 5, name: 'Titan Ventures',      meta: 'Verified • Last active: 1h', focus: 'Fintech, B2B', stage: 'Series A', match: 85, matchClass: 'high', rating: 3.8, bio: 'Backing the next generation of financial infrastructure.', experience: '10+ years in Fintech.' },
    { id: 6, name: 'NovaSeed Partners',   meta: 'Verified • Last active: 3d', focus: 'HealthTech',   stage: 'Seed', match: 88, matchClass: 'high', rating: 3.5, bio: 'Digital health and biotech pioneers.', experience: 'Led by former healthcare executives.' },
    { id: 7, name: 'Quantum Capital',     meta: 'Verified • Last active: 1w', focus: 'PropTech',     stage: 'Series B', match: 76, matchClass: 'mid', rating: 3.2, bio: 'Real estate technology at scale.', experience: 'Global real estate portfolio.' },
    { id: 8, name: 'Meridian Growth',     meta: 'Verified • Last active: 2d', focus: 'SaaS, D2C',    stage: 'Seed', match: 81, matchClass: 'high', rating: 3.9, bio: 'Consumer and software investments.', experience: '8 exits in the D2C space.' },
    { id: 9, name: 'Zephyr Edge Fund',    meta: 'Verified • Last active: 5h', focus: 'Cybersecurity',stage: 'Series A', match: 79, matchClass: 'mid', rating: 3.4, bio: 'Securing the future of the internet.', experience: 'Founded by ex-CISOs.' },
    { id: 10, name: 'Pioneer Syndicate',  meta: 'Verified • Last active: 1d', focus: 'ClimateTech',  stage: 'Seed', match: 82, matchClass: 'high', rating: 3.7, bio: 'Funding sustainable innovation.', experience: 'Dedicated climate fund since 2018.' },
    // ── Premium tier add-ons (4.0 – 5.0) ──────────────────────────────────
    { id: 11, name: 'Elevate Capital',    meta: 'Top Tier • Last active: Just now', focus: 'AI, DeepTech', stage: 'Series A', match: 98, matchClass: 'high', rating: 4.9, bio: 'Premier deep tech fund for transformative AI.', experience: 'Early backers of major AI unicorns.' },
    { id: 12, name: 'Summit Partners',    meta: 'Verified • Last active: 12h', focus: 'SaaS, Enterprise', stage: 'Series B', match: 94, matchClass: 'high', rating: 4.7, bio: 'Growth equity for scaling software companies.', experience: 'Decades of enterprise software expertise.' },
    { id: 13, name: 'Horizon Ventures',   meta: 'Verified • Last active: 1d', focus: 'BioTech',      stage: 'Seed', match: 91, matchClass: 'high', rating: 4.5, bio: 'Life sciences and advanced therapies.', experience: 'Partners include leading scientists.' },
    { id: 14, name: 'Aegis Capital',      meta: 'Top Tier • Last active: 2h', focus: 'Fintech, Web3',  stage: 'Series A', match: 89, matchClass: 'high', rating: 5.0, bio: 'Decentralized finance and infrastructure.', experience: 'Global crypto native fund.' },
    { id: 15, name: 'Catalyst Angels',    meta: 'Verified • Last active: 3d', focus: 'B2B Marketplaces',stage:'Seed', match: 86, matchClass: 'high', rating: 4.2, bio: 'Connecting businesses through modern platforms.', experience: 'Operators turned investors.' }
];

/* ── Tier Logic ──────────────────────────────────────────────────────────── */
function resolveTier() {
    const raw = (getSubscriptionPlan() || 'free').toLowerCase();
    if (raw.includes('enterprise') || raw.includes('premium')) return 'premium';
    if (raw.includes('standard') || raw.includes('pro'))       return 'pro';
    return 'free';
}

function getTierLimits(tier) {
    if (tier === 'premium') return { maxRequests: Infinity, maxRating: 5.1, label: 'Premium', message: 'Premium users have unlimited access to top-rated investors.' };
    if (tier === 'pro')     return { maxRequests: 50,       maxRating: 4.0, label: 'Pro',     message: 'Pro users can request up to 50 investors with ratings below 4 stars.' };
    return { maxRequests: 1,        maxRating: 3.0, label: 'Free',    message: 'Free users can request only 1 low-rated investor.' };
}

/* ── Main Page ───────────────────────────────────────────────────────────── */
const InvestorsPage = () => {
    // Shared state
    const [selectedInvestor, setSelectedInvestor] = useState(null); // For BookingModal
    const [profileInvestor, setProfileInvestor]   = useState(null); // For Profile Modal
    
    // Tier state
    const tier = resolveTier();
    const limits = getTierLimits(tier);
    
    // Requested array (persisted in localStorage for mock)
    const [requestedIds, setRequestedIds] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('ascendly_investor_requested_ids')) || [];
        } catch {
            return [];
        }
    });

    const isLimitReached = requestedIds.length >= limits.maxRequests;

    // Filter available investors based on tier limits
    // We keep recommended if their rating allows it, plus all dummy ones that fit
    const availablePool = [...recommendedInvestors, ...DUMMY_INVESTORS].filter(
        inv => inv.rating < limits.maxRating
    );

    // Visible initially / Load More logic
    const [visibleCount, setVisibleCount] = useState(4);

    /* ── Handlers ────────────────────────────────────────────────────────── */
    const handleRequestClick = (investor) => {
        if (isLimitReached || requestedIds.includes(investor.id)) return;
        
        setSelectedInvestor(investor);
        
        const newArr = [...requestedIds, investor.id];
        setRequestedIds(newArr);
        localStorage.setItem('ascendly_investor_requested_ids', JSON.stringify(newArr));
    };

    const handleExport = () => {
        const textContent = `-----------------------
ASCENDLY INVESTOR FIT PORTFOLIO
Generated specifically for your startup

[ 1. STARTUP SUMMARY ]
Your startup has shown strong momentum in the past quarter. 
Current focus areas: SaaS, AI/ML Integrations, B2B Growth.
Estimated Funding Goal: Seed / Series A scale.

[ 2. INVESTOR FIT OVERVIEW ]
Top Matches Generated:
- Elevate Capital (DeepTech / AI focused)
- BluePeak Ventures (SaaS / SaaS scale)
- Summit Partners (Enterprise SaaS)
Your traction metrics align closely with their recent investment thesis.

[ 3. KEY STRENGTHS ]
- Sector alignment is exceptionally high (>90% for top 3).
- Your stage (Pre-Seed/Seed) matches their typical initial check size.
- Active portfolio synergies detected.

[ 4. CONCERNS / GAPS to ADDRESS ]
- Some top-tier investors require rigorous due diligence on MRR metrics. 
- Ensure your data room clearly separates service vs software revenue.

[ 5. RECOMMENDATIONS & NEXT STEPS ]
1. Refine high-level metrics deck for BluePeak.
2. Prepare DeepTech validation reports for Elevate Capital.
3. Schedule 1:1 sessions for initial screening over the next 2 weeks.

[ AI-GENERATED INSIGHTS ]
The market for AI-driven Enterprise apps is currently hot. Capitalize on this by emphasizing your integration layer during introductory calls. Stick to a 10-slide deck max for these quick intros.

-- Generated by Ascendly AI --
-----------------------`;
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'investor_report.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
=======
import './InvestorsPage.css';

/* ── Main Page ───────────────────────────────────────────────────────────── */
const InvestorsPage = () => {
    const investors = [
        { name: 'BluePeak Ventures', meta: 'Verified • Last active: 2d', focus: 'SaaS, AI', stage: 'Seed', match: 96, matchClass: 'high' },
        { name: 'Crescent Capital', meta: 'Verified • Last active: 5d', focus: 'Fintech', stage: 'Pre-Seed', match: 74, matchClass: 'mid' },
        { name: 'NorthBridge Angels', meta: 'Verified • Last active: 1w', focus: 'E-commerce', stage: 'Seed', match: 89, matchClass: 'high' },
    ];
>>>>>>> parent of ae17c912 (Update by deleting some files)

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

<<<<<<< HEAD
                    {/* LEFT – Investors table */}
                    <div className="ip-card ip-investors-card">
                        
                        <div className="ip-card-header-flex">
                            <div>
                                <h3 className="ip-card-title">Investors Network Match</h3>
                                <p className="ip-card-subtitle">AI-ranked based on your sector, traction, and stage.</p>
                            </div>
                        </div>

                        {/* Tier Banner */}
                        <div className={`ip-tier-banner ip-tier-banner--${tier}`}>
                            <span className="ip-tier-badge">{limits.label}</span>
                            <span className="ip-tier-msg">{limits.message}</span>
                            {isLimitReached && <span className="ip-tier-limit-msg">(Limit Reached)</span>}
                        </div>
=======
                    {/* LEFT – Recommended Investors table */}
                    <div className="ip-card ip-investors-card">
                        <h3 className="ip-card-title">Recommended Investors</h3>
                        <p className="ip-card-subtitle">AI-ranked based on your sector, traction, and stage.</p>
>>>>>>> parent of ae17c912 (Update by deleting some files)

                        <div className="ip-table-header">
                            <span>Investor</span>
                            <span>Focus</span>
                            <span>Stage</span>
<<<<<<< HEAD
                            <span>Rating</span>
=======
                            <span>Match</span>
>>>>>>> parent of ae17c912 (Update by deleting some files)
                            <span>Action</span>
                        </div>

                        <div className="ip-table-body">
<<<<<<< HEAD
                            {availablePool.slice(0, visibleCount).map((inv) => {
                                const isRequested = requestedIds.includes(inv.id);
                                return (
                                    <div key={inv.id} className="ip-table-row">
                                        <div className="ip-inv-info">
                                            {/* Name is now clickable to open Profile Modal */}
                                            <button 
                                                className="ip-inv-name-link" 
                                                onClick={() => setProfileInvestor(inv)}
                                            >
                                                {inv.name}
                                            </button>
                                            <div className="ip-inv-meta">{inv.meta}</div>
                                        </div>
                                        <div className="ip-inv-focus">{inv.focus}</div>
                                        <div className="ip-inv-stage">{inv.stage}</div>
                                        <div className="ip-inv-match">
                                            <span className={`ip-match-badge ip-match-badge--${inv.matchClass}`}>
                                                {inv.rating.toFixed(1)} / 5.0
                                            </span>
                                        </div>
                                        <div className="ip-inv-action">
                                            <button 
                                                className={isRequested ? "ip-requested-btn" : "ip-request-btn"}
                                                onClick={() => handleRequestClick(inv)}
                                                disabled={isLimitReached || isRequested}
                                                title={isRequested ? "Already requested" : isLimitReached ? "You have reached your tier request limit." : "Request Meeting"}
                                            >
                                                {isRequested ? 'Requested' : isLimitReached ? 'Limit Reached' : 'Request'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Load More Button */}
                        {visibleCount < availablePool.length && (
                            <div className="ip-load-more-container">
                                <button 
                                    className="ip-load-more-btn"
                                    onClick={() => setVisibleCount(v => v + 4)}
                                >
                                    Load More
                                </button>
                            </div>
                        )}
=======
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
>>>>>>> parent of ae17c912 (Update by deleting some files)
                    </div>

                    {/* RIGHT ─ two stacked cards */}
                    <div className="ip-right-col">

                        {/* Deal Pipeline */}
                        <div className="ip-card ip-pipeline-card">
                            <h3 className="ip-card-title">Deal Pipeline</h3>
                            <ul className="ip-bullet-list">
<<<<<<< HEAD
                                <li>Requested: {requestedIds.length}</li>
=======
                                <li>Requested: 5</li>
>>>>>>> parent of ae17c912 (Update by deleting some files)
                                <li>NDA Signed: 2</li>
                                <li>Meetings Scheduled: 1</li>
                                <li>Offers: 0</li>
                            </ul>
<<<<<<< HEAD
                            <button className="ip-export-btn" onClick={handleExport}>
                                Export Investor Report →
                            </button>
=======
                            <button className="ip-export-btn">Export Investor Report →</button>
>>>>>>> parent of ae17c912 (Update by deleting some files)
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
<<<<<<< HEAD

            {/* ── Modals ── */}
            {selectedInvestor && (
                <BookingModal 
                    advisor={selectedInvestor} // Reusing advisor prop internally
                    onClose={() => setSelectedInvestor(null)} 
                />
            )}

            {profileInvestor && (
                <div className="ip-profile-overlay" onClick={() => setProfileInvestor(null)}>
                    <div className="ip-profile-modal" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="ip-pm-header">
                            <div className="ip-pm-avatar">{profileInvestor.name.charAt(0)}</div>
                            <div className="ip-pm-title-block">
                                <h3 className="ip-pm-name">{profileInvestor.name}</h3>
                                <span className="ip-pm-meta">{profileInvestor.meta}</span>
                                <span className={`ip-match-badge ip-match-badge--${profileInvestor.matchClass} ip-pm-badge`}>
                                    {profileInvestor.match}% Match
                                </span>
                            </div>
                            <button className="ip-pm-close" onClick={() => setProfileInvestor(null)}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <div className="ip-pm-body">
                            <div className="ip-pm-section">
                                <h4>Rating</h4>
                                <p className="ip-pm-rating">
                                    <span className={profileInvestor.rating >= 4.5 ? 'ip-pm-gold' : ''}>★</span> {profileInvestor.rating.toFixed(1)} / 5.0
                                </p>
                            </div>

                            <div className="ip-pm-section">
                                <h4>Short Bio</h4>
                                <p>{profileInvestor.bio || "Leading early-stage investments across various tech sectors."}</p>
                            </div>

                            <div className="ip-pm-grid">
                                <div className="ip-pm-section">
                                    <h4>Focus Areas</h4>
                                    <p>{profileInvestor.focus}</p>
                                </div>
                                <div className="ip-pm-section">
                                    <h4>Typical Stage</h4>
                                    <p>{profileInvestor.stage}</p>
                                </div>
                            </div>

                            <div className="ip-pm-section">
                                <h4>Experience & Portfolio</h4>
                                <p>{profileInvestor.experience || "Extensive portfolio of SaaS and enterprise startups. Backed multiple unicorns from Seed to IPO."}</p>
                            </div>
                        </div>

                        <div className="ip-pm-footer">
                            <button className="ip-pm-cancel-btn" onClick={() => setProfileInvestor(null)}>Close</button>
                            <button 
                                className="ip-request-btn"
                                onClick={() => {
                                    setProfileInvestor(null);
                                    handleRequestClick(profileInvestor);
                                }}
                                disabled={isLimitReached}
                            >
                                {isLimitReached ? 'Limit Reached' : 'Request Session'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
        </div>
    );
};

export default InvestorsPage;
