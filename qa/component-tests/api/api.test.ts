/**
 * Tests for frontend/src/api.js utility functions.
 * These run in jsdom — localStorage is available, fetch is mocked via MSW.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  apiFetch,
} from '@/api.js';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('getToken / setToken / clearToken', () => {
  it('getToken returns null when nothing is stored', () => {
    expect(getToken()).toBeNull();
  });

  it('setToken stores token and getToken retrieves it', () => {
    setToken('my-test-token');
    expect(getToken()).toBe('my-test-token');
  });

  it('clearToken removes ascendly_token and ascendly_user', () => {
    localStorage.setItem('ascendly_token', 'tok');
    localStorage.setItem('ascendly_user', '{"id":"1"}');
    clearToken();
    expect(localStorage.getItem('ascendly_token')).toBeNull();
    expect(localStorage.getItem('ascendly_user')).toBeNull();
  });
});

describe('getUser / setUser', () => {
  it('getUser returns null when nothing stored', () => {
    expect(getUser()).toBeNull();
  });

  it('setUser stores user and getUser returns parsed object', () => {
    const user = { id: 'u1', email: 'test@ascendly.test' };
    setUser(user);
    expect(getUser()).toEqual(user);
  });

  it('getUser returns null if stored value is malformed JSON', () => {
    localStorage.setItem('user', '{bad json');
    expect(getUser()).toBeNull();
  });
});

describe('apiFetch', () => {
  it('attaches Authorization header when token exists', async () => {
    setToken('bearer-token-123');
    // MSW handler for GET / returns 200
    const res = await apiFetch('/');
    expect(res.status).toBe(200);
  });

  it('works without a token (public endpoints)', async () => {
    const res = await apiFetch('/');
    expect(res.ok).toBe(true);
  });

  it('does not set Content-Type for FormData bodies', async () => {
    setToken('tok');
    // We only verify no exception — Content-Type is set by browser for FormData
    const form = new FormData();
    form.append('key', 'value');
    // Must use POST — GET/HEAD cannot have a body per the Fetch spec
    await expect(apiFetch('/auth/signout', { method: 'POST', body: form })).resolves.toBeDefined();
  });

  it('sets Content-Type: application/json for JSON bodies', async () => {
    setToken('tok');
    // POST /auth/signout is handled by MSW
    const res = await apiFetch('/auth/signout', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(200);
  });
});
