import './AdvisorsCard.css';

const AdvisorsCard = () => {
    const advisors = [
        { name: 'John Keels Holdings PLC', rating: '4.8/5' },
        { name: 'Gayani de Alwis', rating: '4.2/5' },
        { name: 'Ajith de Costa', rating: '4.0/5' }
    ];

    const userIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );

    return (
        <div className="advisors-card">
            <h3>Top Business Advisors</h3>
            <div className="advisors-list">
                {advisors.map((advisor, index) => (
                    <div key={index} className="advisor-item">
                        <div className="advisor-avatar">
                            {userIcon}
                        </div>
                        <div className="advisor-info">
                            <div className="advisor-name">{advisor.name}</div>
                        </div>
                        <div className="advisor-rating">
                            <svg viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            {advisor.rating}
                        </div>
                    </div>
                ))}
            </div>
            <div className="advisors-footer">
                <a href="#" className="view-all-link">
                    View all
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default AdvisorsCard;
