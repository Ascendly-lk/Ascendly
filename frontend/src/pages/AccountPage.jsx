import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';

/* ── Global Nav ─────────────────────────────────────────────────────────── */
const GlobalNav = () => {
    const navigate = useNavigate();
    const navLinks = ['HOME', 'REQUESTS', 'EDUCATION', 'EVENTS', 'FUNDING', 'ANSWERS', 'MEMBERS', 'PERKS', 'TOUR', 'ABOUT'];

    return (
        <header className="acct-global-nav">
            <div className="acct-global-nav-inner">
                <div className="acct-brand">
                    <span className="acct-brand-logo">A</span>
                    <span className="acct-brand-name">Ascendly</span>
                </div>
                <nav className="acct-nav-links">
                    {navLinks.map((link) => (
                        <a key={link} href="#" className="acct-nav-link">{link}</a>
                    ))}
                </nav>
                <div className="acct-nav-right">
                    <div className="acct-user-chip">
                        <span className="acct-user-avatar">J</span>
                        <span className="acct-user-name">Janathan</span>
                    </div>
                    <button
                        className="acct-get-started-btn"
                        onClick={() => navigate('/dashboard/startup')}
                    >
                        Dashboard
                    </button>
                </div>
            </div>
        </header>
    );
};

/* ── Left Sidebar ────────────────────────────────────────────────────────── */
const sidebarItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'unlimited', label: 'Startups Unlimited' },
    { id: 'email', label: 'Email & Login' },
    { id: 'profile', label: 'Personal Profile' },
    { id: 'skills', label: 'Skills & Experiences' },
    { id: 'startup', label: 'Startup Profile' },
    { id: 'interests', label: 'Your Interests & Goals' },
    { id: 'billing', label: 'Billing' },
    { id: 'notif', label: 'Notifications' },
    { id: 'support', label: 'Support & Feedback' },
];

const AccountSidebar = ({ active, setActive }) => (
    <aside className="acct-sidebar">
        {/* Profile card */}
        <div className="acct-profile-card">
            <div className="acct-profile-avatar">J</div>
            <div className="acct-profile-info">
                <div className="acct-profile-name">Janathan</div>
                <div className="acct-profile-since">Member since 2026</div>
            </div>
            <button className="acct-view-profile-btn">View My Profile</button>
        </div>

        {/* Nav list */}
        <nav className="acct-sidebar-nav">
            {sidebarItems.map((item) => (
                <button
                    key={item.id}
                    className={`acct-sidebar-item${active === item.id ? ' active' : ''}`}
                    onClick={() => setActive(item.id)}
                >
                    {item.label}
                </button>
            ))}
        </nav>
    </aside>
);

/* ── Quick Link Card ─────────────────────────────────────────────────────── */
const QuickLinkCard = ({ label, icon }) => (
    <button className="acct-quick-card">
        <span className="acct-quick-icon">{icon}</span>
        <span className="acct-quick-label">{label}</span>
    </button>
);

/* ── Main Content ────────────────────────────────────────────────────────── */
const AccountMain = () => {
    const quickLinks = [
        {
            label: 'Email & Login',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                </svg>
            ),
        },
        {
            label: 'Personal Profile',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            ),
        },
        {
            label: 'Skills & Experiences',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ),
        },
        {
            label: 'Startup Profile',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
            ),
        },
        {
            label: 'Billing',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
            ),
        },
    ];

    return (
        <main className="acct-main">
            {/* Quick Links */}
            <section className="acct-section">
                <h2 className="acct-section-title">Quick Links</h2>
                <div className="acct-quick-links-grid">
                    {quickLinks.map((ql) => (
                        <QuickLinkCard key={ql.label} label={ql.label} icon={ql.icon} />
                    ))}
                </div>
            </section>

            {/* Account Alerts */}
            <section className="acct-section">
                <h2 className="acct-section-title">Account Alerts</h2>
                <div className="acct-alert-bar">
                    <span className="acct-alert-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </span>
                    <span className="acct-alert-text">Your email has not yet been confirmed.</span>
                    <button className="acct-confirm-btn">Confirm Your Email</button>
                </div>
            </section>

            {/* Your Requests */}
            <section className="acct-section">
                <div className="acct-section-header-row">
                    <h2 className="acct-section-title">Your Requests</h2>
                </div>
                <div className="acct-empty-card">
                    <p className="acct-empty-text">No requests yet.</p>
                    <button className="acct-create-btn">Create a Request</button>
                </div>
            </section>

            {/* Your Fundraises */}
            <section className="acct-section">
                <h2 className="acct-section-title">Your Fundraises</h2>
                <div className="acct-empty-card">
                    <button className="acct-create-btn">Create a Fundraise</button>
                </div>
            </section>
        </main>
    );
};

/* ── Page Root ───────────────────────────────────────────────────────────── */
const AccountPage = () => {
    const [activeSection, setActiveSection] = useState('overview');

    return (
        <div className="acct-shell">
            <GlobalNav />

            {/* Page header */}
            <div className="acct-page-header">
                <div className="acct-page-header-inner">
                    <div className="acct-page-breadcrumb">Account</div>
                    <div className="acct-page-title-row">
                        <h1 className="acct-page-title">Welcome back, Janathan!</h1>
                        <button className="acct-help-btn">Need Help?</button>
                    </div>
                </div>
            </div>

            {/* Body: sidebar + main */}
            <div className="acct-body">
                <AccountSidebar active={activeSection} setActive={setActiveSection} />
                <AccountMain />
            </div>

            {/* Floating chat bubble */}
            <button className="acct-chat-bubble" aria-label="Support chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </button>
        </div>
    );
};

export default AccountPage;
