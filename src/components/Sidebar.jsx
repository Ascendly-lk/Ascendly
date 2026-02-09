import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    {
      path: "/dashboard",
      icon: <i className="fi fi-rr-dashboard-panel"></i>,
      label: "Dashboard",
    },
    {
      path: "/logistics",
      icon: <i className="fi fi-rr-arrow-trend-up"></i>,
      label: "Logistics",
    },
    {
      path: "/ai-analytics",
      icon: <i className="fi fi-sr-analyse"></i>,
      label: "AI Analytics",
    },
    {
      path: "/patent",
      icon: <i className="fi fi-tr-license"></i>,
      label: "Patent",
    },
    
    {
      path: "/marketing-agency",
      icon: <i className="fi fi-bs-calendar"></i>,
      label: "Marketing Agency",
    },
    {
      path: "/investors",
      icon: <i className="fi fi-rr-chart-pie-simple-circle-dollar"></i>,
      label: "Investors",
    },
    {
      path: "/tiers",
      icon: <i className="fi fi-rr-user-salary"></i>,
      label: "Tiers",
    },
    {
      path: "/business-advisors",
      icon: <i className="fi fi-rr-user"></i>,
      label: "Business Advisors",
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">Ascendly</h1>
        <p className="sidebar-tagline">
          STARTUP
          <br />
          DASHBOARD
        </p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
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
      </nav>

      <div className="sidebar-footer">
        <div className="upgrade-card">
          <h3>Upgrade to PRO to get access to all features!</h3>
          <button className="btn btn-primary">Upgrade Now</button>
        </div>
        <NavLink
  to="/help"
  className={({ isActive }) =>
    `help-button ${isActive ? "active" : ""}`
  }
>
  <span><i className="fi fi-sr-interrogation"></i></span>
  Help
</NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
