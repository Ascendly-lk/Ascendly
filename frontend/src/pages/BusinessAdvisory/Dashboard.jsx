import React, { useState, useEffect } from "react";
import {
  CircleDollarSign,
  MapPin,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import TopHeader from "../../components/TopHeader";
import { apiFetch } from "../../api";
import "./dashboard.css";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    active_users: 0,
    monthly_revenue: 0,
    engagement_score: 0,
    growth: 0
  });

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await apiFetch('/dashboard/metrics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      }
    }
    fetchMetrics();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <main className="dashboard-main">
        <TopHeader />

        {/* Stats Row */}
        <div className="stats-grid">
          {/* Active Startups - Primary Card */}
          <div className="stat-card primary">
            <div className="stat-header">
              <div className="icon-box">
                <Users />
              </div>
              <span className="stat-change">{metrics.growth >= 0 ? `+${metrics.growth}%` : `${metrics.growth}%`} ↗</span>
            </div>
            <div className="stat-body">
              <div className="stat-value">{metrics.active_users}</div>
              <div className="stat-label">Active Startups</div>
            </div>
          </div>

          {/* Monthly Revenue */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="icon-box">
                <CircleDollarSign />
              </div>
              <span className="stat-change positive">+15% ↗</span>
            </div>
            <div className="stat-body">
              <div className="stat-value">$ {metrics.monthly_revenue.toLocaleString()}</div>
              <div className="stat-label">Monthly Revenue</div>
            </div>
          </div>

          {/* Success Rate */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="icon-box">
                <TrendingUp />
              </div>
              <span className="stat-change negative">-5% ↘</span>
            </div>
            <div className="stat-body">
              <div className="stat-value">{metrics.engagement_score} %</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>

          {/* Profiles Viewed */}
          <div className="stat-card">
            <div className="stat-header">
              <div className="icon-box">
                <UserRound />
              </div>
              <span className="stat-change positive">+87 ↗</span>
            </div>
            <div className="stat-body">
              <div className="stat-value">156</div>
              <div className="stat-label">Profiles viewed</div>
            </div>
          </div>
        </div>

        <h2 className="section-headline">Quick Actions</h2>

        <div className="actions-grid">
          {/* Edit Profile Card */}
          <div className="action-card profile-action-card">
            <h3 className="card-title">Edit your Profile</h3>
            <div className="profile-avatar-large">
              <img src="https://via.placeholder.com/150" alt="Profile" />
            </div>
            <div className="profile-name">Abdullah</div>
            <div className="profile-location">
              <MapPin /> Colombo, Sri Lanka
            </div>
            <div className="profile-stats">
              <div className="p-stat">
                <span className="p-stat-label">Projects</span>
                <span className="p-stat-value">28</span>
              </div>
              <div className="p-stat">
                <span className="p-stat-label">Followers</span>
                <span className="p-stat-value">643</span>
              </div>
              <div className="p-stat">
                <span className="p-stat-label">Following</span>
                <span className="p-stat-value">76</span>
              </div>
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div className="action-card">
            <h3 className="card-title">Upcoming Meetings</h3>
            <div className="meetings-list">
              <div className="meeting-item">
                <div className="meeting-info">
                  <div className="meeting-title">Meet w/ Simmmple</div>
                  <div className="meeting-time">01:00 PM - 02:00 PM</div>
                </div>
                <a href="#" className="meeting-link">
                  https://sample.edu/da
                </a>
              </div>
              <div className="meeting-item">
                <div className="meeting-info">
                  <div className="meeting-title">Fitness Training</div>
                  <div className="meeting-time">02:00 PM - 03:00 PM</div>
                </div>
                <a href="#" className="meeting-link">
                  https://sample.edu/da
                </a>
              </div>
              <div className="meeting-item">
                <div className="meeting-info">
                  <div className="meeting-title">Reading time</div>
                  <div className="meeting-time">03:00 PM - 04:00 PM</div>
                </div>
                <a href="#" className="meeting-link">
                  https://sample.edu/da
                </a>
              </div>
            </div>
            <a href="#" className="view-all-link">
              View all »
            </a>
          </div>

          {/* Status Column */}
          <div className="status-column">
            <div className="status-card-small">
              <div className="status-header">Pending Approvals</div>
              <div className="status-value-large">12</div>
            </div>
            <div className="status-card-small">
              <div className="status-header">Missed Notifications</div>
              <div className="status-value-large">8</div>
            </div>
            <div className="status-card-small">
              <div className="status-header">Pending Approvals</div>
              <div className="status-value-large">
                12 <span className="trend-badge">↑ +2.01%</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
