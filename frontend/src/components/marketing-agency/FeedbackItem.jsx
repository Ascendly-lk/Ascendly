import './FeedbackItem.css';

const FeedbackItem = ({ name, date, comment, isPositive, category }) => {
    return (
        <div className="feedback-item">
            <div className="feedback-item-header">
                <div className="company-info">
                    <h4 className="company-name">{name}</h4>
                    <span className="feedback-date">{date}</span>
                </div>

                <div className="rating-badge-container">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} viewBox="0 0 24 24" fill="#00FFEF" stroke="none" className="star-icon">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        ))}
                    </div>
                    {isPositive && (
                        <span className="badge positive">positive</span>
                    )}
                </div>
            </div>

            <p className="feedback-comment">&quot;{comment}&quot;</p>

            {category && (
                <div className="feedback-category-badge">
                    {category}
                </div>
            )}
        </div>
    );
};

export default FeedbackItem;
