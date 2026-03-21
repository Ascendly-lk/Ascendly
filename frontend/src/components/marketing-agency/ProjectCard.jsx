import './ProjectCard.css';

const ProjectCard = ({ project }) => {
    return (
        <div className="project-card">
            <div className="project-header">
                <div className="project-avatar">{project.initials}</div>
                <div className="project-info">
                    <h3 className="project-name">{project.name}</h3>
                    <p className="project-type">{project.type}</p>
                </div>
            </div>

            <div className="project-progress-container">
                <p className="progress-label">progress</p>
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{ width: `${project.progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="project-metrics">
                <div className="metric">
                    <span className="metric-icon">$</span>
                    <span className="metric-value">${project.budget}</span>
                </div>
                <div className="metric">
                    <span className="metric-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                    </span>
                    <span className="metric-value">{project.teamSize}</span>
                </div>
                <div className="metric">
                    <span className="metric-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                    </span>
                    <span className="metric-value">Patency<br />Received</span>
                </div>
                <div className="metric">
                    <span className="metric-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
                    </span>
                    <span className="metric-value">Marketing<br />exposure<br />Received</span>
                </div>
            </div>

            <div className="project-footer">
                <button className="view-details-btn">
                    View Details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
