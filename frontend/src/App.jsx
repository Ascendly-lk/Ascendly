import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import AccountPage from './pages/AccountPage';
import DashboardLayout from './pages/DashboardLayout';
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
        {/* Default → login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth pages (no dashboard layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Account page (standalone, not inside dashboard layout) */}
        <Route path="/account" element={<AccountPage />} />

        {/* ── Shared Dashboard Layout ─────────────────────────────────────── */}
        {/* All /dashboard/* pages share the persistent Sidebar + TopBar       */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* Default sub-path */}
          <Route index element={<Navigate to="startup" replace />} />

          {/* Main dashboard */}
          <Route path="startup" element={<StartupDashboard />} />

          {/* Feature pages */}
          <Route path="logistics" element={<LogisticsPage />} />
          <Route path="patent" element={<PatentPage />} />
          <Route path="investors" element={<InvestorsPage />} />
          <Route path="tiers" element={<TiersPage />} />
          <Route path="advisors" element={<AdvisorsPage />} />


          {/* Marketing Agency */}
          <Route path="marketing-agency/projects" element={<Projects />} />
          <Route path="marketing-agency/feedbacks" element={<Feedbacks />} />

          {/* Role placeholders */}
          <Route path="founder" element={<DashboardPlaceholder />} />
          <Route path="investor" element={<DashboardPlaceholder />} />
          <Route path="marketing" element={<DashboardPlaceholder />} />
          <Route path="advisor" element={<DashboardPlaceholder />} />
          <Route path="admin" element={<DashboardPlaceholder />} />
        </Route>

        {/* ── AI Analytics (standalone — has its own AIAnalyticsSidebar) ─────── */}
        {/* These are outside DashboardLayout to avoid double sidebar.          */}
        <Route path="/dashboard/ai-analytics" element={<AIAnalyticsDashboard />} />
        <Route path="/dashboard/ai-analytics/upload" element={<UploadData />} />
        <Route path="/dashboard/ai-analytics/assistant" element={<AIAssistant />} />

        {/* Marketing Agency standalone routes (kept for backwards compat) */}
        <Route path="/marketing-agency/projects" element={<Projects />} />
        <Route path="/marketing-agency/feedbacks" element={<Feedbacks />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
