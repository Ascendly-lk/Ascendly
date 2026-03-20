import { NavLink } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  Users,
  Wallet,
} from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    {
      path: "/business-advisory",
      icon: <LayoutDashboard size={16} strokeWidth={2} />,
      label: "Dashboard",
      end: true,
    },
    {
      path: "/dashboard/ai-analytics",
      icon: <BarChart3 size={16} strokeWidth={2} />,
      label: "AI Analytics",
    },
    {
      path: "/dashboard/clients",
      icon: <Users size={16} strokeWidth={2} />,
      label: "Clients",
    },
    {
      path: "/dashboard/projects",
      icon: <FolderKanban size={16} strokeWidth={2} />,
      label: "Projects",
    },
    {
      path: "/dashboard/calendar",
      icon: <CalendarDays size={16} strokeWidth={2} />,
      label: "Calendar",
    },
    {
      path: "/dashboard/payments",
      icon: <Wallet size={16} strokeWidth={2} />,
      label: "Payments",
    },
  ];

  const footerItems = [
    {
      path: "/dashboard/help",
      icon: <CircleHelp size={16} strokeWidth={2} />,
      label: "Help",
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Ascendly</h1>
        <p className="sidebar-tagline">
          BUSINESS
          <br />
          ADVISORY
        </p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {footerItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
