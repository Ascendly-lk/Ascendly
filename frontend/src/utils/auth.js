/**
 * Auth utility — all API calls related to authentication.
 * Uses VITE_API_URL from .env (defaults to http://localhost:8000)
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const STORAGE_TOKEN_KEY = 'ascendly_token';
const STORAGE_USER_KEY = 'ascendly_user';

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
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

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
        // Forward the backend error message to the form
        throw new Error(body.detail || 'Registration failed. Please try again.');
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
    const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.detail || 'Login failed. Please check your credentials.');
    }

    saveSession(body.access_token, body.user);
    return body;
}

/**
 * Logout — clears localStorage session.
 */
export function logout() {
    clearSession();
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
    const roleRoutes = {
        'Startup Founder': '/dashboard/startup',
        'Investor': '/dashboard/investor',
        'Marketing Agency': '/dashboard/marketing-agency/projects',
        'Business Advisor': '/dashboard/advisor',
        'Admin': '/dashboard/admin',
    };
    return roleRoutes[role] || '/dashboard/startup';
}
