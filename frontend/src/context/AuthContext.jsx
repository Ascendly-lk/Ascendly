import { createContext, useContext, useState, useEffect } from 'react';
import { fetchMe, getCurrentUser, clearSession } from '../utils/auth';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides user state.
 * On mount it tries to restore the session from a saved token.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // true while validating session

    useEffect(() => {
        // Try to restore session on initial app load
        async function restoreSession() {
            try {
                const me = await fetchMe();
                setUser(me || getCurrentUser());
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        restoreSession();
    }, []);

    function logoutUser() {
        clearSession();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

/** Hook to access auth context from any component */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
