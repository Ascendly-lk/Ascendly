import './StatCard.css';

const StatCard = ({ title, value }) => {
    return (
        <div className="marketing-stat-card">
            <h3 className="stat-title">{title}</h3>
            <div className="stat-value">{value}</div>
        </div>
    );
};

export default StatCard;
