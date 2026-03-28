import React from "react";
import "./Dashboard.css";

const MetricCard = ({ icon, title, value, variant, chartType }) => (
  <div className={`metric-card ${variant === "primary" ? "primary-card" : ""}`}>
    <div className="metric-info">
      <div className="metric-icon-wrapper">{icon}</div>
      <div className="metric-text">
        <span className="metric-title">{title}</span>
        <span className="metric-value">{value}</span>
      </div>
    </div>
    {chartType === "circle" && (
      <div className="circle-chart">
        <svg viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#00D9C9" strokeWidth="3"
            strokeDasharray="81 19" strokeLinecap="round" transform="rotate(-90 18 18)" />
        </svg>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const advisors = [
    {
      name: "John Keels Holdings PLC",
      rating: "4.8/5",
      image: "https://ui-avatars.com/api/?name=JK&background=00D9C9&color=000",
    },
    {
      name: "Gayani de Alwis",
      rating: "4.2/5",
      image: "https://ui-avatars.com/api/?name=GA&background=00D9C9&color=000",
    },
    {
      name: "Ajith de Costa",
      rating: "4.0/5",
      image: "https://ui-avatars.com/api/?name=AC&background=00D9C9&color=000",
    },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-welcome">Welcome, Sanavi !</h1>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <MetricCard
          icon={<i className="fi fi-sr-users"></i>}
          title="Active users"
          value="1892"
          variant="primary"
        />

        <MetricCard
          icon={<i className="fi fi-ss-chart-simple"></i>}
          title="Monthly Revenue"
          value="$18,500"
        />

        <MetricCard
          icon={<i className="fi fi-sr-chart-simple-horizontal"></i>}
          title="Engagement Score"
          value="81/100"
          chartType="circle"
        />

        {/* Growth card */}
        <div className="metric-card growth-card">
          <div className="metric-info">
            <div className="metric-text">
              <span className="metric-title">Growth</span>
              <span className="metric-value">+17.4%</span>
            </div>
          </div>
          <div className="mini-chart">
            <svg viewBox="0 0 100 40">
              <path
                d="M0,35 Q20,35 40,20 T100,10"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Middle Row: Forecast (Wide) & Advisors (Narrow) */}
      <div className="content-grid">
        {/* AI Forecasting Section */}
        <div className="card forecast-card">
          <div className="card-header">
            <h3 className="card-title">AI Forecasting</h3>
            <select className="period-select" defaultValue="monthly">
              <option value="monthly">Monthly</option>
              <option value="Day">day</option>
              <option value="Yearly">Yearly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          <div className="forecast-content">
            <div className="forecast-stats">
              <div className="forecast-box gradient-teal">
                <span className="forecast-label">After 6 months</span>
                <div className="forecast-value-row">
                  <span className="value">43.50%</span>
                  <span className="trend pill">+2.45%</span>
                </div>
              </div>
              <div className="forecast-box gradient-dark">
                <span className="forecast-label">Before 6 months</span>
                <div className="forecast-value-row">
                  <span className="value">$52,422</span>
                  <span className="trend pill negative">-4.75%</span>
                </div>
              </div>
            </div>

            {/* Smooth Bezier curve chart */}
            <div className="chart-placeholder">
              <svg viewBox="0 0 500 150" className="line-chart" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0, 255, 239, 0.3)" />
                    <stop offset="100%" stopColor="rgba(15, 23, 32, 0.3)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,120 C50,120 80,80 120,80 C160,80 180,110 220,110 C260,110 290,50 340,50 C390,50 420,70 500,70 L500,150 L0,150 Z"
                  fill="url(#chartGradient)"
                />
                <path
                  d="M0,120 C50,120 80,80 120,80 C160,80 180,110 220,110 C260,110 290,50 340,50 C390,50 420,70 500,70"
                  fill="none"
                  stroke="#00D9C9"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Top Business Advisors */}
        <div className="card advisors-card">
          <h3 className="card-title">Top Business Advisors</h3>
          <div className="advisors-list">
            {advisors.map((advisor, index) => (
              <div key={index} className="advisor-item">
                <img
                  src={advisor.image}
                  alt={advisor.name}
                  className="advisor-avatar"
                />
                <div className="advisor-info">
                  <span className="advisor-name">{advisor.name}</span>
                </div>
                <div className="rating-badge">
                  <span className="star">★</span> {advisor.rating}
                </div>
              </div>
            ))}
          </div>
          <div className="advisors-footer">
            <button className="view-all-btn">View all →</button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Promo (Wide) & Revenue (Narrow) */}
      <div className="content-grid">
        {/* Promotional Card */}
        <div className="card promo-card">
          <div className="promo-content">
            <h2 className="promo-title">Try Ascendly for<br />free now!</h2>
            <p className="promo-subtitle">"From Idea to Impact, We help you Ascend"</p>
            <div className="promo-actions">
              <button className="btn btn-primary">Try for free</button>
              <button className="btn-link">Skip</button>
            </div>
          </div>
          {/* Abstract Tech Graphic representation */}
          <div className="promo-image-container">
            <div className="tech-box">
              <div className="scan-line"></div>
              <div className="qr-code-mock"></div>
            </div>
          </div>
        </div>

        {/* Revenue Trend */}
        <div className="card revenue-card">
          <div className="card-header">
            <h3 className="card-title">Revenue Trend</h3>
            <select className="period-select" defaultValue="monthly">
              <option value="monthly">Monthly</option>
              <option value="Day">day</option>
              <option value="Yearly">Yearly</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
          <div className="revenue-content">
            <div className="revenue-value">$682.5</div>
            <div className="revenue-status">
              <span className="status-dot">✔</span>
              On track
            </div>
            <div className="revenue-chart">
              <div className="bar-chart">
                {[65, 45, 85, 55, 70, 90, 35].map((height, index) => (
                  <div
                    key={index}
                    className="bar"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
