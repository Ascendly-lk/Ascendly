import './AdvisorsCard.css';

const AdvisorsCard = () => {
    const advisors = [
        { name: 'John Keels Holdings', company: 'Investment Consultant', rating: '4.8', ratingOf: '/5' },
        { name: 'Gayani de Alwis', company: 'Business Strategist', rating: '4.2', ratingOf: '/5' },
        { name: 'Ajith de Costa', company: 'Growth Advisor', rating: '4.0', ratingOf: '/5' },
    ];

    const UserIcon = () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );

    const StarIcon = () => (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
    );

    return (
        <div className="advisors-card">
            <div className="advisors-header">
                <h3>Top Business Advisors</h3>
            </div>

            <div className="advisors-list">
                {advisors.map((advisor, index) => (
                    <div key={index} className="advisor-item">
                        <div className="advisor-avatar">
                            <UserIcon />
                        </div>
                        <div className="advisor-info">
                            <div className="advisor-name">{advisor.name}</div>
                            <div className="advisor-company">{advisor.company}</div>
                        </div>
                        <div className="advisor-rating">
                            <StarIcon />
                            <span className="rating-value">{advisor.rating}</span>
                            <span className="rating-of">{advisor.ratingOf}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="advisors-footer">
                <a href="#" className="view-all-link" aria-label="View all advisors">
                    View all
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default AdvisorsCard;
