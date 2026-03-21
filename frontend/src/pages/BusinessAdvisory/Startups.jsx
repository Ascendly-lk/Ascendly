import {
  CircleArrowOutUpRight,
  DollarSign,
  FileText,
  Megaphone,
  Users,
} from "lucide-react";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/TopHeader";
import "./Startups.css";

const projectStats = [
  { id: 1, label: "Total Startups", value: "12" },
  { id: 2, label: "Active Startups", value: "06" },
  { id: 3, label: "Total Funding issued", value: "$22,000" },
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

export default function Startups() {
  return (
    <div className="startups-page">
      <main className="startups-main">
        <TopHeader showWelcome={false} />

        <header className="startups-header">
          <h1>Startups</h1>
        </header>

        <section className="startups-stats-grid">
          {projectStats.map((stat) => (
            <article key={stat.id} className="startups-stat-card">
              <p>{stat.label}</p>
              <h2>{stat.value}</h2>
            </article>
          ))}
        </section>

        <section className="startups-cards-grid">
          {projectCards.map((project) => (
            <article key={project.id} className="startup-card">
              <div className="startup-card-top">
                <span className="startup-avatar">TK</span>
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.category}</p>
                </div>
              </div>

              <div className="startup-progress-wrap">
                <span>progress</span>
                <div className="startup-progress-track" role="presentation">
                  <span
                    className="startup-progress-fill"
                    style={{ width: `${project.progress * 100}%` }}
                  ></span>
                </div>
              </div>

              <div className="startup-meta-row">
                <div className="startup-meta-item">
                  <DollarSign />
                  <small>{project.funding}</small>
                </div>
                <div className="startup-meta-item">
                  <Users />
                  <small>{project.score}</small>
                </div>
                <div className="startup-meta-item">
                  <FileText />
                  <small>Potency Received</small>
                </div>
                <div className="startup-meta-item">
                  <Megaphone />
                  <small>Marketing exposure Received</small>
                </div>
              </div>

              <button
                type="button"
                className="startup-detail-btn"
                aria-label="View startup details"
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
