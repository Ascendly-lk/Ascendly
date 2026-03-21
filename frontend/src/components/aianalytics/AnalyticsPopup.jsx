import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { X, TrendingUp, Users, DollarSign, Activity, ChevronRight } from 'lucide-react';
import './AnalyticsPopup.css';

// Mock Data Generators
const mockLineData = [
  { name: 'Jan', users: 8000 },
  { name: 'Feb', users: 9500 },
  { name: 'Mar', users: 11000 },
  { name: 'Apr', users: 10500 },
  { name: 'May', users: 12450 },
];

const mockBarData = [
  { name: 'Q1', revenue: 40000 },
  { name: 'Q2', revenue: 55000 },
  { name: 'Q3', revenue: 78000 },
  { name: 'Q4', revenue: 95000 },
];

const mockPieData = [
  { name: 'Enterprise', value: 400 },
  { name: 'Pro', value: 300 },
  { name: 'Free', value: 300 },
];
const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b'];

const mockAreaData = [
  { name: 'Week 1', engagement: 40 },
  { name: 'Week 2', engagement: 60 },
  { name: 'Week 3', engagement: 55 },
  { name: 'Week 4', engagement: 85 },
];

const defaultSuggestions = [
  "Improve onboarding flow to increase retention",
  "Focus marketing on high-converting segments",
  "Optimize pricing tiers for better Enterprise conversions",
  "Increase engagement through personalized notifications"
];

const AnalyticsPopup = ({ isOpen, onClose, onSuggestionClick, data }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle animation mounting/unmounting
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // match CSS fade-out transition
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`analytics-popup-overlay ${isOpen ? 'open' : 'closing'}`} onClick={onClose}>
      <div className="analytics-popup-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="analytics-popup-header">
          <div>
            <h2 className="analytics-popup-title">AI Business Insights</h2>
            <p className="analytics-popup-subtitle">Generated from your uploaded data</p>
          </div>
          <button className="analytics-popup-close-btn" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="analytics-popup-content-scroll">
          
          {/* KPI Metrics Grid */}
          <div className="analytics-kpi-grid">
            <div className="analytics-kpi-card">
              <div className="analytics-kpi-icon-wrapper users"><Users size={20} /></div>
              <div className="analytics-kpi-info">
                <span className="analytics-kpi-label">Monthly Active Users</span>
                <span className="analytics-kpi-value">12,450 <span className="trend positive">↑ 8%</span></span>
              </div>
            </div>
            <div className="analytics-kpi-card">
              <div className="analytics-kpi-icon-wrapper target"><Activity size={20} /></div>
              <div className="analytics-kpi-info">
                <span className="analytics-kpi-label">Conversion Rate</span>
                <span className="analytics-kpi-value">4.3% <span className="trend positive">↑ 1.2%</span></span>
              </div>
            </div>
            <div className="analytics-kpi-card">
              <div className="analytics-kpi-icon-wrapper retention"><TrendingUp size={20} /></div>
              <div className="analytics-kpi-info">
                <span className="analytics-kpi-label">Customer Retention</span>
                <span className="analytics-kpi-value">78% <span className="trend negative">↓ 2%</span></span>
              </div>
            </div>
            <div className="analytics-kpi-card">
              <div className="analytics-kpi-icon-wrapper revenue"><DollarSign size={20} /></div>
              <div className="analytics-kpi-info">
                <span className="analytics-kpi-label">MRR Revenue</span>
                <span className="analytics-kpi-value">$24,000 <span className="trend positive">↑ 12%</span></span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="analytics-charts-grid">
            {/* Component 1: Line Chart */}
            <div className="analytics-chart-container">
              <h3 className="analytics-chart-title">Monthly Active Users</h3>
              <div className="analytics-chart-wrapper">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={mockLineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e5e7eb)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary, #6b7280)', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary, #6b7280)', fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                    <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Component 2: Bar Chart */}
            <div className="analytics-chart-container">
              <h3 className="analytics-chart-title">Revenue Growth</h3>
              <div className="analytics-chart-wrapper">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={mockBarData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e5e7eb)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary, #6b7280)', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary, #6b7280)', fontSize: 12}} />
                    <Tooltip cursor={{fill: 'rgba(99, 102, 241, 0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Component 3: Pie Chart */}
            <div className="analytics-chart-container">
              <h3 className="analytics-chart-title">User Segments</h3>
              <div className="analytics-chart-wrapper">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={mockPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {mockPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Component 4: Area Chart */}
            <div className="analytics-chart-container">
              <h3 className="analytics-chart-title">Engagement Trends</h3>
              <div className="analytics-chart-wrapper">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={mockAreaData}>
                    <defs>
                      <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #e5e7eb)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary, #6b7280)', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-secondary, #6b7280)', fontSize: 12}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="engagement" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEngage)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Suggestions Section */}
          <div className="analytics-suggestions-container">
            <h3 className="analytics-suggestions-title">AI Growth Recommendations</h3>
            <div className="analytics-suggestions-list">
              {defaultSuggestions.map((suggestion, index) => (
                <button 
                  key={index} 
                  className="analytics-suggestion-btn"
                  onClick={() => {
                    onClose();
                    onSuggestionClick(suggestion);
                  }}
                >
                  <span className="analytics-suggestion-text">{suggestion}</span>
                  <ChevronRight size={18} className="analytics-suggestion-icon" />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPopup;
