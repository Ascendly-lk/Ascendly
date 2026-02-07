import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import DashboardPlaceholder from './pages/DashboardPlaceholder';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route redirects to register */}
        <Route path="/" element={<Navigate to="/register" replace />} />

        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Role-based dashboard routes (placeholders) */}
        <Route path="/dashboard/founder" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/investor" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/marketing" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/advisor" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/admin" element={<DashboardPlaceholder />} />

        {/* Catch all - redirect to register */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
