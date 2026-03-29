<<<<<<< HEAD
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
=======
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
>>>>>>> parent of ae17c912 (Update by deleting some files)

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPlaceholder from './pages/DashboardPlaceholder';
<<<<<<< HEAD
import Dashboard from './pages/BusinessAdvisory/Dashboard';
import Clients from './pages/BusinessAdvisory/Clients';
import Projects from './pages/BusinessAdvisory/Projects';
import MarketingAgencyProjects from './pages/marketing-agency/Projects';
import CalendarPage from './pages/BusinessAdvisory/Calendar';
import Payments from './pages/BusinessAdvisory/Payments';
import EditProfile from './pages/BusinessAdvisory/editProfile';
import Settings from './pages/BusinessAdvisory/Settings';
import NotificationsPage from './pages/BusinessAdvisory/Notifications';
import AccountPage from './pages/AccountPage';
import DashboardLayout from './pages/BusinessAdvisory/DashboardLayout';
=======
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
>>>>>>> parent of ae17c912 (Update by deleting some files)
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
<<<<<<< HEAD
import MarketingAgency from './pages/dashboard/MarketingAgency';
import DocumentReview from './pages/patent-firm/DocumentReview';
import PaymentPortal from './pages/PaymentPortal';

// Investor Network
import InvestorDashboard from './pages/InvestorNetwork/Dashboard';
import InvestorRequests from './pages/InvestorNetwork/Requests';
import InvestorStartups from './pages/InvestorNetwork/Startups';
import InvestorCalendar from './pages/InvestorNetwork/Calendar';
import InvestorPayments from './pages/InvestorNetwork/Payments';
import InvestorProjects from './pages/InvestorNetwork/Projects';
import InvestorProfile from './pages/InvestorNetwork/Profile';
import InvestorSettings from './pages/InvestorNetwork/Settings';

// Patent Firm
import PatentFirmDashboard from "./pages/patent-firm/Dashboard";
import PatentFirmClients from "./pages/patent-firm/Clients";
import Applications from "./pages/patent-firm/Applications";
import ApplicationDetail from "./pages/patent-firm/ApplicationDetail";
import PatentFirmPayments from "./pages/patent-firm/Payments";
=======
import DocumentReview from './pages/patent-firm/DocumentReview';

// Patent Firm
import PatentFirmDashboard from './pages/patent-firm/Dashboard';
import PatentFirmClients from './pages/patent-firm/Clients';
import Applications from './pages/patent-firm/Applications';
import ApplicationDetail from './pages/patent-firm/ApplicationDetail';
import PatentFirmPayments from './pages/patent-firm/Payments';
>>>>>>> parent of ae17c912 (Update by deleting some files)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<<<<<<< HEAD
          <Route path="/payment" element={<PaymentPortal />} />
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)

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
<<<<<<< HEAD
            <Route path="marketing-agency" element={<MarketingAgency />} />
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
            <Route path="clients" element={<Clients />} />
            <Route path="projects" element={<Projects />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="payments" element={<Payments />} />
            <Route path="profile" element={<DashboardPlaceholder />} />
            <Route path="help" element={<DashboardPlaceholder />} />

<<<<<<< HEAD
            {/* Patent Firm Dashboard Routes */}
            <Route
              path="patent-firm/dashboard"
              element={<PatentFirmDashboard />}
            />
            <Route path="patent-firm/clients" element={<PatentFirmClients />} />
            <Route path="patent-firm/applications" element={<Applications />} />
            <Route
              path="patent-firm/applications/:id"
              element={<ApplicationDetail />}
            />
            <Route
              path="patent-firm/document-review"
              element={<DocumentReview />}
            />
            <Route
              path="patent-firm/payments"
              element={<PatentFirmPayments />}
            />

            {/* AI Analytics Routes */}
            <Route path="ai-analytics" element={<AIAnalyticsDashboard />} />
            <Route path="ai-analytics/upload" element={<UploadData />} />
            <Route path="ai-analytics/assistant" element={<AIAssistant />} />

            {/* Investor Network Routes */}
            <Route path="investor" element={<InvestorDashboard />} />
            <Route path="investor/requests" element={<InvestorRequests />} />
            <Route path="investor/startups" element={<InvestorStartups />} />
            <Route path="investor/calendar" element={<InvestorCalendar />} />
            <Route path="investor/payments" element={<InvestorPayments />} />
            <Route path="investor/projects" element={<InvestorProjects />} />
            <Route path="investor/profile" element={<InvestorProfile />} />
            <Route path="investor/settings" element={<InvestorSettings />} />
            <Route path="investor/help" element={<DashboardPlaceholder />} />

            {/* Role placeholders */}
            <Route path="founder" element={<DashboardPlaceholder />} />
            <Route path="marketing" element={<DashboardPlaceholder />} />
            <Route path="advisor" element={<DashboardPlaceholder />} />
            <Route path="admin" element={<DashboardPlaceholder />} />
            <Route
              path="marketing-agency/projects"
              element={<MarketingAgencyProjects />}
            />
=======
            <Route path="marketing-agency/projects" element={<Projects />} />
            <Route path="marketing-agency/feedbacks" element={<Feedbacks />} />

            {/* Patent Firm Dashboard Routes */}
            <Route path="patent-firm/dashboard" element={<PatentFirmDashboard />} />
            <Route path="patent-firm/clients" element={<PatentFirmClients />} />
            <Route path="patent-firm/applications" element={<Applications />} />
            <Route path="patent-firm/applications/:id" element={<ApplicationDetail />} />
            <Route path="patent-firm/document-review" element={<DocumentReview />} />
            <Route path="patent-firm/payments" element={<PatentFirmPayments />} />

            {/* Role placeholders */}
            <Route path="founder" element={<DashboardPlaceholder />} />
            <Route path="investor" element={<DashboardPlaceholder />} />
            <Route path="marketing" element={<DashboardPlaceholder />} />
            <Route path="advisor" element={<DashboardPlaceholder />} />
            <Route path="admin" element={<DashboardPlaceholder />} />
            <Route path="marketing-agency/projects" element={<MarketingAgencyProjects />} />
>>>>>>> parent of ae17c912 (Update by deleting some files)
            <Route path="marketing-agency/feedbacks" element={<Feedbacks />} />
          </Route>

          <Route
<<<<<<< HEAD
=======
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
>>>>>>> parent of ae17c912 (Update by deleting some files)
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

<<<<<<< HEAD
          <Route path="/business-advisory" element={<Dashboard />} />
          <Route path="/business-advisory/clients" element={<Clients />} />
          <Route path="/business-advisory/projects" element={<Projects />} />
          <Route path="/business-advisory/calendar" element={<CalendarPage />} />
          <Route path="/business-advisory/payments" element={<Payments />} />
          <Route path="/business-advisory/settings" element={<Settings />} />
          <Route path="/business-advisory/notifications" element={<NotificationsPage />} />
          <Route path="/business-advisory/edit-profile" element={<EditProfile />} />

=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
<<<<<<< HEAD
=======

>>>>>>> parent of ae17c912 (Update by deleting some files)
