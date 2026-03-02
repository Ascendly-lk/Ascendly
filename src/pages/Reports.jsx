
import React, { useState, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { AppContext } from '../App.jsx';
import { MOCK_REPORTS } from "../data/mockData.js";
import { CheckCircle2, Circle, Plus, TrendingUp } from 'lucide-react';
import './Reports.css';

const ReportsPage = () => {
  const { deliverables, setDeliverables } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const completionPercentage = useMemo(() => {
    const completed = deliverables.filter(d => d.completed).length;
    return Math.round((completed / deliverables.length) * 100);
  }, [deliverables]);

  const toggleDeliverable = (id) => {
    setDeliverables(prev => prev.map(d => 
      d.id === id ? { ...d, completed: !d.completed } : d
    ));
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h1 className="title">Campaign Reports</h1>
          <p className="subtitle">Performance analysis for Q2 2024</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-create"
        >
          <Plus size={18} /> New Report
        </motion.button>
      </div>

      <div className="charts-grid">
        <div className="chart-box">
          <div className="chart-header">
            <h3>Revenue: Actual vs Forecast</h3>
            <div className="chart-legend">
              <div className="legend-item"><div className="marker actual"></div> Actual</div>
              <div className="legend-item"><div className="marker forecast"></div> Forecast</div>
            </div>
          </div>
          <div className="chart-viewport">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_REPORTS}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FFEF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FFEF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#12324A" vertical={false} />
                <XAxis dataKey="month" stroke="#5B8FA8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#5B8FA8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#071426', borderColor: '#12324A', borderRadius: '12px', color: '#E6FBFF' }} />
                <Area type="monotone" dataKey="actual" stroke="#00FFEF" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box">
           <h3 className="chart-title">Quarterly Conversions</h3>
           <div className="chart-viewport">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_REPORTS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#12324A" vertical={false} />
                <XAxis dataKey="month" stroke="#5B8FA8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#5B8FA8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#0B1F33' }} contentStyle={{ backgroundColor: '#071426', borderColor: '#12324A', borderRadius: '12px', color: '#E6FBFF' }} />
                <Bar dataKey="conversions" fill="#00FFEF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="reports-bottom-row">
        <div className="checklist-panel">
          <div className="panel-top">
            <div>
              <h3>Deliverables Checklist</h3>
              <p className="sub-hint">Tracking campaign milestones</p>
            </div>
            <div className="progress-stats">
              <span className="percent">{completionPercentage}%</span>
              <p className="label">Progress</p>
            </div>
          </div>

          <div className="progress-bar-bg">
            <motion.div initial={{ width: 0 }} animate={{ width: `${completionPercentage}%` }} className="progress-bar-fill" />
          </div>

          <div className="checklist-grid">
            {deliverables.map((item) => (
              <div key={item.id} onClick={() => toggleDeliverable(item.id)} className={`check-item ${item.completed ? 'done' : ''}`}>
                {item.completed ? <CheckCircle2 size={20} className="text-green" /> : <Circle size={20} className="text-muted" />}
                <span className="item-title">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ai-insight-panel">
          <div className="panel-glow"></div>
          <div className="insight-header">
             <div className="icon-wrap"><TrendingUp size={20} /></div>
             <h3 className="panel-title">AI Insight</h3>
          </div>
          <p className="insight-text">
            Based on current actual trends, we anticipate a **15% lift** in conversion rates if the PPC budget is reallocated next month.
          </p>
          <div className="insight-actions">
             <div className="suggestion-tile">
                <p className="tile-label">Suggested Action</p>
                <p className="tile-desc">Optimize ad frequency for Solar Energy.</p>
             </div>
             <motion.button whileHover={{ x: 5 }} className="apply-btn">Apply Optimization</motion.button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="modal-content">
            <h2 className="modal-title">Create New Report</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Report Title</label>
                <input type="text" placeholder="e.g. Q2 Performance" className="form-input" />
              </div>
              <div className="form-group">
                <label>Select Client</label>
                <select className="form-input">
                  <option>All Clients</option>
                  <option>Nexus Tech</option>
                  <option>GreenLeaf Bio</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancel</button>
              <button onClick={() => setIsModalOpen(false)} className="btn-confirm">Create</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
