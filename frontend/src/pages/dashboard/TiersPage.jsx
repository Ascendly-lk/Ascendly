import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TiersPage.css';

/* ── Sidebar (Tiers-active) ─────────────────────────────────────────────── */
const TiersSidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: 'grid' },
        { name: 'Logistics', icon: 'trending' },
        { name: 'AI Analytics', icon: 'brain' },
        { name: 'Patent', icon: 'shield' },
        { name: 'Marketing Agency', icon: 'briefcase' },
        { name: 'Investors', icon: 'users' },
        { name: 'Tiers', icon: 'layers', active: true },
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
        else if (name === 'Investors') navigate('/dashboard/investors');
        else if (name === 'Business Advisors') navigate('/dashboard/advisors');
    };

    return (
        <div className="tp-sidebar">
            <div className="tp-sidebar-header">
                <h1 className="tp-sidebar-logo">Ascendly</h1>
                <p className="tp-sidebar-subtitle">STARTUPS DASHBOARD</p>
            </div>
            <nav className="tp-sidebar-nav">
                {menuItems.map((item) => (
                    <a key={item.name} href="#"
                        className={`tp-sidebar-nav-item${item.active ? ' active' : ''}`}
                        onClick={(e) => handleClick(e, item.name)}>
                        {icons[item.icon]}
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="tp-sidebar-footer">
                <div className="tp-sidebar-upgrade">
                    <p>Upgrade to <strong>PRO</strong> to get access to all features!</p>
                </div>
                <a href="#" className="tp-sidebar-help">
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

/* ── Plans data ──────────────────────────────────────────────────────────── */
const plans = [
    {
        name: 'Starter',
        tagline: 'Perfect for individuals and small teams getting started',
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: ['Core Platform Access', 'Basic Ai Analytics', 'Stranded Support'],
        popular: false,
    },
    {
        name: 'Pro',
        tagline: 'Perfect for Small businesses who want to expand their repertoire',
        monthlyPrice: 25,
        yearlyPrice: 25,
        features: ['Core Platform Access', 'Pro Ai Analytics', 'Extended Support'],
        popular: true,
    },
    {
        name: 'Premium',
        tagline: 'Perfect for established businesses who want to expand their customer base',
        monthlyPrice: 50,
        yearlyPrice: 50,
        features: ['Core Platform Access', 'Complete Ai Analytics', 'Dedicated Support'],
        popular: false,
    },
];

/* ── Tiers Main Page ─────────────────────────────────────────────────────── */
const TiersPage = () => {
    const [billingYearly, setBillingYearly] = useState(false);

    return (
        <div className="tp-shell">
            <TiersSidebar />

            <div className="tp-main">
                {/* ── Top Bar ── */}
                <div className="tp-topbar">
                    <h2 className="tp-topbar-welcome">
                        Welcome, <span>Sanavi</span> !
                    </h2>
                    <div className="tp-topbar-right">
                        <div className="tp-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input type="text" placeholder="Search" />
                        </div>
                        <div className="tp-topbar-icons">
                            <button className="tp-icon-btn" aria-label="Notifications">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                            </button>
                            <button className="tp-icon-btn" aria-label="Settings">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
                                </svg>
                            </button>
                            <button className="tp-icon-btn" aria-label="Profile">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="tp-content">
                    {/* Header row */}
                    <div className="tp-pricing-header">
                        <div>
                            <h1 className="tp-pricing-title">Pricing Packages</h1>
                            <p className="tp-pricing-subtitle">Choose the plan that's right for your startup.</p>
                        </div>
                        {/* Billing toggle */}
                        <div className="tp-billing-toggle">
                            <span className={!billingYearly ? 'tp-toggle-label active' : 'tp-toggle-label'}>Monthly</span>
                            <button
                                className={`tp-toggle-btn${billingYearly ? ' on' : ''}`}
                                onClick={() => setBillingYearly(!billingYearly)}
                                aria-label="Toggle billing period"
                            >
                                <span className="tp-toggle-knob" />
                            </button>
                            <span className={billingYearly ? 'tp-toggle-label active' : 'tp-toggle-label'}>
                                Yearly
                            </span>
                            <span className="tp-saving-badge">+2.45%</span>
                        </div>
                    </div>

                    {/* Plans grid */}
                    <div className="tp-plans-grid">
                        {plans.map((plan) => (
                            <div key={plan.name} className={`tp-plan-card${plan.popular ? ' popular' : ''}`}>
                                {plan.popular && <div className="tp-popular-badge">Most Popular</div>}
                                <h2 className="tp-plan-name">{plan.name}</h2>
                                <p className="tp-plan-tagline">{plan.tagline}</p>

                                <div className="tp-plan-price">
                                    <span className="tp-price-dollar">$ </span>
                                    <span className="tp-price-amount">
                                        {billingYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                    </span>
                                    <span className="tp-price-period"> / month</span>
                                </div>

                                <ul className="tp-features">
                                    {plan.features.map((feat) => (
                                        <li key={feat}>
                                            <span className="tp-check-icon">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                    <polyline points="22 4 12 14.01 9 11.01" />
                                                </svg>
                                            </span>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>

                                <button className="tp-choose-btn">Choose Plan</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TiersPage;
