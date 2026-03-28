/**
 * Vitest global setup — runs before every test file.
 * - Extends expect with jest-dom matchers
 * - Starts the MSW mock server so no real HTTP calls are made
 */
import '@testing-library/jest-dom';
import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { server } from './mocks/server';

// Replace jsdom's localStorage with a fully-functional in-memory implementation.
// jsdom's Storage prototype can throw on .clear() in some vitest environments.
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() { return Object.keys(store).length; },
  };
};
vi.stubGlobal('localStorage', createLocalStorageMock());

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
