import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from "../../components/dashboard/StatCard";
import TopBar from "../../components/dashboard/TopBar";
import { fetchDashboardStats, fetchActivities, fetchDashboardPipeline, fetchUrgentActions } from '../../utils/patent-api';
import "./Dashboard.css";

const PatentFirmDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [pipeline, setPipeline] = useState(null);
    const [urgent, setUrgent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [debugError, setDebugError] = useState(null);

    const loadDashboardData = async () => {
        setLoading(true);
        setDebugError(null);
        try {
            const [statsData, actData, pipeData, urgData] = await Promise.all([
                fetchDashboardStats(),
                fetchActivities(),
                fetchDashboardPipeline(),
                fetchUrgentActions()
            ]);
            setStats(statsData);
            setActivity(actData);
            setPipeline(pipeData);
            setUrgent(urgData);
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            setDebugError(error.toString());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);
    // Icons
    const fileIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </svg>
    );

    const usersIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );

    const clockIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );

    const dollarIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );

    const warningIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
    );

    const checkIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 0a4 4 0 0 0 4-4"></path>
        </svg>
    );

    const calendarIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C084FC" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    );

    const trendUpIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
    );

    return (
        <div className="startup-dashboard">
            <TopBar />

            {/* <div className="pf-hero">
                <div className="pf-hero-content">
                    <h1>Welcome back, Dr. Chen</h1>
                    <p>Here's your patent firm overview for today</p>
                </div>
            </div> */}

            <div className="dashboard-content pf-content">
                {debugError && (
                    <div style={{ background: '#FECDD3', color: '#9F1239', padding: '12px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div><strong>Debug Error:</strong> {debugError}.</div>
                        <button onClick={loadDashboardData} style={{ background: '#9F1239', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Retry Fetch</button>
                    </div>
                )}
                {/* Row 1: Stat Cards */}
                <div className="dashboard-row dashboard-stats">
                    <StatCard
                        title="Active Applications"
                        value={stats ? stats.active_applications : "..."}
                        icon={fileIcon}
                        variant="dark"
                    />

                    <StatCard
                        title="Total Clients"
                        value={stats ? stats.total_clients : "..."}
                        icon={usersIcon}
                        variant="dark"
                    />

                    <StatCard
                        title="Pending Reviews"
                        value={stats ? stats.pending_reviews : "..."}
                        icon={clockIcon}
                        variant="dark"
                    />

                    <StatCard
                        title="Revenue"
                        value={stats ? stats.revenue_formatted : "..."}
                        icon={dollarIcon}
                        variant="gradient"
                    />
                </div>

                {/* Urgent Section */}
                <div className="pf-urgent-card">
                    <div className="pf-urgent-header">
                        {warningIcon}
                        <h2>Action Required</h2>
                    </div>

                    <div className="pf-urgent-list">
                        {urgent.map((item, idx) => {
                            const dueDate = new Date(item.due_date);
                            const daysLeft = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
                            const dueText = daysLeft === 0 ? "Due Today" : daysLeft === 1 ? "Due Tomorrow" : `Due in ${daysLeft} Days`;
                            
                            return (
                                <button key={idx} type="button" className="pf-urgent-item pf-urgent-link" onClick={() => { if(item.file_url) window.open(item.file_url, '_blank'); }}>
                                    <div className="pf-urgent-info">
                                        <h3>{item.title}</h3>
                                        <p>{item.id} • {item.company_name}</p>
                                    </div>
                                    <div className="pf-urgent-actions">
                                        <span className="pf-text-muted" style={{ fontSize: '13px', marginRight: '16px', color: '#9CA3AF' }}>{dueText}</span>
                                        <span className="pf-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>Open PDF</span>
                                    </div>
                                </button>
                            );
                        })}
                        {urgent.length === 0 && (
                            <div style={{ color: 'var(--text-gray)', padding: '16px 0' }}>No urgent applications immediately due.</div>
                        )}
                    </div>
                </div>

                {/* Grid Layouts */}
                <div className="dashboard-row pf-row-2">
                    {/* Column 1: Pipeline */}
                    <div className="pf-card pf-pipeline-card">
                        <div className="pf-card-header">
                            {fileIcon}
                            <h3>Application Pipeline</h3>
                        </div>

                        <div className="pf-pipeline-list">
                            <div className="pf-pipeline-item">
                                <div className="pf-dot dot-orange"></div>
                                <span className="pf-pipeline-label">Pending Review</span>
                                <span className="pf-pipeline-val">{pipeline ? pipeline.pending_review : "..."}</span>
                            </div>
                            <div className="pf-pipeline-item">
                                <div className="pf-dot dot-blue"></div>
                                <span className="pf-pipeline-label">In Progress</span>
                                <span className="pf-pipeline-val">{pipeline ? pipeline.in_progress : "..."}</span>
                            </div>
                            <div className="pf-pipeline-item">
                                <div className="pf-dot dot-purple"></div>
                                <span className="pf-pipeline-label">Filing Ready</span>
                                <span className="pf-pipeline-val">{pipeline ? pipeline.filing_ready : "..."}</span>
                            </div>
                            <div className="pf-pipeline-item">
                                <div className="pf-dot dot-green"></div>
                                <span className="pf-pipeline-label">Filed/Complete</span>
                                <span className="pf-pipeline-val">{pipeline ? pipeline.filed_completed : "..."}</span>
                            </div>
                        </div>

                        <button
                            className="pf-btn-full"
                            type="button"
                            onClick={() => navigate('/dashboard/patent-firm/applications')}
                        >
                            View All Applications →
                        </button>
                    </div>

                    {/* Column 2: Quick Actions */}
                    <div className="pf-card pf-quick-card">
                        <div className="pf-card-header no-icon">
                            <h3>Quick Actions</h3>
                        </div>

                        <div className="pf-quick-list">
                            <button className="pf-list-btn" onClick={() => navigate('/dashboard/patent-firm/clients')}>
                                {usersIcon} View All Clients
                            </button>
                            <button className="pf-list-btn" onClick={() => navigate('/dashboard/patent-firm/applications?status=pending_review')}>
                                {fileIcon} Review Pending Applications
                            </button>
                            <button className="pf-list-btn">
                                {usersIcon} Manage Expert Assignments
                            </button>
                            <button className="pf-list-btn">
                                {calendarIcon} Schedule Consultations
                            </button>
                        </div>
                    </div>
                </div>

                {/* Additional Cards */}
                <div className="pf-card pf-activity-card">
                    <div className="pf-card-header no-icon">
                        <h3>Recent Activity</h3>
                    </div>
                    <p className="pf-card-desc">Latest updates from your clients and team</p>

                    <div className="pf-activity-list">
                        {activity.map((item, idx) => {
                            const actionKey = (item.action || "").toLowerCase();
                            const icon = actionKey.includes('document') ? fileIcon : actionKey.includes('review') ? checkIcon : calendarIcon;
                            
                            return (
                                <div className="pf-activity-item" key={idx}>
                                    <div className="pf-icon-circle bg-blue-subtle">
                                        {icon}
                                    </div>
                                    <div className="pf-activity-info">
                                        <h4>{item.action}</h4>
                                        <p>{item.description} • {item.client_name}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="pf-card pf-performance-card">
                    <div className="pf-card-header">
                        {trendUpIcon}
                        <h3>Firm Performance</h3>
                    </div>
                    <p className="pf-card-desc">Monthly metrics and goals</p>

                    <div className="pf-progress-list">
                        <div className="pf-progress-item">
                            <div className="pf-progress-header">
                                <span>Applications Completed</span>
                                <span><strong>12 / 15</strong> goal</span>
                            </div>
                            <div className="pf-progress-bar"><div className="pf-progress-fill" style={{ width: '80%' }}></div></div>
                        </div>

                        <div className="pf-progress-item">
                            <div className="pf-progress-header">
                                <span>Client Satisfaction</span>
                                <span><strong>4.8 / 5.0</strong></span>
                            </div>
                            <div className="pf-progress-bar"><div className="pf-progress-fill" style={{ width: '96%' }}></div></div>
                        </div>

                        <div className="pf-progress-item">
                            <div className="pf-progress-header">
                                <span>Revenue Target</span>
                                <span><strong>$85K / $100K</strong></span>
                            </div>
                            <div className="pf-progress-bar"><div className="pf-progress-fill" style={{ width: '85%' }}></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatentFirmDashboard;
