import SparklineChart from './SparklineChart';
import './AIStatCard.css';

const AIStatCard = ({ icon, title, value, change, variant = 'dark', sparkData }) => {
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
            {sparkData && sparkData.length >= 2 && (
                <div className="ai-stat-card__sparkline">
                    <SparklineChart
                        data={sparkData}
                        color={isPositive ? '#4ade80' : '#f87171'}
                    />
                </div>
            )}
        </div>
    );
};

export default AIStatCard;
