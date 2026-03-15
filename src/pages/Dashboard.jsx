
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Star, DollarSign, Plus, FileText, History } from 'lucide-react';
import { AppContext } from '../App.jsx';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './Dashboard.css';

const KPICard = ({ title, value, change, icon: Icon, subtext }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="kpi-card"
  >
    <div className="kpi-card-glow">
      <Icon size={80} className="kpi-icon-watermark" />
    </div>
    <div className="kpi-card-content">
      <div className="kpi-header">
        <div className="kpi-icon-box">
          <Icon size={20} />
        </div>
        {change && (
          <span className={`kpi-change ${change.startsWith('+') ? 'positive' : 'negative'}`}>
            {change} <TrendingUp size={12} />
          </span>
        )}
      </div>
      <h3 className="kpi-title">{title}</h3>
      <p className="kpi-value">{value}</p>
      <p className="kpi-subtext">{subtext}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { clients, tasks } = useContext(AppContext);

  const tierData = [
    { name: 'Starter', value: clients.filter(c => c.tier === 'Starter').length, color: '#00FFEF' },
    { name: 'Growth', value: clients.filter(c => c.tier === 'Growth').length, color: '#00FFEF' },
    { name: 'Scale', value: clients.filter(c => c.tier === 'Scale').length, color: '#00FFEF' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-row">
        <div>
          <h1 className="welcome-title">Welcome, Abdullah!</h1>
          <p className="welcome-sub">Your agency is performing 12% better than last month.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary"
        >
          <Plus size={18} /> New Campaign
        </motion.button>
      </div>

      <div className="kpi-grid">
        <KPICard title="Total Active Clients" value={clients.length} change="+14%" icon={Users} subtext="2 pending matches" />
        <KPICard title="Agency Rating" value="4.9" change="+0.2" icon={Star} subtext="48 reviews" />
        <KPICard title="Revenue Share" value="$142,500" change="+8.5%" icon={DollarSign} subtext="Q2 projection" />
      </div>

      <div className="dashboard-middle-row">
        <div className="task-panel">
          <div className="panel-header">
            <h3>Pending Client Actions</h3>
            <button className="link-action">View All</button>
          </div>
          <div className="task-list">
            {tasks.map((task) => (
              <motion.div key={task.id} whileHover={{ x: 5 }} className="task-item">
                <div className="task-info">
                  <div className={`task-dot ${task.priority}`}></div>
                  <div>
                    <p className="task-title">{task.title}</p>
                    <p className="task-client">{task.clientName}</p>
                  </div>
                </div>
                <div className="task-meta">
                  <p className="task-date">Due {task.dueDate}</p>
                  <button className="task-action-btn">Review</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="chart-panel">
          <h3>Tier Distribution</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={tierData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {tierData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#7DD3FC', borderColor: '#12324A', borderRadius: '12px', color: '#E6FBFF' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center-text">
              <p className="total-num">{clients.length}</p>
              <p className="total-label">Total</p>
            </div>
          </div>
          <div className="chart-legend">
            {tierData.map(item => (
              <div key={item.name} className="legend-item">
                <div className="legend-marker" style={{ backgroundColor: item.color }}></div>
                <span className="legend-name">{item.name}</span>
                <span className="legend-val">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="quick-actions-row">
        {[
          { label: 'Accept New Match', sub: '2 waiting', icon: Plus },
          { label: 'Submit General Report', sub: 'Quick update', icon: FileText },
          { label: 'View History', sub: 'Track earnings', icon: History },
        ].map((action, i) => (
          <motion.button key={i} whileHover={{ scale: 1.02 }} className="action-tile">
            <div className="action-icon-box"><action.icon size={20}/></div>
            <div>
              <p className="action-label">{action.label}</p>
              <p className="action-sub">{action.sub}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
