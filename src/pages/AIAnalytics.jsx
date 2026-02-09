import "./PageStyles.css";

const AIAnalytics = () => {
  const insights = [
    {
      title: "Revenue Prediction",
      value: "+23%",
      description: "Expected growth in Q2",
      confidence: 87,
    },
    {
      title: "Customer Churn Risk",
      value: "12%",
      description: "Lower than industry average",
      confidence: 92,
    },
    {
      title: "Market Expansion",
      value: "3 Markets",
      description: "Recommended for expansion",
      confidence: 78,
    },
    {
      title: "Product Demand",
      value: "High",
      description: "Seasonal peak expected",
      confidence: 85,
    },
  ];

  const trends = [
    { metric: "User Engagement", current: 78, previous: 65, trend: "up" },
    { metric: "Conversion Rate", current: 4.2, previous: 3.8, trend: "up" },
    { metric: "Bounce Rate", current: 32, previous: 38, trend: "down" },
    { metric: "Session Duration", current: 5.4, previous: 4.9, trend: "up" },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">AI Analytics</h1>
        <p className="page-description">
          AI-powered insights and predictions for your business
        </p>
      </div>

      <div className="stats-row">
        <div className="stat-card accent">
          <div className="stat-icon">🤖</div>
          <div className="stat-info">
            <span className="stat-value">24</span>
            <span className="stat-label">Active AI Models</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <span className="stat-value">1.2M</span>
            <span className="stat-label">Data Points Analyzed</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-value">94%</span>
            <span className="stat-label">Prediction Accuracy</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <span className="stat-value">Real-time</span>
            <span className="stat-label">Data Processing</span>
          </div>
        </div>
      </div>

      <div className="content-columns">
        <div className="card">
          <h3 className="card-heading">AI Insights</h3>
          <div className="insights-grid">
            {insights.map((insight, index) => (
              <div key={index} className="insight-card">
                <div className="insight-header">
                  <h4>{insight.title}</h4>
                  <span className="insight-value">{insight.value}</span>
                </div>
                <p className="insight-description">{insight.description}</p>
                <div className="confidence-bar">
                  <div className="confidence-label">
                    <span>Confidence</span>
                    <span>{insight.confidence}%</span>
                  </div>
                  <div className="confidence-track">
                    <div
                      className="confidence-fill"
                      style={{ width: `${insight.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="card-heading">Performance Trends</h3>
          <div className="trends-list">
            {trends.map((trend, index) => (
              <div key={index} className="trend-item">
                <div className="trend-info">
                  <span className="trend-metric">{trend.metric}</span>
                  <span className={`trend-indicator ${trend.trend}`}>
                    {trend.trend === "up" ? "↑" : "↓"}
                    {trend.trend === "up" ? "+" : ""}
                    {(
                      ((trend.current - trend.previous) / trend.previous) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className="trend-values">
                  <span className="current-value">
                    {trend.current}
                    {typeof trend.current === "number" && trend.current < 10
                      ? "%"
                      : ""}
                  </span>
                  <span className="previous-value">vs {trend.previous}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
