import "./Startups.css";

const Startups = () => {
  const startups = Array(6).fill({
    id: 1,
    title: "Team Kathaa",
    category: "Saas",
    progress: 75,
    funding: "$2500",
    members: 8,
    patency: "Patency Received",
    marketing: "Marketing exposure Received",
  });

  return (
    <div className="startups-page">
      <h1 className="page-title startups-title">Startups</h1>

      <div className="startups-summary">
        <div className="summary-card">
          <div className="summary-label">Total Startups</div>
          <div className="summary-value">12</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Funded Startups</div>
          <div className="summary-value">06</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Funding Issued</div>
          <div className="summary-value">$22,000</div>
        </div>
      </div>

      <div className="startups-grid">
        {startups.map((startup, index) => (
          <div key={index} className="startup-card">
            <div className="startup-header">
              <div className="startup-avatar">TK</div>
              <div className="startup-info">
                <h2>{startup.title}</h2>
                <p>{startup.category}</p>
              </div>
              <button className="btn-view-details">
                View Details <i className="fi fi-rr-arrow-right"></i>
              </button>
            </div>

            <div className="startup-progress-section">
              <div className="progress-label">Progress</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${startup.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="startup-metrics">
              <div className="metric-row">
                <div className="metric-item">
                  <span className="metric-icon money">$</span>
                  <span className="metric-value">{startup.funding}</span>
                </div>
                <div className="metric-item">
                  <span className="metric-icon people">
                    <i className="fi fi-rr-users"></i>
                  </span>
                  <span className="metric-value">{startup.members}</span>
                </div>
              </div>
              
              <div className="metric-row tags">
                <div className="metric-tag">
                  <i className="fi fi-rr-document-signed"></i> Patency Received
                </div>
                <div className="metric-tag">
                  <i className="fi fi-rr-megaphone"></i> Marketing exposure Received
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Startups;
