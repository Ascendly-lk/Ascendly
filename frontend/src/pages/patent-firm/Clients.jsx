import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Users,
    Building2,
    TrendingUp,
    FileText,
    DollarSign,
    Search,
    X
} from "lucide-react";
import TopBar from "../../components/dashboard/TopBar";
import StatCard from "../../components/dashboard/StatCard";
import { fetchClients } from "../../utils/patent-api";
import "./Dashboard.css"; // Shared Ascendly theme styles
import "./Clients.css";   // Client specific CSS

// Basic Component Replicas
const Card = ({ children, className = "" }) => <div className={`cl-card ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }) => <div className={`cl-card-header ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`cl-card-title ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = "" }) => <p className={`cl-card-desc ${className}`}>{children}</p>;
const CardContent = ({ children, className = "" }) => <div className={`cl-card-content ${className}`}>{children}</div>;
const Button = ({ children, className = "", variant = "primary", size = "default", onClick }) => (
    <button onClick={onClick} className={`cl-btn cl-btn-${variant} cl-btn-${size} ${className}`}>{children}</button>
);
const Badge = ({ children, className = "" }) => <span className={`cl-badge ${className}`}>{children}</span>;
const Input = ({ className = "", ...props }) => <input className={`cl-input ${className}`} {...props} />;

const tierColors = {
    "Tier 1": "cl-tier-1",
    "Tier 2": "cl-tier-2",
    "Tier 3": "cl-tier-3",
};

export default function Clients() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Filters
    const [tierFilter, setTierFilter] = useState("");
    const [revenueFilter, setRevenueFilter] = useState("");
    const [sinceFilter, setSinceFilter] = useState("");
    
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        const loadClients = async () => {
            try {
                const data = await fetchClients();
                setClients(data);
            } catch (error) {
                console.error("Failed to load clients:", error);
            } finally {
                setLoading(false);
            }
        };
        loadClients();
    }, []);

    // Filter Logic
    const filteredClients = clients.filter((client) => {
        const matchesSearch = (client.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
                              (client.industry?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        
        const matchesTier = tierFilter ? client.tier === tierFilter : true;
        
        let matchesRevenue = true;
        if (revenueFilter) {
            const revNum = parseFloat(String(client.revenue || 0).replace(/[$,]/g, ""));
            if (revenueFilter === "low") matchesRevenue = revNum < 50000;
            if (revenueFilter === "mid") matchesRevenue = revNum >= 50000 && revNum <= 200000;
            if (revenueFilter === "high") matchesRevenue = revNum > 200000;
        }

        const matchesSince = sinceFilter ? String(client.since) === sinceFilter : true;

        return matchesSearch && matchesTier && matchesRevenue && matchesSince;
    });

    const totalRevenue = clients.reduce((sum, client) => sum + parseFloat(String(client.revenue || 0).replace(/[$,]/g, "")), 0);
    const totalApplications = clients.reduce((sum, client) => sum + (client.activeApplications || 0), 0);

    // Generate Dummy Data reliably
    const getDummyData = (client) => {
        // Fallback for length safety
        const safeId = client.id + "0000";
        return {
            regNum: `REG-${safeId.substring(0,8).toUpperCase()}`,
            country: ["United States", "United Kingdom", "Germany", "Singapore"][safeId.charCodeAt(0) % 4],
            contactPerson: ["Emily Watson", "Michael Chang", "Sarah Jenkins", "David Kumar"][safeId.charCodeAt(1) % 4],
            email: `contact@${(client.name || "client").toLowerCase().replace(/\s/g, '')}.com`,
            phone: `+1 (555) ${100 + (safeId.charCodeAt(2) % 900)}-${1000 + (safeId.charCodeAt(3) % 9000)}`,
            businessType: client.tier === "Tier 1" ? "Enterprise" : client.tier === "Tier 2" ? "SME" : "Startup",
        };
    };

    return (
        <div className="startup-dashboard">
            <TopBar />

            <div className="pf-hero" style={{ padding: '32px 28px 16px 28px' }}>
                <h1>Client Management</h1>
                <p>Manage your startup clients and their patent portfolios</p>
            </div>

            <div className="dashboard-content pf-content">
                <div className="dashboard-row dashboard-stats" style={{ marginBottom: '32px' }}>
                    <StatCard title="Total Clients" value={clients.length} icon={<Building2 size={24} color="#C084FC" />} variant="dark" decoration={<div className="pf-stat-subtitle">+2 new this month</div>} />
                    <StatCard title="Active Applications" value={totalApplications} icon={<FileText size={24} color="#60A5FA" />} variant="dark" decoration={<div className="pf-stat-subtitle text-orange">Needs attention</div>} />
                    <StatCard title="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}K`} icon={<DollarSign size={24} color="#34D399" />} variant="gradient" decoration={<div className="pf-stat-subtitle">+12% vs last month</div>} />
                    <StatCard title="New This Month" value="+2" icon={<TrendingUp size={24} color="#FBBF24" />} variant="dark" decoration={<div className="pf-stat-subtitle">Continuing growth</div>} />
                </div>

                {/* Toolbar */}
                <div className="cl-toolbar" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="cl-search-wrapper" style={{ flex: '1', minWidth: '200px' }}>
                        <Search className="cl-search-icon" size={16} />
                        <Input placeholder="Search clients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <select className="cl-input" value={tierFilter} onChange={e => setTierFilter(e.target.value)} style={{ padding: '8px 12px', width: 'auto', background: '#0d1628', color: 'white', border: '1px solid #1e293b', outline: 'none', cursor: 'pointer' }}>
                            <option value="">All Tiers</option>
                            <option value="Tier 1">Tier 1</option>
                            <option value="Tier 2">Tier 2</option>
                            <option value="Tier 3">Tier 3</option>
                        </select>

                        <select className="cl-input" value={revenueFilter} onChange={e => setRevenueFilter(e.target.value)} style={{ padding: '8px 12px', width: 'auto', background: '#0d1628', color: 'white', border: '1px solid #1e293b', outline: 'none', cursor: 'pointer' }}>
                            <option value="">Any Revenue</option>
                            <option value="low">&lt; $50K</option>
                            <option value="mid">$50K - $200K</option>
                            <option value="high">&gt; $200K</option>
                        </select>

                        <select className="cl-input" value={sinceFilter} onChange={e => setSinceFilter(e.target.value)} style={{ padding: '8px 12px', width: 'auto', background: '#0d1628', color: 'white', border: '1px solid #1e293b', outline: 'none', cursor: 'pointer' }}>
                            <option value="">Any Year</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>

                {/* Clients Grid */}
                <div className="cl-grid">
                    {filteredClients.map((client) => (
                        <Card key={client.id}>
                            <CardHeader>
                                <div className="cl-card-top">
                                    <div className="cl-card-identity">
                                        <div className="cl-avatar">{client.logo_letter || client.name?.charAt(0) || "C"}</div>
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
                                        <div className="cl-detail-val">{client.activeApplications || client.active_applications || 0}</div>
                                    </div>
                                    <div>
                                        <div className="cl-detail-label">Revenue</div>
                                        <div className="cl-detail-val">${String(client.revenue || 0).replace('$', '')}</div>
                                    </div>
                                </div>
                                <div className="cl-card-footer" style={{ gap: '16px' }}>
                                    <div className="cl-client-since">Client since {client.since || client.created_at?.substring(0,4) || "2024"}</div>
                                    <div className="cl-card-actions" style={{ display: 'flex', gap: '8px', flex: 1 }}>
                                        <Button variant="outline" size="sm" className="cl-w-full" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate(`/dashboard/patent-firm/applications?client_id=${client.id}`)}>
                                            Applications
                                        </Button>
                                        <Button variant="outline" size="sm" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setSelectedClient(client)}>Details</Button>
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
                        <p style={{ color: 'var(--text-gray)' }}>Try adjusting your filters</p>
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedClient && (
                <div className="pf-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div className="pf-modal-content" style={{ background: '#0d1628', border: '1px solid rgba(148, 163, 184, 0.1)', borderRadius: '16px', padding: '32px', width: '480px', maxWidth: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <h2 style={{ color: 'white', fontSize: '20px', margin: '0 0 4px 0' }}>{selectedClient.name}</h2>
                                <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>Detailed Client Information</p>
                            </div>
                            <button onClick={() => setSelectedClient(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {(() => {
                                const dummy = getDummyData(selectedClient);
                                return (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Company Name</span>
                                            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{selectedClient.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Registration Number</span>
                                            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{dummy.regNum}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Country of Operation</span>
                                            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{dummy.country}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Contact Person Name</span>
                                            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{dummy.contactPerson}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Email & Phone</span>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ color: '#60A5FA', fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>{dummy.email}</div>
                                                <div style={{ color: 'white', fontSize: '13px' }}>{dummy.phone}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Business Type</span>
                                            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{dummy.businessType}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Industry Domain</span>
                                            <span style={{ color: 'white', fontSize: '14px', fontWeight: 500 }}>{selectedClient.industry}</span>
                                        </div>
                                    </>
                                )
                            })()}
                        </div>
                        
                        <div style={{ marginTop: '32px', textAlign: 'right' }}>
                            <Button variant="primary" onClick={() => setSelectedClient(null)}>Close Window</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
