import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import StartupDashboard from './pages/dashboard/StartupDashboard';
import AIAnalyticsDashboard from './pages/aianalytics/AIAnalyticsDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Startup Dashboard (Full Implementation) */}
        <Route path="/dashboard/startup" element={<StartupDashboard />} />

        {/* AI Analytics Dashboard */}
        <Route path="/dashboard/ai-analytics" element={<AIAnalyticsDashboard />} />

        {/* Role-based dashboard routes (placeholders) */}
        <Route path="/dashboard/founder" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/investor" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/marketing" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/advisor" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/admin" element={<DashboardPlaceholder />} />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
