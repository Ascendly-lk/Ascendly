import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopHeader from "../../components/TopHeader";
import {
  CircleArrowOutUpRight,
  DollarSign,
  FileText,
  Megaphone,
  Users,
} from "lucide-react";
import "./Projects.css";

const projectCards = [
  { id: 1, name: 'Nexus AI', category: 'SaaS', initials: 'NA', fundingAmount: 5000, funding: '$5,000', score: 9, progress: 0.85, potencyReceived: true, marketingExposure: true },
  { id: 2, name: 'GreenLeaf', category: 'AgriTech', initials: 'GL', fundingAmount: 3500, funding: '$3,500', score: 8, progress: 0.60, potencyReceived: true, marketingExposure: false },
  { id: 3, name: 'FinFlow', category: 'FinTech', initials: 'FF', fundingAmount: 4200, funding: '$4,200', score: 7, progress: 0.75, potencyReceived: false, marketingExposure: true },
  { id: 4, name: 'BluePulse', category: 'HealthTech', initials: 'BP', fundingAmount: 2000, funding: '$2,000', score: 9, progress: 0.45, potencyReceived: true, marketingExposure: true },
  { id: 5, name: 'EcoDrive', category: 'CleanTech', initials: 'ED', fundingAmount: 1500, funding: '$1,500', score: 6, progress: 0.35, potencyReceived: false, marketingExposure: false },
  { id: 6, name: 'NovaStore', category: 'E-commerce', initials: 'NS', fundingAmount: 500, funding: '$500', score: 5, progress: 0.20, potencyReceived: true, marketingExposure: false }
];

const totalStartups = projectCards.length;
const activeProjects = projectCards.filter(p => p.progress > 0).length;
const totalFunding = projectCards.reduce((acc, p) => acc + p.fundingAmount, 0);

const projectStats = [
  { id: 1, label: 'Total Startups', value: String(totalStartups).padStart(2, '0') },
  { id: 2, label: 'Active Projects', value: String(activeProjects).padStart(2, '0') },
  { id: 3, label: 'Total Funding raised', value: `$${totalFunding.toLocaleString()}` }
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const ProjectCard = ({ project }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const progressPercent = Math.round(project.progress * 100);
  let progressColorClass = '';
  if (project.progress < 0.3) progressColorClass = 'danger';
  else if (project.progress > 0.8) progressColorClass = 'excellent';

  return (
    <article className="project-card">
      <div className="project-card-top">
        <span className="project-avatar">{project.initials}</span>
        <div>
          <h3>{project.name}</h3>
          <p>{project.category}</p>
        </div>
      </div>

      <div className="project-progress-wrap">
        <span>progress</span>
        <div 
          className="project-progress-track" 
          role="presentation"
          title={`${progressPercent}% Complete`}
        >
          <span
            className={`project-progress-fill ${progressColorClass}`}
            style={{ 
              width: loaded ? `${progressPercent}%` : '0%',
              transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}
          ></span>
        </div>
      </div>

      <div className="project-meta-row">
        <div className="project-meta-item">
          <DollarSign />
          <small>{formatCurrency(project.fundingAmount)}</small>
        </div>
        <div className="project-meta-item">
          <Users />
          <small>{project.score}/10</small>
        </div>
        <div className={`project-meta-item ${project.potencyReceived ? 'active-icon' : 'inactive-icon'}`}>
          <FileText />
          <small>Potency Received</small>
        </div>
        <div className={`project-meta-item ${project.marketingExposure ? 'active-icon' : 'inactive-icon'}`}>
          <Megaphone />
          <small>Marketing exposure</small>
        </div>
      </div>

      <button
        type="button"
        className="project-detail-btn"
        aria-label="View project details"
      >
        View Details <CircleArrowOutUpRight />
      </button>
    </article>
  );
};

export default function Projects() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="projects-main" style={{ marginLeft: '260px', flexGrow: 1, minWidth: 0, padding: '28px 40px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1400px' }}>
          <TopHeader showWelcome={false} title="Projects" />

        <section className="projects-stats-grid">
          {projectStats.map((stat) => (
            <article key={stat.id} className={`projects-stat-card ${stat.label === "Active Projects" ? "active-cyan" : ""}`}>
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
            </article>
          ))}
        </section>

        <section className="project-cards-grid">
          {projectCards.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
        </div>
      </main>
    </div>
  );
}
