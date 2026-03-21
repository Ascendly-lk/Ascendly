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

const projectStats = [
  { id: 1, label: "Total Startups", value: "12" },
  { id: 2, label: "Active Projects", value: "06" },
  { id: 3, label: "Total Funding raised", value: "$22,000" },
];

const projectCards = [
  {
    id: 1,
    name: "Team Kathaa",
    category: "Saas",
    funding: "$2500",
    score: 8,
    progress: 0.68,
  },
  {
    id: 2,
    name: "Team Kathaa",
    category: "Saas",
    funding: "$2500",
    score: 8,
    progress: 0.68,
  },
  {
    id: 3,
    name: "Team Kathaa",
    category: "Saas",
    funding: "$2500",
    score: 8,
    progress: 0.68,
  },
  {
    id: 4,
    name: "Team Kathaa",
    category: "Saas",
    funding: "$2500",
    score: 8,
    progress: 0.68,
  },
  {
    id: 5,
    name: "Team Kathaa",
    category: "Saas",
    funding: "$2500",
    score: 8,
    progress: 0.68,
  },
  {
    id: 6,
    name: "Team Kathaa",
    category: "Saas",
    funding: "$2500",
    score: 8,
    progress: 0.68,
  },
];

export default function Projects() {
  return (
    <div className="projects-page">
      <Sidebar />

      <main className="projects-main">
        <TopHeader showWelcome={false} />

        <header className="projects-header">
          <h1>Projects</h1>
        </header>

        <section className="projects-stats-grid">
          {projectStats.map((stat) => (
            <article key={stat.id} className="projects-stat-card">
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
            </article>
          ))}
        </section>

        <section className="project-cards-grid">
          {projectCards.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-card-top">
                <span className="project-avatar">TK</span>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.category}</p>
                </div>
              </div>

              <div className="project-progress-wrap">
                <span>progress</span>
                <div className="project-progress-track" role="presentation">
                  <span
                    className="project-progress-fill"
                    style={{ width: `${project.progress * 100}%` }}
                  ></span>
                </div>
              </div>

              <div className="project-meta-row">
                <div className="project-meta-item">
                  <DollarSign />
                  <small>{project.funding}</small>
                </div>
                <div className="project-meta-item">
                  <Users />
                  <small>{project.score}</small>
                </div>
                <div className="project-meta-item">
                  <FileText />
                  <small>Potency Received</small>
                </div>
                <div className="project-meta-item">
                  <Megaphone />
                  <small>Marketing exposure Received</small>
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
          ))}
        </section>
      </main>
    </div>
  );
}
