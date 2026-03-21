import './RatingDistribution.css';

const RatingDistribution = () => {
    const ratings = [
        { stars: 5, count: 87, width: '65%' },
        { stars: 4, count: 28, width: '30%' },
        { stars: 3, count: 10, width: '15%' },
        { stars: 2, count: 2, width: '4%' },
        { stars: 1, count: 1, width: '2%' }
    ];

    return (
        <div className="rating-distribution-card">
            <h3 className="card-title">Rating Distribution</h3>

            <div className="rating-bars-container">
                {ratings.map((rating) => (
                    <div key={rating.stars} className="rating-row">
                        <span className="star-label">{rating.stars} Stars</span>
                        <div className="bar-track">
                            <div className="bar-fill" style={{ width: rating.width }}></div>
                        </div>
                        <span className="star-count">{rating.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingDistribution;
