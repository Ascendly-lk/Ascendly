import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const categories = [
    { id: 'general', label: 'General', icon: 'fi-rr-settings' },
    { id: 'notifications', label: 'Notifications', icon: 'fi-rr-bell' },
    { id: 'security', label: 'Security', icon: 'fi-rr-lock' },
    { id: 'billing', label: 'Billing', icon: 'fi-rr-credit-card' }
  ];

  return (
    <div className="settings-page">
      <h1 className="page-title">Settings</h1>

      <div className="settings-container">
        <div className="settings-sidebar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`settings-tab ${activeTab === cat.id ? 'active' : ''}`}
              onClick={() => setActiveTab(cat.id)}
            >
              <i className={`fi ${cat.icon}`}></i>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="settings-main">
          <div className="settings-card">
            <h3 className="settings-section-title">
              {categories.find(c => c.id === activeTab).label} Settings
            </h3>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" placeholder="Alexa Rawles" className="settings-input" />
              </div>

              <div className="form-group">
                <label>Timezone</label>
                <select className="settings-select">
                  <option>UTC -5:00 (Eastern Time)</option>
                  <option>UTC +0:00 (GMT)</option>
                  <option>UTC +5:30 (IST)</option>
                </select>
              </div>

              <div className="settings-toggle-group">
                <div className="toggle-info">
                  <h4>Public Profile</h4>
                  <p>Make your profile visible to potential clients</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="settings-toggle-group">
                <div className="toggle-info">
                  <h4>Email Notifications</h4>
                  <p>Receive updates about session requests</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>

              <div className="settings-actions">
                <button className="btn-cancel">Cancel</button>
                <button className="btn-save">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
