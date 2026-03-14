import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import MarketingAgencyProjects from './pages/marketing-agency/Projects';
import CalendarPage from './pages/Calendar';
import Payments from './pages/Payments';
import EditProfile from './pages/editProfile';
import Settings from './pages/Settings';
import NotificationsPage from './pages/Notifications';
import AccountPage from './pages/AccountPage';
import DashboardLayout from './pages/DashboardLayout';
import StartupDashboard from './pages/dashboard/StartupDashboard';
import AIAnalyticsDashboard from './pages/aianalytics/AIAnalyticsDashboard';
import UploadData from './pages/aianalytics/UploadData';
import AIAssistant from './pages/aianalytics/AIAssistant';
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="startup" replace />} />
            <Route path="startup" element={<StartupDashboard />} />
            <Route path="logistics" element={<LogisticsPage />} />
            <Route path="patent" element={<PatentPage />} />
            <Route path="investors" element={<InvestorsPage />} />
            <Route path="tiers" element={<TiersPage />} />
            <Route path="advisors" element={<AdvisorsPage />} />
            <Route path="clients" element={<Clients />} />
            <Route path="projects" element={<Projects />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="payments" element={<Payments />} />
            <Route path="profile" element={<DashboardPlaceholder />} />
            <Route path="help" element={<DashboardPlaceholder />} />
            <Route path="founder" element={<DashboardPlaceholder />} />
            <Route path="investor" element={<DashboardPlaceholder />} />
            <Route path="marketing" element={<DashboardPlaceholder />} />
            <Route path="advisor" element={<DashboardPlaceholder />} />
            <Route path="admin" element={<DashboardPlaceholder />} />
            <Route path="marketing-agency/projects" element={<MarketingAgencyProjects />} />
            <Route path="marketing-agency/feedbacks" element={<Feedbacks />} />
            <Route path="patent" element={<PatentPage />} />
            <Route path="patent-firm/dashboard" element={<PatentPage />} />
          </Route>

          <Route
            path="/dashboard/ai-analytics"
            element={
              <ProtectedRoute>
                <AIAnalyticsDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ai-analytics/upload"
            element={
              <ProtectedRoute>
                <UploadData />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ai-analytics/assistant"
            element={
              <ProtectedRoute>
                <AIAssistant />
              </ProtectedRoute>
            }
          />

          <Route
            path="/marketing-agency/projects"
            element={
              <ProtectedRoute>
                <MarketingAgencyProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketing-agency/feedbacks"
            element={
              <ProtectedRoute>
                <Feedbacks />
              </ProtectedRoute>
            }
          />

          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

