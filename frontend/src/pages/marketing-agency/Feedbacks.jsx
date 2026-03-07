import MarketingSidebar from '../../components/marketing-agency/MarketingSidebar';
import StatCard from '../../components/marketing-agency/StatCard';
import RatingDistribution from '../../components/marketing-agency/RatingDistribution';
import FeedbackCategories from '../../components/marketing-agency/FeedbackCategories';
import FeedbackItem from '../../components/marketing-agency/FeedbackItem';
import './Feedbacks.css';

const Feedbacks = () => {
    const feedbackData = [
        {
            id: 1,
            name: "TechFlow Inc.",
            date: "Dec 14, 2024",
            comment: "Outstanding campaign execution! The team exceeded our expectations with their creative approach and data-driven strategies. ROI increased by 340%.",
            isPositive: true,
            category: "Results"
        },
        {
            id: 2,
            name: "FinTech Pro",
            date: "Dec 12, 2024",
            comment: "Excellent communication throughout the project. Always responsive and proactive with updates.",
            isPositive: true,
            category: "Communication"
        }
    ];

    return (
        <div className="marketing-feedbacks-layout">
            <MarketingSidebar />

            <main className="feedbacks-main-content">
                <div className="projects-header">
                    <h1 className="page-title">Client Feedback & Reviews</h1>

                    <div className="search-bar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.35-4.35" />
                        </svg>
                        <input type="text" placeholder="Search" />
                    </div>
                </div>

                <div className="stats-row">
                    <StatCard title="Average Rating" value="4.8 / 5.0" />
                    <StatCard title="Total Reviews" value="128" />
                    <StatCard title="Satisfaction Rate" value="96%" />
                    <StatCard title="Growth" value="+12%" />
                </div>

                <div className="feedback-charts-row">
                    <RatingDistribution />
                    <FeedbackCategories />
                </div>

                <div className="feedback-list-section">
                    <div className="list-filters-bar">
                        <div className="list-search">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                            <input type="text" placeholder="Search feedback..." />
                        </div>
                        <button className="filter-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                        </button>
                    </div>

                    <div className="feedback-items-container">
                        {feedbackData.map((feedback) => (
                            <FeedbackItem key={feedback.id} {...feedback} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feedbacks;
