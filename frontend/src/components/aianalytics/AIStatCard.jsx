import './AIStatCard.css';

const AIStatCard = ({ icon, title, value, change, variant = 'dark' }) => {
    const isPositive = change && change.startsWith('+');

    return (
        <div className={`ai-stat-card ai-stat-card--${variant}`}>
            <div className="ai-stat-card__top">
                <div className="ai-stat-card__icon-wrap">
                    {icon}
                </div>
                {change && (
                    <span className={`ai-stat-card__change ${isPositive ? 'positive' : 'negative'}`}>
                        {change}
                    </span>
                )}
            </div>
            <div className="ai-stat-card__body">
                <p className="ai-stat-card__title">{title}</p>
                <p className="ai-stat-card__value">{value}</p>
            </div>
        </div>
    );
};

export default AIStatCard;
