/**
 * Auth utility — all API calls related to authentication.
 * Uses VITE_API_URL from .env (defaults to http://localhost:8000)
 */

import { createClient } from '@supabase/supabase-js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client only if env vars are present (prevents crash if missing)
export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const STORAGE_TOKEN_KEY = 'ascendly_token';
const STORAGE_USER_KEY = 'ascendly_user';
<<<<<<< HEAD
<<<<<<< HEAD
const STORAGE_PLAN_KEY = 'ascendly_subscription_plan';
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)

// ─── Helpers ─────────────────────────────────────────────────────────────────

function saveSession(token, user) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
}

export function clearSession() {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
}

export function getToken() {
    return localStorage.getItem(STORAGE_TOKEN_KEY);
}

export function getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    try {
<<<<<<< HEAD
<<<<<<< HEAD
        if (!raw) return null;
        const user = JSON.parse(raw);
        user.plan = getSubscriptionPlan();
        return user;
=======
        return raw ? JSON.parse(raw) : null;
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
        return raw ? JSON.parse(raw) : null;
>>>>>>> parent of ae17c912 (Update by deleting some files)
    } catch {
        return null;
    }
}

<<<<<<< HEAD
<<<<<<< HEAD
export function saveSubscriptionPlan(plan) {
    localStorage.setItem(STORAGE_PLAN_KEY, plan);
}

export function getSubscriptionPlan() {
    return localStorage.getItem(STORAGE_PLAN_KEY) || 'Free';
}

=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ email, password, first_name, last_name, role }} data
 * @returns {{ id, email, message }}
 */
export async function register(data) {
    const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.detail || 'Registration failed. Please try again.');
    }

    return body;
}

/**
 * Complete profile for new Google OAuth users (role assignment).
 */
export async function completeProfile(data) {
    const token = getToken();
    if (!token) throw new Error('No active session found.');

    const response = await fetch(`${API_URL}/auth/profile/complete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.detail || 'Failed to complete profile. Please try again.');
    }

    return body;
}

/**
 * Login an existing user.
 * Saves token + user info to localStorage on success.
 * @param {{ email, password }} data
 * @returns {{ access_token, user }}
 */
export async function login(data) {
<<<<<<< HEAD
<<<<<<< HEAD
    let response;
    try {
        response = await fetch(`${API_URL}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    } catch (networkError) {
        console.error("Login fetch error:", networkError);
        throw new Error('Unable to connect to the server. Please ensure the backend is running.');
    }
=======
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
    const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
<<<<<<< HEAD
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)

    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.detail || 'Login failed. Please check your credentials.');
    }

    saveSession(body.access_token, body.user);
    return body;
}

/**
 * Logout — clears localStorage session & Supabase.
 */
export async function logout() {
    clearSession();
    if (supabase) {
        await supabase.auth.signOut();
    }
}

/**
 * Initiate Google OAuth Sign In.
 * Triggers standard Supabase Google Authentication flow.
 */
export async function signInWithGoogle() {
    if (!supabase) {
        throw new Error('Supabase configuration is missing. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/login' // Return to login to let AuthContext capture the session
        }
    });

    if (error) {
        throw new Error(error.message || 'Google Auth failed to start. Please try again.');
    }

    return data;
}

/**
 * Fetch the current user's profile from the backend using the stored token.
 * Used to restore session on page refresh.
 * Returns null if token is missing or expired.
 */
export async function fetchMe() {
    const token = getToken();
    if (!token) return null;

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            // Token is invalid/expired — clear stale session
            clearSession();
            return null;
        }

        const user = await response.json();
<<<<<<< HEAD
<<<<<<< HEAD
        // Merge locally stored plan info
        user.plan = getSubscriptionPlan();
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
        // Refresh stored user data with latest from server
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
        return user;
    } catch {
        return null;
    }
}

/**
 * Map role string to the correct dashboard route.
 */
export function getRoleDashboardRoute(role) {
<<<<<<< HEAD
<<<<<<< HEAD
    if (!role) return '/dashboard/startup';
    
    const r = role.toLowerCase();
    
    if (r.includes('startup') || r.includes('founder')) return '/dashboard/startup';
    if (r.includes('investor')) return '/dashboard/investor';
    if (r.includes('marketing') || r.includes('agency')) return '/dashboard/marketing-agency/projects';
    if (r.includes('patent')) return '/dashboard/patent-firm/dashboard';
    if (r.includes('business') || r.includes('advisor')) return '/dashboard/advisor';
    if (r.includes('admin')) return '/dashboard/admin';
    
    // Default fallback
    return '/dashboard/startup';
=======
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
    const roleRoutes = {
        'Startup Founder': '/dashboard/startup',
        'Investor': '/dashboard/investors',
        'Marketing Agency': '/dashboard/marketing-agency/projects',
        'Business Advisor': '/dashboard/advisors',
        'Patent Firm': '/dashboard/patent-firm/dashboard',
        'Admin': '/dashboard/admin',
    };
    return roleRoutes[role] || '/dashboard/startup';
<<<<<<< HEAD
>>>>>>> parent of ae17c912 (Update by deleting some files)
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
}
