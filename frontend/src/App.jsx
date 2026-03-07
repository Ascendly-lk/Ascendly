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

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
