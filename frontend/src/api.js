<<<<<<< HEAD
const API_BASE = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;
=======
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
>>>>>>> parent of ae17c912 (Update by deleting some files)

export function getToken() {
  return localStorage.getItem("ascendly_token");
}

export function setToken(token) {
  localStorage.setItem("ascendly_token", token);
}

export function clearToken() {
  localStorage.removeItem("ascendly_token");
  localStorage.removeItem("ascendly_user");
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function setUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Authenticated fetch wrapper.
 * Automatically attaches Bearer token and handles 401s.
 */
export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
<<<<<<< HEAD
  } else if (import.meta.env.DEV && import.meta.env.VITE_BYPASS_AUTH === 'true') {
    headers["Authorization"] = "Bearer BYPASS";
=======
>>>>>>> parent of ae17c912 (Update by deleting some files)
  }

  // Only set Content-Type for non-FormData bodies
  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return res;
}
