import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardPlaceholder from './pages/auth/DashboardPlaceholder';
import Dashboard from './pages/BusinessAdvisory/Dashboard';
import Clients from './pages/BusinessAdvisory/Clients';
import Projects from './pages/BusinessAdvisory/Projects';
import MarketingAgencyProjects from './pages/marketing-agency/Projects';
import CalendarPage from './pages/BusinessAdvisory/Calendar';
import EditProfile from './pages/BusinessAdvisory/editProfile';
import Settings from './components/dashboard/Settings';
import NotificationsPage from './pages/BusinessAdvisory/Notifications';
import AccountPage from './pages/auth/AccountPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DashboardLayout from './pages/BusinessAdvisory/DashboardLayout';
import StartupDashboard from './pages/dashboard/StartupDashboard';
import AIAnalyticsDashboard from './pages/aianalytics/AIAnalyticsDashboard';
import UploadData from './pages/aianalytics/UploadData';
import AIAssistant from './pages/aianalytics/AIAssistant';
import Feedbacks from './pages/marketing-agency/Feedbacks';
import PatentPage from './pages/dashboard/PatentPage';
import InvestorsPage from './pages/dashboard/InvestorsPage';
import TiersPage from './pages/dashboard/TiersPage';
import AdvisorsPage from './pages/dashboard/AdvisorsPage';
import MarketingAgency from './pages/dashboard/MarketingAgency';
import DocumentReview from './pages/patent-firm/DocumentReview';
import PaymentPortal from './pages/auth/PaymentPortal';

// Patent Firm
import PatentFirmDashboard from "./pages/patent-firm/Dashboard";
import PatentFirmClients from "./pages/patent-firm/Clients";
import Applications from "./pages/patent-firm/Applications";
import PatentFirmPayments from "./pages/patent-firm/Payments";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<PaymentPortal />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
            <Route path="patent" element={<PatentPage />} />
            <Route path="investors" element={<InvestorsPage />} />
            <Route path="tiers" element={<TiersPage />} />
            <Route path="advisors" element={<AdvisorsPage />} />
            <Route path="marketing-agency" element={<MarketingAgency />} />
            <Route path="clients" element={<Clients />} />
            <Route path="projects" element={<Projects />} />
            <Route path="calendar" element={<CalendarPage />} />

            <Route path="profile" element={<DashboardPlaceholder />} />
            <Route path="help" element={<DashboardPlaceholder />} />

            {/* Patent Firm Dashboard Routes */}
            <Route path="patent-firm/dashboard" element={<PatentFirmDashboard />} />
            <Route path="patent-firm/clients" element={<PatentFirmClients />} />
            <Route path="patent-firm/applications" element={<Applications />} />
            <Route path="patent-firm/document-review" element={<DocumentReview />} />
            <Route
              path="patent-firm/payments"
              element={<PatentFirmPayments />}
            />

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
            <Route
              path="marketing-agency/projects"
              element={<MarketingAgencyProjects />}
            />
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

          <Route path="/business-advisory" element={<Dashboard />} />
          <Route path="/business-advisory/clients" element={<Clients />} />
          <Route path="/business-advisory/projects" element={<Projects />} />
          <Route path="/business-advisory/calendar" element={<CalendarPage />} />

          <Route path="/business-advisory/settings" element={<Settings />} />
          <Route path="/business-advisory/notifications" element={<NotificationsPage />} />
          <Route path="/business-advisory/edit-profile" element={<EditProfile />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;