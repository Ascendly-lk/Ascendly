import "./Projects.css";

const Projects = () => {
  const projects = Array(5).fill({
    id: 1, // Will be overridden in map but fine for this dummy data
    title: "Team Kathaa",
    category: "Saas",
    progress: 75,
    funding: "$2500",
    members: 8,
    patency: "Patency Received",
    marketing: "Marketing exposure Received",
  });

  return (
    <div className="projects-page">
      <h1 className="page-title projects-title">Projects</h1>

      <div className="projects-summary">
        <div className="summary-card">
          <div className="summary-label">Total Startups</div>
          <div className="summary-value">12</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Active Projects</div>
          <div className="summary-value">06</div>
        </div>
        <div className="summary-card">
          <div className="summary-label">Total Funding raised</div>
          <div className="summary-value">$22,000</div>
        </div>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <div className="project-header">
              <div className="project-avatar">TK</div>
              <div className="project-info">
                <h2>{project.title}</h2>
                <p>{project.category}</p>
              </div>
            </div>

            <div className="project-progress">
              <div className="progress-label">progress</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="project-metrics">
              <div className="metric-col">
                <i className="fi fi-rs-dollar"></i>
                <span>{project.funding}</span>
              </div>
              <div className="metric-col">
                <i className="fi fi-rr-users"></i>
                <span>{project.members}</span>
              </div>
              <div className="metric-col text-center document-col">
                <i className="fi fi-rr-document-signed"></i>
                <span dangerouslySetInnerHTML={{ __html: project.patency.replace(' ', '<br/>') }}></span>
              </div>
              <div className="metric-col text-center chat-col">
                <i className="fi fi-rr-messages"></i>
                <span dangerouslySetInnerHTML={{ __html: project.marketing.replace(' ', '<br/>').replace(' ', '<br/>') }}></span>
              </div>
            </div>

            <div className="project-footer">
              <button className="btn-view-details">
                View Details <i className="fi fi-rr-arrow-right"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
