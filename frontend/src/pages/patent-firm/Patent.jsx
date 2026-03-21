import "./PageStyles.css";

const Patent = () => {
  const patents = [
    {
      id: "PAT-2024-001",
      title: "AI-Powered Analytics System",
      status: "Approved",
      filed: "2024-01-15",
      category: "Software",
    },
    {
      id: "PAT-2024-002",
      title: "Blockchain Integration Method",
      status: "Pending",
      filed: "2024-02-20",
      category: "Technology",
    },
    {
      id: "PAT-2024-003",
      title: "Smart IoT Network Protocol",
      status: "Under Review",
      filed: "2024-03-10",
      category: "Hardware",
    },
    {
      id: "PAT-2024-004",
      title: "Machine Learning Algorithm",
      status: "Approved",
      filed: "2023-11-05",
      category: "Software",
    },
    {
      id: "PAT-2024-005",
      title: "Data Encryption System",
      status: "Pending",
      filed: "2024-04-01",
      category: "Security",
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Patent Portfolio</h1>
          <p className="page-description">
            Manage and track your intellectual property
          </p>
        </div>
        <button className="btn btn-primary">+ New Patent</button>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📜</div>
          <div className="stat-info">
            <span className="stat-value">15</span>
            <span className="stat-label">Total Patents</span>
          </div>
        </div>
        <div className="stat-card accent">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">8</span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">5</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-info">
            <span className="stat-value">2</span>
            <span className="stat-label">Under Review</span>
          </div>
        </div>
      </div>

      <div className="card full-width">
        <div className="card-header-row">
          <h3 className="card-heading">Patent Applications</h3>
          <div className="filter-group">
            <select className="filter-select">
              <option value="">All Categories</option>
              <option value="software">Software</option>
              <option value="technology">Technology</option>
              <option value="hardware">Hardware</option>
              <option value="security">Security</option>
            </select>
            <select className="filter-select">
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patent ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Filed Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patents.map((patent) => (
                <tr key={patent.id}>
                  <td className="id-cell">{patent.id}</td>
                  <td>{patent.title}</td>
                  <td>
                    <span className="category-badge">{patent.category}</span>
                  </td>
                  <td>{patent.filed}</td>
                  <td>
                    <span
                      className={`status-badge ${patent.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {patent.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn">View</button>
                      <button className="action-btn">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patent;
