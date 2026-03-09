import './StatCard.css';

const StatCard = ({ title, value, icon, variant = 'dark', decoration }) => {
    return (
        <div className={`stat-card stat-card-${variant}`}>
            <div className="stat-card-content">
                {icon && <div className="stat-card-icon">{icon}</div>}
                <div className="stat-card-info">
                    <span className="stat-card-title">{title}</span>
                    <div className="stat-card-value">{value}</div>
                </div>
            </div>
            {decoration && <div className="stat-card-decoration">{decoration}</div>}
        </div>
    );
};

export default StatCard;
