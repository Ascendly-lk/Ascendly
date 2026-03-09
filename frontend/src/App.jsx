import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPlaceholder from './pages/DashboardPlaceholder';

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

        {/* Role-based dashboard routes (placeholders) */}
        <Route path="/dashboard/founder" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/investor" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/marketing" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/advisor" element={<DashboardPlaceholder />} />
        <Route path="/dashboard/admin" element={<DashboardPlaceholder />} />

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
