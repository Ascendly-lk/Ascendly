import Sidebar from "./Sidebar";
import TopHeader from "../../components/TopHeader";

export default function Payments() {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main
        style={{
          flexGrow: 1,
          minWidth: 0,
          marginLeft: "260px",
          padding: "28px 40px",
          color: "#fff",
        }}
      >
        <TopHeader showWelcome={false} />
        <div style={{ marginTop: "40px", maxWidth: "800px", margin: "40px auto 0" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#00ffef" }}>
            Payments
          </h1>
          <p style={{ color: "#b0b8c8", marginTop: "8px" }}>
            Payment management features coming soon.
          </p>
        </div>
      </main>
    </div>
  );
}
