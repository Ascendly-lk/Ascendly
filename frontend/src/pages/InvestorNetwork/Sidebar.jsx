import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const menuItems = [
    {
      path: "/dashboard/investor",
      icon: <i className="fi fi-rr-layout-fluid"></i>,
      label: "Dashboard",
    },
    {
      path: "/dashboard/investor/requests",
      icon: <i className="fi fi-rr-users-alt"></i>,
      label: "Requests",
    },
    {
      path: "/dashboard/investor/startups",
      icon: <i className="fi fi-rr-rocket-lunch"></i>,
      label: "Startups",
    },
    {
      path: "/dashboard/investor/calendar",
      icon: <i className="fi fi-rr-calendar"></i>,
      label: "Calendar",
    },
    {
      path: "/dashboard/investor/payments",
      icon: <i className="fi fi-rr-usd-square"></i>,
      label: "Payments",
    },
    {
      path: "/dashboard/investor/profile",
      icon: <i className="fi fi-rr-user"></i>,
      label: "Profile",
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo-text">Ascendly</h1>
        <span className="logo-tagline">INVESTOR NETWORK</span>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                <div className="active-indicator"></div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <ul className="nav-list secondary">
          <li className="nav-item">
            <NavLink
              to="/dashboard/investor/settings"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon"><i className="fi fi-rs-settings"></i></span>
              <span className="nav-label">Settings</span>
              <div className="active-indicator"></div>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/dashboard/investor/help"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="nav-icon"><i className="fi fi-sr-interrogation"></i></span>
              <span className="nav-label">Help</span>
              <div className="active-indicator"></div>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
