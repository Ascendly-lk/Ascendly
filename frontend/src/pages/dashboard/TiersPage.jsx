import { useState } from 'react';
import './TiersPage.css';

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

/* ── Tiers Main Page (sidebar removed — provided by DashboardLayout) ─────── */
const TiersPage = () => {
    const [billingYearly, setBillingYearly] = useState(false);

    return (
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
    );
};

export default TiersPage;
