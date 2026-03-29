import { apiFetch } from '../api';

export async function listConversations() {
    try {
        const res = await apiFetch('/api/conversations');
        if (!res.ok) return [];
        const data = await res.json();
        return data.conversations || [];
    } catch { return []; }
}

export async function createConversation(title = 'New Conversation', datasetId = null) {
    try {
        const res = await apiFetch('/api/conversations', {
            method: 'POST',
            body: JSON.stringify({ title, dataset_id: datasetId }),
        });
        if (!res.ok) return null;
        return res.json();
    } catch { return null; }
}

export async function getMessages(conversationId) {
    try {
        const res = await apiFetch(`/api/conversations/${conversationId}/messages`);
        if (!res.ok) return [];
        const data = await res.json();
        return data.messages || [];
    } catch { return []; }
}

export async function updateConversation(conversationId, updates) {
    try {
        const res = await apiFetch(`/api/conversations/${conversationId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
        return res.ok;
    } catch { return false; }
}

export async function deleteConversation(conversationId) {
    try {
        const res = await apiFetch(`/api/conversations/${conversationId}`, {
            method: 'DELETE',
        });
        return res.ok;
    } catch { return false; }
}
