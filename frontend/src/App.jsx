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
import DocumentReview from './pages/patent-firm/DocumentReview';
import PaymentPortal from './pages/PaymentPortal';

// Patent Firm
import PatentFirmDashboard from './pages/patent-firm/Dashboard';
import PatentFirmClients from './pages/patent-firm/Clients';
import Applications from './pages/patent-firm/Applications';
import ApplicationDetail from './pages/patent-firm/ApplicationDetail';
import PatentFirmPayments from './pages/patent-firm/Payments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<PaymentPortal />} />

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

            <Route path="marketing-agency/projects" element={<Projects />} />
            <Route path="marketing-agency/feedbacks" element={<Feedbacks />} />

            {/* Patent Firm Dashboard Routes */}
            <Route path="patent-firm/dashboard" element={<PatentFirmDashboard />} />
            <Route path="patent-firm/clients" element={<PatentFirmClients />} />
            <Route path="patent-firm/applications" element={<Applications />} />
            <Route path="patent-firm/applications/:id" element={<ApplicationDetail />} />
            <Route path="patent-firm/document-review" element={<DocumentReview />} />
            <Route path="patent-firm/payments" element={<PatentFirmPayments />} />

            {/* AI Analytics Routes */}
            <Route path="ai-analytics" element={<AIAnalyticsDashboard />} />
            <Route path="ai-analytics/upload" element={<UploadData />} />
            <Route path="ai-analytics/assistant" element={<AIAssistant />} />

            {/* Role placeholders */}
            <Route path="founder" element={<DashboardPlaceholder />} />
            <Route path="investor" element={<DashboardPlaceholder />} />
            <Route path="marketing" element={<DashboardPlaceholder />} />
            <Route path="advisor" element={<DashboardPlaceholder />} />
            <Route path="admin" element={<DashboardPlaceholder />} />
            <Route path="marketing-agency/projects" element={<MarketingAgencyProjects />} />
            <Route path="marketing-agency/feedbacks" element={<Feedbacks />} />
          </Route>

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

