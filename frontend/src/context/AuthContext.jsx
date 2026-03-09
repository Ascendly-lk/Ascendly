import { createContext, useContext, useState, useEffect } from 'react';
import { fetchMe, getCurrentUser, clearSession, supabase, getToken } from '../utils/auth';

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
                // 1. Check for Supabase OAuth redirect session first
                if (supabase) {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) {
                        localStorage.setItem('ascendly_token', session.access_token);
                    }

                    // Listen to auth changes automatically (e.g. Google Popup / Redirect processing)
                    supabase.auth.onAuthStateChange(async (event, session) => {
                        if (event === 'SIGNED_IN' && session) {
                            localStorage.setItem('ascendly_token', session.access_token);
                            const updatedMe = await fetchMe();
                            if (updatedMe) setUser(updatedMe);
                        } else if (event === 'SIGNED_OUT') {
                            clearSession();
                            setUser(null);
                        }
                    });
                }

                // 2. Fetch the Ascendly profile from the backend
                const me = await fetchMe();
                setUser(me);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        restoreSession();
    }, []);

    async function logoutUser() {
        if (supabase) {
            await supabase.auth.signOut();
        }
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
