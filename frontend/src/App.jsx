<<<<<<< HEAD
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPlaceholder from "./pages/DashboardPlaceholder";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import CalendarPage from "./pages/Calendar";
import Payments from "./pages/Payments";
import EditProfile from "./pages/editProfile";
import Settings from "./pages/Settings";
import NotificationsPage from "./pages/Notifications";
=======
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
>>>>>>> 7f8c4b245347b20810c0a506dd51c7bee84bd2d5

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

<<<<<<< HEAD
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Role-based dashboard routes */}
        <Route path="/dashboard/founder" element={<Dashboard />} />
        <Route path="/dashboard/investor" element={<Dashboard />} />
        <Route path="/dashboard/marketing" element={<Dashboard />} />
        <Route path="/dashboard/advisor" element={<Dashboard />} />
        <Route path="/dashboard/admin" element={<Dashboard />} />
        <Route path="/dashboard/ai-analytics" element={<Dashboard />} />
        <Route path="/dashboard/clients" element={<Clients />} />
        <Route path="/dashboard/projects" element={<Projects />} />
        <Route path="/dashboard/calendar" element={<CalendarPage />} />
        <Route path="/dashboard/payments" element={<Payments />} />
        <Route path="/dashboard/profile" element={<Dashboard />} />
        <Route path="/dashboard/help" element={<Dashboard />} />

        {/* Edit Profile page */}
        <Route path="/edit-profile" element={<EditProfile />} />

        {/* Settings page */}
        <Route path="/settings" element={<Settings />} />

        {/* Notifications page */}
        <Route path="/notifications" element={<NotificationsPage />} />
=======
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
>>>>>>> 7f8c4b245347b20810c0a506dd51c7bee84bd2d5

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
