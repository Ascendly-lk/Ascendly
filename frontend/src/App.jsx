import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
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
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth pages — public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Account page — protected */}
          <Route path="/account" element={
            <ProtectedRoute><AccountPage /></ProtectedRoute>
          } />

          {/* ── Shared Dashboard Layout — protected ──────────────────────── */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardLayout /></ProtectedRoute>
          }>
            <Route index element={<Navigate to="startup" replace />} />
            <Route path="startup" element={<StartupDashboard />} />
            <Route path="logistics" element={<LogisticsPage />} />
            <Route path="patent" element={<PatentPage />} />
            <Route path="investors" element={<InvestorsPage />} />
            <Route path="tiers" element={<TiersPage />} />
            <Route path="advisors" element={<AdvisorsPage />} />
            <Route path="marketing-agency/projects" element={<Projects />} />
            <Route path="marketing-agency/feedbacks" element={<Feedbacks />} />
            {/* Role placeholders */}
            <Route path="founder" element={<DashboardPlaceholder />} />
            <Route path="investor" element={<DashboardPlaceholder />} />
            <Route path="marketing" element={<DashboardPlaceholder />} />
            <Route path="advisor" element={<DashboardPlaceholder />} />
            <Route path="admin" element={<DashboardPlaceholder />} />
          </Route>

          {/* ── AI Analytics — protected, standalone layout ─────────────── */}
          <Route path="/dashboard/ai-analytics" element={
            <ProtectedRoute><AIAnalyticsDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/ai-analytics/upload" element={
            <ProtectedRoute><UploadData /></ProtectedRoute>
          } />
          <Route path="/dashboard/ai-analytics/assistant" element={
            <ProtectedRoute><AIAssistant /></ProtectedRoute>
          } />

          {/* Marketing Agency standalone routes — protected */}
          <Route path="/marketing-agency/projects" element={
            <ProtectedRoute><Projects /></ProtectedRoute>
          } />
          <Route path="/marketing-agency/feedbacks" element={
            <ProtectedRoute><Feedbacks /></ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
