import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    FileText,
    Calendar,
    User,
    Shield,
    Download,
    MessageSquare,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import TopBar from "../../components/dashboard/TopBar";
import "./Dashboard.css";
import "./Clients.css";

// Basic Component Replicas
const Card = ({ children, className = "" }) => <div className={`cl-card ${className}`}>{children}</div>;
const CardHeader = ({ children, className = "" }) => <div className={`cl-card-header ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`cl-card-title ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = "" }) => <div className={`cl-card-desc ${className}`}>{children}</div>;
const CardContent = ({ children, className = "" }) => <div className={`cl-card-content ${className}`}>{children}</div>;
const Button = ({ children, className = "", variant = "primary", size = "default", onClick }) => (
    <button className={`cl-btn cl-btn-${variant} cl-btn-${size} ${className}`} onClick={onClick}>{children}</button>
);
const Badge = ({ children, className = "" }) => <span className={`cl-badge ${className}`}>{children}</span>;
const Progress = ({ value, className = "" }) => (
    <div className={`pf-progress-bar ${className}`}>
        <div className="pf-progress-fill" style={{ width: `${value}%` }}></div>
    </div>
);

// Status Tracker Replica
const StatusTracker = ({ steps }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    backgroundColor: step.status === 'completed' ? '#34D399' : step.status === 'current' ? '#60A5FA' : 'rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B0F19'
                }}>
                    {step.status === 'completed' && <CheckCircle2 size={14} color="#0B0F19" />}
                    {step.status === 'current' && <div style={{ width: '8px', height: '8px', backgroundColor: '#fff', borderRadius: '50%' }}></div>}
                </div>
                <div style={{ flex: 1, color: step.status === 'upcoming' ? 'var(--text-gray)' : 'var(--text-white)' }}>{step.name}</div>
                {step.date && <div style={{ color: 'var(--text-gray)', fontSize: '12px' }}>{step.date}</div>}
            </div>
        ))}
    </div>
);

// Mock data
const applicationData = {
    "PAT-2026-001": {
        id: "PAT-2026-001",
        title: "AI-Powered Task Automation Engine",
        type: "Software",
        status: "Expert Review",
        progress: 60,
        lastUpdated: "March 3, 2026",
        filingType: "Non-Provisional",
        tier: "Tier 2",
        assignedExpert: "Dr. Sarah Chen",
        description: "An intelligent task automation system that uses machine learning to predict and automate repetitive workflows across enterprise applications.",
        steps: [
            { name: "Application Submitted", status: "completed", date: "February 20, 2026" },
            { name: "Initial Review", status: "completed", date: "February 22, 2026" },
            { name: "Expert Assignment", status: "completed", date: "February 24, 2026" },
            { name: "Novelty Assessment", status: "current", date: "In Progress" },
            { name: "Patent Drafting", status: "upcoming" },
            { name: "USPTO Filing", status: "upcoming" },
            { name: "Examination", status: "upcoming" },
        ],
        documents: [
            { name: "Technical Specifications.pdf", size: "2.4 MB", date: "Feb 20, 2026" },
            { name: "System Architecture.png", size: "1.1 MB", date: "Feb 20, 2026" },
            { name: "Prior Art Research.docx", size: "856 KB", date: "Feb 21, 2026" },
        ],
        notes: [
            { date: "March 3, 2026", author: "Dr. Sarah Chen", text: "Completed initial novelty search. Found 3 related patents but your approach is sufficiently distinct. Recommending to proceed with claims focused on the ML prediction algorithm." },
            { date: "February 24, 2026", author: "System", text: "Application assigned to Dr. Sarah Chen for expert review." },
        ],
    },
};

export default function ApplicationDetail() {
    const navigate = useNavigate();
    const { id } = useParams();

    const application = id ? applicationData[id] : null;

    if (!application) {
        return (
            <div className="startup-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '24px', color: 'var(--text-white)', marginBottom: '8px' }}>Application Not Found</h2>
                    <p style={{ color: 'var(--text-gray)', marginBottom: '16px' }}>The application you're looking for doesn't exist.</p>
                    <Button variant="outline" onClick={() => navigate("/dashboard/patent-firm/applications")}>
                        <ArrowLeft size={16} style={{ marginRight: '8px' }} />
                        Back to Applications
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="startup-dashboard">
            <TopBar />

            <div className="pf-hero" style={{ padding: '32px 28px 16px 28px' }}>
                <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/patent-firm/applications")} className="mb-4" style={{ marginBottom: '16px' }}>
                    <ArrowLeft size={14} style={{ marginRight: '8px' }} />
                    Back to Applications
                </Button>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <FileText size={28} color="#60A5FA" />
                            <h1 style={{ margin: 0 }}>{application.title}</h1>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', color: 'var(--text-gray)', fontSize: '14px' }}>
                            <span className="font-mono">{application.id}</span>
                            <span>•</span>
                            <span>{application.type}</span>
                            <span>•</span>
                            <span>{application.filingType}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Badge className="cl-tier-2">{application.status}</Badge>
                        <Badge className="cl-tier-1">{application.tier}</Badge>
                    </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                        <span style={{ color: 'var(--text-gray)' }}>Overall Progress</span>
                        <span style={{ color: 'var(--text-white)', fontWeight: 600 }}>{application.progress}%</span>
                    </div>
                    <Progress value={application.progress} />
                </div>
            </div>

            <div className="dashboard-content pf-content" style={{ display: 'flex', gap: '24px', flexDirection: 'row', flexWrap: 'wrap' }}>

                {/* Main Content Column */}
                <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p style={{ color: 'var(--text-gray)', lineHeight: 1.6 }}>{application.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Application Timeline</CardTitle>
                            <CardDescription>Track your patent application progress</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StatusTracker steps={application.steps} />
                        </CardContent>
                    </Card>

                    <Card style={{ backgroundColor: 'rgba(96, 165, 250, 0.05)', borderColor: 'rgba(96, 165, 250, 0.2)' }}>
                        <CardContent style={{ paddingTop: '24px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <AlertCircle size={20} color="#60A5FA" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <div style={{ color: '#60A5FA', fontWeight: 600, marginBottom: '4px' }}>Next Steps</div>
                                    <div style={{ color: 'var(--text-white)', fontSize: '14px', lineHeight: 1.5 }}>
                                        Your expert is currently conducting a comprehensive novelty assessment.
                                        You'll receive a detailed report within 3-5 business days. No action required from you at this time.
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Application Documents</CardTitle>
                            <CardDescription>Files submitted with this application</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {application.documents.map((doc, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', border: '1px solid var(--input-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ padding: '8px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                                <FileText size={20} color="var(--text-gray)" />
                                            </div>
                                            <div>
                                                <div style={{ color: 'var(--text-white)', fontWeight: 500 }}>{doc.name}</div>
                                                <div style={{ color: 'var(--text-gray)', fontSize: '13px' }}>{doc.size} • {doc.date}</div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm"><Download size={16} /></Button>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" className="cl-w-full" style={{ marginTop: '16px', justifyContent: 'center' }}>Upload Additional Documents</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Log</CardTitle>
                            <CardDescription>Timeline of updates and communications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {application.notes.map((note, i) => (
                                    <div key={i} style={{ paddingBottom: '16px', borderBottom: i < application.notes.length - 1 ? '1px solid var(--input-border)' : 'none' }}>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                            <MessageSquare size={16} color="var(--text-gray)" style={{ marginTop: '4px' }} />
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    <span style={{ color: 'var(--text-white)', fontWeight: 500 }}>{note.author}</span>
                                                    <span style={{ color: 'var(--text-gray)', fontSize: '12px' }}>{note.date}</span>
                                                </div>
                                                <p style={{ color: 'var(--text-gray)', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{note.text}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Sidebar Column */}
                <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <Card>
                        <CardHeader><CardTitle>Assigned Expert</CardTitle></CardHeader>
                        <CardContent>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #60A5FA, #C084FC)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>SC</div>
                                <div>
                                    <div style={{ color: 'var(--text-white)', fontWeight: 500 }}>{application.assignedExpert}</div>
                                    <div style={{ color: 'var(--text-gray)', fontSize: '13px' }}>Software & AI Patents</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                        <CheckCircle2 size={12} color="#34D399" />
                                        <span style={{ color: '#34D399', fontSize: '12px' }}>USPTO Registered</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="cl-w-full" style={{ justifyContent: 'center' }}><MessageSquare size={16} style={{ marginRight: '8px' }} /> Send Message</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Key Dates</CardTitle></CardHeader>
                        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <Calendar size={16} color="var(--text-gray)" style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ color: 'var(--text-white)', fontSize: '14px', fontWeight: 500 }}>Submitted</div>
                                    <div style={{ color: 'var(--text-gray)', fontSize: '12px' }}>February 20, 2026</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <Calendar size={16} color="var(--text-gray)" style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ color: 'var(--text-white)', fontSize: '14px', fontWeight: 500 }}>Last Updated</div>
                                    <div style={{ color: 'var(--text-gray)', fontSize: '12px' }}>{application.lastUpdated}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                <Calendar size={16} color="var(--text-gray)" style={{ marginTop: '2px' }} />
                                <div>
                                    <div style={{ color: 'var(--text-white)', fontSize: '14px', fontWeight: 500 }}>Est. Filing Date</div>
                                    <div style={{ color: 'var(--text-gray)', fontSize: '12px' }}>April 15, 2026</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} /> Service Tier</CardTitle></CardHeader>
                        <CardContent>
                            <Badge className="cl-tier-1" style={{ marginBottom: '16px', display: 'inline-block' }}>{application.tier}: Full Support</Badge>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {['Expert attorney review', 'Priority filing support', 'Dedicated case manager'].map((feature, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <CheckCircle2 size={16} color="#34D399" style={{ marginTop: '2px', flexShrink: 0 }} />
                                        <span style={{ color: 'var(--text-gray)', fontSize: '14px' }}>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
