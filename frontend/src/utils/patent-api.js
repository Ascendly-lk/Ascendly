/**
 * Patent Firm utility — all API calls related to the patent firm section.
 */
import { getToken } from './auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export async function fetchDashboardStats() {
    const response = await fetch(`${API_URL}/api/patent-firm/dashboard/stats`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
}

export async function fetchRecentActivity() {
    const response = await fetch(`${API_URL}/api/patent-firm/dashboard/activity`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch recent activity');
    return response.json();
}

export async function fetchApplications(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const url = `${API_URL}/api/patent-firm/applications${params ? `?${params}` : ''}`;
    const response = await fetch(url, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
}

export async function fetchClients() {
    const response = await fetch(`${API_URL}/api/patent-firm/clients`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
}
