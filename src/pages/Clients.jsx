
import React, { useState, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText } from 'lucide-react';
import { AppContext } from '../App.jsx';
import { useNavigate } from 'react-router-dom';
import './Clients.css';

const ClientsPage = () => {
  const { clients, searchQuery, setSearchQuery } = useContext(AppContext);
  const navigate = useNavigate();
  
  const [tierFilter, setTierFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           client.industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = tierFilter === 'All' || client.tier === tierFilter;
      const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [clients, searchQuery, tierFilter, statusFilter]);

  return (
    <div className="clients-page-container">
      <div className="clients-header">
        <h1 className="title">My Clients & Matches</h1>
        <div className="clients-controls">
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filters-box">
             <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="select-input">
               <option value="All">Tiers</option>
               <option value="Starter">Starter</option>
               <option value="Growth">Growth</option>
               <option value="Scale">Scale</option>
             </select>
             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-input">
               <option value="All">Status</option>
               <option value="Active">Active</option>
               <option value="On-Hold">On-Hold</option>
               <option value="Risk">Risk</option>
             </select>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <div className="table-overflow">
          <table className="clients-table">
            <thead>
              <tr>
                <th>Health</th>
                <th>Startup Name</th>
                <th>Tier</th>
                <th>Start Date</th>
                <th>Contract</th>
                <th>Advisor</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <motion.tr key={client.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row group">
                  <td>
                    <div className="health-cell">
                       <div className={`health-dot ${client.health > 80 ? 'good' : client.health > 40 ? 'warn' : 'bad'}`}></div>
                       <span className="health-text">{client.health}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="name-cell">
                      <p className="name-primary">{client.name}</p>
                      <p className="name-secondary">{client.industry}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`tier-badge ${client.tier.toLowerCase()}`}>{client.tier}</span>
                  </td>
                  <td className="text-blue">{client.startDate}</td>
                  <td className="text-muted">{client.contractLength}</td>
                  <td>
                    <div className="advisor-cell">
                      <div className="advisor-img"><img src={`https://picsum.photos/seed/${client.advisor}/100/100`} alt="" /></div>
                      <span className="advisor-name">{client.advisor}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-text ${client.status.toLowerCase()}`}>
                      <div className="status-dot"></div> {client.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button onClick={() => navigate('/reports')} className="report-btn">
                      <FileText size={12} /> REPORT
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredClients.length === 0 && (
          <div className="empty-state">No matches found.</div>
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
