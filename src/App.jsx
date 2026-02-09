import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logistics from "./pages/Logistics";
import AIAnalytics from "./pages/AIAnalytics";
import Patent from "./pages/Patent";
import MarketingAgency from "./pages/MarketingAgency";
import Investors from "./pages/Investors";
import Tiers from "./pages/Tiers";
import BusinessAdvisors from "./pages/BusinessAdvisors";
import "./App.css";
import Help from "./pages/Help";

// Dashboard Layout with Sidebar and Header
const DashboardLayout = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header userName="Sanavi" />
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes with Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/ai-analytics" element={<AIAnalytics />} />
          <Route path="/patent" element={<Patent />} />
          <Route path="/marketing-agency" element={<MarketingAgency />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/tiers" element={<Tiers />} />
          <Route path="/business-advisors" element={<BusinessAdvisors />} />
          <Route path="/help" element={<Help />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
