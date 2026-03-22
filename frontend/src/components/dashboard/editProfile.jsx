import React, { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "../../pages/BusinessAdvisory/DashboardLayout.css";
import "./EditProfile.css";

const EditProfile = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="dl-shell app-container">
      <Sidebar />

      <main className="dl-main main-content">
        <TopBar />

        <div className="content-wrapper">
          <div className="page-header">
            <h2 className="page-title">Edit Profile</h2>
            <p className="page-subtitle">
              Update your personal information and contact details.
            </p>
          </div>

          {/* Edit Profile Form Card */}
          <div className="card profile-card">
            {/* Photo Section */}
            <div className="section photo-section">
              <div className="photo-placeholder"></div>
              <div className="photo-info">
                <h3>Profile Photo</h3>
                <p>
                  This will be displayed on your profile and visible to other
                  investors.
                  <br />
                  JPG, GIF or PNG. Max size of 800K.
                </p>
                <button className="btn btn-primary">Upload New</button>
              </div>
            </div>

            <div className="divider"></div>

            {/* Personal Details */}
            <div className="section personal-details">
              <h3 className="section-title">Personal Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" defaultValue="Sanavi" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" defaultValue="" />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <div className="input-prefix-group">
                    <span className="prefix">Ascendely.com/</span>
                    <input type="text" defaultValue="" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input type="text" defaultValue="" />
                </div>
              </div>
            </div>

            <div className="divider"></div>

            {/* Contact Details */}
            <div className="section contact-details">
              <h3 className="section-title">Contact Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue="" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" defaultValue="" />
                </div>
                <div className="form-group full-width">
                  <label>Home Address</label>
                  <textarea rows="3"></textarea>
                </div>
              </div>
            </div>

            {/* Save Button Section */}
            <div className="section actions-section" style={{ marginTop: '24px' }}>
              <button className="btn btn-primary" onClick={handleSave}>
                Save Details
              </button>
            </div>
          </div>
        </div>

        {/* Success Toast Popup */}
        {showSuccess && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#10B981',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span style={{ fontWeight: '500' }}>Details saved successfully</span>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EditProfile;
