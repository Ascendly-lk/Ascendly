import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import AccountPage from './pages/AccountPage';
import StartupDashboard from './pages/dashboard/StartupDashboard';
import AIAnalyticsDashboard from './pages/aianalytics/AIAnalyticsDashboard';
import UploadData from './pages/aianalytics/UploadData';
import AIAssistant from './pages/aianalytics/AIAssistant';
import Projects from './pages/marketing-agency/Projects';
import Feedbacks from './pages/marketing-agency/Feedbacks';
import LogisticsPage from './pages/dashboard/LogisticsPage';
import PatentPage from './pages/dashboard/PatentPage';
import InvestorsPage from './pages/dashboard/InvestorsPage';
import TiersPage from './pages/dashboard/TiersPage';
import AdvisorsPage from './pages/dashboard/AdvisorsPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Account page */}
        <Route path="/account" element={<AccountPage />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Startup Dashboard (Full Implementation) */}
        <Route path="/dashboard/startup" element={<StartupDashboard />} />

        {/* Logistics Page */}
        <Route path="/dashboard/logistics" element={<LogisticsPage />} />

        {/* Patent Page */}
        <Route path="/dashboard/patent" element={<PatentPage />} />

        {/* Investors Page */}
        <Route path="/dashboard/investors" element={<InvestorsPage />} />

        {/* Tiers / Pricing Page */}
        <Route path="/dashboard/tiers" element={<TiersPage />} />

        {/* Business Advisors Page */}
        <Route path="/dashboard/advisors" element={<AdvisorsPage />} />

        {/* AI Analytics Dashboard */}
        <Route path="/dashboard/ai-analytics" element={<AIAnalyticsDashboard />} />

        {/* AI Analytics — Upload Your Data */}
        <Route path="/dashboard/ai-analytics/upload" element={<UploadData />} />

        {/* AI Analytics — AI Assistant */}
        <Route path="/dashboard/ai-analytics/assistant" element={<AIAssistant />} />

        {/* Marketing Agency Projects */}
        <Route path="/marketing-agency/projects" element={<Projects />} />

        {/* Marketing Agency Feedbacks */}
        <Route path="/marketing-agency/feedbacks" element={<Feedbacks />} />

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
