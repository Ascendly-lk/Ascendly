import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps dashboard/authenticated routes.
 * - While session is being validated: shows a brief loading screen.
 * - If no valid user: redirects to /login.
 * - If authenticated: renders children.
 */
export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    // Allow an explicit, dev-only auth bypass controlled via env var.
    // In production builds, this will always be false.
    const shouldBypassAuth =
        typeof import.meta !== 'undefined' &&
        import.meta.env &&
        import.meta.env.DEV &&
        import.meta.env.VITE_BYPASS_AUTH === 'true';

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#0a0a0a',
                color: '#00FFEF',
                fontFamily: 'sans-serif',
                fontSize: '1rem',
            }}>
                Loading…
            </div>
        );
    }

    if (!user && !shouldBypassAuth) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
