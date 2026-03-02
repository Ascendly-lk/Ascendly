import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Brain, FileText, 
  Calendar, MessageSquare, DollarSign, 
  Settings, HelpCircle, Menu 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Clients', icon: <Users size={20} />, path: '/clients' },
    { name: 'AI Analytics', icon: <Brain size={20} />, path: '/ai-analytics' },
    { name: 'Reports', icon: <FileText size={20} />, path: '/reports' },
    { name: 'Calendar', icon: <Calendar size={20} />, path: '/calendar' },
    { name: 'Feedbacks', icon: <MessageSquare size={20} />, path: '/feedbacks' },
    { name: 'Payments', icon: <DollarSign size={20} />, path: '/payments' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-logo">
        {isOpen && (
          <div className="logo-text">
            <h1>Ascendly</h1>
            <p>MARKETING AGENCY</p>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} className="toggle-btn">
          <Menu size={24} />
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-text">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item">
          <Settings size={20} />
          {isOpen && <span>Settings</span>}
        </NavLink>
        <NavLink to="/help" className="nav-item">
        
          <HelpCircle size={20} />
          {isOpen && <span>Help</span>}
        </NavLink>

        

        
      </div>
    </div>
  );
};

export default Sidebar;