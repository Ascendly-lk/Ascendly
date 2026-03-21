import "./AIAnalytics.css";

const AIAnalytics = () => {
  return (
    <div className="dashboard-page">
      <h1 className="page-title">Welcome, Abdullah !</h1>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon">
              <i className="fi fi-rr-users"></i>
            </div>
            <div className="metric-trend positive">
              +2 <i className="fi fi-rr-arrow-trend-up"></i>
            </div>
          </div>
          <div className="metric-value">12</div>
          <div className="metric-label">Active Startups</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon">
              <i className="fi fi-rs-dollar"></i>
            </div>
            <div className="metric-trend positive">
              +15% <i className="fi fi-rr-arrow-trend-up"></i>
            </div>
          </div>
          <div className="metric-value">$ 3,500</div>
          <div className="metric-label">Monthly Revenue</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon">
              <i className="fi fi-rr-chart-line-up"></i>
            </div>
            <div className="metric-trend negative">
              -5% <i className="fi fi-rr-arrow-trend-down"></i>
            </div>
          </div>
          <div className="metric-value">45 %</div>
          <div className="metric-label">Success Rate</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon">
              <i className="fi fi-rr-eye"></i>
            </div>
            <div className="metric-trend positive">
              +87 <i className="fi fi-rr-arrow-trend-up"></i>
            </div>
          </div>
          <div className="metric-value">156</div>
          <div className="metric-label">Profiles viewed</div>
        </div>
      </div>

      <h2 className="section-title">Quick Actions</h2>

      <div className="dashboard-content-grid">
        <div className="profile-card dashboard-box">
          <div className="box-header">
            <h3>Edit your Profile</h3>
          </div>
          <div className="profile-info">
            <div className="profile-avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abdullah" alt="Abdullah" />
            </div>
            <h2>Abdullah</h2>
            <p className="profile-location">
              <i className="fi fi-rs-marker"></i> Colombo, Sri Lanka
            </p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">Projects</span>
                <span className="stat-number">28</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Followers</span>
                <span className="stat-number">643</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Following</span>
                <span className="stat-number">76</span>
              </div>
            </div>
          </div>
        </div>

        <div className="meetings-card dashboard-box">
          <div className="box-header">
            <h3 className="teal-text">Upcoming Meetings</h3>
          </div>
          <div className="meetings-list">
            <div className="meeting-item">
              <div className="meeting-time">
                <h4>Meet w/ Simmmple</h4>
                <p>01:00 PM - 02:00 PM</p>
              </div>
              <a href="#" className="meeting-link">https://sample.edu/da</a>
            </div>
            <div className="meeting-item">
              <div className="meeting-time">
                <h4>Fitness Training</h4>
                <p>02:00 PM - 03:00 PM</p>
              </div>
              <a href="#" className="meeting-link">https://sample.edu/da</a>
            </div>
            <div className="meeting-item">
              <div className="meeting-time">
                <h4>Reading time</h4>
                <p>03:00 PM - 04:00 PM</p>
              </div>
              <a href="#" className="meeting-link">https://sample.edu/da</a>
            </div>
          </div>
          <div className="view-all">
            <a href="#">View all &gt;&gt;</a>
          </div>
        </div>

        <div className="side-alerts">
          <div className="alert-card">
            <h4>Pending Approvals</h4>
            <div className="alert-value">12</div>
          </div>
          <div className="alert-card">
            <h4>Missed Notifications</h4>
            <div className="alert-value">8</div>
          </div>
          <div className="alert-card">
            <h4>Pending Approvals</h4>
            <div className="alert-value-wrap">
              <span className="alert-value">12</span>
              <span className="alert-trend positive"><i className="fi fi-sr-caret-up"></i> +2.01%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
