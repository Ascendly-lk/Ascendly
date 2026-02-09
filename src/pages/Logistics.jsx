import "./PageStyles.css";

const Logistics = () => {
  const shipments = [
    {
      id: "SHP-001",
      destination: "New York, USA",
      status: "In Transit",
      progress: 75,
      eta: "2 days",
    },
    {
      id: "SHP-002",
      destination: "London, UK",
      status: "Processing",
      progress: 30,
      eta: "5 days",
    },
    {
      id: "SHP-003",
      destination: "Tokyo, Japan",
      status: "Delivered",
      progress: 100,
      eta: "Completed",
    },
    {
      id: "SHP-004",
      destination: "Sydney, Australia",
      status: "Pending",
      progress: 10,
      eta: "7 days",
    },
  ];

  const inventory = [
    { item: "Product A", stock: 1250, status: "In Stock", trend: "up" },
    { item: "Product B", stock: 340, status: "Low Stock", trend: "down" },
    { item: "Product C", stock: 890, status: "In Stock", trend: "stable" },
    { item: "Product D", stock: 45, status: "Critical", trend: "down" },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">Logistics</h1>
        <p className="page-description">Track shipments and manage inventory</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-value">42</span>
            <span className="stat-label">Active Shipments</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-value">128</span>
            <span className="stat-label">Delivered This Month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-value">2.5 days</span>
            <span className="stat-label">Avg. Delivery Time</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏭</div>
          <div className="stat-info">
            <span className="stat-value">2,525</span>
            <span className="stat-label">Total Inventory</span>
          </div>
        </div>
      </div>

      <div className="content-columns">
        <div className="card">
          <h3 className="card-heading">Active Shipments</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className="id-cell">{shipment.id}</td>
                    <td>{shipment.destination}</td>
                    <td>
                      <span
                        className={`status-badge ${shipment.status.toLowerCase().replace(" ", "-")}`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${shipment.progress}%` }}
                        ></div>
                      </div>
                    </td>
                    <td>{shipment.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="card-heading">Inventory Status</h3>
          <div className="inventory-list">
            {inventory.map((item, index) => (
              <div key={index} className="inventory-item">
                <div className="inventory-info">
                  <span className="inventory-name">{item.item}</span>
                  <span
                    className={`inventory-status ${item.status.toLowerCase().replace(" ", "-")}`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="inventory-stock">
                  <span className="stock-value">{item.stock}</span>
                  <span className={`stock-trend ${item.trend}`}>
                    {item.trend === "up"
                      ? "↑"
                      : item.trend === "down"
                        ? "↓"
                        : "→"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logistics;
