/**
 * Patent Firm utility — all API calls related to the patent firm section.
 */
import { apiFetch } from '../api';

export async function fetchDashboardStats() {
    const response = await apiFetch('/api/patent-firm/dashboard/stats');
    if (!response.ok) throw new Error('Failed to fetch dashboard stats');
    return response.json();
}

export async function fetchRecentActivity() {
    const response = await apiFetch('/api/patent-firm/dashboard/activity');
    if (!response.ok) throw new Error('Failed to fetch recent activity');
    return response.json();
}

export async function fetchApplications(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const path = `/api/patent-firm/applications${params ? `?${params}` : ''}`;
    const response = await apiFetch(path);
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
}

export async function fetchApplicationById(id) {
    const response = await apiFetch(`/api/patent-firm/applications/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch application ${id}`);
    return response.json();
}

export async function fetchClients() {
    const response = await apiFetch('/api/patent-firm/clients');
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
}
