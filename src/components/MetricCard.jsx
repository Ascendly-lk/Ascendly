import React from "react";
import "../pages/Dashboard.css";
import "./MetricCard.css";

const MetricCard = ({ icon, title, value, variant }) => {
  return (
    <div className={`metric-card ${variant || ""}`}>
      <div className="metric-info">
        <div className="metric-icon">{icon}</div>

        <div className="metric-text">
          <span className="metric-title">{title}</span>
          <span className="metric-value">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
