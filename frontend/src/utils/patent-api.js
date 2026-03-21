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

export async function fetchUrgentActions() {
    const response = await apiFetch('/api/patent-firm/dashboard/urgent');
    if (!response.ok) throw new Error('Failed to fetch urgent actions');
    return response.json();
}

export async function fetchDashboardPipeline() {
    const response = await apiFetch('/api/patent-firm/dashboard/pipeline');
    if (!response.ok) throw new Error('Failed to fetch dashboard pipeline');
    return response.json();
}

export async function fetchActivities() {
    const response = await apiFetch('/api/patent-firm/activities');
    if (!response.ok) throw new Error('Failed to fetch activities');
    return response.json();
}

export async function fetchDocuments() {
    const response = await apiFetch('/api/patent-firm/documents');
    if (!response.ok) throw new Error('Failed to fetch documents');
    return response.json();
}

export async function fetchPayments() {
    const response = await apiFetch('/api/patent-firm/payments');
    if (!response.ok) throw new Error('Failed to fetch payments');
    return response.json();
}
