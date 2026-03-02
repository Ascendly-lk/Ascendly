import './FeedbackCategories.css';

const FeedbackCategories = () => {
    // In a real implementation this would use a charting library like Recharts or Chart.js
    // For this exact static replica we will build a CSS donut chart

    return (
        <div className="feedback-categories-card">
            <h3 className="card-title">Feedback Categories</h3>

            <div className="chart-container">
                {/* CSS Donut Chart representation */}
                <div className="donut-chart">
                    {/* The segments would be calculated with conic-gradient in CSS */}
                    <div className="donut-hole"></div>
                </div>

                <div className="legend-grid">
                    <div className="legend-item">
                        <span className="dot" style={{ background: '#00FFEF' }}></span>
                        <span className="label">Service Quality</span>
                    </div>
                    <div className="legend-item">
                        <span className="dot" style={{ background: '#8A2BE2' }}></span>
                        <span className="label">Communication</span>
                    </div>
                    <div className="legend-item">
                        <span className="dot" style={{ background: '#00FF00' }}></span>
                        <span className="label">Results</span>
                    </div>
                    <div className="legend-item">
                        <span className="dot" style={{ background: '#FF7F50' }}></span>
                        <span className="label">Pricing</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackCategories;
