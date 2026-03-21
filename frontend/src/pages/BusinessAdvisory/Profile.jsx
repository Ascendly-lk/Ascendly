import React, { useState, useEffect } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/TopHeader";
import { useAuth } from "../../context/AuthContext";
import { getToken } from "../../utils/auth";
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = { ...user, ...formData, full_name: `${formData.first_name} ${formData.last_name}`.strip() };
      setUser(updatedUser);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage("Error updating profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <main className="profile-main">
        <TopHeader showWelcome={false} />

        <div className="profile-content-wrapper">
          <div className="profile-header">
            <h2 className="profile-title">Edit Profile</h2>
            <p className="profile-subtitle">
              Update your personal information and contact details.
            </p>
          </div>

          <div className="profile-card">
            <div className="photo-section">
              <div className="photo-placeholder">
                {user?.avatar_url && <img src={user.avatar_url} alt="Profile" />}
              </div>
              <div className="photo-info">
                <h3>Profile Photo</h3>
                <p>
                  This will be displayed on your profile and visible to other
                  investors.
                </p>
                <button className="btn btn-primary">Upload New</button>
              </div>
            </div>

            <div className="profile-divider"></div>

            <form onSubmit={handleSave}>
              <div className="profile-section">
                <h3 className="section-title">Personal Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="Startup Founder">Startup Founder</option>
                      <option value="Investor">Investor</option>
                      <option value="Marketing Agency">Marketing Agency</option>
                      <option value="Business Advisor">Business Advisor</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={user?.email || ""} disabled />
                  </div>
                </div>
              </div>

              <div className="profile-footer">
                {message && <p className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</p>}
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
