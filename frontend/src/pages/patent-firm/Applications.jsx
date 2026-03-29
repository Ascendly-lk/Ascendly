<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> parent of ae17c912 (Update by deleting some files)
import { Link } from "react-router-dom";
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Filter,
    Search,
    TrendingUp
} from "lucide-react";
import TopBar from "../../components/dashboard/TopBar";
import StatCard from "../../components/dashboard/StatCard";
<<<<<<< HEAD
import { fetchApplications } from "../../utils/patent-api";
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
import "./Dashboard.css";
import "./Clients.css";

// Basic Component Replicas
const Card = ({ children, className = "" }) => <div className={`cl-card ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }) => <div className={`cl-card-header ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`cl-card-title ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = "" }) => <div className={`cl-card-desc ${className}`}>{children}</div>;
const CardContent = ({ children, className = "" }) => <div className={`cl-card-content ${className}`}>{children}</div>;
const Button = ({ children, className = "", variant = "primary", size = "default" }) => (
    <button className={`cl-btn cl-btn-${variant} cl-btn-${size} ${className}`}>{children}</button>
);
const Badge = ({ children, className = "" }) => <span className={`cl-badge ${className}`}>{children}</span>;
const Input = ({ className = "", ...props }) => <input className={`cl-input ${className}`} {...props} />;
const Progress = ({ value, className = "" }) => (
    <div className={`pf-progress-bar ${className}`}>
        <div className="pf-progress-fill" style={{ width: `${value}%` }}></div>
    </div>
);

// Tabs Replicas
const Tabs = ({ children, defaultValue, className = "" }) => {
    const [active, setActive] = useState(defaultValue);
    return <div className={className}>{typeof children === 'function' ? children(active, setActive) : children}</div>;
};

<<<<<<< HEAD
=======
// Mock data
const applications = [
    { id: "PAT-2026-001", title: "AI-Powered Task Automation Engine", client: "TechCo AI", type: "Software", status: "Expert Review", progress: 60, lastUpdated: "March 3, 2026", assignedTo: "You", tier: "Tier 3", filingType: "Non-Provisional", priority: "high" },
    { id: "PAT-2026-002", title: "Smart IoT Sensor Hardware Design", client: "IoT Innovations", type: "Hardware", status: "Drafting", progress: 30, lastUpdated: "March 5, 2026", assignedTo: "Michael Rodriguez", tier: "Tier 2", filingType: "Provisional", priority: "normal" },
    { id: "PAT-2026-003", title: "Blockchain Data Verification System", client: "DataFlow Inc", type: "Software", status: "Filing", progress: 85, lastUpdated: "March 4, 2026", assignedTo: "Emily Watson", tier: "Tier 2", filingType: "Non-Provisional", priority: "normal" },
    { id: "PAT-2026-004", title: "Gene Editing Mechanism", client: "BioTech Labs", type: "Biotechnology", status: "Pending Review", progress: 10, lastUpdated: "March 6, 2026", assignedTo: "Unassigned", tier: "Tier 3", filingType: "Non-Provisional", priority: "urgent" },
    { id: "PAT-2026-005", title: "Solar Panel Efficiency Optimizer", client: "GreenEnergy Co", type: "Hardware", status: "Pending Review", progress: 5, lastUpdated: "March 6, 2026", assignedTo: "Unassigned", tier: "Tier 1", filingType: "Provisional", priority: "normal" },
];

>>>>>>> parent of ae17c912 (Update by deleting some files)
const statusColors = {
    "Pending Review": "cl-tier-1",
    "Drafting": "cl-tier-2",
    "Expert Review": "cl-tier-2",
    "Filing": "cl-tier-3",
    "Pending": "cl-tier-1",
    "Granted": "cl-badge-green",
};

const statusIcons = {
    "Pending Review": AlertCircle,
    "Drafting": FileText,
    "Expert Review": Clock,
    "Filing": TrendingUp,
    "Pending": AlertCircle,
    "Granted": CheckCircle2,
};

const priorityColors = {
    urgent: "cl-tier-1",
    high: "cl-tier-1",
    normal: "cl-tier-1",
};

export default function Applications() {
<<<<<<< HEAD
    const [applications, setApplications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadApplications = async () => {
            try {
                const data = await fetchApplications();
                setApplications(data);
            } catch (error) {
                console.error("Failed to load applications:", error);
                // Keep empty or show error
            } finally {
                setLoading(false);
            }
        };
        loadApplications();
    }, []);

    const filteredApplications = applications.filter((app) =>
        (app.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (app.client?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (app.id?.toLowerCase() || "").includes(searchQuery.toLowerCase())
=======
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");

    const filteredApplications = applications.filter((app) =>
        app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase())
>>>>>>> parent of ae17c912 (Update by deleting some files)
    );

    const pendingReview = applications.filter(app => app.status === "Pending Review");
    const inProgress = applications.filter(app => app.status === "Expert Review" || app.status === "Drafting");
    const readyToFile = applications.filter(app => app.status === "Filing");

    return (
        <div className="startup-dashboard">
            <TopBar />

            <div className="pf-hero" style={{ padding: '32px 28px 16px 28px' }}>
                <h1>Patent Applications</h1>
                <p>Manage and track all client patent applications</p>
            </div>

            <div className="dashboard-content pf-content">
                <div className="dashboard-row dashboard-stats" style={{ marginBottom: '32px' }}>
                    <StatCard
                        title="Pending Review"
                        value={pendingReview.length}
                        icon={<AlertCircle size={24} color="#FBBF24" />}
                        variant="dark"
                        decoration=""
                    />
                    <StatCard
                        title="In Progress"
                        value={inProgress.length}
                        icon={<Clock size={24} color="#60A5FA" />}
                        variant="dark"
                        decoration=""
                    />
                    <StatCard
                        title="Ready to File"
                        value={readyToFile.length}
                        icon={<TrendingUp size={24} color="#C084FC" />}
                        variant="dark"
                        decoration=""
                    />
                    <StatCard
                        title="Total Active"
                        value={applications.length}
                        icon={<FileText size={24} color="#34D399" />}
                        variant="gradient"
                        decoration=""
                    />
                </div>

                <div className="cl-toolbar">
                    <div className="cl-search-wrapper">
                        <Search className="cl-search-icon" size={16} />
                        <Input
                            placeholder="Search applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="cl-action-btns">
                        <Button variant="outline"><Filter size={16} /> Filter</Button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <Button variant={activeTab === 'all' ? 'primary' : 'outline'} onClick={() => setActiveTab('all')}>All Applications ({applications.length})</Button>
                    <Button variant={activeTab === 'pending' ? 'primary' : 'outline'} onClick={() => setActiveTab('pending')}>Pending Review ({pendingReview.length})</Button>
                    <Button variant={activeTab === 'assigned' ? 'primary' : 'outline'} onClick={() => setActiveTab('assigned')}>Assigned to Me (1)</Button>
                </div>

                {activeTab === 'all' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredApplications.map((app) => {
                            const StatusIcon = statusIcons[app.status] || FileText;
                            return (
                                <Card key={app.id}>
                                    <CardHeader>
                                        <div className="cl-card-top" style={{ alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                    <CardTitle>{app.title}</CardTitle>
                                                    {app.priority === "urgent" && <Badge className="pf-orange-badge">Urgent</Badge>}
                                                </div>
                                                <CardDescription style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ color: 'var(--text-white)' }}>{app.client}</span>
                                                    <span>•</span>
                                                    <span>{app.id}</span>
                                                    <span>•</span>
                                                    <span>{app.type}</span>
                                                    <span>•</span>
                                                    <span>{app.filingType}</span>
                                                </CardDescription>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <Badge className={statusColors[app.status]}>
                                                    <StatusIcon size={12} style={{ marginRight: '4px' }} />
                                                    {app.status}
                                                </Badge>
                                                <Badge className="cl-tier-1">{app.tier}</Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                                                <span style={{ color: 'var(--text-gray)' }}>Overall Progress</span>
                                                <span style={{ color: 'var(--text-white)', fontWeight: 600 }}>{app.progress}%</span>
                                            </div>
                                            <Progress value={app.progress} />
                                        </div>

                                        <div className="cl-card-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '13px', color: 'var(--text-gray)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span>Assigned to:</span>
                                                    <span style={{ color: app.assignedTo === "Unassigned" ? '#FBBF24' : 'var(--text-white)' }}>
                                                        {app.assignedTo}
                                                    </span>
                                                </div>
                                                <span>•</span>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Clock size={14} />
                                                    <span>Last updated: {app.lastUpdated}</span>
                                                </div>
                                            </div>
                                            <div className="cl-card-actions">
                                                <Link to={`/dashboard/patent-firm/applications/${app.id}`} style={{ textDecoration: 'none' }}>
                                                    <Button variant="primary" size="sm">
                                                        Review Application <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                                                    </Button>
                                                </Link>
                                                {app.assignedTo === "Unassigned" && (
                                                    <Button variant="outline" size="sm">Assign Expert</Button>
                                                )}
                                                <Button variant="outline" size="sm">View Documents</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'pending' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {pendingReview.map((app) => {
                            const StatusIcon = statusIcons[app.status] || FileText;
                            return (
                                <Card key={app.id}>
                                    <CardHeader>
                                        <div className="cl-card-top" style={{ alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <CardTitle>{app.title}</CardTitle>
                                                <CardDescription style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                    <span style={{ color: 'var(--text-white)' }}>{app.client}</span>
                                                    <span>•</span>
                                                    <span>{app.id}</span>
                                                </CardDescription>
                                            </div>
                                            <Badge className={statusColors[app.status]}>
                                                <StatusIcon size={12} style={{ marginRight: '4px' }} />
                                                {app.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '14px', color: 'var(--text-gray)' }}>Needs assignment and review</span>
                                            <Link to={`/dashboard/patent-firm/applications/${app.id}`} style={{ textDecoration: 'none' }}>
                                                <Button variant="primary" size="sm">
                                                    Start Review <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {activeTab === 'assigned' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>AI-Powered Task Automation Engine</CardTitle>
                            <CardDescription>TechCo AI • PAT-2026-001</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/dashboard/patent-firm/applications/PAT-2026-001" style={{ textDecoration: 'none' }}>
                                <Button variant="primary">
                                    Continue Working <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
}
