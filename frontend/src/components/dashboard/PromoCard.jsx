import './PromoCard.css';

const PromoCard = () => {
    return (
        <div className="promo-card">
            <div className="promo-content">
                <h2>Try Ascendly for free now!</h2>
                <p>"From Idea to Impact, We help you Ascend"</p>
                <div className="promo-buttons">
                    <button className="promo-button-primary">Try for free</button>
                    <button className="promo-button-secondary">Skip</button>
                </div>
            </div>
            <div className="promo-visual">
                <div className="promo-visual-inner">
                    {/* QR-style decorative SVG */}
                    <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                        {/* QR blocks */}
                        <rect x="8" y="8" width="22" height="22" rx="3" fill="rgba(0,229,255,0.15)" stroke="#00E5FF" strokeWidth="1.5" />
                        <rect x="13" y="13" width="12" height="12" rx="1" fill="#00E5FF" opacity="0.6" />
                        <rect x="40" y="8" width="22" height="22" rx="3" fill="rgba(0,229,255,0.15)" stroke="#00E5FF" strokeWidth="1.5" />
                        <rect x="45" y="13" width="12" height="12" rx="1" fill="#00E5FF" opacity="0.6" />
                        <rect x="8" y="40" width="22" height="22" rx="3" fill="rgba(0,229,255,0.15)" stroke="#00E5FF" strokeWidth="1.5" />
                        <rect x="13" y="45" width="12" height="12" rx="1" fill="#00E5FF" opacity="0.6" />
                        {/* QR dots */}
                        <rect x="40" y="40" width="5" height="5" rx="1" fill="#00E5FF" opacity="0.5" />
                        <rect x="48" y="40" width="5" height="5" rx="1" fill="#00E5FF" opacity="0.7" />
                        <rect x="56" y="40" width="5" height="5" rx="1" fill="#00E5FF" opacity="0.4" />
                        <rect x="40" y="48" width="5" height="5" rx="1" fill="#00E5FF" opacity="0.7" />
                        <rect x="48" y="48" width="5" height="5" rx="1" fill="#00E5FF" opacity="0.3" />
                        <rect x="56" y="48" width="5" height="5" rx="1" fill="#00E5FF" opacity="0.6" />
                        <rect x="40" y="56" width="5" height="5" rx="1" fill="#00E5FF" opacity="0.5" />
                        <rect x="56" y="56" width="5" height="5" rx="1" fill="#00E5FF" opacity="0.4" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default PromoCard;
