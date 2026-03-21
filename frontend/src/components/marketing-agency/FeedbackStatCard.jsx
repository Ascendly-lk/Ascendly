import './FeedbackStatCard.css';

const FeedbackStatCard = ({ icon, title, value, detail, valueColor, iconBgUrl }) => {
    return (
        <div className="feedback-stat-card">
            <div className="stat-header">
                <div className="icon-wrapper" style={{ backgroundImage: iconBgUrl }}>
                    {icon}
                </div>
                <h3 className="stat-title" style={{ color: valueColor || '#00FFEF' }}>{title}</h3>
            </div>
            <div className="stat-body">
                <div className="stat-value">{value}</div>
                {detail && <div className="stat-detail">{detail}</div>}
            </div>
        </div>
    );
};

export default FeedbackStatCard;
