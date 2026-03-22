import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import './DashboardLayout.css';

/**
 * DashboardLayout
 * ───────────────
 * Shared shell for all /dashboard/* routes.
 * Renders the persistent Sidebar on the left.
 * Each page defines its own topbar — TopBar is NOT rendered here
 * to prevent a double-topbar problem.
 * <Outlet /> fills in the page-specific content on the right.
 */
const DashboardLayout = () => (
    <div className="dl-shell">
        <Sidebar />
        <div className="dl-main">
            <Outlet />
        </div>
    </div>
);

export default DashboardLayout;
