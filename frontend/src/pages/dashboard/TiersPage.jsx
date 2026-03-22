import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TiersPage.css';
import TopBar from '../../components/dashboard/TopBar';

/* ── Plans data ──────────────────────────────────────────────────────────── */
const plans = [
    {
        name: 'Free',
        tagline: 'The cheapest way to get started.',
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: ['Core Analytics', 'Limited Use User tracking', 'Simple Dashboard'],
        disabledFeatures: ['Email Support', 'AI Reports'],
        popular: false,
    },
    {
        name: 'Pro',
        tagline: 'The most popular plan.',
        monthlyPrice: 20,
        yearlyPrice: 200,
        features: ['Everything in starter', 'Funnel & drop-off analysis', 'Custom dashboards', 'Team collaboration'],
        disabledFeatures: ['Advanced integrations'],
        popular: true,
    },
    {
        name: 'Premium',
        tagline: 'Contact us for more information.',
        monthlyPrice: 40,
        yearlyPrice: 400,
        features: ['All Growth features', 'Unlimited tracked users', 'Dedicated account manager', 'SLA & compliance support', 'Advanced integrations'],
        disabledFeatures: [],
        popular: false,
    },
];

/* ── Tiers Main Page (sidebar removed — provided by DashboardLayout) ─────── */
const TiersPage = () => {
    const [billingYearly, setBillingYearly] = useState(false);
    const navigate = useNavigate();

    const handleChoosePlan = (plan) => {
        const price = billingYearly ? plan.yearlyPrice : plan.monthlyPrice;
        navigate('/payment', { state: { plan: plan.name, price } });
    };

    return (
        <div className="tp-main">
            {/* ── Top Bar ── */}
            {/* ── Top Bar ── */}
            <TopBar />

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
                        <span className="tp-saving-badge">2 Months Free</span>
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
                                <span className="tp-price-period">
                                    {billingYearly ? ' / year' : ' / month'}
                                </span>
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
                                {plan.disabledFeatures && plan.disabledFeatures.map((feat) => (
                                    <li key={`dis-${feat}`} className="tp-feature-muted">
                                        <span className="tp-minus-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="8" y1="12" x2="16" y2="12" />
                                            </svg>
                                        </span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <button 
                                className="tp-choose-btn"
                                onClick={() => handleChoosePlan(plan)}
                            >
                                Join This Plan
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TiersPage;
