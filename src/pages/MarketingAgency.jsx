import "./PageStyles.css";

const MarketingAgency = () => {
  const campaigns = [
    {
      name: "Summer Sale 2024",
      status: "Active",
      reach: "45.2K",
      engagement: "12.5%",
      budget: "$5,000",
      spent: "$3,200",
    },
    {
      name: "Product Launch",
      status: "Scheduled",
      reach: "-",
      engagement: "-",
      budget: "$10,000",
      spent: "$0",
    },
    {
      name: "Brand Awareness",
      status: "Active",
      reach: "120K",
      engagement: "8.2%",
      budget: "$15,000",
      spent: "$8,500",
    },
    {
      name: "Holiday Special",
      status: "Completed",
      reach: "89.5K",
      engagement: "15.3%",
      budget: "$8,000",
      spent: "$7,800",
    },
  ];

  const socialStats = [
    {
      platform: "Instagram",
      followers: "25.4K",
      growth: "+12%",
      engagement: "5.2%",
      icon: "📸",
    },
    {
      platform: "Twitter",
      followers: "18.2K",
      growth: "+8%",
      engagement: "3.8%",
      icon: "🐦",
    },
    {
      platform: "LinkedIn",
      followers: "12.8K",
      growth: "+15%",
      engagement: "6.1%",
      icon: "💼",
    },
    {
      platform: "Facebook",
      followers: "32.1K",
      growth: "+5%",
      engagement: "4.5%",
      icon: "👥",
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Marketing Agency</h1>
          <p className="page-description">
            Manage campaigns and track marketing performance
          </p>
        </div>
        <button className="btn btn-primary">+ New Campaign</button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📢</div>
          <div className="stat-info">
            <span className="stat-value">8</span>
            <span className="stat-label">Active Campaigns</span>
          </div>
        </div>
        <div className="stat-card accent">
          <div className="stat-icon">👁️</div>
          <div className="stat-info">
            <span className="stat-value">254.7K</span>
            <span className="stat-label">Total Reach</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-value">$38,000</span>
            <span className="stat-label">Total Budget</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-value">10.2%</span>
            <span className="stat-label">Avg. Engagement</span>
          </div>
        </div>
      </div>

      <div className="content-columns">
        <div className="card">
          <h3 className="card-heading">Campaign Performance</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Reach</th>
                  <th>Engagement</th>
                  <th>Budget</th>
                  <th>Spent</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr key={index}>
                    <td className="name-cell">{campaign.name}</td>
                    <td>
                      <span
                        className={`status-badge ${campaign.status.toLowerCase()}`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td>{campaign.reach}</td>
                    <td>{campaign.engagement}</td>
                    <td>{campaign.budget}</td>
                    <td>{campaign.spent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="card-heading">Social Media Stats</h3>
          <div className="social-grid">
            {socialStats.map((social, index) => (
              <div key={index} className="social-card">
                <div className="social-icon">{social.icon}</div>
                <div className="social-info">
                  <h4>{social.platform}</h4>
                  <div className="social-stats">
                    <div className="social-stat">
                      <span className="stat-value">{social.followers}</span>
                      <span className="stat-label">Followers</span>
                    </div>
                    <div className="social-stat">
                      <span className="stat-value growth">{social.growth}</span>
                      <span className="stat-label">Growth</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingAgency;
