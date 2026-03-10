import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Users,
    Building2,
    TrendingUp,
    FileText,
    DollarSign,
    Search,
    Filter,
    Plus
} from "lucide-react";
import TopBar from "../../components/dashboard/TopBar";
import StatCard from "../../components/dashboard/StatCard";
import "./Dashboard.css"; // Shared Ascendly theme styles
import "./Clients.css";   // Client specific CSS

// Basic Component Replicas
const Card = ({ children, className = "" }) => <div className={`cl-card ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }) => <div className={`cl-card-header ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`cl-card-title ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = "" }) => <p className={`cl-card-desc ${className}`}>{children}</p>;
const CardContent = ({ children, className = "" }) => <div className={`cl-card-content ${className}`}>{children}</div>;
const Button = ({ children, className = "", variant = "primary", size = "default" }) => (
    <button className={`cl-btn cl-btn-${variant} cl-btn-${size} ${className}`}>{children}</button>
);
const Badge = ({ children, className = "" }) => <span className={`cl-badge ${className}`}>{children}</span>;
const Input = ({ className = "", ...props }) => <input className={`cl-input ${className}`} {...props} />;

const clients = [
    { id: "CL-001", name: "TechCo AI", industry: "Artificial Intelligence", tier: "Tier 3", activeApplications: 3, revenue: "$14,997", since: "Jan 2025", status: "Active", logo: "TA" },
    { id: "CL-002", name: "IoT Innovations", industry: "Hardware / IoT", tier: "Tier 2", activeApplications: 2, revenue: "$3,998", since: "Feb 2025", status: "Active", logo: "II" },
    { id: "CL-003", name: "DataFlow Inc", industry: "Data Analytics", tier: "Tier 2", activeApplications: 1, revenue: "$1,999", since: "Mar 2026", status: "Active", logo: "DF" },
    { id: "CL-004", name: "BioTech Labs", industry: "Biotechnology", tier: "Tier 3", activeApplications: 4, revenue: "$19,996", since: "Dec 2024", status: "Active", logo: "BL" },
    { id: "CL-005", name: "GreenEnergy Co", industry: "Clean Energy", tier: "Tier 1", activeApplications: 1, revenue: "$499", since: "Mar 2026", status: "Active", logo: "GE" },
    { id: "CL-006", name: "FinTech Solutions", industry: "Financial Technology", tier: "Tier 2", activeApplications: 2, revenue: "$3,998", since: "Jan 2026", status: "Active", logo: "FS" },
];

const tierColors = {
    "Tier 1": "cl-tier-1",
    "Tier 2": "cl-tier-2",
    "Tier 3": "cl-tier-3",
};

export default function Clients() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClients = clients.filter((client) =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.industry.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRevenue = clients.reduce((sum, client) => sum + parseFloat(client.revenue.replace(/[$,]/g, "")), 0);
    const totalApplications = clients.reduce((sum, client) => sum + client.activeApplications, 0);

    return (
        <div className="startup-dashboard">
            <TopBar />

            <div className="pf-hero" style={{ padding: '32px 28px 16px 28px' }}>
                <h1>Client Management</h1>
                <p>Manage your startup clients and their patent portfolios</p>
            </div>

            <div className="dashboard-content pf-content">
                {/* Row 1: Stat Cards using existing Ascendly component! */}
                <div className="dashboard-row dashboard-stats" style={{ marginBottom: '32px' }}>
                    <StatCard
                        title="Total Clients"
                        value={clients.length}
                        icon={<Building2 size={24} color="#C084FC" />}
                        variant="dark"
                        decoration={<div className="pf-stat-subtitle">+2 new this month</div>}
                    />

                    <StatCard
                        title="Active Applications"
                        value={totalApplications}
                        icon={<FileText size={24} color="#60A5FA" />}
                        variant="dark"
                        decoration={<div className="pf-stat-subtitle text-orange">Needs attention</div>}
                    />

                    <StatCard
                        title="Total Revenue"
                        value={`$${(totalRevenue / 1000).toFixed(1)}K`}
                        icon={<DollarSign size={24} color="#34D399" />}
                        variant="gradient"
                        decoration={<div className="pf-stat-subtitle">+12% vs last month</div>}
                    />

                    <StatCard
                        title="New This Month"
                        value="+2"
                        icon={<TrendingUp size={24} color="#FBBF24" />}
                        variant="dark"
                        decoration={<div className="pf-stat-subtitle">Continuing growth</div>}
                    />
                </div>

                {/* Search and Actions */}
                <div className="cl-toolbar">
                    <div className="cl-search-wrapper">
                        <Search className="cl-search-icon" size={16} />
                        <Input
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="cl-action-btns">
                        <Button variant="outline"><Filter size={16} /> Filter</Button>
                        <Button variant="primary"><Plus size={16} /> Add Client</Button>
                    </div>
                </div>

                {/* Clients Grid */}
                <div className="cl-grid">
                    {filteredClients.map((client) => (
                        <Card key={client.id}>
                            <CardHeader>
                                <div className="cl-card-top">
                                    <div className="cl-card-identity">
                                        <div className="cl-avatar">{client.logo}</div>
                                        <div>
                                            <CardTitle>{client.name}</CardTitle>
                                            <CardDescription>{client.industry}</CardDescription>
                                        </div>
                                    </div>
                                    <Badge className={tierColors[client.tier]}>{client.tier}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="cl-details-grid">
                                    <div>
                                        <div className="cl-detail-label">Applications</div>
                                        <div className="cl-detail-val">{client.activeApplications}</div>
                                    </div>
                                    <div>
                                        <div className="cl-detail-label">Revenue</div>
                                        <div className="cl-detail-val">{client.revenue}</div>
                                    </div>
                                </div>
                                <div className="cl-card-footer">
                                    <div className="cl-client-since">Client since {client.since}</div>
                                    <div className="cl-card-actions">
                                        <Link to="/applications" style={{ flex: 1, textDecoration: 'none' }}>
                                            <Button variant="outline" size="sm" className="cl-w-full" style={{ justifyContent: 'center' }}>
                                                View Applications
                                            </Button>
                                        </Link>
                                        <Button variant="outline" size="sm">Details</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredClients.length === 0 && (
                    <div className="pf-card" style={{ textAlign: 'center', padding: '64px' }}>
                        <Users size={48} color="#94a3b8" style={{ margin: '0 auto 16px auto' }} />
                        <h3 style={{ color: 'var(--text-white)', marginBottom: '8px' }}>No clients found</h3>
                        <p style={{ color: 'var(--text-gray)' }}>Try adjusting your search criteria</p>
                    </div>
                )}

            </div>
        </div>
    );
}
