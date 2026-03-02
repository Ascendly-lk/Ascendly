import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: 'grid', active: true },
        { name: 'Logistics', icon: 'trending' },
        { name: 'AI Analytics', icon: 'brain' },
        { name: 'Patent', icon: 'shield' },
        { name: 'Marketing Agency', icon: 'briefcase' },
        { name: 'Investors', icon: 'users' },
        { name: 'Tiers', icon: 'layers' },
        { name: 'Business Advisors', icon: 'user-check' }
    ];

    const getIcon = (iconName) => {
        const icons = {
            grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
            trending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>,
            brain: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v4a3 3 0 0 0 3 3 3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z" /><path d="M12 12a3 3 0 0 0-3 3v4a3 3 0 0 0 6 0v-4a3 3 0 0 0-3-3z" /></svg>,
            shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
            briefcase: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
            users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
            layers: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>,
            'user-check': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>
        };
        return icons[iconName] || icons.grid;
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-logo">Ascendly</h1>
                <p className="sidebar-subtitle">STARTUPS DASHBOARD</p>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <a
                        key={index}
                        href="#"
                        className={`sidebar-nav-item ${item.active ? 'active' : ''}`}
                        onClick={
                            item.name === 'AI Analytics' ? (e) => { e.preventDefault(); navigate('/dashboard/ai-analytics'); } :
                                item.name === 'Logistics' ? (e) => { e.preventDefault(); navigate('/dashboard/logistics'); } :
                                    undefined
                        }
                    >
                        {getIcon(item.icon)}
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-upgrade">
                    <p>Upgrade to PRO to get access to all features!</p>
                </div>
                <a href="#" className="sidebar-help">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>Help</span>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
