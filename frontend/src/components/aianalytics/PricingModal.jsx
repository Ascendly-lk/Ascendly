import { useEffect, useState } from 'react';
import { apiFetch } from '../../api';
import './PricingModal.css';

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="pricing-check-icon">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pricing-close-icon">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="pricing-spark-icon">
    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
  </svg>
);

/**
 * PricingModal
 * Props:
 *   isOpen       — boolean
 *   onClose      — () => void
 *   limitError   — { action, tier, used, limit } | null
 */
export default function PricingModal({ isOpen, onClose, limitError }) {
  const [tiers, setTiers] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [upgradeStatus, setUpgradeStatus] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    setUpgradeStatus(null);
    setLoadingPricing(true);
    apiFetch('/api/subscription/pricing')
      .then(r => r.json())
      .then(data => setTiers(data.tiers || []))
      .catch(() => {})
      .finally(() => setLoadingPricing(false));

    setLoadingSuggest(true);
    apiFetch('/api/subscription/suggest')
      .then(r => r.json())
      .then(data => setSuggestion(data))
      .catch(() => {})
      .finally(() => setLoadingSuggest(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const hasLimitDetails =
    limitError &&
    typeof limitError.used === 'number' &&
    typeof limitError.limit === 'number' &&
    typeof limitError.action === 'string' &&
    limitError.limit > 0;

  const limitMsg = hasLimitDetails
    ? `You've used ${limitError.used}/${limitError.limit} ${limitError.action === 'analysis' ? 'analyses' : 'chat queries'} this month.`
    : null;

  const handleUpgrade = async (tierId) => {
    if (suggestion?.current_tier === tierId) return;
    setUpgradeStatus('loading');
    try {
      const res = await apiFetch('/api/subscription/upgrade', {
        method: 'POST',
        body: JSON.stringify({ tier_id: tierId }),
      });
      const data = await res.json();
      setUpgradeStatus(data.status === 'demo' ? 'demo' : 'done');
    } catch {
      setUpgradeStatus('error');
    }
  };

  const formatLimit = (val) => (val === -1 ? 'Unlimited' : val);

  return (
    <div className="pricing-overlay" onClick={onClose}>
      <div className="pricing-modal" onClick={e => e.stopPropagation()}>
        <button className="pricing-close-btn" onClick={onClose} aria-label="Close">
          <CloseIcon />
        </button>

        <div className="pricing-header">
          <h2 className="pricing-title">Upgrade Your Plan</h2>
          {limitMsg && (
            <p className="pricing-limit-msg">{limitMsg} Upgrade to continue.</p>
          )}
        </div>

        {/* AI Suggestion Banner */}
        {suggestion && !loadingSuggest && suggestion.suggested_tier !== suggestion.current_tier && (
          <div className="pricing-suggestion-banner">
            <SparkIcon />
            <span>
              <strong>AI recommends {suggestion.suggested_tier}</strong> — {suggestion.reason}
            </span>
          </div>
        )}

        {/* Tier Cards */}
        <div className="pricing-tiers">
          {loadingPricing ? (
            <div className="pricing-loading">Loading plans…</div>
          ) : (
            tiers.map(tier => {
              const isSuggested = suggestion?.suggested_tier === tier.id;
              const isPopular = tier.is_popular;
              const features = Array.isArray(tier.features) ? tier.features : JSON.parse(tier.features || '[]');

              return (
                <div
                  key={tier.id}
                  className={`pricing-tier-card ${isPopular ? 'pricing-tier-popular' : ''} ${isSuggested ? 'pricing-tier-suggested' : ''}`}
                >
                  {isPopular && <span className="pricing-badge pricing-badge-popular">Most Popular</span>}
                  {isSuggested && !isPopular && <span className="pricing-badge pricing-badge-ai">AI Pick</span>}

                  <div className="pricing-tier-name">{tier.name}</div>
                  <div className="pricing-tier-price">
                    {tier.price_monthly === 0 ? (
                      <span className="pricing-price-free">Free</span>
                    ) : (
                      <>
                        <span className="pricing-price-amount">${tier.price_monthly}</span>
                        <span className="pricing-price-period">/mo</span>
                      </>
                    )}
                  </div>

                  <ul className="pricing-features-list">
                    <li><CheckIcon />{formatLimit(tier.analyses_per_month)} analyses/month</li>
                    <li><CheckIcon />{formatLimit(tier.chat_queries_per_month)} chat queries/month</li>
                    {features.map((f, i) => (
                      <li key={i}><CheckIcon />{f}</li>
                    ))}
                  </ul>

                  <button
                    className={`pricing-upgrade-btn ${suggestion?.current_tier === tier.id ? 'pricing-upgrade-btn-secondary' : 'pricing-upgrade-btn-primary'}`}
                    onClick={() => handleUpgrade(tier.id)}
                    disabled={upgradeStatus === 'loading' || suggestion?.current_tier === tier.id}
                  >
                    {suggestion?.current_tier === tier.id ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Upgrade status messages */}
        {upgradeStatus === 'demo' && (
          <p className="pricing-status-msg pricing-status-demo">
            Payment integration coming soon — contact us to upgrade early.
          </p>
        )}
        {upgradeStatus === 'error' && (
          <p className="pricing-status-msg pricing-status-error">Something went wrong. Please try again.</p>
        )}
      </div>
    </div>
  );
}
