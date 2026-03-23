import React from "react";
import Sidebar from "../../pages/BusinessAdvisory/Sidebar";
import TopHeader from "../TopHeader";
import "../../pages/BusinessAdvisory/DashboardLayout.css";
import "./editProfile.css";

const EditProfile = () => {
  return (
    <div className="dashboard-container app-container">
      <Sidebar />

      <main className="main-content" style={{ marginLeft: '260px', flexGrow: 1, minWidth: 0, padding: '28px 40px' }}>
        <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
          <TopHeader showWelcome={false} title="Edit Profile" />

        <div className="content-wrapper">
          <div className="page-header">
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
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
