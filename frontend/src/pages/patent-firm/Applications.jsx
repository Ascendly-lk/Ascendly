import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Search,
    TrendingUp
} from "lucide-react";
import TopBar from "../../components/dashboard/TopBar";
import StatCard from "../../components/dashboard/StatCard";
import { fetchApplications } from "../../utils/patent-api";
import "./Dashboard.css";
import "./Clients.css";

// Basic Component Replicas
const Card = ({ children, className = "" }) => <div className={`cl-card ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }) => <div className={`cl-card-header ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`cl-card-title ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = "" }) => <div className={`cl-card-desc ${className}`}>{children}</div>;
const CardContent = ({ children, className = "" }) => <div className={`cl-card-content ${className}`}>{children}</div>;
const Button = ({ children, className = "", variant = "primary", size = "default", onClick }) => (
    <button onClick={onClick} className={`cl-btn cl-btn-${variant} cl-btn-${size} ${className}`}>{children}</button>
);
const Badge = ({ children, className = "" }) => <span className={`cl-badge ${className}`}>{children}</span>;
const Input = ({ className = "", ...props }) => <input className={`cl-input ${className}`} {...props} />;
const Progress = ({ value, className = "" }) => (
    <div className={`pf-progress-bar ${className}`}>
        <div className="pf-progress-fill" style={{ width: `${value}%` }}></div>
    </div>
);

const statusColors = {
    "pending_review": "cl-tier-1",
    "in_progress": "cl-tier-2",
    "filing_ready": "cl-tier-3",
    "filed": "cl-badge-green",
    "approved": "cl-badge-green",
    "rejected": "cl-tier-1"
};

const statusIcons = {
    "pending_review": AlertCircle,
    "in_progress": Clock,
    "filing_ready": TrendingUp,
    "filed": CheckCircle2,
    "approved": CheckCircle2,
    "rejected": AlertCircle
};

const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function Applications() {
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
    );

    // Exact DB matching
    const pendingReview = applications.filter(app => app.status === "pending_review");
    const inProgress = applications.filter(app => app.status === "in_progress");
    const readyToFile = applications.filter(app => app.status === "filing_ready");
    
    // Urgent logic based on priority or near-due
    const urgentApps = applications.filter(app => app.priority === "urgent" || app.priority === "high");

    const displayList = 
        activeTab === "all" ? filteredApplications :
        activeTab === "urgent" ? filteredApplications.filter(app => app.priority === "urgent" || app.priority === "high") :
        activeTab === "pending" ? filteredApplications.filter(app => app.status === "pending_review") : [];

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
                    />
                    <StatCard
                        title="In Progress"
                        value={inProgress.length}
                        icon={<Clock size={24} color="#60A5FA" />}
                        variant="dark"
                    />
                    <StatCard
                        title="Ready to File"
                        value={readyToFile.length}
                        icon={<TrendingUp size={24} color="#C084FC" />}
                        variant="dark"
                    />
                    <StatCard
                        title="Total Active"
                        value={applications.length}
                        icon={<FileText size={24} color="#34D399" />}
                        variant="gradient"
                    />
                </div>

                <div className="cl-toolbar">
                    <div className="cl-search-wrapper" style={{ flex: 1 }}>
                        <Search className="cl-search-icon" size={16} />
                        <Input
                            placeholder="Search applications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <Button variant={activeTab === 'all' ? 'primary' : 'outline'} onClick={() => setActiveTab('all')}>All Applications ({applications.length})</Button>
                    <Button variant={activeTab === 'urgent' ? 'primary' : 'outline'} onClick={() => setActiveTab('urgent')}>Urgent ({urgentApps.length})</Button>
                    <Button variant={activeTab === 'pending' ? 'primary' : 'outline'} onClick={() => setActiveTab('pending')}>Pending Reviews ({pendingReview.length})</Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {displayList.map((app) => {
                        const StatusIcon = statusIcons[app.status] || FileText;
                        const isUrgent = app.priority === "urgent" || app.priority === "high";

                        return (
                            <Card key={app.id}>
                                <CardHeader>
                                    <div className="cl-card-top" style={{ alignItems: 'center' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <CardTitle>{app.title}</CardTitle>
                                                {isUrgent && <Badge className="pf-orange-badge">Urgent</Badge>}
                                            </div>
                                            <CardDescription style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ color: 'var(--text-white)' }}>{app.client || "Client"}</span>
                                                <span>•</span>
                                                <span>{app.id}</span>
                                                {app.type && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{app.type}</span>
                                                    </>
                                                )}
                                                {app.filingType && (
                                                    <>
                                                        <span>•</span>
                                                        <span>{app.filingType}</span>
                                                    </>
                                                )}
                                            </CardDescription>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <Badge className={statusColors[app.status] || "cl-tier-1"}>
                                                <StatusIcon size={12} style={{ marginRight: '4px' }} />
                                                {formatStatus(app.status)}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                                            <span style={{ color: 'var(--text-gray)' }}>Overall Progress</span>
                                            <span style={{ color: 'var(--text-white)', fontWeight: 600 }}>{app.progress || 0}%</span>
                                        </div>
                                        <Progress value={app.progress || 0} />
                                    </div>

                                    <div className="cl-card-footer" style={{ borderTop: 'none', paddingTop: 0, justifyContent: 'flex-end', display: 'flex' }}>
                                        <div className="cl-card-actions">
                                            <Link to={`/dashboard/patent-firm/document-review`} style={{ textDecoration: 'none' }}>
                                                <Button variant="primary" size="sm" style={{ display: 'flex', alignItems: 'center' }}>
                                                    Review Application <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {displayList.length === 0 && (
                        <div className="pf-card" style={{ textAlign: 'center', padding: '64px' }}>
                            <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
                            <h3 style={{ color: 'var(--text-white)', marginBottom: '8px' }}>No applications found</h3>
                            <p style={{ color: 'var(--text-gray)' }}>There are no applications matching this category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
