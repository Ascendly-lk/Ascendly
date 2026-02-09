import { useParams } from 'react-router-dom';
import './DashboardPlaceholder.css';

const DashboardPlaceholder = () => {
    const { role } = useParams();

    // Map route parameter to display name
    const roleDisplayNames = {
        'founder': 'Startup Founder',
        'investor': 'Investor',
        'marketing': 'Marketing Agency',
        'advisor': 'Business Advisor',
        'admin': 'Admin'
    };

    const displayRole = roleDisplayNames[role] || role;

    return (
        <div className="dashboard-placeholder">
            <div className="dashboard-content">
                <div className="success-icon">✓</div>
                <h1>Welcome to Ascendly</h1>
                <h2>{displayRole} Dashboard</h2>
                <p>Registration successful! You have been redirected to your role-specific dashboard.</p>
                <div className="info-box">
                    <p><strong>Note:</strong> This is a placeholder page. The actual dashboard will be implemented in the next phase.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPlaceholder;
